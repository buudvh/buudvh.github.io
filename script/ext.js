const listExt = [
    "https://raw.githubusercontent.com/buudvh/leech_story_ext/main/plugin.json",
    "https://raw.githubusercontent.com/lovebook98/leech_story_ext/main/plugin.json",
    "https://raw.githubusercontent.com/Darkrai9x/vbook-extensions/master/plugin.json",
    "https://raw.githubusercontent.com/Darkrai9x/vbook-extensions/refs/heads/master/translate.json",
    "https://raw.githubusercontent.com/Darkrai9x/vbook-extensions/refs/heads/master/tts.json",
    "https://raw.githubusercontent.com/Darkrai9x/vbook-extensions/master/chinese_plugin.json",
    "https://raw.githubusercontent.com/nhocconsr/vbook-ext/master/plugin.json",
    "https://raw.githubusercontent.com/hajljnopera/vbook-ext/main/plugin.json",
    "https://raw.githubusercontent.com/hishirooo/vbook-ext/master/plugin.json",
    "https://raw.githubusercontent.com/Moleys/vbook-ext/main/plugin.json",
    "https://raw.githubusercontent.com/dat-bi/ext-vbook/main/plugin.json",
    "https://raw.githubusercontent.com/duongden/vbook/main/plugin.json",
    "https://raw.githubusercontent.com/SoulGodEve9x9/Vbook-ext/Nahona/plugin.json"
];

const listTrans = [
    {
        "name": "volcengine",
        "url": "https://translate.volcengine.com/?category=&home_language=zh&source_language=detect&target_language=vi&text=%s"
    },
    {
        "name": "G.Translate",
        "url": "https://translate.google.com/?sl=zh-CN&tl=vi&text=%s&translate"
    },
    {
        "name": "Mazii",
        "url": "https://mazii.net/vi-VN/search/word/javi/%s"
    },
]

const onStartUp = () => {
    showData();
    addEvent();
}

const showTrans = () =>{
    let strHtml = "";
    listTrans.forEach((trans, index) => {
        strHtml += `<div class="trans-item" data-trans="${trans.url}"><span></span> ${trans.name}</div>`
    })

    document.getElementById("id-list-ext").innerHTML = strHtml;
}

const showExt = () =>{
    let strHtml = "";
    let showExtensionInfor = "";
    let tempArr = [];
    listExt.forEach((ext, index) => {
        tempArr = ext.split("/");
        showExtensionInfor = `Creater: ${tempArr[3]}  &emsp; Plugin: ${tempArr.pop()}`;
        strHtml += `<div class="ext-item" data-ext="${ext}"><span></span> ${showExtensionInfor}</div>`
    })

    document.getElementById("id-list-translate").innerHTML = strHtml;
}

const showData = () =>{
    showExt();
    showTrans();
}

const addEvent = () => {
    addEventExt();
    addEventTrans();
}

const addEventExt = () => {
    document.querySelectorAll(".ext-item").forEach(item => {
        item.addEventListener("click", async () => {
            const url = item.getAttribute("data-ext");
            try {
                document.querySelectorAll(".ext-item").forEach(item => {
                    item.style.background = "";
                    item.querySelector("span").textContent = "";
                });
                await navigator.clipboard.writeText(url);
                item.style.background = "#d4edda"; // highlight nhẹ khi copy thành công
                item.querySelector("span").textContent = "✔Copied";
            } catch (err) {
                alert("Copy thất bại:", err);
            }
        });
    });
}

const addEventTrans = () => {
    document.querySelectorAll(".ext-item").forEach(item => {
        item.addEventListener("click", async () => {
            const url = item.getAttribute("data-ext");
            try {
                document.querySelectorAll(".ext-item").forEach(item => {
                    item.style.background = "";
                    item.querySelector("span").textContent = "";
                });
                await navigator.clipboard.writeText(url);
                item.style.background = "#d4edda"; // highlight nhẹ khi copy thành công
                item.querySelector("span").textContent = "✔Copied";
            } catch (err) {
                alert("Copy thất bại:", err);
            }
        });
    });
}