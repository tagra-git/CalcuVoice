document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll("button");
    const result = document.querySelector("#result");
    const langToggle = document.getElementById("lang-toggle");
    const titleMain = document.getElementById("title-main");
    const titleSub = document.getElementById("title-sub");

    let concatText = "";
    let lastInput = "";
    let currentLang = "ja"; // デフォルトは日本語

    // 音声読み上げ
    const speak = (text) => {
        if (text === "lang-change") return; // 言語切り替え時は無視
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLang === "ja" ? "ja-JP" : "en-US";
        synth.speak(utterance);
    };

    // 言語切り替え
    const toggleLanguage = () => {
        currentLang = currentLang === "ja" ? "en" : "ja";
        langToggle.textContent = currentLang === "ja" ? "Switch to English" : "日本語に変更";
        titleMain.textContent = currentLang === "ja" ? "日本語の電卓" : "English Calculator";
        titleSub.textContent = currentLang === "ja" ? "Japanese Calculator" : "英語の電卓";
    };

    // 表示の更新
    const updateDisplay = () => {
        result.textContent = concatText || "0";
        result.scrollLeft = result.scrollWidth; // 常に最新の入力が見えるようにスクロール
    };

    // 計算処理
    const calculateExpression = (expression) => {
        try {
            return new Function("return " + expression)();
        } catch {
            return "Error";
        }
    };

    // ボタンが押されたときの処理
    const buttonPressed = (event) => {
        const text = event.target.textContent;
        if (event.target === langToggle) return; // 言語切り替え時は処理しない
        speak(text);

        const operators = ["+", "-", "×", "÷", "%"];
        const replaceMap = { "×": "*", "÷": "/" };
        const currentInput = replaceMap[text] || text;

        if (text === "=") {
            if (operators.includes(lastInput)) return;
            concatText = String(calculateExpression(concatText));
            speak(currentLang === "ja" ? `答えは ${concatText}` : `The answer is ${concatText}`);
        } else if (text === "AC") {
            concatText = "";
        } else if (text === "CE") {
            concatText = concatText.slice(0, -1);
        } else {
            if (concatText === "0" && ![".", "+", "-", "*", "/", "%"].includes(currentInput)) {
                concatText = currentInput;
            } else if (operators.includes(lastInput) && operators.includes(currentInput)) {
                if (["+", "-"].includes(currentInput)) {
                    concatText += currentInput;
                } else {
                    concatText = concatText.slice(0, -1) + currentInput;
                }
            } else {
                concatText += currentInput;
            }
        }

        lastInput = text;
        updateDisplay();
    };

    // イベントリスナーの設定
    buttons.forEach(button => button.addEventListener("click", buttonPressed));
    langToggle.addEventListener("click", toggleLanguage);

    updateDisplay();
});
