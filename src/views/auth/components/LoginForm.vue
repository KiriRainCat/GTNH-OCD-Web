<script setup lang="ts">
import router from "@/pkg/router";
import { API } from "@/pkg/services/api";
import { Form } from "@varlet/ui";
import { reactive, ref } from "vue";

const formRef = ref<Form>();
const form = reactive({
  name: "",
  password: "",
});

const pending = ref(false);
async function handleSubmit() {
  pending.value = true;

  if (await formRef.value?.validate()) {
    await API.login(form.name, form.password)
      .then(() => router.replace({ name: "dashboard" }))
      .catch();
  }

  pending.value = false;
}
</script>

<template>
  <var-form ref="formRef" class="mx-10 flex flex-col justify-center">
    <div class="font-bold">欢迎回到 GTNH OCD</div>
    <div class="text-sm opacity-55">请登录您的账号</div>

    <!-- 表单主体 -->
    <var-style-provider
      :style-vars="{ '--input-input-height': '16px', '--field-decorator-placeholder-size': '14px' }"
      class="mb-4 mt-6 flex flex-col gap-2"
    >
      <var-input
        autofocus
        variant="outlined"
        placeholder="用户名/邮箱"
        :rules="[(val) => val.length > 0 || '用户名/邮箱不得为空']"
        v-model="form.name"
      ></var-input>
      <var-input
        type="password"
        variant="outlined"
        placeholder="密码"
        :rules="[(val) => val.length > 0 || '密码不得为空']"
        v-model="form.password"
      ></var-input>
    </var-style-provider>

    <!-- 特殊按钮 -->
    <div class="mb-4 flex flex-col items-center gap-1">
      <var-button text size="mini" tabindex="-1" class="w-min text-xs text-blue-500" @click="() => $router.push({ name: 'register' })">
        还没有账号？点此注册
      </var-button>
      <var-button text size="mini" tabindex="-1" class="w-min text-xs text-red-500" @click="() => $router.push({ name: 'forgetPassword' })">
        忘记密码
      </var-button>
    </div>

    <!-- 提交按钮 -->
    <var-button type="primary" :disabled="pending" @click="handleSubmit" class="h-10 w-full">
      <var-loading v-if="pending" type="wave" />
      <div v-else>登录</div>
    </var-button>
  </var-form>
</template>

<style scoped></style>
