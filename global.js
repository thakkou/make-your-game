export const boardWidth = 10;
export const boardHeight = 20;
export const stepTimeSec = 0.4;
export const scoreIncrement = 10;
export const maxLives = 4;

export function flushCellClass(cell){
    cell.classList.remove("T", "I", "O", "Z", "L");
}

// main.js

export const boardEl = document.querySelector(".board");

export const piecesTemplate = { // TODO: move these constants to global.js
    O: [
        "00",
        "00"
    ],
    I: ["0000"],
    T: [
        "000",
        " 0 "
    ],
    L: [
        "  0",
        "000"
    ],
    Z: [
        "00 ",
        " 00"
    ],
};

export const rotations = [
    0, 90, 180, 270
]
export const types = [
    "O", "I", "T", "L", "Z"
]

// menu.js

export const nextPieceGridEl = document.querySelector(".next-grid");
export const scoreEl = document.querySelector(".panel-score");
export const livesEl = document.querySelector(".panel-lives");
export const timerEl = document.querySelector(".panel-timer");