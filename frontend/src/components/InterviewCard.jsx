import { useState } from "react";

/**
 * Interview question bank keyed by job role keyword.
 * Populated with common questions per domain.
 */
const QUESTION_BANK = {
  "software": [
    "Explain the difference between REST and GraphQL APIs.",
    "What is the time complexity of binary search and when would you use it?",
    "How does garbage collection work in Java/Python?",
    "Describe the SOLID principles with an example.",
    "What is the difference between SQL and NoSQL databases?",
    "How would you design a URL shortening service like bit.ly?",
    "Explain the concept of microservices vs monolithic architecture.",
    "What happens when you type a URL into a browser?",
  ],
  "data": [
    "What is the difference between supervised and unsupervised learning?",
    "Explain overfitting and how to prevent it.",
    "What is the bias-variance tradeoff?",
    "How does a Random Forest differ from a single Decision Tree?",
    "What is cross-validation and why is it important?",
    "Explain the concept of gradient descent.",
    "How would you handle an imbalanced dataset?",
    "What is the difference between precision and recall?",
  ],
  "frontend": [
    "What is the Virtual DOM and how does React use it?",
    "Explain the difference between CSS Flexbox and Grid.",
    "What are React hooks and why were they introduced?",
    "How does event bubbling work in JavaScript?",
    "What is the difference between `==` and `===` in JavaScript?",
    "Explain the concept of closures in JavaScript.",
    "What is lazy loading and how does it improve performance?",
    "How would you optimize a slow-loading web page?",
  ],
  "backend": [
    "What is the difference between authentication and authorization?",
    "How do you prevent SQL injection attacks?",
    "Explain database indexing and its impact on performance.",
    "What is a RESTful API and what are its constraints?",
    "How does JWT (JSON Web Token) authentication work?",
    "What is the N+1 query problem and how do you solve it?",
    "Explain the CAP theorem in distributed systems.",
    "What is the difference between vertical and horizontal scaling?",
  ],
  "cloud": [
    "What is the difference between IaaS, PaaS, and SaaS?",
    "Explain the concept of containerization with Docker.",
    "What is Kubernetes and what problems does it solve?",
    "How does CI/CD improve software development?",
    "What is Infrastructure as Code (IaC)?",
    "Explain blue-green deployment strategy.",
    "What are the key differences between AWS EC2 and Lambda?",
    "How would you monitor a production application?",
  ],
  "security": [
    "What is the OWASP Top 10 and why is it important?",
    "Explain the difference between symmetric and asymmetric encryption.",
    "What is a man-in-the-middle attack and how do you prevent it?",
    "How does HTTPS work at a high level?",
    "What is a Cross-Site Scripting (XSS) attack?",
    "Explain Cross-Site Request Forgery (CSRF) and mitigation strategies.",
    "What is a penetration test and what does it involve?",
    "What is the principle of least privilege?",
  ],
  "mobile": [
    "What is the difference between native, hybrid, and cross-platform mobile apps?",
    "How does React Native differ from Flutter?",
    "Explain the Android Activity lifecycle.",
    "What is the difference between synchronous and asynchronous code in mobile?",
    "How do you handle offline mode in a mobile application?",
    "What are the best practices for mobile UI/UX design?",
    "How would you optimize battery usage in a mobile app?",
    "Explain push notifications and how they work.",
  ],
  "default": [
    "Tell me about yourself and your most recent project.",
    "Describe a challenging technical problem you solved.",
    "How do you stay up-to-date with new technologies?",
    "Describe your ideal development workflow.",
    "How do you handle code reviews and feedback?",
    "Tell me about a time you had to learn something quickly.",
    "What motivates you as a developer?",
    "Where do you see yourself in 5 years?",
  ],
};

