import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./pkg/router";

// Varlet UI
import Varlet, { Snackbar } from "@varlet/ui";
import "@varlet/ui/es/style";
import "@varlet/touch-emulator";
Snackbar.allowMultiple(true);

// 全局样式
import "./assets/styles.scss";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Varlet);

// 解决 UI 组件库按钮点击后不回弹的问题
const handleBtnEvent = (event: any) => event.target!.blur();
app.directive("btn", {
  mounted(el: HTMLElement) {
    el.addEventListener("focus", handleBtnEvent);
  },
  unmounted(el) {
    el.removeEventListener("focus", handleBtnEvent);
  },
});

app.mount("#app");
