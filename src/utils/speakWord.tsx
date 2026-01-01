export function speakWord(word: string, lang: "en" | "uz") {
    if (!("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = lang === "en" ? "en-US" : "uz-UZ";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}
