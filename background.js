const config = {
    apiKey: "AIzaSyDgi2AES0HjCr2Yp6QUQJzMRWHJJi1G3m8",
    databaseURL: "https://langolearn.firebaseio.com",
    storageBucket: "langolearn.appspot.com",
  };
firebase.initializeApp(config);
var functions = firebase.functions();

function clusterSelects({cluster_id, clusterName, lang}){
  return `<option value="${cluster_id}-${lang}">${clusterName} - ${lang}</option>`
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  if (request.type === 'add-link'){

    const linkData = {
      lang: request.cluster_lang, 
      orig_lang: request.orig_lang, 
      uid: request.uid, 
      cluster_id: request.cluster_id,
      url: request.url,
    }

    console.log(linkData);

    // const addLinkurl = `https://878adb7ff6c9.ngrok.io/langolearn/us-central1/newUserLink2`;
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

    // var newUserLink1 = functions.httpsCallable('newUserLink1');
    // newUserLink1(linkData)
    // .then((data) => {
    //   console.log(data);
    //   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //     chrome.tabs.sendMessage(tabs[0].id, {
    //       "message": "link_added",
    //       "success_msg": "Langa Learn link added!",
    //     });
    //   });
    // })
    // .catch(function(error) {
    //   console.log(error);
    //   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //     chrome.tabs.sendMessage(tabs[0].id, {"message": "error"});
    //   }); 
    // });
    
  }
  
  if (request.type === 'translate'){
      let word = request.word;
      let orig_lang = request.orig_lang;
      let uid = request.uid;
  
      const langaurl = `https://us-central1-langolearn.cloudfunctions.net/translateTextExt`;
      // const url = 'https://ba7023025c4c.ngrok.io/langolearn/us-central1/translateTextExt';
    
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

    // var translateTextCR = functions.httpsCallable('translateTextCR');
    // translateTextCR(data)
    // .then((result) => {
    //   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //     chrome.tabs.sendMessage(tabs[0].id, {
    //       "message": "replace", 
    //       "find": word, 
    //       "replace": data["trans_text"],
    //     });
    //   });

    // })
    // .catch(function(error) {
    //   console.log(error);
    //   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //     chrome.tabs.sendMessage(tabs[0].id, {"message": "error"});
    //   }); 
    // });
  }

  if (request.message === "cluster") {
    const langaurl = `https://us-central1-langolearn.cloudfunctions.net/getClusters`;

    let uid = request.uid;

    fetch(langaurl, {
      method: "post",
      headers: {"content-type": "application/json"},
      body: JSON.stringify({uid}),
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      const clusterChoices = data.map(c => clusterSelects(c)).join('');
      sendResponse(clusterChoices);
    })
    .catch(function(error) {
      console.log(error);
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {"message": "error"});
      }); 
    });

    // var getClusters = functions.httpsCallable('getClusters1');

    // getClusters({uid})
    // .then((data) => {
    //   const clusterChoices = data.map(c => clusterSelects(c)).join('');
    //   sendResponse(clusterChoices);
    // })
    // .catch(function(error) {
    //   console.log(error);
    //   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //     chrome.tabs.sendMessage(tabs[0].id, {"message": "error"});
    //   }); 
    // });

    return true;
  }
});
  
