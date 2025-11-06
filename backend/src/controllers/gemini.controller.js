'use strict';
const fetch = require("node-fetch");

// ==========================
// 💬 HÀM CHAT VỚI GEMINI (API v1beta)
// ==========================
const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '⚠️ Vui lòng nhập nội dung để chat.'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: '❌ Chưa cấu hình GEMINI_API_KEY trong file .env.'
      });
    }

    console.log('📨 USER:', message);

    // ✅ Dùng model mới nhất (2025)
    const model = "models/gemini-2.0-flash-exp";

    // ✅ Gọi API Gemini chính thức (v1beta)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Lỗi từ Gemini API:", data);
      return res.status(response.status).json({
        success: false,
        message: data.error?.message || "Lỗi không xác định từ Gemini"
      });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ Không có phản hồi từ Gemini.";

    console.log('✅ Gemini trả về:', text.slice(0, 150) + '...');

    res.status(200).json({
      success: true,
      reply: text
    });
  } catch (error) {
    console.error("🔥 Lỗi gọi Gemini API:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi nội bộ server khi gọi Gemini API."
    });
  }
};

// ==========================
// 🧩 HÀM KHÁC
// ==========================
const suggest = async (req, res) => {
  res.json({
    success: true,
    suggestion: "💡 Ví dụ: 'Hướng dẫn học Big Data cho người mới bắt đầu'"
  });
};

const getChatHistory = async (req, res) => {
  res.json({ success: true, history: [] });
};

const clearChatHistory = async (req, res) => {
  res.json({ success: true, message: "🧹 Lịch sử chat đã được xóa." });
};

// ==========================
// 📦 EXPORT
// ==========================
module.exports = {
  chatWithAI,
  suggest,
  getChatHistory,
  clearChatHistory
};
