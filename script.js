const KEY = "VOCAB_DATA";
let words = [];
let current = null;
let locked = false;

/* utils */
const getData = () => JSON.parse(localStorage.getItem(KEY)) || [];
const saveData = d => localStorage.setItem(KEY, JSON.stringify(d));
const shuffle = a => [...a].sort(() => Math.random() - 0.5);

/* INDEX */
function saveAndStart() {
  const data = vocabInput.value
    .trim()
    .split("\n")
    .map(l => {
      const [w, m] = l.split("|").map(s => s.trim());
      return w && m ? { word: w, meaning: m, score: 0 } : null;
    })
    .filter(Boolean);

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
  words = getData();
  if (words.length === 0) {
    location.href = "result.html";
    return;
  }
  nextWord();
}

function nextWord() {
  words = getData();
  if (words.length === 0) {
    location.href = "result.html";
    return;
  }
  current = shuffle(words)[0];
  render();
}

function getStage(word) {
  // score: 0 → flash | 1 → choice | 2 → flash
  return word.score === 1 ? "choice" : "flash";
}

function render() {
  locked = false;
  const card = document.getElementById("card");
  const btn = document.getElementById("actionBtn");
  btn.innerText = "Trả lời";

  const stage = getStage(current);

  if (stage === "flash") {
    card.innerHTML = `
      <div class="flashcard">
        <p><b>${current.meaning}</b></p>
        <input id="input" placeholder="Nhập từ tiếng Anh" autocomplete="off">
      </div>
    `;
  } else {
    const allMeanings = [...new Set(words.map(w => w.meaning))];
    const wrong = shuffle(
      allMeanings.filter(m => m !== current.meaning)
    ).slice(0, 3);

    const options = shuffle([current.meaning, ...wrong]);

    card.innerHTML = `
      <div class="choice">
        <p><b>${current.word}</b></p>
        ${options.map(o => `
          <label>
            <input type="radio" name="ans" value="${o}">
            ${o}
          </label>
        `).join("")}
      </div>
    `;
  }
}

function submit() {
  if (locked) return;

  const stage = getStage(current);
  let correct = false;

  if (stage === "flash") {
    const input = document.getElementById("input");
    if (!input) return;
    correct =
      input.value.trim().toLowerCase() ===
      current.word.toLowerCase();
  } else {
    const checked = document.querySelector("input[name='ans']:checked");
    correct = checked && checked.value === current.meaning;
  }

  showFeedback(correct);
}

function showFeedback(isCorrect) {
  const card = document.getElementById("card");
  const btn = document.getElementById("actionBtn");

  if (isCorrect) {
    locked = true;
    card.innerHTML += `<div class="feedback correct">✅ Đúng!</div>`;
    current.score++;
    updateData();
    setTimeout(nextWord, 700);
  } else {
    card.innerHTML += `
      <div class="feedback wrong">
        ❌ Sai. Đáp án đúng: <b>${current.word}</b>
      </div>
    `;
    btn.innerText = "Sửa lại";
    locked = false;
  }
}

function updateData() {
  let data = getData()
    .map(w => (w.word === current.word ? current : w))
    .filter(w => w.score < 3);

  saveData(data);
}
