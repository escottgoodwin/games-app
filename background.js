const firebaseConfig = {
  apiKey: "AIzaSyDgi2AES0HjCr2Yp6QUQJzMRWHJJi1G3m8",
  authDomain: "langolearn.firebaseapp.com",
  databaseURL: "https://langolearn.firebaseio.com",
  projectId: "langolearn",
  storageBucket: "langolearn.appspot.com",
  messagingSenderId: "479598553703",
  appId: "1:479598553703:web:accbe4400543be3c7402c2",
  measurementId: "G-0FPYD5P3FF"
};
firebase.initializeApp(firebaseConfig);
const functions = firebase.functions();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  if (request.type === 'add-link'){
    addLinkLive(request)
  }
  
  if (request.type === 'translate'){
    translateLive(request)
  }

  if (request.type === "auth-token"){
    backgroundFBAuth(request.token);
  }

  if (request.type === "sign-out"){
    logoutFBAuth(request.uid);
  }

  if (request.type === "cluster-choice"){
    setClusters(request);
  }

  function setClusters(data){
    const clusterchoices = data.clusterchoices;
    chrome.storage.sync.set({ "clusterchoices" : clusterchoices }, function() {
      if (chrome.runtime.error) {
        console.log("Runtime error.");
      }
    });
  }

  function addLinkLive(request){
    const linkData = {
      lang: request.cluster_lang, 
      orig_lang: request.orig_lang, 
      uid: request.uid, 
      cluster_id: request.cluster_id,
      url: request.url,
    }

    var newClusterLink = functions.httpsCallable('newClusterLink');
    newClusterLink(linkData)
    .then((response) => {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          "message": "link_added",
          "success_msg": "Langa Learn link added!",
        });
      });
    })
    .catch(function(error) {
      console.log(error);
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {"message": "error"});
      }); 
    });
  }

  function translateLive(request){
    const user = firebase.auth().currentUser;
  
    let word = request.word;
    let orig_lang = request.orig_lang;
    let uid = user.uid;
  
    if (uid){  
  
      const data = {
        "orig_lang": orig_lang, 
        "orig_text": word, 
        "uid": uid, 
        "art_id": "none",
      };
  
      var translateTextCR = functions.httpsCallable('translateTextExtOC');
        translateTextCR(data)
        .then((response) => {
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const transResponse = {
              "message": "replace", 
              "find": word, 
              "replace": response.data["trans_text"],
            }
            chrome.tabs.sendMessage(tabs[0].id, transResponse);
          });
        })
        .catch(function(error) {
          console.log(error);
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {"message": "error"});
          }); 
        });
    } else {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {"message": "error"});
      }); 
    }
  }

  function backgroundFBAuth(token){
    firebase
    .auth()
    .signInWithCustomToken(token)
    .catch((error) => {
      console.log('error', error)
    })
  }

  function logoutFBAuth(uid){
    const user = firebase.auth().currentUser;
    if (user.uid === uid){
      firebase.auth().signOut();
      chrome.storage.sync.set({ "clusterchoices" : "" }, function() {
        if (chrome.runtime.error) {
          console.log("Runtime error.");
        }
      });
    }
  }
});

chrome.browserAction.onClicked.addListener(function (t) {
  console.log(t)
});

chrome.contextMenus.create({
  "title": "Langa Learn Translate",
  "contexts": ["page", "selection", "image", "link"],
  "onclick" : function(e) {
    if (e) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          "message": "translate-menu", 
          "transWord": e.selectionText,
        });
      });
    }
  }
});












