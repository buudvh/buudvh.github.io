const createPrompt = (text) => {
  return `Cho bạn đoạn văn bản: "${text}".
               Hãy dịch đoạn văn bản đó thành Tiếng Việt (Vietnamese) với các điều kiện sau:
               - Tuân thủ chặt chẽ bối cảnh và sắc thái ban đầu.
               - Sự lưu loát tự nhiên như người bản xứ.
               - Không có thêm giải thích/diễn giải.
               - Bảo toàn thuật ngữ 1:1 cho các thuật ngữ/danh từ riêng.
               Chỉ in ra bản dịch mà không có dấu ngoặc kép.`;
}

const translateWithGemini = async (text, apiKey, outputTextElement) => {
  let url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`;

  let requestBody = {
    contents: [{ parts: [{ text: createPrompt(text) }] }]
  };

  // 🟢 Hiển thị popup "Đang dịch..."
  outputTextElement.innerText = "Đang dịch...";

  try {
    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      outputTextElement.innerText = `Lỗi HTTP: ${response.status}`;
    }

    let result = await response.json();
    console.log("Kết quả API:", result);

    if (result && result.candidates && result.candidates.length > 0) {
      let translatedText = result.candidates[0].content.parts[0].text;
      outputTextElement.innerText = translatedText; // 🟢 Cập nhật popup với bản dịch
    } else {
      outputTextElement.innerText = "Lỗi: API không trả về kết quả hợp lệ.";
    }
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    outputTextElement.innerText = "Lỗi khi gọi API: " + error.message;
  }
};