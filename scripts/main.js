import { setGameState, highScoreEl, rotations, stats, getGameState } from "./globals.js"
import { setupBoard, update } from "./functions.js";
import { fall, canPlacePieceAt, eraseCurrentPiece, placePieceAt, setCurrPieceRotation } from "./functions.js";
import { currPieceType, currPieceX, currPieceY, currPieceRotation, setCurrPieceX } from "./functions.js"; // tmp

setupBoard();
highScoreEl.textContent = localStorage.getItem("highScore") ?? 0;

// game loop
setGameState("prompt-start");
requestAnimationFrame(update);

addEventListener("keydown", (ev) => {
    if (stats.isPaused){
        switch (ev.key){
            case "Enter":
                if (getGameState() === "prompt-start"){
                    stats.isPaused = false;
                    setGameState("game");
                }
                break;

            case "p":
                // toggle-pause
                if (getGameState() === "prompt-pause") {
                    stats.isPaused = false;
                    setGameState("game");
                }
                break;

            case "r":
                if (getGameState() === "prompt-pause") {
                    location.reload();
                }
                break;
        }
        return;
    }

    switch (ev.key){
        case "Enter":
            if (getGameState() === "prompt-over"){
                location.reload(); // ¯\_(ツ)_/¯
            }
            break;

        case "ArrowUp":
            if (getGameState() === "game"){
                const newRot = rotations[(rotations.indexOf(currPieceRotation) + 1) % rotations.length]; // next rotation
                if (canPlacePieceAt(currPieceX, currPieceY, currPieceType, newRot)){
                    eraseCurrentPiece();
                    setCurrPieceRotation(newRot) // currPieceRotation = newRot;
                    placePieceAt(currPieceX, currPieceY, currPieceType, currPieceRotation);
                }
            }
            break;

        case "ArrowDown":
            if (getGameState() === "game"){
                fall();
            }
            break;

        case "ArrowLeft":
            if (getGameState() === "game"){
                if (canPlacePieceAt(currPieceX-1, currPieceY, currPieceType, currPieceRotation)){
                    eraseCurrentPiece();
                    setCurrPieceX(currPieceX - 1) // currPieceX -= 1;
                    placePieceAt(currPieceX, currPieceY, currPieceType, currPieceRotation);
                }
            }
            break;

        case "ArrowRight":
            if (getGameState() === "game"){
                if (canPlacePieceAt(currPieceX+1, currPieceY, currPieceType, currPieceRotation)){
                    eraseCurrentPiece();
                    setCurrPieceX(currPieceX + 1) // currPieceX += 1;
                    placePieceAt(currPieceX, currPieceY, currPieceType, currPieceRotation);
                }
            }
            break;

        case " ":
            if (getGameState() === "game"){
                // drop down
                let currHeight = currPieceY;
                while (canPlacePieceAt(currPieceX, currHeight+1, currPieceType, currPieceRotation)){
                    fall();
                    currHeight++;
                }
            }
            break;

        case "p":
            // toggle-pause
            if (getGameState() === "game"){
                stats.isPaused = true;
                setGameState("prompt-pause");
            }
            break;
    }
});