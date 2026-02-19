<template>
  <div 
    ref="dropdownRef"
    class="wry-dropdown"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 触发器 -->
    <div 
      class="wry-dropdown__trigger"
      :class="{ 'is-split': splitButton }"
      @contextmenu.prevent="handleContextMenu"
    >
      <slot name="trigger">
        <template v-if="splitButton">
          <div class="wry-dropdown__split-wrapper">
            <button
              type="button"
              :class="[
                'wry-dropdown__button',
                `wry-dropdown__button--${size}`,
                `wry-dropdown__button--type-${buttonType}`,
                'is-main'
              ]"
              @click="handleMainClick"
              :disabled="disabled"
            >
              {{ title }}
            </button>
            <button
              type="button"
              :class="[
                'wry-dropdown__button',
                `wry-dropdown__button--${size}`,
                `wry-dropdown__button--type-${buttonType}`,
                'is-arrow'
              ]"
              @click.stop="toggleDropdown"
              :disabled="disabled"
            >
              <span :class="['wry-dropdown__icon', { 'is-rotate': visible }]">▼</span>
            </button>
          </div>
        </template>
        <button
          v-else
          type="button"
          :class="[
            'wry-dropdown__button',
            `wry-dropdown__button--${size}`,
            `wry-dropdown__button--type-${buttonType}`
          ]"
          @click="handleTriggerClick"
          :disabled="disabled"
        >
          {{ title }}
          <span :class="['wry-dropdown__icon', { 'is-rotate': visible }]">
            ▼
          </span>
        </button>
      </slot>
    </div>

    <!-- 下拉菜单 -->
    <teleport to="body">
      <transition name="wry-dropdown-fade">
        <div
          v-if="visible"
          ref="popperRef"
          :class="['wry-dropdown__popper', popperClass]"
          :style="popperStyle"
          @mouseenter="handlePopperEnter"
          @mouseleave="handlePopperLeave"
        >
          <ul class="wry-dropdown__menu">
            <li
              v-for="(item, index) in items"
              :key="index"
        :class="[
          'wry-dropdown__item',
          {
            'is-disabled': item.disabled,
            'is-divided': item.divided
          }
        ]"
              @click="handleItemClick(item, index)"
            >
              <span v-if="item.icon" class="wry-dropdown__item-icon">{{ item.icon }}</span>
              <span class="wry-dropdown__item-text">{{ item.label }}</span>
            </li>
          </ul>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'

/**
 * Dropdown 下拉菜单组件
 * 参考 Element Plus Dropdown 设计
 */

export interface DropdownItem {
  /** 菜单项文本 */
  label: string
  /** 菜单项值/命令 */
  command?: string | number
  /** 菜单项图标 */
  icon?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示分隔线 */
  divided?: boolean
}

