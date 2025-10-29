# Open-Nof1.ai Vercel部署指南

## 快速部署步骤

### 1. 准备工作
确保您有以下账户：
- Vercel账户（https://vercel.com）
- GitHub账户（推荐）

### 2. GitHub部署方式（推荐）

#### 步骤1：推送代码到GitHub
```bash
# 在项目根目录执行
git init
git add .
git commit -m "Initial commit: Open-Nof1.ai SaaS platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/open-nof1-ai.git
git push -u origin main
```

#### 步骤2：连接Vercel
1. 访问 https://vercel.com
2. 点击 "New Project"
3. 选择 "Import Git Repository"
4. 选择您的GitHub仓库
5. 点击 "Import"

#### 步骤3：配置环境变量
在Vercel项目设置中添加以下环境变量：

```
NEXT_PUBLIC_SUPABASE_URL=https://gfupllultrrqgmvwziym.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmdXBsbHVsdHJycWdtdnd6aXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2ODQzMTcsImV4cCI6MjA3NzI2MDMxN30.Acz9iKXv4i9ASeuxcrp5Gz3j9VmtOtozFiJ1x_AflFU
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmdXBsbHVsdHJycWdtdnd6aXltIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTY4NDMxNywiZXhwIjoyMDc3MjYwMzE3fQ.cvJnycjVPF2wPepb0GDdiI79NU4GEqFbKnU9T-rkl0o
DEEPSEEK_API_KEY=sk-95142b92e0964668bf65bcfeaf43aa4d
NEXT_PUBLIC_URL=https://your-app.vercel.app
```

#### 步骤4：部署
1. 点击 "Deploy"
2. 等待构建完成（约2-5分钟）
3. 获得部署URL

### 3. Vercel CLI部署方式

如果您已安装Vercel CLI：
```bash
cd /workspace/open-nof1.ai
vercel login
vercel --prod
```

### 4. 部署后验证

部署成功后，您将获得类似这样的URL：
- `https://open-nof1-ai-abc123.vercel.app`
- `https://your-custom-domain.vercel.app`

### 5. 常见问题解决

#### 构建失败
- 检查环境变量是否正确设置
- 确保所有依赖都已安装
- 查看构建日志定位具体错误

#### 页面无法访问
- 检查Next.js配置
- 确认路由配置正确
- 验证Supabase连接

#### 功能异常
- 验证API密钥是否正确
- 检查Supabase数据库连接
- 确认用户认证流程

### 6. 自定义域名（可选）

1. 在Vercel项目设置中添加域名
2. 配置DNS记录
3. 等待SSL证书自动生成

## 部署完成后

您将拥有一个完全功能的SaaS平台，包括：
- ✅ 用户注册和登录
- ✅ 个人API密钥管理
- ✅ 多用户数据隔离
- ✅ 交易功能（币安集成）
- ✅ AI分析功能
- ✅ 响应式设计

部署URL将立即可用，用户可以开始注册和使用！