// ===== GLOBAL =====
let data = {};
let allItems = [];
let currentQuestion;
let correctAnswer;
let score = 0;

// ===== QUIZ TYPE =====
let quizType = localStorage.getItem("quizType") || "wordToMeaning";

// ===== INIT =====
async function init() {
  try {
    data = await loadLanguageData();

    const langName = data.language || currentLanguage || "Language";
    document.getElementById("langTitle").innerText = langName;

    updateQuizTypeButtonsUI();
    prepareData();

    if (allItems.length === 0) {
      document.getElementById("question").innerText = "No data available ❌";
      return;
    }

    nextQuestion();

  } catch (err) {
    console.error("Error:", err);
  }
}

init();

function changeQuizType(type) {
  quizType = type;
  localStorage.setItem("quizType", type);
  updateQuizTypeButtonsUI();
  nextQuestion();
}

function updateQuizTypeButtonsUI() {
  ["wordToMeaning", "meaningToWord"].forEach(type => {
    const btn = document.getElementById(`quiztype-${type}`);
    if (btn) {
      if (type === quizType) {
        btn.classList.add("active-quiz-type");
      } else {
        btn.classList.remove("active-quiz-type");
      }
    }
  });
}


// ===== PREPARE DATA =====
function prepareData() {

  let temp = [];

  const stories = data.stories;

  if (stories) {
    Object.values(stories).forEach(story => {
      story.content.forEach(item => {

        if (
          item.word &&
          item.meaning &&
          item.word.length > 0 &&
          item.meaning.length > 0
        ) {
          temp.push({
            word: item.word,
            meaning: item.meaning
          });
        }

      });
    });
  }

  // ✅ remove duplicates
  const uniqueMap = new Map();

  temp.forEach(item => {
    const key = item.word + "|" + item.meaning;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, item);
    }
  });

  allItems = Array.from(uniqueMap.values());
}


// ===== NEXT QUESTION =====
function nextQuestion() {

  document.getElementById("result").innerText = "";
  document.getElementById("nextBtn").style.display = "none";

  currentQuestion = allItems[Math.floor(Math.random() * allItems.length)];

  const q = document.getElementById("question");

  if (quizType === "wordToMeaning") {
    q.innerText = currentQuestion.word;
    correctAnswer = currentQuestion.meaning;

  } else {
    q.innerText = currentQuestion.meaning;
    correctAnswer = currentQuestion.word;
  }

  generateOptions();
}


// ===== OPTIONS =====
function generateOptions() {

  let options = [correctAnswer];

  let attempts = 0;

  while (options.length < 4 && attempts < 30) {

    let random = allItems[Math.floor(Math.random() * allItems.length)];

    let value = (quizType === "wordToMeaning")
      ? random.meaning
      : random.word;

    if (value && !options.includes(value)) {
      options.push(value);
    }

    attempts++;
  }

  // fallback
  while (options.length < 4) {
    options.push("—");
  }

  options.sort(() => Math.random() - 0.5);

  const div = document.getElementById("options");
  div.innerHTML = "";

  options.forEach(opt => {

    const btn = document.createElement("button");
    btn.innerText = opt;

    btn.onclick = () => {
      if (opt === "—") return;
      checkAnswer(opt);
    };

    div.appendChild(btn);
  });
}


// ===== CHECK ANSWER =====
function checkAnswer(selected) {

  const result = document.getElementById("result");
  const container = document.querySelector(".container");

  if (container) {
    container.classList.remove("correct-pulse", "incorrect-shake");
    void container.offsetWidth;
  }

  if (selected === correctAnswer) {
    score++;
    result.innerText = "✅ Correct!";
    result.style.color = "#34d399";
    if (container) container.classList.add("correct-pulse");
  } else {
    score--;
    result.innerText = `❌ Wrong! Correct: ${correctAnswer}`;
    result.style.color = "#f87171";
    if (container) container.classList.add("incorrect-shake");
  }

  document.getElementById("score").innerText = "Score: " + score;

  document.getElementById("nextBtn").style.display = "block";

  document.querySelectorAll("#options button").forEach(btn => {
    btn.disabled = true;
  });
}