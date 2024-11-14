import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
const prompt = 'what is the equation \\(x+y=z\\)';

async function testOpenAI() {
    try {
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'text-davinci-002',
                prompt: prompt,
                max_tokens: 50
            }),
            timeout: 120000  // Increase timeout to 120 seconds
        });

        if (!response.ok) {
            throw new Error(`Error response from OpenAI API: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Raw JSON response from OpenAI:', JSON.stringify(data, null, 2));
    } catch (error) {
        if (error.response) {
            console.error('Error response from OpenAI API:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error('No response received from OpenAI API:', error.request);
        } else {
            console.error('Error setting up OpenAI API request:', error.message);
        }
    }
}

testOpenAI();