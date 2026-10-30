export const PORT_TYPES = {
  MODEL: {color: '#9d7cd8', description: '去噪用的扩散模型（UNet）。从 Load Checkpoint 流向 KSampler，在每一步预测噪声。'},
  CLIP: {color: '#ffd500', description: '文本编码器。把提示词编码成模型能理解的条件向量。'},
  CONDITIONING: {color: '#ffa931', description: '编码后的文本条件。正向描述希望出现的内容，负向描述希望避开的特征。'},
  LATENT: {color: '#ff9cf9', description: '潜空间图像：长宽是像素的 1/8，只有 4 个抽象通道。采样前是全零底片，采样后是待解码的数据。'},
  VAE: {color: '#ff6e6e', description: '潜空间与像素空间之间的编解码器。'},
  IMAGE: {color: '#64b5f6', description: '解码后的像素图像，交给 Save Image 保存。'},
};

export const WORLD = {width: 1160, height: 560};

export const INITIAL_VALUES = {
  checkpoint: 'v1-5-pruned-emaonly-fp16.safetensors',
  positive: 'beautiful scenery nature glass bottle landscape, purple galaxy bottle',
  negative: 'text, watermark',
  width: 512,
  height: 512,
  batch: 1,
  seed: 0,
  seedMode: 'randomize',
  steps: 20,
  cfg: 8,
  sampler: 'euler',
  scheduler: 'normal',
  denoise: 1,
  prefix: 'ComfyUI',
};

export const NODES = [
  {
    id: 'checkpoint', letter: 'A', title: 'Load Checkpoint', subtitle: '加载模型',
    x: 20, y: 60, width: 220, height: 176,
    summary: '读取一个 SD1.5 checkpoint，拆出 MODEL、CLIP、VAE 三个组件，为整条工作流提供模型能力。',
    note: '模型放在 models/checkpoints。换成 SDXL、Flux 时，节点结构和尺寸都要跟着换，不能照搬这套六节点工作流。',
    inputs: [],
    outputs: [
      {id: 'model', label: 'MODEL', type: 'MODEL', detail: 'UNet，去噪时预测噪声'},
      {id: 'clip', label: 'CLIP', type: 'CLIP', detail: '文本编码器，喂给两个 CLIP Text Encode'},
      {id: 'vae', label: 'VAE', type: 'VAE', detail: '编解码器，喂给 VAE Decode'},
    ],
  },
  {
    id: 'latent', letter: 'B', title: 'Empty Latent Image', subtitle: '空白潜空间',
    x: 20, y: 330, width: 220, height: 214,
    summary: '按 width / height / batch 造一张全零底片，并标记「像素到潜空间要除以 8」。真正的噪声由 KSampler 根据 seed 生成。',
    note: '宽高必须是 8 的倍数，否则会被向下取整：填 513 实际得到 512。',
    inputs: [],
    outputs: [{id: 'latent', label: 'LATENT', type: 'LATENT', detail: '形状 [batch, 4, 高/8, 宽/8] 的全零张量'}],
  },
  {
    id: 'positive', letter: 'C', title: 'CLIP Text Encode', subtitle: '正向提示词',
    x: 300, y: 30, width: 235, height: 208,
    summary: '把希望出现在画面里的内容编码成 CONDITIONING，接到 KSampler 的 positive。',
    note: 'SD1.5 只熟悉英文。用逗号分隔短语，把主体和风格放在最前面。',
    inputs: [{id: 'clip', label: 'CLIP', type: 'CLIP', detail: '来自 Load Checkpoint 的文本编码器'}],
    outputs: [{id: 'conditioning', label: 'CONDITIONING', type: 'CONDITIONING', detail: '编码后的正向条件'}],
  },
  {
    id: 'negative', letter: 'C', title: 'CLIP Text Encode', subtitle: '负向提示词',
    x: 300, y: 300, width: 235, height: 208,
    summary: '把希望避开的特征编码成 CONDITIONING，接到 KSampler 的 negative。',
    note: '负向词不是橡皮擦，它靠 CFG 起作用。CFG 等于 1 时负向分支会被跳过，写什么都没用。',
    inputs: [{id: 'clip', label: 'CLIP', type: 'CLIP', detail: '来自 Load Checkpoint 的文本编码器'}],
    outputs: [{id: 'conditioning', label: 'CONDITIONING', type: 'CONDITIONING', detail: '编码后的负向条件'}],
  },
  {
    id: 'sampler', letter: 'D', title: 'KSampler', subtitle: '迭代去噪',
    x: 610, y: 60, width: 245, height: 430,
    summary: '整条流水线真正干活的地方：拿到模型、正负条件和空白底片，从噪声开始反复去噪，输出潜空间图像。',
    note: '先用 euler + normal、20 步、CFG 8、denoise 1 跑通，之后一次只改一个参数。',
    inputs: [
      {id: 'model', label: 'MODEL', type: 'MODEL', detail: '去噪模型'},
      {id: 'positive', label: 'CONDITIONING', type: 'CONDITIONING', detail: '正向条件'},
      {id: 'negative', label: 'CONDITIONING', type: 'CONDITIONING', detail: '负向条件'},
      {id: 'latent_image', label: 'LATENT', type: 'LATENT', detail: '空白底片，提供尺寸和批量'},
    ],
    outputs: [{id: 'latent', label: 'LATENT', type: 'LATENT', detail: '去噪后的潜空间图像'}],
  },
  {
    id: 'vae', letter: 'E', title: 'VAE Decode', subtitle: '解码为像素图',
    x: 925, y: 90, width: 205, height: 124,
    summary: '接收 KSampler 的 LATENT 和来自 checkpoint 的 VAE，把潜空间数据解码成能看见的 IMAGE。',
    note: '外挂 VAE 必须和模型架构匹配，SD1.5 的 VAE 不能给 SDXL 用。',
    inputs: [
      {id: 'samples', label: 'LATENT', type: 'LATENT', detail: '待解码的采样结果'},
      {id: 'vae', label: 'VAE', type: 'VAE', detail: '来自 Load Checkpoint'},
    ],
    outputs: [{id: 'image', label: 'IMAGE', type: 'IMAGE', detail: '像素图像，形状 [batch, 高, 宽, 3]'}],
  },
  {
    id: 'save', letter: 'F', title: 'Save Image', subtitle: '保存成品',
    x: 925, y: 300, width: 205, height: 124,
    summary: '把 IMAGE 写成 PNG，保存到 ComfyUI/output，并把提示词与全部参数写进图片元数据。',
    note: '原始 PNG 拖回 ComfyUI 就能还原工作流；不想公开参数就只发截图。',
    inputs: [{id: 'images', label: 'IMAGE', type: 'IMAGE', detail: '来自 VAE Decode'}],
    outputs: [],
  },
];

