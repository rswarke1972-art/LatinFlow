// ===== INIT =====
document.addEventListener("DOMContentLoaded", init);

function init() {
  highlightCurrentLanguage();
}


// ===== SELECT LANGUAGE =====
function selectLang(lang) {

  // ✅ If already selected → no reload
  if (lang === currentLanguage) {
    window.location.href = "index.html";
    return;
  }

  // ✅ Use config system (important)
  setLanguage(lang);
}


// ===== HIGHLIGHT CURRENT LANGUAGE =====
function highlightCurrentLanguage() {

  const buttons = document.querySelectorAll(".lang-grid button");

  buttons.forEach(btn => {
    const lang = getLangFromButton(btn);

    if (lang === currentLanguage) {
      btn.classList.add("active-lang");
      btn.innerText += " ✅";
    }
  });
}


// ===== HELPER: Extract language =====
function getLangFromButton(button) {

  const text = button.innerText.toLowerCase();

  if (text.includes("spanish")) return "spanish";
  if (text.includes("french")) return "french";
  if (text.includes("german")) return "german";
  if (text.includes("italian")) return "italian";
  if (text.includes("indonesian")) return "indonesian";
  if (text.includes("portuguese")) return "portuguese";

  return "";
}