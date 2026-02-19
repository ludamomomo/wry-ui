<template>
  <teleport to="body">
    <transition name="wry-dialog-fade">
      <div
        v-if="modal && internalVisible"
        class="wry-dialog__mask"
        @click="handleMaskClick"
      ></div>
    </transition>

    <transition name="wry-dialog-zoom">
      <div
        v-if="internalVisible"
        class="wry-dialog__wrapper"
      >
        <div
          :class="['wry-dialog', customClass]"
          :style="dialogStyle"
          role="dialog"
          aria-modal="true"
        >
          <!-- 头部 -->
          <header class="wry-dialog__header">
            <slot name="header">
              <span class="wry-dialog__title">{{ title }}</span>
            </slot>
            <button
              v-if="showClose"
              class="wry-dialog__close"
              aria-label="关闭"
              @click="handleClose"
            >
              <span class="wry-dialog__close-icon">✕</span>
            </button>
          </header>

          <!-- 内容 -->
          <div class="wry-dialog__body">
            <slot></slot>
          </div>

          <!-- 底部 -->
          <footer v-if="$slots.footer" class="wry-dialog__footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import { computed, ref, watch, onBeforeUnmount } from 'vue'

/**
 * Dialog 对话框组件
 * 参考 Element Plus Dialog 设计
 */

export interface DialogProps {
  /** 是否显示 Dialog，支持 v-model */
  modelValue?: boolean
  /** Dialog 标题 */
  title?: string
  /** Dialog 宽度 */
  width?: string | number
  /** 是否显示遮罩层 */
  modal?: boolean
  /** 点击遮罩层是否关闭 */
  closeOnClickModal?: boolean
  /** 是否显示关闭按钮 */
  showClose?: boolean
  /** 关闭前的回调，调用 done 关闭 */
  beforeClose?: (done: () => void) => void
  /** 自定义类名 */
  customClass?: string
  /** 是否锁定 body 滚动 */
  lockScroll?: boolean
}

const props = withDefaults(defineProps<DialogProps>(), {
  modelValue: false,
  title: '',
  width: '500px',
  modal: true,
  closeOnClickModal: true,
  showClose: true,
  customClass: '',
  lockScroll: true
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

// 记录原始值
let bodyOriginalOverflow = ''
let bodyOverflowLocked = false

// 计算对话框样式
const dialogStyle = computed(() => {
  const width = typeof props.width === 'number' ? `${props.width}px` : props.width
  return { width }
})

// 禁止页面滚动
const lockBodyScroll = () => {
  if (bodyOverflowLocked || !props.lockScroll) return
  bodyOriginalOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  bodyOverflowLocked = true
}

// 恢复原来的滚动状态
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
    if (val) {
      doOpen()
    } else {
      doClose()
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
  unlockBodyScroll()
})

// 暴露方法
defineExpose({
  close: handleClose
})
</script>

<style scoped>
@import './style.css';
</style>
