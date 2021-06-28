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

let uid;

function initApp() {
  const userEmail =  document.getElementById('user-email');
  const transBtn = document.getElementById('translate-btn');
  const transContainer = document.getElementById('translation-container')
  const signInMsg = document.getElementById('sign-in-msg');
  const clusterContainer = document.getElementById('cluster-container');
  const clusterBtn = document.getElementById('cluster-btn'); 

  firebase.auth().onAuthStateChanged(async function(user) {
    if (user) {
      userEmail.textContent = `${user.email}`;
      transBtn.style.display = "";
      transContainer.style.display = "";
      signInMsg.textContent = 'Logout'
      uid = firebase.auth().currentUser.uid;
      clusterContainer.style.display = "";
      openClusters();
  } else {
      userEmail.textContent = '';
      transBtn.style.display = "none";
      transContainer.style.display = "none";
      clusterContainer.style.display = "none";
      signInMsg.textContent = 'Login'
      uid = null;
    }
  });

  transBtn.addEventListener('click', sendTranslation);
  document.getElementById('add-cluster-btn').addEventListener('click', sendNewLink);
}

function openClusters(){
  chrome.storage.sync.get(["clusterchoices"], function(result) {
    if (chrome.runtime.error) {
      document.getElementById('choose-cluster').outerHTML = '<div style="color: red;">Error getting clusters</div>'
      return
    }
    document.getElementById('choose-cluster').innerHTML = result.clusterchoices;
  });
  return
}

function sendTranslation(){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {"message": "translate", "uid": uid});
  });
}

function sendNewLink(){
  const choice = document.getElementById("choose-cluster").value;
  const choices = choice.split('-');
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const sendData = {
      "message": "new-link", 
      "uid": uid,
      "tab": tabs[0], 
      "cluster_id": choices[0],
      "cluster_lang": choices[1],
    };
    chrome.tabs.sendMessage(tabs[0].id, sendData);
  });
}
  
/**
 * Start the auth flow and authorizes to Firebase.
 * @param {boolean} interactive True if the OAuth flow should request with an interactive mode.
 */
function startAuth(interactive) {
  chrome.identity.getAuthToken({interactive: !!interactive}, function(token) {
    if (chrome.runtime.lastError && !interactive) {
      console.log('It was not possible to get a token programmatically.');
    } else if(chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else if (token) {
      var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
      firebase.auth().signInWithCredential(credential).catch(function(error) {
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