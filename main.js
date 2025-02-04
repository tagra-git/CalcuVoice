// HTML要素を取得
const resultElement = document.getElementById("result");  // 計算結果を表示する
const langButton = document.getElementById("lang-toggle");  // 言語切り替えボタン
const titleMainElement = document.getElementById("title-main");  // メインタイトル
const titleSubElement = document.getElementById("title-sub");  // サブタイトル

// 変数を定義
let concatText = "";  // 計算結果を保存
let nowLanguage = "ja";  // 現在の言語設定(初期値はja)

// 数学記号の読み上げ
const operatorSpeech = {
    "+": { ja: "足す", en: "plus" },
    "-": { ja: "引く", en: "minus" },
    "×": { ja: "掛ける", en: "times" },
    "÷": { ja: "割る", en: "divided by" }
};

// テキストを読み上げる関数
function speak(text) {
    if (text !== "lang-change" && text !== "") {
        let synth = window.speechSynthesis;
        let utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = nowLanguage === "ja" ? "ja-JP" : "en-US";
        synth.speak(utterance);
    }
}

// 言語を切り替える関数
function buttonLanguage() {
    nowLanguage = nowLanguage === "ja" ? "en" : "ja";
    langButton.textContent = nowLanguage === "ja" ? "Switch to English" : "日本語に変更";
    titleMainElement.textContent = nowLanguage === "ja" ? "日本語の電卓" : "English Calculator";
    titleSubElement.textContent = nowLanguage === "ja" ? "Japanese Calculator" : "英語の電卓";
}

// 計算結果を画面に表示する関数
function updateDisplay() {
    resultElement.textContent = concatText || "0";
}

// ボタンが押されたときの処理
function buttonClick(event) {
    const text = event.target.textContent;
    if (event.target === langButton) return;  // 言語切り替えボタンが押された場合は何もしない

    // 演算子を変換して読み上げる
    if (operatorSpeech[text]) {
        speak(operatorSpeech[text][nowLanguage]);
    } else if (text === "AC") {
        speak(nowLanguage === "ja" ? "クリア" : "Clear");
    } else if (text !== "CE") {
        speak(text);
    }

    if (text === "=") {
        try {
            if (concatText !== "") {
                concatText = String(new Function("return " + concatText.replace(/×/, "*").replace(/÷/, "/"))());
            } else {
                concatText = "0";
            }
        } catch {
            concatText = "Error";
        }
        speak(nowLanguage === "ja" ? `答えは ${concatText}` : `The answer is ${concatText}`);
    } else if (text === "AC") {
        concatText = "";
    } else if (text === "CE") {
        concatText = concatText.slice(0, -1);
    } else {
        concatText += text;
    }
    updateDisplay();
}

// 言語切り替えボタンのイベントリスナーを設定
langButton.addEventListener("click", buttonLanguage);

// 全てのボタンにイベントを追加
const buttons = document.getElementsByTagName("button");
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", buttonClick);
}

// 初期表示を更新
updateDisplay();
