<template>
  <div class="wry-ui-showcase">
    <!-- 顶部导航 -->
    <header class="showcase-header">
      <div class="container">
        <div class="logo">
          <h1>WRY-UI 组件库</h1>
        </div>
        <nav class="nav">
          <a href="#button">Button</a>
          <a href="#input">Input</a>
          <a href="#dialog">Dialog</a>
          <a href="#tooltip">Tooltip</a>
          <a href="#message">Message</a>
          <a href="#others">Others</a>
        </nav>
      </div>
    </header>

    <div class="container">
      <!-- Button 按钮 -->
      <section id="button" class="section">
        <div class="section-title">
          <h2>Button 按钮</h2>
          <p>基础组件，触发业务逻辑时使用</p>
        </div>

        <div class="demo-block">
          <div class="block-title">基础按钮 - 6 种颜色类型</div>
          <div class="block-desc">使用 <code>type</code> 来定义按钮的样式，直接显示对应颜色</div>
          <div class="demo-content">
            <div class="button-colors">
              <div class="color-item">
                <Button type="default">Default</Button>
                <span class="color-info">默认 #FFFFFF</span>
              </div>
              <div class="color-item">
                <Button type="primary">Primary</Button>
                <span class="color-info">主要 #409EFF</span>
              </div>
              <div class="color-item">
                <Button type="success">Success</Button>
                <span class="color-info">成功 #67C23A</span>
              </div>
              <div class="color-item">
                <Button type="warning">Warning</Button>
                <span class="color-info">警告 #E6A23C</span>
              </div>
              <div class="color-item">
                <Button type="danger">Danger</Button>
                <span class="color-info">危险 #F56C6C</span>
              </div>
              <div class="color-item">
                <Button type="info">Info</Button>
                <span class="color-info">信息 #909399</span>
              </div>
            </div>
          </div>
        </div>

        <div class="demo-block">
          <div class="block-title">朴素按钮</div>
          <div class="demo-content">
            <div class="button-row">
              <Button type="primary" plain>Primary</Button>
              <Button type="success" plain>Success</Button>
              <Button type="warning" plain>Warning</Button>
              <Button type="danger" plain>Danger</Button>
              <Button type="info" plain>Info</Button>
            </div>
          </div>
        </div>

        <div class="demo-block">
          <div class="block-title">圆角和圆形按钮</div>
          <div class="demo-content">
            <div class="button-showcase">
              <div>
                <p class="label">Round 圆角</p>
                <div class="button-row">
                  <Button type="primary" round>Primary</Button>
                  <Button type="success" round>Success</Button>
                  <Button type="danger" round>Danger</Button>
                </div>
              </div>
              <div>
                <p class="label">Circle 圆形</p>
                <div class="button-row">
                  <Button type="primary" circle icon="🔍"></Button>
                  <Button type="success" circle icon="✓"></Button>
                  <Button type="warning" circle icon="⚠"></Button>
                  <Button type="danger" circle icon="✕"></Button>
                  <Button type="info" circle icon="ℹ"></Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="demo-block">
          <div class="block-title">按钮尺寸和状态</div>
          <div class="demo-content">
            <div class="button-showcase">
              <div>
                <p class="label">三种尺寸</p>
                <div class="button-row">
                  <Button type="primary" size="large">Large</Button>
                  <Button type="primary" size="default">Default</Button>
                  <Button type="primary" size="small">Small</Button>
                </div>
              </div>
              <div>
                <p class="label">加载和禁用</p>
                <div class="button-row">
                  <Button type="primary" :loading="loading" @click="handleLoading">
                    {{ loading ? '加载中' : '点击加载' }}
                  </Button>
                  <Button type="success" disabled>禁用按钮</Button>
                  <Button type="text">文字按钮</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Tooltip 提示 -->
      <section id="tooltip" class="section">
        <div class="section-title">
          <h2>Tooltip 文字提示</h2>
          <p>常用于展示鼠标 hover 时的提示信息</p>
        </div>

        <div class="demo-block">
          <div class="block-title">12 个方向 - 清晰展示</div>
          <div class="block-desc">
            鼠标悬停在按钮上查看不同方向的提示。
            <strong style="color: #409eff;">「上左/上边/上右」对应 top-start/top/top-end</strong>
          </div>
          <div class="demo-content">
            <div class="tooltip-grid">
              <!-- 顶部三个 -->
              <div class="tooltip-row">
                <div class="empty"></div>
                <Tooltip content="Top Start - 顶部左对齐" placement="top-start">
                  <button class="tooltip-btn">上左</button>
                </Tooltip>
                <Tooltip content="Top - 顶部居中" placement="top">
                  <button class="tooltip-btn">上边</button>
                </Tooltip>
                <Tooltip content="Top End - 顶部右对齐" placement="top-end">
                  <button class="tooltip-btn">上右</button>
                </Tooltip>
                <div class="empty"></div>
              </div>

              <!-- 中间行 -->
              <div class="tooltip-row">
                <Tooltip content="Left Start - 左侧上对齐" placement="left-start">
                  <button class="tooltip-btn">左上</button>
                </Tooltip>
                <div class="empty"></div>
                <div class="tooltip-center">
                  <div class="center-content">
                    <p>📍 Tooltip 12 方向</p>
                    <p>悬停查看效果</p>
                  </div>
                </div>
                <div class="empty"></div>
                <Tooltip content="Right Start - 右侧上对齐" placement="right-start">
                  <button class="tooltip-btn">右上</button>
                </Tooltip>
              </div>

              <div class="tooltip-row">
                <Tooltip content="Left - 左侧居中" placement="left">
                  <button class="tooltip-btn">左边</button>
                </Tooltip>
                <div class="empty"></div>
                <div class="empty"></div>
                <div class="empty"></div>
                <Tooltip content="Right - 右侧居中" placement="right">
                  <button class="tooltip-btn">右边</button>
                </Tooltip>
              </div>

              <div class="tooltip-row">
                <Tooltip content="Left End - 左侧下对齐" placement="left-end">
                  <button class="tooltip-btn">左下</button>
                </Tooltip>
                <div class="empty"></div>
                <div class="empty"></div>
                <div class="empty"></div>
                <Tooltip content="Right End - 右侧下对齐" placement="right-end">
                  <button class="tooltip-btn">右下</button>
                </Tooltip>
              </div>

              <!-- 底部三个 -->
              <div class="tooltip-row">
                <div class="empty"></div>
                <Tooltip content="Bottom Start - 底部左对齐" placement="bottom-start">
                  <button class="tooltip-btn">下左</button>
                </Tooltip>
                <Tooltip content="Bottom - 底部居中" placement="bottom">
                  <button class="tooltip-btn">下边</button>
                </Tooltip>
                <Tooltip content="Bottom End - 底部右对齐" placement="bottom-end">
                  <button class="tooltip-btn">下右</button>
                </Tooltip>
                <div class="empty"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="demo-block">
          <div class="block-title">主题和触发方式</div>
          <div class="demo-content">
            <div class="button-row">
              <Tooltip content="Dark 深色主题（默认）" effect="dark">
                <Button>Dark</Button>
              </Tooltip>
              <Tooltip content="Light 浅色主题" effect="light">
                <Button>Light</Button>
              </Tooltip>
              <Tooltip content="Hover 悬停触发" trigger="hover">
                <Button type="primary">Hover</Button>
              </Tooltip>
              <Tooltip content="Click 点击触发" trigger="click">
                <Button type="success">Click</Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </section>

      <!-- Message 消息 -->
      <section id="message" class="section">
        <div class="section-title">
          <h2>Message 消息提示</h2>
          <p>常用于主动操作后的反馈提示</p>
        </div>

        <div class="demo-block">
          <div class="block-title">不同类型 - 支持手动关闭</div>
          <div class="block-desc">
            ✅ 连续点击会自动合并相同消息<br>
            ✅ 可手动关闭（duration 设为 0 时显示关闭按钮）
          </div>
          <div class="demo-content">
            <div class="message-grid">
              <Button type="success" @click="showMsg('success', '成功消息')">成功消息</Button>
              <Button type="warning" @click="showMsg('warning', '警告消息')">警告消息</Button>
              <Button type="danger" @click="showMsg('error', '错误消息')">错误消息</Button>
              <Button type="info" @click="showMsg('info', '普通消息')">普通消息</Button>
            </div>
          </div>
        </div>
      </section>

      <!-- Input 输入框 -->
      <section id="input" class="section">
        <div class="section-title">
          <h2>Input 输入框</h2>
          <p>通过鼠标或键盘输入字符</p>
        </div>

        <div class="demo-block">
          <div class="block-title">多种输入场景</div>
          <div class="demo-content">
            <div class="input-grid">
              <div class="input-item">
                <label>基础输入</label>
                <Input v-model="inputs.basic" placeholder="请输入内容" clearable />
              </div>
              <div class="input-item">
                <label>密码输入</label>
                <Input v-model="inputs.pwd" type="password" placeholder="请输入密码" show-password clearable />
              </div>
              <div class="input-item">
                <label>带图标</label>
                <Input v-model="inputs.search" placeholder="搜索" prefix-icon="🔍" clearable />
              </div>
              <div class="input-item">
                <label>字数限制</label>
                <Input v-model="inputs.limit" placeholder="最多50字" :maxlength="50" show-word-limit />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Dialog 对话框 -->
      <section id="dialog" class="section">
        <div class="section-title">
          <h2>Dialog 对话框</h2>
          <p>在保留当前页面状态的情况下，告知用户并承载相关操作</p>
        </div>

        <div class="demo-block">
          <div class="block-title">基础用法</div>
          <div class="block-desc">
            支持 v-model 双向绑定，可自定义标题、宽度、关闭前回调等
          </div>
          <div class="demo-content">
            <div class="button-row">
              <Button type="primary" @click="dialogVisible = true">打开基础对话框</Button>
              <Button type="success" @click="dialogWithFooter = true">带底部按钮的对话框</Button>
            </div>

            <!-- 基础对话框 -->
            <Dialog v-model="dialogVisible" title="提示" width="500px">
              <span>这是一段信息</span>
            </Dialog>

            <!-- 带底部的对话框 -->
            <Dialog
              v-model="dialogWithFooter"
              title="确认操作"
              width="500px"
              :before-close="handleDialogClose"
            >
              <span>确定要执行此操作吗？</span>
              <template #footer>
                <div class="dialog-footer">
                  <Button @click="dialogWithFooter = false">取消</Button>
                  <Button type="primary" @click="dialogWithFooter = false; showMsg('success', '操作成功')">
                    确定
                  </Button>
                </div>
              </template>
            </Dialog>
          </div>
        </div>
      </section>

      <!-- 其他组件 -->
      <section id="others" class="section">
        <div class="section-title">
          <h2>其他组件</h2>
          <p>Drawer、Tabs、Collapse、Dropdown、Tree</p>
        </div>

        <!-- Drawer -->
        <div class="demo-block">
          <div class="block-title">Drawer 抽屉</div>
          <div class="demo-content">
            <div class="button-row">
              <Button type="primary" @click="drawer.rtl = true">从右往左 →</Button>
              <Button type="success" @click="drawer.ltr = true">← 从左往右</Button>
              <Button type="warning" @click="drawer.ttb = true">从上往下 ↓</Button>
              <Button type="info" @click="drawer.btt = true">↑ 从下往上</Button>
            </div>

            <Drawer v-model="drawer.rtl" title="抽屉标题" direction="rtl" size="40%">
              <div style="padding: 20px;">
                <h4>抽屉内容</h4>
                <p>支持 v-model 双向绑定</p>
                <p>支持四个方向打开</p>
              </div>
              <template #footer>
                <div style="text-align: right;">
                  <Button @click="drawer.rtl = false">取消</Button>
                  <Button type="primary" @click="confirmDrawer">确定</Button>
                </div>
              </template>
            </Drawer>

            <Drawer v-model="drawer.ltr" title="从左往右" direction="ltr" size="40%">
              <div style="padding: 20px;"><p>左侧抽屉内容</p></div>
            </Drawer>

            <Drawer v-model="drawer.ttb" title="从上往下" direction="ttb" size="40%">
              <div style="padding: 20px;"><p>顶部抽屉内容</p></div>
            </Drawer>

            <Drawer v-model="drawer.btt" title="从下往上" direction="btt" size="40%">
              <div style="padding: 20px;"><p>底部抽屉内容</p></div>
            </Drawer>
          </div>
        </div>

        <!-- Tabs -->
        <div class="demo-block">
          <div class="block-title">Tabs 标签页</div>
          <div class="demo-content">
            <Tabs v-model="tabValue" :panes="tabPanes" type="line">
              <template #pane-1>
                <div style="padding: 20px; background: #fafafa; border-radius: 4px;">
                  <h4>用户管理</h4>
                  <p>用户列表、权限设置</p>
                </div>
              </template>
              <template #pane-2>
                <div style="padding: 20px; background: #fafafa; border-radius: 4px;">
                  <h4>配置管理</h4>
                  <p>系统配置、参数设置</p>
                </div>
              </template>
              <template #pane-3>
                <div style="padding: 20px; background: #fafafa; border-radius: 4px;">
                  <h4>数据统计</h4>
                  <p>报表、图表分析</p>
                </div>
              </template>
            </Tabs>
          </div>
        </div>

        <!-- Collapse -->
        <div class="demo-block">
          <div class="block-title">Collapse 折叠面板</div>
          <div class="demo-content">
            <Collapse v-model="collapseValue" :items="collapseItems">
              <template #content-1>
                <p>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念</p>
              </template>
              <template #content-2>
                <p>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作</p>
              </template>
              <template #content-3>
                <p>简化流程：设计简洁直观的操作流程</p>
              </template>
            </Collapse>
          </div>
        </div>

        <!-- Dropdown -->
        <div class="demo-block">
          <div class="block-title">Dropdown 下拉菜单</div>
          <div class="demo-content">
            <div class="button-row">
              <Dropdown :items="dropItems" title="下拉菜单" @command="handleCmd" />
              <Dropdown :items="moreItems" title="更多操作" trigger="click" @command="handleCmd" />
            </div>
          </div>
        </div>

        <!-- Tree -->
        <div class="demo-block">
          <div class="block-title">Tree 树形控件</div>
          <div class="demo-content">
            <div style="margin-bottom: 12px;">
              <Button type="primary" size="small" @click="expandTree">全部展开</Button>
              <Button type="info" size="small" @click="collapseTree">全部折叠</Button>
              <Button type="success" size="small" @click="getCheckedTree">获取选中</Button>
            </div>
            <Tree
              ref="treeRef"
              :data="treeData"
              show-checkbox
              :default-expanded-keys="['1']"
            />
          </div>
        </div>
      </section>
    </div>

    <!-- 页脚 -->
    <footer class="footer">
      <p>© 2025 WRY-UI Component Library</p>
      <p>Made with ❤️ using Vue 3 + TypeScript</p>
    </footer>

    <Message ref="msgRef" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Button from './components/Button/Button.vue'
