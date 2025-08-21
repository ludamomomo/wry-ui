import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Input from './Input.vue'

describe('Input.vue', () => {
  it('clears input when clearable button is clicked', async () => {
    const wrapper = mount(Input, {
      props: {
        clearable: true,
      },
    })

    // 模拟输入
    await wrapper.setProps({ modelValue: 'Test' })

    // 检查初始值
    expect((wrapper.vm as any).innerValue).toBe('Test')

    // 触发清空按钮点击
    await wrapper.find('.btn-clear').trigger('click')

    // 检查清空后的值
    expect((wrapper.vm as any).innerValue).toBe('')
  })

  it('toggles password visibility when the toggle button is clicked', async () => {
    const wrapper = mount(Input, {
      props: {
        type: 'password',
        showPasswordToggle: true,
      },
    })

    // 检查初始输入类型（应该是密码）
    let input = wrapper.find('input')
    expect(input.attributes('type')).toBe('password')

    // 点击切换按钮显示密码
    await wrapper.find('.btn-toggle').trigger('click')
    input = wrapper.find('input')
    expect(input.attributes('type')).toBe('text')

    // 点击切换按钮隐藏密码
    await wrapper.find('.btn-toggle').trigger('click')
    input = wrapper.find('input')
    expect(input.attributes('type')).toBe('password')
  })

  it('binds the input value correctly with v-model', async () => {
    const wrapper = mount(Input)

    // 模拟用户输入
    await wrapper.setProps({ modelValue: 'Initial Value' })

    // 检查初始值
    expect((wrapper.vm as any).innerValue).toBe('Initial Value')

    // 模拟输入框值的变化
    await wrapper.find('input').setValue('Updated Value')

    // 检查更新后的值和事件是否正确触发
    expect((wrapper.vm as any).innerValue).toBe('Updated Value')
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['Updated Value'])
  })
})
