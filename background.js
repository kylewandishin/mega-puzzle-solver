// let possible = []
// let word = "apple"
// let score;

// let endpoint = "10.203.188.63"
// let port = "8080"

// async function newWord(){
//   console.log("in new word")
//   setTimeout(async () => {
//   try {
//       let response = await fetch(`http://${endpoint}:${port}/api/getpossiblevalues`, {
//           method: 'POST',
//           mode: 'no-cors',
//           credentials: 'include',
//           headers: {
//               'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//               guess: word,
//               score: score,
//               possible: possible
//           })
//       });
//       let data = await response.json();
//       console.log(data);
//       possible = data.possible;
//       word = possible[0];
      
//   } catch (error) {
//       console.error('Error:', error);
//       breaker = true
//   }
//   },15000);
// }

chrome.tabs.onUpdated.addListener( (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes("nytimes")) {
    console.log(tab.url);
    if (tab.url.includes("letter-boxed")){
      chrome.tabs.sendMessage(tabId, {
        type: "letter-boxed"
      });
    }else if (tab.url.includes("wordle")){
      chrome.tabs.sendMessage(tabId, {
        type: "wordle"
      });
    }else if (tab.url.includes("connections")){
      chrome.tabs.sendMessage(tabId, {
        type: "connections"
      });
    }
    console.log("SENT"); 
  } else if (tab.url.includes("semantle")) {
    chrome.tabs.sendMessage(tabId, {
      type: "semantle"
    });
  }
});
chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse){
  console.log("here")
  // if (message.type == "apiGuess"){
  //   score = message.score
  //   word = message.word
  //   possible = message.possible
  //   await newWord()
  // }
  sendResponse({received:true});
  return true;
});
// console.log("hai :3")
// console.log(document)
// document.getElementById("sendButton").addEventListener("click", function() {
//   // Send a message to content.js to trigger the function
//   console.log("button pressed");
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, {action: 'autoSolve'});
//   });
// });
