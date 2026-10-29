// @ts-check
// NOTE: This site is an independent teaching replica inspired by the layout of
// docs.comfy.org (which is hosted on Mintlify, a closed platform). Docusaurus
// is the closest self-hostable open-source equivalent. All tutorial prose is
// original writing; ComfyUI is an open-source project by Comfy Org.

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ComfyUI Fans',
  tagline: '对齐官方文档的 ComfyUI 中文教程站，让每位爱好者都能学会 ComfyUI',
  favicon: 'img/favicon.svg',
  url: 'https://comfyui.fans',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        logo: {
          alt: 'ComfyUI Fans',
          src: 'img/logo.svg',
        },
        items: [
          {
            to: '/docs/tutorials/basic/text-to-image',
            label: '开始学习',
            position: 'right',
            className: 'navbar-cta',
          },
          {
            href: 'https://docs.comfy.org/zh',
            label: '官方文档 ↗',
            position: 'right',
          },
          {
            href: 'https://github.com/comfyanonymous/ComfyUI',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: '文档',
            items: [
              { label: '文生图：从第一张图到每个参数', to: '/docs/tutorials/basic/text-to-image' },
            ],
          },
          {
            title: '官方教程',
            items: [
              {
                label: '文生图（官方版）',
                href: 'https://docs.comfy.org/zh/tutorials/basic/text-to-image',
              },
              {
                label: '图生图（官方版）',
                href: 'https://docs.comfy.org/zh/tutorials/basic/image-to-image',
              },
              {
                label: '官方教程目录',
                href: 'https://docs.comfy.org/zh/tutorials/overview',
              },
            ],
          },
          {
            title: '官方资源',
            items: [
              {
                label: 'ComfyUI 官方文档',
                href: 'https://docs.comfy.org/zh',
              },
              {
                label: 'ComfyUI GitHub 仓库',
                href: 'https://github.com/comfyanonymous/ComfyUI',
              },
              {
                label: 'Comfy 官网',
                href: 'https://www.comfy.org/',
              },
              {
                label: 'Comfy Examples 工作流模板',
                href: 'https://comfyanonymous.github.io/ComfyUI_examples/',
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} ComfyUI Fans（comfyui.fans）· 个人学习用途的独立爱好者教学站，与 Comfy Org 无从属关系。<br/>
ComfyUI 及其名称、标识的版权归 comfyanonymous 与 Comfy Org 所有，软件以 <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" rel="noopener noreferrer">GPL-3.0</a> 协议开源；本站内容基于 <a href="https://docs.comfy.org/zh" target="_blank" rel="noopener noreferrer">ComfyUI 官方中文文档</a> 整理与调整，版权归原作者所有，仅供学习交流、非商业用途，如有侵权请联系删除。`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['bash', 'powershell'],
      },
      mermaid: {
        options: {
          fontFamily: 'inherit',
        },
      },
    }),
};

module.exports = config;
