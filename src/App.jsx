import React, { useState, useEffect } from 'react';
import './App.css';
import userImage from './assets/user.png';
import chatbotImage from './assets/chatbot1.png';

function App() {
  const [userText, setUserText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [theme, setTheme] = useState('light_mode');
  const initialInputHeight = '55px';

  useEffect(() => {
    const themeColor = localStorage.getItem('themeColor');
    if (themeColor) {
      setTheme(themeColor);
    }
  
    const savedChats = localStorage.getItem('all-chats');
    if (savedChats) {
      const defaultTextDiv = document.createElement('div');
      defaultTextDiv.innerHTML = savedChats;
      setChatHistory([<div className="default-text" key="default-text">{defaultTextDiv}</div>]);
    }
  }, []);
  


  const handleOutgoingChat = () => {
    if (!userText.trim()) return;

    const userChat = (
      <div className="chat-content" key={chatHistory.length}>
        <div className="chat-details">
          <img src={userImage} alt="user-img" />
          <p>{userText}</p>
        </div>
      </div>
    );

    setChatHistory([...chatHistory, userChat]);
    setUserText('');

    const incomingChat = (
      <div className="chat-content" key={chatHistory.length + 1}>
        <div className="chat-details">
          <img src={chatbotImage} alt="chatbot-img" />
          <div className="typing-animation">
            <div className="typing-dot" style={{ '--delay': '0.2s' }} />
            <div className="typing-dot" style={{ '--delay': '0.3s' }} />
            <div className="typing-dot" style={{ '--delay': '0.4s' }} />
          </div>
        </div>
        <span
          className="material-symbols-rounded"
          onClick={() => copyResponse(userText)}
        >
          content_copy
        </span>
      </div>
    );

    setChatHistory([...chatHistory, incomingChat]);
    setTimeout(showTypingAnimation, 500);
  };

  const copyResponse = (response) => {
    navigator.clipboard.writeText(response);
  };

  const showTypingAnimation = async () => {
    const API_KEY = 'PASTE-YOUR-API-KEY-HERE';
    const API_URL = 'https://api.openai.com/v1/completions';

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: userText,
        max_tokens: 2048,
        temperature: 0.2,
        n: 1,
        stop: null,
      }),
    };

    try {
      const response = await (await fetch(API_URL, requestOptions)).json();
      const chatContent = (
        <div className="chat-details">
          <p>{response.choices[0].text.trim()}</p>
        </div>
      );

      const chats = [...chatHistory];
      chats[chats.length - 1] = (
        <div className="chat-content" key={chats.length}>
          {chats[chats.length - 1].props.children[0]}
          {chatContent}
          {chats[chats.length - 1].props.children[2]}
        </div>
      );

      setChatHistory(chats);
      localStorage.setItem('all-chats', chatHistory.map((chat) => chat.outerHTML).join(''));
    } catch (error) {
      // Handle error
    }
  };

  const handleDeleteChats = () => {
    if (window.confirm('Are you sure you want to delete all the chats?')) {
      localStorage.removeItem('all-chats');
      setChatHistory([]);
    }
  };

  const handleToggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light_mode' ? 'dark_mode' : 'light_mode';
      localStorage.setItem('themeColor', newTheme);
      return newTheme;
    });
  };

  const handleInputChange = (e) => {
    setUserText(e.target.value);

    e.target.style.height = initialInputHeight;
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className={`App ${theme}`}>
      <div className="chat-container">{chatHistory}</div>
      <div className="typing-container">
        <div className="typing-content">
          <div className="typing-textarea">
            <textarea
              id="chat-input"
              spellCheck={false}
              placeholder="Enter a prompt here"
              required
              value={userText}
              onChange={handleInputChange}
            />
            <span className="material-symbols-rounded" onClick={handleOutgoingChat}>
              send
            </span>
          </div>
          <div className="typing-controls">
            <span className="material-symbols-rounded" onClick={handleToggleTheme}>
              {theme === 'light_mode' ? 'dark_mode' : 'light_mode'}
            </span>
            <span className="material-symbols-rounded" onClick={handleDeleteChats}>
              delete
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
