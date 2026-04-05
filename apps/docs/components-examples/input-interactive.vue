<script setup lang="ts">
import { computed, ref } from "vue";
import { FormField, Input } from "../../../packages/ui/src";

const username = ref("");
const locale = ref<"zh-CN" | "en-US">("zh-CN");

const helperText = computed(() => {
  if (locale.value === "en-US") {
    return username.value ? `Hello, ${username.value}` : "Please type your name.";
  }
  return username.value ? `你好，${username.value}` : "请输入你的名字。";
});
</script>

<template>
  <div class="demo-card">
    <div class="demo-row">
      <button class="demo-chip" @click="locale = 'zh-CN'">中文</button>
      <button class="demo-chip" @click="locale = 'en-US'">English</button>
    </div>
    <FormField label="Username" :required="true">
      <Input v-model="username" />
    </FormField>
    <p class="demo-helper">{{ helperText }}</p>
  </div>
</template>
