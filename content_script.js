// some global variables
let find = "";
let replace = "";

// listen for any "messages"
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === "translate") {
      const word = window.getSelection().toString();
      
      if (word.length > 0) {

        const docText = document.body.innerText.slice(0,500);

        chrome.i18n.detectLanguage(docText, function(result) {
          var outputLang = "";
          for(i = 0; i < result.languages.length; i++) {
            outputLang += result.languages[i].language;
          }
          chrome.runtime.sendMessage({"type": "translate", "word": word, "uid": request.uid, "orig_lang": outputLang});
        });
      } else {
          alert('Please select some text to translate.')
      }
    } else if (request.message === "replace") {
      // get the "find" (actual word) and "replace" (translatedText)
      find = request.find;
      replace = request.replace;
      // replaceText function to replace all instances of "find" word with the "replace" word
      replaceText(document.body);
    } else if (request.message === "error") {
      console.log(request.error);
      console.log("Sorry some error happened :(");

    } else if (request.message === "new-link") {

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
        console.log(sendData);

        if(outputLang.length>0){
          chrome.runtime.sendMessage(sendData);
        }
      });
    } else if (request.message === "link_added") {
      console.log(request.success_msg);
      alert(request.success_msg);
    } else {
      console.log('no route');
    }
  });
  
  // replaceText function definition
  function replaceText(element) {
    if (element.hasChildNodes()) {
      // if our root element has childNodes, then for each childNode, repeat this function
      element.childNodes.forEach(replaceText);
    } else {
      // make a regular expression
      const re = new RegExp(find, "gi");
      // then replace the word
      const translation = `${find} (${replace}) `
      element.textContent = element.textContent.replace(re, translation);
    }
  }