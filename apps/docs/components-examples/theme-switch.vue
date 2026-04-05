<script setup lang="ts">
import { Button, createThemeProvider, provideTheme } from "../../../packages/ui/src";

const theme = createThemeProvider("light");
provideTheme(theme);

const toggleTheme = () => {
  theme.setMode(theme.mode.value === "light" ? "dark" : "light");
};
</script>

<template>
  <Button @click="toggleTheme">切换主题</Button>
</template>
