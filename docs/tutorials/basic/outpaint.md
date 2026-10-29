---
unlisted: true
---

# 扩图工作流示例

> ComfyUI 中的扩图工作流：使用 Pad Image for Outpainting 节点和局部重绘模型技术，将图像扩展到边界之外。

本篇将引导了解 AI 绘图中扩图的概念，并在 ComfyUI 中完成扩图工作流生成。我们将接触以下内容：

* 使用扩图工作流完成画面的扩展
* 了解并使用 ComfyUI 中的扩图相关节点
* 掌握扩图的基本操作流程

## 关于扩图

在 AI 图像生成过程中，我们经常会遇到这样的需求：已有的图片构图很好，但是画面范围太小，需要扩展画布来获得更大的场景，这时候就需要用到扩图功能。

这就像让 **画家(AI 绘图模型)** 在已有的画作基础上，向外延伸绘制更大的场景。我们需要告诉画家 **需要扩展的方向和范围**，画家会根据已有的画面内容，合理地延伸和扩展场景。

基本上它要求的内容与[局部重绘](/docs/tutorials/basic/inpaint)相似，只不过我们用来**构建遮罩（Mask）的节点不同**

扩图的应用场景包括：

* **场景扩展：** 扩大原有画面的场景范围，展现更完整的环境
* **构图调整：** 通过扩展画布来优化整体构图
* **内容补充：** 为原有画面添加更多相关的场景元素

## ComfyUI 扩图工作流示例讲解

### 准备工作

#### 1. 模型安装

请确保你已经在 `ComfyUI/models/checkpoints` 文件夹至少有一个 SD1.5 的模型文件，如果你还不了解如何安装模型，请参[开始 ComfyUI 的 AI 绘图之旅](/docs/get-started/first-generation#3-安装绘图模型)章节中关于模型安装的部分说明。

你可以使用下面的这些模型：

* [v1-5-pruned-emaonly-fp16.safetensors](https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/blob/main/v1-5-pruned-emaonly-fp16.safetensors)
* [Dreamshaper 8](https://civitai.com/models/4384?modelVersionId=128713)
* [Anything V5](https://civitai.com/models/9409?modelVersionId=30163)

- [512-inpainting-ema.safetensors](https://huggingface.co/Comfy-Org/stable_diffusion_2.1_repackaged/blob/main/512-inpainting-ema.safetensors)

#### 2. 输入图片

请准备一张你想要进行扩展的图片。在本例中，我们将使用下面这张图片作为示例：

<img src="/img/tutorial/basic/outpaint/input.png" alt="ComfyUI扩图输入图片" width="512" height="512" data-path="images/tutorial/basic/outpaint/input.png" />

#### 3. 扩图工作流

请下载下面的图片，并将其 **拖入** ComfyUI 界面或使用菜单 **工作流(Workflow)** --> **打开工作流(Open,快捷键 `Ctrl + O`)** 来加载这个扩图工作流

![ComfyUI Outpainting Workflow](/img/external/raw-githubusercontent-com/basic/outpaint.png)

### 扩图工作流使用讲解

<img src="/img/tutorial/basic/outpaint/outpainting_workflow.jpg" alt="ComfyUI 扩图工作流示意图" width="1818" height="1160" data-path="images/tutorial/basic/outpaint/outpainting_workflow.jpg" />

扩图工作流的关键步骤如下：

1. 请在 `加载模型(Load Checkpoint)` 节点中加载你本地安装的模型文件
2. 请在 `加载图片(Load Image)` 节点中点击 `Upload` 按钮上传
3. 点击 `Queue` 按钮，或者使用快捷键 `Ctrl + Enter(回车)` 来执行图片生成

在这个工作流中主要是通过 `Pad Image for outpainting` 节点来控制图片的扩展方向和范围，其实这也是一个 [局部重绘(Inpaint)](/docs/tutorials/basic/inpaint) 工作流，只不过我们用来构建遮罩（Mask）的节点不同。

### Pad Image for outpainting 节点

<img src="/img/comfy_core/image/pad_image_for_outpainting.jpg" alt="Pad Image for outpainting 节点" width="852" height="570" data-path="images/comfy_core/image/pad_image_for_outpainting.jpg" />

这个节点接受一个输入图片，并输出一张扩展过的图像和对应的遮罩（Mask），其中遮罩由于对应的节点参数构建。

#### 输入参数

| 参数名称         | 作用                           |
| ------------ | ---------------------------- |
| `image`      | 输入图片                         |
| `left`       | 左侧填充量                        |
| `top`        | 顶部填充量                        |
| `right`      | 右侧填充量                        |
| `bottom`     | 底部填充量                        |
| `feathering` | 控制原始图像与添加的填充内容之间的过渡平滑度，越大越平滑 |

#### 输出参数

| 参数名称    | 作用                     |
| ------- | ---------------------- |
| `image` | 输出`image`代表已填充的图像      |
| `mask`  | 输出`mask`指示原始图像和添加的填充区域 |

#### 节点输出内容

经过 `Pad Image for outpainting` 节点处理后，输出的图片和蒙版预览如下：

<img src="/img/tutorial/basic/outpaint/pad_Image_for_outpainting_result.jpg" alt="Pad Image for outpainting 节点结果" width="1600" height="798" data-path="images/tutorial/basic/outpaint/pad_Image_for_outpainting_result.jpg" />

你可以看到对应的输出结果

* `Image` 输出的是扩展后的图像
* `Mask` 输出的是标记了扩展区域的蒙版
