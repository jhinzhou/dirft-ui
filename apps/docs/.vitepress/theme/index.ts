import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import "../../../../packages/ui/dist/styles.css";
import "./custom.css";

import ButtonInteractiveDemo from "../../components-examples/button-interactive.vue";
import InputInteractiveDemo from "../../components-examples/input-interactive.vue";
import DialogInteractiveDemo from "../../components-examples/dialog-interactive.vue";
import ButtonBasicDemo from "../../components-examples/button-basic.vue";
import ThemeSwitchDemo from "../../components-examples/theme-switch.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("ButtonInteractiveDemo", ButtonInteractiveDemo);
    app.component("InputInteractiveDemo", InputInteractiveDemo);
    app.component("DialogInteractiveDemo", DialogInteractiveDemo);
    app.component("ButtonBasicDemo", ButtonBasicDemo);
    app.component("ThemeSwitchDemo", ThemeSwitchDemo);
  }
} satisfies Theme;