export const INITIAL_CONNECTIONS = [
  {id: 'c1', from: 'checkpoint', fromPort: 'model', to: 'sampler', toPort: 'model', type: 'MODEL'},
  {id: 'c2', from: 'checkpoint', fromPort: 'clip', to: 'positive', toPort: 'clip', type: 'CLIP'},
  {id: 'c3', from: 'checkpoint', fromPort: 'clip', to: 'negative', toPort: 'clip', type: 'CLIP'},
  {id: 'c4', from: 'checkpoint', fromPort: 'vae', to: 'vae', toPort: 'vae', type: 'VAE'},
  {id: 'c5', from: 'latent', fromPort: 'latent', to: 'sampler', toPort: 'latent_image', type: 'LATENT'},
  {id: 'c6', from: 'positive', fromPort: 'conditioning', to: 'sampler', toPort: 'positive', type: 'CONDITIONING'},
  {id: 'c7', from: 'negative', fromPort: 'conditioning', to: 'sampler', toPort: 'negative', type: 'CONDITIONING'},
  {id: 'c8', from: 'sampler', fromPort: 'latent', to: 'vae', toPort: 'samples', type: 'LATENT'},
  {id: 'c9', from: 'vae', fromPort: 'image', to: 'save', toPort: 'images', type: 'IMAGE'},
];

