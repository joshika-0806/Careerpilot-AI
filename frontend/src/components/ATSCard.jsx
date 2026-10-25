/**
 * ATSCard — Circular gauge showing overall ATS score and sub-score breakdown.
 * Props: { atsScore, subScores, jobRole }
 */
function ATSCard({ atsScore = 0, subScores = {}, jobRole = "" }) {
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const filled = (atsScore / 100) * circumference;

  const getColor = (score) =>
    score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";

  const getBadge = (score) =>
    score >= 80
      ? { label: "Excellent Match", cls: "excellent" }
      : score >= 50
        ? { label: "Good Potential", cls: "good" }
        : { label: "Needs Improvement", cls: "poor" };

  const badge = getBadge(atsScore);
  const color = getColor(atsScore);

  const bars = [
    { label: "Technical Skills", value: subScores.skills ?? 0, max: 30 },
    { label: "Experience Depth", value: subScores.experience ?? 0, max: 20 },
    { label: "Project Outcomes", value: subScores.projects ?? 0, max: 15 },
    { label: "Academic Profile", value: subScores.education ?? 0, max: 15 },
    { label: "Profile Completeness", value: subScores.profile ?? 0, max: 20 },
  ];

  return (
    <>
      {/* ── ATS Score Gauge ── */}
      <div className="glass-card score-card">
        <h3 className="card-overline">ATS Match Score</h3>
        {jobRole && (
          <p className="card-role-tag">for <strong>{jobRole}</strong></p>
        )}
        <div className="gauge-container">
          <svg className="gauge-svg" viewBox="0 0 160 160">
            <circle className="gauge-bg" cx="80" cy="80" r={radius} />
            <circle
              className="gauge-fill"
              cx="80"
              cy="80"
              r={radius}
              style={{
                strokeDasharray: `${filled} ${circumference}`,
                stroke: color,
              }}
            />
          </svg>
          <div className="gauge-text">
            <span className="gauge-value" style={{ color }}>{atsScore}</span>
            <span className="gauge-max">/ 100</span>
          </div>
        </div>
        <div className={`score-badge ${badge.cls}`}>{badge.label}</div>
      </div>

      {/* ── Sub-score Breakdown ── */}
      <div className="glass-card subscore-card">
        <h3 className="card-overline">Score Breakdown</h3>
        {bars.map(({ label, value, max }) => (
          <div className="subscore-item" key={label}>
            <div className="subscore-header">
              <span className="subscore-label">{label}</span>
              <span className="subscore-value">
                {value}
                <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
                  /{max}
                </span>
              </span>
            </div>
            <div className="subscore-bar-bg">
              <div
                className="subscore-bar-fill"
                style={{ width: `${(value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ATSCard;
