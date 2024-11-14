import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import http from 'http';
import https from 'https';
dotenv.config();
import axios from 'axios';
import fetch from 'node-fetch';
/* const bodyParser = require('body-parser');*/
import HttpsProxyAgent from 'https-proxy-agent';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';



// Get __dirname equivalent in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/* const axios = require('axios');


app.use(express.json());

const OPENAI_API_URL = 'https://api.openai.com/v1/completions';
const API_KEY = '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';

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    try {
        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: "text-davinci-003", // Change depending on your subscription and model availability
                prompt: message,
                max_tokens: 150
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                }
            }
        );
        res.json({ response: response.data.choices[0].text.trim() });
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).json({ error: 'Failed to fetch response from OpenAI' });
    }
});


 */
const app = express();
const port = process.env.PORT || 200;

//allow request from all source
import cors from 'cors';
app.use(cors());
app.use(express.json());
// Setting up the MySQL connection
const db = mysql.createConnection({
    //    host: process.env.DB_HOST,
    //    user: process.env.DB_USER,
    //    password: process.env.DB_PASS,
    //   database: process.env.DB_NAME
    host: 'localhost',
    user: 'root',
    password: '465653650szr!!!',
    database: 'ai_math_solver'
});

db.connect(err => {
    if (err) {
        return console.error('error connecting: ' + err.message);
    }
    console.log('connected to the MySQL server.');
});

/* app.use(express.json());
app.get('/api/subjects', (req, res) => {
    console.log('Received GET request for /api/subjects');
    // Optionally, log more details about the request
    console.log('Headers:', req.headers);
    console.log('Query:', req.query);

    res.json({ subjects: ["Mathematics", "Physics", "Chemistry"] });
}); */

// Example of a POST route
app.post('/api/subjects', (req, res) => {
    console.log('Received POST request for /api/subjects');
    console.log('Body:', req.body);

    res.status(201).send({ message: 'Subject added' });
});
// API route for fetching subjects
app.get('/api/subjects', (req, res) => {
    console.log('Received request for /api/subjects');
    db.query('SELECT * FROM subjects', (error, results) => {
        if (error) {
            console.error('Error fetching subjects:', error);
            return res.status(500).json({ error: 'Database query failed', details: error.message });
        }
        res.setHeader('Content-Type', 'application/json');
        res.json(results);
    });
});



