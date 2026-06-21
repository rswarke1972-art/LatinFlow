// ===== LANGUAGE SYSTEM =====

// ✅ Available languages
const supportedLanguages = ["spanish", "french", "german", "italian", "indonesian", "portuguese", "turkish", "azerbaijani", "malay", "vietnamese", "polish", "romanian", "swahili", "uzbek", "tagalog", "albanian", "kosovo", "bosnian", "catalan", "croatian", "czech", "danish", "esperanto", "estonian", "hawaiian", "icelandic", "hungarian", "maori", "norwegian", "swedish", "finnish", "samoan", "slovak", "slovenian", "zulu"];

const emojiFlags = {
  spanish: "🇪🇸", french: "🇫🇷", german: "🇩🇪", italian: "🇮🇹", indonesian: "🇮🇩",
  portuguese: "🇵🇹", turkish: "🇹🇷", azerbaijani: "🇦🇿", malay: "🇲🇾", vietnamese: "🇻🇳",
  polish: "🇵🇱", romanian: "🇷🇴", swahili: "🇰🇪", uzbek: "🇺🇿", tagalog: "🇵🇭",
  albanian: "🇦🇱", kosovo: "🇽🇰", bosnian: "🇧🇦", catalan: "🇦🇩", croatian: "🇭🇷",
  czech: "🇨🇿", danish: "🇩🇰", esperanto: "🟢", estonian: "🇪🇪", hawaiian: "🌺",
  icelandic: "🇮🇸", hungarian: "🇭🇺", maori: "🇳🇿", norwegian: "🇳🇴", swedish: "🇸🇪",
  finnish: "🇫🇮", samoan: "🇼🇸", slovak: "🇸🇰", slovenian: "🇸🇮", zulu: "🇿🇦"
};

function getTtsLocale(lang) {
  const locales = {
    spanish: "es-ES", french: "fr-FR", german: "de-DE", italian: "it-IT", indonesian: "id-ID",
    portuguese: "pt-BR", turkish: "tr-TR", azerbaijani: "az-AZ", malay: "ms-MY", vietnamese: "vi-VN",
    polish: "pl-PL", romanian: "ro-RO", swahili: "sw-KE", uzbek: "uz-UZ", tagalog: "fil-PH",
    albanian: "sq-AL", kosovo: "sq-AL", bosnian: "bs-BA", catalan: "ca-ES", croatian: "hr-HR",
    czech: "cs-CZ", danish: "da-DK", esperanto: "eo", estonian: "et-EE", hawaiian: "haw-US",
    icelandic: "is-IS", hungarian: "hu-HU", maori: "mi-NZ", norwegian: "no-NO", swedish: "sv-SE",
    finnish: "fi-FI", samoan: "sm-WS", slovak: "sk-SK", slovenian: "sl-SI", zulu: "zu-ZA"
  };
  return locales[lang.toLowerCase()] || "en-US";
}

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

// ===== REGISTER SERVICE WORKER =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('[Service Worker] Registered successfully', reg.scope))
      .catch((err) => console.error('[Service Worker] Registration failed', err));
  });
}