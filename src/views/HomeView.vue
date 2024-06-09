<script setup lang="ts"></script>

<template>
  <div class="flex items-center justify-center">
    <var-paper elevation="2" radius="6" class="flex max-w-[28rem] flex-col p-6">
      <!-- 项目描述 -->
      <div class="text-lg font-bold">欢迎使用 GTNH OCD!</div>
      <div class="text-xs opacity-55">[GregTech New Horizons OpenComputers Dashboard]</div>
      <div class="mt-2 text-sm">一款用于查看，监控，与获取 GTNH OpenComputers 事件通知的开源工具</div>

      <!-- 登录注册按钮 -->
      <var-button type="primary" @click="() => $router.push('/auth/login')" class="mt-4">登录</var-button>
      <var-button type="info" @click="() => $router.push('/auth/register')" class="mt-2">注册</var-button>
    </var-paper>
  </div>
</template>

<style scoped></style>
