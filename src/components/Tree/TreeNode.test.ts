import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import TreeNode from './TreeNode.vue'

const simpleNode = { id: '1', label: 'Node 1' }
const parentNode = {
  id: '1',
  label: 'Parent',
  children: [
    { id: '1-1', label: 'Child 1' }
  ]
}

describe('TreeNode.vue', () => {
  it('renders label text', () => {
    const wrapper = mount(TreeNode, {
      props: { node: simpleNode, level: 0 }
    })
    expect(wrapper.find('.label').text()).toBe('Node 1')
  })

  it('shows toggle when node has children', () => {
    const wrapper = mount(TreeNode, {
      props: { node: parentNode, level: 0 }
    })
    expect(wrapper.find('.toggle').exists()).toBe(true)
  })

  it('shows placeholder when node has no children', () => {
    const wrapper = mount(TreeNode, {
      props: { node: simpleNode, level: 0 }
    })
    expect(wrapper.find('.toggle').exists()).toBe(false)
    expect(wrapper.find('span[style*="display: inline-block"]').exists()).toBe(true)
  })

  it('renders children when expanded', () => {
    const expanded = ref(new Set(['1']))
    const wrapper = mount(TreeNode, {
      props: { node: parentNode, level: 0 },
      global: {
        provide: { expanded }
      }
    })

    // 展开状态下应该渲染子节点 label
    expect(wrapper.text()).toContain('Child 1')
  })

  it('does not render children when collapsed', () => {
    const expanded = ref(new Set())
    const wrapper = mount(TreeNode, {
      props: { node: parentNode, level: 0 },
      global: {
        provide: { expanded }
      }
    })

    expect(wrapper.text()).not.toContain('Child 1')
  })

  it('applies correct indentation', () => {
    const wrapper = mount(TreeNode, {
      props: { node: simpleNode, level: 2 }
    })

    const style = (wrapper.find('.label').element.parentElement as HTMLElement).style
    expect(style.paddingLeft).toBe('40px') // 2 * 20px
  })
})
