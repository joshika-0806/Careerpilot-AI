import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

function MockInterview() {
  const [searchParams] = useSearchParams();
  const _companyId = searchParams.get("company");
  
  const [chat, setChat] = useState([
    { sender: "ai", text: "Hello! Welcome to your mock interview. I will be your AI interviewer. Let's start. Tell me about a time you solved a complex technical problem." }
  ]);
  const [input, setInput] = useState("");
  const [isEnded, setIsEnded] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newChat = [...chat, { sender: "user", text: input }];
    setChat(newChat);
    setInput("");
    
    // Simulate AI response
    setTimeout(() => {
      if (newChat.length > 5) {
        setIsEnded(true);
      } else {
        setChat([...newChat, { sender: "ai", text: "That is interesting. Can you elaborate on the specific algorithms you used to optimize it?" }]);
      }
    }, 1000);
  };

  return (
    <div className="mock-interview-page">
      <h1>Simulated Mock Interview</h1>
      
      {!isEnded ? (
        <div className="chat-container">
          <div className="chat-history">
            {chat.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.sender}`}>
                <div className="msg-bubble">{msg.text}</div>
              </div>
            ))}
          </div>
          <div className="chat-input-area">
            <textarea 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Type your response..."
              rows={2}
            />
            <button className="primary-btn" onClick={sendMessage}>Send</button>
            <button className="danger-btn" onClick={() => setIsEnded(true)}>End Interview</button>
          </div>
        </div>
      ) : (
        <div className="final-report-container">
          <h2>Interview Completed - Final Report</h2>
          <div className="score-cards">
            <div className="score-card">
              <h4>Technical Score</h4>
              <div className="score">85/100</div>
            </div>
            <div className="score-card">
              <h4>HR Score</h4>
              <div className="score">90/100</div>
            </div>
            <div className="score-card">
              <h4>Communication</h4>
              <div className="score">88/100</div>
            </div>
            <div className="score-card">
              <h4>Overall</h4>
              <div className="score">87/100</div>
            </div>
          </div>
          <div className="improvements">
            <h3>Personalized Suggestions</h3>
            <ul>
              <li>Be more specific about Time Complexity in your answers.</li>
              <li>Maintain a more structured STAR approach during behavioral questions.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default MockInterview;
