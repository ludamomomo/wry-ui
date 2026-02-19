<script setup lang="ts">
import { ref, provide, computed, watch } from 'vue'
import TreeNode from './TreeNode.vue'

/**
 * Tree 树形控件组件
 * 参考 Element Plus Tree 设计
 */

export interface TreeNodeData {
  id: string | number
  label: string
  children?: TreeNodeData[]
  disabled?: boolean
  isLeaf?: boolean
  [key: string]: unknown
}

export interface TreeProps {
  /** 树形数据 */
  data: TreeNodeData[]
  /** 是否显示复选框 */
  showCheckbox?: boolean
  /** 默认展开的节点 key 数组 */
  defaultExpandedKeys?: (string | number)[]
  /** 默认选中的节点 key 数组 */
  defaultCheckedKeys?: (string | number)[]
  /** 是否默认展开所有节点 */
  defaultExpandAll?: boolean
  /** 节点的唯一标识字段名 */
  nodeKey?: string
  /** 是否高亮当前选中节点 */
  highlightCurrent?: boolean
  /** 是否展开时只展开当前节点的子节点 */
  accordion?: boolean
  /** 相邻级节点间的水平缩进，单位为像素 */
  indent?: number
  /** 自定义节点字段 */
  fields?: {
    label?: string
    children?: string
    disabled?: string
  }
}

const props = withDefaults(defineProps<TreeProps>(), {
  data: () => [],
  showCheckbox: false,
  defaultExpandedKeys: () => [],
  defaultCheckedKeys: () => [],
  defaultExpandAll: false,
  nodeKey: 'id',
  highlightCurrent: true,
  accordion: false,
  indent: 20,
  fields: () => ({
    label: 'label',
    children: 'children',
    disabled: 'disabled'
  })
})

const emit = defineEmits<{
  'node-click': [node: TreeNodeData, event: MouseEvent]
  'node-expand': [node: TreeNodeData]
  'node-collapse': [node: TreeNodeData]
  'check-change': [node: TreeNodeData, checked: boolean]
  'check': [checkedNodes: TreeNodeData[], checkedKeys: (string | number)[]]
}>()

// 展开的节点
const expanded = ref<Set<string | number>>(
  new Set(props.defaultExpandAll ? getAllNodeKeys(props.data) : props.defaultExpandedKeys)
)

// 选中的节点（单选）
const currentKey = ref<string | number>()

// 勾选的节点（多选）
const checked = ref<Set<string | number>>(new Set(props.defaultCheckedKeys))

const fieldKeys = computed(() => ({
  label: props.fields?.label || 'label',
  children: props.fields?.children || 'children',
  disabled: props.fields?.disabled || 'disabled'
}))

const getNodeId = (node: TreeNodeData) => {
  const key = props.nodeKey || 'id'
  return (node as Record<string, any>)[key] ?? node.id
}

const getNodeChildren = (node: TreeNodeData): TreeNodeData[] => {
  const childrenKey = fieldKeys.value.children
  const children = (node as Record<string, any>)[childrenKey]
  return Array.isArray(children) ? children : []
}

const getNodeLabel = (node: TreeNodeData): string => {
  const labelKey = fieldKeys.value.label
  const label = (node as Record<string, any>)[labelKey]
  return typeof label === 'string' ? label : String(label ?? '')
}

const isNodeDisabled = (node: TreeNodeData): boolean => {
  const disabledKey = fieldKeys.value.disabled
  return Boolean((node as Record<string, any>)[disabledKey])
}

// 获取所有节点的 key
function getAllNodeKeys(nodes: TreeNodeData[]): (string | number)[] {
  const keys: (string | number)[] = []
  const traverse = (nodes: TreeNodeData[]) => {
    nodes.forEach(node => {
      keys.push(getNodeId(node))
      //递归
      const children = getNodeChildren(node)
      if (children.length) {
        traverse(children)
      }
    })
  }
  traverse(nodes)
  return keys
}

// 获取节点
function getNode(key: string | number, nodes: TreeNodeData[] = props.data): TreeNodeData | null {
  for (const node of nodes) {
    if (getNodeId(node) === key) return node
    const children = getNodeChildren(node)
    if (children.length) {
      //递归
      const found = getNode(key, children)
      if (found) return found
    }
  }
  return null
}

