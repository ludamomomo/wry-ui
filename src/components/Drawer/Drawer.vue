<template>
  <div>
    <!-- 按钮触发抽屉 -->
    <button @click="toggleDrawer">打开抽屉</button>

    <!-- 使用 transition 控制过渡动画 -->
    <transition name="drawer" @before-enter="beforeEnter" @enter="enter" @leave="leave">
      <div v-if="isDrawerOpen" class="drawer" @click.self="closeDrawer">
        <div class="drawer-content">
          <button @click="closeDrawer" class="close-btn">关闭</button>
          <!-- 动态内容渲染 -->
          <div v-html="drawerContent"></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps } from 'vue'

// 定义 props 以接收自定义的抽屉内容
const { drawerContent } = defineProps<{
  drawerContent: string
}>()

// 抽屉的状态
const isDrawerOpen = ref(false)

// 打开或关闭抽屉
const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
}

// 关闭抽屉
const closeDrawer = () => {
  isDrawerOpen.value = false
}

// 过渡动画钩子
const beforeEnter = (el: Element) => {
  (el as HTMLElement).style.transform = 'translateX(100%)'
}

const enter = (el: Element, done: () => void) => {
  const element = el as HTMLElement
  element.offsetHeight // 强制触发重排
  element.style.transition = 'transform 0.3s ease-out'
  element.style.transform = 'translateX(0)'
  done()
}

const leave = (el: Element, done: () => void) => {
  const element = el as HTMLElement
  element.style.transition = 'transform 0.3s ease-in'
  element.style.transform = 'translateX(100%)'
  done()
}
</script>


<style>
@import './style.css'
</style>
