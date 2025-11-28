export interface StockData {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  pe: number;
  pbv: number;
  dividendYield: number;
  marketCap: string; // e.g., "1.2T"
  volume: string;
  rsi: number; // Relative Strength Index (0-100)
  description: string;
  latestNews: string;
}

export interface StockHistoryPoint {
  date: string;
  price: number;
}

export interface AIAnalysisResponse {
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  confidenceScore: number; // 0-100
  reasoning: string[];
  riskAssessment: string;
  targetPrice?: number;
}
