import {maxLives, flushCellClass, nextPieceGridEl, scoreEl, livesEl, timerEl} from "./global.js";

let score = 0;
let timer = 0.0;

let highestScore = 0; // TODO: we can store this in local storage

// events

addEventListener("keydown", (ev) => {
    if (ev.key == "p"){
        window.dispatchEvent(new CustomEvent('toggle-pause'));
    }
});

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

addEventListener("game-next-piece-chosen", (ev) => {
    let cells = nextPieceGridEl.children;
    
    // clear
    for (let cell of cells){
        flushCellClass(cell);
    }

    let height = ev.detail.piece.length
    let width = ev.detail.piece[0].length;
    for (let y = 0; y < height; y++){
        for (let x = 0; x < width; x++){
            if (ev.detail.piece[y][x] !== " "){
                let index = x + y * 4;
                cells[index].classList.add(ev.detail.pieceType);
            }
        }
    }
});

addEventListener("game-lives-decrement", (ev) => {
    livesEl.textContent = `${ev.detail.lives}/${maxLives}`;
});