import Input from './components/Input/Input.vue'
import Tooltip from './components/Tooltip/Tooltip.vue'
import Message from './components/Message/Message.vue'
import Drawer from './components/Drawer/Drawer.vue'
import Dialog from './components/Dialog/Dialog.vue'
import Tabs from './components/Tabs/Tabs.vue'
import Collapse from './components/Collapse/Collapse.vue'
import Dropdown from './components/Dropdown/Dropdown.vue'
import Tree from './components/Tree/Tree.vue'

// Button
const loading = ref(false)
const handleLoading = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    showMsg('success', '加载完成！')
  }, 2000)
}

// Message
const msgRef = ref(null)
const showMsg = (type, msg) => {
  msgRef.value?.useMessage({
    message: msg,
    type,
    duration: 3000,
    showClose: true
  })
}

// Input
const inputs = reactive({
  basic: '',
  pwd: '',
  search: '',
  limit: ''
})


// Drawer
const drawer = reactive({
  rtl: false,
  ltr: false,
  ttb: false,
  btt: false
})

const confirmDrawer = () => {
  drawer.rtl = false
  showMsg('success', '操作已确认')
}

// Dialog
const dialogVisible = ref(false)
const dialogWithFooter = ref(false)

const handleDialogClose = (done) => {
  showMsg('info', '对话框即将关闭')
  done()
}

