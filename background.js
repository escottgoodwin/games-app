const config = {
  apiKey: "AIzaSyDgi2AES0HjCr2Yp6QUQJzMRWHJJi1G3m8",
  databaseURL: "https://langolearn.firebaseio.com",
  storageBucket: "langolearn.appspot.com",
};
firebase.initializeApp(config);
const functions = firebase.functions();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  if (request.type === 'add-link'){

    addLinkLocal(request);
    // addLinkLive(request)
  }
  
  if (request.type === 'translate'){
    console.log(request);
    translateLocal(request);
    // translateLive(request)
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
    const user = firebase.auth().currentUser;
    if (user) {
      const clusterchoices = data.clusterchoices;
      chrome.storage.sync.set({ "clusterchoices" : clusterchoices }, function() {
        if (chrome.runtime.error) {
          console.log("Runtime error.");
        }
      });
    }
  }

  function addLinkLocal(request){
    const user = firebase.auth().currentUser;
  
    if (request.uid === user.uid){
      const linkData = {
        lang: request.cluster_lang, 
        orig_lang: request.orig_lang, 
        uid: request.uid, 
        cluster_id: request.cluster_id,
        url: request.url,
      }
  
      const addLinkurl = 'https://us-central1-langolearn.cloudfunctions.net/newUserLink2';
  
      fetch(addLinkurl, {
        method: "post",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(linkData),
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
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
    } else {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {"message": "error"});
      }); 
    }
  }

  function addLinkLive(request){

    const user = firebase.auth().currentUser;
  
    if (request.uid === user.uid){  
  
      const linkData = {
        lang: request.cluster_lang, 
        orig_lang: request.orig_lang, 
        uid: request.uid, 
        cluster_id: request.cluster_id,
        url: request.url,
      }
  
      var newUserLink1 = functions.httpsCallable('newUserLink1');
      newUserLink1(linkData)
      .then((data) => {
        console.log(data);
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
    } else {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {"message": "error"});
      }); 
    }
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
  
      var translateTextCR = functions.httpsCallable('translateTextCR');
        translateTextCR(data)
        .then((data) => {
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
              "message": "replace", 
              "find": word, 
              "replace": data["trans_text"],
            });
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

  function translateLocal(request){
    const user = firebase.auth().currentUser;
    const uid = user.uid;
    let orig_lang = request.orig_lang;
    let word = request.word;
    if (uid){  
  
      const langaurl = `https://us-central1-langolearn.cloudfunctions.net/translateTextExt`;
  
      const data = {
        "orig_lang": orig_lang, 
        "orig_text": word, 
        "uid": uid, 
        "art_id": "none",
      };
  
      fetch(langaurl, {
        method: "post",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(data),
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            "message": "replace", 
            "find": word, 
            "replace": data["trans_text"],
          });
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
        console.log(tabs[0].id);
        chrome.tabs.sendMessage(tabs[0].id, {
          "message": "translate-menu", 
          "transWord": e.selectionText,
        });
      });

    }
  }
});












