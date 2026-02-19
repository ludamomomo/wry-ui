<template>
  <div :class="tabsClass">
    <!-- 标签页头部 -->
    <div :class="['wry-tabs__header', `is-${tabPosition}`]">
      <div
        ref="navRef"
        class="wry-tabs__nav"
        role="tablist"
        :aria-orientation="isVertical ? 'vertical' : 'horizontal'"
      >
        <div
          v-for="(pane, index) in panes"
          :key="getPaneKey(pane, index)"
          :class="[
            'wry-tabs__item',
            {
              'is-active': activeTab === getPaneKey(pane, index),
              'is-disabled': pane.disabled,
              'is-closable': isPaneClosable(pane)
            }
          ]"
          :tabindex="pane.disabled ? -1 : 0"
          role="tab"
          :aria-selected="activeTab === getPaneKey(pane, index)"
          @click="handleTabClick(getPaneKey(pane, index), pane.disabled)"
          @keydown.enter.prevent="handleTabClick(getPaneKey(pane, index), pane.disabled)"
        >
          <span class="wry-tabs__item-label">
            <span v-if="pane.icon" class="wry-tabs__item-icon">{{ pane.icon }}</span>
            {{ pane.label }}
          </span>
          <span
            v-if="isPaneClosable(pane)"
            class="wry-tabs__item-close"
            @click.stop="handleTabRemove(getPaneKey(pane, index))"
          >
            ✕
          </span>
        </div>
        <button
          v-if="addable || editable"
          type="button"
          class="wry-tabs__add-btn"
          @click="handleTabAdd"
          aria-label="新增标签"
        >
          +
        </button>
      </div>
      
      <!-- 活动指示器（仅 line 类型） -->
      <div
        v-if="type === 'line'"
        class="wry-tabs__active-bar"
        :style="barStyle"
      ></div>
    </div>

    <!-- 标签页内容 -->
    <div class="wry-tabs__content">
      <template v-for="(pane, index) in panes" :key="`pane-${getPaneKey(pane, index)}`">
        <div
          v-if="shouldRenderPane(pane, index)"
          v-show="activeTab === getPaneKey(pane, index)"
          class="wry-tabs__pane"
        >
          <slot :name="`pane-${getPaneKey(pane, index)}`">
            {{ pane.content }}
          </slot>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

/**
 * Tabs 标签页组件
 * 参考 Element Plus Tabs 设计
 */

export interface TabPane {
  /** 标签页的唯一标识 */
  name?: string | number
  /** 标签页显示的标题 */
  label: string
  /** 标签页的内容 */
  content?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否可关闭 */
  closable?: boolean
  /** 图标 */
  icon?: string
  /** 是否懒加载 */
  lazy?: boolean
}

export interface TabsProps {
  /** 标签页数据 */
  panes: TabPane[]
  /** 当前激活的标签页（v-model） */
  modelValue?: string | number
  /** 标签页类型 */
  type?: 'line' | 'card' | 'border-card'
  /** 标签页是否可关闭 */
  closable?: boolean
  /** 标签页位置 */
  tabPosition?: 'top' | 'right' | 'bottom' | 'left'
  /** 标签页是否可添加 */
  addable?: boolean
  /** 标签页是否可编辑（可添加和关闭） */
  editable?: boolean
}

const props = withDefaults(defineProps<TabsProps>(), {
  panes: () => [],
  type: 'line',
  closable: false,
  tabPosition: 'top',
  addable: false,
  editable: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'tab-click': [pane: TabPane, event: MouseEvent]
  'tab-change': [name: string | number]
  'tab-remove': [name: string | number]
  'tab-add': []
}>()

const navRef = ref<HTMLElement>()
const activeTab = ref<string | number>(
  props.modelValue ?? (props.panes[0]?.name ?? 0)
)
const barStyle = ref<Record<string, string>>({})
const renderedTabs = ref(new Set<string | number>([activeTab.value]))
const tabsClass = computed(() => [
  'wry-tabs',
  `wry-tabs--${props.type}`,
  `wry-tabs--${props.tabPosition}`
])
const isVertical = computed(() => props.tabPosition === 'left' || props.tabPosition === 'right')

// 监听外部值变化
watch(() => props.modelValue, (val) => {
  if (val !== undefined && val !== activeTab.value) {
    activeTab.value = val
    updateBar()
  }
})

watch(
  () => props.panes,
  (panes) => {
    const exists = panes.some((pane, index) => getPaneKey(pane, index) === activeTab.value)
    if (!exists && panes.length) {
      activeTab.value = getPaneKey(panes[0], 0)
    }
    nextTick(() => updateBar())
  },
  { deep: true }
)

// 监听 activeTab 变化
watch(activeTab, (val) => {
  emit('update:modelValue', val)
  emit('tab-change', val)
  renderedTabs.value.add(val)
  nextTick(() => updateBar())
})

// 更新活动指示器位置
const updateBar = () => {
  if (props.type !== 'line' || !navRef.value) return

  const tabs = navRef.value.querySelectorAll('.wry-tabs__item')
  const activeIndex = props.panes.findIndex(
    (pane, index) => getPaneKey(pane, index) === activeTab.value
  )

  if (activeIndex >= 0 && tabs[activeIndex]) {
    const activeTabEl = tabs[activeIndex] as HTMLElement
    barStyle.value = {
      width: `${activeTabEl.offsetWidth}px`,
      transform: `translateX(${activeTabEl.offsetLeft}px)`,
      transition: 'transform 0.3s, width 0.3s'
    }
  }
}

// 点击标签页
const handleTabClick = (name: string | number, disabled?: boolean) => {
  if (disabled) return

  const pane = props.panes.find((p, i) => getPaneKey(p, i) === name)
  if (!pane) return

  activeTab.value = name
  emit('tab-click', pane, new MouseEvent('click'))
}

// 移除标签页
const handleTabRemove = (name: string | number) => {
  emit('tab-remove', name)
}

const handleTabAdd = () => {
  emit('tab-add')
}

const getPaneKey = (pane: TabPane, index: number): string | number => {
  return pane.name ?? index
}

const isPaneClosable = (pane: TabPane): boolean => {
  if (pane.disabled) return false
  if (pane.closable !== undefined) return pane.closable
  if (props.editable || props.closable) return true
  return false
}

const shouldRenderPane = (pane: TabPane, index: number) => {
  const key = getPaneKey(pane, index)
  if (!pane.lazy) return true
  return renderedTabs.value.has(key)
}

// 组件挂载后更新指示器
onMounted(() => {
  nextTick(() => updateBar())
  window.addEventListener('resize', updateBar)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateBar)
})

// 暴露方法
defineExpose({
  /** 当前激活的标签页 */
  activeTab,
  /** 更新活动指示器 */
  updateBar
})
</script>

<style scoped>
@import './style.css';
</style>