// Tabs
const tabValue = ref('1')
const tabPanes = [
  { name: '1', label: '用户管理', icon: '👤' },
  { name: '2', label: '配置管理', icon: '⚙️' },
  { name: '3', label: '数据统计', icon: '📊' }
]

// Collapse
const collapseValue = ref([])
const collapseItems = [
  { name: '1', title: '一致性 Consistency' },
  { name: '2', title: '反馈 Feedback' },
  { name: '3', title: '效率 Efficiency' }
]

// Dropdown
const dropItems = [
  { label: '新增', command: 'add', icon: '➕' },
  { label: '编辑', command: 'edit', icon: '✏️' },
  { label: '删除', command: 'delete', icon: '🗑️', divided: true }
]

const moreItems = [
  { label: '导出', command: 'export', icon: '📤' },
  { label: '导入', command: 'import', icon: '📥' }
]

const handleCmd = (cmd) => {
  showMsg('info', `执行命令: ${cmd}`)
}

// Tree
const treeRef = ref(null)
const treeData = [
  {
    id: '1',
    label: '一级 1',
    children: [
      { id: '1-1', label: '二级 1-1', children: [{ id: '1-1-1', label: '三级 1-1-1' }] },
      { id: '1-2', label: '二级 1-2' }
    ]
  },
  {
    id: '2',
    label: '一级 2',
    children: [{ id: '2-1', label: '二级 2-1' }]
  }
]

