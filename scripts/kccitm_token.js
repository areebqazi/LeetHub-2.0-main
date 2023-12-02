const dataFromLocalStorage = localStorage.getItem('kt-auth-react-v');
// console.log(dataFromLocalStorage)     
chrome.runtime.sendMessage({ data: dataFromLocalStorage });




  

   