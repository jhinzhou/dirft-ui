<script setup lang="ts">
import { Button, Dialog } from "../../../packages/ui/src";
</script>

<template>
  <div class="demo-card">
    <Dialog title="删除确认">
      <template #trigger>
        <Button variant="destructive">打开弹窗</Button>
      </template>
      <p>这是交互式 Dialog Demo，你可以直接点击关闭按钮测试可用性。</p>
    </Dialog>
  </div>
</template>
