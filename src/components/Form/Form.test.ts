import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import Form from './Form.vue'

describe('Form.vue', () => {
  it('renders the form correctly', () => {
    const wrapper = mount(Form)
    
    // 检查表单中的所有输入框
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    expect(wrapper.find('input[type="number"]').exists()).toBe(true)
    expect(wrapper.find('select').exists()).toBe(true)
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('validates the form correctly when submitting', async () => {
    const wrapper = mount(Form)

    // 模拟输入
    await wrapper.setData({
      form: {
        name: '',
        age: 0,
        gender: '',
        address: '',
        shape: '',
        remark: ''
      }
    })

    // 提交表单
    await wrapper.find('form').trigger('submit.prevent')

    // 检查错误信息
    expect(wrapper.text()).toContain('姓名不能为空')
    expect(wrapper.text()).toContain('年龄必须是大于 0 的数字')
    expect(wrapper.text()).toContain('请选择性别')
    expect(wrapper.text()).toContain('家庭住址不能为空')
    expect(wrapper.text()).toContain('请选择形状')
    expect(wrapper.text()).toContain('备注必须在 10 ~ 200 字之间')
  })

  it('submits the form when all fields are valid', async () => {
    const emit = vi.fn()
    const wrapper = mount(Form, {
      global: {
        mocks: {
          $emit: emit
        }
      }
    })

    // 填写表单数据
    await wrapper.setData({
      form: {
        name: 'John Doe',
        age: 25,
        gender: 'male',
        address: '123 Main St',
        shape: 'circle',
        remark: 'This is a valid remark.'
      }
    })

    // 提交表单
    await wrapper.find('form').trigger('submit.prevent')

    // 验证 emit 是否被调用
    expect(emit).toHaveBeenCalledWith('submit', {
      name: 'John Doe',
      age: 25,
      gender: 'male',
      address: '123 Main St',
      shape: 'circle',
      remark: 'This is a valid remark.'
    })
  })

  it('clears the form after successful submission', async () => {
    const wrapper = mount(Form)

    // 填写表单数据
    await wrapper.setData({
      form: {
        name: 'John Doe',
        age: 25,
        gender: 'male',
        address: '123 Main St',
        shape: 'circle',
        remark: 'This is a valid remark.'
      }
    })

    // 提交表单
    await wrapper.find('form').trigger('submit.prevent')

    // 检查表单是否清空
    expect((wrapper.vm as any).form.name).toBe('')
    expect((wrapper.vm as any).form.age).toBe(0)
    expect((wrapper.vm as any).form.gender).toBe('')
    expect((wrapper.vm as any).form.address).toBe('')
    expect((wrapper.vm as any).form.shape).toBe('')
    expect((wrapper.vm as any).form.remark).toBe('')
  })
})
