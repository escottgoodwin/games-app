let find = "";
let replace = "";

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  
  if (request.message === "translate") {
    const word = window.getSelection().toString();
    translateSelection(request, word);
  } else if (request.message === "translate-menu") {
    const word = request.transWord
    translateSelection(request, word);
  } else if (request.message === "replace") {
      find = request.find;
      replace = request.replace;
      replaceText(document.body,);
  } else if (request.message === "error") {
    alert('Langa Learn Error!');
    console.log(request.error);
  } else if (request.message === "new-link") {
    addLink(request)
  } else if (request.message === "link_added") {
    alert(request.success_msg);
  } else if (request.message === "auth-token") {
    chrome.runtime.sendMessage({
      "type": "auth-token", 
      "token": request.token,
    });
  } else {
    console.log('no route');
  }
});

  window.addEventListener("message", function(event) {

    if (event.source != window)
        return;

    if (event.data.type && (event.data.type == "auth-token")) {
        chrome.runtime.sendMessage({
          "type": "auth-token", 
          "token": event.data.token,
        });
      }
    
    if (event.data.type && (event.data.type == "sign-out")) {
      const uid = event.data.uid;
      chrome.runtime.sendMessage({
        "type": "sign-out", 
        "uid": uid,
      });
    }

    if (event.data.type && (event.data.type == "cluster-choice")) {
      chrome.runtime.sendMessage(event.data);
    }
  });

  function translateSelection(request, word){
    if (word.length > 0) {

      const docText = document.body.innerText.slice(0,500);

      chrome.i18n.detectLanguage(docText, function(result) {
        var outputLang = "";
        for(i = 0; i < result.languages.length; i++) {
          outputLang += result.languages[i].language;
        }
        chrome.runtime.sendMessage({
          "type": "translate", 
          "word": word, 
          "uid": request.uid, 
          "orig_lang": outputLang,
        });
      });
    } else {
        alert('Please select some text to translate.')
    }
  }

  function addLink(request){
    let url = request.tab.url;
    let cluster_id = request.cluster_id;
    let uid = request.uid;
    let cluster_lang = request.cluster_lang;

    const docText = document.body.innerText.slice(0,500);

    chrome.i18n.detectLanguage(docText, function(result) {
      var outputLang = "";
      for(i = 0; i < result.languages.length; i++) {
        outputLang += result.languages[i].language;
      }

      const sendData = {
        "type": "add-link", 
        "uid": uid, 
        "orig_lang": outputLang,
        "url": url, 
        "cluster_id": cluster_id,
        "cluster_lang": cluster_lang,
      };

      if(outputLang.length>0){
        chrome.runtime.sendMessage(sendData);
      }
    });
  }
  
  function replaceText(element) {
    if (element.hasChildNodes()) {
      element.childNodes.forEach(replaceText);
    } else {
      const re = new RegExp(find, "gi");
      const translation = `${find} (${replace}) `
      element.textContent = element.textContent.replace(re, translation);
    }
  }