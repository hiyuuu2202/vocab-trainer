const KEY = "VOCAB_DATA";
let batch = [];
let step = 0;

/* utils */
const getData = () => JSON.parse(localStorage.getItem(KEY)) || [];
const saveData = d => localStorage.setItem(KEY, JSON.stringify(d));
const shuffle = a => [...a].sort(() => Math.random() - 0.5);

/* INDEX */
function saveAndStart() {
  const lines = vocabInput.value.trim().split("\n");
  const data = [];

  lines.forEach(l => {
    const [word, meaning] = l.split("|").map(s => s.trim());
    if (word && meaning) data.push({ word, meaning, score: 0 });
  });

  saveData(data);
  location.href = "quiz.html";
}

function clearToday() {
  if (confirm("Xóa toàn bộ từ hôm nay?")) {
    localStorage.removeItem(KEY);
    alert("Đã xóa");
  }
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
  batch = shuffle(data).slice(0, Math.min(5, data.length));
  step = 0;
  renderQuestion();
}

function renderQuestion() {
  const q = batch[step];
  const quiz = document.getElementById("quiz");
  quiz.innerHTML = "";

  // chẵn: flash | lẻ: trắc nghiệm
  if (step % 2 === 0) {
    quiz.innerHTML = `
      <div class="flashcard">
        <p><b>${q.meaning}</b></p>
        <input id="answer" placeholder="Nhập từ tiếng Anh">
      </div>
    `;
  } else {
    const allMeanings = [...new Set(getData().map(d => d.meaning))];
    const wrong = shuffle(allMeanings.filter(m => m !== q.meaning)).slice(0, 3);
    const options = shuffle([q.meaning, ...wrong]);

    quiz.innerHTML = `
      <div class="question">
        <p><b>${q.word}</b></p>
        ${options.map(o => `
          <label>
            <input type="radio" name="answer" value="${o}">
            ${o}
          </label>
        `).join("")}
      </div>
    `;
  }
}

function submitAndContinue() {
  const q = batch[step];
  let correct = false;

  if (step % 2 === 0) {
    const input = document.getElementById("answer").value.trim().toLowerCase();
    correct = input === q.word.toLowerCase();
  } else {
    const checked = document.querySelector("input[name='answer']:checked");
    correct = checked && checked.value === q.meaning;
  }

  if (correct) q.score++;

  let data = getData()
    .map(d => d.word === q.word ? q : d)
    .filter(d => d.score < 3);

  saveData(data);

  step++;
  if (step >= batch.length) startLearning();
  else renderQuestion();
}
