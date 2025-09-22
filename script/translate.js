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

  if (document.getElementById('select-ai-type').value == "0") {
    translateWithGemini(textTranslate, APIKEY, document.getElementById('outputText'), CONST_TYPE.WORD);
  } else {
    translateWithGroq(textTranslate, APIKEY, document.getElementById('outputText'), CONST_TYPE.WORD);
  }
});


const getUrlParam = (name) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

const createPrompt = (text, promptType) => {
  switch (promptType) {
    case CONST_TYPE.TRANSLATE:
      return `You are a professional translator specialized in Xianxia and Eastern fantasy literature.  
Translate the following Chinese text into Vietnamese with the following style:

- Mysterious, mystical, full of imagination;  
- With an ancient, poetic tone, infused with spiritual energy, cultivation, and Daoist flavor;  
- Keep all proper names unchanged; if necessary, transliterate them into Sino-Vietnamese;  
- Stay faithful to the original meaning without adding commentary or omitting details;  
- The output must read smoothly and elegantly in Vietnamese, as if it were originally written in this style;  
- The output should contain only the translated text, with no extra notes, titles, or explanations.  

${text}:
“{Chinese text to translate}”
`;
    case CONST_TYPE.WORD:
      return `You are a linguistic expert in Chinese with deep knowledge of Sino-Vietnamese, Japanese, and English transliterations.  
Analyze the given Chinese word or phrase with the following requirements:

- Explain its meaning in Vietnamese, including literal meaning and possible contextual meanings.  
- Provide at least one example sentence in Chinese and translate it into Vietnamese.  
- If the word/phrase is possibly a transliteration of a name (Japanese, English, or other), list all likely corresponding names.  
- The output must only contain the analysis, without extra notes or titles.

${text}:
“{Chinese word or phrase}”
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

const translateWithGroq = async (text, apiKey, outputTextElement, promptType) => {
  let url = `https://api.groq.com/openai/v1/chat/completions`;

  let requestBody = {
    "model": "meta-llama/llama-4-maverick-17b-128e-instruct",
    "messages": [
      {
        "role": "user",
        "content": createPrompt(text, promptType),
      }
    ]
  };

  let headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`,
  }

  // 🟢 Hiển thị popup "Đang dịch..."
  outputTextElement.innerText = "Đang dịch...";

  try {
    let response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      outputTextElement.innerText = `Lỗi HTTP: ${response.status}`;
    }

    let result = await response.json();
    console.log("Kết quả API:", result);

    if (result && result.choices && result.choices.length > 0) {
      let translatedText = "";
      result.choices.forEach(element => {
        translatedText += element.message.content;
      });
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
  if (document.getElementById('select-ai-type').value == "0") {
    translateWithGroq(inputText, key, outputTextElement, promptType);
  } else {
    translateWithGroq(inputText, key, outputTextElement, promptType);
  }
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