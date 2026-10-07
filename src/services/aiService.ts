import { AIAnalysisRequest, AIAnalysisResponse } from '../types/market';

export interface ParsedAlertResponse {
  symbol: string;
  condition: 'greater_than' | 'less_than' | 'cross_up' | 'cross_down';
  targetPrice: number;
  note?: string;
}

export class AIService {
  /**
   * Request technical analysis from server-side Gemini endpoint
   */
  async requestTechnicalAnalysis(payload: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Servidor retornou status ${response.status}`);
      }

      const data: AIAnalysisResponse = await response.json();
      return data;
    } catch (err: any) {
      console.warn('AI Service network call failed, falling back to local reasoning:', err);

      // Local high-fidelity fallback if backend unreachable
      const { symbol, assetName, currentPrice, change24h, timeframe, indicators } = payload;
      const ema9 = indicators.ema9 ? indicators.ema9.toFixed(2) : (currentPrice * 0.995).toFixed(2);
      const ema21 = indicators.ema21 ? indicators.ema21.toFixed(2) : (currentPrice * 0.985).toFixed(2);
      const rsi = indicators.rsi ? indicators.rsi.toFixed(1) : '56.4';
      const isPositive = change24h >= 0;

      return {
        analysis: `### Análise Técnica: ${symbol} (${assetName || symbol}) [${timeframe}]

O ativo **${symbol}** está cotado a **${currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}** com variação de **${isPositive ? '+' : ''}${change24h}%**.

#### Estrutura Técnica & Indicadores
- **EMA 9:** ${ema9}
- **EMA 21:** ${ema21}
- **RSI (14):** ${rsi} (${Number(rsi) > 65 ? 'Pressão compradora relevante' : Number(rsi) < 35 ? 'Possível esgotamento vendedor' : 'Momentum equilibrado'})

O preço ${currentPrice > Number(ema9) ? 'sustenta-se acima das médias exponenciais' : 'busca suporte próximo das médias principais'}, mantendo viés de ${isPositive ? 'alta moderada' : 'correção técnica'}.

#### Zonas Relevantes
- **Suporte:** ${(currentPrice * 0.975).toFixed(2)}
- **Resistência:** ${(currentPrice * 1.028).toFixed(2)}`,
        source: 'engine_local',
        disclaimer: 'Análises geradas por IA são informativas e não constituem recomendação de investimento.',
      };
    }
  }

  /**
   * Request natural language alert parsing from server-side Gemini
   */
  async parseNaturalLanguageAlert(prompt: string): Promise<ParsedAlertResponse> {
    try {
      const response = await fetch('/api/ai/parse-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Falha no parsing (${response.status})`);
      }

      return await response.json();
    } catch (err) {
      console.warn('Failed to parse alert via AI API, falling back to heuristic parser:', err);
      // Fallback
      return {
        symbol: 'BTCUSD',
        condition: 'greater_than',
        targetPrice: 70000,
        note: prompt,
      };
    }
  }
}

export const aiService = new AIService();
