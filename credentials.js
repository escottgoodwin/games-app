const config = {
  apiKey: "AIzaSyDgi2AES0HjCr2Yp6QUQJzMRWHJJi1G3m8",
  databaseURL: "https://langolearn.firebaseio.com",
  storageBucket: "langolearn.appspot.com",
};
firebase.initializeApp(config);

let uid;

function initApp() {
  const userEmail =  document.getElementById('user-email');
  const transBtn = document.getElementById('translate-btn');
  const transContainer = document.getElementById('translation-container')
  const signInMsg = document.getElementById('sign-in-msg');
  const clusterContainer = document.getElementById('cluster-container');
  const clusterBtn = document.getElementById('add-cluster-btn');

  firebase.auth().onAuthStateChanged(async function(user) {
    if (user) {
      userEmail.textContent = `${user.email}`;
      transBtn.style.display = "";
      transContainer.style.display = "";
      signInMsg.textContent = 'Logout'
      uid = firebase.auth().currentUser.uid;
      clusterContainer.style.display = "";
      setClusters();
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
  clusterBtn.addEventListener('click', sendNewLink);
}

function setClusters(){
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
  
window.onload = function() {
  initApp();
};