// menus logic (score, time...)

const pauseEvent = new CustomEvent('event-pause');
const unpauseEvent = new CustomEvent('event-unpause');

let isPaused = false;
let score = 0;
const maxLives = 4;
let lives = maxLives;
let timer = 0.0;

let highestScore = 0; // TODO: we can store this in local storage


addEventListener("keydown", (ev) => {
    // TODO: doesn't do anything currently
    if (ev.key == "p"){
        isPaused ? window.dispatchEvent(unpauseEvent) : window.dispatchEvent(pauseEvent);
        isPaused = !isPaused;
    }
})