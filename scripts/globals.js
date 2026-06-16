// Constants

export const boardWidth = 10;
export const boardHeight = 20;
export const stepTimeSec = 0.4;
export const scoreIncrement = 10;
export const maxLives = 4;

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
];

export const types = [
    "I", "O", "T", "S", "Z", "J", "L"
];

// DOM Elements

export const boardEl = document.querySelector(".board");
export const nextPieceGridEl = document.querySelector(".next-grid");
export const scoreEl = document.querySelector(".panel-score");
export const highScoreEl = document.querySelector(".panel-highscore");
export const livesEl = document.querySelector(".panel-lives");
export const timerEl = document.querySelector(".panel-timer");
export const scoreboardEl = document.querySelector("#scoreboard-banner");
export const scoreSubmitEl = document.querySelector("#score-submit");
const statusEl = document.querySelector("#status-banner");
const statusTitleEl = statusEl.querySelector(".status-title");
const statusContentEl = statusEl.querySelector(".status-sub");

// Game State

let gameState = "ready";
export const stats = {
    score: 0,
    timer: 0.0,
    isPaused: true
};

export function getGameState(){
    return gameState;
}

export function setGameState(state){
    gameState = state;
    statusEl.classList.add("hidden");
    scoreSubmitEl.classList.add("hidden");
    scoreboardEl.classList.add("hidden");

    if (state.startsWith("prompt-")){
        statusEl.classList.remove("hidden");
        const statuses = [
            {state: "prompt-start", title: "Ready?", content: "Press Enter to start"},
            {state: "prompt-pause", title: "Paused", content: "Press P to continue, R to restart"},
            {state: "prompt-over", title: "Game Over", content: "Press Enter to restart"}
        ];
        for (let status of statuses) {
            if (state === status.state) {
                statusTitleEl.textContent = status.title;
                statusContentEl.textContent = status.content;
                break;
            }
        }
    } else {
        statusEl.classList.add("hidden");
    }

    if (state === "score-submit"){
        scoreSubmitEl.classList.remove("hidden")
    }

    if (state === "score-show"){
        scoreboardEl.classList.remove("hidden")
    }

}