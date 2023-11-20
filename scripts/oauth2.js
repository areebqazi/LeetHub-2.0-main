// eslint-disable-next-line no-unused-vars
const oAuth2 = {
  /**
   * Initialize
   */
  init() {
    this.KEY = 'leethub_token';
    this.ACCESS_TOKEN_URL =
      'https://github.com/login/oauth/access_token';
    this.AUTHORIZATION_URL =
      'https://github.com/login/oauth/authorize';
    this.CLIENT_ID = '0114dd35b156d4729fac';
    this.CLIENT_SECRET = 'cfc3301d9745530bf1b31e92528ad9c31fd3f995';
    this.REDIRECT_URL = 'https://github.com/'; // for example, https://github.com
    this.SCOPES = ['repo'];
  },

  /**
   * Begin
   */
  begin() {
    this.init(); // secure token params.

    let url = `${this.AUTHORIZATION_URL}?client_id=${this.CLIENT_ID}&redirect_uri${this.REDIRECT_URL}&scope=`;

    for (let i = 0; i < this.SCOPES.length; i += 1) {
      url += this.SCOPES[i];
    }

    // chrome.storage.local.set({ pipe_kccitm: true }, () => {
    
    //   chrome.tabs.create({ url: 'https://staging.student.kccitm.in', active: true },
    //   (stagingTab) => {
    //     // Execute code inside the staging website tab to extract the token
    //     const codeToExecute = `
    //       const tokenData = localStorage.getItem('kt-auth-react-v');
    //       if (tokenData) {
    //         const { api_token: accessToken } = JSON.parse(tokenData);
    //         chrome.runtime.sendMessage({ token: accessToken });
    //       }
    //     `;

    //     // Inject code into the staging website tab
    //     chrome.scripting.executeScript({
    //       target: { tabId: stagingTab.id },
    //       func: () => { eval(${JSON.stringify(codeToExecute)}); },
    //     });
        
    //   }
    //   );
    //   });


    chrome.storage.local.set({ pipe_leethub: true }, () => {
      // opening pipe temporarily, redirects to github
      chrome.tabs.create({ url, active: true }, function () {});
    });
  },
};
