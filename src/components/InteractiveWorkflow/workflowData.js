export const PORT_TYPES = {
  MODEL: {color: '#9d7cd8', description: '去噪用的扩散模型（UNet），从 Load Checkpoint 流向 KSampler。'},
  CLIP: {color: '#ffd500', description: '文本编码器，把提示词转换成模型能够理解的条件。'},
  CONDITIONING: {color: '#ffa931', description: '编码后的文本条件。正向描述希望出现的内容，负向描述希望避开的内容。'},
  LATENT: {color: '#ff9cf9', description: '潜空间图像。采样前是空白底片，采样后是待 VAE 解码的图像数据。'},
  VAE: {color: '#ff6e6e', description: '潜空间与像素空间之间的编解码器。'},
  IMAGE: {color: '#64b5f6', description: '解码后的像素图像，可以交给 Save Image 保存。'},
};

export const INITIAL_VALUES = {
  checkpoint: 'v1-5-pruned-emaonly-fp16.safetensors',
  width: 512,
  height: 512,
  batch: 1,
  positive: 'beautiful scenery nature glass bottle landscape, purple galaxy bottle,',
  negative: 'text, watermark',
  seed: 0,
  seedMode: 'randomize',
  steps: 20,
  cfg: 8,
  sampler: 'euler',
  scheduler: 'normal',
  denoise: 1,
  prefix: 'ComfyUI',
};

export const INITIAL_POSITIONS = {
  checkpoint: {x: 30, y: 130},
  positive: {x: 310, y: 35},
  negative: {x: 310, y: 325},
  latent: {x: 30, y: 410},
  sampler: {x: 625, y: 125},
  vae: {x: 940, y: 160},
  save: {x: 940, y: 405},
};

