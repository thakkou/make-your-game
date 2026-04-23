import { setup, update } from "./functions.js";
import {setStatusState} from "./global.js"

setup(); // script already deffered in html

// game loop
setStatusState("ready");
requestAnimationFrame(update);