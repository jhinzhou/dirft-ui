---
aiKeywords:
  - button
  - action
componentRefs:
  - Button
useCases:
  - form-submit
  - destructive-action
---

# Button

## 交互演示

<ButtonInteractiveDemo />
<ThemeSwitchDemo />

## Basic

```vue
<Button>保存</Button>
```

## Variant

```vue
<Button variant="destructive">删除</Button>
```

## Theme + I18n

```vue
<script setup lang="ts">
import { Button, createDriftI18n, provideDriftI18n } from "@drift/ui";
const i18n = createDriftI18n({ locale: "en-US" });
provideDriftI18n(i18n);
</script>

<template>
  <Button>Submit</Button>
</template>
```
