import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Tree from './Tree.vue'

const treeData = [
  {
    id: '1',
    label: 'Root',
    children: [
      {
        id: '1-1',
        label: 'Child 1'
      },
      {
        id: '1-2',
        label: 'Child 2',
        children: [
          { id: '1-2-1', label: 'Grandchild' }
        ]
      }
    ]
  }
]

describe('Tree.vue', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('renders tree nodes', () => {
    const wrapper = mount(Tree, { props: { data: treeData } })
    expect(wrapper.findAll('.label').length).toBe(1) // 默认只渲染 root
    expect(wrapper.find('.label').text()).toBe('Root')
  })

  it('expands and collapses on toggle click', async () => {
    const wrapper = mount(Tree, { props: { data: treeData } })

    // 初始只有 root
    expect(wrapper.findAll('.label').length).toBe(1)

    // 点击 root toggle 展开
    await wrapper.find('.toggle').trigger('click')
    expect(wrapper.findAll('.label').length).toBe(3) // Root + 2 children

    // 再点一次收起
    await wrapper.find('.toggle').trigger('click')
    expect(wrapper.findAll('.label').length).toBe(1)
  })

  it('expands nested children', async () => {
    const wrapper = mount(Tree, { props: { data: treeData } })

    // 展开 root
    await wrapper.find('.toggle').trigger('click')
    expect(wrapper.findAll('.label').length).toBe(3)

    // 展开 "Child 2"
    const child2Toggle = wrapper.findAll('.toggle')[1]
    await child2Toggle.trigger('click')
    expect(wrapper.findAll('.label').length).toBe(4) // Root + Child1 + Child2 + Grandchild
  })

  it('calls console.log when label clicked', async () => {
    const wrapper = mount(Tree, { props: { data: treeData } })

    const spy = vi.spyOn(console, 'log')
    await wrapper.find('.label').trigger('click')

    expect(spy).toHaveBeenCalledWith('Selected node:', '1')
    spy.mockRestore()
  })

  it('applies correct indentation for child nodes', async () => {
    const wrapper = mount(Tree, { props: { data: treeData } })

    await wrapper.find('.toggle').trigger('click') // 展开 root
    const child1 = wrapper.findAll('.label')[1]

    // 通过父 div 的 style 检查缩进
    const style = (child1.element.parentElement as HTMLElement).style
    expect(style.paddingLeft).toBe('20px')
  })
})
