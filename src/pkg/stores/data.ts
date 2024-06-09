import { defineStore } from "pinia";
import { ref } from "vue";
import { Keys } from "../constants/keys";
import api from "../services/api";
import { useService } from "./service";
import { User } from "../services/api_types";

export const useDataStore = defineStore("data", () => {
  const user = ref<User>();
  const token = ref(localStorage.getItem(Keys.TOKEN) ?? "");
  function updateToken(newToken: string) {
    token.value = newToken;
    localStorage.setItem(Keys.TOKEN, newToken);
    api.defaults.headers["Token"] = newToken;

    // 刷新用户数据 & 重连 websocket
    const { refreshUserData } = useService();
    refreshUserData();
  }

  const AEData = ref<Array<any>>([]);

  return { user, token, updateToken, AEData };
});
