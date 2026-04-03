export const boardWidth = 10;
export const boardHeight = 20;
export const stepTimeSec = 0.4;
export const scoreIncrement = 10;
export const maxLives = 4;

export function flushCellClass(cell){
    cell.classList.remove("T", "I", "O", "Z", "L");
}