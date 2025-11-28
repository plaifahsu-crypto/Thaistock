import { StockData, StockHistoryPoint } from '../types';

// Mock Data for Thai Stocks
const MOCK_STOCKS: StockData[] = [
  {
    symbol: 'PTT',
    name: 'PTT Public Company Limited',
    sector: 'Energy',
    price: 34.50,
    change: -0.25,
    changePercent: -0.72,
    pe: 8.5,
    pbv: 0.85,
    dividendYield: 5.8,
    marketCap: '985B',
    volume: '45M',
    rsi: 42,
    description: 'บริษัทพลังงานแห่งชาติ ดำเนินธุรกิจก๊าซธรรมชาติ น้ำมัน และปิโตรเคมีครบวงจร',
    latestNews: 'ราคาน้ำมันดิบโลกผันผวน ส่งผลกระทบต่อกำไรระยะสั้น แต่โครงการพลังงานสะอาดเริ่มเห็นผล'
  },
  {
    symbol: 'AOT',
    name: 'Airports of Thailand',
    sector: 'Transportation',
    price: 63.25,
    change: 1.25,
    changePercent: 2.02,
    pe: 45.2,
    pbv: 5.2,
    dividendYield: 1.2,
    marketCap: '903B',
    volume: '22M',
    rsi: 65,
    description: 'ผู้บริหารท่าอากาศยานหลักของประเทศไทย รวมถึงสุวรรณภูมิและดอนเมือง',
    latestNews: 'จำนวนนักท่องเที่ยวจีนฟื้นตัวเร็วกว่าคาด หนุนรายได้ค่าธรรมเนียมสนามบิน'
  },
  {
    symbol: 'KBANK',
    name: 'Kasikornbank',
    sector: 'Banking',
    price: 124.00,
    change: 0.00,
    changePercent: 0.00,
    pe: 7.8,
    pbv: 0.65,
    dividendYield: 4.5,
    marketCap: '294B',
    volume: '12M',
    rsi: 55,
    description: 'ธนาคารพาณิชย์ชั้นนำ เน้นบริการดิจิทัลแบงก์กิ้งและสินเชื่อ SME',
    latestNews: 'ประกาศแผนยุทธศาสตร์ Net Zero และการปล่อยสินเชื่อสีเขียวเพิ่มขึ้น'
  },
  {
    symbol: 'DELTA',
    name: 'Delta Electronics (Thailand)',
    sector: 'Electronics',
    price: 78.50,
    change: -2.50,
    changePercent: -3.09,
    pe: 65.4,
    pbv: 12.5,
    dividendYield: 0.5,
    marketCap: '980B',
    volume: '8M',
    rsi: 78,
    description: 'ผู้ผลิตชิ้นส่วนอิเล็กทรอนิกส์และ Power Supply ชั้นนำระดับโลก สำหรับ EV และ Data Center',
    latestNews: 'ความต้องการชิ้นส่วนสำหรับ Data Center AI พุ่งสูง แต่ราคาหุ้นเริ่มตึงตัว'
  },
  {
    symbol: 'CPALL',
    name: 'CP ALL Public Company',
    sector: 'Commerce',
    price: 56.75,
    change: 0.50,
    changePercent: 0.89,
    pe: 28.5,
    pbv: 4.1,
    dividendYield: 2.1,
    marketCap: '510B',
    volume: '30M',
    rsi: 48,
    description: 'ผู้บริหารร้านสะดวกซื้อ 7-Eleven ในประเทศไทย และธุรกิจค้าส่ง',
    latestNews: 'ยอดขายสาขาเดิม (SSSG) เติบโตต่อเนื่องจากการท่องเที่ยวและการบริโภคในประเทศ'
  },
  {
    symbol: 'ADVANC',
    name: 'Advanced Info Service',
    sector: 'ICT',
    price: 205.00,
    change: 3.00,
    changePercent: 1.49,
    pe: 22.1,
    pbv: 7.5,
    dividendYield: 3.8,
    marketCap: '610B',
    volume: '5M',
    rsi: 62,
    description: 'ผู้นำเครือข่ายโทรศัพท์เคลื่อนที่และบริการดิจิทัลในไทย',
    latestNews: 'การควบรวมกิจการคู่แข่งช่วยลดการแข่งขันด้านราคา หนุนกำไรระยะยาว'
  }
];

export const getStocks = (): Promise<StockData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_STOCKS), 500); // Simulate API latency
  });
};

export const getStockHistory = (symbol: string): Promise<StockHistoryPoint[]> => {
  return new Promise((resolve) => {
    // Generate semi-realistic random walk data based on current price
    const stock = MOCK_STOCKS.find(s => s.symbol === symbol);
    const currentPrice = stock ? stock.price : 100;
    const history: StockHistoryPoint[] = [];
    let price = currentPrice * 0.85; // Start slightly lower

    const days = 90;
    const now = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Random walk
      const change = (Math.random() - 0.48) * (currentPrice * 0.05);
      price += change;
      
      // Keep visible close to current price at the end
      if (i < 5) {
          price = price * 0.9 + currentPrice * 0.1;
      }

      history.push({
        date: date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }),
        price: parseFloat(price.toFixed(2))
      });
    }
    
    setTimeout(() => resolve(history), 300);
  });
};
