<script setup lang="ts">
import { Keys } from "@/pkg/constants/keys";
import router from "@/pkg/router";
import { useDataStore } from "@/pkg/stores/data";
import { Icon } from "@iconify/vue";
import { StyleProvider, Themes } from "@varlet/ui";
import { computed } from "vue";

const store = useDataStore();
const isLoggedIn = computed(() => store.token.length > 0);

function switchTheme() {
  if (store.isDarkTheme) {
    store.isDarkTheme = false;
    StyleProvider(null);
  } else {
    store.isDarkTheme = true;
    StyleProvider(Themes.dark);
  }

  localStorage.setItem(Keys.IS_DARK_THEME, store.isDarkTheme.toString());
}

function logout() {
  store.updateToken("");
  router.replace({ name: "login" });
}
</script>

<template>
  <var-app-bar fixed elevation="2" title-position="center">
    <template #left><var-button text class="ml-1 font-bold" @click="() => $router.push('/')">GTNH OCD</var-button></template>

    <template #right>
      <var-button text @click="switchTheme" class="mx-1 w-10">
        <Icon :icon="store.isDarkTheme ? 'ph:sun' : 'ph:moon'" class="h-6 w-6" />
      </var-button>
    </template>

    <template v-if="isLoggedIn" #default>
      <var-button text class="mx-1 w-10" @click="() => $router.push({ name: 'dashboard' })">
        <Icon icon="mdi:home" class="h-8 w-8" />
      </var-button>
    </template>
  </var-app-bar>
</template>
