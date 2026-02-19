import { App, DefineComponent, VNode } from 'vue';

// Button
export interface ButtonProps {
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'large' | 'default' | 'small';
  disabled?: boolean;
  loading?: boolean;
  plain?: boolean;
  round?: boolean;
  circle?: boolean;
}
export const WRYButton: DefineComponent<ButtonProps>;

// Collapse
export interface CollapseItem {
  name?: string | number;
  title: string;
  content?: string;
  disabled?: boolean;
}
export interface CollapseProps {
  items: CollapseItem[];
  modelValue?: (string | number)[] | string | number;
  accordion?: boolean;
  border?: boolean;
  iconPosition?: 'left' | 'right';
  expandIcon?: string;
}
export const WRYCollapse: DefineComponent<CollapseProps>;

// Dialog
export interface DialogProps {
  modelValue?: boolean;
  title?: string;
  width?: string | number;
  top?: string;
  modal?: boolean;
  closeOnClickModal?: boolean;
  closeOnPressEscape?: boolean;
  showClose?: boolean;
}
export const WRYDialog: DefineComponent<DialogProps>;

// Drawer
export interface DrawerProps {
  modelValue?: boolean;
  title?: string;
  direction?: 'rtl' | 'ltr' | 'ttb' | 'btt';
  size?: string | number;
  modal?: boolean;
  closeOnClickModal?: boolean;
  closeOnPressEscape?: boolean;
  showClose?: boolean;
}
export const WRYDrawer: DefineComponent<DrawerProps>;

// Dropdown
export interface DropdownItem {
  label: string;
  value: string | number;
  disabled?: boolean;
  divided?: boolean;
}
export interface DropdownProps {
  items?: DropdownItem[];
  trigger?: 'hover' | 'click';
  placement?: 'top' | 'bottom';
  disabled?: boolean;
}
export const WRYDropdown: DefineComponent<DropdownProps>;

// Input
export interface InputProps {
  modelValue?: string | number;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;
  showPassword?: boolean;
  size?: 'large' | 'default' | 'small';
  maxlength?: number;
  minlength?: number;
}
export const WRYInput: DefineComponent<InputProps>;

// Message
export interface MessageOptions {
  message: string | VNode;
  type?: 'success' | 'warning' | 'info' | 'error';
  duration?: number;
  showClose?: boolean;
  offset?: number;
  onClose?: () => void;
  customClass?: string;
  dangerouslyUseHTMLString?: boolean;
  center?: boolean;
  grouping?: boolean;
  id?: string;
}
export interface MessageHandle {
  close: () => void;
}
export interface MessageFn {
  (options: MessageOptions | string): MessageHandle;
  success: (options: MessageOptions | string) => MessageHandle;
  warning: (options: MessageOptions | string) => MessageHandle;
  info: (options: MessageOptions | string) => MessageHandle;
  error: (options: MessageOptions | string) => MessageHandle;
  closeAll: () => void;
}
export const WRYMessage: DefineComponent & { useMessage: MessageFn };

// Tabs
export interface TabPane {
  name: string | number;
  label: string;
  disabled?: boolean;
}
export interface TabsProps {
  modelValue?: string | number;
  type?: 'card' | 'border-card';
  tabPosition?: 'top' | 'right' | 'bottom' | 'left';
}
export const WRYTabs: DefineComponent<TabsProps>;

// Tooltip
export interface TooltipProps {
  content?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  effect?: 'dark' | 'light';
  disabled?: boolean;
  offset?: number;
  showArrow?: boolean;
}
export const WRYTooltip: DefineComponent<TooltipProps>;

// Tree
export interface TreeNode {
  label: string;
  children?: TreeNode[];
  disabled?: boolean;
  [key: string]: any;
}
export interface TreeProps {
  data?: TreeNode[];
  showCheckbox?: boolean;
  defaultExpandAll?: boolean;
  expandOnClickNode?: boolean;
  checkOnClickNode?: boolean;
  defaultExpandedKeys?: (string | number)[];
  defaultCheckedKeys?: (string | number)[];
  nodeKey?: string;
}
export const WRYTree: DefineComponent<TreeProps>;

// Plugin install
declare const WRYUI: {
  install: (app: App) => void;
};

export default WRYUI;
