<template>
  <div 
    ref="tooltipRef"
    class="tooltip-container"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
  >
    <slot></slot> <!-- 插槽内容 -->
    <div 
      v-if="isVisible" 
      class="tooltip-content" 
      :style="tooltipStyle"
    >
    {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';

// 组件接受的 props
const props = defineProps({
  text: {
    type: String,
    required: true
  },
  position: {
    type: String,
    default: 'top' // 支持 top, bottom, left, right 位置
  }
});

const tooltipRef = ref<HTMLElement | null>(null); // 用来获取 tooltip 的引用
const isVisible = ref<boolean>(false); // 控制 tooltip 的显示与隐藏
const tooltipStyle = ref<Record<string, string>>({}); // 控制 tooltip 的定位样式

// 显示 tooltip
const showTooltip = () => {
  const tooltipElement = tooltipRef.value;
  if (!tooltipElement) return; // 防止 null 引用错误

  const rect = tooltipElement.getBoundingClientRect(); // 获取元素的矩形信息

  let style: Record<string, string> = {};
  switch (props.position) {
    case 'top':
      style = {
        top: `${rect.top - 10}px`,
        left: `${rect.left + rect.width / 2}px`,
        transform: 'translateX(-50%)'
      };
      break;
    case 'bottom':
      style = {
        top: `${rect.bottom + 10}px`,
        left: `${rect.left + rect.width / 2}px`,
        transform: 'translateX(-50%)'
      };
      break;
    case 'left':
      style = {
        top: `${rect.top + rect.height / 2}px`,
        left: `${rect.left - 10}px`,
        transform: 'translateY(-50%)'
      };
      break;
    case 'right':
      style = {
        top: `${rect.top + rect.height / 2}px`,
        left: `${rect.right + 10}px`,
        transform: 'translateY(-50%)'
      };
      break;
  }

  tooltipStyle.value = style;
  isVisible.value = true;
};

// 隐藏 tooltip
const hideTooltip = () => {
  isVisible.value = false;
};
</script>

<style>
@import './style.css'
</style>
