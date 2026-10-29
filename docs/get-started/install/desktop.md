---
unlisted: true
title: 适用于 Windows / macOS 的 Comfy Desktop
description: 在 Windows 或 macOS 上安装 Comfy Desktop：系统要求、安装步骤、更新与彻底卸载
---

# 适用于 Windows / macOS 的 Comfy Desktop

> 在 Windows 或 macOS 上安装 Comfy Desktop：系统要求、安装步骤、更新，以及如何彻底卸载并本地运行 ComfyUI。

**Comfy Desktop** 是一个多安装管理器，可让你从单个启动器运行多个 ComfyUI 实例。本指南介绍如何安装、更新和卸载 Comfy Desktop。Linux 没有正式安装包，需[从源码运行](https://docs.comfy.org/zh/installation/desktop/linux)或选择[手动安装](/docs/get-started/install/manual)。

## 系统要求

<Tabs>
  <TabItem value="Windows">

  * **操作系统：** Windows 10 或更高版本
  * **架构：** x64 或 ARM64
  * **GPU：** 推荐使用独立显卡（NVIDIA / AMD）以获得良好性能，但并非必需
  * **磁盘空间：** 每次安装推荐至少 4.85 GB

  </TabItem>
  <TabItem value="macOS">

  * **系统：** macOS 13 (Ventura) 或更新版本
  * **硬件：** Apple Silicon（M1 或更新）
  * **磁盘空间：** 每个安装建议至少 4.85 GB

  </TabItem>
</Tabs>

<Card title="下载 Comfy Desktop" icon="download" href="https://comfy.org/download">
  下载最新安装程序。页面将自动检测您的平台。
</Card>

## 安装

<Tabs>
  <TabItem value="Windows">

  运行下载的 `.exe` 安装程序（NSIS 安装器），然后按照提示操作。安装之后，从开始菜单或桌面快捷方式启动 Comfy Desktop。

  <img src="/img/desktop/installation/windows_1_install.png" alt="Windows 安装" width="995" height="770" data-path="images/desktop/installation/windows_1_install.png" />

  </TabItem>
  <TabItem value="macOS">

  1. 打开下载的 `.dmg` 文件
  2. 将 **Comfy Desktop** 拖入 **Applications** 文件夹
  3. 从 Launchpad 或 Spotlight 启动

  <img src="/img/desktop/installation/mac_1_install.png" alt="Desktop MacOS" width="1098" height="866" data-path="images/desktop/installation/mac_1_install.png" />

  首次启动时，macOS 可能显示安全警告。前往**系统设置 → 隐私与安全性**，点击**仍要打开**以允许运行。

  </TabItem>
</Tabs>

当您首次打开应用时，您会看到**欢迎**屏幕，您可以在此创建您的第一个安装。

<Tip>
  **已经在用 Desktop Legacy？** Comfy Desktop 可以自动检测并迁移你现有的安装。自定义节点、工作流、模型和设置都会一并纳入——不会有任何丢失。旧版安装会保留不变作为备份。

  了解更多，请查阅[从旧版迁移](https://docs.comfy.org/zh/installation/desktop/usage/migrate)指南。
</Tip>

<Card title="下一步：使用 Comfy Desktop" icon="book-open" href="https://docs.comfy.org/zh/installation/desktop/usage/overview">
  安装完成后，了解如何创建实例、管理安装和配置设置。
</Card>

## 更新 Comfy Desktop

Comfy Desktop 会自动检查更新，你可以选择以下两种方式管理更新。（这里更新的是 Desktop 启动器本身；更新 ComfyUI 本体请见[如何更新 ComfyUI](/docs/get-started/update)。）

### 快速更新

当有可用更新时，窗口顶部会显示 **Desktop Update Ready** 按钮：

<img src="/img/desktop/installation/install_update_1.png" alt="Desktop Update Ready 按钮" width="2316" height="1247" data-path="images/desktop/installation/install_update_1.png" />

直接点击 ① **Desktop Update Ready** 按钮，Comfy Desktop 就会重启并自动安装更新。

### 通过设置手动更新

你也可以从设置面板检查和管理更新：

<Steps>
  <Step title="打开 Desktop Settings">
    <img src="/img/desktop/installation/install_update_2-1.png" alt="打开 Desktop Settings 菜单" width="2315" height="1250" data-path="images/desktop/installation/install_update_2-1.png" />

    1. **①** 点击左上角的汉堡菜单
    2. **②** 选择 **Desktop Settings**
  </Step>

  <Step title="Updates 面板">
    <img src="/img/desktop/installation/install_update_2-2.png" alt="Desktop Settings 的 Updates 面板" width="2315" height="1248" data-path="images/desktop/installation/install_update_2-2.png" />

    在 **Updates** 面板中：

    1. **① Updates** — 点击侧边栏的 Updates 标签
    2. **② Check for updates** — 手动检查是否有可用更新
    3. **③ Restart & Update** — 当有新版本时出现，点击重启并更新
    4. **④ Automatically install Desktop updates** — 开关自动安装桌面版更新
  </Step>
</Steps>

## 卸载

<Tabs>
  <TabItem value="Windows">

  1. 前往 **设置 → 应用 → 已安装的应用**
  2. 找到 **Comfy桌面版** 并点击 **卸载**

  <img src="/img/desktop/installation/windows_2_uninstall.png" alt="在 Windows 上卸载 Comfy桌面版" width="2199" height="1290" data-path="images/desktop/installation/windows_2_uninstall.png" />

  卸载 Comfy桌面版只会移除启动器应用本身。如果你想要彻底清理，以下数据**不会**被移除，必须手动删除：

  | 数据       | 默认位置                                            | 描述                                                                                      |
  | -------- | ----------------------------------------------- | --------------------------------------------------------------------------------------- |
  | 安装       | `%LOCALAPPDATA%\Comfy-Desktop\ComfyUI-Installs` | 你创建的每个 ComfyUI 安装（也可以从应用内删除）。自定义安装路径也不会被移除。较旧的安装可能仍位于 `%USERPROFILE%\ComfyUI-Installs`。 |
  | 共享模型与输出  | `%LOCALAPPDATA%\Comfy-Desktop\ComfyUI-Shared`   | 共享模型库、输入/输出目录。较旧的安装可能仍会使用 `%USERPROFILE%\ComfyUI-Shared`。                               |
  | 应用设置与注册表 | `%APPDATA%\Comfy Desktop`                       | 设置和安装记录                                                                                 |
  | 日志       | `%APPDATA%\Comfy Desktop\logs`                  | 桌面应用日志（`app.log`）                                                                       |

  <Warning>以上列出的目录包含你的**个人 ComfyUI 数据**：模型、输出、设置和安装。它们**不是** Comfy桌面版 的应用文件。删除它们将永久移除你的数据。</Warning>

  要完全移除所有内容：

  1. **删除应用数据文件夹**：`%APPDATA%\Comfy Desktop`
  2. **从应用内删除各个安装**，或手动删除 `%LOCALAPPDATA%\Comfy-Desktop\ComfyUI-Installs`（如果安装创建于 `%USERPROFILE%\ComfyUI-Installs`，则删除该路径）。同时删除你配置过的自定义安装目录
  3. **删除共享模型库**：仅在不再需要这些文件时，删除 `%LOCALAPPDATA%\Comfy-Desktop\ComfyUI-Shared`（或 `%USERPROFILE%\ComfyUI-Shared`）

  </TabItem>
  <TabItem value="macOS">

  1. 在访达中打开 **Applications** 文件夹
  2. 右键点击 **Comfy Desktop**，选择 **移到废纸篓**

  <img src="/img/desktop/installation/mac_2_uninstall.png" alt="在 macOS 上卸载 Comfy Desktop" width="1750" height="1346" data-path="images/desktop/installation/mac_2_uninstall.png" />

  卸载 Comfy Desktop 只会移除启动器本身。以下数据**不会被删除**，如需完全清理请手动删除：

  | 数据      | 默认位置                                          | 说明                                     |
  | ------- | --------------------------------------------- | -------------------------------------- |
  | 安装实例    | `~/ComfyUI-Installs`                          | 每个 ComfyUI 安装（也可在应用内删除）。自定义安装路径也不会被删除。 |
  | 共享模型和输出 | `~/ComfyUI-Shared`                            | 共享模型库、输入/输出目录                          |
  | 应用设置和记录 | `~/Library/Application Support/Comfy Desktop` | 设置和安装记录                                |
  | 日志      | `~/Library/Logs/Comfy Desktop`                | 桌面应用日志（`app.log`）                      |

  <Warning>
    上述目录包含您的**个人 ComfyUI 数据**：模型、输出、设置和安装实例。它们**不是** Comfy Desktop 应用程序文件。删除它们将永久移除您的数据。
  </Warning>

  要完全清除所有数据：

  1. **删除应用数据文件夹**：`~/Library/Application Support/Comfy Desktop`
  2. **删除日志文件夹**：`~/Library/Logs/Comfy Desktop`
  3. **从应用内删除单个安装**，或手动删除 `~/ComfyUI-Installs` 以及你配置过的自定义安装目录
  4. **删除共享模型库** `~/ComfyUI-Shared`（仅当不再需要这些文件时）

  </TabItem>
</Tabs>
