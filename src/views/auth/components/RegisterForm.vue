<script setup lang="ts">
import router from "@/pkg/router";
import { API } from "@/pkg/services/api";
import { Form, Snackbar } from "@varlet/ui";
import { reactive, ref } from "vue";

const activeStep = ref(0);

const formRef = ref<Form>();
const form = reactive({
  username: "",
  password: "",
  passwordRepeat: "",
  email: "",
  verificationCode: "",
});

const pending = ref(false);
async function handleSubmit() {
  pending.value = true;
  if (await formRef.value?.validate()) {
    await API.register(form.username, form.email, form.password, form.verificationCode)
      .then(() => {
        Snackbar.success("注册成功，请登录");
        router.replace({ name: "login" });
      })
      .catch(() => {});
  }
  pending.value = false;
}

async function handleNext() {
  pending.value = true;

  // 验证用户名是否可用
  if (activeStep.value == 0 && !(await API.checkUsername(form.username).catch(() => {}))) {
    pending.value = false;
    return;
  }

  if (await formRef.value?.validate()) activeStep.value++;

  pending.value = false;
}

const coolDown = ref(0);
async function sendVerificationCode() {
  coolDown.value = 180;
  const interval = setInterval(() => {
    coolDown.value--;
    if (coolDown.value <= 0) clearInterval(interval);
  }, 1000);

  API.sendVerificationCode(form.email, true)
    .then(
      () => Snackbar.success("验证码已发送至邮箱，请注意查收"),
      () => {
        clearInterval(interval);
        coolDown.value = 0;
      }
    )
    .catch(() => {});
}
</script>

<template>
  <div class="mx-10 flex flex-col justify-center">
    <div class="font-bold">欢迎使用 GTNH OCD</div>
    <div class="text-sm opacity-55">请注册您的账号</div>

    <!-- 表单主体 -->
    <var-style-provider
      :style-vars="{
        '--input-input-height': '16px',
        '--field-decorator-placeholder-size': '14px',
        '--step-tag-size': '18px',
        '--step-tag-font-size': '10px',
        '--step-content-font-size': '12px',
      }"
      class="mb-4 mt-6 flex flex-col gap-2"
    >
      <!-- 步骤条 -->
      <var-steps @click-step="(step) => (activeStep = step)" :active="activeStep" class="mb-2">
        <var-step>用户名</var-step>
        <var-step>验证邮箱</var-step>
        <var-step>创建密码</var-step>
      </var-steps>

      <var-form ref="formRef" v-if="activeStep == 0">
        <var-input
          autofocus
          variant="outlined"
          placeholder="用户名"
          :rules="[(val) => val.trim().length > 0 || '用户名不得为空']"
          v-model="form.username"
          class="mt-2"
        ></var-input>
      </var-form>

      <var-form ref="formRef" v-if="activeStep == 1">
        <var-input
          autofocus
          variant="outlined"
          placeholder="邮箱"
          :rules="[
            (val) => val.trim().length > 0 || '邮箱不得为空',
            (val) => /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(val) || '邮箱格式不正确',
          ]"
          v-model="form.email"
          class="mt-2"
        ></var-input>
        <div class="flex max-w-[15.5rem] items-center gap-2">
          <var-input
            variant="outlined"
            placeholder="验证码"
            type="number"
            :rules="[(val) => val.length > 0 || '验证码不得为空']"
            v-model="form.verificationCode"
            class="mt-2"
          ></var-input>
          <var-button type="info" :disabled="coolDown > 0" @click="sendVerificationCode" class="mt-1.5 h-10 min-w-14 max-w-14">
            {{ coolDown > 0 ? `${coolDown}s` : "发送" }}
          </var-button>
        </div>
      </var-form>

      <var-form ref="formRef" v-if="activeStep == 2">
        <var-input
          autofocus
          type="password"
          variant="outlined"
          placeholder="密码"
          :rules="[(val) => val.trim().length > 0 || '密码不得为空']"
          v-model="form.password"
          class="my-2"
        ></var-input>
        <var-input
          type="password"
          variant="outlined"
          placeholder="重复密码"
          :rules="[(val) => val.trim().length > 0 || '密码不得为空', (val) => val === form.password || '两次密码输入不一致']"
          v-model="form.passwordRepeat"
        ></var-input>
      </var-form>
    </var-style-provider>

    <!-- 特殊按钮 -->
    <div class="mb-4 flex flex-col items-center gap-1">
      <var-button text size="mini" tabindex="-1" class="w-min text-xs text-blue-500" @click="() => $router.push({ name: 'login' })">
        已经有账号了？点此登录
      </var-button>
    </div>

    <!-- 提交按钮 -->
    <var-button type="primary" :disabled="pending" @click="() => (activeStep === 2 ? handleSubmit() : handleNext())" class="h-10 w-full">
      <var-loading v-if="pending" type="wave" />
      <div v-else>{{ activeStep === 2 ? "注册" : "下一步" }}</div>
    </var-button>
  </div>
</template>

<style scoped></style>
