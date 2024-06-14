<script setup lang="ts">
import { Keys } from "@/pkg/constants/keys";
import router from "@/pkg/router";
import { useDataStore } from "@/pkg/stores/data";
import { Icon } from "@iconify/vue";
import { StyleProvider, Themes } from "@varlet/ui";
import { computed } from "vue";
import { API } from "@/pkg/services/api";

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
    <template #left><var-button v-btn text class="ml-1 font-bold" @click="() => $router.push('/')">GTNH OCD</var-button></template>

    <template #right>
      <var-select
        v-if="isLoggedIn"
        placeholder="暂无团队"
        blur-color="var(--color-on-primary)"
        text-color="var(--color-on-primary)"
        focus-color="var(--color-on-primary)"
        :hint="false"
        v-model="store.selectedTeamId"
        @click="() => API.refreshTeams().catch(() => {})"
        class="mr-2 w-40"
      >
        <var-option v-for="team in store.teams" :key="team.id" :label="team.name" :value="team.id" />
      </var-select>

      <var-button v-btn v-if="isLoggedIn" text @click="() => $router.push({ name: 'team' })" class="w-10">
        <Icon icon="mdi:account-multiple" class="h-6 w-6" />
      </var-button>
      <var-button v-btn text @click="switchTheme" class="mx-1 w-10">
        <Icon :icon="store.isDarkTheme ? 'ph:sun' : 'ph:moon'" class="h-6 w-6" />
      </var-button>
      <var-button v-btn v-if="isLoggedIn" text @click="logout" class="mr-1 w-10">
        <Icon icon="mdi:logout-variant" class="h-5 w-5" :class="store.isDarkTheme ? 'text-red-500' : 'text-orange-500'" />
      </var-button>
    </template>

    <template v-if="isLoggedIn" #default>
      <var-button v-btn text @click="() => $router.push({ name: 'ae' })">AE 合成</var-button>
      <var-button v-btn text class="mx-1 w-10" @click="() => $router.push({ name: 'dashboard' })">
        <Icon icon="mdi:home" class="h-8 w-8" />
      </var-button>
      <var-button v-btn text @click="() => $router.push({ name: 'miner' })">矿机状态</var-button>
    </template>
  </var-app-bar>
</template>
