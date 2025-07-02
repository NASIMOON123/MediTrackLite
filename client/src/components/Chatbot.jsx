import React, { useEffect, useState } from 'react';
import { FiMic } from 'react-icons/fi';
import { IoSend } from 'react-icons/io5';
import '../css/Chatbot.css';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "Hi! I'm MediBot 🤖. How can I assist you today?", sender: 'bot' }
  ]);
  const [faqDrawerOpen, setFaqDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [faqs, setFaqs] = useState([]);

  // Fetch categorized FAQs from backend
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/chatbot/faqs`);
        const data = await res.json();
        setFaqs(data);
      } catch (err) {
        console.error('Failed to load FAQs', err);
      }
    };
    fetchFaqs();
  }, []);

  const filteredFaqs = faqs.map(category => ({
    ...category,
    qa: category.qa.filter(q =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.qa.length > 0);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    const userInput = input;
    setInput('');

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput })
      });
      const data = await res.json();

      const botMsg = { text: data.reply, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);

      // Speak response
      const speak = text => {
        if (!text || typeof text !== 'string') return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-IN';
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(v => v.lang === 'en-IN' || v.lang === 'en-US');
        if (selectedVoice) utterance.voice = selectedVoice;
        setTimeout(() => window.speechSynthesis.speak(utterance), 250);
      };
      speak(data.reply);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, { text: "Sorry, I couldn't connect to the server.", sender: 'bot' }]);
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

  recognition.onresult = event => {
    const transcript = event.results[0][0].transcript;
    setInput(transcript);
  };
  recognition.onend = () => {
    isListening = false;
  };

  return (
    <div className="chatbot-container">
      {open ? (
        <div className="chatbot theme-card">
          <div className="chat-header" onClick={() => setOpen(false)}>
            MediBot 🤖
            <button
            onClick={(e) => {
              e.stopPropagation();
              setFaqDrawerOpen((prev) => !prev);
            }}
            className="faq-toggle theme-card"
          >
            {faqDrawerOpen ? '❌ Close FAQ' : '📚 FAQs'}
          </button>

          </div>

          {faqDrawerOpen && (
              <div className="faq-drawer theme-card">
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="faq-search"
                />

                {searchTerm.trim() ? (
                  <div className="faq-search-results">
                    <h4>Search Results</h4>
                    <ul>
                      {filteredFaqs.flatMap(cat =>
                        cat.qa.map((q, i) => (
                          <li
                            key={`${cat.category}-${i}`}
                            className="faq-question"
                            onClick={() => {
                              setInput(q.question);
                              setFaqDrawerOpen(false);
                            }}
                          >
                            {q.question}
                          </li>
                        ))
                      )}
                      {filteredFaqs.length === 0 && <p>No matching questions found.</p>}
                    </ul>
                  </div>
                ) : (
                  <div className="faq-categories">
                    {faqs.map((cat, idx) => (
                      <div key={idx} className="faq-category">
                        <h4 className='text-adaptive'>{cat.category}</h4>
                        <ul>
                          {cat.qa.map((q, i) => (
                            <li
                              key={i}
                              onClick={() => {
                                setInput(q.question);
                                setFaqDrawerOpen(false);
                              }}
                              className="faq-question"
                            >
                              {q.question}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}


          <div className="chat-body theme-card">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.sender}`}>{msg.text}</div>
            ))}
          </div>

          <div className="chat-footer theme-card">
            <div className="chat-input-bar">
              <input
                type="text"
                className="chat-text-input"
                placeholder="Ask anything"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <div className="chat-actions">
                <button className="chat-btn" onClick={startListening} title="Voice input">
                  <FiMic />
                </button>
                <button className="chat-btn" onClick={handleSend} title="Send message">
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
