<template>
  <div :class="collapseClass">
    <div
      v-for="(item, index) in items"
      :key="item.name || index"
      class="wry-collapse-item"
    >
      <!-- 折叠面板头部 -->
      <div
        :class="[
          'wry-collapse-item__header',
          {
            'is-active': isActive(item.name || index),
            'is-disabled': item.disabled,
            'is-icon-left': iconPosition === 'left'
          }
        ]"
        role="button"
        :aria-expanded="isActive(item.name || index)"
        :tabindex="item.disabled ? -1 : 0"
        @click="handleHeaderClick(item.name || index, item.disabled)"
        @keydown.enter.prevent="handleHeaderClick(item.name || index, item.disabled)"
      >
        <span
          :class="[
            'wry-collapse-item__arrow',
            {
              'is-active': isActive(item.name || index),
              'is-left': iconPosition === 'left'
            }
          ]"
        >
          <slot name="arrow" :item="item" :active="isActive(item.name || index)">
            {{ expandIcon }}
          </slot>
        </span>
        <slot :name="`title-${item.name || index}`" :item="item">
          <span class="wry-collapse-item__title">{{ item.title }}</span>
        </slot>
      </div>

      <!-- 折叠面板内容 -->
      <transition name="wry-collapse-transition">
        <div
          v-show="isActive(item.name || index)"
          class="wry-collapse-item__wrap"
        >
          <div class="wry-collapse-item__content">
            <slot :name="`content-${item.name || index}`" :item="item">
              {{ item.content }}
            </slot>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'

/**
 * Collapse 折叠面板组件
 * 参考 Element Plus Collapse 设计
 */

export interface CollapseItem {
  /** 唯一标识符 */
  name?: string | number
  /** 面板标题 */
  title: string
  /** 面板内容 */
  content?: string
  /** 是否禁用 */
  disabled?: boolean
}

export interface CollapseProps {
  /** 折叠面板数据 */
  items: CollapseItem[]
  /** 当前激活的面板（v-model） */
  modelValue?: (string | number)[] | string | number
  /** 是否手风琴模式（一次只能展开一个） */
  accordion?: boolean
  /** 是否显示边框 */
  border?: boolean
  /** 箭头位置 */
  iconPosition?: 'left' | 'right'
  /** 自定义箭头图标 */
  expandIcon?: string
}

const props = withDefaults(defineProps<CollapseProps>(), {
  items: () => [],
  modelValue: () => [],
  accordion: false,
  border: true,
  iconPosition: 'right',
  expandIcon: '▶'
})

const emit = defineEmits<{
  'update:modelValue': [value: (string | number)[] | string | number]
  'change': [value: (string | number)[] | string | number]
}>()

const collapseClass = computed(() => [
  'wry-collapse',
  { 'is-borderless': !props.border }
])
const iconPosition = computed(() => props.iconPosition)
const expandIcon = computed(() => props.expandIcon)

// 内部激活状态
const activeNames = ref<(string | number)[]>(
  Array.isArray(props.modelValue)
    ? [...props.modelValue]
    //第二层判断
    : props.modelValue !== undefined && props.modelValue !== null
    ? [props.modelValue]
    : []
)

// 监听外部值变化
watch(
  () => props.modelValue,
  (val) => {
    activeNames.value = Array.isArray(val)
      ? [...val]
      : val !== undefined && val !== null
      ? [val]
      : []
  }
)

// 判断是否激活
const isActive = (name: string | number): boolean => {
  return activeNames.value.includes(name)
}

// 处理头部点击
const handleHeaderClick = (name: string | number, disabled?: boolean) => {
  if (disabled) return
  //存储点击后新的展开面板的列表
  let newActiveNames: (string | number)[]

  if (props.accordion) {
    // 手风琴模式：只能展开一个
    newActiveNames = isActive(name) ? [] : [name]
  } else {
    // 普通模式：可以展开多个
    if (isActive(name)) {
      //收起
      newActiveNames = activeNames.value.filter((item) => item !== name)
    } else {
      //展开
      newActiveNames = [...activeNames.value, name]
    }
  }
  //更新界面
  activeNames.value = newActiveNames

  const emitValue = props.accordion
    ? newActiveNames[0] ?? null
    : newActiveNames

  emit('update:modelValue', emitValue as any)
  emit('change', emitValue as any)
}

// 暴露方法
defineExpose({
  activeNames
})
</script>

<style scoped>
@import './style.css';
</style>
