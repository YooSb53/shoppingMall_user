import React, { useState } from 'react';

const ChatInterface = () => {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: input }),
            });
            const data = await res.json();
            setResponse(data.response);  // Ollama API 응답을 반영
        } catch (error) {
            console.error("Error:", error);
            setResponse("Error occurred while fetching response.");
        }
    };

    return (
        <div>
            <h2>Chat with Ollama</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button type="submit">Send</button>
            </form>
            <div>
                <h3>Response:</h3>
                <p>{response}</p>
            </div>
        </div>
    );
};

export default ChatInterface;
