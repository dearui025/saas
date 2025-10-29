-- Migration: enable_rls_policies
-- Created at: 1761692035

-- 启用RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE tradings ENABLE ROW LEVEL SECURITY;

-- profiles表的RLS策略
CREATE POLICY "用户可以查看自己的配置" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "用户可以更新自己的配置" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "用户可以插入自己的配置" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- user_api_keys表的RLS策略
CREATE POLICY "用户可以查看自己的API密钥" ON user_api_keys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "用户可以插入自己的API密钥" ON user_api_keys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的API密钥" ON user_api_keys
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的API密钥" ON user_api_keys
  FOR DELETE USING (auth.uid() = user_id);

-- metrics表的RLS策略
CREATE POLICY "用户可以查看自己的指标" ON metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "用户可以插入自己的指标" ON metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- chats表的RLS策略
CREATE POLICY "用户可以查看自己的对话" ON chats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "用户可以插入自己的对话" ON chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的对话" ON chats
  FOR UPDATE USING (auth.uid() = user_id);

-- tradings表的RLS策略
CREATE POLICY "用户可以查看自己的交易" ON tradings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "用户可以插入自己的交易" ON tradings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的交易" ON tradings
  FOR UPDATE USING (auth.uid() = user_id);

-- 创建索引以提高查询性能
CREATE INDEX idx_user_api_keys_user_id ON user_api_keys(user_id);
CREATE INDEX idx_metrics_user_id ON metrics(user_id);
CREATE INDEX idx_metrics_created_at ON metrics(created_at DESC);
CREATE INDEX idx_chats_user_id ON chats(user_id);
CREATE INDEX idx_chats_created_at ON chats(created_at DESC);
CREATE INDEX idx_tradings_user_id ON tradings(user_id);
CREATE INDEX idx_tradings_chat_id ON tradings(chat_id);
CREATE INDEX idx_tradings_created_at ON tradings(created_at DESC);

-- 创建触发器自动更新updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_api_keys_updated_at BEFORE UPDATE ON user_api_keys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_metrics_updated_at BEFORE UPDATE ON metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chats_updated_at BEFORE UPDATE ON chats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tradings_updated_at BEFORE UPDATE ON tradings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();;