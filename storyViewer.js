// ===== GLOBAL =====
let data = {};
let storyKey = localStorage.getItem("currentStory");
let story = null;
let currentLang = "";


// ===== INIT =====
async function init() {
  try {
    data = await loadLanguageData();

    currentLang = (data.language || "").toLowerCase();

    document.getElementById("langTitle").innerText =
      data.language || currentLanguage;

    loadStory();

  } catch (err) {
    console.error("Error loading story:", err);
  }
}

init();


// ===== LOAD STORY =====
function loadStory() {

  const container = document.getElementById("storyContainer");

  story = data.stories?.[storyKey];

  if (!story || !story.content) {
    container.innerHTML = "<p>Story not found ❌</p>";
    return;
  }

  document.getElementById("storyTitle").innerText =
    story.title || "Story";

  container.innerHTML = "";

  story.content.forEach((wordObj) => {

    const span = document.createElement("span");
    span.className = "word";
    span.innerText = wordObj.word + " ";

    span.onclick = (e) => {
      e.stopPropagation();

      localStorage.setItem("learned_" + wordObj.word, "true");

      showPopup(span, wordObj);
      playSound(wordObj.word);

      span.classList.add("learned");

      updateProgress();
    };

    if (localStorage.getItem("learned_" + wordObj.word)) {
      span.classList.add("learned");
    }

    container.appendChild(span);

    // line break after punctuation
    if ([".", "?", "!"].includes(wordObj.word)) {
      container.appendChild(document.createElement("br"));
    }
  });

  updateProgress();
}


// ===== POPUP =====
function showPopup(element, wordObj) {

  const popup = document.getElementById("popup");

  popup.innerHTML = `
    <strong>${wordObj.word || ""}</strong><br>
    <span style="color:#38bdf8;">${wordObj.sound || ""}</span><br>
    ${wordObj.meaning || ""}
  `;

  popup.style.display = "block";

  const rect = element.getBoundingClientRect();

  popup.style.left = `${rect.left + rect.width / 2}px`;
  popup.style.top = `${rect.top - 10}px`;
  popup.style.transform = "translate(-50%, -100%)";
}


// ===== CLOSE POPUP =====
document.addEventListener("click", function(e) {
  if (!e.target.classList.contains("word")) {
    document.getElementById("popup").style.display = "none";
  }
});


// ===== PROGRESS =====
function updateProgress() {

  if (!story || !story.content) return;

  const total = story.content.length;

  const learned = story.content.filter(w =>
    localStorage.getItem("learned_" + w.word)
  ).length;

  const percent = Math.floor((learned / total) * 100);

  document.getElementById("progress").innerText =
    `Progress: ${percent}%`;
}


// ===== SOUND =====
function playSound(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = getTtsLocale(currentLang);
  speechSynthesis.speak(utterance);
}