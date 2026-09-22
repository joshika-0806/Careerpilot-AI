import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";

function HRInterview() {
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get("company");
  const categoryId = searchParams.get("cat");

  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (companyId && categoryId) {
      API.get(`/api/interview/questions/${companyId}/${categoryId}`)
        .then(res => {
            setQuestions(res.data);
            setFetching(false);
        })
        .catch(err => console.error(err));
    }
  }, [companyId, categoryId]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await API.post("/api/interview/hr/evaluate", {
        question: questions[currentIdx].problem_statement,
        answer
      });
      setFeedback(response.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const nextQuestion = () => {
    setAnswer("");
    setFeedback(null);
    setCurrentIdx((prev) => (prev + 1) % questions.length);
  };

  if (fetching) {
      return <div className="hr-interview-page"><h2>Loading HR Questions...</h2></div>;
  }

  if (questions.length === 0) {
      return <div className="hr-interview-page"><h2>No HR Questions found for this company.</h2></div>;
  }

  return (
    <div className="hr-interview-page">
      <h1>HR Interview Practice</h1>
      
      <div className="hr-workspace">
        <div className="question-panel">
          <h2>Question {currentIdx + 1} of {questions.length}</h2>
          <h3>{questions[currentIdx].title}</h3>
          <p className="hr-question">{questions[currentIdx].problem_statement}</p>
        </div>
        
        <div className="answer-panel">
          <textarea 
            value={answer} 
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="hr-textarea"
            rows={10}
          />
          <div className="actions">
            <button className="primary-btn" onClick={handleSubmit} disabled={loading || !answer}>
              {loading ? "Evaluating..." : "Evaluate Answer"}
            </button>
            <button className="secondary-btn" onClick={nextQuestion}>Next Question</button>
          </div>
        </div>

        {feedback && (
          <div className="hr-feedback-panel mt-3">
            <h3>AI Feedback - Score: {feedback.score}/100</h3>
            <div className="feedback-grid">
              <div className="feedback-item"><strong>Grammar:</strong> {feedback.grammar}</div>
              <div className="feedback-item"><strong>Professionalism:</strong> {feedback.professionalism}</div>
              <div className="feedback-item"><strong>Communication:</strong> {feedback.communication}</div>
              <div className="feedback-item"><strong>Missing Points:</strong> {feedback.missing_points}</div>
            </div>
            <div className="better-answer mt-2">
              <strong>✨ Suggested Answer:</strong>
              <p>{feedback.better_answer}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HRInterview;
