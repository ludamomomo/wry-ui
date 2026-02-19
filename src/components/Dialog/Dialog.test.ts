import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Dialog from './Dialog.vue'

describe('Dialog.vue', () => {
  it('should not display dialog when modelValue is false', () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: false }
    })
    expect(wrapper.find('.wry-dialog').exists()).toBe(false)
  })

  it('should display dialog when modelValue is true', async () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: true, title: 'Test Title' },
      attachTo: document.body
    })
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.wry-dialog')).toBeTruthy()
    wrapper.unmount()
  })

  it('should render title correctly', async () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: true, title: 'Test Title' },
      attachTo: document.body
    })
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.wry-dialog__title')?.textContent).toBe('Test Title')
    wrapper.unmount()
  })

  it('should emit update:modelValue when close button clicked', async () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: true },
      attachTo: document.body
    })
    await wrapper.vm.$nextTick()
    const closeBtn = document.querySelector('.wry-dialog__close') as HTMLElement
    closeBtn?.click()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    wrapper.unmount()
  })
})
