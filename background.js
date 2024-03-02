chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
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
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse){
  console.log("here")
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
