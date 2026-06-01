import { setupBoard, update } from "./functions.js";
import { setGameState } from "./global.js"

setupBoard();

// game loop
setGameState("prompt-start");
requestAnimationFrame(update);


// import { boardEl } from "./global.js";
// import { setupBoard, update } from "./functions.js";

// document.addEventListener("DOMContentLoaded", () => {
//     welcome();
//     document.getElementById('start-btn').addEventListener("click", () => {
//         // remove logo + start button
//         document.getElementById('board-container').querySelector('.welcome-screen').remove();
//         boardEl.innerHTML = '';
//         boardEl.style.display = "grid";


//         setupBoard(); // script already deffered in html
//         // game loop
//         requestAnimationFrame(update);
//     });
// });

// function welcome() {
//     // setup logo
//     const screen = document.createElement("div");
//     screen.classList.add("welcome-screen");

//     const logo = document.createElement("h1");
//     logo.textContent = 'Tetris';
//     screen.appendChild(logo);

//     // setup start button
//     const startBtn = document.createElement("button");
//     startBtn.id = 'start-btn';
//     startBtn.textContent = 'Start';
//     screen.appendChild(startBtn);

//     boardEl.style.display = "none";
//     document.getElementById('board-container').appendChild(screen);
// }

