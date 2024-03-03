let endpoint = "ENDPOINT_GOES_HERE";
let port = "8080";

let word = "apple";
let score;
let possible= [];
let breaker = false
async function makeGuess(){
    document.querySelector("#guess").value = word;
    document.querySelector("#guess-btn").click();
    score = document.querySelector("#guesses > tbody > tr.word-cold.local-guess > td:nth-child(3)").innerHTML;
}

async function newWord(){
    setTimeout(async () => {
    try {
        let response = await fetch(`https://${endpoint}:${port}/api/getpossiblevalues`, {
            method: 'POST',
            mode: 'no-cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                guess: word,
                score: score,
                possible: possible
            })
        });
        let data = await response.json();
        possible = data.possible;
        word = possible[0];
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
        breaker = true
    }
    },10000);
}

async function solveSemantle(){
    while(true){
        await makeGuess();
        console.log("here");
        await newWord();
        console.log("here2");
        console.log("iteration");
        if (parseFloat(score) === 100.00 || breaker){
            break;
        }
    }
}

chrome.runtime.onMessage.addListener( async (message, sender, sendResponse) => {
    console.log("RECEIVED SEMANTLE");
    // await message
    if (message.type === "semantle"){
        chrome.storage.local.set({ gameData : word }, function() {
            console.log('best guess stored');
        });
    }
    if (message.action === "autoSolve"){
        console.log("begin solve")
        await solveSemantle();
    }

    console.log("DONE SEMANTLE");
});
  
  
  