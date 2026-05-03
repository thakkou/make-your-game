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

let gameState = "ready"

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

export function getGameState(){
    return gameState
}

export function setGameState(state){
    gameState = state;

    console.log(state)
    if (state.startsWith("prompt-")){
        statusEl.classList.remove("status-banner-hidden");
    } else {
        statusEl.classList.add("status-banner-hidden");
    }

    if (state === "prompt-start"){
        statusTitleEl.textContent = "Ready?";
        statusContentEl.textContent = "Press Enter to start";
    }
    else if (state === "prompt-pause"){
        statusTitleEl.textContent = "Paused";
        statusContentEl.textContent = "Press P to continue";
    }
    else if (state === "prompt-over"){
        statusTitleEl.textContent = "Game Over";
        statusContentEl.textContent = "Press Enter to restart";
    }
    
}