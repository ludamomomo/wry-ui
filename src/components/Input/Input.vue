<template>
  <div
    :class="[
      'wry-input',
      `wry-input--${size}`,
      {
        'is-disabled': disabled,
        'is-focus': isFocused,
        'is-clearable': clearable,
        'wry-input-group': $slots.prepend || $slots.append,
        'wry-input--prefix': $slots.prefix || prefixIcon,
        'wry-input--suffix': $slots.suffix || suffixIcon || clearable || showPassword
      }
    ]"
  >
    <!-- 前置内容 -->
    <div v-if="$slots.prepend" class="wry-input-group__prepend">
      <slot name="prepend"></slot>
    </div>

    <div class="wry-input__wrapper">
      <!-- 前置图标 -->
      <span v-if="$slots.prefix || prefixIcon" class="wry-input__prefix">
        <slot name="prefix">
          <span v-if="prefixIcon" class="wry-input__icon">{{ prefixIcon }}</span>
        </slot>
      </span>

      <!-- 输入框 -->
      <input
        v-if="type !== 'textarea'"
        ref="inputRef"
        class="wry-input__inner"
        :type="showPasswordVisible ? 'text' : type"
        :name="name"
        :disabled="disabled"
        :readonly="readonly"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :minlength="minlength"
        :autocomplete="autocomplete"
        :aria-label="label || placeholder"
        :aria-disabled="disabled"
        :aria-readonly="readonly"
        v-model="innerValue"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.enter="handleKeydown"
      />

      <!-- 文本域 -->
      <textarea
        v-else
        ref="textareaRef"
        class="wry-textarea__inner"
        :name="name"
        :disabled="disabled"
        :readonly="readonly"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :minlength="minlength"
        :rows="rows"
        :autocomplete="autocomplete"
        :aria-label="label || placeholder"
        :aria-disabled="disabled"
        :aria-readonly="readonly"
        :style="textareaStyle"
        v-model="innerValue"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      ></textarea>

      <!-- 后置图标区域 -->
      <span v-if="$slots.suffix || suffixIcon || showClear || showPwdVisible" class="wry-input__suffix">
        <slot name="suffix">
          <!-- 清除按钮 -->
          <span
            v-if="showClear"
            class="wry-input__icon wry-input__clear"
            @mousedown.prevent
            @click="handleClear"
          >
            ✕
          </span>
          
          <!-- 密码可见按钮 -->
          <span
            v-else-if="showPwdVisible"
            class="wry-input__icon wry-input__password"
            @click="handlePasswordVisible"
          >
            {{ showPasswordVisible ? '👁' : '🙈' }}
          </span>
          
          <!-- 后置图标 -->
          <span v-else-if="suffixIcon" class="wry-input__icon">{{ suffixIcon }}</span>
        </slot>
      </span>

      <!-- 字数统计 -->
      <span v-if="showWordLimit && maxlength" class="wry-input__count">
        <span class="wry-input__count-inner">
          {{ textLength }} / {{ maxlength }}
        </span>
      </span>
    </div>

    <!-- 后置内容 -->
    <div v-if="$slots.append" class="wry-input-group__append">
      <slot name="append"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick, shallowRef } from 'vue'

/**
 * Input 输入框组件
 * 参考 Element Plus Input 设计
 */

