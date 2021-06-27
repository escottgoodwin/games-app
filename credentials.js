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
  const clusterBtn = document.getElementById('cluster-btn');
  const transContainer = document.getElementById('translation-container')
  const clusterContainer = document.getElementById('cluster-container');
  const signInMsg = document.getElementById('sign-in-msg');

  firebase.auth().onAuthStateChanged(async function(user) {
    if (user) {
      userEmail.textContent = `${user.email}`;
      transBtn.style.display = "";
      transContainer.style.display = "";
      clusterBtn.style.display = "";
      signInMsg.textContent = 'Logout'
      uid = firebase.auth().currentUser.uid;
  } else {
      userEmail.textContent = '';
      transBtn.style.display = "none";
      transContainer.style.display = "none";
      clusterBtn.style.display = "none";
      signInMsg.textContent = 'Login'
      uid = null;
    }
    clusterContainer.style.display = "none"
  });

    transBtn.addEventListener('click', sendTranslation);

    document.getElementById('cluster-btn').addEventListener('click', openClusters);

    document.getElementById('cluster-close').addEventListener('click', closeClusters);

    document.getElementById('add-cluster-btn').addEventListener('click', sendNewLink);

}

function openClusters(){
  chrome.runtime.sendMessage({"message": "cluster", "uid": uid}, async function (response) {
    document.getElementById('choose-cluster').innerHTML = response;
    document.getElementById('cluster-container').style.display = "";
  });
}

function closeClusters(){
  document.getElementById('cluster-container').style.display = "none";
  return;
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
 * @param{boolean} interactive True if the OAuth flow should request with an interactive mode.
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