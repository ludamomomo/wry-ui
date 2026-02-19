<script setup lang="ts">
import { inject, computed, type Ref, ref } from 'vue'
import type { TreeNodeData, TreeProps } from './Tree.vue'

defineOptions({
  name: 'TreeNode'
})

const props = defineProps<{
  node: TreeNodeData
  level: number
}>()

// 注入父组件提供的数据和方法
const treeProps = inject<TreeProps>('treeProps', {} as TreeProps)
const expanded = inject<Ref<Set<string | number>>>('expanded', ref(new Set()))
const checked = inject<Ref<Set<string | number>>>('checked', ref(new Set()))
const currentKey = inject<Ref<string | number | undefined>>('currentKey', ref())
const toggleExpand = inject<(key: string | number) => void>('toggleExpand', () => {})
const toggleCheck = inject<(key: string | number) => void>('toggleCheck', () => {})
const handleNodeClick = inject<(key: string | number, event: MouseEvent) => void>('handleNodeClick', () => {})
const resolveNodeId = inject<(node: TreeNodeData) => string | number>('resolveNodeId', (node) => node.id)
const resolveNodeLabel = inject<(node: TreeNodeData) => string>('resolveNodeLabel', (node) => node.label as string)
const resolveNodeChildren = inject<(node: TreeNodeData) => TreeNodeData[]>('resolveNodeChildren', (node) => node.children || [])
const resolveNodeDisabled = inject<(node: TreeNodeData) => boolean>('resolveNodeDisabled', (node) => Boolean(node.disabled))

const nodeId = computed(() => resolveNodeId(props.node))
const nodeLabel = computed(() => resolveNodeLabel(props.node))
const nodeChildren = computed(() => resolveNodeChildren(props.node))
const nodeDisabled = computed(() => resolveNodeDisabled(props.node))
const isExpanded = computed(() => expanded.value.has(nodeId.value))
const isChecked = computed(() => checked.value.has(nodeId.value))
const isCurrent = computed(() => currentKey.value === nodeId.value)
const hasChildren = computed(() => nodeChildren.value.length > 0)
const indent = computed(() => props.level * (treeProps.indent || 20))

// 点击展开/折叠按钮
const handleExpandClick = (event: MouseEvent) => {
  event.stopPropagation()
  if (hasChildren.value) {
    toggleExpand(nodeId.value)
  }
}

// 点击复选框
const handleCheckClick = (event: MouseEvent) => {
  event.stopPropagation()
  if (!nodeDisabled.value) {
    toggleCheck(nodeId.value)
  }
}

// 点击节点
const handleClick = (event: MouseEvent) => {
  if (!nodeDisabled.value) {
    handleNodeClick(nodeId.value, event)
  }
}
</script>

<template>
  <div 
    :class="[
      'wry-tree-node',
      {
        'is-expanded': isExpanded,
        'is-current': isCurrent,
        'is-disabled': nodeDisabled
      }
    ]"
  >
    <div 
      class="wry-tree-node__content"
      :style="{ paddingLeft: `${indent}px` }"
      @click="handleClick"
    >
      <!-- 展开/折叠图标 -->
      <span
        :class="[
          'wry-tree-node__expand-icon',
          {
            'is-leaf': !hasChildren,
            'is-expanded': isExpanded
          }
        ]"
        @click="handleExpandClick"
      >
        <span v-if="hasChildren">▶</span>
        <span v-else class="wry-tree-node__placeholder"></span>
      </span>

      <!-- 复选框 -->
      <input
        v-if="treeProps.showCheckbox"
        type="checkbox"
        class="wry-tree-node__checkbox"
        :checked="isChecked"
        :disabled="nodeDisabled"
        @click="handleCheckClick"
      />

      <!-- 节点标签 -->
      <span class="wry-tree-node__label">
        <slot :node="node">
          {{ nodeLabel }}
        </slot>
      </span>
    </div>

    <!-- 子节点 -->
    <transition name="wry-tree-node-expand">
      <div v-if="isExpanded && hasChildren" class="wry-tree-node__children">
        <TreeNode
          v-for="child in nodeChildren"
          :key="resolveNodeId(child)"
          :node="child"
          :level="level + 1"
        >
          <template #default="scope">
            <slot :node="scope.node">
              {{ resolveNodeLabel(scope.node) }}
            </slot>
          </template>
        </TreeNode>
      </div>
    </transition>
  </div>
</template>

<style scoped>
@import './style.css';
</style>
