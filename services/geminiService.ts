import { GoogleGenAI } from "@google/genai";
import { WishRequest } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateChristmasWish = async (request: WishRequest): Promise<string> => {
  if (!apiKey) {
    return "Chúc mừng giáng sinh! (Vui lòng cấu hình API Key để nhận lời chúc hay hơn)";
  }

  try {
    const prompt = `
      Viết một lời chúc Giáng sinh ngắn gọn (khoảng 2-3 câu), cực kỳ lãng mạn, ấm áp và chân thành bằng tiếng Việt.
      Người nhận: ${request.name}
      Mối quan hệ: ${request.relationship} (ví dụ: người yêu, vợ/chồng, crush, bạn thân).
      Chỉ trả về nội dung lời chúc, không thêm dấu ngoặc kép hay tiêu đề.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating wish:", error);
    return `Giáng sinh an lành nhé ${request.name}! Chúc bạn luôn hạnh phúc và ấm áp.`;
  }
};