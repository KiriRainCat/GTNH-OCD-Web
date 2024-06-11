<script setup lang="ts"></script>

<template>
  <div class="gradient flex items-center justify-center">
    <var-paper elevation="2" radius="8" class="flex">
      <img src="@/assets/bg.webp" alt="侧边栏背景图片" class="w-64 object-cover" />

      <router-view v-slot="{ Component }" class="h-[28rem]">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </var-paper>
  </div>
</template>

<style scoped>
.gradient {
  background: rgb(81, 246, 255);
  background: linear-gradient(180deg, rgba(81, 246, 255, 0.18) 0%, rgba(255, 138, 207, 0.18) 100%);
}
</style>
