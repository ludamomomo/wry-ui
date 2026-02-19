<template>
  <button
    :class="buttonClass"
    :disabled="disabled || loading"
    :type="nativeType"
    @click="handleClick"
    :autofocus="autofocus"
    :aria-disabled="disabled || loading"
    :aria-busy="loading"
    :tabindex="disabled ? -1 : 0"
  >
    <!-- 加载图标 -->
    <span v-if="loading" class="wry-button__loading">
      <slot name="loading">
        <span class="wry-button__loading-icon">⏳</span>
      </slot>
    </span>
    
    <!-- 图标 -->
    <span v-if="icon && !loading" class="wry-button__icon">
      <slot name="icon">{{ icon }}</slot>
    </span>
    
    <!-- 按钮内容 -->
    <span v-if="$slots.default" class="wry-button__text">
      <slot></slot>
    </span>
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

/**
 * Button 按钮组件
 * 参考 Element Plus Button 设计
 */

// 定义 props 类型
export interface ButtonProps {
  /** 按钮类型 */
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text' | 'default'
  /** 按钮尺寸 */
  size?: 'large' | 'default' | 'small'
  /** 是否为朴素按钮 */
  plain?: boolean
  /** 是否为圆角按钮 */
  round?: boolean
  /** 是否为圆形按钮 */
  circle?: boolean
  /** 是否为加载状态 */
  loading?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 图标 */
  icon?: string
  /** 原生 type 属性 */
  nativeType?: 'button' | 'submit' | 'reset'
  /** 是否为文字按钮（已废弃，使用 type="text" 代替） */
  text?: boolean
  /** 是否为链接按钮 */
  link?: boolean
  /** 自动获取焦点 */
  autofocus?: boolean
}

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'default',
  size: 'default',
  plain: false,
  round: false,
  circle: false,
  loading: false,
  disabled: false,
  nativeType: 'button',
  text: false,
  link: false,
  autofocus: false
})

// 定义 emit 事件
const emit = defineEmits<{
  click: [evt: MouseEvent]
}>()

// 动态计算按钮类名
const buttonClass = computed(() => {
  return [
    'wry-button',
    `wry-button--${props.type}`,
    `wry-button--size-${props.size}`,
    {
      'is-plain': props.plain,
      'is-round': props.round,
      'is-circle': props.circle,
      'is-loading': props.loading,
      'is-disabled': props.disabled || props.loading,
      'is-text': props.text || props.type === 'text',
      'is-link': props.link
    }
  ]
})

// 处理点击事件
const handleClick = (evt: MouseEvent): void => {
  if (props.disabled || props.loading) {
    evt.stopPropagation()
    return
  }
  emit('click', evt)
}

// 暴露方法供父组件调用
defineExpose({
  /** 按钮 ref */
  ref: null,
  /** 按钮尺寸 */
  size: computed(() => props.size),
  /** 按钮类型 */
  type: computed(() => props.type),
  /** 是否禁用 */
  disabled: computed(() => props.disabled || props.loading)
})
</script>

<style scoped>
@import './style.css';
</style>
