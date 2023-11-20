function openTabAndStoreToken() {
  const stagingURL = 'https://staging.student.kccitm.in'; // Staging URL
  const newTabProperties = { url: stagingURL, active: true };

  chrome.tabs.create(newTabProperties, (newTab) => {
    console.log('Opened a new tab for staging:', newTab);
    
    // Check if the URL matches the complete staging URL
    if (newTab.url === stagingURL) {
      chrome.tabs.executeScript(newTab.id, {
        code: `
          if (window.location.host === 'staging.student.kccitm.in') {
            chrome.runtime.sendMessage({
              closeWebPage: true,
              isSuccess: true,
              data: localStorage.getItem('kt-auth-react-v')
            });
          }
        `,
        runAt: 'document_idle' // Execute when the page is fully loaded
      });
    }
  });
}

// Call the function to open the tab and retrieve/store the token
openTabAndStoreToken();
