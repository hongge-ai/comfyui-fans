---
title: 文生图
description: 二十分钟跑通 ComfyUI 文生图：一套可操作的节点实验室，把六个节点、七个参数和提示词写法讲透。
sidebar_position: 1
hide_table_of_contents: true
---

import InteractiveWorkflow from '@site/src/components/InteractiveWorkflow';

# ComfyUI 文生图

> 本课以 SD1.5 示例工作流为样板。先在下面的实验室里把节点、参数、提示词和运行过程全部摸一遍，再回到真实 ComfyUI 复现。所有推荐参数都基于 SD1.5。

:::tip 直接开始：下载工作流文件
<a href="/workflows/text-to-image-sd15.json" download="text-to-image-sd15.json">**下载 text-to-image-sd15.json**</a> · 七节点、九连线，参数与下面的实验室完全一致（512×512 · 20 steps · cfg 8 · euler + normal · denoise 1）。

把文件拖进 ComfyUI 画布即可加载，也可以用菜单 **工作流 → 打开** 选中它。加载后先确认 `Load Checkpoint` 里选的是本机已有的模型。
:::

## 本课目标

- 二十分钟内跑出第一张图，知道它存在哪里；
- 说得清七个节点各自输出什么、为什么只能同色相连；
- 会调 seed、steps、cfg、采样器、denoise，并知道各自的边界；
- 遇到黑图、显存不足、结果无法复现时能自己定位。

## 课前准备

- ComfyUI 已安装，能打开界面。
- 已下载 [v1-5-pruned-emaonly-fp16.safetensors](https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/blob/main/v1-5-pruned-emaonly-fp16.safetensors)（约 2.1 GB）。
- 已下载本课的 [工作流 JSON](/workflows/text-to-image-sd15.json)，稍后直接拖进画布。
- 首次运行要把模型从磁盘读入显存，会慢几十秒，属于正常现象。

## 一、先跑通第一张图

### 1.1 放好模型

模型放在 `models/checkpoints`：

| 安装方式 | 路径 |
| -------- | ---- |
| 便携版 | `ComfyUI_windows_portable/ComfyUI/models/checkpoints/` |
| 桌面版 | 菜单 **帮助 → 打开文件夹 → 打开模型文件夹**，再进 `models/checkpoints` |
| 手动安装 | `ComfyUI/models/checkpoints/` |

放好后按 `R` 刷新节点定义，`Load Checkpoint` 的下拉框里就能看到它。

文件名里的 `pruned` 表示去掉了推理用不到的训练状态，`emaonly` 只保留 EMA 权重，`fp16` 是半精度——三者让它从约 4 GB 缩到 2.1 GB，出图效果几乎不变。优先用 `.safetensors`，来源不明的 `.ckpt` 不要加载。

### 1.2 加载示例工作流

任选一种：

