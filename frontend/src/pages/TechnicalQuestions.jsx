import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import API from "../services/api";

function TechnicalQuestions() {
  const { id: companyId } = useParams();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("cat");
  
  const [questions, setQuestions] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (companyId && categoryId) {
      API.get(`/api/interview/questions/${companyId}/${categoryId}`)
        .then(res => {
            setQuestions(res.data);
            setLoading(false);
        })
        .catch(err => console.error(err));
    }
  }, [companyId, categoryId]);

  const toggle = (id) => {
    if (expanded === id) setExpanded(null);
    else setExpanded(id);
  };

  if (loading) {
      return <div className="technical-questions-page"><h2>Loading questions...</h2></div>;
  }

  return (
    <div className="technical-questions-page">
      <h1>Technical Interview Questions</h1>
      {questions.length === 0 ? (
          <p>No questions found for this category.</p>
      ) : (
        <div className="questions-list">
          {questions.map(q => (
            <div key={q.id} className="question-card" onClick={() => toggle(q.id)}>
              <div className="q-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <h3>{q.title}</h3>
                  {q.difficulty && (
                    <span className={`difficulty ${q.difficulty.toLowerCase()}`}>
                      {q.difficulty}
                    </span>
                  )}
                </div>
                <span>{expanded === q.id ? "-" : "+"}</span>
              </div>
              {expanded === q.id && (
                <div className="q-body">
                  <div className="ans-section">
                    <h4>Problem Statement:</h4>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{q.problem_statement}</p>
                    <h4 className="mt-2">Standard Answer & Explanation:</h4>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{q.answer_text || "Answer will be provided during interview."}</p>
                  </div>
                  {q.hint && (
                      <div className="ai-section mt-2">
                        <h4>💡 Interview Tip:</h4>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{q.hint}</p>
                      </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TechnicalQuestions;
