<template></template>

<script setup lang="ts">
import { h, render, VNode } from 'vue'

/**
 * Message 消息提示组件
 * 参考 Element Plus Message 设计
 * 用法: import { useMessage } from './Message.vue'
 */

let seed = 0
const GAP = 16 // 消息之间的间距

interface MessageInstance {
  id: string
  vnode: VNode
  container: HTMLElement
  timer?: number
  visible: boolean
  height: number
  top: number
  offset: number
}

const instances: MessageInstance[] = []

export interface MessageOptions {
  /** 消息文字 */
  message: string | VNode
  /** 消息类型 */
  type?: 'success' | 'warning' | 'info' | 'error'
  /** 显示时间，毫秒。设为 0 则不会自动关闭 */
  duration?: number
  /** 是否显示关闭按钮 */
  showClose?: boolean
  /** 距离顶部的偏移量 */
  offset?: number
  /** 关闭时的回调函数 */
  onClose?: () => void
  /** 自定义类名 */
  customClass?: string
  /** 是否将 message 属性作为 HTML 片段处理（不推荐，有 XSS 风险） */
  dangerouslyUseHTMLString?: boolean
  /** 是否居中显示 */
  center?: boolean
  /** 合并相同内容的消息，不重复显示 */
  grouping?: boolean
  /** 消息的唯一标识（用于分组） */
  id?: string
}

export interface MessageHandle {
  /** 关闭当前消息 */
  close: () => void
}

/**
 * 显示消息提示
 */
function useMessage(options: MessageOptions | string): MessageHandle {
  // 支持字符串快捷方式
  const opts: MessageOptions = typeof options === 'string' 
    ? { message: options } 
    : options

  const {
    message,
    type = 'info',
    duration = 3000,
    showClose = true,
    offset = 20,
    onClose,
    customClass = '',
    center = false,
    grouping = false,
    dangerouslyUseHTMLString = false,
    id: customId
  } = opts

  const shouldGroup = grouping === true
  if (shouldGroup && instances.some(inst => {
    //这次新传进来的消息内容
    const msgContent = typeof message === 'string' ? message : ''
    //已有消息 DOM 的文本内容
    const instContent = inst.vnode.el?.textContent || ''
    return instContent.includes(msgContent) && inst.visible
  })) {
    // 如果已存在相同消息，重置其定时器
    const existingInstance = instances.find(inst => {
      const msgContent = typeof message === 'string' ? message : ''
      const instContent = inst.vnode.el?.textContent || ''
      return instContent.includes(msgContent) && inst.visible
    })
    if (existingInstance && existingInstance.timer) {
      // 找到已存在的消息，重置定时器而不是创建新实例
      clearTimeout(existingInstance.timer)
      if (duration > 0) {
        existingInstance.timer = window.setTimeout(() => {
          const idx = instances.findIndex(i => i.id === existingInstance.id)
          if (idx !== -1) {
            instances.splice(idx, 1)
            render(null, existingInstance.container)
            document.body.removeChild(existingInstance.container)
          }
        }, duration)
      }
    }
    return { close: () => {} }
  }

  const id = customId || `message_${seed++}`
  const container = document.createElement('div')
  document.body.appendChild(container)

  const verticalOffset = getVerticalOffset(offset)

  let instance: MessageInstance | null = null

  const close = () => {
    const idx = instances.findIndex(inst => inst.id === id)
    if (idx === -1) return

    instances.splice(idx, 1)

    if (instance?.timer) {
      clearTimeout(instance.timer)
    }

    onClose?.()

    const el = container.firstElementChild as HTMLElement | null
    if (el) {
      el.style.opacity = '0'
      el.style.transform = 'translateX(-50%) translateY(-16px)'
    }

    const cleanup = () => {
      render(null, container)
      if (container.parentNode) {
        container.parentNode.removeChild(container)
      }
      updatePositions(idx)
    }

    if (el) {
      setTimeout(cleanup, 240)
    } else {
      cleanup()
    }
  }

  // 创建消息节点
  const vnode = h(
    {
      name: 'WryMessage',
      setup() {
        return () => {
          const iconMap = {
            success: '✓',
            warning: '⚠',
            error: '✕',
            info: 'ℹ'
          }

          const contentNode = createContentNode()

          return h(
            'div',
            {
              class: [
                'wry-message',
                `wry-message--${type}`,
                center && 'is-center',
                customClass
              ],
              style: {
                top: `${verticalOffset}px`,
                zIndex: 9999 + instances.length
              },
              role: 'alert'
            },
            [
              h('span', { class: 'wry-message__icon', 'aria-hidden': 'true' }, iconMap[type]),
              contentNode,
              (showClose || duration === 0) && h(
                'button',
                {
                  class: 'wry-message__close',
                  onClick: (e: Event) => {
                    e.stopPropagation()
                    close()
                  },
                  'aria-label': '关闭'
                },
                '✕'
              )
            ]
          )

          function createContentNode() {
            if (dangerouslyUseHTMLString && typeof message === 'string') {
              return h('p', {
                class: 'wry-message__content',
                innerHTML: message
              })
            }

            if (typeof message === 'string') {
              return h('p', { class: 'wry-message__content' }, message)
            }

            return h('div', { class: 'wry-message__content' }, [message])
          }
        }
      }
    }
  )

  // 渲染节点
  render(vnode, container)

  // 获取元素高度
  const el = container.firstElementChild as HTMLElement
  const height = el?.offsetHeight || 40

  instance = {
    id,
    vnode,
    container,
    visible: true,
    height,
    top: verticalOffset,
    offset,
  }

  instances.push(instance)

  // 更新所有消息位置
  function updatePositions(startIdx: number) {
    if (startIdx >= instances.length) return
    for (let i = startIdx; i < instances.length; i++) {
      const prev = instances[i - 1]
      const baseOffset = instances[i].offset
      const targetTop = prev ? prev.top + prev.height + GAP : baseOffset
      instances[i].top = targetTop
      const el = instances[i].container.firstElementChild as HTMLElement | null
      if (el) {
        el.style.top = `${targetTop}px`
      }
    }
  }
  //管理多个实例对象不重叠
  function getVerticalOffset(offsetVal: number): number {
    if (instances.length === 0) return offsetVal
    const last = instances[instances.length - 1]
    return last.top + last.height + GAP // 上一个的top + 高度 + 间距
  }

  // 设置自动关闭定时器
  if (duration > 0) {
    instance.timer = window.setTimeout(() => {
      close()
    }, duration)
  }

  return { close }
}

// 便捷方法
useMessage.success = (options: MessageOptions | string) => {
  const opts = typeof options === 'string' ? { message: options } : options
  return useMessage({ ...opts, type: 'success' })
}

useMessage.warning = (options: MessageOptions | string) => {
  const opts = typeof options === 'string' ? { message: options } : options
  return useMessage({ ...opts, type: 'warning' })
}

useMessage.info = (options: MessageOptions | string) => {
  const opts = typeof options === 'string' ? { message: options } : options
  return useMessage({ ...opts, type: 'info' })
}

useMessage.error = (options: MessageOptions | string) => {
  const opts = typeof options === 'string' ? { message: options } : options
  return useMessage({ ...opts, type: 'error' })
}

// 关闭所有消息
useMessage.closeAll = () => {
  instances.forEach(instance => {
    render(null, instance.container)
    document.body.removeChild(instance.container)
  })
  instances.length = 0
}

defineExpose({
  useMessage
})
</script>

<style>
@import './style.css';
</style>
