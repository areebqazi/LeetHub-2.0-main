import axios from 'axios';
import * as cheerio from 'cheerio';

let kccitmToken = null;
let githubToken = null;
chrome.storage.local.get(
  ['kccitm_token', 'leethub_token'],
  (result) => {
    kccitmToken = result.kccitm_token;
    githubToken = result.leethub_token;
    console.log('API Token:', kccitmToken);
    console.log('Token:', githubToken);
  },
);

document.addEventListener('copy', function(e) {
  // Log the copy action
  console.log('Text copied:', window.getSelection().toString());
});

document.addEventListener('paste', function(e) {
  // Log the paste action
  navigator.clipboard.readText()
      .then(text => {
          console.log('Text pasted:', text);
      })
      .catch(err => {
          console.error('Failed to read clipboard contents:', err);
      });
});

// waitResultClick();
// Function to fetch question data
function fetchQuestionData() {
  if (window.location.href.includes('leetcode.com')) {
    // Your existing code for fetching question data here
    // ...
    const xpathExpression =
      '//button[@data-e2e-locator="console-submit-button"]';

    const result = document.evaluate(
      xpathExpression,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    const submitBtn = result.singleNodeValue;
    if (submitBtn) {
      var $ = cheerio.load(
        document.getElementsByTagName('html')[0].innerHTML,
      );

      let related_topics = [];
      let likes = 0;
      let dislikes = 0;
      let accepted = 0;
      let submissions = 0;
      let acceptance_rate = 0;
      const elements = [];

      let difficulty = '';
      if ($('.bg-olive').text() != '') {
        difficulty = 'Easy';
      }
      if ($('.bg-yellow').text() != '') {
        difficulty = 'Medium';
      }
      if ($('.bg-red').text() != '') {
        difficulty = 'Hard';
      }
      const title = $('.mr-2').text();

      const userId =[];
      $('a').each ((index,element) => {
        userId.push($(element).text());
      });

      // const userId = $('a.text-xl').text();

      $('.text-xs').each((index, element) => {
        const text = $(element).text();
        elements.push(text);
      });

      elements.forEach((element, i) => {
        if (element === 'Editorial') {
          likes = elements[i + 4];
          dislikes = elements[i + 5];
          return; // Exit the loop
        }
      });

      const elements_2 = [];
      $('div.text-label-1').each((index, element) => {
        const text = $(element).text();
        elements_2.push(text);
      });

      elements_2.forEach((element, i) => {
        if (element === 'Description') {
          accepted = elements_2[i + 1];
          submissions = elements_2[i + 2];
          acceptance_rate = elements_2[i + 3];
          return;
        }
      });

      $('a.mr-4').each((index, element) => {
        const text = $(element).text();
        // var topic = {};
        // topic.name = text;
        // topic.majorSubMappings = { subTopic: {} };
        related_topics.push(text.toUpperCase());
      });

      // const anchors = document.querySelectorAll('a.text-sm');
      // // Add event listener to each <a> element
      // anchors.forEach((anchor, index) => {
      //   anchor.addEventListener('click', () => {
      //     initialQuestionDataSend = false;
      //     console.log(`Anchor ${index + 1} clicked!`);
      //   });
      // });
 
      const questionData = {
        userId,
        difficulty: { name: difficulty.toUpperCase(), checked: 0 },
        title,
        likes,
        dislikes,
        accepted,
        submissions,
        acceptanceRate: acceptance_rate,
        topicTemp: related_topics,
        questionHeading: title,
        questionUrl: window.location.href.toUpperCase(),
        platform: 'leetcode',
      };
      console.log('fetching question data');
      console.log(questionData);

      // If you want to send this data to the server, you can do it here
      // ...

      // Add a condition to stop the interval if needed
      if (questionData) {
        clearInterval(questionInterval);
      }
    }
  }
}

// Function to fetch result data
function fetchResultData() {
  if (window.location.href.includes('leetcode.com')) {
    const xpathExpression =
      '//button[@data-e2e-locator="console-submit-button"]';
    const result = document.evaluate(
      xpathExpression,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    const submitBtn = result.singleNodeValue;
    submitBtn.addEventListener('click', () => {
      console.log('fetching result data');
      
      // Check for result availability at regular intervals
      const resultInterval = setInterval(() => {
        var $ = cheerio.load(document.getElementsByTagName('html')[0].innerHTML);
        const acceptedElement = $('[data-e2e-locator="submission-result"]');
        const acceptedText = acceptedElement.text();
        
        // Check if the result is available (adjust the condition as needed)
        if (acceptedText) {
          clearInterval(resultInterval); // Stop checking for result
          
          // Fetch the result data
          let languageA = [];
          $('div.bg-fill-primary').each((index, element) => {
            languageA.push($(element).text());
          });
          let language=languageA[0];

          const runtime_memory = [];
          $('span.text-label-1').each((index, element) => {
            const text = $(element).text();
            runtime_memory.push(text);
          });

          let runtime = runtime_memory[0];
          let memory = runtime_memory[1];

          let code=[];

          $('div.view-lines').each((index, element) => {
            code.push($(element).text()+"\n");
          })

          const runtime_memory_percentage = [];

          $('div.mt-2 span').each((index, element) => {
            const text = $(element).text();
            runtime_memory_percentage.push(text);
          });

          let runtimePercentage = runtime_memory_percentage[0].split(' ');
          runtimePercentage = runtimePercentage[1];

          let memoryPercentage = runtime_memory_percentage[2].split(' ');
          memoryPercentage = memoryPercentage[1];
           
          const url_page = window.location.href
            .split('submissions')[0]
            .toUpperCase();

          

            const userId = $('a.text-xl').text();


          const result_data = {
            userId,
            acceptedText,
            language,
            runtime,
            memory,
            runtimePercentage,
            memoryPercentage,
            code,
            url_page,
          };

          console.log(result_data);
        }
      }, 1000); // Check every second for result availability
    });
  }
}

// Set up intervals for fetching question and waiting for result click
const questionInterval = setInterval(fetchQuestionData, 5000);
const resultClickInterval = setInterval(fetchResultData, 5000);
