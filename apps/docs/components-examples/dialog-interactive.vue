<script setup lang="ts">
import { Button, Dialog } from "../../../packages/ui/src";
</script>

<template>
  <div class="demo-card">
    <Dialog title="删除确认">
      <template #trigger>
        <Button variant="destructive">打开弹窗</Button>
      </template>
      <p>这是交互式 Dialog Demo，点击后应展示遮罩和弹窗内容。</p>
    </Dialog>
  </div>
</template>
