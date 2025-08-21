import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Drawer from './Drawer.vue' // 这里根据你的实际路径修改

describe('Drawer.vue', () => {
  it('初始时抽屉不显示', () => {
    const wrapper = mount(Drawer, {
      props: { drawerContent: '<p>测试内容</p>' }
    })
    expect(wrapper.find('.drawer').exists()).toBe(false)
  })

  it('点击按钮后显示抽屉', async () => {
    const wrapper = mount(Drawer, {
      props: { drawerContent: '<p>测试内容</p>' }
    })

    // 点击 "打开抽屉"
    await wrapper.find('button').trigger('click')

    expect(wrapper.find('.drawer').exists()).toBe(true)
  })

  it('点击关闭按钮后隐藏抽屉', async () => {
    const wrapper = mount(Drawer, {
      props: { drawerContent: '<p>测试内容</p>' }
    })

    // 打开
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('.drawer').exists()).toBe(true)

    // 关闭
    await wrapper.find('.close-btn').trigger('click')
    expect(wrapper.find('.drawer').exists()).toBe(false)
  })

  it('能渲染 drawerContent', async () => {
    const wrapper = mount(Drawer, {
      props: { drawerContent: '<p id="test-content">Hello Drawer</p>' }
    })

    // 打开
    await wrapper.find('button').trigger('click')

    expect(wrapper.find('#test-content').text()).toBe('Hello Drawer')
  })
})
