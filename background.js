// const config = {
//     apiKey: "AIzaSyDgi2AES0HjCr2Yp6QUQJzMRWHJJi1G3m8",
//     databaseURL: "https://langolearn.firebaseio.com",
//     storageBucket: "langolearn.appspot.com",
//   };
//  firebase.initializeApp(config);
//  var functions = firebase.functions();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
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
    console.log(data);

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

    fetch(langaurl, {
        method: "post",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(data),
      })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log('returned data');
      console.log(data);
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {"message": "replace", "find": word, "replace": data["trans_text"]});
      });
    })
    .catch(function(error) {
      // if some error happened
      console.log(error);
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {"message": "error"});
      }); 
    });
   });
  
