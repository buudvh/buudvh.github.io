const CONST_TYPE = {
  TRANSLATE: '0',
  WORD: '1',
  CHAT: '2'
};
let APIKEY = null;
let textTranslate = null;
let AIType = null;

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM is ready!");
  APIKEY = getUrlParam("key");
  textTranslate = getUrlParam("text");
  AIType = getUrlParam("aitype") ?? "0";
  document.getElementById("inputKey").value = APIKEY;
  document.getElementById('inputText').value = textTranslate;
  document.getElementById('select-ai-type').value = AIType;

  if (!APIKEY || !textTranslate) return;

  translateText(CONST_TYPE.WORD);
});

const getUrlParam = (name) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

const createPrompt = (text, promptType) => {
  switch (promptType) {
    case CONST_TYPE.TRANSLATE:
      return `You are a professional translator specialized in translating Chinese into Vietnamese.  
        Your task is to translate the given Chinese text according to the following rules:

        Instructions:
        - Strictly preserve the original context and nuance.  
        - Ensure the Vietnamese translation is fluent and natural, as if written by a native speaker.  
        - Do not add explanations, notes, or commentary.  
        - Maintain a 1:1 preservation of terminology and proper nouns (keep original or transliterate consistently).  

        Context:
        This translation is for literary text, possibly Xianxia/Fantasy style, so the output should retain the atmosphere, tone, and stylistic elements of the source.  

        Input (Chinese):
        ${text}

        Expected Output (Vietnamese):
        Only the translated Vietnamese text that follows the above requirements.
        `;
    case CONST_TYPE.WORD:
      return `You are a linguistic expert in Chinese with deep knowledge of Sino-Vietnamese, Japanese, and English transliterations.  
        Analyze the given Chinese word or phrase with the following requirements:

        - Explain its meaning in Vietnamese, including literal meaning and possible contextual meanings.  
        - Provide at least one example sentence in Chinese and translate it into Vietnamese.  
        - If the word/phrase is possibly a transliteration of a proper name (Japanese, English, or other), list all likely corresponding names.  
        - The output must be written entirely in Vietnamese, without any English.  
        - Do not include titles, labels, or extra notes — only the analysis.  

        Chinese input:
        "${text}"
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

  // Hiển thị loading
  outputTextElement.innerHTML = '<div class="loading">Đang dịch...</div>';

  try {
    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      outputTextElement.innerText = `Lỗi HTTP: ${response.status}`;
      return;
    }

    let result = await response.json();
    console.log("Kết quả API:", result);

    if (result && result.candidates && result.candidates.length > 0) {
      let translatedText = result.candidates[0].content.parts[0].text;
      outputTextElement.innerText = translatedText;
    } else {
      outputTextElement.innerText = "Lỗi: API không trả về kết quả hợp lệ.";
    }
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    outputTextElement.innerText = "Lỗi khi gọi API: " + error.message;
  }
};

const translateWithGroq = async (text, apiKey, outputTextElement, promptType) => {
  let url = `https://api.groq.com/openai/v1/chat/completions`;

  let requestBody = {
    "model": "groq/compound",
    "messages": [
      {
        "role": "user",
        "content": createPrompt(text, promptType),
      }
    ],
    "temperature": 1,
    "max_completion_tokens": 1024,
    "top_p": 1,
    "stream": true,
    "stop": null
  };

  let headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`,
  }

  // Hiển thị loading
  outputTextElement.innerHTML = '<div class="loading">Đang dịch...</div>';

  try {
    let response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      outputTextElement.innerText = `Lỗi HTTP: ${response.status}`;
      return;
    }

    let result = await response.json();
    console.log("Kết quả API:", result);

    if (result && result.choices && result.choices.length > 0) {
      let translatedText = "";
      result.choices.forEach(element => {
        translatedText += element.message.content;
      });
      outputTextElement.innerText = translatedText;
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
    outputTextElement.innerHTML = 'Vui lòng nhập API key.';
    return;
  }

  const inputText = inputTextElement.value;
  if (inputText.trim() === '') {
    outputTextElement.innerHTML = 'Vui lòng nhập văn bản cần dịch.';
    return;
  }

  if (document.getElementById('select-ai-type').value == "0") {
    await translateWithGemini(inputText, key, outputTextElement, promptType);
  } else {
    await translateWithGroq(inputText, key, outputTextElement, promptType);
  }

  gotoOutput();
}

const gotoOutput = () => {
  document.getElementById("outputText").scrollIntoView({
    behavior: "smooth", // cuộn mượt
    block: "center"     // căn giữa màn hình (có thể là 'start' | 'end' | 'nearest')
  });
}

const copyText = () => {
  const outputTextElement = document.getElementById('outputText');
  const text = outputTextElement.innerText;

  if (text.trim() === '' || text.includes('Vui lòng nhập') || text.includes('Lỗi')) {
    showCopyMessage('Không có nội dung để copy!', 'error');
    return;
  }

  navigator.clipboard.writeText(text).then(() => {
    showCopyMessage('Đã copy thành công!', 'success');
  }).catch(() => {
    // Fallback method
    const range = document.createRange();
    range.selectNode(outputTextElement);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    showCopyMessage('Đã copy thành công!', 'success');
  });
}

const showCopyMessage = (message, type = 'success') => {
  const copyMessageElement = document.getElementById('copyMessage');
  copyMessageElement.textContent = message;
  copyMessageElement.style.color = type === 'success' ? '#28a745' : '#dc3545';

  setTimeout(() => {
    copyMessageElement.textContent = '';
  }, 3000);
}

const clearCopyMessage = () => {
  const copyMessageElement = document.getElementById('copyMessage');
  copyMessageElement.textContent = '';
}