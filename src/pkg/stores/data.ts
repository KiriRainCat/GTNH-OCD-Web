import { defineStore } from "pinia";
import { ref } from "vue";
import { Keys } from "../constants/keys";
import api from "../services/api";
import { useService } from "./service";
import { Team, User } from "../services/api_types";

export const useDataStore = defineStore("data", () => {
const isDarkTheme = ref(localStorage.getItem(Keys.IS_DARK_THEME) === "true");

  //* -------------------------------- 用户数据相关 -------------------------------- *//
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

  //* -------------------------------- 团队数据相关 -------------------------------- *//
  const teams = ref<Team[]>();
  const selectedTeamId = ref<string>();

  //* -------------------------------- OC 数据相关 ------------------------------- *//
  const AEData = ref<Array<any>>([]);

  return { isDarkTheme, user, token, updateToken, teams, selectedTeamId, AEData };
});