export const PARAMS = [
  {
    id: 'checkpoint', node: 'checkpoint', label: 'ckpt_name', kind: 'select',
    options: ['v1-5-pruned-emaonly-fp16.safetensors', 'Dreamshaper.safetensors', 'Anything-V5.safetensors'],
    description: '从 models/checkpoints 里选一个模型。checkpoint 同时打包了 UNet、CLIP 和 VAE，所以一个节点能输出三种数据。',
    tip: '只用来源可信的 .safetensors。本课全部推荐参数都基于 SD1.5，换模型要换工作流。',
  },
  {
    id: 'width', node: 'latent', label: 'width', kind: 'number', min: 16, max: 2048, step: 8, unit: 'px',
    description: '最终图片的像素宽度。潜空间里实际处理的是 width ÷ 8。',
    tip: 'SD1.5 从 512 起步，横图可试 768。直接上 1024 不会更快，只会更难构图。',
  },
  {
    id: 'height', node: 'latent', label: 'height', kind: 'number', min: 16, max: 2048, step: 8, unit: 'px',
    description: '最终图片的像素高度。和 width 一起决定画布比例，也决定显存占用。',
    tip: '竖图常用 512×768。宽高同时翻倍，显存和耗时大致涨到四倍。',
  },
  {
    id: 'batch', node: 'latent', label: 'batch_size', kind: 'number', min: 1, max: 16, step: 1, unit: '张',
    description: '一次采样同时生成几张图。它们共享参数和 seed，但初始噪声在 batch 维度上不同。',
    tip: '显存不够先降 batch。连续点四次队列是四次独立采样，不是同一批。',
  },
  {
    id: 'positive', node: 'positive', label: 'text', kind: 'textarea',
    description: '描述主体、动作、环境、风格、光线和镜头。CLIP 把它编码成采样时使用的正向条件。',
    tip: '结构：主体 + 环境 + 风格 + 光线。越靠前的词影响越大。',
  },
  {
    id: 'negative', node: 'negative', label: 'text', kind: 'textarea',
    description: '描述希望模型避开的特征，通过 CFG 把生成方向推离它们。',
    tip: '少而准通常比长篇罗列有效。别把正向词原样搬进来「对冲」。',
  },
  {
    id: 'seed', node: 'sampler', label: 'seed', kind: 'number', min: 0, max: 18446744073709551615, step: 1,
    description: '决定初始噪声的样子，也就是生成的起点。固定它，才有可能复现同一张图。',
    tip: '调参时切到 fixed；连续探索不同构图时用 randomize。',
  },
  {
    id: 'seedMode', node: 'sampler', label: 'control_after_generate', kind: 'select',
    options: ['fixed', 'increment', 'decrement', 'randomize'],
    description: '每次执行后 seed 怎么变：保持不变、加一、减一，或换一个新的随机值。',
    tip: 'fixed 用来对比参数；randomize 用来连续出方案。',
  },
  {
    id: 'steps', node: 'sampler', label: 'steps', kind: 'range', min: 1, max: 50, step: 1,
    description: '把去噪过程拆成多少步。每一步都要调用一次模型，耗时近似线性增长。',
    tip: 'SD1.5 常用 20–30。超过 40 之后收益迅速递减。',
  },
  {
    id: 'cfg', node: 'sampler', label: 'cfg', kind: 'range', min: 0, max: 20, step: 0.5,
    description: '提示词引导强度（Classifier-Free Guidance）。公式：负向预测 +（正向预测 − 负向预测）× cfg。',
    tip: 'SD1.5 常用 6–8。高于 10 容易过饱和、结构僵硬；等于 1 时负向词完全失效。',
  },
  {
    id: 'sampler', node: 'sampler', label: 'sampler_name', kind: 'select',
    options: ['euler', 'euler_ancestral', 'dpmpp_2m', 'dpmpp_2m_sde', 'ddim', 'lcm'],
    description: '决定每一步怎么用模型预测更新潜空间，是「走路的方式」，不是「走多少步」。',
    tip: '入门固定 euler；熟练后试 dpmpp_2m + karras，细节和稳定性更平衡。',
  },
  {
    id: 'scheduler', node: 'sampler', label: 'scheduler', kind: 'select',
    options: ['normal', 'karras', 'exponential', 'sgm_uniform', 'simple'],
    description: '决定整个去噪过程中每一步用多大的噪声，也就是「降温曲线」，与采样器的更新公式互相独立。',
    tip: 'euler + normal 最稳；DPM++ 系列常配 karras。',
  },
  {
    id: 'denoise', node: 'sampler', label: 'denoise', kind: 'range', min: 0, max: 1, step: 0.01,
    description: '从噪声日程的哪个位置开始去噪，而不是「加多少噪声」。1 表示从纯噪声开始。',
    tip: '文生图必须为 1。调低等于跳过前段去噪，结果通常发灰发糊——那是图生图的参数。',
  },
  {
    id: 'prefix', node: 'save', label: 'filename_prefix', kind: 'text',
    description: '保存的文件名前缀，最终形成「前缀_00001_.png」。编号从 1 开始，自动接续目录里的最大值。',
    tip: '可以写「子目录/前缀」分类保存，也支持 %width%、%date% 之类的变量。',
  },
];

