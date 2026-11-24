import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const tutorialPath = '/docs/tutorials/basic/text-to-image';

function Arrow({ external = false }) {
  return (
    <span className={styles.arrow} aria-hidden="true">
      {external ? '↗' : '→'}
    </span>
  );
}

function WorkflowIllustration() {
  return (
    <div className={styles.visual}>
      <div className={styles.visualHeader}>
        <span>TEXT TO IMAGE <span className={styles.visualSlash}>/</span> WORKFLOW STUDY</span>
        <span>01</span>
      </div>
      <div className={styles.visualBody}>
        <div className={styles.visualIntro}>
          <span className={styles.visualKicker}>FROM IDEA TO IMAGE</span>
          <p>从一个想法，<br />到一张图。</p>
          <span className={styles.visualNote}>文生图工作流的基本过程</span>
        </div>
        <figure className={styles.example}>
          <img
            src={useBaseUrl('/img/external/raw-githubusercontent-com/basic/text-to-image-workflow.png')}
            alt="文生图课程示例成图：树林背景中装着紫色星河的玻璃瓶"
            width="512"
            height="512"
          />
          <figcaption>
            <span>课程示例成图</span>
            <span>SD 1.5</span>
          </figcaption>
        </figure>
      </div>
      <div className={styles.flow} aria-label="文生图过程示意：提示词与模型，经过采样和解码，生成图像">
        <div className={styles.flowNode}><span>01</span><strong>提示词 + 模型</strong></div>
        <span className={styles.flowConnector} aria-hidden="true">→</span>
        <div className={styles.flowNode}><span>02</span><strong>采样</strong></div>
        <span className={styles.flowConnector} aria-hidden="true">→</span>
        <div className={styles.flowNode}><span>03</span><strong>解码</strong></div>
        <span className={styles.flowConnector} aria-hidden="true">→</span>
        <div className={styles.flowNode}><span>04</span><strong>图像</strong></div>
      </div>
      <div className={styles.visualFooter}>
        <span><span className={styles.statusDot} /> PROCESS DIAGRAM</span>
        <span>示意图 · 非实际节点界面</span>
      </div>
    </div>
  );
}

const steps = [
  {
    number: '01',
    label: 'MAKE',
    title: '先跑出第一张图',
    description: '放好模型，加载示例工作流，核对参数并运行。从实际操作开始认识 ComfyUI。',
  },
  {
    number: '02',
    label: 'UNDERSTAND',
    title: '再看懂节点和参数',
    description: '沿着连线拆解六种节点，弄明白提示词、采样器和图像之间的关系。',
  },
  {
    number: '03',
    label: 'PRACTICE',
    title: '学会复现与排错',
    description: '理解 seed 和常用参数，保存工作流，并在遇到模型或显存问题时找到检查方向。',
  },
];

export default function Home() {
  return (
    <Layout title="首页" description="从第一张图开始，学会用 ComfyUI 创作。通过 SD1.5 文生图教程，认识节点、参数和工作流。">
      <main className={styles.home}>
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.container}>
            <div className={styles.heroGrid}>
              <div className={styles.heroCopy}>
                <div className={styles.eyebrow}><span /> COMFYUI FANS <i /> 创作入门</div>
                <h1 id="hero-title">把想法，<br /><em>连接成画面。</em></h1>
                <p className={styles.heroDescription}>
                  从一张图开始，学会 ComfyUI。跟着文生图教程动手搭建工作流，理解每个节点，让创作不止于按下运行。
                </p>
                <div className={styles.heroActions}>
                  <Link className={styles.primaryButton} to={tutorialPath}>
                    开始学习文生图 <Arrow />
                  </Link>
                  <a className={styles.textLink} href="#preparation">先看看课前准备 <span aria-hidden="true">↓</span></a>
                </div>
                <div className={styles.heroFootnote}>
                  <span className={styles.footnoteMark} aria-hidden="true">✳</span>
                  <span>独立爱好者教学站 <b>·</b> 从基础开始，逐节点理解</span>
                </div>
              </div>
              <WorkflowIllustration />
            </div>
          </div>
        </section>

        <section className={styles.learning} aria-labelledby="learning-title">
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.sectionLabel}><span>01</span> YOUR LEARNING PATH</p>
                <h2 id="learning-title">一条清晰的入门路径</h2>
              </div>
              <p>不只是照着出图。先动手，再理解，最后把方法变成自己的。</p>
            </div>
            <ol className={styles.steps}>
              {steps.map((step) => (
                <li className={styles.step} key={step.number}>
                  <div className={styles.stepTop}><span>{step.number}</span><span>{step.label}</span></div>
                  <div className={styles.stepLine} aria-hidden="true"><span /></div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={styles.preparation} id="preparation" aria-labelledby="preparation-title">
          <div className={styles.container}>
            <div className={styles.prepPanel}>
              <div className={styles.prepIntro}>
                <p className={styles.sectionLabel}><span>02</span> BEFORE YOU START</p>
                <h2 id="preparation-title">开始之前，<br />准备好这些。</h2>
                <p>准备完成后，就可以跟着教程加载示例工作流，生成自己的第一张图。</p>
                <Link className={styles.secondaryButton} to={tutorialPath}>进入文生图教程 <Arrow /></Link>
              </div>
              <div className={styles.prepList}>
                <div className={styles.prepItem}>
                  <span className={styles.prepNumber}>01</span>
                  <div>
                    <h3>已安装 ComfyUI</h3>
                    <p>确保已经安装并能打开 ComfyUI 界面。</p>
                    <Link className={styles.inlineLink} href="https://www.comfy.org/download">前往官方下载 <span>（站外）</span><Arrow external /></Link>
                  </div>
                </div>
                <div className={styles.prepItem}>
                  <span className={styles.prepNumber}>02</span>
                  <div>
                    <h3>下载 SD1.5 模型</h3>
                    <p>本课使用 fp16 模型文件，约 2.1 GB。下载后放入 <code>models/checkpoints</code> 文件夹。</p>
                    <Link className={styles.inlineLink} href="https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/blob/main/v1-5-pruned-emaonly-fp16.safetensors">查看课程模型 <span>（站外）</span><Arrow external /></Link>
                  </div>
                </div>
                <p className={styles.prepHint}>首次运行需要加载模型，请预留几分钟时间。</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
