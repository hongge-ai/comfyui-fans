---
unlisted: true
---

# 模型

> ComfyUI 中的模型文件：放在哪里、如何在节点里使用，以及常见问题。

## 简单理解「模型」

在 ComfyUI 里，**模型**一般指真正参与运算的**权重文件**，例如 **checkpoint**、**VAE**、**LoRA**、**ControlNet**、放大模型等。安装包本身体积不大，这些文件**默认不会随安装附带**。常见做法是**从网上下载**后放进 `ComfyUI/models/` 对应子文件夹，或按工作流/模板提示补全；然后在画布上的**加载器节点**里选中该文件（界面里这类节点名称里通常带有 **Load** 字样）。

### ComfyUI 支持的模型

* **官方直接覆盖的模型数量有限**，但随着 ComfyUI 与开源社区的发展，支持面会持续扩展。一旦某模型纳入支持，**通常会在 [工作流模板](/docs/interface/template) 中增加对应模板**，便于一键对照使用。
* **并非所有模型都能开箱即用。** 若你使用的是 **ComfyUI 原生支持的模型及其常见衍生/配套权重**，请先 [将 ComfyUI 更新到较新版本](/docs/get-started/update)，并在 [模板库](/docs/interface/template) 中确认是否已有匹配的模板与模型提示。
* **另一部分模型依赖社区提供的自定义节点** 才能使用；不同作者的 **模型路径、节点用法可能不一致**。请务必阅读各项目自带的 **README 或文档** 并按说明操作。ComfyUI 本身扩展方式较自由，因此实现细节会因作者而异；需要安装或排查自定义节点时，可参考 [如何安装自定义节点](/docs/get-started/custom-nodes/install)。

## 在 ComfyUI 里使用模型