// 切换展开/折叠
const toggleExpand = (key: string | number) => {
  const node = getNode(key)
  if (!node || isNodeDisabled(node)) return

  if (expanded.value.has(key)) {
    expanded.value.delete(key)
    if (node) emit('node-collapse', node)
  } else {
    if (props.accordion) {
      // 手风琴模式：折叠同级其他节点
      const parentKeys = getParentKeys(key)
      expanded.value.forEach(k => {
        const kParentKeys = getParentKeys(k)
        if (parentKeys.length === kParentKeys.length) {
          expanded.value.delete(k)
        }
      })
    }
    expanded.value.add(key)
    if (node) emit('node-expand', node)
  }
}

// 获取父节点路径
function getParentKeys(key: string | number, nodes: TreeNodeData[] = props.data, parents: (string | number)[] = []): (string | number)[] {
  for (const node of nodes) {
    if (getNodeId(node) === key) return parents
    const children = getNodeChildren(node)
    if (children.length) {
      //递归
      const result = getParentKeys(key, children, [...parents, getNodeId(node)])
      if (result.length > 0 || result.length === parents.length + 1) return result
    }
  }
  return []
}

// 切换选中
const toggleCheck = (key: string | number) => {
  const node = getNode(key)
  if (!node || isNodeDisabled(node)) return

  if (checked.value.has(key)) {
    checked.value.delete(key)
    emit('check-change', node, false)
  } else {
    checked.value.add(key)
    emit('check-change', node, true)
  }

  // 发送 check 事件
  const checkedNodes = Array.from(checked.value)
    .map(k => getNode(k))
    .filter(Boolean) as TreeNodeData[]
  emit('check', checkedNodes, Array.from(checked.value))
}

// 设置当前选中节点
const setCurrentKey = (key: string | number) => {
  currentKey.value = key
  const node = getNode(key)
  if (node) emit('node-click', node, new MouseEvent('click'))
}

// 节点点击处理
const handleNodeClick = (key: string | number, event: MouseEvent) => {
  const node = getNode(key)
  if (!node || isNodeDisabled(node)) return

  if (props.highlightCurrent) {
    currentKey.value = key
  }

  emit('node-click', node, event)
}

// 提供给子组件
provide('treeProps', props)
provide('expanded', expanded)
provide('checked', checked)
provide('currentKey', currentKey)
provide('toggleExpand', toggleExpand)
provide('toggleCheck', toggleCheck)
provide('handleNodeClick', handleNodeClick)
provide('resolveNodeId', getNodeId)
provide('resolveNodeLabel', getNodeLabel)
provide('resolveNodeChildren', getNodeChildren)
provide('resolveNodeDisabled', isNodeDisabled)

// 暴露方法
defineExpose({
  /** 获取选中的节点 */
  getCheckedNodes: () => {
    return Array.from(checked.value)
      .map(k => getNode(k))
      .filter(Boolean) as TreeNodeData[]
  },
  /** 获取选中的节点 key */
  getCheckedKeys: () => Array.from(checked.value),
  /** 设置选中的节点 */
  setCheckedKeys: (keys: (string | number)[]) => {
    checked.value = new Set(keys)
  },
  /** 设置当前选中的节点 */
  setCurrentKey,
  /** 获取当前选中的节点 key */
  getCurrentKey: () => currentKey.value,
  /** 获取当前选中的节点 */
  getCurrentNode: () => currentKey.value ? getNode(currentKey.value) : null,
  /** 展开节点 */
  expandNode: (key: string | number) => {
    expanded.value.add(key)
  },
  /** 折叠节点 */
  collapseNode: (key: string | number) => {
    expanded.value.delete(key)
  },
  /** 展开所有节点 */
  expandAll: () => {
    expanded.value = new Set(getAllNodeKeys(props.data))
  },
  /** 折叠所有节点 */
  collapseAll: () => {
    expanded.value.clear()
  }
})
</script>

<template>
  <div class="wry-tree">
    <TreeNode v-for="item in data" :key="getNodeId(item)" :node="item" :level="0">
      <template #default="scope">
        <slot :node="scope.node">
          {{ getNodeLabel(scope.node) }}
        </slot>
      </template>
    </TreeNode>
  </div>
</template>

<style scoped>
@import './style.css';
</style>
