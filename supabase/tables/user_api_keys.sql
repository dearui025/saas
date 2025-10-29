CREATE TABLE user_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    binance_api_key TEXT,
    binance_api_secret TEXT,
    binance_use_sandbox BOOLEAN DEFAULT true,
    deepseek_api_key TEXT,
    openrouter_api_key TEXT,
    exa_api_key TEXT,
    start_money INTEGER DEFAULT 10000,
    trading_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);