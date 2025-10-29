import { createDeepSeek } from "@ai-sdk/deepseek";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const deepseekModel = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const deepseekv31 = openrouter("deepseek/deepseek-v3.2-exp");

export const deepseekR1 = openrouter("deepseek/deepseek-r1-0528");

export const deepseek = deepseekModel("deepseek-chat");

export const deepseekThinking = deepseekModel("deepseek-reasoner");

// 创建用户特定的DeepSeek模型
export function createUserDeepSeekModel(apiKey: string) {
  const userModel = createDeepSeek({
    apiKey: apiKey,
  });
  
  return userModel("deepseek-reasoner"); // 使用deepseek-reasoner进行交易决策
}

// 创建用户特定的OpenRouter模型（如果提供）
export function createUserOpenRouterModel(apiKey: string) {
  const userRouter = createOpenRouter({
    apiKey: apiKey,
  });
  
  return userRouter("deepseek/deepseek-r1-0528");
}
