import axios from "axios";
import { Snackbar } from "@varlet/ui";
import { useDataStore } from "../stores/data";
import router from "../router";
import type { User } from "./api_types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Authorization: import.meta.env.VITE_API_AUTH,
    Token: localStorage.getItem("token") ?? "",
  },
});

api.interceptors.response.use(
  // 刷新 Token
  (res) => {
    const store = useDataStore();
    if (res.headers["New-Token"] != undefined) store.updateToken(res.headers["New-Token"]);
    return res;
  },

  // 处理错误
  (error) => {
    try {
      // 网络错误
      if (error.code === "ERR_NETWORK" || error.response.status == 404 || error.response.status == 502) {
        Snackbar({ content: "服务器爆炸啦，也可能是你网炸了 :D", type: "error" });
        return Promise.reject(error);
      }

      // 401 - 未授权
      if (error.response.status == 401) {
        const store = useDataStore();
        store.updateToken("");
        router.replace("/auth/login");
        return Promise.reject(error);
      }

      // 其他错误
      Snackbar({ content: error.response.data["msg"], type: "error" });

      // 出现未知错误
    } catch (_) {
      Snackbar({ content: `发生未知异常: ${error}`, type: "error" });
    }

    return Promise.reject(error);
  }
);

export default api;

class API {
  // 登录
  public static async login(name: string, password: string) {
    const res = await api.post("/user/login", { name, password });
    useDataStore().updateToken(res.data["data"]);
  }

  // 检查用户名是否可用
  public static async checkUsername(username: string): Promise<boolean> {
    const res = await api.post(`/user/check-username/${username}`);
    return res.status == 200;
  }

  // 验证码
  public static async sendVerificationCode(email: string, isRegister: boolean = false) {
    await api.post(`/user/verification-code/${email}?is_register=${isRegister}`);
  }

  // 注册
  public static async register(username: string, email: string, password: string, verificationCode: string) {
    await api.post("/user/register", { username, email, password, verification_code: verificationCode });
  }

  // 获取用户信息
  public static async getUser(): Promise<User> {
    return (await api.get("/user")).data["data"];
  }
}

export { API };