/* // API route for fetching textbooks based on subject ID
app.get('/api/textbooks', (req, res) => {
    const subjectId = req.query.subjectId;
    db.query('SELECT * FROM textbooks WHERE subject_id = ?', [subjectId], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// API route for fetching chapters based on textbook ID
app.get('/api/chapters', (req, res) => {
    const textbookId = req.query.textbookId;
    db.query('SELECT * FROM chapters WHERE textbook_id = ?', [textbookId], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// API route for fetching LaTeX code based on chapter ID
app.get('/api/latex-code', (req, res) => {
    const chapterId = req.query.chapterId;
    db.query('SELECT latex_code FROM chapters WHERE id = ?', [chapterId], (error, result) => {
        if (error) throw error;
        res.json({ latexCode: result[0].latex_code });
    });
}); */
app.get('/api/chapter-summary/:chapterId', (req, res) => {
    const chapterId = req.params.chapterId;
    db.query('SELECT summary FROM Chapters WHERE id = ?', [chapterId], (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
});

// Fetch topics in a chapter
app.get('/api/topics/:chapterId', (req, res) => {
    const chapterId = req.params.chapterId;
    db.query('SELECT * FROM Topics WHERE chapter_id = ?', [chapterId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.get('/api/chapters/:textbookId', (req, res) => {
    const textbookId = req.params.textbookId;
    db.query('SELECT * FROM chapters WHERE textbook_Id = ?', [textbookId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


app.get('/api/textbooks/:subjectId', (req, res) => {
    const subjectId = req.params.subjectId;
    db.query('SELECT * FROM textbooks WHERE subject_Id = ?', [subjectId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


// Fetch topic summary
app.get('/api/topic-summary/:topicId', (req, res) => {
    const topicId = req.params.topicId;
    db.query('SELECT summary FROM Topics WHERE id = ?', [topicId], (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
});

// Fetch questions in a topic
app.get('/api/questions/:topicId', (req, res) => {
    const topicId = req.params.topicId;
    db.query('SELECT * FROM Questions WHERE topic_id = ?', [topicId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Fetch question and solution
app.get('/api/question/:questionId', (req, res) => {
    const questionId = req.params.questionId;
    db.query('SELECT * FROM Questions WHERE id = ?', [questionId], (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
});


/* const proxyUrl = 'http://127.0.0.1:21882';
const proxyAuth = 'W8hRqe';  // Assuming the password is used as basic auth, if username is required include it like 'username:password'

const httpsAgent = new HttpsProxyAgent({
    host: proxyUrl,
    port: 15682,
    auth: proxyAuth  // This may not be the right format for all proxy servers, it depends on the type of proxy being used.
});  */
/* const proxyUrl = 'http://W8hRqe@61.221.84.27:18427';
 */
/* const httpsAgent = new HttpsProxyAgent(proxyUrl);
 */
const proxyUrl = 'http://127.0.0.1:21882'; // Replace with your actual proxy URL
const proxyAgent = new HttpsProxyAgent(proxyUrl);

// Create an HTTPS agent that uses TLS 1.2 or TLS 1.3
/* const httpsAgent = new https.Agent({
    keepAlive: true, 
    secureProtocol: 'TLSv1_2_method',
    rejectUnauthorized: false,// Enables connection reuse
    maxSockets: Infinity,
    keepAliveMsecs: 1000, 
  }); */
app.post('/api/chatgpt', async (req, res) => {
    const { question, latexCode } = req.body;
    const messages = [
        { role: 'system', content: 'You are a helpful assistant.' },  // Optional system message
        { role: 'user', content: "I have a specific question about the following material. Please read through it and answer the question based on the provided content. \n\n Question:\n" + question + "\n\n Material:\n" + latexCode },                          // User's question
        // LaTeX code input
    ];
    // Prepare the data for OpenAI API request
    const openaiData = {
        model: 'gpt-4o',  // Or any other model you want to use, like 'gpt-3.5-turbo'
        messages: messages,  // Combine question and LaTeX code into a single prompt
        max_tokens: 500,
        temperature: 0.2,
        top_p: 0.3,
        presence_penalty: -2,
    };
    const apiKey = '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';
    try {
        console.log('Received request with data:', openaiData);

        // Call OpenAI API using Axios
        const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', openaiData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            httpsAgent: proxyAgent, // Optional: Use proxy agent if you are using a proxy
        });
        console.log('OpenAI API Response:', openaiResponse.data.choices[0].message.content);
        // Send back the response from OpenAI API to the frontend
        res.json({ response: openaiResponse.data.choices[0].message.content });
    } catch (error) {
        console.error('Error calling OpenAI API:', error.message);
        if (error.response) {
            console.error('Response error data:', error.response.data);
            res.status(error.response.status).json({ error: error.response.data });
        } else {
            res.status(500).json({ error: 'Error calling OpenAI API' });
        }
    }

});

/*  try {
     const response = await fetch('https://api.openai.com/v1/completions', {
         model: "davinci-002",
         prompt: prompt,
         max_tokens: 150,
         n: 1,
         stop: null,
         temperature: 0.7,
     }, {
         headers: {
             'Content-Type': 'application/json',         // Header for specifying JSON data
             'Authorization': `Bearer ${apiKey}`,        // API key authorization
             'Cookie': '__cf_bm=3DwMAFVct4Ci0D_hc8WYjK9gPHaitcxE6FDI_zPd.5k-1725365965-1.0.1.1-EHiLjUAiLh27C8ofIEgBLDi3_Lr.fTsdCklFWSbuOkpk_yeDX7_lNmjDP8k4dyEEl1maOzK8IyRVRTOsOLF7xw; _cfuvid=5.Ts4Mo6x3GKphmBzBA3E2fElrHgrqTCyW.Ys.VIOR8-1725365965556-0.0.1.1-604800000;', // Cookie (replace with actual cookie value from Postman)
             'User-Agent': 'PostmanRuntime/7.41.2',      // User-Agent as used by Postman
             'Accept-Encoding': 'gzip, deflate, br',     // Accept encoding formats
             'Connection': 'keep-alive'                  // Keep-alive connection
         },  
         timeout: 120000  // Set a timeout of 15 seconds
         
     });
     httpsAgent,
     console.log('Response from OpenAI:', response.data);
     res.json({ response: response.choices[0].text.trim() });
 } catch (error) {
     if (error.response) {
         console.error('Error response from OpenAI API:', error.response.data);
     } else if (error.request) {
         console.error('No response received from OpenAI API:', error.request);
     } else {
         console.error('Error setting up OpenAI API request:', error.message);
     }
     res.status(500).json({ error: 'Failed to fetch response from OpenAI', details: error.message });
 }   */
/* try {
    const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'davinci-002',
            prompt: prompt,
            max_tokens: 150,
            n: 1,
            stop: null,
            temperature: 0.7,
        }),
        timeout: 60000  // Increase timeout to 60 seconds
    });
    if (!response.ok) {
        throw new Error(`Error response from OpenAI API: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Raw JSON response from OpenAI:', JSON.stringify(data, null, 2));
    res.json({ response: data.choices[0].text.trim() });
} catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch response from OpenAI', details: error.message });
}  */
app.post('/api/generate-plot', async (req, res) => {
    const { mathFunction, ipAddress} = req.body;
    const messages = [
        { role: 'system', content: 'You are a helpful assistant.' },  // Optional system message
        { role: 'user', content: 'generate the python script for illustrating the following:\n  ' + mathFunction + 
            '\nonly the code is needed in the response and no other words are needed. in python script save the image as plot.png. include grid in the saved image. Put the theorem and the equations of the function as the title.'  },                          // User's question
        // LaTeX code input
    ];
    // Prepare the data for OpenAI API request
    const openaiRequestforPlot = {
        model: 'chatgpt-4o-latest',  // Or any other model you want to use, like 'gpt-3.5-turbo'
        messages: messages,  // Combine question and LaTeX code into a single prompt
        max_tokens: 3000,
        temperature: 0.8,
        top_p: 0.3,
        frequency_penalty: 0.3,
        presence_penalty: 0,
    };
    // Send the math function to OpenAI to generate plotting code
    console.log('Received request with data:', openaiRequestforPlot);
    const apiKey = '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';

    // Call OpenAI API using Axios
    const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', openaiRequestforPlot, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        timeout: 60000,
        httpsAgent: proxyAgent, // Optional: Use proxy agent if you are using a proxy
    });
    console.log('OpenAI API Response:', openaiResponse.data.choices[0].message.content);
    // Send back the response from OpenAI API to the frontend
/*     res.json({ response: openaiResponse.data.choices[0].message.content });
 */


    /*             const openaiData = await openaiResponse.json(); */
    const openaiData = await openaiResponse.data.choices[0].message.content;
    const plotCode = openaiData.replace(/```python|```/g, '').trim();;
    console.log(plotCode);
    // Save the Python code to a file
    const pythonScriptPath = path.join(__dirname, 'plot.py');
    fs.writeFileSync(pythonScriptPath, plotCode);

    // Execute the Python script and generate the plot image
    exec(`python ${pythonScriptPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Python script: ${error.message}`);
            if (!res.headersSent) {
                return res.status(500).json({ error: 'Error generating plot' });
            }
        }

        const plotImagePath = path.join(__dirname, 'plot.png');
        if (fs.existsSync(plotImagePath)) {
            // Ensure that the response is sent only once

                res.json({
                    response: openaiResponse.data.choices[0].message.content,
                    plotCode: plotCode,
                    plotUrl: 'http://' + ipAddress + `:200/plot.png`,  // Serve the image as static content
                });
            
        } else {
            if (!res.headersSent) {
                res.status(500).json({ error: 'Plot image not found' });
            }
        }
    });
}
);

// Serve the generated plot image
app.use('/plot.png', express.static(path.join(__dirname, 'plot.png')));


app.post('/api/query-equation', async (req, res) => {
    const { equation, action } = req.body;

    let prompt;
    if (action === 'what') {
        prompt = `Explain briefly what math topic the equation ${equation} is related and what question it can solve`;
    } else if (action === 'how') {
        prompt = `Give two exmaples where I can use the equation ${equation}. Start the response directly from the exmaple`;
    }


    const messages = [
        { role: 'system', content: 'You are a helpful assistant.' },  // Optional system message
        { role: 'user', content: prompt},
        // LaTeX code input
    ];
    // Prepare the data for OpenAI API request
    const openaiRequestforEquation = {
        model: 'gpt-4o',  // Or any other model you want to use, like 'gpt-3.5-turbo'
        messages: messages,  // Combine question and LaTeX code into a single prompt
        max_tokens: 1000,
        temperature: 0.2,
        top_p: 0.3,
        presence_penalty: -2,
    };
    const apiKey = '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';
    try {
        console.log('Received request with data:', openaiRequestforEquation);

        // Call OpenAI API using Axios
        const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', openaiRequestforEquation, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            httpsAgent: proxyAgent, // Optional: Use proxy agent if you are using a proxy
        });
        console.log('OpenAI API Response:', openaiResponse.data.choices[0].message.content);
        // Send back the response from OpenAI API to the frontend
        res.json({ responseEquations: openaiResponse.data.choices[0].message.content });
    } catch (error) {
        console.error('Error calling OpenAI API:', error.message);
        if (error.responseEquations) {
            console.error('Response error data:', error.responseEquations.data);
            res.status(error.responseEquations.status).json({ error: error.responseEquations.data });
        } else {
            res.status(500).json({ error: 'Error calling OpenAI API' });
        }
    }
});


app.post('/api/query-example', async (req, res) => {
    
    const { example, questionSolution } = req.body;



    const prompt = 'Explain how this part' + example +  'is related to the previous and following step in the content' + questionSolution + 'do not go through any other part in the content!!!!! Start your response directly from explaination';



    const messages = [
        { role: 'system', content: 'You are a helpful assistant.' },  // Optional system message
        { role: 'user', content: prompt},
        // LaTeX code input
    ];
    // Prepare the data for OpenAI API request
    const openaiRequestforExample = {
        model: 'gpt-4o',  // Or any other model you want to use, like 'gpt-3.5-turbo'
        messages: messages,  // Combine question and LaTeX code into a single prompt
        max_tokens: 500,
        temperature: 0.2,
        top_p: 0.3,
        presence_penalty: -2,
    };
    const apiKey = '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';
    try {
        console.log('Received request with data:', openaiRequestforExample);

        // Call OpenAI API using Axios
        const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', openaiRequestforExample, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            httpsAgent: proxyAgent, // Optional: Use proxy agent if you are using a proxy
        });
        console.log('OpenAI API Response:', openaiResponse.data.choices[0].message.content);
        // Send back the response from OpenAI API to the frontend
        res.json({ responseExample: openaiResponse.data.choices[0].message.content });
    } catch (error) {
        console.error('Error calling OpenAI API:', error.message);
        if (error.responseExample) {
            console.error('Response error data:', error.responseExample.data);
            res.status(error.responseExample.status).json({ error: error.responseExample.data });
        } else {
            res.status(500).json({ error: 'Error calling OpenAI API' });
        }
    }
});


/* app.post('/api/generate-d3plot', async (req, res) => {
    const { mathFunction, ipAddress } = req.body;

    const prompt = `
    Generate data points for the function ${mathFunction}. Provide the data in the format of JSON with "x" and "y" coordinates. Generate 50 deta points in appropriate x range. No other words needed except for the json
    Example:
    [
        {"x": -10, "y": ...},
        {"x": -9, "y": ...},
        ...
    ]
    `;

    const messages = [
        { role: 'system', content: 'You are a helpful assistant.' },  // Optional system message
        { role: 'user', content: prompt},
        // LaTeX code input
    ];
    // Prepare the data for OpenAI API request
    const openaiRequestforD3plot = {
        model: 'gpt-4o',  // Or any other model you want to use, like 'gpt-3.5-turbo'
        messages: messages,  // Combine question and LaTeX code into a single prompt
        max_tokens: 3000,
        temperature: 0.2,
        top_p: 0.3,
        presence_penalty: -2,
    };
    const apiKey = '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';
    try {
        console.log('Received request with data:', openaiRequestforD3plot);

        // Call OpenAI API using Axios
        const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', openaiRequestforD3plot, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            httpsAgent: proxyAgent, // Optional: Use proxy agent if you are using a proxy
        });
        console.log('OpenAI API Response:', openaiResponse.data.choices[0].message.content);
        // Send back the response from OpenAI API to the frontend
        res.json({ d3data: openaiResponse.data.choices[0].message.content });
    } catch (error) {
        console.error('Error calling OpenAI API:', error.message);
        if (error.responseEquations) {
            console.error('Response error data:', error.responseEquations.data);
            res.status(error.responseEquations.status).json({ error: error.responseEquations.data });
        } else {
            res.status(500).json({ error: 'Error calling OpenAI API' });
        }
    }
}); */

app.post('/api/generate-d3plot', async (req, res) => {
    const { mathFunction, ipAddress} = req.body;
    const messages = [
        { role: 'system', content: 'You are a helpful assistant.' },  // Optional system message
        { role: 'user', content: 'generate the python code and uses Plotly to generate a plot for the math content\n  ' + mathFunction + '\n  and prints the plot data as JSON. Give the python code only and no other words are needed. use plotly.io to convert figure to plot data. set a big layout' },                          // User's question
        // LaTeX code input
    ];
    // Prepare the data for OpenAI API request
    const openaiRequestforPlot = {
        model: 'chatgpt-4o-latest',  // Or any other model you want to use, like 'gpt-3.5-turbo'
        messages: messages,  // Combine question and LaTeX code into a single prompt
        max_tokens: 3000,
        temperature: 0.8,
        top_p: 0.3,
        frequency_penalty: 0.3,
        presence_penalty: 0,
    };
    // Send the math function to OpenAI to generate plotting code
    console.log('Received request with data:', openaiRequestforPlot);
    const apiKey = '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';

    // Call OpenAI API using Axios
    const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', openaiRequestforPlot, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        timeout: 60000,
        httpsAgent: proxyAgent, // Optional: Use proxy agent if you are using a proxy
    });
    console.log('OpenAI API Response:', openaiResponse.data.choices[0].message.content);
    // Send back the response from OpenAI API to the frontend
/*     res.json({ response: openaiResponse.data.choices[0].message.content });
 */


    /*             const openaiData = await openaiResponse.json(); */
    const openaiData = await openaiResponse.data.choices[0].message.content;
    const plotCode = openaiData.replace(/```python|```/g, '').trim();;
    console.log(plotCode);
    // Save the Python code to a file
    const pythonScriptPath = path.join(__dirname, 'plot.py');
    fs.writeFileSync(pythonScriptPath, plotCode);

    // Execute the Python script and generate the plot image
    exec(`python ${pythonScriptPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).json({ error: 'Failed to generate plot data' });
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }

        // Send the generated plot JSON back to the frontend
        const plotData = JSON.parse(stdout);
        res.json({plotdata: plotData});
        console.log('plot data:', plotData);
    });

}
);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
