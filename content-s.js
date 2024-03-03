let endpoint = "10.203.188.63";
let port = "8080";

let word = `apple`;
let score = `8.82`;
let possible= [];
let breaker = false;

async function makeGuess(){
    document.querySelector("#guess").value = word;
    document.querySelector("#guess-btn").click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    score = document.querySelector("#guesses > tbody > tr:nth-child(2) > td:nth-child(3)").innerHTML;
}

async function newWord(){
    console.log("in new word");
    console.log(word, score, possible)
    try {
        let response = await fetch(`http://${endpoint}:${port}/api/getpossiblevalues`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "guess": word,
                "score": score,
                "possible": possible
            })
        });
        let data = await response.json();
        console.log(data);
        possible = data.possible;
        word = possible[0];
        
    } catch (error) {
        console.error('Error:', error);
        breaker = true;
    }
}

async function solveSemantle(){
    while(true){
        await makeGuess();
        console.log(score);
        await newWord();
        console.log(word);
        console.log("iteration");
        if (parseFloat(score) === 100.00 || breaker){
            break;
        }
        // Wait for 15 seconds before making the next guess
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
}

chrome.runtime.onMessage.addListener( async (message, sender, sendResponse) => {
    console.log("RECEIVED SEMANTLE");
    // await message
    if (message.type === "semantle"){
        chrome.storage.local.set({ gameData : "apple" }, function() {
            console.log('best guess stored');
        });
    }
    if (message.action === "autoSolve"){
        console.log("begin solve")
        await solveSemantle();
    }

    console.log("DONE SEMANTLE");
});
  
  
  