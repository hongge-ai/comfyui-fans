/**
 * 站点侧边栏结构。
 *
 * 首期只上线一篇原创教程，因此侧边栏只保留这一条路径。
 * 其余 38 篇文档仍留在 docs/ 下，并带有 `unlisted: true`：
 * 它们不显示在侧边栏、不进入 sitemap、带 noindex，直链仍可访问，
 * 便于随时上架，也不会让站内链接与构建校验失败。
 *
 * 恢复完整目录时，把下方 items 换回按分类组织的结构即可。
 */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: '教程',
      collapsible: false,
      collapsed: false,
      items: ['tutorials/basic/text-to-image'],
    },
  ],
};

module.exports = sidebars;
