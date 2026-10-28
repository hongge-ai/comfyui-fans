#!/usr/bin/env bash
# 从 docs.comfy.org 拉取官方中文文档原始 markdown，保存到本站对应目录。
# 用法: bash scripts/fetch-official.sh
set -euo pipefail
BASE="https://docs.comfy.org"

# 目标路径<TAB>官方页面路径
PAGES=$(cat <<'EOF'
docs/get-started/intro.md	/zh/index.md
docs/get-started/system-requirements.md	/zh/installation/system_requirements.md
docs/get-started/install-desktop-windows.md	/zh/installation/desktop/windows.md
docs/get-started/install-desktop-macos.md	/zh/installation/desktop/macos.md
docs/get-started/install-portable.md	/zh/installation/comfyui_portable_windows.md
docs/get-started/install-manual.md	/zh/installation/manual_install.md
docs/get-started/update.md	/zh/installation/update_comfyui.md
docs/get-started/first-generation.md	/zh/get_started/first_generation.md
docs/get-started/install-custom-nodes.md	/zh/installation/install_custom_node.md
docs/get-started/manager.md	/zh/manager/overview.md
docs/concepts/workflow.md	/zh/basic-concepts/workflow.md
docs/concepts/nodes.md	/zh/basic-concepts/nodes.md
docs/concepts/links.md	/zh/basic-concepts/links.md
docs/concepts/models.md	/zh/basic-concepts/models.md
docs/concepts/custom-nodes.md	/zh/basic-concepts/custom-nodes.md
docs/concepts/dependencies.md	/zh/basic-concepts/dependencies.md
docs/concepts/properties.md	/zh/basic-concepts/properties.md
docs/interface/overview.md	/zh/interface/overview.md
docs/interface/maskeditor.md	/zh/interface/maskeditor.md
docs/interface/template.md	/zh/interface/features/template.md
docs/interface/shortcuts.md	/zh/interface/shortcuts.md
# docs/tutorials/basic/text-to-image.md 已改写成本站原创深度教程，不再从官方拉取，避免覆盖。
docs/tutorials/basic/image-to-image.md	/zh/tutorials/basic/image-to-image.md
docs/tutorials/basic/inpaint.md	/zh/tutorials/basic/inpaint.md
docs/tutorials/basic/outpaint.md	/zh/tutorials/basic/outpaint.md
docs/tutorials/basic/upscale.md	/zh/tutorials/basic/upscale.md
docs/tutorials/basic/lora.md	/zh/tutorials/basic/lora.md
docs/tutorials/basic/multiple-loras.md	/zh/tutorials/basic/multiple-loras.md
docs/tutorials/controlnet/controlnet.md	/zh/tutorials/controlnet/controlnet.md
docs/tutorials/controlnet/pose-controlnet-2-pass.md	/zh/tutorials/controlnet/pose-controlnet-2-pass.md
docs/tutorials/controlnet/depth-controlnet.md	/zh/tutorials/controlnet/depth-controlnet.md
docs/tutorials/controlnet/mixing-controlnets.md	/zh/tutorials/controlnet/mixing-controlnets.md
docs/tutorials/utility/preprocessors.md	/zh/tutorials/utility/preprocessors.md
docs/tutorials/flux/flux-1-text-to-image.md	/zh/tutorials/flux/flux-1-text-to-image.md
docs/tutorials/qwen/qwen-image.md	/zh/tutorials/image/qwen/qwen-image.md
docs/tutorials/video/wan2_2.md	/zh/tutorials/video/wan/wan2_2.md
EOF
)

echo "$PAGES" | while IFS=$'\t' read -r dest src; do
  mkdir -p "$(dirname "$dest")"
  curl -sfL "$BASE$src" -o "$dest"
  # 机械处理（不改措辞）：
  # 1. 删掉开头的 LLM 索引导读（3 行 blockquote）
  # 2. 站内相对链接/资源改成 docs.comfy.org 绝对地址
  # 3. Mintlify <Tab title="..."> 换成 Docusaurus <TabItem value="...">
  sed -i \
    -e '/^> ## Documentation Index$/,+2d' \
    -e 's|](/|](https://docs.comfy.org/|g' \
    -e 's|src="/|src="https://docs.comfy.org/|g' \
    -e 's|href="/|href="https://docs.comfy.org/|g' \
    -e 's|<Tab title="\([^"]*\)">|<TabItem value="\1">|g' \
    -e 's|</Tab>|</TabItem>|g' \
    "$dest"
  echo "OK  $dest"
done
