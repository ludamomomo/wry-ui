<template>
  <div class="dropdown">
    <button @click="toggleDropdown" class="dropdown-button">
      Dropdown List
    </button>
    <ul v-if="isOpen" class="dropdown-menu">
      <li v-for="(action, index) in actions" :key="index" class="dropdown-item">
        {{ action }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';

// 直接解构 props
const { actions } = defineProps<{
  actions: string[];
}>();

// 定义状态：是否打开下拉菜单
const isOpen = ref<boolean>(false);

// 切换菜单显示的状态
const toggleDropdown = (): void => {
  isOpen.value = !isOpen.value;
};
</script>


<style>
@import './style.css'
</style>
