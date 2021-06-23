// some global variables
let find = "";
let replace = "";

function detectLanguage() {
  const docText = document.body.innerText;
  chrome.i18n.detectLanguage(docText.slice(0,500), function(result) {
    var outputLang = "";
    var outputPercent = "";
    for(i = 0; i < result.languages.length; i++) {
      outputLang += result.languages[i].language + " ";
      outputPercent +=result.languages[i].percentage + " ";
    }
    return outputLang;
  });
}

// listen for any "messages"
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  if (request.message === "translate") {
      // get the highlighted text on the web page (content)
      const word = window.getSelection().toString();
      if (word.length > 0) {
        const docText = document.body.innerText.slice(0,500);
        chrome.i18n.detectLanguage(docText, function(result) {
          var outputLang = "";
          for(i = 0; i < result.languages.length; i++) {
            outputLang += result.languages[i].language;
          }
          chrome.runtime.sendMessage({"word": word, "uid": request.uid, "orig_lang": outputLang});
        });
      } else {
          alert('Please select some text to translate.')
      }

    } else if (request.message === "replace") {
      // get the "find" (actual word) and "replace" (translatedText)
      find = request.find;
      replace = request.replace;
      console.log(replace);
      // replaceText function to replace all instances of "find" word with the "replace" word
      replaceText(document.body);
      
    } else if (request.message === "error") {å
      // just console log it
      console.log(request.error);
      console.log("Sorry some error happened :(");
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