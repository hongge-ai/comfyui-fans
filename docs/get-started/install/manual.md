---
unlisted: true
title: 手动安装 ComfyUI（Windows、macOS、Linux）
description: 在 Windows、macOS 或 Linux 上手动安装 ComfyUI：创建虚拟环境、克隆仓库、安装 GPU 依赖并启动应用
---

# 手动安装 ComfyUI（Windows、macOS、Linux）

> 在 Windows、macOS 或 Linux 上手动安装 ComfyUI：创建虚拟环境、克隆仓库、安装 GPU 依赖并启动应用。

对于 ComfyUI 的安装， 主要分为几个步骤

1. 创建一个虚拟环境(避免污染系统级 Python 环境)
2. 克隆 ComfyUI 代码仓库
3. 安装依赖
4. 启动 ComfyUI

## （可选）创建虚拟环境

<Tip>
  独立的虚拟环境是必要的，因为 ComfyUI 的依赖可能会与系统上的其他依赖冲突，也可以避免对系统级 Python 环境的污染。
</Tip>

[Install Miniconda](https://docs.anaconda.com/free/miniconda/index.html#latest-miniconda-installer-links). 这将帮助您安装 ComfyUI 所需的正确版本的 Python 和其他库。

使用 Conda 创建一个环境。

```
conda create -n comfyenv
conda activate comfyenv
```

## 克隆代码仓库

你需要保证你的系统上已经安装了 [Git](https://git-scm.com/downloads), 首先你需要打开终端（命令行）,然后克隆代码仓库。

<Tabs>
  <TabItem value="Windows">
    <Warning>如果你还没有安装 Microsoft Visual C++ Redistributable，请在[这里安装](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170)</Warning>
  </TabItem>

  <TabItem value="Linux">
    打开终端应用程序。
  </TabItem>

  <TabItem value="MacOS">
    打开[终端应用程序](https://support.apple.com/guide/terminal/open-or-quit-terminal-apd5265185d-f365-44cb-8b09-71a064a42125/mac)。
  </TabItem>
</Tabs>

```bash theme={null}
git clone https://github.com/Comfy-Org/ComfyUI.git
```

## 安装GPU 及 ComfyUI 依赖

<Steps>
  <Step title="安装 GPU 依赖">
    安装 GPU 依赖

    <Accordion title="Nvidia">
      ```
      pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu130
      ```

      或者，您可以安装 PyTorch 的 nightly 版本。

      <Accordion title="安装 Nightly 版本">
        <Warning>安装 Nightly 版本（可能存在一定风险）</Warning>

        ```
        pip install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cu132
        ```
      </Accordion>
    </Accordion>

    <Accordion title="AMD">
      ```
      pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm7.2
      ```

      或者，您可以安装 PyTorch 的 nightly 版本（ROCm 7.2）。

      <Accordion title="安装 Nightly 版本">
        <Warning>安装 Nightly 版本（可能存在一定风险）</Warning>

        ```
        pip3 install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/rocm7.2
        ```
      </Accordion>
    </Accordion>

    <Accordion title="Mac ARM Silicon">
      ```bash theme={null}
      conda install pytorch-nightly::pytorch torchvision torchaudio -c pytorch-nightly
      ```
    </Accordion>
  </Step>

  <Step title="安装 ComfyUI 依赖">
    ```bash theme={null}
    cd ComfyUI
    pip install -r requirements.txt
    ```
  </Step>

  <Step title="启动 ComfyUI">
    启动 ComfyUI

    ```
    cd ComfyUI
    python main.py
    ```

    运行 `python main.py --help` 查看内置帮助，或参阅[启动参数参考](https://docs.comfy.org/zh/development/comfyui-server/startup-flags)获取完整命令行选项列表。
  </Step>
</Steps>

如需高级服务器配置（自定义端口、局域网访问、VRAM 模式等），请参阅[启动参数参考](https://docs.comfy.org/zh/development/comfyui-server/startup-flags)。

## 如何更新 ComfyUI

手动安装的 ComfyUI 通过 `git pull` 拉取最新代码、再用 `pip install -r requirements.txt` 更新依赖来完成更新，详细步骤与常见问题请见[如何更新 ComfyUI](/docs/get-started/update)。

## 共享模型文件

如果你有多个 ComfyUI 实例，或想与 WebUI 等其他程序共用模型文件，可以通过 `extra_model_paths.yaml` 添加额外的模型搜索路径，详见[共享模型路径（extra_model_paths.yaml）](/docs/get-started/shared-models)。

## 常见问题

<Note>
  **Docker：** ComfyUI 不提供官方 Docker 镜像。若需在容器中运行，请自行在 [Docker Hub](https://hub.docker.com) 搜索社区维护的镜像，但**这些均非 ComfyUI 官方镜像**，也不受 ComfyUI 团队支持，请自行评估风险后使用。
</Note>

### 如何停止/退出 ComfyUI

在运行 ComfyUI 的终端窗口中按 **Ctrl+C**，或直接关闭终端窗口。
