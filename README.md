# drift-design

`drift-design` 是一个基于 Vue + TypeScript + Vite 的组件库 Monorepo，目标是同时面向开发者与 AI 代理友好。

## Workspace

- `packages/ui`: 组件库源码、测试、harness、元数据生成
- `apps/docs`: VitePress 文档站

## 常用命令

- `pnpm lint`: 代码检查（含 i18n/theme 校验）
- `pnpm test`: 单元测试
- `pnpm typecheck`: TS 类型检查
- `pnpm build`: 构建组件库与文档
- `pnpm harness`: 组件交付验收（7 类 Gate）
- `pnpm docs:dev`: 本地启动 VitePress 文档站
- `pnpm docs:build`: 构建文档静态产物
- `pnpm docs:preview`: 预览文档构建结果

## 发布文档

- 版本发布与回滚规范：`docs/release-process.md`

## 文档站

- GitHub Pages: `https://jhinzhou.github.io/dirft-ui/`
