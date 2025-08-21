<template>
  <button
    :class="['button', typeClass]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>

import { defineProps, defineEmits, computed } from 'vue'

// 定义 props 类型
interface ButtonProps {
  type: string;
  disabled: boolean;
  onButtonClick?: () => void;  // 确保事件是一个函数
}

const props = defineProps<ButtonProps>()

// 定义 emit 事件
const emit = defineEmits<{
  (event: 'buttonClick'): void;
}>()

// 根据 props.type 动态绑定类名
const typeClass = computed(() => {
  return {
    'btn-primary': props.type === 'primary',
    'btn-secondary': props.type === 'secondary',
    'btn-disabled': props.disabled
  }
})

// 处理点击事件
const handleClick = (): void => {
  if (!props.disabled && typeof props.onButtonClick === 'function') {
    props.onButtonClick()  // 确保调用的函数类型正确
  }
  emit('buttonClick')  // 触发按钮点击事件
}
</script>

<style>
@import './style.css'
</style>