function getQuestions(jobRole, missingSkills) {
  const role = (jobRole || "").toLowerCase();

  let bank = QUESTION_BANK["default"];
  if (role.includes("software") || role.includes("development")) bank = QUESTION_BANK["software"];
  else if (role.includes("data") || role.includes("ai") || role.includes("machine")) bank = QUESTION_BANK["data"];
  else if (role.includes("frontend") || role.includes("front")) bank = QUESTION_BANK["frontend"];
  else if (role.includes("backend") || role.includes("back")) bank = QUESTION_BANK["backend"];
  else if (role.includes("cloud") || role.includes("devops")) bank = QUESTION_BANK["cloud"];
  else if (role.includes("security") || role.includes("cyber")) bank = QUESTION_BANK["security"];
  else if (role.includes("mobile")) bank = QUESTION_BANK["mobile"];

  // Add skill-specific questions for missing skills
  const skillQuestions = (missingSkills || []).slice(0, 3).map(
    (skill) => `How would you approach learning and applying ${skill} in a real project?`
  );

  return [...bank, ...skillQuestions];
}

/**
 * InterviewCard — Interview preparation questions tailored to the job role.
 * Props: { jobRole, missingSkills }
 */
function InterviewCard({ jobRole = "", missingSkills = [] }) {
  const questions = getQuestions(jobRole, missingSkills);
  const [revealed, setRevealed] = useState({});
  const [saved, setSaved] = useState({});

  const toggleReveal = (i) =>
    setRevealed((prev) => ({ ...prev, [i]: !prev[i] }));

  const toggleSave = (i) =>
    setSaved((prev) => ({ ...prev, [i]: !prev[i] }));

  const tips = [
    { icon: "⏱️", tip: "Use the STAR method: Situation, Task, Action, Result." },
    { icon: "📖", tip: "Review fundamentals the night before the interview." },
    { icon: "💬", tip: "Think out loud — interviewers value your reasoning process." },
    { icon: "❓", tip: "Prepare 2–3 thoughtful questions to ask your interviewer." },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Tips Row */}
      <div className="interview-tips-grid">
        {tips.map(({ icon, tip }, i) => (
          <div key={i} className="interview-tip-card">
            <span className="tip-icon">{icon}</span>
            <p>{tip}</p>
          </div>
        ))}
      </div>

      {/* Questions */}
      <div className="glass-card">
        <div className="section-header">
          <span className="section-icon">❓</span>
          <h3>
            Practice Questions
            <span className="skills-count" style={{ marginLeft: "8px" }}>
              {questions.length}
            </span>
          </h3>
        </div>

        {missingSkills.length > 0 && (
          <p className="skill-card-desc" style={{ marginBottom: "16px" }}>
            Includes questions targeting your{" "}
            <span style={{ color: "var(--danger)" }}>missing skills</span>:&nbsp;
            {missingSkills.slice(0, 3).map((s, i) => (
              <span key={i} className="skill-badge missing" style={{ fontSize: "0.78rem", padding: "2px 10px", marginRight: "4px" }}>
                {s}
              </span>
            ))}
          </p>
        )}

        <div className="question-list">
          {questions.map((q, i) => (
            <div key={i} className={`question-item ${revealed[i] ? "revealed" : ""}`}>
              <div className="question-row">
                <span className="question-num">Q{i + 1}</span>
                <p className="question-text">{q}</p>
                <div className="question-actions">
                  <button
                    className="q-action-btn"
                    title={saved[i] ? "Remove bookmark" : "Bookmark question"}
                    onClick={() => toggleSave(i)}
                  >
                    {saved[i] ? "🔖" : "📌"}
                  </button>
                  <button
                    className="q-action-btn reveal-btn"
                    onClick={() => toggleReveal(i)}
                    title={revealed[i] ? "Hide tip" : "Show hint"}
                  >
                    {revealed[i] ? "▲" : "💬"}
                  </button>
                </div>
              </div>
              {revealed[i] && (
                <div className="question-hint">
                  <span className="hint-label">💡 Hint:</span> Think about real examples from your
                  projects or coursework. Use the STAR method to structure your answer.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default InterviewCard;
