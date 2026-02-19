<template>
  <div 
    ref="triggerRef"
    class="wry-tooltip"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <slot></slot>
    
    <teleport to="body">
      <transition :name="transition">
        <div
          v-if="shouldRenderPopper"
          v-show="isVisible"
          ref="popperRef"
          :class="[
            'wry-tooltip__popper',
            `wry-tooltip__popper--${effect}`,
            `is-${placement}`,
            popperClass
          ]"
          :style="popperStyle"
          role="tooltip"
          @mouseenter="handlePopperEnter"
          @mouseleave="handlePopperLeave"
        >
          <div class="wry-tooltip__content">
            <template v-if="rawContent">
              <div class="wry-tooltip__raw" v-html="content"></div>
            </template>
            <template v-else>
              <slot name="content">{{ content }}</slot>
            </template>
          </div>
          <div 
            v-if="showArrow"
            :class="['wry-tooltip__arrow', `wry-tooltip__arrow--${placement}`]"
            :style="arrowStyle"
          ></div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onBeforeUnmount, watch, computed } from 'vue'

/**
 * Tooltip 文字提示组件
 * 参考 Element Plus Tooltip 设计
 */

export interface TooltipProps {
  /** 显示的内容 */
  content?: string
  /** Tooltip 的位置 */
  placement?: 
    | 'top' | 'top-start' | 'top-end'
    | 'bottom' | 'bottom-start' | 'bottom-end'
    | 'left' | 'left-start' | 'left-end'
    | 'right' | 'right-start' | 'right-end'
  /** 触发方式 */
  trigger?: 'hover' | 'click' | 'focus' | 'manual'
  /** 是否禁用 */
  disabled?: boolean
  /** 延迟显示，毫秒 */
  showAfter?: number
  /** 延迟隐藏，毫秒 */
  hideAfter?: number
  /** 主题 */
  effect?: 'dark' | 'light'
  /** 偏移量 */
  offset?: number
  /** 是否显示箭头 */
  showArrow?: boolean
  /** Popper 的 z-index */
  popperClass?: string
  /** 是否将 popover 的 HTML 字符串插入 DOM */
  rawContent?: boolean
  /** 是否在关闭时持久化 */
  persistent?: boolean
  /** 手动控制显示状态 */
  visible?: boolean
  /** 过渡动画名称 */
  transition?: string
}

