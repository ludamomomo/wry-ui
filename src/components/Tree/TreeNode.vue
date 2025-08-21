<script setup lang="ts">
import { inject, computed, type Ref, ref } from 'vue'

defineOptions({
  name: 'TreeNode'
})

interface TreeNodeData {
  id: string
  label: string
  children?: TreeNodeData[]
}

const props = defineProps<{
  node: TreeNodeData
  level: number
}>()

const expanded = inject<Ref<Set<string>>>('expanded', ref(new Set<string>()))

const isExpanded = computed(() => expanded.value.has(props.node.id))
const hasChildren = computed(() => props.node.children && props.node.children.length > 0)
</script>

<template>
  <div class="tree-node">
    <div :style="{ paddingLeft: `${level * 20}px` }">
      <span
        v-if="hasChildren"
        class="toggle"
        :data-key="node.id"
        style="cursor: pointer; margin-right: 4px;"
      >
        {{ isExpanded ? '▼' : '▶' }}
      </span>
      <span v-else style="display: inline-block; width: 16px; margin-right: 4px;"></span>
      <span
        class="label"
        :data-key="node.id"
        style="cursor: pointer;"
      >
        {{ node.label }}
      </span>
    </div>
    <div v-if="isExpanded && hasChildren">
      <TreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :level="level + 1"
      />
    </div>
  </div>
</template>

<style>
@import './style.css'
</style>
