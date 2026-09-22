import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Code, BookOpen, MonitorPlay, BrainCircuit, Users, ShieldAlert, Sparkles, Send, CheckCircle2, Zap, Cpu, Award, Settings, Target, Feather, Globe, Flame } from "lucide-react";
import API from "../services/api";

function CompanyPrep() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [customData, setCustomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeHints, setActiveHints] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  
  // HR / Behavioral Interview state
  const [behavioralAnswers, setBehavioralAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [evaluating, setEvaluating] = useState({});

  const CUSTOM_COMPANIES = ["accenture", "google", "amazon", "microsoft", "capgemini", "tcs", "cognizant (cts)", "cognizant", "wipro", "infosys", "zoho"];

  useEffect(() => {
    API.get(`/api/interview/company/${id}/summary`)
      .then(res => {
        const resData = res.data;
        setData(resData);
        const companyName = resData?.company?.name?.toLowerCase();
        if (CUSTOM_COMPANIES.includes(companyName) || (companyName && companyName.includes("cognizant"))) {
          API.get(`/api/interview/company/${id}/all-questions`)
            .then(allRes => {
              setCustomData(allRes.data);
              setLoading(false);
            })
            .catch(err => {
              console.error(`Error fetching ${companyName} questions:`, err);
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Error fetching company summary:", err);
        setLoading(false);
      });
  }, [id]);

  const toggleHint = (qId) => {
    setActiveHints(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const handleOptionSelect = (qId, optionIdx) => {
    setSelectedOptions(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const handleBehavioralChange = (qId, text) => {
    setBehavioralAnswers(prev => ({
      ...prev,
      [qId]: text
    }));
  };

  const submitBehavioralEvaluation = (qId, questionStatement) => {
    const userResp = behavioralAnswers[qId] || "";
    if (!userResp.trim()) return;

    setEvaluating(prev => ({ ...prev, [qId]: true }));
    API.post("/api/interview/behavioral/evaluate", {
      question: questionStatement,
      response: userResp
    })
      .then(res => {
        setEvaluations(prev => ({ ...prev, [qId]: res.data }));
        setEvaluating(prev => ({ ...prev, [qId]: false }));
      })
      .catch(err => {
        console.error("Error evaluating response:", err);
        setEvaluating(prev => ({ ...prev, [qId]: false }));
      });
  };

  const getOptionsList = (optionsData) => {
    if (!optionsData) return [];
    if (Array.isArray(optionsData)) return optionsData;
    if (typeof optionsData === 'string') {
      try {
        const parsed = JSON.parse(optionsData);
        if (Array.isArray(parsed)) return parsed;
      } catch (_e) {
        return optionsData.split('\n').map(o => o.trim()).filter(Boolean);
      }
    }
    return [];
  };

  const getDifficultyClass = (diff) => {
    if (!diff) return 'medium';
    const lower = diff.toLowerCase();
    if (lower === 'very hard') return 'very-hard';
    return lower;
  };

  const getIcon = (catName) => {
    const lower = catName.toLowerCase();
    if (lower.includes("coding") || lower.includes("dsa") || lower.includes("algorithm")) return <Code size={32} />;
    if (lower.includes("hr") || lower.includes("behavioral") || lower.includes("leadership")) return <Users size={32} />;
    if (lower.includes("os") || lower.includes("system")) return <MonitorPlay size={32} />;
    return <BookOpen size={32} />;
  };

  const getPath = (cat) => {
    const lower = cat.name.toLowerCase();
    if (lower.includes("coding") || lower.includes("dsa") || lower.includes("algorithm")) {
      return `/interview/coding/${id}?cat=${cat.id}`;
    }
    if (lower.includes("hr") || lower.includes("behavioral") || lower.includes("leadership")) {
      return `/interview/hr?company=${id}&cat=${cat.id}`;
    }
    return `/interview/technical/${id}?cat=${cat.id}`;
  };

  if (loading) return <div className="company-prep-page"><h2>Loading company details...</h2></div>;
  if (!data) return <div className="company-prep-page"><h2>Error loading data.</h2></div>;

  const companyName = data.company.name.toLowerCase();
  const isCustomCompany = CUSTOM_COMPANIES.includes(companyName) || companyName.includes("cognizant");

  if (isCustomCompany) {
    const sections = customData?.sections || {};
    const techQuestions = sections["Technical"] || [];
    const quantQuestions = sections["Quantitative Aptitude"] || [];
    const behavioralQuestions = sections["HR Questions"] || sections["Behavioral Questions"] || [];
    const totalQuestions = techQuestions.length + quantQuestions.length + behavioralQuestions.length;

    const isGoogle = companyName === "google";
    const isAmazon = companyName === "amazon";
    const isMicrosoft = companyName === "microsoft";
    const isCapgemini = companyName === "capgemini";
    const isTcs = companyName === "tcs";
    const isCognizant = companyName.includes("cognizant");
    const isWipro = companyName === "wipro";
    const isInfosys = companyName === "infosys";
    const isZoho = companyName === "zoho";

    let pageClass = "accenture-prep-page";
    let sectionClass = "accenture-section";
    let cardClass = "accenture-card";
    let subtitle = "Simulate the official assessment experience with Technical and Quantitative Aptitude modules.";

    if (isGoogle) {
      pageClass = "google-prep-page";
      sectionClass = "google-section";
      cardClass = "google-card";
      subtitle = "Prepare for the most challenging technical interviews in the industry. Google-level questions emphasizing deep analytical thinking and optimization.";
    } else if (isAmazon) {
      pageClass = "amazon-prep-page";
      sectionClass = "amazon-section";
      cardClass = "amazon-card";
      subtitle = "Master Amazon's rigorous technical standards, quantitative reasoning, and Leadership Principles with interactive AI-driven evaluation.";
    } else if (isMicrosoft) {
      pageClass = "microsoft-prep-page";
      sectionClass = "microsoft-section";
      cardClass = "microsoft-card";
      subtitle = "Master Microsoft's core engineering principles, computer science fundamentals, logical problem solving, and interactive AI behavioral feedback.";
    } else if (isCapgemini) {
      pageClass = "capgemini-prep-page";
      sectionClass = "capgemini-section";
      cardClass = "capgemini-card";
      subtitle = "Prepare for Capgemini's recruitment process covering programming fundamentals, quantitative aptitude, core CS concepts, and structured HR interview practice.";
    } else if (isTcs) {
      pageClass = "tcs-prep-page";
      sectionClass = "tcs-section";
      cardClass = "tcs-card";
      subtitle = "Simulate the official TCS recruitment assessment with Technical, Quantitative Aptitude, and HR interview modules.";
    } else if (isCognizant) {
      pageClass = "cognizant-prep-page";
      sectionClass = "cognizant-section";
      cardClass = "cognizant-card";
      subtitle = "Prepare for Cognizant's (CTS) recruitment process with Technical, Quantitative Aptitude, and HR interview practice.";
    } else if (isWipro) {
      pageClass = "wipro-prep-page";
      sectionClass = "wipro-section";
      cardClass = "wipro-card";
      subtitle = "Simulate the official Wipro recruitment assessment with Technical, Quantitative Aptitude, and HR interview modules.";
    } else if (isInfosys) {
      pageClass = "infosys-prep-page";
      sectionClass = "infosys-section";
      cardClass = "infosys-card";
      subtitle = "Simulate the official Infosys recruitment assessment with Technical, Quantitative Aptitude, and HR interview modules.";
    } else if (isZoho) {
      pageClass = "zoho-prep-page";
      sectionClass = "zoho-section";
      cardClass = "zoho-card";
      subtitle = "Master Zoho's core engineering principles, algorithmic problem solving, logical reasoning, and interactive AI technical discussion evaluations.";
    }

    return (
      <div className={`company-prep-page ${pageClass}`}>
        <div className="prep-header">
          <h1>{data.company.name} Interview Preparation</h1>
          <p className="page-subtitle">{subtitle}</p>
          {isGoogle && (
            <div className="google-difficulty-banner">
              <ShieldAlert size={18} className="banner-icon" />
              <span>🔥 HIGHEST DIFFICULTY — Very Hard Level Questions</span>
            </div>
          )}
          {isAmazon && (
            <div className="amazon-difficulty-banner">
              <Zap size={18} className="banner-icon" />
              <span>⚡ HARD DIFFICULTY — Problem Solving, Optimization & Leadership Principles</span>
            </div>
          )}
          {isMicrosoft && (
            <div className="microsoft-difficulty-banner">
              <Cpu size={18} className="banner-icon" />
              <span>💻 HARD DIFFICULTY — Software Engineering, CS Fundamentals & System Design</span>
            </div>
          )}
          {isCapgemini && (
            <div className="capgemini-difficulty-banner">
              <Award size={18} className="banner-icon" />
              <span>🌱 EASY TO MEDIUM DIFFICULTY — Programming Fundamentals & CS Concepts</span>
            </div>
          )}
          {isTcs && (
            <div className="tcs-difficulty-banner">
              <Settings size={18} className="banner-icon" />
              <span>⚙️ MEDIUM DIFFICULTY — TCS Campus Recruitment & Technical Pattern</span>
            </div>
          )}
          {isCognizant && (
            <div className="cognizant-difficulty-banner">
              <Target size={18} className="banner-icon" />
              <span>⚙️ MEDIUM DIFFICULTY — Cognizant Campus Recruitment & Technical Pattern</span>
            </div>
          )}
          {isWipro && (
            <div className="wipro-difficulty-banner">
              <Feather size={18} className="banner-icon" />
              <span>🌱 EASY TO MEDIUM DIFFICULTY — Wipro Campus Recruitment & Aptitude Pattern</span>
            </div>
          )}
          {isInfosys && (
            <div className="infosys-difficulty-banner">
              <Globe size={18} className="banner-icon" />
              <span>⚙️ MEDIUM DIFFICULTY — Infosys Campus Recruitment & Technical Pattern</span>
            </div>
          )}
          {isZoho && (
            <div className="zoho-difficulty-banner">
              <Flame size={18} className="banner-icon" />
              <span>🔥 HARD DIFFICULTY — Advanced Algorithmic Coding & Technical Depth</span>
            </div>
          )}
          <div className="overall-progress">
            <span>Total Questions: {totalQuestions}</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "0%" }}></div>
            </div>
          </div>
        </div>

        {/* SECTION 1: Technical */}
        <section className={`${sectionClass} mb-6`}>
          <div className="section-header">
            <Code size={24} className="section-icon" />
            <h2>Technical</h2>
            <span className="q-count-badge">{techQuestions.length} Questions</span>
          </div>

          <div className="questions-list">
            {techQuestions.map((q, idx) => (
              <div key={q.id || idx} className={`question-card ${cardClass}`}>
                <div className="q-header">
                  <div className="q-title-box">
                    <span className="q-number">Question {idx + 1}</span>
                    <span className={`difficulty ${getDifficultyClass(q.difficulty)}`}>
                      {q.difficulty || 'Hard'}
                    </span>
                  </div>
                  <button
                    className="hint-btn"
                    onClick={() => toggleHint(q.id)}
                    type="button"
                  >
                    {activeHints[q.id] ? "💡 Hide Hint" : "💡 Show Hint"}
                  </button>
                </div>
                <div className="q-body-content">
                  <p className="q-statement">{q.problem_statement}</p>
                  {activeHints[q.id] && q.hint && (
                    <div className="ai-section hint-box mt-3">
                      <h4>💡 Hint:</h4>
                      <p>{q.hint}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: Quantitative Aptitude */}
        <section className={`${sectionClass} mb-6`}>
          <div className="section-header">
            <BrainCircuit size={24} className="section-icon" />
            <h2>Quantitative Aptitude</h2>
            <span className="q-count-badge">{quantQuestions.length} Questions</span>
          </div>

          <div className="questions-list">
            {quantQuestions.map((q, idx) => {
              const options = getOptionsList(q.options);
              return (
                <div key={q.id || idx} className={`question-card ${cardClass}`}>
                  <div className="q-header">
                    <div className="q-title-box">
                      <span className="q-number">Question {idx + 1}</span>
                      <span className={`difficulty ${getDifficultyClass(q.difficulty)}`}>
                        {q.difficulty || 'Hard'}
                      </span>
                    </div>
                    <button
                      className="hint-btn"
                      onClick={() => toggleHint(q.id)}
                      type="button"
                    >
                      {activeHints[q.id] ? "💡 Hide Hint" : "💡 Show Hint"}
                    </button>
                  </div>
                  <div className="q-body-content">
                    <p className="q-statement">{q.problem_statement}</p>

                    {options.length > 0 && (
                      <div className="options-grid mt-3">
                        {options.map((opt, optIdx) => {
                          const isSelected = selectedOptions[q.id] === optIdx;
                          const cleanText = typeof opt === 'string' ? opt.replace(/^[A-D]\)\s*/, '') : opt;
                          return (
                            <div
                              key={optIdx}
                              className={`option-item ${isSelected ? 'selected' : ''}`}
                              onClick={() => handleOptionSelect(q.id, optIdx)}
                            >
                              <span className="option-label">{String.fromCharCode(65 + optIdx)}</span>
                              <span className="option-text">{cleanText}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {activeHints[q.id] && q.hint && (
                      <div className="ai-section hint-box mt-3">
                        <h4>💡 Hint:</h4>
                        <p>{q.hint}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: HR / Technical Discussion */}
        {behavioralQuestions.length > 0 && (
          <section className={sectionClass}>
            <div className="section-header">
              <Users size={24} className="section-icon" />
              <h2>{(isCapgemini || isTcs || isCognizant || isWipro || isInfosys) ? "HR Interview" : (isZoho ? "HR & Technical Discussion" : "Behavioral Interview")}</h2>
              <span className="q-count-badge">{behavioralQuestions.length} Questions</span>
            </div>

            <div className="questions-list">
              {behavioralQuestions.map((q, idx) => {
                const qId = q.id || `beh-${idx}`;
                const userAns = behavioralAnswers[qId] || "";
                const evaluation = evaluations[qId];
                const isSubmitting = evaluating[qId];

                return (
                  <div key={qId} className={`question-card ${cardClass} behavioral-card`}>
                    <div className="q-header">
                      <div className="q-title-box">
                        <span className="q-number">Question {idx + 1}</span>
                        <span className={`difficulty ${getDifficultyClass(q.difficulty)}`}>
                          {q.difficulty || 'Hard'}
                        </span>
                      </div>
                      <button
                        className="hint-btn"
                        onClick={() => toggleHint(qId)}
                        type="button"
                      >
                        {activeHints[qId] ? "💡 Hide Hint" : "💡 Show Hint"}
                      </button>
                    </div>
                    <div className="q-body-content">
                      <p className="q-statement">{q.problem_statement}</p>

                      {activeHints[qId] && q.hint && (
                        <div className="ai-section hint-box mt-3">
                          <h4>💡 Hint:</h4>
                          <p>{q.hint}</p>
                        </div>
                      )}

                      <div className="behavioral-response-box mt-4">
                        <label className="response-label">
                          <Sparkles size={16} className="sparkle-icon" />
                          <span>Your Response:</span>
                        </label>
                        <textarea
                          className="behavioral-textarea"
                          rows={4}
                          placeholder="Type your detailed response here..."
                          value={userAns}
                          onChange={(e) => handleBehavioralChange(qId, e.target.value)}
                        />
                        <div className="behavioral-actions">
                          <button
                            className="submit-eval-btn"
                            disabled={!userAns.trim() || isSubmitting}
                            onClick={() => submitBehavioralEvaluation(qId, q.problem_statement)}
                            type="button"
                          >
                            {isSubmitting ? (
                              <span>Analyzing with AI...</span>
                            ) : (
                              <>
                                <Send size={16} />
                                <span>Submit for AI Evaluation</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* AI EVALUATION DISPLAY */}
                        {evaluation && (
                          <div className="ai-eval-results-card mt-4">
                            <div className="eval-header">
                              <div className="eval-score-badge">
                                <CheckCircle2 size={18} />
                                <span>AI Score: {evaluation.score} / 100</span>
                              </div>
                              <h3 className="eval-title">Evaluation Feedback</h3>
                            </div>

                            <div className="eval-grid mt-3">
                              <div className="eval-item">
                                <strong>Communication:</strong>
                                <p>{evaluation.communication}</p>
                              </div>
                              <div className="eval-item">
                                <strong>Clarity:</strong>
                                <p>{evaluation.clarity}</p>
                              </div>
                              <div className="eval-item">
                                <strong>Problem-Solving Approach:</strong>
                                <p>{evaluation.problem_solving || evaluation.structure}</p>
                              </div>
                              <div className="eval-item">
                                <strong>Confidence:</strong>
                                <p>{evaluation.confidence}</p>
                              </div>
                              <div className="eval-item">
                                <strong>Technical Depth:</strong>
                                <p>{evaluation.technical_depth || evaluation.professionalism || evaluation.structure}</p>
                              </div>
                            </div>

                            <div className="eval-item improvement-box mt-3">
                              <strong>Areas for Improvement:</strong>
                              <p>{evaluation.areas_for_improvement}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="company-prep-page">
      <div className="prep-header">
        <h1>{data.company.name} Preparation</h1>
        <div className="overall-progress">
          <span>Total Questions: {data.company.total_questions}</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "0%" }}></div>
          </div>
        </div>
      </div>

      <div className="category-grid">
        {data.categories.map(cat => (
          <div key={cat.id} className="category-card" onClick={() => navigate(getPath(cat))}>
            <div className="cat-icon">{getIcon(cat.name)}</div>
            <h3>{cat.name}</h3>
            <div className="cat-stats">
              <span>Questions: {cat.total}</span>
              <div className="progress-bar sm">
                <div className="progress-fill" style={{ width: `0%` }}></div>
              </div>
            </div>
          </div>
        ))}
        <div className="category-card" onClick={() => navigate(`/interview/mock?company=${id}`)}>
          <div className="cat-icon"><BrainCircuit size={32} /></div>
          <h3>Mock Interview</h3>
          <div className="cat-stats">
            <span>Simulate a full {data.company.name} interview</span>
            <div className="progress-bar sm">
              <div className="progress-fill" style={{ width: `0%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyPrep;