1. 把本课的 [text-to-image-sd15.json](/workflows/text-to-image-sd15.json) 拖进 ComfyUI 画布；
2. 菜单 **工作流 → 打开**，快捷键 `Ctrl/Cmd + O`，选中刚下载的 JSON；
3. 把[官方示例图](https://raw.githubusercontent.com/Comfy-Org/example_workflows/refs/heads/main/image/basic/text-to-image-workflow.png)拖进画布；
4. 菜单 **工作流 → 浏览示例工作流**，选 **Text to Image**。

前两种加载的是本课配套的 JSON，参数和下面的实验室一一对应；后两种是官方示例的 PNG 或内置模板，内容等价，区别只是载体不同。

> 为什么一张图片能还原工作流？PNG 里额外存了两段数据：界面用的工作流结构和执行用的节点参数。截图、转发、网页压缩都会弄丢它们，所以**只有原始 PNG** 才行。想单独分享工作流，用 **工作流 → 导出** 存成 JSON。

### 1.3 从实验室到真实画布

下面的实验室就是这套工作流本身：节点位置、端口、参数默认值都和示例一致。

<InteractiveWorkflow />

建议的走法：

1. 先点 **导览**，八步走完，每一步会自动把画布对准要讲的节点；
2. 再点 **参数**，逐个试 steps、cfg、seed 模式，右侧会实时算出前向次数和潜空间形状；
3. 切到 **提示词**，看 token 计数和权重写法，或直接套用预设；
4. 最后在画布上断开一根线，点 **队列执行**，看它如何报错，再连回去重跑。

真实 ComfyUI 里对应的动作：

| 实验室 | 真实界面 |
| ------ | -------- |
| 画布拖动、滚轮缩放 | 鼠标左键拖动、滚轮缩放 |
| 点节点里的参数行 | 直接编辑节点上的控件 |
| 输出圆点 → 输入圆点 | 点击端口拖出连线 |
| 队列执行 | 右上角 **队列 / Queue**，或 `Ctrl/Cmd + Enter` |

### 1.4 出图与保存

点 **队列** 后，正在运行的节点会高亮，KSampler 里出现低分辨率预览。完成后 `Save Image` 显示成品图，同时文件已经写进 `ComfyUI/output/`：

```text
前缀_00001_.png
```

编号从 1 开始、5 位补零、自动接续目录里的最大值。前缀可以写成 `子目录/前缀` 来分文件夹，也支持 `%width%`、`%date%` 等变量。

PNG 里同时保存了提示词和全部参数，这就是它能拖回来复现的原因；不想公开时可以在启动参数里加 `--disable-metadata`。

### 1.5 让它可复现

默认 seed 模式是 `randomize`，每次执行前会换一个新 seed。改成 `fixed` 就能稳定复现。

复现一张图需要同时满足：相同的模型文件、相同的 seed / steps / cfg / 采样器 / 调度器 / denoise、相同的分辨率与 batch，以及版本接近的 ComfyUI、PyTorch 和驱动。前三条由你控制，后几条正是「抄了参数还是差一点」的原因。最保险的存档方式是保留原始 PNG。

## 二、提示词怎么写

实验室的 **提示词** 标签页里可以边写边看 token 数，这里只给结论。

**结构**：主体 + 动作 + 环境 + 风格 + 光线 + 画质。越靠前的词影响越大。

```text
(ultra realistic portrait:1.2), elegant woman in crimson silk dress, full body,
soft cinematic lighting, (golden hour:1.1), shallow depth of field, film grain
```

**几条硬规则**

- 用英文。SD1.5 的 CLIP 只熟悉英文语料。
- 用逗号分隔短语，不要写长句。
- 同一个概念别用多种说法重复，模型会当成多个不同的词。
- 质量词不是越多越好，堆十几个 `masterpiece, 8k` 往往只是增加噪声。
- 负向词靠 cfg 生效，cfg 等于 1 时完全无效；别把正向词原样搬进负向词「对冲」。
- 单个 CLIP 最多 77 个 token，超过会**自动切段**而不是截断——不报错，但后半段效果会下降。

## 三、分辨率与放大

SD1.5 的正确姿势是「小图生成、二次放大」：

1. 用 512×512 或 512×768 生成底图；
2. 用放大模型或潜空间放大到 2 倍；
3. 需要更多细节，再用低 denoise 的图生图精修。

直接生成 1024×1024 的问题不是显存，而是**构图崩坏**：多头、肢体重复、远景混乱。这超出模型的训练分辨率，调参解决不了。宽高必须是 8 的倍数，否则会被向下取整。

显存吃紧时按这个顺序降：batch → 分辨率 → steps，最后才考虑 `--lowvram`。

## 四、常见问题

<AccordionGroup>
<Accordion title="Load Checkpoint 下拉框是空的 / 显示 null">
模型没放进 `models/checkpoints`，或后缀不被识别，或放好后没刷新。确认路径 → 按 `R` → 重启 ComfyUI → 仍不行就检查文件大小是否与下载源一致。
</Accordion>
<Accordion title="运行时报 Value not in list">
工作流里记录的模型名在本机不存在，通常是改名、换版本或下载不完整。在 Load Checkpoint 里重新选一个本机实际存在的文件。
</Accordion>
<Accordion title="显存不足 / CUDA out of memory">
先降 batch，再降分辨率，关掉游戏、浏览器硬件加速和其他 AI 程序；还不行再用 `--lowvram` 启动。
</Accordion>
<Accordion title="生成纯黑、纯灰或纯色图">
常见原因：强制了 `--fp16-vae` 导致 VAE 溢出、外挂 VAE 与模型不匹配、模型文件损坏、denoise 被误设成很小的值。文生图请把 denoise 调回 1.0。
</Accordion>
<Accordion title="参数一样却复现不了">
模型文件版本、ComfyUI / PyTorch 版本、显卡与精度路径都可能不同。严格复现时把工作流 JSON 和模型文件一起存档。
</Accordion>
<Accordion title="生成的尺寸和我填的不一样">
宽高不是 8 的倍数会被向下取整，填 513 得到 512。通过 API 传参时尤其要检查。
</Accordion>
<Accordion title="中文提示词没效果">
SD1.5 的 CLIP 没有中文能力，请改用英文。
</Accordion>
<Accordion title="工作流加载后节点变红、连线断开">
工作流来自更高版本，或包含未安装的自定义节点。更新 ComfyUI 或补装节点。
</Accordion>
</AccordionGroup>

**排查顺序**：看报错点名了哪个节点 → 检查模型与尺寸 → 检查参数（尤其 seed 模式和 denoise）→ 最后怀疑环境。

## 五、练习

1. **对比 steps**：固定 seed，分别用 8、20、35 步生成，观察细节与耗时从哪一档开始收益递减。
2. **验证负向词**：cfg 设为 1 生成一次，再调回 8 生成一次，对比 `text, watermark` 有没有出现。
3. **验证分辨率边界**：512、768、1024 各出一张，再用放大流程对比「直接大图」和「小图放大」。

## 下一步

- **图生图**：理解 denoise 的保留与重绘语义；
- **图像放大**：把 512 底图做成高清成品；
- **LoRA**：给模型加风格或角色，不必换底模；
- **ControlNet**：用结构条件控制构图。

## 参考资料

- 示例工作流：[Comfy-Org/example_workflows](https://github.com/Comfy-Org/example_workflows)
- 模型下载：[Comfy-Org/stable-diffusion-v1-5-archive](https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive)
- 论文：[DDPM](https://arxiv.org/pdf/2006.11239)、[DDIM](https://arxiv.org/pdf/2010.02502)、[Latent Diffusion](https://arxiv.org/pdf/2112.10752)
- ComfyUI 是 Comfy Org 的开源项目（GPL-3.0），本站截图与示例版权归原作者所有。
