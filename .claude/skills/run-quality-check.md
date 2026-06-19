# 代码质量检查

运行完整的质量门禁检查。在提交代码前执行。

## 检查步骤

### 1. TypeScript 类型检查
```bash
npm run typecheck
```
确保零类型错误。

### 2. ESLint 代码规范
```bash
npm run lint
```
如有错误，运行 `npm run lint:fix` 自动修复。

### 3. Prettier 格式检查
```bash
npm run format:check
```
如有格式问题，运行 `npm run format` 自动格式化。

### 4. 构建验证
```bash
npm run build
```
确保生产构建成功。

### 一键执行全部
```bash
npm run check
```

## 处理规则

- 如果 typecheck 失败 → 修复类型错误，不要用 `@ts-ignore`
- 如果 lint 失败 → 先尝试 `lint:fix`，手动修复剩余问题
- 如果 format 失败 → 运行 `npm run format`
- 如果 build 失败 → 检查导入路径和依赖
- 所有检查通过后才能提交代码
