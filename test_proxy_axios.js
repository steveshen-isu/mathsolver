const axios = require('axios');
const HttpsProxyAgent = require('https-proxy-agent');

// Configure your proxy
const proxyUrl = 'http://127.0.0.1:21882';  // Your proxy URL
const agent = new HttpsProxyAgent(proxyUrl);

// Your OpenAI API key
const apiKey = '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';  // Replace with your actual OpenAI API key

// Data for the OpenAI API request
const data = {
  model: 'davinci-002',  // You can use 'gpt-3.5-turbo' or another model name
  prompt: 'Translate the following English text to French: "Hello, how are you?"',
  max_tokens: 50
};

// Axios configuration
const config = {
  method: 'post',
  url: 'https://api.openai.com/v1/completions',
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': `Bearer ${apiKey}`
  },
  data: JSON.stringify(data),
  httpsAgent: agent,  // Use the proxy agent
};

// Make the request
axios(config)
  .then(response => {
    console.log('OpenAI Response:', response.data);
  })
  .catch(error => {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received from OpenAI:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
  });
