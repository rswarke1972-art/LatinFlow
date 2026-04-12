// ===== GLOBAL =====
let data = {};
let currentSentence;
let selected = [];

let tense = localStorage.getItem("tense") || "present";
let currentIndex = parseInt(localStorage.getItem("sentenceIndex")) || 0;

let wordPool = [];
let currentLang = "";


// ===== INIT =====
async function init() {
  try {
    data = await loadLanguageData();

    currentLang = (data.language || "").toLowerCase();

    document.getElementById("langTitle").innerText =
      data.language || currentLanguage;

    buildWordPool();
    loadSentence();

  } catch (err) {
    console.error("Error loading data:", err);
    document.getElementById("englishSentence").innerText =
      "Error loading data ❌";
  }
}

init();


// ===== BUILD WORD POOL =====
function buildWordPool() {
  wordPool = [];

  if (!data.sentences) return;

  data.sentences.forEach(sentence => {
    ["present", "past", "future"].forEach(t => {

      if (sentence[currentLang]?.[t]) {
        wordPool.push(...sentence[currentLang][t]);
      }

    });
  });

  wordPool = [...new Set(wordPool)];
}


// ===== LOAD SENTENCE =====
function loadSentence() {

  const list = data?.sentences;

  if (!list || list.length === 0) {
    document.getElementById("englishSentence").innerText =
      "No sentences available ❌";
    return;
  }

  if (currentIndex >= list.length) currentIndex = 0;

  currentSentence = list[currentIndex];

  localStorage.setItem("sentenceIndex", currentIndex);

  selected = [];

  updateSentenceView();
}


// ===== NEXT =====
function nextSentence() {
  const list = data?.sentences;

  currentIndex = (currentIndex + 1) % list.length;
  localStorage.setItem("sentenceIndex", currentIndex);

  loadSentence();
}


// ===== PREVIOUS =====
function prevSentence() {
  const list = data?.sentences;

  currentIndex = (currentIndex - 1 + list.length) % list.length;
  localStorage.setItem("sentenceIndex", currentIndex);

  loadSentence();
}


// ===== UPDATE VIEW =====
function updateSentenceView() {

  if (!currentSentence) return;

  document.getElementById("englishSentence").innerText =
    currentSentence.english?.[tense] || "";

  selected = [];

  renderSelected();
  generateWordBank();

  document.getElementById("result").innerText = "";
}


// ===== GENERATE WORD BANK =====
function generateWordBank() {

  if (!currentSentence) return;

  const correctWords = currentSentence[currentLang]?.[tense] || [];

  if (correctWords.length === 0) return;

  let options = [];

  // ✅ Always next correct word
  const nextCorrect = correctWords[selected.length];

  if (nextCorrect) {
    options.push(nextCorrect);
  }

  // wrong pool
  let wrongPool = wordPool.filter(
    w => !correctWords.includes(w) && !selected.includes(w)
  );

  if (wrongPool.length === 0) {
    wrongPool = wordPool;
  }

  let attempts = 0;

  while (options.length < 4 && attempts < 30) {
    let random = wrongPool[Math.floor(Math.random() * wrongPool.length)];

    if (random && !options.includes(random)) {
      options.push(random);
    }

    attempts++;
  }

  while (options.length < 4) {
    options.push("—");
  }

  options.sort(() => Math.random() - 0.5);

  const bank = document.getElementById("wordBank");
  bank.innerHTML = "";

  options.forEach(word => {

    const btn = document.createElement("button");
    btn.innerText = word;

    btn.onclick = () => {
      if (word === "—") return;

      selected.push(word);

      renderSelected();
      generateWordBank();
    };

    bank.appendChild(btn);
  });
}


// ===== SELECTED WORDS =====
function renderSelected() {

  const div = document.getElementById("selectedWords");
  div.innerHTML = "";

  selected.forEach((word, index) => {

    const span = document.createElement("span");
    span.innerText = word;

    span.className = "selected-word";

    span.onclick = () => {
      selected.splice(index, 1);
      renderSelected();
      generateWordBank();
    };

    div.appendChild(span);
  });
}


// ===== CHECK =====
function checkSentence() {

  const result = document.getElementById("result");

  if (!currentSentence) return;

  const correctWords = currentSentence[currentLang]?.[tense] || [];

  if (selected.length !== correctWords.length) {
    result.innerText = "⚠️ Complete the sentence first!";
    result.style.color = "orange";
    return;
  }

  const correct = correctWords.join(" ");
  const user = selected.join(" ");

  if (user === correct) {
    result.innerText = "✅ Correct!";
    result.style.color = "lightgreen";
  } else {
    result.innerText = "❌ Wrong! Correct: " + correct;
    result.style.color = "red";
  }
}