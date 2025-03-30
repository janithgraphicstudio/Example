// script.js with embedded API key
document.addEventListener('DOMContentLoaded', function() {
    // Configuration with your embedded API key
    const config = {
        apiKey: "AIzaSyAmiXhZV5ejuypcib0D66OeI07F1KqvTFA",
        defaultModel: "gemini-2.0-flash",
        defaultTemperature: 0.7
    };

    // DOM elements
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const clearButton = document.getElementById('clearButton');
    const temperatureSlider = document.getElementById('temperature');
    const tempValueDisplay = document.getElementById('tempValue');
    const apiStatus = document.getElementById('apiStatus');

    // Initialize UI
    tempValueDisplay.textContent = config.defaultTemperature;
    temperatureSlider.value = config.defaultTemperature;
    apiStatus.textContent = 'API: Ready';
    apiStatus.style.backgroundColor = '#34A853';

    // Event listeners
    temperatureSlider.addEventListener('input', function() {
        tempValueDisplay.textContent = this.value;
    });

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    clearButton.addEventListener('click', function() {
        chatMessages.innerHTML = `
            <div class="message bot-message">
                <div class="message-content">
                    Hello! I'm your Gemini AI assistant. How can I help you today?
                </div>
            </div>
        `;
    });

    // Main function to send message
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessage(message, 'user');
        userInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        try {
            // Prepare the request
            const requestBody = {
                contents: [{
                    parts: [{
                        text: message
                    }]
                }],
                generationConfig: {
                    temperature: parseFloat(temperatureSlider.value)
                }
            };
            
            // Make the API call with embedded API key
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${config.defaultModel}:generateContent?key=${config.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                }
            );
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            removeTypingIndicator();
            
            if (data.candidates && data.candidates[0].content.parts[0].text) {
                const botResponse = data.candidates[0].content.parts[0].text;
                addMessage(botResponse, 'bot');
            } else {
                throw new Error('No valid response from the API');
            }
        } catch (error) {
            removeTypingIndicator();
            console.error('Error:', error);
            addMessage(`Sorry, I encountered an error: ${error.message}`, 'bot');
            apiStatus.textContent = 'API: Error';
            apiStatus.style.backgroundColor = '#EA4335';
        }
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = text;
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingDiv.appendChild(dot);
        }
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
});