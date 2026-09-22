import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import API from "../services/api";

function CodingWorkspace() {
  const { id: companyId } = useParams();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("cat");
  
  const [questions, setQuestions] = useState([]);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Write your code here");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (companyId && categoryId) {
      API.get(`/api/interview/questions/${companyId}/${categoryId}`)
        .then(res => {
            const data = res.data;
            setQuestions(data);
            if(data.length > 0) {
                // Initialize editor with a comment describing the problem
                setCode(`// Solve: ${data[0].title}\n// Language: javascript\n\n`);
            }
        })
        .catch(err => console.error(err));
    }
  }, [companyId, categoryId]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await API.post("/api/interview/code/submit", {
        code, 
        language, 
        question_id: questions[currentQIdx]?.id
      });
      setFeedback(response.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (questions.length === 0) {
      return <div className="coding-workspace"><h2>Loading coding problem...</h2></div>;
  }

  const currentQ = questions[currentQIdx];

  return (
    <div className="coding-workspace">
      <div className="problem-panel">
        <h2>{currentQ.title}</h2>
        <span className={`difficulty ${currentQ.difficulty.toLowerCase()}`}>{currentQ.difficulty}</span>
        <div className="problem-statement">
          <p>{currentQ.problem_statement}</p>
          
          {currentQ.sample_input && (
            <>
              <h4>Example:</h4>
              <pre>
                Input: {currentQ.sample_input}<br/>
                Output: {currentQ.sample_output}
              </pre>
            </>
          )}

          {currentQ.constraints && (
            <>
              <h4>Constraints:</h4>
              <ul>
                <li><code>{currentQ.constraints}</code></li>
              </ul>
            </>
          )}
          
          {currentQ.expected_time && (
            <div className="complexity-info mt-2">
                <p><strong>Expected Time:</strong> {currentQ.expected_time}</p>
                <p><strong>Expected Space:</strong> {currentQ.expected_space}</p>
            </div>
          )}
        </div>
        
        {questions.length > 1 && (
            <div className="pagination mt-3">
                <button 
                  className="secondary-btn" 
                  disabled={currentQIdx === 0} 
                  onClick={() => setCurrentQIdx(c => c - 1)}
                >Previous Problem</button>
                <button 
                  className="secondary-btn ml-2" 
                  disabled={currentQIdx === questions.length - 1} 
                  onClick={() => setCurrentQIdx(c => c + 1)}
                >Next Problem</button>
            </div>
        )}
      </div>
      
      <div className="editor-panel">
        <div className="editor-header">
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="lang-select">
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
          <div className="editor-actions">
            <button className="secondary-btn">Run Code</button>
            <button className="primary-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
        
        <div className="monaco-container">
          <Editor
            height="100%"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={(val) => setCode(val)}
            options={{ minimap: { enabled: false }, fontSize: 14 }}
          />
        </div>

        {feedback && (
          <div className="feedback-panel">
            <h3>AI Code Review Score: {feedback.score}/100</h3>
            <div className="feedback-grid">
              <div className="feedback-item"><strong>Correctness:</strong> {feedback.correctness}</div>
              <div className="feedback-item"><strong>Time Complexity:</strong> {feedback.time_complexity}</div>
              <div className="feedback-item"><strong>Space Complexity:</strong> {feedback.space_complexity}</div>
              <div className="feedback-item"><strong>Optimization:</strong> {feedback.optimization}</div>
              <div className="feedback-item"><strong>Edge Cases:</strong> {feedback.edge_cases}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CodingWorkspace;
