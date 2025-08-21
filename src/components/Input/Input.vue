<template>
  <div class="input-wrapper" :class="[`input-${size}`]">
    <!-- 普通输入框 -->
    <input
      v-if="type !== 'textarea'"
      :type="inputType"
      v-model="innerValue"
      :placeholder="placeholder"
      class="input-field"
    />

    <!-- 多行文本框 -->
    <textarea
      v-else
      v-model="innerValue"
      :placeholder="placeholder"
      class="textarea-field"
    ></textarea>

    <!-- 清空按钮 -->
    <button
      v-if="clearable && innerValue"
      class="btn-clear"
      @click="clearInput"
    >
      ✖
    </button>

    <!-- 密码切换按钮 -->
    <button
      v-if="showPasswordToggle && innerValue"
      class="btn-toggle"
      @click="togglePassword"
    >
      {{ inputType === 'password' ? '👁' : '🙈' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'

// 定义 props 类型 + 默认值
const props = withDefaults(
  defineProps<{
    modelValue?: string
    type?: 'text' | 'password' | 'textarea'
    size?: 'small' | 'medium' | 'large'
    placeholder?: string
    clearable?: boolean
    showPasswordToggle?: boolean
  }>(),
  {
    type: 'text',
    size: 'medium',
    placeholder: '请输入内容',
    clearable: true,
    showPasswordToggle: true,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// 内部输入值
const innerValue = ref(props.modelValue ?? '')

// 双向绑定
watch(innerValue, (val) => {
  emit('update:modelValue', val)
})

// 控制密码显示
const inputType = ref(props.type)
const togglePassword = (): void => {
  inputType.value =
    inputType.value === 'password' ? 'text' : 'password'
}

// 清空输入框
const clearInput = (): void => {
  innerValue.value = ''
}
</script>

<style scoped>
@import './style.css'
</style>
