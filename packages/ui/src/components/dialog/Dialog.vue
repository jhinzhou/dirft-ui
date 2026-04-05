<script setup lang="ts">
import { Cross2Icon } from "@radix-icons/vue";
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger
} from "radix-vue";
import { computed } from "vue";
import { useDriftI18n } from "@/i18n";
import { cn } from "@/lib/utils";

interface DialogProps {
  title: string;
  class?: string;
}

const props = withDefaults(defineProps<DialogProps>(), {
  class: ""
});

const { t } = useDriftI18n();
const dialogClass = computed(() =>
  cn(
    "fixed left-1/2 top-1/2 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[rgb(var(--drift-border))] bg-[rgb(var(--drift-background))] p-4 text-[rgb(var(--drift-foreground))]",
    props.class
  )
);
</script>

<template>
  <DialogRoot>
    <DialogTrigger as-child>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-40 bg-black/30" />
      <DialogContent
        class="z-50"
        :class="dialogClass"
      >
        <div class="mb-4 flex items-center justify-between">
          <DialogTitle class="text-base font-semibold">
            {{ title }}
          </DialogTitle>
          <DialogClose
            class="rounded p-1 text-[rgb(var(--drift-foreground))] hover:opacity-80"
            :aria-label="t('dialog.close')"
          >
            <Cross2Icon />
          </DialogClose>
        </div>
        <slot />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
