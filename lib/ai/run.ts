import { generateObject } from "ai";
import { generateUserPrompt, tradingPrompt } from "./prompt";
import { getCurrentMarketState } from "../trading/current-market-state";
import { z } from "zod";
import { deepseekR1 } from "./model";
import { getAccountInformationAndPerformance } from "../trading/account-information-and-performance";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";

interface UserConfig {
  userId: string;
  deepseekApiKey: string;
  binanceApiKey?: string;
  binanceApiSecret?: string;
  binanceUseSandbox: boolean;
  startMoney: number;
}

/**
 * you can interval trading using cron job
 */
export async function run(initialCapital: number, userConfig?: UserConfig) {
  const currentMarketState = await getCurrentMarketState("BTC/USDT");
  const accountInformationAndPerformance = await getAccountInformationAndPerformance(
    initialCapital,
    userConfig ? {
      apiKey: userConfig.binanceApiKey,
      apiSecret: userConfig.binanceApiSecret,
      sandbox: userConfig.binanceUseSandbox,
    } : undefined
  );

  const supabase = await createSupabaseClient();

  // 获取用户的聊天记录数量
  let invocationCount = 0;
  if (userConfig) {
    const { count } = await supabase
      .from("chats")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userConfig.userId);
    invocationCount = count || 0;
  }

  const userPrompt = generateUserPrompt({
    currentMarketState,
    accountInformationAndPerformance,
    startTime: new Date(),
    invocationCount,
  });

  // 使用用户的DeepSeek API密钥
  const { createUserDeepSeekModel, createUserOpenRouterModel } = await import("./model");
  const model = userConfig?.deepseekApiKey 
    ? createUserDeepSeekModel(userConfig.deepseekApiKey)
    : deepseekR1;

  const { object, reasoning } = await generateObject({
    model,
    system: tradingPrompt,
    prompt: userPrompt,
    output: "object",
    mode: "json",
    schema: z.object({
      opeartion: z.enum(["Buy", "Sell", "Hold"]),
      buy: z
        .object({
          pricing: z.number().describe("The pricing of you want to buy in."),
          amount: z.number(),
          leverage: z.number().min(1).max(20),
        })
        .optional()
        .describe("If opeartion is buy, generate object"),
      sell: z
        .object({
          percentage: z
            .number()
            .min(0)
            .max(100)
            .describe("Percentage of position to sell"),
        })
        .optional()
        .describe("If opeartion is sell, generate object"),
      adjustProfit: z
        .object({
          stopLoss: z
            .number()
            .optional()
            .describe("The stop loss of you want to set."),
          takeProfit: z
            .number()
            .optional()
            .describe("The take profit of you want to set."),
        })
        .optional()
        .describe(
          "If opeartion is hold and you want to adjust the profit, generate object"
        ),
      chat: z
        .string()
        .describe(
          "The reason why you do this opeartion, and tell me your anlyaise"
        ),
    }),
  });

  if (!userConfig) {
    // 旧的单用户模式（兼容性，已废弃）
    return;
  }

  // 创建聊天记录
  const { data: chatRecord, error: chatError } = await supabase
    .from("chats")
    .insert({
      user_id: userConfig.userId,
      reasoning: reasoning || "<no reasoning>",
      chat: object.chat || "<no chat>",
      user_prompt: userPrompt,
      model: "Deepseek",
    })
    .select()
    .single();

  if (chatError) {
    console.error("创建聊天记录失败:", chatError);
    return;
  }

  // 创建交易记录
  const tradingData: any = {
    user_id: userConfig.userId,
    chat_id: chatRecord.id,
    symbol: "BTC",
    operation: object.opeartion,
  };

  if (object.opeartion === "Buy" && object.buy) {
    tradingData.pricing = object.buy.pricing;
    tradingData.amount = object.buy.amount;
    tradingData.leverage = object.buy.leverage;
  }

  if (object.opeartion === "Hold" && object.adjustProfit) {
    const shouldAdjustProfit = object.adjustProfit.stopLoss && object.adjustProfit.takeProfit;
    if (shouldAdjustProfit) {
      tradingData.stop_loss = object.adjustProfit.stopLoss;
      tradingData.take_profit = object.adjustProfit.takeProfit;
    }
  }

  const { error: tradingError } = await supabase
    .from("tradings")
    .insert(tradingData);

  if (tradingError) {
    console.error("创建交易记录失败:", tradingError);
  }
}
