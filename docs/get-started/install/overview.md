---
unlisted: true
title: 安装方式怎么选
description: Comfy Desktop、Windows 便携版、手动安装三种方式的区别与选择建议
---

# 安装方式怎么选

ComfyUI 有三种安装方式。无论哪种方式，ComfyUI 都运行在一个独立的 Python 环境中，功能上没有差异，区别只在于**安装省心程度**和**更新通道**。

## 三种方式对比

| 方式 | 适用系统 | 特点 | 适合人群 |
| ---- | -------- | ---- | -------- |
| **Comfy Desktop（桌面版）** | Windows / macOS（Apple Silicon） | 图形化安装器，可多实例管理；默认跟踪**稳定版** | 新手首选 |
| **Windows 便携版** | 仅 Windows | 内嵌 Python 环境，解压即用；始终使用**最新提交** | 想免安装、追新功能的 Windows 用户 |
| **手动安装** | Windows / macOS / Linux | 从源码部署，支持所有 GPU 类型（Nvidia、AMD、Intel、Apple Silicon 等） | 开发者、Linux 用户、其他显卡用户 |

<Tip>
  Desktop 安装默认跟踪 ComfyUI 的**稳定版**。如果想始终使用最新提交，请使用便携版或手动 git 安装，或把实例更新通道改为 **Latest on GitHub**。
</Tip>

## 选择建议

- **第一次接触 ComfyUI，用 Windows 或 Apple 芯片 Mac** → 选 [Comfy Desktop](/docs/get-started/install/desktop)
- **Windows 用户，喜欢绿色软件、想体验最新功能** → 选 [Windows 便携版](/docs/get-started/install/portable)
- **Linux 用户、AMD/Intel 显卡用户、或想完全掌控 Python 环境** → 选 [手动安装](/docs/get-started/install/manual)

<Note>
  没有合适的本地显卡、或不想做任何安装时，也可以使用官方云服务 [Comfy Cloud](https://docs.comfy.org/zh/get_started/cloud)，在浏览器里直接运行工作流。
</Note>

开始安装前，请先确认你的设备满足[系统要求](/docs/get-started/system-requirements)。
