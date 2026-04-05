# drift-ui 发布与版本管理手册

本文档用于规范 `@drift/ui` 的后续版本发布流程。默认采用 `Changesets + GitHub Actions + npm` 自动发布链路。

## 1. 版本策略

- 遵循 `SemVer`：
  - `major`：破坏性变更（API 不兼容、行为语义变化）
  - `minor`：向后兼容的新能力
  - `patch`：向后兼容的缺陷修复/小改进
- 默认发布包：`@drift/ui`
- `apps/docs` 不发布到 npm（已在 changeset 配置中忽略）

## 2. 发布前门禁（必须全部通过）

在本地执行：

```bash
pnpm release:verify
```

该命令会依次执行：

- `pnpm lint`
- `pnpm test`
- `pnpm typecheck`
- `pnpm build`
- `pnpm harness`
- `pnpm meta:check`

任何一步失败都不得进入发布阶段。

## 3. 常规发布流程（推荐）

### Step 1：创建 changeset

```bash
pnpm changeset
```

交互选择建议：

- package: `@drift/ui`
- bump 类型：`patch | minor | major`
- summary：聚焦“为什么发布”，避免仅写“改了什么”

### Step 2：生成版本与 changelog

```bash
pnpm version-packages
```

会更新：

- `packages/ui/package.json` 版本号
- `packages/ui/CHANGELOG.md`
- 删除已消费的 `.changeset/*.md`

### Step 3：提交并推送

```bash
git add .
git commit -m "chore(release): prepare vX.Y.Z"
git push
```

仓库中的 `release.yml` 会自动触发发布。

## 4. 首发（1.0.0）建议流程

如果是首次发布：

1. 至少准备 1 个 `major` changeset
2. 确认 npm 包名可用：`npm view @drift/ui`
3. 确认仓库已配置 `NPM_TOKEN` secret
4. 推送 `main` 后观察 `Release` workflow 日志

## 5. 预发布流程（beta/rc）

当需要灰度验证时：

```bash
pnpm changeset pre enter beta
pnpm changeset
pnpm version-packages
git add .
git commit -m "chore(release): beta prerelease"
git push
```

结束预发布并回到稳定发布：

```bash
pnpm changeset pre exit
git add .
git commit -m "chore(release): exit prerelease"
git push
```

## 6. 紧急补丁流程（hotfix）

适用于线上严重问题：

1. 在 `main` 基础创建 hotfix 分支
2. 仅做最小修复（禁止夹带重构）
3. 执行 `pnpm release:verify`
4. 生成 `patch` changeset
5. `pnpm version-packages` 后提交并合并到 `main`
6. 推送后自动发布

## 7. 发布失败处理

### 7.1 CI 失败（未发布）

- 根据 Action 日志修复问题
- 重新 push 触发 workflow

### 7.2 npm 发布失败（部分步骤成功）

- 检查 `NPM_TOKEN` 权限（automation token）
- 检查包版本是否已存在
- 若版本冲突，新增一个 `patch` changeset 后重新发布

### 7.3 已发布版本有缺陷

不建议 unpublish，建议：

1. 立即提交补丁
2. 走 `patch` 版本快速修复发布
3. 必要时执行 deprecate：

```bash
npm deprecate @drift/ui@X.Y.Z "This version has critical issues, please upgrade."
```

## 8. 提交与发布规范

- commit 信息必须通过 `commitlint`
- pre-commit 默认执行 `lint + typecheck`
- 任何发布相关 PR 必须包含：
  - 变更说明（用户影响）
  - 风险说明（兼容性/迁移成本）
  - 验证结果（`release:verify`）

## 9. 依赖版本管理规则（避免 latest 漂移）

- 不建议在 `package.json` 中使用 `latest`。
- 所有依赖应使用明确版本（如 `1.2.3`）或明确范围（如 `^1.2.3`）。
- 本项目当前采用“锁定已验证版本 + lockfile 冻结安装”策略：
  - 安装阶段统一使用 `pnpm-lock.yaml`；
  - CI 使用 `pnpm install --frozen-lockfile` 保证可复现。
- 查询当前实际安装版本：

```bash
pnpm list -r --depth 0
```

## 10. 标准命令速查

```bash
# 新增发布记录
pnpm changeset

# 生成版本与 changelog
pnpm version-packages

# 发布前总校验
pnpm release:verify

# 手动发布（仅特殊场景）
pnpm -r publish --access public
```

## 11. 版本决策指引（简版）

- `patch`：修 bug、文案修正、内部实现优化（无 API 变化）
- `minor`：新增组件能力/新增可选 props（兼容旧用法）
- `major`：删除/重命名 API、默认行为变化、迁移成本明显

如遇争议，以“是否影响现有用户无改动升级”为判断标准：

- 不影响：`minor/patch`
- 影响：`major`
