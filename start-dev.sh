#!/bin/bash

# 启动脚本 - 用于测试应用

echo "正在清理旧进程..."
pkill -9 -f "next dev" 2>/dev/null
pkill -9 -f "next build" 2>/dev/null
sleep 2

echo "正在启动Next.js开发服务器..."
cd /workspace/open-nof1.ai

# 设置环境变量
export NODE_OPTIONS="--max-old-space-size=4096"
export PORT=3000

# 启动开发服务器
pnpm run dev
