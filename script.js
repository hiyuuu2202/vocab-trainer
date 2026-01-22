const KEY = "VOCAB_DATA";
let currentBatch = [];
let mode = "choice";

function getData() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

/* INDEX */
function saveAndStart() {
  const text = vocabInput.value.trim();
  if (!text) return;

  const data = [];
  text.split("\n").forEach(line => {
    const [word, meaning] = line.split("-").map(s => s.trim());
    if (word && meaning) {
      data.push({ word, meaning, score: 0 });
    }
  });

  saveData(data);
  location.href = "quiz.html";
}

function copyPrompt() {
  navigator.clipboard.writeText(promptText.value);
  alert("Đã sao chép prompt");
}

/* LEARNING */
function startLearning() {
  const data = getData();

  if (data.length === 0) {
    location.href = "result.html";
    return;
  }

  currentBatch = shuffle(data).slice(0, Math.min(5, data.length));
  renderQuiz();
}

function setMode(m) {
  mode = m;
  renderQuiz();
}

function renderQuiz() {
  const quiz = document.getElementById("quiz");
  quiz.innerHTML = "";

  currentBatch.forEach((item, i) => {
    if (mode === "choice") {
      const options = shuffle([
        item.meaning,
        ...shuffle(getData().map(d => d.meaning)).slice(0, 3)
      ]);

      quiz.innerHTML += `
        <div class="question">
          <p><b>${item.word}</b></p>
          ${options.map(o => `
            <label>
              <input type="radio" name="q${i}" value="${o}">
              ${o}
            </label>
          `).join("")}
        </div>`;
    } else {
      quiz.innerHTML += `
        <div class="flashcard">
          <p><b>${item.meaning}</b></p>
          <input id="q${i}" placeholder="Nhập từ tiếng Anh">
        </div>`;
    }
  });
}

function submitAndContinue() {
  let data = getData();

  currentBatch.forEach((item, i) => {
    let correct = false;

    if (mode === "choice") {
      const c = document.querySelector(`input[name="q${i}"]:checked`);
      correct = c && c.value === item.meaning;
    } else {
      const input = document.getElementById(`q${i}`).value.trim().toLowerCase();
      correct = input === item.word.toLowerCase();
    }

    if (correct) item.score++;
  });

  data = data
    .map(d => currentBatch.find(b => b.word === d.word) || d)
    .filter(d => d.score < 3);

  saveData(data);
  startLearning();
}
