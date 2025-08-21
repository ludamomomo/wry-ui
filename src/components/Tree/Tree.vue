<script setup lang="ts">
import { ref, provide } from 'vue'
import TreeNode from './TreeNode.vue'

interface TreeNodeData {
  id: string
  label: string
  children?: TreeNodeData[]
}

const props = defineProps<{ data: TreeNodeData[] }>()

// 用 Set 存储展开状态
const expanded = ref<Set<string>>(new Set())

// 提供给子组件使用
provide('expanded', expanded)

const toggleExpand = (key: string) => {
  if (expanded.value.has(key)) {
    // 重新赋值，保证响应式
    expanded.value = new Set([...expanded.value].filter(k => k !== key))
  } else {
    expanded.value = new Set([...expanded.value, key])
  }
}

const handleClick = (event: MouseEvent) => {
  let target = event.target as HTMLElement | null
  while (target && !target.classList.contains('tree')) {
    if (target.classList.contains('toggle')) {
      const key = target.dataset.key as string
      toggleExpand(key)
      return
    }
    if (target.classList.contains('label')) {
      const key = target.dataset.key as string
      console.log('Selected node:', key)
      return
    }
    target = target.parentElement
  }
}
</script>

<template>
  <div class="tree" @click="handleClick">
    <TreeNode
      v-for="item in props.data"
      :key="item.id"
      :node="item"
      :level="0"
    />
  </div>
</template>

<style>
@import './style.css'
</style>
