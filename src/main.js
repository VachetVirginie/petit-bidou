import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import "@mdi/font/css/materialdesignicons.css";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@/index.css";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
  },
});

createApp(App).use(store).use(router).use(vuetify).mount("#app");
