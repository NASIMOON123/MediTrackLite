import React, { useState } from 'react';
import '../css/Chatbot.css';
//import { FaMicrophone, FaPaperPlane } from 'react-icons/fa';

import { FiMic } from 'react-icons/fi';
import { IoSend } from 'react-icons/io5';


const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "Hi! I'm MediBot 🤖. How can I assist you today?", sender: 'bot' }
  ]);


const handleSend = async () => {
    if (!input.trim()) return;
  
    const userMsg = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    const userInput = input;
    setInput('');
  
    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput }),
      });
  
      const data = await res.json();
  
      const botMsg = { text: data.reply, sender: 'bot' };
      setMessages((prev) => [...prev, botMsg]);
  
      // ✅ Speak the bot's reply aloud
    //   const speak = (text) => {
    //     const utterance = new SpeechSynthesisUtterance(text);
    //     utterance.lang = 'en-IN'; // You can also use 'en-US'
    //     window.speechSynthesis.speak(utterance);
    //   };
    const speak = (text) => {
        if (!text || typeof text !== 'string') return;
      
        // Clear any existing speech
        window.speechSynthesis.cancel();
      
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-IN';
        utterance.pitch = 1;
        utterance.rate = 1;
        utterance.volume = 1;
      
        // Optional: set a voice (optional based on device)
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(v => v.lang === 'en-IN' || v.lang === 'en-US');
        if (selectedVoice) utterance.voice = selectedVoice;
      
        // Speak after a slight delay to let recognition end
        setTimeout(() => {
          window.speechSynthesis.speak(utterance);
        }, 250); // 250ms delay helps prevent overlap
      };
      
  
      speak(data.reply);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMsg = { text: "Sorry, I couldn't connect to the server.", sender: 'bot' };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-IN';
  recognition.continuous = false;
  
  let isListening = false;
  
  const startListening = () => {
    if (!isListening) {
      recognition.start();
      isListening = true;
    }
  };
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setInput(transcript); // Fill input box with spoken text
  };
  
  recognition.onend = () => {
    isListening = false; // Reset flag when recognition stops
  };
  

  return (

       <div className="chatbot-container">
  {open ? (
    <div className="chatbot">
      <div className="chat-header" onClick={() => setOpen(false)}>MediBot 🤖</div>
      <div className="chat-body">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      

<div className="chat-footer">
  <div className="chat-input-bar">
    <input
      type="text"
      className="chat-text-input"
      placeholder="Ask anything"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
    />
    <div className="chat-actions">
      <button
        className="chat-btn"
        onClick={startListening}
        title="Voice input"
      >
                <FiMic />
      </button>
      <button
        className="chat-btn"
        onClick={handleSend}
        title="Send message"
      >
            <IoSend />
      </button>
    </div>
  </div>
</div>

    </div>
  ) : (
    <button className="chat-toggle" onClick={() => setOpen(true)}>💬</button>
  )}
</div>
  );
};



export default Chatbot;
