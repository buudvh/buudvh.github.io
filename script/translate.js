const CONST_TYPE = {
  TRANSLATE: '0',
  WORD: '1',
  CHAT: '2'
};
let APIKEY = null;
let textTranslate = null;

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM is ready!");
  APIKEY = getUrlParam("key");
  textTranslate = getUrlParam("text");
  document.getElementById("inputKey").value = APIKEY;
  document.getElementById('inputText').value = textTranslate;

  if (!APIKEY || !textTranslate) return;

  translateWithGemini(textTranslate, APIKEY, document.getElementById('outputText'), CONST_TYPE.WORD);
});


const getUrlParam = (name) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

const createPrompt = (text, promptType) => {
  switch (promptType) {
    case CONST_TYPE.TRANSLATE:
      return `Cho bạn đoạn văn bản: "${text}".
               Hãy dịch đoạn văn bản đó thành Tiếng Việt (Vietnamese) với các điều kiện sau:
               - Tuân thủ chặt chẽ bối cảnh và sắc thái ban đầu.
               - Sự lưu loát tự nhiên như người bản xứ.
               - Không có thêm giải thích/diễn giải.
               - Bảo toàn thuật ngữ 1:1 cho các thuật ngữ/danh từ riêng.
               Chỉ in ra bản dịch mà không có dấu ngoặc kép.`;
    case CONST_TYPE.WORD:
      return ` Bạn là một chuyên gia ngôn ngữ chuyên về tiếng Trung, tiếng Việt, tiếng Nhật và tiếng Anh. 
          Nhiệm vụ của bạn là phân tích cụm từ tiếng Trung được cung cấp và đưa ra một giải thích toàn diện bằng tiếng Việt,
          tập trung vào sắc thái và bối cảnh văn hóa của nó.

          Phân tích cụm từ tiếng Trung sau: "${text}"

          Phân tích của bạn *phải* bao gồm những điều sau, được định dạng chính xác như sau:

          1.  **Ý nghĩa và cách sử dụng trong tiếng Việt:**
              *   Cung cấp một giải thích *ngắn gọn và thành ngữ* về ý nghĩa của cụm từ trong tiếng Việt. Cân nhắc các biến thể vùng miền nếu có.
              *   Mô tả *các ngữ cảnh thực tế, điển hình* mà cụm từ được sử dụng trong giao tiếp hoặc văn bản tiếng Việt.

          2.  **Ví dụ (nếu có):**
              *   Cung cấp *một* câu ví dụ *liên quan* bằng tiếng Trung có chứa cụm từ đó.
              *   Cung cấp một bản dịch tiếng Việt *tự nhiên và chính xác* của câu ví dụ đó.

          3.  **Danh từ riêng (nếu có):**
              *   Nếu cụm từ đại diện cho một danh từ riêng nước ngoài được phiên âm (ví dụ: tiếng Nhật hoặc tiếng Anh), hãy xác định cẩn thận (các) thuật ngữ gốc.
              * Hoặc giả định nếu nó là phiên âm tên riêng nước ngoài (tiếng Nhật, tiếng Anh) hãy cho tôi cách đọc của nó được viết bằng Romanji
              *   Đối với mỗi danh từ riêng đã xác định:
                  *   Liệt kê các thuật ngữ gốc tiếng Nhật và dạng Romanji *Hepburn tiêu chuẩn* của nó.
                  *   Liệt kê các thuật ngữ gốc tiếng Anh.
              * Chỉ liệt kê tên mà không cần giải thích gì thêm

          Định dạng câu trả lời của bạn một cách rõ ràng và ngắn gọn bằng tiếng Việt, *sử dụng mẫu được chỉ định bên dưới*. Tuân thủ nghiêm ngặt định dạng này:

          Ý nghĩa:
          [Diễn giải ngắn gọn, tự nhiên về ý nghĩa của cụm từ]
          Ngữ cảnh:
          [Mô tả ngữ cảnh thực tế mà cụm từ thường được sử dụng]

          Ví dụ (nếu có):
          - "[Câu tiếng Trung chứa cụm từ]"
          - "[Bản dịch tiếng Việt tự nhiên và chính xác]"

          Danh sách các danh từ riêng (nếu có):
          * Danh từ riêng: [Cụm từ tiếng Trung]
              - [Tên tiếng Nhật 1 viết bằng Romanji theo hệ Hepburn]
              - [Tên tiếng Nhật 2 viết bằng Romanji theo hệ Hepburn]
              ...........
              - [Tên tiếng Anh]
              - [Tên tiếng Anh - không có thì không hiển thị dòng này]
              ...........
            `;
    default:
      return `
        ${text}
        Trả lời tôi bằng Tiếng Việt
      `;
  }

}

const translateWithGemini = async (text, apiKey, outputTextElement, promptType) => {
  let url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`;

  let requestBody = {
    contents: [{ parts: [{ text: createPrompt(text, promptType) }] }]
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

const translateText = async (promptType) => {
  const inputTextElement = document.getElementById('inputText');
  const outputTextElement = document.getElementById('outputText');

  const key = document.getElementById("inputKey").value;
  if (key.trim() === '') {
    outputTextElement.innerHTML = 'Vui lòng nhập key Gemini.';
    return;
  }

  const inputText = inputTextElement.value;
  if (inputText.trim() === '') {
    outputTextElement.innerHTML = 'Vui lòng nhập tiếng Trung.';
    return;
  }

  translateWithGemini(inputText, key, outputTextElement, promptType);
}

const copyText = () => {
  const outputTextElement = document.getElementById('outputText');
  const range = document.createRange();
  range.selectNode(outputTextElement);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand('copy');
  window.getSelection().removeAllRanges();

  showCopyMessage();  // Hiển thị thông báo khi đã sao chép
}

const showCopyMessage = () => {
  const copyMessageElement = document.getElementById('copyMessage');
  copyMessageElement.textContent = 'Đã sao chép!';
}

const clearCopyMessage = () => {
  const copyMessageElement = document.getElementById('copyMessage');
  copyMessageElement.textContent = '';
}

const toExt = () => {
  if (location.href.endsWith(".html")) {
    location.href = "/ext.html"
  } else {
    location.href = location.href + "ext.html"
  }
}