<template>
  <form @submit.prevent="handleSubmit" class="p-6 max-w-lg mx-auto bg-white rounded-2xl shadow-md space-y-6">
    <!-- 姓名 -->
    <div class="form-item">
      <label class="form-label">姓名：</label>
      <div class="form-control">
        <input
          v-model="form.name"
          type="text"
          :class="['input', errors.name && 'input-error']"
          placeholder="请输入姓名"
        />
        <p v-if="errors.name" class="error-text">{{ errors.name }}</p>
      </div>
    </div>

    <!-- 年龄 -->
    <div class="form-item">
      <label class="form-label">年龄：</label>
      <div class="form-control">
        <input
          v-model="form.age"
          type="number"
          :class="['input', errors.age && 'input-error']"
          placeholder="请输入年龄"
        />
        <p v-if="errors.age" class="error-text">{{ errors.age }}</p>
      </div>
    </div>

    <!-- 性别 -->
    <div class="form-item">
      <label class="form-label">性别：</label>
      <div class="form-control">
        <select v-model="form.gender" :class="['input', errors.gender && 'input-error']">
          <option value="">请选择</option>
          <option value="male">男</option>
          <option value="female">女</option>
        </select>
        <p v-if="errors.gender" class="error-text">{{ errors.gender }}</p>
      </div>
    </div>

    <!-- 家庭住址 -->
    <div class="form-item">
      <label class="form-label">家庭住址：</label>
      <div class="form-control">
        <input
          v-model="form.address"
          type="text"
          :class="['input', errors.address && 'input-error']"
          placeholder="请输入家庭住址"
        />
        <p v-if="errors.address" class="error-text">{{ errors.address }}</p>
      </div>
    </div>

    <!-- 形状选择 -->
    <div class="form-item">
      <label class="form-label">喜欢的形状：</label>
      <div class="form-control flex gap-6">
        <label class="flex items-center gap-2">
          <input type="radio" value="circle" v-model="form.shape" />
          圆形
        </label>
        <label class="flex items-center gap-2">
          <input type="checkbox" value="square" v-model="form.shape" />
          正方形
        </label>
      </div>
      <p v-if="errors.shape" class="error-text">{{ errors.shape }}</p>
    </div>

    <!-- 备注 -->
    <div class="form-item">
      <label class="form-label">备注：</label>
      <div class="form-control">
        <textarea
          v-model="form.remark"
          rows="4"
          :class="['input', errors.remark && 'input-error']"
          placeholder="请输入备注（10~200字之间）"
        ></textarea>
        <p v-if="errors.remark" class="error-text">{{ errors.remark }}</p>
      </div>
    </div>

    <!-- 提交按钮 -->
    <div class="form-item">
      <div class="form-label"></div>
      <div class="form-control">
        <button type="submit" class="btn">提交</button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from "vue"

// 定义表单数据类型
interface FormData {
  name: string;
  age: number;  // 修改为 number 类型
  gender: string;
  address: string;
  shape: string | string[];
  remark: string;
}

// 定义错误信息类型
interface Errors {
  name?: string;
  age?: string;
  gender?: string;
  address?: string;
  shape?: string;
  remark?: string;
}

const form = reactive<FormData>({
  name: "",
  age: 0,  // 修改为 number 类型的默认值
  gender: "",
  address: "",
  shape: "",
  remark: ""
})

const errors = reactive<Errors>({})

function validate(): boolean {
  errors.name = form.name.trim() ? "" : "姓名不能为空"
  errors.age = form.age && form.age > 0 ? "" : "年龄必须是大于 0 的数字"
  errors.gender = form.gender ? "" : "请选择性别"
  errors.address = form.address.trim() ? "" : "家庭住址不能为空"
  errors.shape = form.shape ? "" : "请选择形状"
  errors.remark =
    form.remark.length >= 10 && form.remark.length <= 200
      ? ""
      : "备注必须在 10 ~ 200 字之间"

  return Object.values(errors).every(v => v === "")
}

function resetForm() {
  form.name = ""
  form.age = 0  // 修改为数字 0
  form.gender = ""
  form.address = ""
  form.shape = ""
  form.remark = ""
}


function handleSubmit() {
  if (validate()) {
    emit("submit", { ...form })
    alert("表单提交成功！")
    resetForm() // ✅ 提交成功后清空表单
  }
}

const emit = defineEmits<{
  (e: "submit", formData: FormData): void;
}>()
</script>

<style>
@import './style.css'
</style>
