<template>
  <div class="tabs-container">
    <div class="tabs">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :class="{ 'active': activeTab === tab }"
        @click="changeTab(tab)"
      >
        {{ tab }}
      </button>
      <div class="indicator" :style="{ left: indicatorPosition + 'px', width: indicatorWidth + 'px' }"></div>
    </div>
    <div class="tab-content">
      <slot :active-tab="activeTab"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

// 定义props类型
const props = defineProps<{
  tabs: string[];
  initialTab?: string;
}>();

// 定义ref类型
const activeTab = ref<string>('');
const indicatorPosition = ref<number>(0);
const indicatorWidth = ref<number>(0);

// 定义方法类型
function changeTab(tab: string): void {
  activeTab.value = tab;
  const buttons = document.querySelectorAll('.tabs button');
  buttons.forEach((button) => {
    const btn = button as HTMLButtonElement; // 类型断言为 HTMLButtonElement
    if (btn.textContent?.trim() === tab) {
      indicatorPosition.value = btn.offsetLeft;
      indicatorWidth.value = btn.offsetWidth;
    }
  });
}


onMounted(() => {
  activeTab.value = props.initialTab || props.tabs[0];
  changeTab(activeTab.value);
});

watch(activeTab, () => {
  changeTab(activeTab.value);
});
</script>

<style>
@import './style.css'
</style>
