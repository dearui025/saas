# Open-Nof1.ai - 多用户SaaS交易平台

## 🎯 项目概述

这是一个基于Next.js和Supabase构建的多用户SaaS交易平台，支持：
- 用户注册和登录
- 个人API密钥管理
- 多用户数据隔离
- 币安交易集成
- AI驱动的交易分析
- 响应式设计

## 📊 开发状态

✅ **已完成 (85%)**
- Supabase数据库架构
- 用户认证系统
- 多用户交易逻辑
- API密钥管理
- 币安集成
- AI分析功能
- 响应式UI

🔄 **待完成**
- 生产环境部署
- 用户测试和反馈
- 性能优化

## 🚀 快速部署

### 方法1：GitHub + Vercel（推荐）

1. **推送代码到GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/open-nof1-ai.git
   git push -u origin main
   ```

2. **在Vercel部署**
   - 访问 https://vercel.com
   - 点击 "New Project"
   - 选择您的GitHub仓库
   - 配置环境变量（见.env.vercel文件）
   - 点击 "Deploy"

### 方法2：使用部署脚本
```bash
chmod +x deploy.sh
./deploy.sh
```

## 🔧 环境变量配置

复制 `.env.vercel` 文件中的所有环境变量到Vercel项目设置中。

## 📱 功能特性

### 用户功能
- 🔐 安全的用户注册和登录
- 🔑 个人API密钥管理
- 📊 个人交易数据仪表板
- 🤖 AI驱动的交易分析

### 管理员功能
- 👥 用户管理
- 📈 平台使用统计
- 🔧 系统配置

### 技术特性
- ⚡ Next.js 15 + React 19
- 🗄️ Supabase数据库
- 🔒 Row Level Security (RLS)
- 📱 响应式设计
- 🎨 Tailwind CSS + Radix UI

## 📁 项目结构

```
open-nof1.ai/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 主页
│   ├── login/             # 登录页面
│   ├── signup/            # 注册页面
│   └── api/               # API路由
├── components/            # React组件
├── lib/                   # 工具库
│   ├── auth/              # 认证逻辑
│   └── supabase/          # Supabase客户端
├── prisma/                # 数据库模式
└── public/                # 静态资源
```

## 🔗 相关文件

- `VERCEL_DEPLOYMENT_GUIDE.md` - 详细部署指南
- `deploy.sh` - 自动化部署脚本
- `.env.vercel` - Vercel环境变量模板
- `docs/` - 项目文档

## 📞 支持

如需技术支持或有任何问题，请检查：
1. 部署指南文档
2. 项目文档
3. Supabase项目设置

---

**🎉 部署成功后，您将拥有一个完全功能的多用户SaaS交易平台！**