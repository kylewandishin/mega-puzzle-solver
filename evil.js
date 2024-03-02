let hasRun = false
function verySafeCode(){
    hasRun=true;
    console.log(window.gameData.ourSolution);
    return window.gameData.ourSolution;
}
const yummyGameData = verySafeCode();
window.postMessage({ type: 'YUMMY_GAME_DATA', data: yummyGameData }, '*');