<template></template>

<script setup lang="ts">
import { h, render } from 'vue'
import type { VNode } from 'vue';



let seed: number = 0
const instances: Array<{ id: string; vnode: VNode; container: HTMLElement }> = []

interface UseMessageOptions {
  message: string
  type?: 'info' | 'success' | 'error'
}

function useMessage({ message, type = 'info' }: UseMessageOptions): void {
  const id: string = `message_${seed++}`
  const container: HTMLDivElement = document.createElement('div')
  document.body.appendChild(container)

  const close = (): void => {
    const idx = instances.findIndex(inst => inst.id === id)
    if (idx !== -1) {
      instances.splice(idx, 1)
      render(null, container)
      document.body.removeChild(container)
      updatePositions()
    }
  }

  const vnode: VNode = h(
    {
      name: 'MessageItem',
      render() {
        return h(
          'div',
          {
            class: ['message', `message-${type}`],
            style: {
              position: 'fixed',
              top: `${20 + instances.indexOf(instance) * 60}px`,
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '10px 20px',
              background:
                type === 'success'
                  ? '#dff0d8'
                  : type === 'error'
                  ? '#f2dede'
                  : '#f0f0f0',
              color: '#333',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              zIndex: 9999,
              transition: 'all 0.3s'
            }
          },
          [
            h('span', message),
            h(
              'button',
              {
                style: {
                  marginLeft: '10px',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'transparent',
                  fontWeight: 'bold'
                },
                onClick: close
              },
              'X'
            )
          ]
        )
      }
    }
  )

  const instance = { id, vnode, container }
  render(vnode, container)
  instances.push(instance)

  updatePositions()

  function updatePositions(): void {
    instances.forEach((inst, idx) => {
      const el = inst.container.firstElementChild as HTMLElement
      if (el) {
        el.style.top = `${20 + idx * 60}px`
      }
    })
  }
}

defineExpose({
  useMessage
})
</script>

<style>
@import './style.css'
</style>
