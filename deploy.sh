#!/usr/bin/env bash
# 一键部署：AI 启蒙乐园课程 → GitHub (ruby1345/ai-kindergarten)
# 用法：在你的终端(能访问 github.com 的网络)执行:
#   bash deploy.sh
# 说明：自动提交所有改动并推送到 main，触发 GitHub Pages 自动部署。
set -e
cd "$(dirname "$0")"

echo "==> 1/4 配置 git 身份(避免推送被拒)"
git config user.name "rubyice"     >/dev/null 2>&1 || true
git config user.email "rubyice@users.noreply.github.com" >/dev/null 2>&1 || true

echo "==> 2/4 暂存并提交全部改动"
git add -A
if ! git diff --cached --quiet; then
  git commit -m "deploy: 第一二节接入 edge-tts 真人云语音 + 课程内容" --quiet
  echo "    已提交新改动"
else
  echo "    无新增改动，跳过提交"
fi

echo "==> 3/4 拉取远程最新(自动合并) "
git pull --rebase origin main || echo "    (拉取失败，继续推送尝试)"

echo "==> 4/4 推送到 GitHub main"
git push origin main

echo ""
echo "✅ 推送完成！GitHub Pages 会自动重新部署(通常 1-3 分钟生效)。"
echo "   部署后请访问: https://ruby1345.github.io/ai-kindergarten/"