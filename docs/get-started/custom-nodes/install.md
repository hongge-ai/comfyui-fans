---
unlisted: true
title: 如何在 ComfyUI 中安装自定义节点
description: 使用 ComfyUI Manager、git clone 或 ZIP 下载在 ComfyUI 中安装自定义节点，并安全安装其 Python 依赖
---

# 如何在 ComfyUI 中安装自定义节点

> 使用 ComfyUI Manager、git clone 或 ZIP 下载在 ComfyUI 中安装自定义节点，并安全安装其 Python 依赖。

## 什么是自定义节点？

自定义节点是 ComfyUI 的扩展，能够增加新功能，如高级图像处理、机器学习微调、颜色调整等。这些节点由社区开发，可显著扩展 ComfyUI 的核心能力。

<Warning>
  在安装自定义节点之前，请务必仔细审查它们。由于 ComfyUI 是一个开源项目，恶意插件可能会利用自定义节点进行攻击：

  1. 只安装来自可信作者和社区常用的自定义节点
  2. 在安装前了解插件的功能，并避免未知来源，以确保系统安全
  3. 避免安装冷门或可疑的插件 - 未经审核的插件可能存在安全风险，可能导致系统被攻破
</Warning>

所有自定义节点的安装都需要完成以下两个步骤：

1. 将节点代码克隆到 `ComfyUI/custom_nodes` 目录
2. 安装所需的 Python 依赖项

本指南比较了三种安装方法。**ComfyUI Manager** 已内置到当前大多数 ComfyUI 发行版中。先从 [ComfyUI Manager 概述](/docs/get-started/custom-nodes/manager) 了解其功能及如何启用。当某个节点不在注册表中，或你需要特定版本时，请使用 **Git clone** 或 **ZIP**。

| 方法                      | 优点                                  | 缺点                                        |
| ----------------------- | ----------------------------------- | ----------------------------------------- |
| **ComfyUI Manager**（推荐） | 1. 自动化安装<br />2. 依赖项处理<br />3. 图形界面 | 无法直接搜索未在注册表中注册的节点                         |
| **Git Clone**           | 可以安装未在注册表中注册的节点                     | 1. 需要 Git 知识<br />2. 手动处理依赖项<br />3. 安装风险 |
| **仓库 ZIP 下载**           | 1. 无需 Git<br />2. 手动控制              | 1. 手动处理依赖项<br />2. 无版本控制<br />3. 安装风险     |

提示：在安装自定义节点之前，请查看插件的 README 文件，以了解其安装方法、使用方法以及依赖项，例如特定模型、依赖版本和常见问题的解决方案。

## 方法一：ComfyUI Manager（推荐）

<Note>
  使用此方法前，请确认你的环境中已可用 ComfyUI Manager。若缺失或未启用，请参阅 [ComfyUI Manager 概述](/docs/get-started/custom-nodes/manager) 和 [安装指南](/docs/get-started/custom-nodes/manager-install)。
</Note>

ComfyUI Manager 提供了两种 UI 版本来管理自定义节点。请选择与你界面匹配的指南：

<Columns cols={2}>
  <Card title="新 UI（Desktop 用户默认启用）" icon="sparkles" href="https://docs.comfy.org/zh/manager/pack-management">
    新版节点管理界面，Desktop 用户默认启用。
  </Card>

  <Card title="传统 UI" icon="rectangle-history" href="https://docs.comfy.org/zh/manager/legacy-ui">
    经典的 Manager 界面，用于安装自定义节点。
  </Card>
</Columns>

## 方法二：使用 Git 手动安装

适用于在管理器（Manager）中找不到的新节点，或需要特定版本的情况。需要你的系统已安装 [Git](https://git-scm.com/)。

<Steps>
  <Step title="获取仓库地址">
    在 GitHub 上点击“Code”按钮并复制 HTTPS 链接
  </Step>

  <Step title="进入 custom_nodes 目录">
    ```bash theme={null}
    cd /path/to/ComfyUI/custom_nodes
    ```
  </Step>

  <Step title="克隆仓库">
    ```bash theme={null}
    git clone [repository URL]
    ```
  </Step>

  <Step title="安装依赖">
    必须在你的 ComfyUI 环境中安装依赖，注意不要与你的系统环境混淆，以免造成污染

    <Tabs>
      <TabItem value="Windows 便携版">
        对于 Windows 便携版，请在嵌入式 Python 环境中安装依赖

        ```bash theme={null}
        python_embeded\python.exe -m pip install -r ComfyUI\custom_nodes\[node directory]\requirements.txt
        ```
      </TabItem>

      <TabItem value="手动安装">
        在你的 ComfyUI 环境中安装依赖

        ```bash theme={null}
        cd [node directory]
        pip install -r requirements.txt
        ```
      </TabItem>
    </Tabs>
  </Step>

  <Step title="重新启动 ComfyUI 并刷新浏览器">
    重新启动 ComfyUI 并刷新浏览器。检查启动日志中是否有任何 `import failed` 错误
  </Step>
</Steps>

## 方法三：ZIP 下载安装

适用于无法使用 Git 或 Manager 的用户。

<Warning>
  我们不推荐这种安装方式，因为它会失去版本控制能力。
</Warning>

<Steps>
  <Step title="在 GitHub 上点击 `Code` → `Download ZIP`">
    在 GitHub 页面点击 `Code` → `Download ZIP`

    <img src="/img/installation/custom_nodes/install-custom-nodes-by-zip.jpg" alt="点击 Code → Download ZIP" width="2000" height="1115" data-path="images/installation/custom_nodes/install-custom-nodes-by-zip.jpg" />
  </Step>

  <Step title="解压 ZIP 文件">
    解压下载的 ZIP 文件
  </Step>

  <Step title="将解压后的文件夹复制到 `ComfyUI/custom_nodes/` 目录">
    将解压得到的文件夹复制到 `ComfyUI/custom_nodes/` 目录下
  </Step>

  <Step title="手动安装依赖（同 Git 方法第 4 步）">
    重启 ComfyUI 并刷新浏览器
  </Step>

  <Step title="验证安装是否成功">
    重启后在 ComfyUI Manager 中确认插件安装成功，且没有 `import failed` 错误
  </Step>
</Steps>

## 自定义节点资源

在 ComfyUI 中，除了基本的节点扩展功能之外，自定义节点还可以包含以下附加资源：

* [节点文档](https://docs.comfy.org/zh/custom-nodes/help_page)：该功能支持所有自定义节点和基础节点。您可以使用它查看节点文档、了解节点的用途和用法，并通过 PR 向作者贡献文档。
* [自定义节点工作流模板](https://docs.comfy.org/zh/custom-nodes/workflow_templates)：由节点作者提供的示例工作流模板，可以从 ComfyUI 模板中浏览和加载。
* [多语言支持](https://docs.comfy.org/zh/custom-nodes/i18n)

如果您是自定义节点开发者，可以添加这些资源，让您的自定义节点对用户更友好。
