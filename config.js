// ===== LANGUAGE SYSTEM =====

// ✅ Available languages
const supportedLanguages = ["spanish", "french", "german", "italian", "indonesian", "portuguese"];

// 🔥 DEFAULT LANGUAGE
let currentLanguage = localStorage.getItem("language") || "spanish";

// ✅ Validate language (important)
if (!supportedLanguages.includes(currentLanguage)) {
  currentLanguage = "spanish";
  localStorage.setItem("language", currentLanguage);
}

// ===== LOAD DATA =====
async function loadLanguageData() {
  try {
    const res = await fetch(`data/${currentLanguage}.json`)

    if (!res.ok) {
      throw new Error("Language file not found");
    }

    const data = await res.json();
    return data;

  } catch (err) {
    console.error("❌ Error loading language:", err);

    // 🔥 fallback to spanish (safe)
    if (currentLanguage !== "spanish") {
      localStorage.setItem("language", "spanish");
      location.reload();
    }

    return {};
  }
}

// ===== SET LANGUAGE =====
function setLanguage(lang) {

  // ✅ prevent invalid language
  if (!supportedLanguages.includes(lang)) {
    console.warn("Invalid language selected:", lang);
    return;
  }

  localStorage.setItem("language", lang);

  // reset progress
  localStorage.setItem("sentenceIndex", 0);
  localStorage.setItem("quizScore", 0);

  location.reload();
}