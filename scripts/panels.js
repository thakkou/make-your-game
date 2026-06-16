import { maxLives, nextPieceGridEl, scoreEl, highScoreEl, livesEl, timerEl, scoreSubmitEl, getGameState, stats } from "./globals.js";
import { flushCellClass, setHighscore } from "./functions.js";

scoreSubmitEl.addEventListener("submit", (ev) => {
    ev.preventDefault();
    //...
})

addEventListener("game-time-increment", (ev) => {
    stats.timer += ev.detail.delta;
    const minutes = Math.floor(stats.timer / 60);
    const seconds = Math.floor(stats.timer % 60);
    timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
});

addEventListener("game-score-increment", (ev) => {
    stats.score += ev.detail.score;
    scoreEl.textContent = stats.score;

    setHighscore();
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

addEventListener("game-over", (ev) => {
    setHighscore();
});