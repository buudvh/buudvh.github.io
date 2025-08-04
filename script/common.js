let APIKEY = null;
let textTranslate = null;

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM is ready!");
    APIKEY = getUrlParam("key");
    textTranslate = getUrlParam("text");
    document.getElementById("inputKey").value = APIKEY;
    document.getElementById('inputText').value = textTranslate;
    translateWithGemini(textTranslate, APIKEY, document.getElementById('outputText'))
});


const getUrlParam = (name) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}