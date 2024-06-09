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
    component: () => import("@/views/auth/AuthView.vue"),
    children: [
      { path: "login", name: "login", component: () => import("@/views/auth/components/LoginForm.vue") },
      { path: "register", name: "register", component: () => import("@/views/auth/components/RegisterForm.vue") },
      { path: "forget-password", name: "forgetPassword", component: () => import("@/views/auth/components/RegisterForm.vue") },
    ],
  },
  {
    path: "/dash",
    name: "dashboard",
    component: () => import("@/views/dash/DashView.vue"),
  },
];
