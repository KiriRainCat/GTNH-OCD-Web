<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useService } from "./pkg/stores/service";

onMounted(useService().initServices);
</script>

<template>
  <main>
    <router-view v-slot="{ Component }" class="h-screen bg-slate-50">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
</template>
