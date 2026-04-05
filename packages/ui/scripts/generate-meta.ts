import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(readFileSync(resolve(currentDir, "../package.json"), "utf8")) as {
  version?: string;
};
const packageVersion = packageJson.version ?? "0.0.0";

const componentMeta = {
  package: "@drift-ui/ui",
  generatedAt: `version:${packageVersion}`,
  components: [
    {
      name: "Button",
      description: "语义化按钮组件，支持 variant 和 size。",
      props: {
        variant: ["primary", "secondary", "destructive"],
        size: ["sm", "md", "lg"],
        disabled: "boolean",
        type: ["button", "submit", "reset"]
      },
      slots: ["default"],
      events: [],
      a11y: ["focus-visible", "disabled-state"],
      tokens: ["primary", "primary-foreground", "destructive"]
    },
    {
      name: "Input",
      description: "输入框组件，支持 v-model。",
      props: {
        modelValue: "string",
        placeholder: "string",
        disabled: "boolean"
      },
      slots: [],
      events: ["update:modelValue"],
      a11y: ["focus-visible", "disabled-state"],
      tokens: ["background", "foreground", "border"]
    },
    {
      name: "Dialog",
      description: "基于 Radix Vue 的弹窗组件。",
      props: {
        title: "string"
      },
      slots: ["trigger", "default"],
      events: [],
      a11y: ["aria-label(close)", "focus-trap-via-radix"],
      tokens: ["background", "foreground", "border"]
    },
    {
      name: "FormField",
      description: "表单字段容器，支持 required 与错误提示。",
      props: {
        label: "string",
        required: "boolean",
        error: "string"
      },
      slots: ["default"],
      events: [],
      a11y: ["required-indicator"],
      tokens: ["foreground", "destructive"]
    },
    {
      name: "Card",
      description: "基础卡片容器。",
      props: {
        class: "string"
      },
      slots: ["default"],
      events: [],
      a11y: [],
      tokens: ["background", "foreground", "border"]
    }
  ]
};

const vscodeCustomData = {
  version: 1.1,
  tags: componentMeta.components.map((component) => ({
    name: `drift-${component.name.toLowerCase()}`,
    description: component.description,
    attributes: Object.entries(component.props).map(([name, value]) => ({
      name,
      description: typeof value === "string" ? value : value.join(" | ")
    }))
  }))
};

writeFileSync(resolve(currentDir, "../component-meta.json"), `${JSON.stringify(componentMeta, null, 2)}\n`, "utf8");
writeFileSync(
  resolve(currentDir, "../vscode-custom-data.json"),
  `${JSON.stringify(vscodeCustomData, null, 2)}\n`,
  "utf8"
);

console.log("Generated component-meta.json and vscode-custom-data.json");
