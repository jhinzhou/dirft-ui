---
layout: home

hero:
  name: drift-design
  text: AI-ready Vue Component Library
  tagline: 为 Vue + TS + Vite 打造的可交互组件库，内置 i18n、主题切换、Harness 验收与 AI 元数据。
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 组件演示
      link: /components/button

features:
  - title: 交互演示优先
    details: 每个核心组件页面都提供可直接操作的 Demo，而不是仅展示代码片段。
  - title: 主题与国际化内建
    details: 语义 Token + Theme Provider + zh-CN/en-US 双语基础能力，开箱可扩展。
  - title: AI 友好工程化
    details: component-meta、llms 索引、Prompt 规范与 Harness Gate，支持代理可靠生成代码。
---

## Install

```bash
pnpm add drift-design
```

## Usage

```ts
import "drift-design/styles.css";
import { Button } from "drift-design";
```
