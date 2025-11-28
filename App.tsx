import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  UserCircle,
  Menu,
  X
} from 'lucide-react';
import { getStocks, getStockHistory } from './services/stockService';
import { StockData, StockHistoryPoint } from './types';
import StockChart from './components/StockChart';
import AIAnalystCard from './components/AIAnalystCard';

const App: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [stockHistory, setStockHistory] = useState<StockHistoryPoint[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Initial Load
    getStocks().then(data => {
      setStocks(data);
      if (data.length > 0) {
        handleSelectStock(data[0]);
      }
    });
  }, []);

  const handleSelectStock = async (stock: StockData) => {
    setSelectedStock(stock);
    setSidebarOpen(false); // Close sidebar on mobile on selection
    setLoadingHistory(true);
    try {
      const history = await getStockHistory(stock.symbol);
      setStockHistory(history);
    } finally {
      setLoadingHistory(false);
    }
  };

  const filteredStocks = stocks.filter(s => 
    s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Activity className="text-white" size={20} />
            </div>
            <h1 className="text-lg font-bold tracking-tight">ThaiStock AI</h1>
            <button 
              className="ml-auto lg:hidden text-slate-400"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="ค้นหาหุ้น (e.g., PTT)"
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
            {filteredStocks.map((stock) => (
              <button
                key={stock.symbol}
                onClick={() => handleSelectStock(stock)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left ${
                  selectedStock?.symbol === stock.symbol 
                    ? 'bg-indigo-600/10 border border-indigo-500/50 text-indigo-400' 
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div>
                  <div className="font-bold">{stock.symbol}</div>
                  <div className="text-xs opacity-70 truncate w-24">{stock.name}</div>
                </div>
                <div className={`text-right ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  <div className="font-mono text-sm">{stock.price.toFixed(2)}</div>
                  <div className="text-xs">{stock.changePercent > 0 ? '+' : ''}{stock.changePercent}%</div>
                </div>
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-slate-800">
             <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50">
               <UserCircle className="text-slate-400" />
               <div className="text-xs">
                 <p className="text-slate-200 font-medium">เจ้าหน้าที่บัญชี</p>
                 <p className="text-slate-500">Finance Dept.</p>
               </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-700">
        
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen(true)} className="text-slate-300">
              <Menu size={24} />
            </button>
            <span className="font-bold text-white">ThaiStock AI</span>
          </div>
        </header>

        {selectedStock ? (
          <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-white">{selectedStock.symbol}</h1>
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-300 border border-slate-600">
                    {selectedStock.sector}
                  </span>
                </div>
                <p className="text-slate-400 mt-1">{selectedStock.name}</p>
              </div>
              <div className="flex items-end flex-col">
                <div className="text-4xl font-mono font-bold text-white">
                  ฿{selectedStock.price.toFixed(2)}
                </div>
                <div className={`flex items-center gap-1 font-medium ${selectedStock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedStock.change >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  <span>{selectedStock.change > 0 ? '+' : ''}{selectedStock.change.toFixed(2)} ({selectedStock.changePercent}%)</span>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <p className="text-slate-500 text-xs uppercase mb-1">P/E Ratio</p>
                <p className="text-xl font-semibold text-slate-200">{selectedStock.pe}</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <p className="text-slate-500 text-xs uppercase mb-1">Div. Yield</p>
                <p className="text-xl font-semibold text-green-400">{selectedStock.dividendYield}%</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <p className="text-slate-500 text-xs uppercase mb-1">RSI (14)</p>
                <p className={`text-xl font-semibold ${
                  selectedStock.rsi > 70 ? 'text-red-400' : selectedStock.rsi < 30 ? 'text-green-400' : 'text-slate-200'
                }`}>{selectedStock.rsi}</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <p className="text-slate-500 text-xs uppercase mb-1">Market Cap</p>
                <p className="text-xl font-semibold text-slate-200">{selectedStock.marketCap}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart Section */}
              <div className="lg:col-span-2 space-y-6">
                {loadingHistory ? (
                  <div className="h-[300px] w-full bg-slate-900/50 rounded-xl flex items-center justify-center border border-slate-800">
                    <p className="text-slate-500 animate-pulse">กำลังโหลดกราฟ...</p>
                  </div>
                ) : (
                  <StockChart 
                    data={stockHistory} 
                    color={selectedStock.change >= 0 ? '#4ade80' : '#f87171'} 
                  />
                )}

                {/* News & Info */}
                <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                  <h3 className="text-lg font-semibold text-white mb-4">ข้อมูลบริษัท & ข่าวสาร</h3>
                  <div className="space-y-4">
                     <div>
                       <p className="text-xs text-slate-500 uppercase">รายละเอียดธุรกิจ</p>
                       <p className="text-slate-300 mt-1">{selectedStock.description}</p>
                     </div>
                     <div className="pt-4 border-t border-slate-800">
                       <p className="text-xs text-slate-500 uppercase">หัวข้อข่าวล่าสุด</p>
                       <p className="text-slate-300 mt-1 italic">"{selectedStock.latestNews}"</p>
                     </div>
                  </div>
                </div>
              </div>

              {/* AI Analysis Section */}
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <AIAnalystCard stock={selectedStock} />
                  
                  <div className="mt-4 p-4 rounded-xl bg-indigo-900/10 border border-indigo-500/20">
                     <div className="flex items-center gap-2 mb-2">
                       <LayoutDashboard className="text-indigo-400" size={16} />
                       <h4 className="text-sm font-semibold text-indigo-300">Tips สำหรับนักบัญชี</h4>
                     </div>
                     <p className="text-xs text-slate-400">
                       ค่า P/E ต่ำกว่า 10 อาจบ่งบอกว่าหุ้นมีราคาถูกเมื่อเทียบกับกำไร แต่อย่าลืมตรวจสอบหนี้สินต่อทุน (D/E Ratio) เพิ่มเติมเพื่อความปลอดภัย
                     </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500">
             <div className="text-center">
               <PieChart size={48} className="mx-auto mb-4 opacity-50" />
               <p>เลือกหุ้นจากรายการด้านซ้ายเพื่อเริ่มต้น</p>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
