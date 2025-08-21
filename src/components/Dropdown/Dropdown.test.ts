import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Dropone from './Dropdown.vue'  // 这里路径改成你实际的路径

describe('Dropone.vue', () => {
  it('renders button text correctly', () => {
    const wrapper = mount(Dropone, {
      props: {
        actions: ['Edit', 'Delete', 'Share'],
      },
    })

    expect(wrapper.find('button').text()).toBe('Dropdown List')
  })

  it('should not render dropdown menu initially', () => {
    const wrapper = mount(Dropone, {
      props: {
        actions: ['Edit', 'Delete', 'Share'],
      },
    })

    expect(wrapper.find('ul').exists()).toBe(false)
  })

  it('should render dropdown menu after clicking button', async () => {
    const wrapper = mount(Dropone, {
      props: {
        actions: ['Edit', 'Delete', 'Share'],
      },
    })

    await wrapper.find('button').trigger('click')

    const menuItems = wrapper.findAll('li')
    expect(menuItems.length).toBe(3)
    expect(menuItems[0].text()).toBe('Edit')
    expect(menuItems[1].text()).toBe('Delete')
    expect(menuItems[2].text()).toBe('Share')
  })

  it('should hide dropdown menu after clicking button again', async () => {
    const wrapper = mount(Dropone, {
      props: {
        actions: ['Edit', 'Delete', 'Share'],
      },
    })

    const button = wrapper.find('button')

    await button.trigger('click') // 打开
    expect(wrapper.find('ul').exists()).toBe(true)

    await button.trigger('click') // 再点一次关闭
    expect(wrapper.find('ul').exists()).toBe(false)
  })
})
