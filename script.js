const images = [
  "https://cdn-icons-png.flaticon.com/512/616/616408.png",
  "https://cdn-icons-png.flaticon.com/512/616/616430.png",
  "https://cdn-icons-png.flaticon.com/512/616/616494.png",
  "https://cdn-icons-png.flaticon.com/512/616/616408.png",
  "https://cdn-icons-png.flaticon.com/512/616/616430.png",
  "https://cdn-icons-png.flaticon.com/512/616/616494.png",
  "https://cdn-icons-png.flaticon.com/512/616/616408.png",
  "https://cdn-icons-png.flaticon.com/512/616/616430.png"
];

let cards = [];
let first = null;
let second = null;
let lock = false;
let moves = 0;
let time = 0;
let timer;

const board = document.getElementById("board");
const movesText = document.getElementById("moves");
const timeText = document.getElementById("time");
const bestText = document.getElementById("best");
const popup = document.getElementById("popup");
const finalStats = document.getElementById("finalStats");

function setupBoard(size) {
  board.innerHTML = "";
  board.style.gridTemplateColumns = "repeat(4, 80px)";

  let selected = images.slice(0, size/2);
  cards = [...selected, ...selected].sort(() => Math.random() - 0.5);

  cards.forEach(src => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.image = src;

    const img = document.createElement("img");
    img.src = src;

    card.appendChild(img);
    card.addEventListener("click", () => flip(card));

    board.appendChild(card);
  });
}

function flip(card) {
  if (lock || card.classList.contains("flipped")) return;

  card.classList.add("flipped");

  if (!first) {
    first = card;
    return;
  }

  second = card;
  moves++;
  movesText.innerText = moves;

  if (first.dataset.image === second.dataset.image) {
    first.classList.add("matched");
    second.classList.add("matched");
    resetTurn();
    checkWin();
  } else {
    lock = true;
    setTimeout(() => {
      first.classList.remove("flipped");
      second.classList.remove("flipped");
      resetTurn();
    }, 700);
  }
}

function resetTurn() {
  first = null;
  second = null;
  lock = false;
}

function checkWin() {
  if (document.querySelectorAll(".matched").length === cards.length) {
    clearInterval(timer);
    popup.style.display = "flex";
    finalStats.innerText = `Moves: ${moves}, Time: ${time}s`;

    let best = localStorage.getItem("bestScore");
    if (!best || time < best) {
      localStorage.setItem("bestScore", time);
      bestText.innerText = time + "s";
    }
  }
}

function restartGame() {
  clearInterval(timer);

  moves = 0;
  time = 0;
  movesText.innerText = moves;
  timeText.innerText = time;

  popup.style.display = "none";

  let size = parseInt(document.getElementById("difficulty").value);
  setupBoard(size);

  timer = setInterval(() => {
    time++;
    timeText.innerText = time;
  }, 1000);
}

function loadBest() {
  let best = localStorage.getItem("bestScore");
  if (best) bestText.innerText = best + "s";
}

loadBest();
restartGame();