import React, { useState, useEffect, useRef } from 'react';
import './CustomChat.css';

const VOICEFLOW_API_KEY = 'VF.DM.68c545078d919a06ccbf34c7.cTOV9eULmUOTJd4i';
const VOICEFLOW_VERSION_ID = '68c537223c40bec5752bbb3c';

const CustomChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const sessionId = useRef('user-' + Math.random().toString(36).substr(2, 9));

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize conversation
  useEffect(() => {
    if (isOpen) {
      sendMessage(''); // Send empty message to start conversation
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    if (text.trim()) {
      setMessages(prev => [...prev, { type: 'user', text, timestamp: new Date() }]);
    }
    
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`https://general-runtime.voiceflow.com/state/user/${sessionId.current}/interact`, {
        method: 'POST',
        headers: {
          'Authorization': VOICEFLOW_API_KEY,
          'Content-Type': 'application/json',
          'versionID': VOICEFLOW_VERSION_ID
        },
        body: JSON.stringify({
          action: {
            type: text.trim() ? 'text' : 'launch',
            payload: text.trim() ? text : ''
          }
        })
      });

      const data = await response.json();
      
      // Process Voiceflow response
      data.forEach(item => {
        if (item.type === 'text') {
          setMessages(prev => [...prev, { 
            type: 'bot', 
            text: item.payload.message, 
            timestamp: new Date() 
          }]);
        }
        // Handle other response types (buttons, cards, etc.)
      });
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: 'Sorry, I encountered an error. Please try again.', 
        timestamp: new Date() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="custom-chat-container">
      <div className="chat-header">
        <h3>NFL Safety Trainer</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}-message`}>
            <div className="message-content">
              {msg.text}
            </div>
            <div className="message-time">
              {msg.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message bot-message">
            <div className="message-content typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && userInput.trim() && sendMessage(userInput)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button 
          onClick={() => userInput.trim() && sendMessage(userInput)}
          disabled={isLoading || !userInput.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default CustomChat;