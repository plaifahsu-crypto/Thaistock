import { GoogleGenAI, Type, Schema } from "@google/genai";
import { StockData, AIAnalysisResponse } from "../types";

// Initialize Gemini
// Note: In a real app, never expose API keys on the client side if possible.
// For this demo, we assume the key is in process.env.API_KEY
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const analyzeStockWithAI = async (stock: StockData): Promise<AIAnalysisResponse> => {
  if (!apiKey) {
    throw new Error("ไม่พบ API Key กรุณาตั้งค่า API_KEY ใน Environment Variable");
  }

  const model = "gemini-2.5-flash"; // Using Flash for speed and efficiency

  const prompt = `
    คุณคือผู้เชี่ยวชาญด้านการวิเคราะห์การลงทุนในตลาดหลักทรัพย์แห่งประเทศไทย (SET)
    โปรดวิเคราะห์หุ้น: ${stock.symbol} (${stock.name})
    
    ข้อมูลปัจจุบัน:
    - ราคา: ${stock.price} บาท
    - P/E Ratio: ${stock.pe}
    - P/BV: ${stock.pbv}
    - Dividend Yield: ${stock.dividendYield}%
    - RSI: ${stock.rsi} (Indicator ทางเทคนิค)
    - ข่าวล่าสุด: "${stock.latestNews}"
    - รายละเอียดธุรกิจ: "${stock.description}"

    วิเคราะห์ปัจจัยพื้นฐานและเทคนิค แล้วให้คำแนะนำ
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      recommendation: {
        type: Type.STRING,
        enum: ["BUY", "SELL", "HOLD"],
        description: "คำแนะนำการลงทุน"
      },
      confidenceScore: {
        type: Type.NUMBER,
        description: "ความมั่นใจในคำแนะนำ (0-100)"
      },
      reasoning: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "เหตุผลประกอบการวิเคราะห์ (สั้นๆ กระชับ 3-4 ข้อ)"
      },
      riskAssessment: {
        type: Type.STRING,
        description: "การประเมินความเสี่ยง"
      },
      targetPrice: {
        type: Type.NUMBER,
        description: "ราคาเป้าหมายที่เหมาะสม (ประเมินคร่าวๆ)"
      }
    },
    required: ["recommendation", "confidenceScore", "reasoning", "riskAssessment"]
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "ตอบกลับเป็นภาษาไทย ในฐานะนักวิเคราะห์การเงินมืออาชีพ ให้ข้อมูลที่ตรงไปตรงมาและระมัดระวังความเสี่ยง",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as AIAnalysisResponse;

  } catch (error) {
    console.error("AI Analysis Error:", error);
    // Fallback Mock Response if API fails (or no key)
    return {
      recommendation: 'HOLD',
      confidenceScore: 0,
      reasoning: ['ไม่สามารถเชื่อมต่อกับ AI ได้ในขณะนี้', 'กรุณาตรวจสอบ API Key', 'แสดงข้อมูลจำลองแทน'],
      riskAssessment: 'N/A',
      targetPrice: stock.price
    };
  }
};
