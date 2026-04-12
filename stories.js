// ===== GLOBAL =====
let data = {};


// ===== INIT =====
async function init() {
  try {
    data = await loadLanguageData();

    const langName = data.language || currentLanguage || "Language";

    document.getElementById("langTitle").innerText = langName;

    loadStories();

  } catch (err) {
    console.error("Error loading stories:", err);

    document.getElementById("storyList").innerHTML =
      "<p>❌ Failed to load stories</p>";
  }
}

init();


// ===== LOAD STORIES =====
function loadStories() {

  const container = document.getElementById("storyList");
  container.innerHTML = "";

  const stories = data?.stories;

  if (!stories || Object.keys(stories).length === 0) {
    container.innerHTML = "<p>No stories available ❌</p>";
    return;
  }

  Object.entries(stories).forEach(([key, story]) => {

    const card = document.createElement("div");
    card.className = "story-card";

    const title = document.createElement("h3");
    title.innerText = story.title || "Untitled Story";

    const btn = document.createElement("button");
    btn.innerText = "Start →";

    btn.onclick = () => {
      localStorage.setItem("currentStory", key);
      window.location.href = "storyViewer.html";
    };

    card.appendChild(title);
    card.appendChild(btn);

    container.appendChild(card);
  });
}