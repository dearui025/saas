import { Position } from "ccxt";
import { binance, createBinanceClient } from "./binance";

export interface AccountInformationAndPerformance {
  currentPositionsValue: number;
  contractValue: number;
  totalCashValue: number;
  availableCash: number;
  currentTotalReturn: number;
  positions: Position[];
  sharpeRatio: number;
}

interface ApiConfig {
  apiKey?: string;
  apiSecret?: string;
  sandbox?: boolean;
}

export async function getAccountInformationAndPerformance(
  initialCapital: number,
  config?: ApiConfig
): Promise<AccountInformationAndPerformance> {
  // 使用用户特定的API密钥或默认客户端
  const client = config?.apiKey && config?.apiSecret
    ? createBinanceClient(config.apiKey, config.apiSecret, config.sandbox)
    : binance;

  const positions = await client.fetchPositions(["BTC/USDT"]);
  const currentPositionsValue = positions.reduce((acc, position) => {
    return acc + (position.initialMargin || 0) + (position.unrealizedPnl || 0);
  }, 0);
  const contractValue = positions.reduce((acc, position) => {
    return acc + (position.contracts || 0);
  }, 0);
  const currentCashValue = await client.fetchBalance({ type: "future" });
  const totalCashValue = currentCashValue.USDT.total || 0;
  const availableCash = currentCashValue.USDT.free || 0;
  const currentTotalReturn = (totalCashValue - initialCapital) / initialCapital;
  const sharpeRatio =
    currentTotalReturn /
    (positions.reduce((acc, position) => {
      return acc + (position.unrealizedPnl || 0);
    }, 0) /
      initialCapital);

  return {
    currentPositionsValue,
    contractValue,
    totalCashValue,
    availableCash,
    currentTotalReturn,
    positions,
    sharpeRatio,
  };
}

export function formatAccountPerformance(
  accountPerformance: AccountInformationAndPerformance
) {
  const { currentTotalReturn, availableCash, totalCashValue, positions } =
    accountPerformance;

  const output = `## HERE IS YOUR ACCOUNT INFORMATION & PERFORMANCE
Current Total Return (percent): ${currentTotalReturn * 100}%
Available Cash: ${availableCash}
Current Account Value: ${totalCashValue}
Positions: ${positions
    .map((position) =>
      JSON.stringify({
        symbol: position.symbol,
        quantity: position.contracts,
        entry_price: position.entryPrice,
        current_price: position.markPrice,
        liquidation_price: position.liquidationPrice,
        unrealized_pnl: position.unrealizedPnl,
        leverage: position.leverage,
        notional_usd: position.notional,
        side: position.side,
        stopLoss: position.stopLossPrice,
        takeProfit: position.takeProfitPrice,
      })
    )
    .join("\n")}`;
  return output;
}