export const PARAM_BY_ID = Object.fromEntries(PARAMS.map((param) => [param.id, param]));

export const TOUR = [
  {
    title: '先看一眼全图', target: {type: 'none'},
    text: '七块节点、九根连线，数据从左往右单向流动。拖动节点标题可以移动节点，拖动空白处平移画布，滚轮缩放。先花半分钟熟悉画布，再往下走。',
  },
  {
    title: 'A · 模型从哪来', target: {type: 'node', id: 'checkpoint'},
    text: '整条工作流的燃料是 checkpoint。它同时打包了 UNet（去噪）、CLIP（编码文本）和 VAE（编解码图像），所以一个节点能输出三种颜色的线。下拉框里选的就是 models/checkpoints 里的文件。',
  },
  {
    title: 'B · 先定画布尺寸', target: {type: 'node', id: 'latent'},
    text: 'Empty Latent Image 只做一件事：按 width / height / batch 造一张全零底片，形状是 [batch, 4, 高÷8, 宽÷8]。噪声不在这里生成，是 KSampler 拿到 seed 之后才加的。宽高不是 8 的倍数会被向下取整。',
  },
  {
    title: 'C · 提示词有两条', target: {type: 'node', id: 'positive'},
    text: '上面这个 CLIP Text Encode 接 KSampler 的 positive，写你希望出现的画面；下面那个接 negative，写希望避开的。两者接反不会报错，但结果会「避着你想要的东西画」。',
  },
  {
    title: 'D · 真正干活的地方', target: {type: 'node', id: 'sampler'},
    text: 'KSampler 接收模型、正负条件和底片，从噪声开始反复去噪。它的七个参数决定了这张图长什么样：seed 定起点，steps 定步数，cfg 定贴合度，sampler 和 scheduler 定走法，denoise 定从哪里开始。',
  },
  {
    title: 'E、F · 从潜空间到成品', target: {type: 'node', id: 'vae'},
    text: '采样结果还在潜空间里，VAE Decode 把它翻译成像素图，Save Image 写进 ComfyUI/output。原始 PNG 同时保存了提示词和全部参数，拖回 ComfyUI 就能还原工作流。',
  },
  {
    title: '连线就是类型', target: {type: 'edge', id: 'c1'},
    text: '颜色代表数据类型，同色才能相连。点一个圆点开始连线，再点同色圆点完成；点连线可以选中并断开。想亲手试一次？断开 VAE 的 LATENT，再点「模拟运行」，看它怎么报错。',
  },
  {
    title: '跑一遍', target: {type: 'run'},
    text: '点右上角「▶ 模拟运行」：节点按依赖顺序点亮，连线会流动。缺输入时它会直接指出缺哪一个。切换 seed 模式多跑几次，观察 seed 怎么变。',
  },
];

export const RUN_SEQUENCE = [
  {node: 'checkpoint', text: '读取 checkpoint，拆出 UNet、CLIP、VAE'},
  {node: 'positive', text: '编码正向提示词'},
  {node: 'negative', text: '编码负向提示词'},
  {node: 'latent', text: '创建全零 LATENT'},
  {node: 'sampler', text: '迭代去噪'},
  {node: 'vae', text: '解码为像素图'},
  {node: 'save', text: '写入 output 目录'},
];

export const PRESETS = [
  {
    name: '示例：玻璃瓶风景',
    positive: 'beautiful scenery nature glass bottle landscape, purple galaxy bottle',
    negative: 'text, watermark',
  },
  {
    name: '写实人像',
    positive: '(ultra realistic portrait:1.2), elegant woman in crimson silk dress, full body, soft cinematic lighting, (golden hour:1.1), shallow depth of field, film grain, warm color grading',
    negative: 'low quality, blurry, deformed hands, extra fingers, watermark, text',
  },
  {
    name: '二次元',
    positive: 'anime style, 1girl with long pink hair, cherry blossom background, soft lighting, intricate details',
    negative: 'low quality, blurry, deformed hands, extra fingers',
  },
];

export const WEIGHT_RULES = [
  ['golden hour', '权重 1.0'],
  ['(golden hour)', '权重 1.1'],
  ['(golden hour:1.3)', '权重 1.3'],
  ['(golden hour:0.8)', '降低权重'],
  ['\\(literal\\)', '转义，输出字面括号'],
];

export const CLIP_TOKEN_LIMIT = 75;
