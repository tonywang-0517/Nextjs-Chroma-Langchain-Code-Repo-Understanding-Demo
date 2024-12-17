import React, { useState } from 'react';

export default function Chatbot() {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello, I am your smart assistant. How can I help you?' },
    ]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!inputText.trim()) return;
        const userMessage = { sender: 'user', text: inputText };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInputText('');
        setLoading(true);
        try {
            const response = await fetch('/api/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({message:userMessage.text}),
            });

            const data = await response.json();
            const botMessage = { sender: 'bot', text: data.reply };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            const errorMessage = {
                sender: 'bot',
                text: 'Sorry, there was an issue processing your request. Please try again later.',
            };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    return (
        <div>
            <div style={{ height: '680px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '5px 0' }}>
                        <p style={{whiteSpace: 'pre-line'}}><strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}</p>
                    </div>
                ))}
                {loading && <p style={{ textAlign: 'left', fontStyle: 'italic' }}>The bot is thinking...</p>}
            </div>
            <input
                type="text"
                placeholder="Enter your message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{ width: '80%', padding: '10px', marginRight: '10px' }}
            />
            <button onClick={sendMessage} style={{ padding: '10px' }}>Send</button>
        </div>
    );
}
