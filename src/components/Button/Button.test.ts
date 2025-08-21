import { mount } from '@vue/test-utils'
import Button from './Button.vue'
import { describe, it, expect, vi } from 'vitest'

describe('Button.vue', () => {

  // 测试按钮的样式类名
  it('renders with correct class based on type prop', () => {
    const wrapper = mount(Button, {
      props: {
        type: 'primary',
        disabled: false
      }
    })
    expect(wrapper.classes()).toContain('btn-primary')

    wrapper.setProps({ type: 'secondary' })
    expect(wrapper.classes()).toContain('btn-secondary')
  })

  // 测试按钮是否禁用
  it('is disabled when the disabled prop is true', () => {
    const wrapper = mount(Button, {
      props: {
        type: 'primary',
        disabled: true
      }
    })
    expect(wrapper.classes()).toContain('btn-disabled')
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  // 测试点击事件是否触发
  it('emits "buttonClick" when clicked', async () => {
    const wrapper = mount(Button, {
      props: {
        type: 'primary',
        disabled: false
      }
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted().buttonClick).toBeTruthy()
  })

  // 测试 onButtonClick 回调函数是否被调用
  it('calls onButtonClick when the button is clicked', async () => {
    const onButtonClick = vi.fn()  // 使用 vitest 提供的 vi.fn 来模拟回调函数
    const wrapper = mount(Button, {
      props: {
        type: 'primary',
        disabled: false,
        onButtonClick
      }
    })

    await wrapper.trigger('click')
    expect(onButtonClick).toHaveBeenCalled()
  })

  // 测试按钮点击事件在禁用状态下不会触发
  it('does not emit buttonClick when the button is disabled', async () => {
    const wrapper = mount(Button, {
      props: {
        type: 'primary',
        disabled: true
      }
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted().buttonClick).toBeUndefined()
  })

})
