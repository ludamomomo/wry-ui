<template>
  <div class="collapse-container">
    <div class="collapse-header" @click="toggleContent">
      <slot name="header"></slot> <!-- 小标题的插槽 -->
    </div>
    <div v-if="isOpen" class="collapse-content">
      <slot name="content"></slot> <!-- 内容的插槽 -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 定义 isOpen 为 boolean 类型
const isOpen = ref<boolean>(false);

// 定义 toggleContent 函数，返回值为 void
const toggleContent = (): void => {
  isOpen.value = !isOpen.value;
}
</script>

<style>
@import './style.css'
</style>
