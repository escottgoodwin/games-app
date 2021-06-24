// const config = {
//     apiKey: "AIzaSyDgi2AES0HjCr2Yp6QUQJzMRWHJJi1G3m8",
//     databaseURL: "https://langolearn.firebaseio.com",
//     storageBucket: "langolearn.appspot.com",
//   };
//  firebase.initializeApp(config);
//  var functions = firebase.functions();

function clusterSelects({cluster_id, clusterName, lang}){
  return `<option value="${cluster_id}-${lang}">${clusterName} - ${lang}</option>`
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  
  if (request.type === 'translate'){

      let word = request.word;
      let uid = request.uid;
      let orig_lang = request.orig_lang;

      const langaurl = `https://us-central1-langolearn.cloudfunctions.net/translateTextExt`;
      // const url = 'https://ba7023025c4c.ngrok.io/langolearn/us-central1/translateTextExt';
      
      const data = {
        orig_lang: orig_lang, 
        orig_text: word, 
        uid: uid, 
        art_id:"asdf",
      }

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
          chrome.tabs.sendMessage(tabs[0].id, {"message": "replace", "find": word, "replace": data["trans_text"]});
        });
      })
      .catch(function(error) {
        console.log(error);
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {"message": "error"});
        }); 
      });
  }

  if (request.message === "cluster") {
    const langaurl = `https://878adb7ff6c9.ngrok.io/langolearn/us-central1/getClusters`;

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
    return true;
  }

  if (request.message === "add_cluster_link") {
    const langaurl = `https://878adb7ff6c9.ngrok.io/langolearn/us-central1/newUserLink2`;

    let uid = request.uid;
    let url = request.tab.url;
    let cluster_id = request.cluster_id;
    let lang = request.lang;

    const linkData = {
      uid,
      url,
      cluster_id,
      lang,
    }

    console.log(linkData);
    // fetch(langaurl, {
    //   method: "post",
    //   headers: {"content-type": "application/json"},
    //   body: JSON.stringify(linkData),
    // })
    // .then(function(response) {
    //   return response.json();
    // })
    // .then(function(data) {
    //   sendResponse(data);
    // })
    // .catch(function(error) {
    //   console.log(error);
    //   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //     chrome.tabs.sendMessage(tabs[0].id, {"message": "error"});
    //   }); 
    // });
    return true;
  }

    // var translateTextCR = functions.httpsCallable('translateTextCR');
    // translateTextCR({  
    //     orig_text: word,
    //     orig_lang: orig_lang,
    //     trans_lang: trans_lang,
    //     art_id:''
    // })
    // .then((result) => {

    //     const translatedText = result.data.trans_text;
    //     console.log(result.data);
    //     console.log(translatedText);
    //     // again activate content_script.js and pass a message with "translatedText" and actual "word".
    //     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //       chrome.tabs.sendMessage(tabs[0].id, {"message": "replace", "find": word, "replace": translatedText});
    //     });
    //   })
    //   .catch(function(error) {
    //     // if some error happened
    //     console.log(error);
    //     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //       chrome.tabs.sendMessage(tabs[0].id, {"message": "error", "error": error});
    //     }); 
    //   });
});
  
