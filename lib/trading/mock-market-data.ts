// 模拟市场数据，用于在无法连接Binance时提供数据
export interface MockMarketState {
  // Current indicators
  current_price: number;
  current_ema20: number;
  current_macd: number;
  current_rsi: number;

  // Open Interest
  open_interest: {
    latest: number;
    average: number;
  };

  // Funding Rate
  funding_rate: number;

  // Intraday series (by minute)
  intraday: {
    mid_prices: number[];
    ema_20: number[];
    macd: number[];
    rsi_7: number[];
    rsi_14: number[];
  };

  // Longer-term context (4-hour timeframe)
  longer_term: {
    ema_20: number;
    ema_50: number;
    atr_3: number;
    atr_14: number;
    current_volume: number;
    average_volume: number;
    macd: number[];
    rsi_14: number[];
  };
}

// 生成模拟市场数据
export function generateMockMarketData(symbol: string): MockMarketState {
  // 为不同币种设置不同的基础价格
  const basePrices: Record<string, number> = {
    'BTC': 65000,
    'ETH': 3500,
    'SOL': 150,
    'BNB': 600,
    'DOGE': 0.35
  };
  
  const symbolKey = symbol.split('/')[0];
  const basePrice = basePrices[symbolKey] || 1000;
  
  // 生成随机价格波动
  const current_price = basePrice * (0.95 + Math.random() * 0.1);
  
  // 生成模拟的技术指标
  const current_ema20 = current_price * (0.98 + Math.random() * 0.04);
  const current_macd = (Math.random() - 0.5) * 10;
  const current_rsi = 30 + Math.random() * 40;
  
  // 生成模拟的日内数据
  const mid_prices = Array.from({ length: 10 }, (_, i) => 
    current_price * (0.99 + (Math.random() * 0.02))
  );
  
  const ema_20 = Array.from({ length: 10 }, (_, i) => 
    current_ema20 * (0.99 + (Math.random() * 0.02))
  );
  
  const macd = Array.from({ length: 10 }, (_, i) => 
    (Math.random() - 0.5) * 10
  );
  
  const rsi_7 = Array.from({ length: 10 }, (_, i) => 
    30 + Math.random() * 40
  );
  
  const rsi_14 = Array.from({ length: 10 }, (_, i) => 
    30 + Math.random() * 40
  );
  
  // 生成模拟的长期数据
  const ema_50 = current_price * (0.97 + Math.random() * 0.06);
  const atr_3 = current_price * 0.02 * (0.8 + Math.random() * 0.4);
  const atr_14 = current_price * 0.03 * (0.8 + Math.random() * 0.4);
  const current_volume = 1000000 * (0.5 + Math.random() * 1.5);
  const average_volume = 1200000 * (0.5 + Math.random() * 1.5);
  
  const macd_long = Array.from({ length: 10 }, (_, i) => 
    (Math.random() - 0.5) * 10
  );
  
  const rsi_14_long = Array.from({ length: 10 }, (_, i) => 
    30 + Math.random() * 40
  );
  
  return {
    current_price,
    current_ema20,
    current_macd,
    current_rsi,
    open_interest: {
      latest: 100000 + Math.random() * 50000,
      average: 95000 + Math.random() * 55000,
    },
    funding_rate: (Math.random() - 0.5) * 0.01,
    intraday: {
      mid_prices,
      ema_20,
      macd,
      rsi_7,
      rsi_14,
    },
    longer_term: {
      ema_20: current_ema20,
      ema_50,
      atr_3,
      atr_14,
      current_volume,
      average_volume,
      macd: macd_long,
      rsi_14: rsi_14_long,
    },
  };
}

// 获取模拟市场数据的函数
export async function getMockMarketState(symbol: string): Promise<MockMarketState> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
  
  return generateMockMarketData(symbol);
}