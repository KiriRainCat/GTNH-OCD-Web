<script setup lang="ts">
import { onBeforeMount } from "vue";
import { RouterView } from "vue-router";
import { useService } from "./pkg/stores/service";
import { StyleProvider, Themes } from "@varlet/ui";
import { useDataStore } from "./pkg/stores/data";
import NavBar from "./components/NavBar.vue";

onBeforeMount(() => {
  // 界面主题
  if (useDataStore().isDarkTheme) {
    StyleProvider(Themes.dark);
  } else {
    StyleProvider(null);
  }

  // 初始化服务
  useService().initServices();
});
</script>

<template>
  <div class="flex h-screen flex-col justify-center">
    <NavBar />

    <router-view v-slot="{ Component }" class="flex-1">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>
