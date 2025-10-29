#!/bin/bash

# Open-Nof1.ai 自动部署脚本
# 使用方法: ./deploy.sh

echo "🚀 开始部署 Open-Nof1.ai 到 Vercel..."

# 检查是否安装了Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI 未安装，正在安装..."
    npm install -g vercel
fi

# 登录Vercel（如果需要）
echo "📝 请确保您已登录Vercel..."
read -p "按回车键继续..."

# 部署到生产环境
echo "🌐 正在部署到生产环境..."
vercel --prod

echo "✅ 部署完成！"
echo "📋 请检查上面的输出以获取部署URL"
echo ""
echo "🔧 如果需要配置环境变量，请访问:"
echo "   https://vercel.com/dashboard"
echo "   选择您的项目 → Settings → Environment Variables"
echo ""
echo "🌟 部署成功后，您的应用将包括:"
echo "   - 用户注册和登录系统"
echo "   - 个人API密钥管理"
echo "   - 多用户数据隔离"
echo "   - 币安交易集成"
echo "   - AI分析功能"
echo "   - 响应式设计"