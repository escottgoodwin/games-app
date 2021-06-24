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
  
function initApp() {
  const qsBtn = document.getElementById('quickstart-button');
  const userEmail =  document.getElementById('user-email');
  const transBtn = document.getElementById('translate-btn');
  const transContainer = document.getElementById('translation-container')
  const clusterContainer = document.getElementById('cluster-container');
  
  firebase.auth().onAuthStateChanged(async function(user) {
    if (user) {
      qsBtn.textContent = 'Sign out';
      userEmail.textContent = `${user.email}`;
      transBtn.style.display = "";
      transContainer.style.display = "";
  } else {
      qsBtn.textContent = 'Sign-in with Google';
      userEmail.textContent = '';
      transBtn.style.display = "none";
      transContainer.style.display = "none";
    }
    clusterContainer.style.display = "none"
    qsBtn.disabled = false;
  });

    document.getElementById('quickstart-button').addEventListener('click', startSignIn, false);

    document.getElementById('translate-btn').addEventListener('click', sendTranslation);

    document.getElementById('cluster-btn').addEventListener('click', openClusters);

    document.getElementById('cluster-close').addEventListener('click', closeClusters);

    document.getElementById('add-cluster-btn').addEventListener('click', addClusterLink);

  }

function openClusters(){
  // const uid = firebase.auth().currentUser.uid;
  const uid = "3736ENQJEUavLjKX8ufPf5zfKl62";
  chrome.runtime.sendMessage({"message": "cluster", "uid": uid}, async function (response) {
    document.getElementById('choose-cluster').innerHTML = response;
    document.getElementById('cluster-container').style.display = "";
  });
}
function addClusterLink(){
  // const uid = firebase.auth().currentUser.uid;
  const choice = document.getElementById("choose-cluster").value;
  const choices = choice.split('-');
  const uid = "3736ENQJEUavLjKX8ufPf5zfKl62";

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const linkData = {
      "message": "add_cluster_link", 
      "uid": uid, 
      "tab": tabs[0], 
      "cluster_id": choices[0], 
      "lang": choices[1]
    };
    chrome.runtime.sendMessage(linkData, async function (response) {
      console.log(response);
    });  
  });
}

function closeClusters(){
  document.getElementById('cluster-container').style.display = "none";
  return;
}

function sendTranslation(){
  const uid = firebase.auth().currentUser.uid;
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