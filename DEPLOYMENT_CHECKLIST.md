# ✅ 部署检查清单

## 部署前准备
- [ ] Vercel账户已创建
- [ ] GitHub仓库已创建（如果使用GitHub部署）
- [ ] 项目代码已推送到GitHub

## Vercel配置
- [ ] 项目已导入到Vercel
- [ ] 环境变量已配置（从.env.vercel复制）
- [ ] 构建命令：`npm run build`
- [ ] 输出目录：`.next`

## 环境变量检查
确保以下环境变量在Vercel中正确设置：
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `DEEPSEEK_API_KEY`
- [ ] `NEXT_PUBLIC_URL`
- [ ] `CRON_SECRET_KEY`
- [ ] `START_MONEY`

## 部署后验证
- [ ] 网站可以正常访问
- [ ] 用户注册功能正常
- [ ] 用户登录功能正常
- [ ] API密钥配置页面正常
- [ ] 交易功能正常（如果有真实API密钥）

## 故障排除
如果遇到问题：
1. 检查Vercel构建日志
2. 验证环境变量是否正确
3. 检查Supabase项目状态
4. 确认API密钥有效性

---
**完成所有检查项后，您的SaaS平台就可以正式使用了！**