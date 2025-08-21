import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Tooltip from './Tooltip.vue'

describe('Tooltip.vue', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  const mountWithRect = (position: string) => {
    // 模拟 getBoundingClientRect
    const mockRect = {
      top: 100,
      left: 50,
      bottom: 150,
      right: 200,
      width: 150,
      height: 50,
      x: 0,
      y: 0,
      toJSON: () => {}
    }

    const wrapper = mount(Tooltip, {
      props: { text: 'Hello Tooltip', position },
      slots: { default: '<button>Hover me</button>' },
      attachTo: document.body
    })

    vi.spyOn(wrapper.vm.$refs.tooltipRef as HTMLElement, 'getBoundingClientRect').mockReturnValue(mockRect as any)

    return { wrapper, mockRect }
  }

  it('renders slot content', () => {
    const { wrapper } = mountWithRect('top')
    expect(wrapper.find('button').text()).toBe('Hover me')
  })

  it('does not show tooltip initially', () => {
    const { wrapper } = mountWithRect('top')
    expect(wrapper.find('.tooltip-content').exists()).toBe(false)
  })

  it('shows tooltip on mouseenter and hides on mouseleave', async () => {
    const { wrapper } = mountWithRect('top')

    await wrapper.trigger('mouseenter')
    expect(wrapper.find('.tooltip-content').exists()).toBe(true)
    expect(wrapper.find('.tooltip-content').text()).toBe('Hello Tooltip')

    await wrapper.trigger('mouseleave')
    expect(wrapper.find('.tooltip-content').exists()).toBe(false)
  })

  it('positions tooltip correctly for top', async () => {
    const { wrapper, mockRect } = mountWithRect('top')

    await wrapper.trigger('mouseenter')
    const style = (wrapper.find('.tooltip-content').element as HTMLElement).style

    expect(style.top).toBe(`${mockRect.top - 10}px`)
    expect(style.left).toBe(`${mockRect.left + mockRect.width / 2}px`)
  })

  it('positions tooltip correctly for bottom', async () => {
    const { wrapper, mockRect } = mountWithRect('bottom')

    await wrapper.trigger('mouseenter')
    const style = (wrapper.find('.tooltip-content').element as HTMLElement).style

    expect(style.top).toBe(`${mockRect.bottom + 10}px`)
    expect(style.left).toBe(`${mockRect.left + mockRect.width / 2}px`)
  })

  it('positions tooltip correctly for left', async () => {
    const { wrapper, mockRect } = mountWithRect('left')

    await wrapper.trigger('mouseenter')
    const style = (wrapper.find('.tooltip-content').element as HTMLElement).style

    expect(style.left).toBe(`${mockRect.left - 10}px`)
    expect(style.top).toBe(`${mockRect.top + mockRect.height / 2}px`)
  })

  it('positions tooltip correctly for right', async () => {
    const { wrapper, mockRect } = mountWithRect('right')

    await wrapper.trigger('mouseenter')
    const style = (wrapper.find('.tooltip-content').element as HTMLElement).style

    expect(style.left).toBe(`${mockRect.right + 10}px`)
    expect(style.top).toBe(`${mockRect.top + mockRect.height / 2}px`)
  })
})