export interface InputProps {
  /** 绑定值 */
  modelValue?: string | number
  /** 输入框类型 */
  type?: 'text' | 'password' | 'textarea' | 'number' | 'email' | 'url' | 'tel' | 'date' | 'time' | 'datetime-local' | 'month' | 'week'
  /** 输入框尺寸 */
  size?: 'large' | 'default' | 'small'
  /** 占位文本 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 是否可清空 */
  clearable?: boolean
  /** 是否显示密码切换按钮 */
  showPassword?: boolean
  /** 最大输入长度 */
  maxlength?: number
  /** 最小输入长度 */
  minlength?: number
  /** 是否显示字数统计 */
  showWordLimit?: boolean
  /** 前置图标 */
  prefixIcon?: string
  /** 后置图标 */
  suffixIcon?: string
  /** 文本域行数 */
  rows?: number
  /** 自适应内容高度（仅 textarea） */
  autosize?: boolean | { minRows?: number; maxRows?: number }
  /** 自动补全 */
  autocomplete?: string
  /** 原生 name 属性 */
  name?: string
  /** 输入框头部内容（仅 input） */
  label?: string
  /** 输入时是否触发表单验证 */
  validateEvent?: boolean
}

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  size: 'default',
  placeholder: '请输入内容',
  disabled: false,
  readonly: false,
  clearable: false,
  showPassword: false,
  showWordLimit: false,
  rows: 2,
  autosize: false,
  autocomplete: 'off',
  validateEvent: true
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  input: [value: string | number]
  change: [value: string | number]
  focus: [evt: FocusEvent]
  blur: [evt: FocusEvent]
  clear: []
  keydown: [evt: KeyboardEvent]
}>()

// Refs
const inputRef = shallowRef<HTMLInputElement>()
const textareaRef = shallowRef<HTMLTextAreaElement>()

// 内部值
const innerValue = ref(props.modelValue ?? '')
const showPasswordVisible = ref(false)
const isFocused = ref(false)

// 双向绑定 - 监听内部值变化
watch(innerValue, (val) => {
  emit('update:modelValue', val)
})

// 监听外部值变化
watch(() => props.modelValue, (val) => {
  if (val !== innerValue.value) {
    innerValue.value = val ?? ''
  }
  if (props.type === 'textarea' && props.autosize) {
    nextTick(() => resizeTextarea())
  }
})

// 计算属性
const textLength = computed(() => String(innerValue.value).length)

const showClear = computed(() => {
  return props.clearable && !props.disabled && !props.readonly && innerValue.value && isFocused.value
})

const showPwdVisible = computed(() => {
  return props.showPassword && !props.disabled && !props.readonly && innerValue.value && props.type === 'password'
})

const textareaStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.autosize && typeof props.autosize === 'object') {
    const { minRows, maxRows } = props.autosize
    if (minRows) style.minHeight = `${minRows * 1.5}em`
    if (maxRows) style.maxHeight = `${maxRows * 1.5}em`
  }
  return style
})

// 方法
const handleInput = (evt: Event) => {
  const target = evt.target as HTMLInputElement | HTMLTextAreaElement
  innerValue.value = target.value
  emit('input', innerValue.value)
  
  if (props.type === 'textarea' && props.autosize) {
    nextTick(() => resizeTextarea())
  }
}

const handleChange = (evt: Event) => {
  emit('change', innerValue.value)
}

const handleFocus = (evt: FocusEvent) => {
  isFocused.value = true
  emit('focus', evt)
}

const handleBlur = (evt: FocusEvent) => {
  isFocused.value = false
  emit('blur', evt)
}

const handleClear = () => {
  innerValue.value = ''
  emit('update:modelValue', '')
  emit('input', '')
  emit('change', '')
  emit('clear')
  focus()
}

const handlePasswordVisible = () => {
  showPasswordVisible.value = !showPasswordVisible.value
  focus()
}

const handleKeydown = (evt: KeyboardEvent) => {
  emit('keydown', evt)
}

// 自动调整 textarea 高度
const resizeTextarea = () => {
  if (!textareaRef.value) return
  
  const textarea = textareaRef.value
  textarea.style.height = 'auto'
  textarea.style.height = `${textarea.scrollHeight}px`
}

// 暴露方法
const focus = () => {
  nextTick(() => {
    inputRef.value?.focus()
    textareaRef.value?.focus()
  })
}

const blur = () => {
  inputRef.value?.blur()
  textareaRef.value?.blur()
}

const select = () => {
  inputRef.value?.select()
  textareaRef.value?.select()
}

defineExpose({
  /** 输入框 ref */
  input: inputRef,
  /** 文本域 ref */
  textarea: textareaRef,
  /** 获取焦点 */
  focus,
  /** 失去焦点 */
  blur,
  /** 选中文本 */
  select,
  /** 文本长度 */
  textLength
})
</script>

<style scoped>
@import './style.css';
</style>
