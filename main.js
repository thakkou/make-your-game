import { setup, update } from "./functions.js";
import { setGameState } from "./global.js"

setup(); // script already deffered in html

// game loop
setGameState("prompt-start");
requestAnimationFrame(update);