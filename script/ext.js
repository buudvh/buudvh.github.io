const listExt = [
    "https://raw.githubusercontent.com/buudvh/leech_story_ext/main/plugin.json",
    "https://raw.githubusercontent.com/lovebook98/leech_story_ext/main/plugin.json",
    "https://raw.githubusercontent.com/Darkrai9x/vbook-extensions/refs/heads/master/repository.json",
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

const onStartUp = () => {
    let strHtml = "";
    listExt.forEach((ext, index) => {
        strHtml += `<div class="ext-item">${ext}</div>`
    })

    document.getElementById("id-list-ext").innerHTML = strHtml;

    document.getElementById("id-list-ext").innerHTML = strHtml;

    document.querySelectorAll(".ext-item").forEach(item => {
        item.addEventListener("click", async () => {
            const url = item.textContent.trim();
            try {
                document.querySelectorAll(".ext-item").forEach(item => {
                    item.style.background = "";
                });
                await navigator.clipboard.writeText(url);
                item.style.background = "#d4edda"; // highlight nhẹ khi copy thành công
            } catch (err) {
                console.error("Copy thất bại:", err);
            }
        });
    });
}