import type { RouteRecordRaw } from "vue-router";
import HomeView from "../../views/HomeView.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/auth",
    component: () => import("@/views/auth/AuthLayout.vue"),
    children: [
      { path: "login", name: "login", component: () => import("@/views/auth/components/LoginForm.vue") },
      { path: "register", name: "register", component: () => import("@/views/auth/components/RegisterForm.vue") },
      { path: "forget-password", name: "forgetPassword", component: () => import("@/views/auth/components/RegisterForm.vue") },
    ],
  },
  {
    path: "/dash",
    children: [
      { path: "", name: "dashboard", component: () => import("@/views/dash/DashView.vue") },
      { path: "ae", name: "ae", component: () => import("@/views/dash/AEView.vue") },
      { path: "miner", name: "miner", component: () => import("@/views/dash/MinerView.vue") },
    ],
  },
  {
    path: "/team",
    name: "team",
    component: () => import("@/views/team/TeamView.vue"),
  },
];
