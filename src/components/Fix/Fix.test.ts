import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import YourComponent from './Fix.vue'

describe('YourComponent.vue', () => {
  const factory = () =>
    mount(YourComponent, {
      props: {
        options: ['Option A', 'Option B', 'Option C'],
        dialogTitle: 'Test Title',
        dialogContent: 'Test Content',
      },
      attachTo: document.body, // teleport 需要挂载到真实 DOM
    })

  it('renders select options', () => {
    const wrapper = factory()
    const options = wrapper.findAll('option')
    expect(options).toHaveLength(3)
    expect(options[0].text()).toBe('Option A')
    expect(options[1].text()).toBe('Option B')
  })

  it('opens dialog when selecting an option', async () => {
    const wrapper = factory()
    const select = wrapper.find('select')
    await select.setValue('Option B')

    // Dialog 应该显示
    expect(document.body.innerHTML).toContain('Test Title')
    expect(document.body.innerHTML).toContain('Test Content')
  })

  it('closes dialog when clicking Close button', async () => {
    const wrapper = factory()
    const select = wrapper.find('select')
    await select.setValue('Option B')

    const closeButton = wrapper.find('button')
    expect(closeButton.exists()).toBe(true)

    await closeButton.trigger('click')

    // Dialog 应该被关闭
    expect(document.body.innerHTML).not.toContain('Test Title')
  })
})
