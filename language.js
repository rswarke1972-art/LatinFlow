// ===== INIT =====
document.addEventListener("DOMContentLoaded", init);

function init() {
  renderLanguageGrid();
}

// ===== RENDER GRID =====
function renderLanguageGrid() {
  const grid = document.getElementById("langGrid");
  if (!grid) return;

  grid.innerHTML = "";

  // Sort languages alphabetically for better user experience
  const sortedLangs = [...supportedLanguages].sort();

  sortedLangs.forEach(lang => {
    const btn = document.createElement("button");
    
    // Capitalize name
    const displayName = lang.charAt(0).toUpperCase() + lang.slice(1);
    
    // Get emoji flag
    const flag = emojiFlags[lang] || "🌐";
    
    btn.innerText = `${flag} ${displayName}`;
    
    // Highlight active
    if (lang === currentLanguage) {
      btn.classList.add("active-lang");
      btn.innerText += " ✅";
    }
    
    btn.onclick = () => selectLang(lang);
    
    grid.appendChild(btn);
  });
}

// ===== SELECT LANGUAGE =====
function selectLang(lang) {
  // If already selected → no reload, just go back to home screen
  if (lang === currentLanguage) {
    window.location.href = "index.html";
    return;
  }

  // Use config system
  setLanguage(lang);
}