1. **把文件放到正确的位置**：从 [Hugging Face](https://huggingface.co)、[Civitai](https://civitai.green) 或 [GitHub](https://github.com) 等项目页下载后，放入 `ComfyUI/models/` 下与类型对应的子文件夹（例如 `checkpoints`、`loras`、`vae`）。
2. **添加对应的加载器节点**：按模型类型选择加载器（checkpoint、LoRA、VAE 等）。在节点列表中，这类节点名称里通常带有 **Load**。
3. 在加载器节点的下拉菜单中**选择文件**。
4. **把加载器节点连入**工作流的其余部分。如果是在 ComfyUI 打开时手动拖入文件，**重新启动**应用（或在需要时刷新），以便列表更新。

### 下载文件通常很大

单个生成模型经常是**数 GB 级别**。下载或同步时请预留足够的磁盘空间和时间。

## 主 checkpoint 之外的常用模型

主扩散 checkpoint 能完成很多任务，但常见工作流还会叠加**体积更小的辅助模型**，例如：

* **LoRA**：针对某种风格、角色或概念训练的轻量附加权重
* **ControlNet**：用线稿、深度、姿态等引导构图
* **Inpainting**：在已有图像的局部区域生成或替换内容

<img src="/img/concepts/core-concepts_auxiliary-model.png" alt="辅助模型" width="1920" height="1080" data-path="images/concepts/core-concepts_auxiliary-model.png" />

## 卸载模型

目前界面里没有统一的「卸载」入口。若要移除某个模型，请在 `ComfyUI/models/` 下找到当初放置的**对应文件并手动删除**。

## 添加外部模型路径

如果你想要在 `ComfyUI/models` 之外管理你的模型文件，可能出于以下原因:

* 你有多个 ComfyUI 实例，你想要让这些实例共享模型文件，从而减少磁盘占用
* 你有多个不同的类型的 GUI 程序，如：WebUI, 你想要他们共用模型文件
* 模型文件无法被识别或读取到

我们提供了通过 `extra_model_paths.yaml` 配置文件来添加额外模型搜索路径的方法。

### 不同 ComfyUI 版本配置文件位置

<Tabs>
  <TabItem value="Portable 及自部署">
    对于[便携版](/docs/get-started/install/portable)和[手动安装](/docs/get-started/install/manual)的 ComfyUI版本，你可以在 ComfyUI 的根目录下找到 `extra_model_paths.yaml.example` 的示例文件

    ```
    ComfyUI/extra_model_paths.yaml.example
    ```

    复制并重命名为 `extra_model_paths.yaml` 来使用, 并保持在 ComfyUI 的根目录下, 路径应该是 `ComfyUI/extra_model_paths.yaml`

    你也可以在 [这里](https://github.com/Comfy-Org/ComfyUI/blob/master/extra_model_paths.yaml.example) 找到配置示例文件
  </TabItem>

  <TabItem value="Comfy Desktop">
    如果你使用的是 ComfyUI 桌面应用程序，你可以参考下图打开额外模型的配置文件：

    <img src="/img/desktop/extra_model_paths.png" alt="Open Config File" width="2004" height="1442" data-path="images/desktop/extra_model_paths.png" />

    或者通过下面的位置打开：

    <Tabs>
      <TabItem value="Windows">
        ```
        C:\Users\YourUsername\AppData\Roaming\ComfyUI\extra_models_config.yaml
        ```
      </TabItem>

      <TabItem value="macOS">
        ```
        ~/Library/Application Support/ComfyUI/extra_models_config.yaml
        ```
      </TabItem>
    </Tabs>

    对应的配置文件不应该被改变
  </TabItem>
</Tabs>

### 配置示例

比如，你需要额外让 ComfyUI 识别的模型文件位于下面的文件夹:

```
📁 YOUR_PATH/
  ├── 📁models/
  |   ├── 📁 loras/
  |   │   └── xxxxx.safetensors
  |   ├── 📁 checkpoints/
  |   │   └── xxxxx.safetensors
  |   ├── 📁 vae/
  |   │   └── xxxxx.safetensors
  |   └── 📁 controlnet/
  |       └── xxxxx.safetensors
```

那么你可以进行如下的配置来让 ComfyUI 识别到你设备上的模型路径

```
my_custom_config:
    base_path: YOUR_PATH
    loras: models/loras/
    checkpoints: models/checkpoints/
    vae: models/vae/
    controlnet: models/controlnet/
```

或者使用

```
my_custom_config:
    base_path: YOUR_PATH/models/
    loras: loras
    checkpoints: checkpoints
    vae: vae
    controlnet: controlnet
```

<Warning>
  对于桌面版，请在原有配置路径下新增配置，而不覆盖掉安装过程中自动生成的路径配置，请在修改前备份对应的文件，这样在你配置错误时可以及时恢复
</Warning>

或者你也可以参考默认的 [extra\_model\_paths.yaml.example](https://github.com/Comfy-Org/ComfyUI/blob/master/extra_model_paths.yaml.example) 来配置，保存之后， 需要 **重启 ComfyUI** 才能生效。

下面是完整的原始的配置配置示例:

```yaml theme={null}
#Rename this to extra_model_paths.yaml and ComfyUI will load it


#config for a1111 ui
#all you have to do is change the base_path to where yours is installed
a111:
    base_path: path/to/stable-diffusion-webui/

    checkpoints: models/Stable-diffusion
    configs: models/Stable-diffusion
    vae: models/VAE
    loras: |
         models/Lora
         models/LyCORIS
    upscale_models: |
                  models/ESRGAN
                  models/RealESRGAN
                  models/SwinIR
    embeddings: embeddings
    hypernetworks: models/hypernetworks
    controlnet: models/ControlNet

#config for comfyui
#your base path should be either an existing comfy install or a central folder where you store all of your models, loras, etc.

#comfyui:
#     base_path: path/to/comfyui/
#     # You can use is_default to mark that these folders should be listed first, and used as the default dirs for eg downloads
#     #is_default: true
#     checkpoints: models/checkpoints/
#     clip: models/clip/
#     clip_vision: models/clip_vision/
#     configs: models/configs/
#     controlnet: models/controlnet/
#     diffusion_models: |
#                  models/diffusion_models
#                  models/unet
#     embeddings: models/embeddings/
#     loras: models/loras/
#     upscale_models: models/upscale_models/
#     vae: models/vae/

#other_ui:
#    base_path: path/to/ui
#    checkpoints: models/checkpoints
#    gligen: models/gligen
#    custom_nodes: path/custom_nodes

```

### 添加额外自定义节点路径

除了添加外部模型之外，你同样可以添加不在 ComfyUI 默认路径下的自定义节点路径

<Tip>
  请注意，这并不会改变自定义节点的默认安装路径，只是在启动 ComfyUI 时会增加额外的路径搜索，你仍旧需要在对应的环境中完成自定义节点的依赖的安装，来保证其运行环境的完整性。
</Tip>

下面是一个简单的配置示例（Mac 系统），请根据你的实际情况进行修改，并新增到对应的配置文件中，保存后需要 **重启 ComfyUI** 才能生效:

```yaml theme={null}
my_custom_nodes:
  custom_nodes: /Users/your_username/Documents/extra_custom_nodes
```

## 常见问题

<AccordionGroup>
  <Accordion title="ComfyUI 支持 GGUF 格式的模型吗？">
    ComfyUI 原生不支持 GGUF 格式。需要使用社区自定义节点（例如 [ComfyUI-GGUF](https://github.com/city96/ComfyUI-GGUF)）才能获得支持。
  </Accordion>

  <Accordion title="为什么找不到我的模型？">
    若已放入模型但在 ComfyUI 里看不到，可依次尝试：

    * 确认路径与文件夹是否正确：
      * **Comfy Desktop**：**帮助** → **打开文件夹** → **打开模型文件夹**，核对实际路径
      * 文件是否放在对应子目录中（如 `checkpoints`、`loras`、`vae`）
    * 按快捷键 **`r`** 刷新节点定义，让 ComfyUI 重新扫描
    * 重启 ComfyUI
    * 在对应的加载器节点中确认已选中正确的模型
  </Accordion>
</AccordionGroup>

## 想多了解一点原理？

<AccordionGroup>
  <Accordion title="这里的「模型」到底指什么？">
    这里的 **模型**指保存了网络所学参数的数据文件，足以把输入（如文本与噪波）变成输出（如图像）。图像工作流里常见的是 **扩散** checkpoint、**CLIP** 这类文本/图像编码器，以及 **RealESRGAN** 等**放大**模型。
  </Accordion>

  <Accordion title="基础模型与社区改版">
    实验室或开源项目发布的大型 **基础模型**偏通用。社区常在其基础上 **微调**、合并，得到新的 checkpoint 或 LoRA：画面更符合某种风格、在同等硬件上更省资源，或带来新能力。这与在 Civitai、Hugging Face 上挑选模型是同一回事。
  </Accordion>
</AccordionGroup>
