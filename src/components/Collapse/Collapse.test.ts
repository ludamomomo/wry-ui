import { mount } from '@vue/test-utils'
import Collapse from './Collapse.vue'
import { describe, it, expect} from 'vitest'

describe('Collapse.vue', () => {
  
  // 测试组件的初始状态，默认内容应该是隐藏的
  it('should not show content initially', () => {
    const wrapper = mount(Collapse)
    const content = wrapper.find('.collapse-content')
    expect(content.exists()).toBe(false)  // 确保内容不存在
  })

  // 测试点击头部，内容显示出来
  it('should show content when header is clicked', async () => {
    const wrapper = mount(Collapse)
    const header = wrapper.find('.collapse-header')

    // 点击头部
    await header.trigger('click')

    const content = wrapper.find('.collapse-content')
    expect(content.exists()).toBe(true)  // 确保内容显示
  })

  // 测试点击头部，内容隐藏
  it('should hide content when header is clicked again', async () => {
    const wrapper = mount(Collapse)
    const header = wrapper.find('.collapse-header')

    // 点击头部一次，显示内容
    await header.trigger('click')
    let content = wrapper.find('.collapse-content')
    expect(content.exists()).toBe(true)  // 内容显示

    // 点击头部第二次，隐藏内容
    await header.trigger('click')
    content = wrapper.find('.collapse-content')
    expect(content.exists()).toBe(false)  // 内容隐藏
  })

  // 测试是否能够传入自定义的插槽
  it('should render custom header and content', () => {
    const wrapper = mount(Collapse, {
      slots: {
        header: 'Custom Header',
        content: 'Custom Content'
      }
    })

    const header = wrapper.find('.collapse-header')
    const content = wrapper.find('.collapse-content')

    expect(header.text()).toBe('Custom Header')  // 自定义头部文本
    expect(content.text()).toBe('Custom Content')  // 自定义内容文本
  })
})
