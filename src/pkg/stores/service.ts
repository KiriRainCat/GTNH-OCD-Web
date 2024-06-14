import { defineStore } from "pinia";
import { ref } from "vue";
import { RtcService } from "../services/rtc";
import { useDataStore } from "./data";
import { Keys } from "../constants/keys";
import { API } from "../services/api";

export const useService = defineStore("service", () => {
  function refreshUserData() {
    const store = useDataStore();

    // 如果没有登录，则清除本地缓存
    if (store.token.length == 0) {
      localStorage.removeItem(Keys.USER);
      return;
    }

    // 从本地缓存中获取用户信息
    try {
      store.user = JSON.parse(localStorage.getItem(Keys.USER)!);
    } catch (_) {}

    // 从服务器获取用户信息 & 团队信息
    API.getUser()
      .then((user) => {
        store.user = user;
        API.refreshTeams().catch(() => {});
      })
      .catch(() => {});
  }

  function initServices() {
    refreshUserData();
  }

  return { refreshUserData, initServices, rtc };
});
