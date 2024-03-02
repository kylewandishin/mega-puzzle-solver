let yummyGameData;
let wordle
function simulateClickOnElement(element) {
  var rect = element.getBoundingClientRect();
  var x = rect.left + rect.width / 2;
  var y = rect.top + rect.height / 2;

  chrome.debugger.attach({ tabId: chrome.devtools.inspectedWindow.tabId }, "1.2", function() {
      chrome.debugger.sendCommand({ tabId: chrome.devtools.inspectedWindow.tabId }, "Input.dispatchMouseEvent", {
          type: "mousePressed",
          button: "left",
          x: x,
          y: y,
          clickCount: 1
      });
  });
}

function solveConnections(arr){
  console.log("in solve",arr, arr.length)
  for (let i = 0; i < arr.length; i++){
    for (let j = 0; j < arr[i].length; j++){
      for (let k = 0; k < 16; k++){
        var element = document.querySelector(`#inner-card-${k}`);
        if (arr[i][j] == element.value){
          simulateClickOnElement(element);
          break;
        }
      }
    }
  }
}

async function getWordleSolution(){
  // Generate today's date in the format YYYY-MM-DD
  let today = new Date();
  let formattedDate = today.toISOString().slice(0, 10);

  // Construct the API URL with the generated date
  let apiUrl = `https://www.nytimes.com/svc/wordle/v2/${formattedDate}.json`;
  
  try {
    // Make a fetch request to the API
    let response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    let data = await response.json();
    wordle = data.solution;
    console.log(wordle);
    // Handle the response data here
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
  
  return wordle;
}

async function getConnectionsSolution(){
  // Generate today's date in the format YYYY-MM-DD
  let today = new Date();
  let formattedDate = today.toISOString().slice(0, 10);

  // Construct the API URL with the generated date
  let apiUrl = `https://www.nytimes.com/svc/connections/v2/${formattedDate}.json`;
  
  try {
    // Make a fetch request to the API
    let response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    let data = await response.json();
    connections = data.categories;
    console.log(connections);
    // Handle the response data here
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
  
  return connections;
}

function injectScript (src) {
  const s = document.createElement('script');
  s.src = chrome.runtime.getURL(src);
  s.onload = () => {
    chrome.runtime.sendMessage({ action: 'getYummyGameData' }, (response) => {
      console.log("received from inject", response, "current state", yummyGameData);
      chrome.runtime.sendMessage({ yummyGameData: yummyGameData }, function(repsonse) {
        console.log("Response:", response);
      });
    });
    s.remove()
  };
  (document.head || document.documentElement).append(s);
}

function simulateKeyboardInput(inputString) {
  console.log("simulating word:", inputString)
  for(var i=0;i<inputString. length;i++){
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: inputString[i],
      code: 'KeyJ',
      keyCode: 74,
      which: 74,
      shiftKey: false, // Change this if you want to simulate pressing shift along with J
      ctrlKey: false,
      altKey: false,
      metaKey: false,
      bubbles: true,
      cancelable: true
    }));
  }
  document.dispatchEvent(new KeyboardEvent('keydown', {
    key: 'Enter',
    code: 'Enter',
    keyCode: 13,
    which: 13,
    shiftKey: false,
    ctrlKey: false,
    altKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
  }));
}


window.addEventListener('message', function(event) {
  if (event.data.type && (event.data.type === 'YUMMY_GAME_DATA')) {
      yummyGameData = event.data.data;
      console.log('Received yummyGameData:', yummyGameData);
      chrome.runtime.sendMessage({ yummyGameData: yummyGameData }, function(repsonse) {
        console.log("Response:", response);
      });
      chrome.storage.local.set({ gameData : yummyGameData.join(" ") }, function() {
        console.log('gameData stored');
      }); 
      console.log("game data sent to background");
    }
});

chrome.runtime.onMessage.addListener( async (message, sender, sendResponse) => {
  console.log("RECEIVED");
  if (message.action === "autoSolve"){
    if (message.type === "letter-boxed"){
      let solvable = message.payload.split(" ");
      simulateKeyboardInput(solvable[0])
      for (let i = 1; i < solvable.length; i++){
        setTimeout(function() {
          simulateKeyboardInput(solvable[i])
        }, 3000);
      }
    }else if (message.type === "wordle"){
      simulateKeyboardInput(wordle);
    }
    else if (message.type === "connections"){
      solveConnections(message.payload);
    }
  }
  else if (message.type === "letter-boxed") {
    console.log("from background.js"); // Keep the message channel open for asynchronous response
    await injectScript('evil.js')
    console.log(yummyGameData)
  }else if (message.type === "wordle"){
    await getWordleSolution(); 
    chrome.storage.local.set({ gameData : wordle }, function() {
      console.log('gameData stored');
    });
    console.log("solution" , wordle);
  }else if (message.type === "connections"){
    await getConnectionsSolution(); 
    chrome.storage.local.set({ gameData : connections }, function() {
      console.log('gameData stored');
    });
    console.log("solution" , connections);
  }
  console.log("DONE");
});


