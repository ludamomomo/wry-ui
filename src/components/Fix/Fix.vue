<template>
  <div>
    <!-- Select 组件 -->
    <select v-model="selectedOption" @change="onSelectChange">
      <option v-for="option in options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>

    <!-- Dialog 组件 -->
    <teleport to="body">
      <div v-if="showDialog" class="dialog-overlay" @click="closeDialog">
        <div class="dialog-box" @click.stop>
          <h2>{{ dialogTitle }}</h2>
          <p>{{ dialogContent }}</p>
          <button @click="closeDialog">Close</button>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'

// 定义 props
const { options, dialogTitle, dialogContent } = defineProps<{
  options: string[]
  dialogTitle: string
  dialogContent: string
}>()

// 选中项 & dialog 状态
const selectedOption = ref<string | null>(null)
const showDialog = ref(false)

// 监听选项变化
const onSelectChange = () => {
  if (selectedOption.value) {
    openDialog()
  }
}

// 打开 & 关闭 Dialog
const openDialog = () => {
  showDialog.value = true
}
const closeDialog = () => {
  showDialog.value = false
}
</script>

<style>
@import './style.css'
</style>
