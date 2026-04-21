import { setup, update } from "./functions.js";


setup(); // script already deffered in html
document.getElementById('start-btn').addEventListener("click", () => {
    // game loop
    requestAnimationFrame(update);
});

