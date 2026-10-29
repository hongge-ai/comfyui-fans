---
unlisted: true
title: 介绍
---

<div className="intro-hero">
  <img src="/img/logo/light.svg" className="logo-theme-light" width="204" height="57" />

  <img src="/img/logo/dark.svg" className="logo-theme-dark" width="204" height="57" />

  <div className="intro-social">
    <a href="https://github.com/Comfy-Org/ComfyUI/" target="_blank">
      <Icon icon="github" iconType="solid" size={32} />
    </a>

    <a href="https://x.com/ComfyUI" target="_blank">
      <Icon icon="x-twitter" iconType="solid" size={32} />
    </a>

    <a href="https://discord.com/invite/comfyorg" target="_blank">
      <Icon icon="discord" iconType="solid" size={32} />
    </a>

    <a href="https://raw.githubusercontent.com/Comfy-Org/docs/refs/heads/main/images/index/qrcode.jpg" target="_blank">
      <Icon icon="weixin" iconType="solid" size={32} />
    </a>

    <a href="https://www.youtube.com/@comfyorg" target="_blank">
      <Icon icon="youtube" iconType="solid" size={32} />
    </a>
  </div>

  <p className="intro-tagline">最强大的开源节点式生成式 AI 应用，支持构建图像、视频、音频和 3D 生成工作流。</p>
</div>

<div className="intro-section">
  <h2>开始使用</h2>

  <CardGroup cols={3}>
    <Card title="系统要求" icon="microchip" href="/docs/get-started/system-requirements">
      先确认你的显卡、内存和系统版本是否满足运行条件
    </Card>

    <Card title="下载安装" icon="download" href="/docs/get-started/install/overview">
      在 Windows、macOS 或 Linux 上安装 ComfyUI
    </Card>

    <Card title="首次生成" icon="rocket" href="/docs/get-started/first-generation">
      创建你的第一张 AI 生成图像
    </Card>
  </CardGroup>
</div>

<div className="intro-section">
  <h2>基础概念</h2>

  <CardGroup cols={3}>
    <Card title="工作流" icon="diagram-project" href="/docs/concepts/workflow">
      理解 ComfyUI 中工作流的组成与运行方式
    </Card>

    <Card title="节点与连线" icon="circle-nodes" href="/docs/concepts/nodes">
      节点的构成、连线规则与数据类型流转
    </Card>

    <Card title="模型" icon="cube" href="/docs/concepts/models">
      模型类型、存放路径与多端共享配置
    </Card>
  </CardGroup>
</div>

<div className="intro-section">
  <h2>界面与教程</h2>

  <CardGroup cols={3}>
    <Card title="界面指南" icon="window-maximize" href="/docs/interface/overview">
      了解 ComfyUI 界面导航、模板库与蒙版编辑器
    </Card>

    <Card title="基础示例" icon="book-open" href="/docs/tutorials/basic/text-to-image">
      文生图、图生图、重绘、放大与 LoRA 的分步指南
    </Card>

    <Card title="ControlNet" icon="sliders" href="/docs/tutorials/controlnet/overview">
      用姿态、深度等控制条件精确引导构图
    </Card>
  </CardGroup>
</div>

<div className="intro-section">
  <h2>进阶与扩展</h2>

  <CardGroup cols={3}>
    <Card title="模型专题" icon="wand-magic-sparkles" href="/docs/tutorials/flux/flux-1-text-to-image">
      Flux、Qwen-Image 与 Wan2.2 视频生成的实践教程
    </Card>

    <Card title="自定义节点与 Manager" icon="puzzle-piece" href="/docs/get-started/custom-nodes/install">
      安装扩展节点、使用 ComfyUI Manager 管理依赖
    </Card>

    <Card title="学习总结" icon="graduation-cap" href="/docs/summary">
      把零散知识串成一条可复用的工作流思路
    </Card>
  </CardGroup>
</div>

<div className="intro-section">
  <h2>官方资源（站外）</h2>

  <p className="intro-section-note">以下主题本站暂未收录，链接将跳转至 ComfyUI 官方文档。</p>

  <CardGroup cols={3}>
    <Card title="智能体工具与 MCP" icon="robot" href="https://docs.comfy.org/zh/agent-tools">
      通过 MCP 连接 AI 智能体，生成图片、视频、音频和 3D 内容
    </Card>

    <Card title="内置节点参考" icon="list" href="https://docs.comfy.org/zh/built-in-nodes/overview">
      逐个查阅每个 ComfyUI 内置节点的参数说明
    </Card>

    <Card title="开发指南" icon="code" href="https://docs.comfy.org/zh/development/overview">
      为 ComfyUI 开发做出贡献、开发并发布自定义节点
    </Card>

    <Card title="API 与 Cloud" icon="cloud" href="https://docs.comfy.org/zh/development/cloud/overview">
      通过本地服务器或 Comfy Cloud API 运行工作流
    </Card>

    <Card title="故障排除" icon="circle-question" href="https://docs.comfy.org/zh/troubleshooting/overview">
      解决常见问题和错误
    </Card>

    <Card title="社区与支持" icon="users" href="https://docs.comfy.org/zh/community/links">
      加入 ComfyUI 社区，或联系官方处理账户与订阅问题
    </Card>
  </CardGroup>
</div>

<div className="intro-about">
  <h2>关于 ComfyUI</h2>

  <p>由 <a href="https://github.com/comfyanonymous" target="_blank" rel="noopener noreferrer">comfyanonymous</a> 和其他<a href="https://github.com/Comfy-Org/ComfyUI/graphs/contributors" target="_blank" rel="noopener noreferrer">贡献者</a>开发。</p>

  <ul>
    <li><strong>ComfyUI</strong> 是一个基于节点的生成式 AI 界面和推理引擎</li>
    <li>用户可以通过节点组合各种 AI 模型和操作，实现高度可定制和可控的内容生成</li>
    <li>ComfyUI 完全开源，可以在本地设备上运行</li>
  </ul>
</div>