const props = withDefaults(defineProps<TooltipProps>(), {
  content: '',
  placement: 'top',
  trigger: 'hover',
  disabled: false,
  showAfter: 0,
  hideAfter: 200,
  effect: 'dark',
  offset: 12,
  showArrow: true,
  popperClass: '',
  rawContent: false,
  persistent: false,
  transition: 'wry-tooltip-fade'
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'before-show': []
  'show': []
  'before-hide': []
  'hide': []
}>()

const triggerRef = ref<HTMLElement>()
const popperRef = ref<HTMLElement>()
const isVisible = ref(props.visible ?? false)
const popperStyle = ref<Record<string, string>>({})
const arrowStyle = ref<Record<string, string>>({})
const shouldRenderPopper = computed(() => (props.persistent ? true : isVisible.value))
const isManual = computed(() => props.trigger === 'manual')

let showTimer: number | null = null
let hideTimer: number | null = null

// 计算 popper 位置
const updatePopper = async () => {
  if (!triggerRef.value || !isVisible.value) return

  await nextTick()

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const popperEl = popperRef.value
  if (!popperEl) return

  const popperRect = popperEl.getBoundingClientRect()
  const { offset, placement } = props

  let top = 0
  let left = 0
  const arrowPosition = {
    axis: 'x' as 'x' | 'y',
    value: '50%',
    transform: 'translateX(-50%)'
  }

  // 根据 placement 计算位置
  switch (placement) {
    case 'top':
      top = triggerRect.top - popperRect.height - offset
      left = triggerRect.left + triggerRect.width / 2 - popperRect.width / 2
      arrowPosition.axis = 'x'
      arrowPosition.value = '50%'
      arrowPosition.transform = 'translateX(-50%)'
      break
    case 'top-start':
      top = triggerRect.top - popperRect.height - offset
      left = triggerRect.left - 12
      arrowPosition.axis = 'x'
      arrowPosition.value = '16px'
      arrowPosition.transform = 'translateX(0)'
      break
    case 'top-end':
      top = triggerRect.top - popperRect.height - offset
      left = triggerRect.right - popperRect.width + 12
      arrowPosition.axis = 'x'
      arrowPosition.value = 'calc(100% - 16px)'
      arrowPosition.transform = 'translateX(-100%)'
      break
    case 'bottom':
      top = triggerRect.bottom + offset
      left = triggerRect.left + triggerRect.width / 2 - popperRect.width / 2
      arrowPosition.axis = 'x'
      arrowPosition.value = '50%'
      arrowPosition.transform = 'translateX(-50%)'
      break
    case 'bottom-start':
      top = triggerRect.bottom + offset
      left = triggerRect.left - 12
      arrowPosition.axis = 'x'
      arrowPosition.value = '16px'
      arrowPosition.transform = 'translateX(0)'
      break
    case 'bottom-end':
      top = triggerRect.bottom + offset
      left = triggerRect.right - popperRect.width + 12
      arrowPosition.axis = 'x'
      arrowPosition.value = 'calc(100% - 16px)'
      arrowPosition.transform = 'translateX(-100%)'
      break
    case 'left':
      top = triggerRect.top + triggerRect.height / 2 - popperRect.height / 2
      left = triggerRect.left - popperRect.width - offset
      arrowPosition.axis = 'y'
      arrowPosition.value = '50%'
      arrowPosition.transform = 'translateY(-50%)'
      break
    case 'left-start':
      top = triggerRect.top - 12
      left = triggerRect.left - popperRect.width - offset
      arrowPosition.axis = 'y'
      arrowPosition.value = '16px'
      arrowPosition.transform = 'translateY(0)'
      break
    case 'left-end':
      top = triggerRect.bottom - popperRect.height + 12
      left = triggerRect.left - popperRect.width - offset
      arrowPosition.axis = 'y'
      arrowPosition.value = 'calc(100% - 16px)'
      arrowPosition.transform = 'translateY(-100%)'
      break
    case 'right':
      top = triggerRect.top + triggerRect.height / 2 - popperRect.height / 2
      left = triggerRect.right + offset
      arrowPosition.axis = 'y'
      arrowPosition.value = '50%'
      arrowPosition.transform = 'translateY(-50%)'
      break
    case 'right-start':
      top = triggerRect.top - 12
      left = triggerRect.right + offset
      arrowPosition.axis = 'y'
      arrowPosition.value = '16px'
      arrowPosition.transform = 'translateY(0)'
      break
    case 'right-end':
      top = triggerRect.bottom - popperRect.height + 12
      left = triggerRect.right + offset
      arrowPosition.axis = 'y'
      arrowPosition.value = 'calc(100% - 16px)'
      arrowPosition.transform = 'translateY(-100%)'
      break
  }

  // 边界检测
  const padding = 5
  if (left < padding) left = padding
  if (left + popperRect.width > window.innerWidth - padding) {
    left = window.innerWidth - popperRect.width - padding
  }
  if (top < padding) top = padding
  if (top + popperRect.height > window.innerHeight - padding) {
    top = window.innerHeight - popperRect.height - padding
  }

  popperStyle.value = {
    top: `${top + window.scrollY}px`,
    left: `${left + window.scrollX}px`,
    zIndex: '2000'
  }

  // 箭头位置
  if (arrowPosition.axis === 'y') {
    arrowStyle.value = {
      top: arrowPosition.value,
      transform: arrowPosition.transform
    }
  } else {
    arrowStyle.value = {
      left: arrowPosition.value,
      transform: arrowPosition.transform
    }
  }
}

// 显示
const show = () => {
  if (props.disabled) return
  
  cancelHide()

  if (props.showAfter === 0) {
    doShow()
  } else {
    showTimer = window.setTimeout(doShow, props.showAfter)
  }
}

const doShow = () => {
  emit('before-show')
  isVisible.value = true
  emit('update:visible', true)
  nextTick(() => {
    updatePopper()
    emit('show')
  })
}

// 隐藏
const hide = () => {
  cancelShow()

  if (props.hideAfter === 0) {
    doHide()
  } else {
    hideTimer = window.setTimeout(doHide, props.hideAfter)
  }
}

const doHide = () => {
  emit('before-hide')
  isVisible.value = false
  emit('update:visible', false)
  emit('hide')
}

// 事件处理
const handleMouseEnter = () => {
  if (isManual.value) return
  if (props.trigger === 'hover') show()
}

const handleMouseLeave = () => {
  if (isManual.value) return
  if (props.trigger === 'hover') hide()
}

const handleClick = () => {
  if (isManual.value) return
  if (props.trigger === 'click') {
    isVisible.value ? hide() : show()
  }
}

const handleFocus = () => {
  if (isManual.value) return
  if (props.trigger === 'focus') show()
}

const handleBlur = () => {
  if (isManual.value) return
  if (props.trigger === 'focus') hide()
}

const cancelShow = () => {
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = null
  }
}

const cancelHide = () => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

const handlePopperEnter = () => {
  if (props.trigger !== 'hover' || isManual.value) return
  cancelHide()
}

const handlePopperLeave = () => {
  if (props.trigger !== 'hover' || isManual.value) return
  hide()
}

watch(
  () => props.visible,
  (val) => {
    if (val === undefined) return
    if (val) {
      cancelHide()
      isVisible.value = true
      nextTick(() => updatePopper())
    } else {
      cancelShow()
      isVisible.value = false
    }
  }
)

// 监听滚动和窗口大小变化
const handleScroll = () => {
  if (isVisible.value) updatePopper()
}

const handleResize = () => {
  if (isVisible.value) updatePopper()
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, true)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll, true)
  window.removeEventListener('resize', handleResize)
  if (showTimer) clearTimeout(showTimer)
  if (hideTimer) clearTimeout(hideTimer)
})

// 暴露方法
defineExpose({
  show,
  hide,
  updatePopper
})
</script>

<style scoped>
@import './style.css';
</style>
