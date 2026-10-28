# ComfyUI Fans（comfyui.fans）

一个面向零基础读者的 **ComfyUI 中文教学站**：参照 [docs.comfy.org](https://docs.comfy.org/zh) 的信息架构与视觉风格，用「总 — 分 — 总」的结构逐节点拆解官方工作流，致力于让每位爱好者都能真正学会 ComfyUI。

> 本站为个人学习用途的独立爱好者教学站，与 Comfy Org 无从属关系；全部教程文字为原创撰写。ComfyUI 是 [Comfy Org](https://github.com/comfyanonymous/ComfyUI) 的 GPL-3.0 开源项目。

## ✨ 特点

- **总分总教学结构**：每篇拆解均按「🎯 总览 → 🔍 逐节点精读 → ✅ 总结与练习」展开，篇与篇串成完整学习路径
- **官方风格复刻**：基于 Docusaurus 3 实现「左侧边栏 + 顶栏 + 正文 + 右侧目录」布局，官网同款紫金配色（`#49378B` / `#F2FF59`），明暗双主题
- **六色数据类型徽标**：MODEL / CLIP / CONDITIONING / LATENT / VAE / IMAGE 与画布连线颜色一一对应
- **Mermaid 工作流图**：每篇教程配骨架流程图，随主题自动切换配色

## 📚 内容地图

| 板块 | 内容 |
| ---- | ---- |
| 开始使用 | 介绍 · 安装 ComfyUI · 首次生成图像 |
| 基础概念 | 工作流 · 节点 · 连线与数据类型 · 模型 |
| 界面指南 | 界面概览与快捷键 |
| 官方工作流拆解 | 文生图 ★（原创深度长文） · 图生图 · 局部重绘 · 高清放大 · LoRA · ControlNet · 视频生成 |
| 总结 | 学习地图 · 参数速查卡 · 排错思维树 · 进阶路线 |

## 🚀 本地运行

```bash
npm install
npm run dev      # 开发预览 → http://127.0.0.1:3000
npm run build    # 生产构建 → build/
npm run serve    # 本地预览构建产物
```

要求 Node.js ≥ 18。

## 🌐 部署

`build/` 为纯静态产物，可部署到任意静态托管（GitHub Pages / Vercel / Cloudflare Pages）。仓库已内置 `static/CNAME`（comfyui.fans），使用 GitHub Pages 时在 Settings → Pages 绑定自定义域名即可。

## 📄 许可

站点代码与文字内容仅供学习交流。文中提及的 ComfyUI 及相关名称归其项目所有方所有。
