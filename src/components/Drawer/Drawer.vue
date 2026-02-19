<template>
  <teleport to="body">
    <transition name="wry-drawer-fade">
      <div
        v-if="modal && internalVisible"
        class="wry-drawer__mask"
        @click="handleMaskClick"
      ></div>
    </transition>
    
    <transition :name="`wry-drawer-${direction}`">
      <div
        v-if="shouldRenderDrawer"
        v-show="internalVisible"
        :class="[
          'wry-drawer',
          `wry-drawer--${direction}`,
          customClass
        ]"
        :style="drawerStyle"
        role="dialog"
        aria-modal="true"
        :aria-hidden="!internalVisible"
      >
        <!-- 头部 -->
        <header v-if="showHeader" class="wry-drawer__header">
          <slot name="header">
            <span class="wry-drawer__title">{{ title }}</span>
          </slot>
          <button
            v-if="showClose"
            class="wry-drawer__close"
            aria-label="关闭"
            @click="handleClose"
          >
            <span class="wry-drawer__close-icon">✕</span>
          </button>
        </header>

        <!-- 内容 -->
        <div class="wry-drawer__body">
          <slot></slot>
        </div>

        <!-- 底部 -->
        <footer v-if="$slots.footer" class="wry-drawer__footer">
          <slot name="footer"></slot>
        </footer>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import { computed, ref, watch, onBeforeUnmount } from 'vue'

/**
 * Drawer 抽屉组件
 * 参考 Element Plus Drawer 设计
 */

export interface DrawerProps {
  /** 是否显示 Drawer，支持 v-model */
  modelValue?: boolean
  /** Drawer 标题 */
  title?: string
  /** Drawer 打开方向 */
  direction?: 'rtl' | 'ltr' | 'ttb' | 'btt'
  /** Drawer 尺寸 */
  size?: string | number
  /** 是否显示遮罩层 */
  modal?: boolean
  /** 点击遮罩层是否关闭 */
  closeOnClickModal?: boolean
  /** 是否显示关闭按钮 */
  showClose?: boolean
  /** 关闭前的回调，返回 false 可阻止关闭 */
  beforeClose?: (done: () => void) => void
  /** 自定义类名 */
  customClass?: string
  /** 是否在关闭时销毁子元素 */
  destroyOnClose?: boolean
  /** 是否显示头部 */
  showHeader?: boolean
  /** 是否锁定 body 滚动 */
  lockScroll?: boolean
  /** 打开的延时，毫秒 */
  openDelay?: number
  /** 关闭的延时，毫秒 */
  closeDelay?: number
}

const props = withDefaults(defineProps<DrawerProps>(), {
  modelValue: false,
  title: '',
  direction: 'rtl',
  size: '30%',
  modal: true,
  closeOnClickModal: true,
  showClose: true,
  customClass: '',
  destroyOnClose: false,
  showHeader: true,
  lockScroll: true,
  openDelay: 0,
  closeDelay: 0
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  open: []
  opened: []
  close: []
  closed: []
}>()

// 内部可见状态
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
const internalVisible = ref(props.modelValue)
const shouldRenderDrawer = computed(() => (props.destroyOnClose ? internalVisible.value : true))
let openTimer: number | null = null
let closeTimer: number | null = null
//记录原始值
let bodyOriginalOverflow = ''
//当前页面滚动是否已经被锁住
let bodyOverflowLocked = false

// 计算抽屉样式
const drawerStyle = computed(() => {
  const size = typeof props.size === 'number' ? `${props.size}px` : props.size
  
  if (props.direction === 'rtl' || props.direction === 'ltr') {
    return { width: size }
  } else {
    return { height: size }
  }
})

const clearTimers = () => {
  if (openTimer) {
    clearTimeout(openTimer)
    openTimer = null
  }
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
}

//禁止页面滚动
const lockBodyScroll = () => {
  //已经锁过了
  if (bodyOverflowLocked || !props.lockScroll) return
  //记录原始 overflow
  bodyOriginalOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  //更新锁状态
  bodyOverflowLocked = true
}

//恢复原来的滚动状态
const unlockBodyScroll = () => {
  if (!bodyOverflowLocked || !props.lockScroll) return
  document.body.style.overflow = bodyOriginalOverflow
  bodyOverflowLocked = false
}

const doOpen = () => {
  lockBodyScroll()
  internalVisible.value = true
  emit('open')
  setTimeout(() => emit('opened'), 300)
}

const doClose = () => {
  emit('close')
  internalVisible.value = false
  unlockBodyScroll()
  setTimeout(() => emit('closed'), 300)
}

watch(
  () => props.modelValue,
  (val) => {
    clearTimers()
    if (val) {
      openTimer = window.setTimeout(doOpen, props.openDelay)
    } else {
      closeTimer = window.setTimeout(doClose, props.closeDelay)
    }
  },
  { immediate: true }
)

// 处理关闭
const handleClose = () => {
  if (props.beforeClose) {
    props.beforeClose(() => {
      visible.value = false
    })
  } else {
    visible.value = false
  }
}

// 处理遮罩点击
const handleMaskClick = () => {
  if (props.closeOnClickModal) {
    handleClose()
  }
}

onBeforeUnmount(() => {
  clearTimers()
  unlockBodyScroll()
})

// 暴露方法
defineExpose({
  /** 关闭抽屉 */
  close: handleClose
})
</script>

<style scoped>
@import './style.css';
</style>
