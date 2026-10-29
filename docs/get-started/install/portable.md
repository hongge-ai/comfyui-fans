---
unlisted: true
title: 适用于 Windows 的 ComfyUI 便携版
description: 下载并运行 ComfyUI Portable（便携版）：内嵌 Python 与 CUDA 构建的独立套件，解压即可启动
---

# 适用于 Windows 的 ComfyUI 便携版

> 本篇教程将指导你如何下载并运行 ComfyUI Portable（便携版）：它是一個内嵌 Python 与 CUDA 构建、面向 NVIDIA GPU 的獨立套件。解压压缩包后即可启动 ComfyUI。

**ComfyUI Portable(便携版)** 是一个独立封装完整的 ComfyUI Windows 版本，内部已经整合了 ComfyUI 运行所需的独立的 **Python(python\_embeded)**，只需要解压即可使用。本部分指南将引导你完成对应的安装。

## 下载 ComfyUI Portable(便携版)

<Note>请根据你的显卡类型选择对应的下载包。ComfyUI Portable 为不同硬件提供了独立的安装包。</Note>

<Tabs>
  <TabItem value="NVIDIA 显卡">
    ### NVIDIA 显卡标准版

    <CardGroup cols={2}>
      <Card title="NVIDIA GPU (CUDA 13.0, Python 3.13)" icon="download" href="https://github.com/Comfy-Org/ComfyUI/releases/latest/download/ComfyUI_windows_portable_nvidia.7z">
        适用于现代 NVIDIA 显卡（RTX 系列）
      </Card>

      <Card title="NVIDIA GPU (CUDA 12.6, Python 3.12)" icon="download" href="https://github.com/Comfy-Org/ComfyUI/releases/latest/download/ComfyUI_windows_portable_nvidia_cu126.7z">
        支持 NVIDIA 10 系列及更早的显卡
      </Card>
    </CardGroup>

    下载后使用 [7-ZIP](https://7-zip.org/) 解压，解压后文件结构如下：

    ```
    ComfyUI_windows_portable
    ├── 📂ComfyUI                   // ComfyUI 程序主体
    ├── 📂python_embeded            // 独立的 Python 环境
    ├── 📂update                    // 用于升级便携版安装包的批处理脚本
    ├── README_VERY_IMPORTANT.txt   // 英文版本的 ComfyUI 便携版使用说明
    ├── run_cpu.bat                 // 双击启动 ComfyUI（仅支持 CPU）
    └── run_nvidia_gpu.bat          // 双击启动 ComfyUI（NVIDIA 显卡）
    ```

    双击 `run_nvidia_gpu.bat` 启动 ComfyUI。
  </TabItem>

  <TabItem value="AMD 显卡">
    ### AMD 显卡便携版

    <Card title="AMD GPU" icon="download" href="https://github.com/Comfy-Org/ComfyUI/releases/latest/download/ComfyUI_windows_portable_amd.7z">
      下载适用于 AMD 显卡的便携版（ROCm）
    </Card>

    下载后使用 [7-ZIP](https://7-zip.org/) 解压，解压后文件结构如下：

    ```
    ComfyUI_windows_portable_amd
    ├── 📂ComfyUI                   // ComfyUI 程序主体
    ├── 📂python_embeded            // 独立的 Python 环境
    ├── 📂update                    // 用于升级便携版安装包的批处理脚本
    ├── README_VERY_IMPORTANT.txt   // 英文版本的 ComfyUI 便携版使用说明
    ├── run_cpu.bat                 // 双击启动 ComfyUI（仅支持 CPU）
    └── run_amd_gpu.bat             // 双击启动 ComfyUI（AMD 显卡）
    ```

    双击 `run_amd_gpu.bat` 启动 ComfyUI。
  </TabItem>

  <TabItem value="Intel 显卡">
    ### Intel 显卡便携版

    <Card title="Intel GPU" icon="download" href="https://github.com/Comfy-Org/ComfyUI/releases/latest/download/ComfyUI_windows_portable_intel.7z">
      下载适用于 Intel 显卡的便携版
    </Card>

    下载后使用 [7-ZIP](https://7-zip.org/) 解压，解压后文件结构如下：

    ```
    ComfyUI_windows_portable_intel
    ├── 📂ComfyUI                   // ComfyUI 程序主体
    ├── 📂python_embeded            // 独立的 Python 环境
    ├── 📂update                    // 用于升级便携版安装包的批处理脚本
    ├── README_VERY_IMPORTANT.txt   // 英文版本的 ComfyUI 便携版使用说明
    ├── run_cpu.bat                 // 双击启动 ComfyUI（仅支持 CPU）
    └── run_intel_gpu.bat           // 双击启动 ComfyUI（Intel 显卡）
    ```

    双击 `run_intel_gpu.bat` 启动 ComfyUI。
  </TabItem>
</Tabs>

下载并解压后，你会看到对应下图所示的命令的运行

<img src="/img/comfyui-portable-cmd.png" alt="ComfyUI便携版运行命令提示符" width="1145" height="648" data-path="images/comfyui-portable-cmd.png" />

当你看到类似图片中的

```
To see the GUI go to: http://127.0.0.1:8188
```

此时你的 ComfyUI 服务已经启动，正常情况下 ComfyUI 会自动打开你的默认浏览器并访问 `http://127.0.0.1:8188` 地址，如果没有自动打开，请手动打开浏览器并访问该地址。

<Note>使用过程中请不要关闭对应的命令行窗口，否则 ComfyUI 将会停止运行</Note>

## 进行第一次图片生成

安装成功后，你可以参考访问下面的章节，开始你的 ComfyUI 之路。

<Card title="进行第一次图片生成" icon="link" href="/docs/get-started/first-generation">
  本教程将引导你完成第一次的模型安装以及对应的文本到图片的生成
</Card>

## 其它 ComfyUI 便携版相关说明

### 1. ComfyUI 便携版升级

你可以使用便携版安装目录下 **update** 文件夹中的批处理脚本完成升级，详细说明与注意事项（包括 `update_comfyui_and_python_dependencies.bat` 的风险）请见[如何更新 ComfyUI](/docs/get-started/update)。

```
ComfyUI_windows_portable
└─ 📂update
   ├── update.py
   ├── update_comfyui.bat            // 更新 ComfyUI 到最新的 Commit 版本
   ├── update_comfyui_and_python_dependencies.bat  // 请仅在你的运行环境存在问题时使用
   └── update_comfyui_stable.bat       // 更新 ComfyUI 为最新的 stable 版本
```

### 2. ComfyUI 便携版设置局域网访问

如果你的 ComfyUI 运行在局域网内，想要其它的设备也可以访问到 ComfyUI，你可以通过记事本修改对应的 `.bat` 文件（如 `run_nvidia_gpu.bat`、`run_amd_gpu.bat` 或 `run_cpu.bat`）来完成配置，主要通过添加 `--listen` 来添加监听地址
下面的示例是添加了 `--listen` 参数的 `run_nvidia_gpu.bat` 文件命令

```bat theme={null}
.\python_embeded\python.exe -s ComfyUI\main.py --listen --windows-standalone-build
pause
```

当启用 ComfyUI 后您会发现最后的运行地址会变为

```
Starting server

To see the GUI go to: http://0.0.0.0:8188
To see the GUI go to: http://[::]:8188
```

你可以通过 `WIN + R` 输入`cmd` 打开命令行，输入 `ipconfig` 来查看你的局域网 IP 地址，然后在其它设备上输入 `http://你的局域网IP:8188` 来访问 ComfyUI

### 3. 安装额外的 Python 包

便携版内置了独立的 Python 环境（`python_embeded`）。如需安装额外的 Python 包（如注意力优化、自定义节点依赖或其他工具），请在命令行中使用嵌入式 Python 的 pip：

```bash theme={null}
# 首先进入 ComfyUI 便携版文件夹
cd ComfyUI_windows_portable

# 使用嵌入式 Python 安装包
.\python_embeded\python.exe -m pip install <包名>
```

如果安装的包需要启动参数，在 `.bat` 文件（如 `run_nvidia_gpu.bat`）中添加对应参数：

```bat theme={null}
.\python_embeded\python.exe -s ComfyUI\main.py --<启动参数> --windows-standalone-build
```

有关安装自定义节点依赖的详细说明，请参阅[自定义节点依赖指南](/docs/concepts/custom-nodes)。

### 4. 共享模型文件

如果你有多个 ComfyUI 实例，或想与 WebUI 等其他程序共用模型文件，可以通过 `extra_model_paths.yaml` 添加额外的模型搜索路径，详见[共享模型路径（extra_model_paths.yaml）](/docs/get-started/shared-models)。
