import React, { useState } from 'react';
import { StockData, AIAnalysisResponse } from '../types';
import { analyzeStockWithAI } from '../services/geminiService';
import { Bot, Sparkles, AlertTriangle, TrendingUp, TrendingDown, MinusCircle, Loader2 } from 'lucide-react';

interface AIAnalystCardProps {
  stock: StockData;
}

const AIAnalystCard: React.FC<AIAnalystCardProps> = ({ stock }) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await analyzeStockWithAI(stock);
      setAnalysis(result);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการวิเคราะห์ กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  };

  // Reset analysis when stock changes
  React.useEffect(() => {
    setAnalysis(null);
    setError('');
  }, [stock.symbol]);

  const renderRecommendationBadge = (rec: string) => {
    switch (rec) {
      case 'BUY':
        return <span className="px-4 py-1 bg-green-500/20 text-green-400 border border-green-500/50 rounded-full font-bold flex items-center gap-2"><TrendingUp size={16} /> แนะนำ: ซื้อ (BUY)</span>;
      case 'SELL':
        return <span className="px-4 py-1 bg-red-500/20 text-red-400 border border-red-500/50 rounded-full font-bold flex items-center gap-2"><TrendingDown size={16} /> แนะนำ: ขาย (SELL)</span>;
      default:
        return <span className="px-4 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 rounded-full font-bold flex items-center gap-2"><MinusCircle size={16} /> แนะนำ: ถือ (HOLD)</span>;
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 border border-indigo-500/30 shadow-lg shadow-indigo-900/20 relative overflow-hidden">
      {/* Background Decorative Effect */}
      <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
        <Bot size={120} />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-600 rounded-lg text-white">
          <Sparkles size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Gemini AI Analyst</h2>
          <p className="text-slate-400 text-sm">ผู้ช่วยวิเคราะห์การลงทุนอัจฉริยะ</p>
        </div>
      </div>

      {!analysis && !loading && (
        <div className="text-center py-8">
          <p className="text-slate-300 mb-4">กดปุ่มด้านล่างเพื่อให้ AI วิเคราะห์ปัจจัยพื้นฐานและเทคนิคของ {stock.symbol}</p>
          <button 
            onClick={handleAnalyze}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center gap-2 mx-auto"
          >
            <Sparkles size={18} />
            เริ่มวิเคราะห์ด้วย AI
          </button>
        </div>
      )}

      {loading && (
        <div className="py-12 text-center">
          <Loader2 className="animate-spin mx-auto text-indigo-400 mb-3" size={32} />
          <p className="text-indigo-300 animate-pulse">กำลังประมวลผลข้อมูลการตลาด...</p>
        </div>
      )}

      {analysis && !loading && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {renderRecommendationBadge(analysis.recommendation)}
            <div className="text-slate-400 text-sm">
              ความมั่นใจ: <span className="text-white font-medium">{analysis.confidenceScore}%</span>
            </div>
          </div>

          <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-700/50">
            <h3 className="text-slate-200 font-semibold mb-3">เหตุผลประกอบ (Reasoning)</h3>
            <ul className="space-y-2">
              {analysis.reasoning.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                  <span className="text-indigo-400 mt-1">•</span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-950/20 p-4 rounded-lg border border-red-900/30">
              <div className="flex items-center gap-2 text-red-400 font-semibold mb-2">
                <AlertTriangle size={16} />
                ความเสี่ยง (Risk)
              </div>
              <p className="text-slate-300 text-sm">{analysis.riskAssessment}</p>
            </div>
            
            {analysis.targetPrice && (
               <div className="bg-green-950/20 p-4 rounded-lg border border-green-900/30 flex flex-col justify-center items-center">
                 <span className="text-slate-400 text-sm mb-1">ราคาเป้าหมาย (Target)</span>
                 <span className="text-2xl font-bold text-green-400">฿{analysis.targetPrice.toFixed(2)}</span>
               </div>
            )}
          </div>
        </div>
      )}
      
      {error && !loading && (
         <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-center text-sm">
           {error}
         </div>
      )}
    </div>
  );
};

export default AIAnalystCard;