export const NODES = [
  {
    id: 'checkpoint', letter: 'A', title: 'Load Checkpoint', subtitle: '加载模型', width: 230, height: 204,
    summary: '读取一个 SD1.5 checkpoint，并拆出 MODEL、CLIP、VAE 三个组件，为整条工作流提供模型能力。',
    tip: '模型文件应放在 models/checkpoints。更换为 SDXL 或 Flux 时，不能照搬这套六节点工作流。',
    inputs: [],
    outputs: [
      {id: 'model', label: 'MODEL', type: 'MODEL', top: 112},
      {id: 'clip', label: 'CLIP', type: 'CLIP', top: 140},
      {id: 'vae', label: 'VAE', type: 'VAE', top: 168},
    ],
  },
  {
    id: 'positive', letter: 'C', title: 'CLIP Text Encode', subtitle: '正向提示词', width: 250, height: 224,
    summary: '把希望出现在画面中的内容编码为 CONDITIONING，并连接到 KSampler 的 positive。',
    tip: 'SD1.5 更适合英文逗号短语。把主体、风格等最重要的信息放在前面。',
    inputs: [{id: 'clip', label: 'CLIP', type: 'CLIP', top: 55}],
    outputs: [{id: 'conditioning', label: 'CONDITIONING', type: 'CONDITIONING', top: 190}],
  },
  {
    id: 'negative', letter: 'C', title: 'CLIP Text Encode', subtitle: '负向提示词', width: 250, height: 224,
    summary: '把希望避开的特征编码为 CONDITIONING，并连接到 KSampler 的 negative。',
    tip: '负向提示词不是橡皮擦；它依赖 CFG 发挥作用。CFG 为 1 时，负向分支不会生效。',
    inputs: [{id: 'clip', label: 'CLIP', type: 'CLIP', top: 55}],
    outputs: [{id: 'conditioning', label: 'CONDITIONING', type: 'CONDITIONING', top: 190}],
  },
  {
    id: 'latent', letter: 'B', title: 'Empty Latent Image', subtitle: '空白潜空间', width: 230, height: 230,
    summary: '创建指定尺寸和批量的全零 LATENT 底片。真正的高斯噪声随后由 KSampler 根据 seed 添加。',
    tip: 'SD1.5 推荐从 512×512 开始。宽高应为 8 的倍数；直接生成 1024×1024 容易构图崩坏。',
    inputs: [],
    outputs: [{id: 'latent', label: 'LATENT', type: 'LATENT', top: 196}],
  },
  {
    id: 'sampler', letter: 'D', title: 'KSampler', subtitle: '迭代去噪', width: 250, height: 478,
    summary: '工作流的核心：根据模型、正负条件和空白底片，从噪声开始反复去噪，输出新的 LATENT。',
    tip: '先用 euler + normal、20 steps、CFG 8、denoise 1 跑通，再一次只改一个参数观察差异。',
    inputs: [
      {id: 'model', label: 'MODEL', type: 'MODEL', top: 55},
      {id: 'positive', label: 'CONDITIONING', type: 'CONDITIONING', top: 83},
      {id: 'negative', label: 'CONDITIONING', type: 'CONDITIONING', top: 111},
      {id: 'latent_image', label: 'LATENT', type: 'LATENT', top: 139},
    ],
    outputs: [{id: 'latent', label: 'LATENT', type: 'LATENT', top: 442}],
  },
  {
    id: 'vae', letter: 'E', title: 'VAE Decode', subtitle: '解码为像素图', width: 220, height: 142,
    summary: '接收 KSampler 的 LATENT 和模型的 VAE，把抽象的潜空间数据解码成能看见的 IMAGE。',
    tip: '这个节点没有额外参数。大图解码显存不足时，可在真实 ComfyUI 中改用 VAE Decode (Tiled)。',
    inputs: [
      {id: 'samples', label: 'LATENT', type: 'LATENT', top: 55},
      {id: 'vae', label: 'VAE', type: 'VAE', top: 83},
    ],
    outputs: [{id: 'image', label: 'IMAGE', type: 'IMAGE', top: 111}],
  },
  {
    id: 'save', letter: 'F', title: 'Save Image', subtitle: '保存成品', width: 230, height: 164,
    summary: '把 IMAGE 保存为 PNG，并将执行参数和工作流写入元数据。默认保存到 ComfyUI/output。',
    tip: '原始 PNG 可以拖回 ComfyUI 还原工作流；如果不希望公开参数，可使用 --disable-metadata。',
    inputs: [{id: 'images', label: 'IMAGE', type: 'IMAGE', top: 55}],
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

export const PARAM_INFO = {
  checkpoint: {label: 'ckpt_name · 模型文件', node: 'checkpoint', description: '选择 models/checkpoints 中的模型。checkpoint 同时包含 UNet、CLIP 和 VAE，因此一个节点能输出三种数据。', tip: '优先使用来源可信的 .safetensors 文件。本课的推荐参数都基于 SD1.5。'},
  width: {label: 'width · 图片宽度', node: 'latent', description: '最终图片的像素宽度，也是潜空间宽度 × 8。它与 height 一起决定画布比例和显存占用。', tip: 'SD1.5 方图用 512，横图可试 768。宽高需为 8 的倍数。'},
  height: {label: 'height · 图片高度', node: 'latent', description: '最终图片的像素高度。潜空间中实际处理的高度是这个数值除以 8。', tip: 'SD1.5 竖图可试 768；宽高同时翻倍会显著增加计算量。'},
  batch: {label: 'batch_size · 批量', node: 'latent', description: '一次采样生成多少张图。同一批共享参数和 seed，但初始噪声在 batch 维上不同。', tip: '显存不足时先降低 batch。批量生成和连续加入多次队列不是一回事。'},
  positive: {label: 'text · 正向提示词', node: 'positive', description: '描述主体、动作、环境、风格、光线和镜头。CLIP 会把它编码成采样时使用的正向条件。', tip: '试试加入 soft cinematic lighting，观察提示词结构，而不只是堆质量词。'},
  negative: {label: 'text · 负向提示词', node: 'negative', description: '描述希望模型避开的特征，通过 CFG 将生成方向推离这些特征。', tip: '少而准通常比长篇罗列更有效，不要把正向提示词原样复制到这里。'},
  seed: {label: 'seed · 随机种子', node: 'sampler', description: '决定初始噪声，是复现结果的起点。相同 seed 还需要相同模型和全部采样参数才能复现。', tip: '调试时把模式切到 fixed；想连续探索不同构图时切到 randomize。'},
  seedMode: {label: 'control_after_generate · seed 模式', node: 'sampler', description: '决定每次执行后 seed 如何变化：固定、递增、递减或随机。', tip: 'fixed 适合对比参数；randomize 适合连续出不同方案。'},
  steps: {label: 'steps · 去噪步数', node: 'sampler', description: '把去噪过程拆成多少步。步数越多通常细节更充分，但耗时近似线性增加。', tip: 'SD1.5 常用 20–30。超过 40 后收益通常迅速递减。'},
  cfg: {label: 'cfg · 提示词引导强度', node: 'sampler', description: '控制结果贴合提示词的程度。公式可理解为：负向预测 +（正向预测 − 负向预测）× CFG。', tip: 'SD1.5 常用 6–8。过高容易过饱和和结构僵硬；为 1 时负向提示词无效。'},
  sampler: {label: 'sampler_name · 采样器', node: 'sampler', description: '决定每一步如何利用模型预测更新潜空间，也就是“每一步怎么走”。', tip: '入门固定 euler；熟练后可对比 dpmpp_2m + karras。'},
  scheduler: {label: 'scheduler · 调度器', node: 'sampler', description: '决定整个去噪过程中每一步的噪声大小，与采样器负责的更新公式相互独立。', tip: 'euler + normal 是稳妥的入门组合；DPM++ 常搭配 karras。'},
  denoise: {label: 'denoise · 去噪强度', node: 'sampler', description: '决定从噪声日程的哪个位置开始，而不是简单地“加多少噪声”。', tip: '文生图必须为 1。调低会跳过去噪阶段，导致灰、糊、细节残缺。'},
  prefix: {label: 'filename_prefix · 文件名前缀', node: 'save', description: '保存图片的文件名前缀，最终会形成“前缀_00001_.png”这样的文件名。', tip: '可以写“子目录/前缀”分类保存，也支持 %width%、%height% 等变量。'},
};