const expandTree = () => {
  treeRef.value?.expandAll()
  showMsg('success', '已展开所有节点')
}

const collapseTree = () => {
  treeRef.value?.collapseAll()
  showMsg('info', '已折叠所有节点')
}

const getCheckedTree = () => {
  const nodes = treeRef.value?.getCheckedNodes()
  if (nodes && nodes.length) {
    showMsg('success', `选中了 ${nodes.length} 个节点`)
  } else {
    showMsg('warning', '未选中任何节点')
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  background: #f5f7fa;
  color: #303133;
  line-height: 1.6;
}

html {
  scroll-behavior: smooth;
}

code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  color: #e6a23c;
}

/* Header */
.showcase-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.showcase-header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  font-size: 28px;
}

.logo h1 {
  font-size: 20px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-text-fill-color: transparent;
}

.nav {
  display: flex;
  gap: 24px;
}

.nav a {
  color: #606266;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s;
}

.nav a:hover {
  color: #409eff;
}

/* Hero */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 20px;
  text-align: center;
}

.hero-title {
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 12px;
}

.hero-desc {
  font-size: 16px;
  opacity: 0.95;
  margin-bottom: 30px;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-item strong {
  font-size: 24px;
  margin-bottom: 4px;
}

.stat-item span {
  font-size: 14px;
  opacity: 0.9;
}

/* Section */
.section {
  margin: 40px 0;
}

.section-title {
  margin-bottom: 24px;
}

.section-title h2 {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.section-title p {
  font-size: 14px;
  color: #909399;
}

/* Demo Block */
.demo-block {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.demo-block:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}

.block-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.block-desc {
  font-size: 13px;
  color: #606266;
  line-height: 1.8;
  margin-bottom: 16px;
  padding: 12px;
  background: #f9f9f9;
  border-left: 3px solid #409eff;
  border-radius: 4px;
}

.demo-content {
  padding: 10px 0;
}

/* Button 展示 */
.button-colors {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 20px;
}

.color-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  transition: all 0.3s;
}

.color-item:hover {
  background: #f0f0f0;
  transform: scale(1.05);
}

.color-info {
  font-size: 12px;
  color: #606266;
  font-family: 'Monaco', monospace;
  background: #fff;
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.button-showcase {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.button-showcase .label {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
  margin-bottom: 8px;
}

/* Tooltip 展示 */
.tooltip-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 30px 0;
}

.tooltip-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  align-items: center;
}

.tooltip-btn {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #606266;
  transition: all 0.3s;
}

.tooltip-btn:hover {
  color: #409eff;
  border-color: #409eff;
  background: #ecf5ff;
}

.tooltip-center {
  grid-column: 2 / 5;
}

.center-content {
  padding: 40px;
  background: linear-gradient(135deg, #667eea15, #764ba215);
  border: 2px dashed #c0c4cc;
  border-radius: 8px;
  text-align: center;
}

.center-content p {
  margin: 6px 0;
  color: #606266;
  font-size: 14px;
}

.center-content p:first-child {
  font-size: 16px;
  font-weight: 600;
}


/* Message */
.message-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

/* Input */
.input-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.input-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-item label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.value-display {
  font-size: 12px;
  color: #909399;
  padding: 4px 8px;
  background: #f5f7fa;
  border-radius: 4px;
  font-family: 'Monaco', monospace;
}

/* Form 相关样式 */
.wry-select {
  width: 100%;
  height: 32px;
  padding: 0 12px;
  font-size: 14px;
  color: #606266;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s;
  cursor: pointer;
}

.wry-select:hover {
  border-color: #c0c4cc;
}

.wry-select:focus {
  border-color: #409eff;
}

.wry-select--small {
  height: 28px;
  font-size: 12px;
}

/* Switch 开关 */
.wry-switch {
  display: inline-flex;
  align-items: center;
  position: relative;
  font-size: 14px;
  line-height: 20px;
  height: 20px;
  vertical-align: middle;
}

.wry-switch input[type="checkbox"] {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  margin: 0;
}

.wry-switch__core {
  display: inline-block;
  position: relative;
  width: 40px;
  height: 20px;
  border: 1px solid #dcdfe6;
  outline: none;
  border-radius: 10px;
  box-sizing: border-box;
  background: #dcdfe6;
  cursor: pointer;
  transition: border-color 0.3s, background-color 0.3s;
}

.wry-switch__core::after {
  content: '';
  position: absolute;
  top: 1px;
  left: 1px;
  border-radius: 50%;
  transition: all 0.3s;
  width: 16px;
  height: 16px;
  background-color: #fff;
}

.wry-switch input[type="checkbox"]:checked + .wry-switch__core {
  border-color: #409eff;
  background-color: #409eff;
}

.wry-switch input[type="checkbox"]:checked + .wry-switch__core::after {
  left: 100%;
  margin-left: -17px;
}

/* Checkbox */
.wry-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.wry-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
}

.wry-checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  cursor: pointer;
  accent-color: #409eff;
}

.wry-checkbox span {
  color: #606266;
}

.wry-checkbox:hover span {
  color: #409eff;
}

/* Radio */
.wry-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.wry-radio {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
}

.wry-radio input[type="radio"] {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  cursor: pointer;
  accent-color: #409eff;
}

.wry-radio span {
  color: #606266;
}

.wry-radio:hover span {
  color: #409eff;
}

/* Label Position Buttons */
.label-position-buttons {
  display: flex;
  gap: 8px;
}

/* Dialog Footer */
.dialog-footer {
  display: flex;
  gap: 12px;
}

/* Footer */
.footer {
  background: #fff;
  border-top: 1px solid #ebeef5;
  padding: 40px 20px;
  text-align: center;
}

.footer p {
  margin: 6px 0;
  color: #909399;
  font-size: 14px;
}

/* 响应式 */
@media (max-width: 768px) {
  .nav {
    display: none;
  }

  .input-grid,
  .button-colors {
    grid-template-columns: 1fr;
  }

  .tooltip-row {
    grid-template-columns: repeat(3, 1fr);
  }

  .tooltip-center {
    grid-column: 1 / -1;
  }
}

/* 滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #909399;
}
</style>
