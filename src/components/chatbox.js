import React, { useState } from 'react';

function ChatBox() {
    const [message, setMessage] = useState('');
    const [responses, setResponses] = useState([]);

    const sendMessage = async () => {
        if (!message) return;
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });
            const data = await response.json();
            setResponses([...responses, { query: message, response: data.response }]);
            setMessage('');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Chat with GPT</h1>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
            <div>
                {responses.map((item, index) => (
                    <p key={index}><b>You:</b> {item.query} <br /><b>GPT:</b> {item.response}</p>
                ))}
            </div>
        </div>
    );
}

export default ChatBox;
