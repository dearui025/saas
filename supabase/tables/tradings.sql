CREATE TABLE tradings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    chat_id UUID,
    symbol TEXT NOT NULL,
    operation TEXT NOT NULL,
    leverage INTEGER,
    amount INTEGER,
    pricing INTEGER,
    stop_loss INTEGER,
    take_profit INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);