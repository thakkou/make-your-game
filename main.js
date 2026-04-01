import { boardWidth, boardHeight } from "./global.js";

const boardEl = document.querySelector(".board");

// setup
for (let i = 0; i < boardWidth * boardHeight; i++){
    boardEl.insertAdjacentHTML("beforeend", `<div class="cell"></div>`);
}

// TODO: custom events for communicating between scripts, see medium.com/@pankajpatil822/understanding-custom-events-in-javascript-ad23cc759617