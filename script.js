// ===== GLOBAL =====
let data = {};
let wordObj = JSON.parse(localStorage.getItem("word"));
let currentLang = "";

const flags = {
  portuguese: "images/flags/portugal.jpg",
  italian: "images/flags/italy.jpg",
  german: "images/flags/germany.jpg",
  french: "images/flags/france.jpg",
  spanish: "images/flags/spain.jpg",
  indonesian: "images/flags/indonesia.jpg"
};

function setLanguageBackground(lang) {
  const bg = document.querySelector(".flag-bg");
  if (!bg) return;

  // 🔥 normalize properly
  lang = (lang || "").toLowerCase().trim();

  console.log("LANG =", lang);

  if (!flags[lang]) {
    console.warn("No flag found for:", lang);

    // 🔥 fallback (important)
    bg.style.backgroundImage = "url('images/flags/spain.jpg')";
    return;
  }

  bg.style.backgroundImage = `url(${flags[lang]})`;
}


// ===== INIT =====
async function init() {
  try {
    data = await loadLanguageData();

    currentLang = (data.language || "spanish").toLowerCase();

    // ✅ FIXED LINE
    setLanguageBackground(currentLang);

    console.log("Data loaded:", data);
    console.log("Word:", wordObj);

    if (!wordObj) {
      document.getElementById("charDisplay").innerText = "No word selected ❌";
      return;
    }

    loadWord(wordObj);

  } catch (err) {
    console.error("Error loading:", err);
  }
}
init();


// ===== LOAD WORD =====
function loadWord(obj) {

  // MAIN WORD
  document.getElementById("charDisplay").innerText =
    obj.word || "-";

  // PRONUNCIATION
  document.getElementById("infoDisplay").innerText =
    obj.sound || "";

  // DETAILS
  let html = `
    <h3>Word Details</h3>

    <div class="form-box">
      <h4>Meaning</h4>
      <p class="big">${obj.meaning || "-"}</p>
    </div>
  `;

  // OPTIONAL EXAMPLE
  if (obj.example) {
    html += `
      <div class="form-box">
        <h4>Example</h4>
        <p class="big">${obj.example.word || "-"}</p>
        <p>
          <small>
            ${obj.example.meaning || ""}
          </small>
        </p>
      </div>
    `;
  }

  document.getElementById("details").innerHTML = html;

  renderDisplay(obj.word);
}


// ===== DISPLAY =====
function renderDisplay(text) {
  let box = document.getElementById("character");

  if (!box) return;

  box.innerHTML = `
    <div style="font-size:60px; text-align:center;">
      ${text}
    </div>
  `;
}


// ===== SOUND =====
function playSound() {

  if (!wordObj || !wordObj.word) return;

  const utterance = new SpeechSynthesisUtterance(
    wordObj.word
  );

  // 🔥 LANGUAGE BASED VOICE
  if (currentLang === "spanish") {
    utterance.lang = "es-ES";

  } else if (currentLang === "french") {
    utterance.lang = "fr-FR";

  } else if (currentLang === "german") {
    utterance.lang = "de-DE";

  } else if (currentLang === "italian") {
    utterance.lang = "it-IT";

  } else if (currentLang === "indonesian") {
    utterance.lang = "id-ID";

    } else if (currentLang === "portuguese") {
    utterance.lang = "pt-BR";

  } else {
    utterance.lang = "en-US";
  }

  speechSynthesis.speak(utterance);
}