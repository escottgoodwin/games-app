// TODO(DEVELOPER): Change the values below using values from the initialization snippet: Firebase Console > Overview > Add Firebase to your web app.
// Initialize Firebase
const config = {
    apiKey: "AIzaSyDgi2AES0HjCr2Yp6QUQJzMRWHJJi1G3m8",
    databaseURL: "https://langolearn.firebaseio.com",
    storageBucket: "langolearn.appspot.com",
  };
  firebase.initializeApp(config);

function getLanguage(lang){
    switch(lang){
        case 'en':
            return 'English';
        case 'fr':
            return 'French';
        case 'es':
            return 'Spanish';
        case 'de':
            return 'German';
    }
}

function detectLanguage(inputText) {
  chrome.i18n.detectLanguage(inputText, function(result) {
    var outputLang = "";
    var outputPercent = "";
    for(i = 0; i < result.languages.length; i++) {
      outputLang += result.languages[i].language + " ";
      outputPercent +=result.languages[i].percentage + " ";
    }
    document.getElementById("orig_lang").innerHTML = outputLang;
  });
}

  
function initApp() {
  // Listen for auth state changes.

  firebase.auth().onAuthStateChanged(async function(user) {
    if (user) {
      // User is signed in.
      document.getElementById('quickstart-button').textContent = 'Sign out';
      document.getElementById('user-email').textContent = `${user.email}`;
      document.getElementById('translate-btn').style.display = ""
      document.getElementById('translation-container').style.display = ""

      const url = 'https://us-central1-langolearn.cloudfunctions.net/getUser';
      const data = {uid: user.uid};

      fetch(url, {
        method: "post",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(data),
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        // const langs = data.langs;
        console.log(data);
        // document.getElementById('orig_lang').textContent = langs[0];
        // const selects = langs.map(l => langSelects(l));
        // const langhtml = selects.join('');
        // document.getElementById('choose-lang').innerHTML = langhtml;
      })
      .catch(function(error) {
        // if some error happened
        console.log(error);
      });
  } else {
      // Let's try to get a Google auth token programmatically.
      document.getElementById('quickstart-button').textContent = 'Sign-in with Google';
      document.getElementById('user-email').textContent = '';
      document.getElementById('translate-btn').style.display = "none"
      document.getElementById('translation-container').style.display = "none"

    }
    document.getElementById('quickstart-button').disabled = false;

  });

  
    document.getElementById('quickstart-button').addEventListener('click', startSignIn, false);

    document.getElementById('translate-btn').addEventListener('click', function() {
        const uid = firebase.auth().currentUser.uid;
        sendTranslation(uid);
        return;
      });

    // document.getElementById('choose-lang').addEventListener('change', (event) => {
    //     document.getElementById("orig_lang").textContent = event.target.value;
    // });

    // document.getElementById('change-lang').addEventListener('click', (event) => {
    //     const dropdownDisplay = document.getElementById('lang-choose-container').style.display
    //     if(dropdownDisplay==="none"){
    //         document.getElementById('lang-choose-container').style.display = "";
    //         document.getElementById('change-lang').textContent = 'Close';
    //     } else {
    //         document.getElementById('lang-choose-container').style.display = "none";
    //         document.getElementById('change-lang').textContent = 'Change';

    //     }
    // });
  
  }

function langSelects(lang){
  return `<option value="${lang}">${lang}</option>`
}

function sendTranslation(uid){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {"message": "translate", "uid": uid});
  });
}
  
  /**
   * Start the auth flow and authorizes to Firebase.
   * @param{boolean} interactive True if the OAuth flow should request with an interactive mode.
   */
function startAuth(interactive) {
    // Request an OAuth token from the Chrome Identity API.
  chrome.identity.getAuthToken({interactive: !!interactive}, function(token) {
    if (chrome.runtime.lastError && !interactive) {
      console.log('It was not possible to get a token programmatically.');
    } else if(chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else if (token) {
      // Authorize Firebase with the OAuth Access Token.
      var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
      firebase.auth().signInWithCredential(credential).catch(function(error) {
        // The OAuth token might have been invalidated. Lets' remove it from cache.
        if (error.code === 'auth/invalid-credential') {
          chrome.identity.removeCachedAuthToken({token: token}, function() {
            startAuth(interactive);
          });
        }
      });
    } else {
      console.error('The OAuth Token was null');
    }
  });
}

  
  
  /**
   * Starts the sign-in process.
   */
  function startSignIn() {
    document.getElementById('quickstart-button').disabled = true;
    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
    } else {
      startAuth(true);
    }
  }
  
  window.onload = function() {
    initApp();
  };