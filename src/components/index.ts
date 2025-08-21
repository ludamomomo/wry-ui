import type { App } from 'vue';
import WRYButton from './Button/Button.vue';
import WRYCollapse from './Collapse/Collapse.vue';
import WRYDrawer from './Drawer/Drawer.vue';
import WRYDropdown from './Dropdown/Dropdown.vue'
import WRYFix from './Fix/Fix.vue'
import WRYForm from './Form/Form.vue'
import WRYInput from './Input/Input.vue'
import WRYMessage from './Message/Message.vue'
import WRYTabs from './Tabs/Tabs.vue'
import WRYTooltip from './Tooltip/Tooltip.vue'
import WRYTree from './Tree/Tree.vue'
// 将每个组件添加 install 方法，便于全局注册
WRYButton.install = (app: App) => {
  app.component('WRYButton', WRYButton);  // 直接使用字符串 'WRYButton'
};

WRYCollapse.install = (app: App) => {
  app.component('WRYCollapse', WRYCollapse);
};

WRYDrawer.install = (app: App) => {
  app.component('WRYDrawer', WRYDrawer);
};
WRYDropdown.install = (app: App) => {
  app.component('WRYDropdown', WRYDropdown);
};
WRYFix.install = (app: App) => {
  app.component('WRYFix', WRYFix);
};
WRYForm.install = (app: App) => {
  app.component('WRYForm', WRYForm);
};
WRYInput.install = (app: App) => {
  app.component('WRYInput', WRYInput);
};
WRYMessage.install = (app: App) => {
  app.component('WRYMessage', WRYMessage);
};
WRYTabs.install = (app: App) => {
  app.component('WRYTabs', WRYTabs);
};
WRYTooltip.install = (app: App) => {
  app.component('WRYTooltip', WRYTooltip);
};
WRYTree.install = (app: App) => {
  app.component('WRYTree', WRYTree);
};


// 导出所有组件
export { WRYButton, WRYCollapse, WRYDrawer ,WRYDropdown ,WRYFix ,WRYForm,WRYInput,WRYMessage,WRYTabs,WRYTooltip,WRYTree};

// 提供全局注册的方式
export default {
  install(app: App) {
    app.component('WRYButton', WRYButton);
    app.component('WRYCollapse', WRYCollapse);
    app.component('WRYDrawer', WRYDrawer);
    app.component('WRYDropdown', WRYDropdown);
    app.component('WRYFix', WRYFix);
    app.component('WRYForm', WRYForm);
    app.component('WRYInput', WRYInput);
    app.component('WRYMessage', WRYMessage);
    app.component('WRYTabs', WRYTabs);
    app.component('WRYTooltip', WRYTooltip);
    app.component('WRYTree', WRYTree);
  }
};
