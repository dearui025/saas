CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    model TEXT DEFAULT 'Deepseek',
    chat TEXT DEFAULT '<no chat>',
    reasoning TEXT NOT NULL,
    user_prompt TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);