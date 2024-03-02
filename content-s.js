let endpoint = "";
let port = "";

let word = "apple";
let score;

async function makeGuess(){
    document.querySelector("#guess").value = word;
    document.querySelector("#guess-btn").click();
    score = document.querySelector("#guesses > tbody > tr.word-cold.local-guess > td:nth-child(3)").innerHTML;
}
async function newWord(){
    fetch(`http://${endpoint}:${port}/api/getpossiblevalues`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            guess: word,
            score: score
        })
    })
    .then(response => response.json())
    .then(data => {
        word = data.result;
        console.log(data.result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

async function solveSemantle(){
    while(true){
        await makeGuess();
        await newWord();
        if (score == 100.00){
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
        await solveSemantle();
    }

    console.log("DONE SEMANTLE");
});
  
  
  