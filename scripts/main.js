import { setGameState, highScoreEl, rotations, stats, currPiece, getGameState } from "./globals.js"
import { setupBoard, update } from "./functions.js";
import { fall, canPlacePieceAt, eraseCurrentPiece, placePieceAt } from "./functions.js";

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
                const newRot = rotations[(rotations.indexOf(currPiece.Rotation) + 1) % rotations.length]; // next rotation
                if (canPlacePieceAt(currPiece.X, currPiece.Y, currPiece.type, newRot)){
                    eraseCurrentPiece();
                    currPiece.Rotation = newRot;
                    placePieceAt(currPiece.X, currPiece.Y, currPiece.type, currPiece.Rotation);
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
                if (canPlacePieceAt(currPiece.X-1, currPiece.Y, currPiece.type, currPiece.Rotation)){
                    eraseCurrentPiece();
                    currPiece.X -= 1;
                    placePieceAt(currPiece.X, currPiece.Y, currPiece.type, currPiece.Rotation);
                }
            }
            break;

        case "ArrowRight":
            if (getGameState() === "game"){
                if (canPlacePieceAt(currPiece.X+1, currPiece.Y, currPiece.type, currPiece.Rotation)){
                    eraseCurrentPiece();
                    currPiece.X += 1;
                    placePieceAt(currPiece.X, currPiece.Y, currPiece.type, currPiece.Rotation);
                }
            }
            break;

        case " ":
            if (getGameState() === "game"){
                // drop down
                let currHeight = currPiece.Y;
                while (canPlacePieceAt(currPiece.X, currHeight+1, currPiece.type, currPiece.Rotation)){
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