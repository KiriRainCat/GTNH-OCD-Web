import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes";
import { useDataStore } from "../stores/data";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

// 路由守卫
router.beforeEach((to, _, next) => {
  const store = useDataStore();

  if (!to.path.includes("auth") && to.path !== "/" && store.token.length == 0) {
    router.replace("/auth/login");
    return;
  }

  if (to.path.includes("auth") && store.token.length > 0) {
    router.replace("/dash");
    return;
  }

  next();
});

export default router;
