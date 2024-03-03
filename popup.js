document.addEventListener('DOMContentLoaded', function() {
console.log(document.getElementById("solution"))
let simplified = [];
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  if (tabs && tabs[0] && tabs[0].url.includes("connections")) {
    document.getElementById("autoSolve").disabled = true;
    document.getElementById("autoSolve").style.opacity = 0
    chrome.storage.local.get(['gameData'], function(result) {
      var gameData = result.gameData;
      console.log(gameData);
      let element = document.getElementById('solution');
      simplified = [];
      if (element) {
        // Assuming 'array' is the array you want to populate the element with
        let i=0;
        gameData.forEach(item => {
          // Create a new div element for each item
          i+=1;
          let div = document.createElement('div');
          let row = item.cards.map(card => card.content)
          simplified.push(row)
          div.className = `connections-styling c${i}`;
          div.innerHTML = `<div class="c-title">${item.title}:</div><div>${row.join(', ')}</div>`;
          
          element.appendChild(div);
        });
      }
    });
  } else {
    document.getElementById("autoSolve").disabled = false;
    chrome.storage.local.get(['gameData'], function(result) {
      var gameData = result.gameData;
      document.getElementById('solution').innerHTML = "";
      document.getElementById('solution').innerText = gameData;
    });
  }
});
// Listen for the autoSolve button click
document.getElementById("autoSolve").addEventListener("click", function() {
  // Send a message to content.js to trigger the function
  console.log("button pressed");
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
    let url = tabs[0].url.toString();
    console.log(url);
    if(url.includes("letter-boxed")){
      chrome.tabs.sendMessage(tabs[0].id, {action: 'autoSolve', type: "letter-boxed", payload: document.getElementById("solution").innerHTML});
    }else if (url.includes("wordle")){
      chrome.tabs.sendMessage(tabs[0].id, {action: 'autoSolve', type: "wordle"})
    }else if (url.includes("connections")){
      chrome.tabs.sendMessage(tabs[0].id, {action: 'autoSolve', type: "connections", payload: simplified})
    }else if (url.includes("semantle")){
      chrome.tabs.sendMessage(tabs[0].id, {action: 'autoSolve', type: "semantle"})
    }


  });
});
});