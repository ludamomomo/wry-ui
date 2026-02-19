import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Tabs from './Tabs.vue'

describe('Tabs.vue', () => {
  const tabs = ['Home', 'Profile', 'Settings']

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('renders tabs correctly', () => {
    const wrapper = mount(Tabs, {
      //@ts-ignore
      props: { tabs }
    })

    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(3)
    expect(buttons[0].text()).toBe('Home')
  })

  it('sets initialTab if provided', () => {
    const wrapper = mount(Tabs, {
      //@ts-ignore
      props: { tabs, initialTab: 'Profile' }
    })

    expect(wrapper.find('button.active').text()).toBe('Profile')
  })

  it('defaults to first tab if initialTab not provided', () => {
    const wrapper = mount(Tabs, {
      //@ts-ignore
      props: { tabs }
    })

    expect(wrapper.find('button.active').text()).toBe('Home')
  })

  it('changes activeTab when clicking another tab', async () => {
    const wrapper = mount(Tabs, {
      //@ts-ignore
      props: { tabs }
    })

    const buttons = wrapper.findAll('button')
    await buttons[1].trigger('click')

    expect(wrapper.find('button.active').text()).toBe('Profile')
  })

  it('updates indicator position and width on tab change', async () => {
    const wrapper = mount(Tabs, {
      //@ts-ignore
      props: { tabs }
    })

    const indicator = wrapper.find('.indicator')
    const initialLeft = indicator.element.getAttribute('style')

    const buttons = wrapper.findAll('button')
    await buttons[2].trigger('click')

    const newLeft = indicator.element.getAttribute('style')
    expect(newLeft).not.toBe(initialLeft)
  })

  it('renders slot content with activeTab passed', async () => {
    const wrapper = mount(Tabs, {
      //@ts-ignore
      props: { tabs },
      slots: {
        default: `<template #default="{ activeTab }"><div class="slot-content">Active: {{ activeTab }}</div></template>`
      }
    })

    expect(wrapper.find('.slot-content').text()).toContain('Home')

    const buttons = wrapper.findAll('button')
    await buttons[1].trigger('click')

    expect(wrapper.find('.slot-content').text()).toContain('Profile')
  })
})
