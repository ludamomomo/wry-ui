<template>
  <div class="all">
    <Tooltip text="我是悬停的信息" position="right">
      <button>悬停提示信息的</button>
    </Tooltip>
    <br /><br />
    <br /><br />
    <Button type="primary" :disabled="false" @click="handleButtonClick">Primary</Button>
    <Button type="secondary" :disabled="false" @click="handleButtonClick">Secondary</Button>
    <Button type="default" :disabled="true">Disabled</Button>
    <br /><br />
    <br /><br />
    <Collapse>
      <template #header>标题 1</template>
      <template #content>这是第一个标题对应的内容。</template>
    </Collapse>

    <Collapse>
      <template #header>标题 2</template>
      <template #content>这是第二个标题对应的内容。</template>
    </Collapse>

    <Collapse>
      <template #header>标题 3</template>
      <template #content>这是第三个标题对应的内容。</template>
    </Collapse>

    <Collapse>
      <template #header>标题 4</template>
      <template #content>这是第四个标题对应的内容。</template>
    </Collapse>
    <br /><br />
    <br /><br />
    <div>
      <Dropdown :actions="dropdownActions1" />
      <Dropdown :actions="dropdownActions2" />
    </div>
    <br /><br />
    <br /><br />
    <div style="padding-top: 70px">
      <h2 style="padding-top: 70px">密码输入框</h2>
      <!-- 密码输入框 -->
      <Input v-model="password" type="password" placeholder="输入密码" />
      <p>密码: {{ password }}</p>
    </div>
    <br /><br />
    <br /><br />
    <div>
      <button @click="showInfo">显示信息消息</button>
      <button @click="showSuccess">显示成功消息</button>
      <button @click="showError">显示错误消息</button>

      <!-- 挂载 Message 组件（用来暴露方法） -->
      <Message ref="messageRef" />
    </div>
    <br /><br />
    <br /><br />
    <h2>树状组件示例</h2>
    <Tree :data="treeData" />
    <br /><br />
    <br /><br />
    <Fix :options="dropdownOptions" :dialogTitle="dialogTitle" :dialogContent="dialogContent" />
    <br /><br />
    <br /><br />
    <div>
      <Form @submit="handleFormSubmit" />
    </div>
    <br /><br />
    <br /><br />
    <div id="tabs">
      <Tabs :tabs="['User', 'Config', 'Role', 'Task']" :initial-tab="'User'">
        <template #default="{ activeTab }">
          <div v-if="activeTab === 'User'">User的内容区</div>
          <div v-if="activeTab === 'Config'">Config的内容区</div>
          <div v-if="activeTab === 'Role'">Role的内容区</div>
          <div v-if="activeTab === 'Task'">Task的内容区</div>
        </template>
      </Tabs>
    </div>
    <br /><br />
    <br /><br />
    <div>
      <Drawer :drawerContent="drawerContent" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Button from './components/Button/Button.vue';
import Tooltip from './components/Tooltip/Tooltip.vue';
import Collapse from './components/Collapse/Collapse.vue';
import Dropdown from './components/Dropdown/Dropdown.vue';
import Input from './components/Input/Input.vue';
import Message from './components/Message/Message.vue';
import Tree from './components/Tree/Tree.vue';
import Fix from './components/Fix/Fix.vue';
import Form from './components/Form/Form.vue';
import Tabs from './components/Tabs/Tabs.vue';
import Drawer from './components/Drawer/Drawer.vue';
//fix
// 自定义下拉框选项
const dropdownOptions = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

// 自定义弹出框内容
const dialogTitle = '标题xxx';
const dialogContent = '内容区域xxxxxxxxxxxxxxx';

//dropdown
const dropdownActions1 = ['Option 1', 'Option 2', 'Option 3'];
const dropdownActions2 = ['Item A', 'Item B', 'Item C', 'Item D'];
//drawer
// 自定义抽屉内容
const drawerContent = `
  <h3>欢迎来到我的抽屉</h3>
  <p>这是一些自定义内容，可以包含 <strong>HTML</strong> 标记。</p>
  <ul>
    <li>选项 1</li>
    <li>选项 2</li>
    <li>选项 3</li>
  </ul>
`;

//button
const handleButtonClick = () => {
  alert('按钮被点击了');
};
//input
const password = ref('')
//message
const messageRef = ref(null)

const showInfo = () => {
  messageRef.value.useMessage({ message: '这是一条信息提示', type: 'info' })
}
const showSuccess = () => {
  messageRef.value.useMessage({ message: '操作成功！', type: 'success' })
}
const showError = () => {
  messageRef.value.useMessage({ message: '发生错误！', type: 'error' })
}
//tree
const treeData = ref([
  {
    id: '1',
    label: 'Level one 1',
    children: [
      {
        id: '1-1',
        label: 'Level two 1-1',
        children: [
          {
            id: '1-1-1',
            label: 'Level three 1-1-1',
            children: []
          }
        ]
      },
      {
        id: '1-2',
        label: 'Level two 1-2',
        children: [
          {
            id: '1-2-1',
            label: 'Level three 1-2-1',
            children: []
          }
        ]
      }
    ]
  },
  {
    id: '2',
    label: 'Level one 2',
    children: [
      {
        id: '2-1',
        label: 'Level two 2-1',
        children: [
          {
            id: '2-1-1',
            label: 'Level three 2-1-1',
            children: []
          }
        ]
      },
      {
        id: '2-2',
        label: 'Level two 2-2',
        children: [
          {
            id: '2-2-1',
            label: 'Level three 2-2-1',
            children: []
          }
        ]
      }
    ]
  },
  {
    id: '3',
    label: 'Level one 3',
    children: [
      {
        id: '3-1',
        label: 'Level two 3-1',
        children: [
          {
            id: '3-1-1',
            label: 'Level three 3-1-1',
            children: []
          }
        ]
      },
      {
        id: '3-2',
        label: 'Level two 3-2',
        children: [
          {
            id: '3-2-1',
            label: 'Level three 3-2-1',
            children: []
          }
        ]
      }
    ]
  }
])
//form
function handleFormSubmit(data) {
  console.log('父组件接收到表单数据:', data)
}

</script>

<style scoped>
.all{
height: 2800px;
}
#tabs {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#drawer{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
