# Dialog

## 交互演示

<DialogInteractiveDemo />

## Usage

```vue
<script setup lang="ts">
import { Button, Dialog } from "@drift/ui";
</script>

<template>
  <Dialog title="确认操作">
    <template #trigger>
      <Button>打开弹窗</Button>
    </template>
    <p>这是一个基于 Radix Vue 的 Dialog。</p>
  </Dialog>
</template>
```
