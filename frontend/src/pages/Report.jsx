import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";

import ATSCard       from "../components/ATSCard";
import SummaryCard   from "../components/SummaryCard";
import SkillCard     from "../components/SkillCard";
import SuggestionCard from "../components/SuggestionCard";

import "../styles/Report.css";

function Report() {
  const { state } = useLocation();
  const navigate  = useNavigate();

  const [report,    setReport]    = useState(state?.report || null);
  const [loading,   setLoading]   = useState(!state?.report);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!report) {
      const fetch = async () => {
        try {
          const res = await API.get("/report/latest");
          setReport(res.data);
        } catch (err) {
          console.error("Error loading report:", err);
        } finally {
          setLoading(false);
        }
      };
      fetch();
    }
  }, [report]);

  // ── Loading ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="report-loading">
        <div className="large-spinner" />
        <h2>Generating Your Report…</h2>
        <p className="info-label">Analysing resume against target role</p>
      </div>
    );
  }

  // ── No Report ──────────────────────────────────────────────
  if (!report) {
    return (
      <div className="report-error">
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📭</div>
        <h2 style={{ fontFamily: "var(--font-heading)", marginBottom: "12px" }}>
          No Report Found
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "28px" }}>
          Please upload a resume first to generate your assessment.
        </p>
        <button
          className="btn-primary"
          style={{ width: "auto", padding: "12px 28px" }}
          onClick={() => navigate("/")}
        >
          ← Upload a Resume
        </button>
      </div>
    );
  }

  const { parsed_data, ats_score, sub_scores, job_role, filename,
          matching_skills, missing_skills, strengths, weaknesses, suggestions, blockchain } = report;

  const TABS = [
    { id: "overview",   label: "📊 Overview" },
    { id: "skills",     label: "🎯 Skills" },
    { id: "feedback",   label: "💡 Feedback" },
    { id: "blockchain", label: "🔗 Verification" },
    { id: "raw",        label: "📄 Raw Text" },
  ];

  return (
    <div className="report-page">

      {/* ─── Header ─── */}
      <div className="report-header">
        <div className="report-header-meta">
          <span className="report-badge">📄 Resume Assessment</span>
          <h1 className="report-title">Analysis Report</h1>
          <p className="report-subtitle">
            <span>Target Role:</span>
            <span className="role-tag">{job_role}</span>
            <span className="sep">·</span>
            <span className="file-tag">{filename}</span>
          </p>
        </div>
      </div>

      {/* ─── Dashboard Grid ─── */}
      <div className="dashboard-grid">

        {/* ════ SIDEBAR ════ */}
        <aside className="dashboard-sidebar">
          <ATSCard
            atsScore={ats_score}
            subScores={sub_scores}
            jobRole={job_role}
          />
          <SummaryCard parsedData={parsed_data} />
        </aside>

        {/* ════ MAIN ════ */}
        <div className="dashboard-main">

          {/* Tabs */}
          <div className="tabs-container">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── TAB: Overview ── */}
          {activeTab === "overview" && (
            <div className="tab-content">
              <div className="glass-card overview-summary">
                <div className="section-header">
                  <span className="section-icon">🏆</span>
                  <h3>Quick Summary</h3>
                </div>
                <div className="overview-stats">
                  <div className="stat-pill">
                    <span className="stat-value" style={{ color: "#10b981" }}>{matching_skills.length}</span>
                    <span className="stat-label">Skills Matched</span>
                  </div>
                  <div className="stat-divider" />
                  <div className="stat-pill">
                    <span className="stat-value" style={{ color: "#ef4444" }}>{missing_skills.length}</span>
                    <span className="stat-label">Skills Missing</span>
                  </div>
                  <div className="stat-divider" />
                  <div className="stat-pill">
                    <span className="stat-value" style={{ color: "#8b5cf6" }}>{strengths.length}</span>
                    <span className="stat-label">Strengths</span>
                  </div>
                  <div className="stat-divider" />
                  <div className="stat-pill">
                    <span className="stat-value" style={{ color: "#f59e0b" }}>{suggestions.length}</span>
                    <span className="stat-label">Suggestions</span>
                  </div>
                </div>
              </div>

              {/* Top skills preview */}
              <SkillCard
                matchingSkills={matching_skills}
                missingSkills={missing_skills}
                jobRole={job_role}
              />

              {/* Top suggestions preview */}
              {suggestions.length > 0 && (
                <div className="glass-card">
                  <div className="section-header">
                    <span className="section-icon">💡</span>
                    <h3>Top Suggestions</h3>
                  </div>
                  <div className="checklist-list">
                    {suggestions.slice(0, 3).map((s, i) => (
                      <div key={i} className="checklist-item suggestion">
                        <span className="checklist-icon">💡</span>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                  {suggestions.length > 3 && (
                    <button
                      className="btn-secondary"
                      style={{ marginTop: "12px", fontSize: "0.85rem", padding: "8px 16px" }}
                      onClick={() => setActiveTab("feedback")}
                    >
                      View all {suggestions.length} suggestions →
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── TAB: Skills ── */}
          {activeTab === "skills" && (
            <div className="tab-content">
              <SkillCard
                matchingSkills={matching_skills}
                missingSkills={missing_skills}
                jobRole={job_role}
              />
            </div>
          )}

          {/* ── TAB: Feedback ── */}
          {activeTab === "feedback" && (
            <div className="tab-content">
              <SuggestionCard
                strengths={strengths}
                weaknesses={weaknesses}
                suggestions={suggestions}
              />
            </div>
          )}


          {/* ── TAB: Blockchain ── */}
          {activeTab === "blockchain" && (
            <div className="tab-content">
              <div className="glass-card">
                <div className="section-header">
                  <span className="section-icon">🔗</span>
                  <h3>Blockchain Verification</h3>
                </div>
                {blockchain?.secured ? (
                  <div className="blockchain-status success">
                    <p style={{ color: "#10b981", fontWeight: 600 }}>✅ Your resume integrity is secured on the blockchain.</p>
                    <div style={{ background: "rgba(16, 185, 129, 0.1)", padding: "16px", borderRadius: "8px", marginTop: "12px", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                      <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "var(--text-secondary)" }}>Transaction Hash:</p>
                      <code style={{ wordBreak: "break-all", color: "var(--primary)", background: "transparent", padding: 0 }}>{blockchain.tx_hash}</code>
                    </div>
                  </div>
                ) : (
                  <div className="blockchain-status pending">
                    <p style={{ color: "#f59e0b" }}>⚠️ Blockchain verification not available for this upload.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB: Raw Text ── */}
          {activeTab === "raw" && (
            <div className="tab-content">
              <div className="glass-card">
                <div className="section-header">
                  <span className="section-icon">📄</span>
                  <h3>Extracted Resume Text</h3>
                </div>
                <div className="parsed-text-box">
                  {parsed_data.text || "No raw text available."}
                </div>
              </div>
            </div>
          )}

          {/* ─── Action Bar ─── */}
          <div className="action-bar">
            <span className="action-bar-left">
              Report for <strong>{filename}</strong>
            </span>
            <div className="action-bar-right">
              <button className="btn-secondary" onClick={() => navigate("/")}>
                ← Analyze New Resume
              </button>
              <button
                className="btn-primary"
                onClick={() => window.print()}
                style={{ width: "auto" }}
              >
                🖨️ Download PDF
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Report;