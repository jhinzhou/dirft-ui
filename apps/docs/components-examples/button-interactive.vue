<script setup lang="ts">
import { computed, ref } from "vue";
import { Button } from "../../../packages/ui/src";

const count = ref(0);
const variant = ref<"primary" | "secondary" | "destructive">("primary");

const label = computed(() => `点击次数: ${count.value}`);
</script>

<template>
  <div class="demo-card">
    <div class="demo-row">
      <Button :variant="variant" @click="count += 1">{{ label }}</Button>
      <Button variant="secondary" @click="variant = 'secondary'">Secondary</Button>
      <Button variant="destructive" @click="variant = 'destructive'">Destructive</Button>
      <Button variant="primary" @click="variant = 'primary'">Primary</Button>
    </div>
  </div>
</template>
