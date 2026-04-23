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
const statusEl = document.querySelector("#status-banner")
const statusTitleEl = statusEl.querySelector(".status-title")
const statusContentEl = statusEl.querySelector(".status-sub")

//

let statusState = "ready"

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

export function getStatusState(){
    return statusState
}

export function setStatusState(state){
    statusState = state;

    if (state == "hidden"){
        statusEl.classList.add("status-banner-hidden");
    } else {
        statusEl.classList.remove("status-banner-hidden");
    }

    if (state == "ready"){
        statusTitleEl.textContent = "Ready?";
        statusContentEl.textContent = "Press Enter to start";
    }
    else if (state == "pause"){
        statusTitleEl.textContent = "Paused";
        statusContentEl.textContent = "Press P to continue";
    }
    else if (state == "over"){
        statusTitleEl.textContent = "Game Over";
        statusContentEl.textContent = "Press Enter to restart";
    }
    
}