import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Message from './Message.vue'

// 用于挂载组件并获取 useMessage 方法
function setup() {
  const exposed = (Message as any).exposed
  return exposed
}

describe('Message.vue', () => {
  beforeEach(() => {
    document.body.innerHTML = '' // 清空 DOM，保证测试隔离
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a message', () => {
    const { useMessage } = setup()
    useMessage({ message: 'Hello Vitest' })

    const el = document.body.querySelector('.message') as HTMLElement
    expect(el).not.toBeNull()
    expect(el.textContent).toContain('Hello Vitest')
  })

  it('renders different types', () => {
    const { useMessage } = setup()

    useMessage({ message: 'Info msg', type: 'info' })
    useMessage({ message: 'Success msg', type: 'success' })
    useMessage({ message: 'Error msg', type: 'error' })

    const messages = document.body.querySelectorAll('.message')
    expect(messages.length).toBe(3)

    expect(messages[0].classList.contains('message-info')).toBe(true)
    expect(messages[1].classList.contains('message-success')).toBe(true)
    expect(messages[2].classList.contains('message-error')).toBe(true)
  })

  it('closes message when clicking X', async () => {
    const { useMessage } = setup()
    useMessage({ message: 'Closable msg' })

    const el = document.body.querySelector('.message') as HTMLElement
    const closeBtn = el.querySelector('button') as HTMLButtonElement

    closeBtn.click()
    await new Promise(resolve => setTimeout(resolve, 0)) // 等待 DOM 更新

    expect(document.body.querySelector('.message')).toBeNull()
  })

  it('updates positions for multiple messages', () => {
    const { useMessage } = setup()

    useMessage({ message: 'First' })
    useMessage({ message: 'Second' })
    useMessage({ message: 'Third' })

    const messages = document.body.querySelectorAll('.message') as NodeListOf<HTMLElement>
    expect(messages.length).toBe(3)

    expect(messages[0].style.top).toBe('20px')
    expect(messages[1].style.top).toBe('80px')
    expect(messages[2].style.top).toBe('140px')
  })
})
