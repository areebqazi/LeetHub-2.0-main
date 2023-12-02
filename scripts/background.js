function handleMessage(request) {
  if (request && request.data) {
    // console.log(JSON.parse(request.data));
    const apiToken = JSON.parse(request.data).api_token;
    chrome.storage.local.set({ kccitm_token: apiToken }, () => {
      console.log('KCCITM API token value stored in chrome.storage.');
    });
  }

  if (request && request.closeWebPage === true && request.isSuccess === true) {
    /* Set username */
    chrome.storage.local.set({ leethub_username: request.username });

    /* Set token */
    chrome.storage.local.set({ leethub_token: request.token });

    /* Close pipe */
    chrome.storage.local.set({ pipe_leethub: false }, () => {
      console.log('Closed pipe.');
    });

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
      var tab = tabs[0];
      chrome.tabs.remove(tab.id);
    });

    /* Go to onboarding for UX */
    const urlOnboarding = chrome.runtime.getURL('welcome.html');
    chrome.tabs.create({ url: urlOnboarding, active: true }); // creates new tab
  } else if (request && request.closeWebPage === true && request.isSuccess === false) {
    alert('Something went wrong while trying to authenticate your profile!');
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
      var tab = tabs[0];
      chrome.tabs.remove(tab.id);
    });
  }

  let kccitmToken = null;
  let githubToken = null;
  chrome.storage.local.get(['kccitm_token', 'leethub_token'], result => {
    console.log(result);
    kccitmToken = result.kccitm_token;
    githubToken = result.leethub_token;
    console.log('API Token:', kccitmToken);
    console.log('Token:', githubToken);
  });
}

chrome.runtime.onMessage.addListener(handleMessage);
