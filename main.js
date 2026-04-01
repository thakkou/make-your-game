const boardEl = document.querySelector(".board");

const width = 10, height = 20;

// setup
for (let i = 0; i < width * height; i++){
    boardEl.insertAdjacentHTML("beforeend", `<div class="cell"></div>`);
}