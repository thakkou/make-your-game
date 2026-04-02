const scoreEl = document.querySelector(".panel-score");
const livesEl = document.querySelector(".panel-lives");
const timerEl = document.querySelector(".panel-timer");

let isPaused = false;
let score = 0;
const maxLives = 4;
let lives = maxLives;
let timer = 0.0;

let highestScore = 0; // TODO: we can store this in local storage

// setup
(() => {
    livesEl.textContent = `${lives}/${maxLives}`;
})();

// events

addEventListener("keydown", (ev) => {
    if (ev.key == "p"){
        isPaused = !isPaused;
        window.dispatchEvent(new CustomEvent('menu-pause', {detail:{isPaused:isPaused}}));

        // TODO: UI to show that game is ppaused
    }
})

addEventListener("game-time-increment", (ev) => {
    timer += ev.detail.delta;
    const minutes = Math.floor(timer);
    const seconds = Math.floor((timer % 1) * 60);
    timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
});

addEventListener("game-score-increment", (ev) => {
    score += ev.detail.score;
    scoreEl.textContent = score;
});