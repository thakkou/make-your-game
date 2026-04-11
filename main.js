import { setup, update } from "./functions.js";


setup();
document.getElementById('start-btn').addEventListener("click", () => {
    // game loop
    requestAnimationFrame(update);
});