export interface DropdownProps {
  /** 菜单项列表 */
  items?: DropdownItem[]
  /** 按钮文字（无触发器插槽时使用） */
  title?: string
  /** 触发方式 */
  trigger?: 'hover' | 'click' | 'contextmenu'
  /** 菜单弹出位置 */
  placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end'
  /** 是否禁用 */
  disabled?: boolean
  /** 菜单尺寸 */
  size?: 'large' | 'default' | 'small'
  /** 按钮组模式 */
  splitButton?: boolean
  /** 下拉框类名 */
  popperClass?: string
  /** 显示超时时间 */
  showTimeout?: number
  /** 隐藏超时时间 */
  hideTimeout?: number
  /** 点击菜单项后是否隐藏菜单 */
  hideOnClick?: boolean
  /** tabindex */
  tabindex?: number
  /** 触发按钮类型 */
  buttonType?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

const props = withDefaults(defineProps<DropdownProps>(), {
  items: () => [],
  title: 'Dropdown',
  trigger: 'hover',
  placement: 'bottom-start',
  disabled: false,
  size: 'default',
  splitButton: false,
  popperClass: '',
  showTimeout: 150,
  hideTimeout: 150,
  hideOnClick: true,
  tabindex: 0,
  buttonType: 'default'
})

const emit = defineEmits<{
  command: [command: string | number | undefined, item: DropdownItem]
  'visible-change': [visible: boolean]
  click: [evt: MouseEvent]
}>()

const dropdownRef = ref<HTMLElement>()
const popperRef = ref<HTMLElement>()
const visible = ref(false)
const popperStyle = ref<Record<string, string>>({})

let showTimer: number | null = null
let hideTimer: number | null = null

// 更新下拉菜单位置
const updatePopper = async () => {
  if (!dropdownRef.value || !visible.value) return
  //等待完成本轮 DOM 更新
  await nextTick()

  const triggerRect = dropdownRef.value.getBoundingClientRect()
  const popperEl = popperRef.value
  if (!popperEl) return

  const popperRect = popperEl.getBoundingClientRect()
  const { placement } = props

  let top = 0
  let left = 0

  // 根据 placement 计算位置
  switch (placement) {
    case 'top':
      top = triggerRect.top - popperRect.height - 12
      left = triggerRect.left + triggerRect.width / 2 - popperRect.width / 2
      break
    case 'top-start':
      top = triggerRect.top - popperRect.height - 12
      left = triggerRect.left
      break
    case 'top-end':
      top = triggerRect.top - popperRect.height - 12
      left = triggerRect.right - popperRect.width
      break
    case 'bottom':
      top = triggerRect.bottom + 12
      left = triggerRect.left + triggerRect.width / 2 - popperRect.width / 2
      break
    case 'bottom-start':
      top = triggerRect.bottom + 12
      left = triggerRect.left
      break
    case 'bottom-end':
      top = triggerRect.bottom + 12
      left = triggerRect.right - popperRect.width
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
}

// 显示下拉菜单
const clearShowTimer = () => {
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = null
  }
}

const clearHideTimer = () => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

const show = () => {
  if (props.disabled) return

  clearHideTimer()

  if (props.showTimeout === 0) {
    doShow()
  } else {
    showTimer = window.setTimeout(doShow, props.showTimeout)
  }
}

const doShow = () => {
  visible.value = true
  emit('visible-change', true)
  nextTick(() => updatePopper())
}

// 隐藏下拉菜单
const hide = () => {
  clearShowTimer()

  if (props.hideTimeout === 0) {
    doHide()
  } else {
    hideTimer = window.setTimeout(doHide, props.hideTimeout)
  }
}

const doHide = () => {
  visible.value = false
  emit('visible-change', false)
}

// 事件处理
const handleMouseEnter = () => {
  if (props.disabled) return
  if (props.trigger === 'hover') show()
}

const handleMouseLeave = () => {
  if (props.disabled) return
  if (props.trigger === 'hover') hide()
}

const toggleDropdown = () => {
  if (props.disabled) return
  visible.value ? hide() : show()
}

const handleTriggerClick = (evt: MouseEvent) => {
  emit('click', evt)
  if (props.trigger === 'click') {
    toggleDropdown()
  }
}

const handleContextMenu = (evt: MouseEvent) => {
  if (props.trigger !== 'contextmenu' || props.disabled) return
  evt.preventDefault()
  show()
}

const handleMainClick = (evt: MouseEvent) => {
  emit('click', evt)
}

const handleItemClick = (item: DropdownItem, index: number) => {
  if (item.disabled) return

  if (item.command !== undefined) {
    emit('command', item.command, item)
  } else {
    emit('command', undefined, item)
  }

  if (props.hideOnClick) {
    hide()
  }
}

const handlePopperEnter = () => {
  if (props.trigger !== 'hover') return
  clearHideTimer()
}

const handlePopperLeave = () => {
  if (props.trigger !== 'hover') return
  hide()
}

// 点击外部关闭
const handleClickOutside = (evt: MouseEvent) => {
  if (!visible.value) return

  const target = evt.target as Node
  if (
    dropdownRef.value?.contains(target) ||
    popperRef.value?.contains(target)
  ) {
    return
  }

  hide()
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', updatePopper, true)
  window.addEventListener('resize', updatePopper)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', updatePopper, true)
  window.removeEventListener('resize', updatePopper)
  if (showTimer) clearTimeout(showTimer)
  if (hideTimer) clearTimeout(hideTimer)
})

// 暴露方法
defineExpose({
  show,
  hide,
  visible
})
</script>

<style scoped>
@import './style.css';
</style>
