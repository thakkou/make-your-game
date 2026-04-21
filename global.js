export const boardWidth = 10;
export const boardHeight = 20;
export const stepTimeSec = 0.4;
export const scoreIncrement = 10;
export const maxLives = 4;

// Elements

export const boardEl = document.querySelector(".board");
export const nextPieceGridEl = document.querySelector(".next-grid");
export const scoreEl = document.querySelector(".panel-score");
export const livesEl = document.querySelector(".panel-lives");
export const timerEl = document.querySelector(".panel-timer");

//

export const piecesTemplate = {
    I: ["0000"],
    O: [
        "00",
        "00"
    ],
    T: [
        " 0 ",
        "000"
    ],
    S: [
        " 00",
        "00 "
    ],
    Z: [
        "00 ",
        " 00"
    ],
    J: [
        "0  ",
        "000"
    ],
    L: [
        "  0",
        "000"
    ],
};

export const rotations = [
    0, 90, 180, 270
]
export const types = [
    "I", "O", "T", "S", "Z", "J", "L"
]

// Functions

export function flushCellClass(cell){
    cell.classList.remove("I", "O", "T", "S", "Z", "J", "L");
}