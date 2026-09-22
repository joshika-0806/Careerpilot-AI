/**
 * SuggestionCard — Displays strengths, weaknesses, and improvement suggestions.
 * Props: { strengths, weaknesses, suggestions }
 */
function SuggestionCard({ strengths = [], weaknesses = [], suggestions = [] }) {
  return (
    <>
      {/* ── Strengths ── */}
      {strengths.length > 0 && (
        <div className="glass-card">
          <div className="section-header">
            <span className="section-icon">💪</span>
            <h3>Strengths</h3>
          </div>
          <div className="checklist-list">
            {strengths.map((item, i) => (
              <div key={i} className="checklist-item strength">
                <span className="checklist-icon">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Weaknesses ── */}
      {weaknesses.length > 0 && (
        <div className="glass-card">
          <div className="section-header">
            <span className="section-icon">⚠️</span>
            <h3>Areas to Improve</h3>
          </div>
          <div className="checklist-list">
            {weaknesses.map((item, i) => (
              <div key={i} className="checklist-item weakness">
                <span className="checklist-icon">✗</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Suggestions ── */}
      {suggestions.length > 0 && (
        <div className="glass-card">
          <div className="section-header">
            <span className="section-icon">💡</span>
            <h3>Resume Upgrade Suggestions</h3>
          </div>
          <div className="checklist-list">
            {suggestions.map((item, i) => (
              <div key={i} className="checklist-item suggestion">
                <span className="checklist-icon">💡</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {strengths.length === 0 && weaknesses.length === 0 && suggestions.length === 0 && (
        <div className="glass-card">
          <div className="empty-state">
            <span className="empty-icon">📋</span>
            <p>No feedback data available for this resume.</p>
          </div>
        </div>
      )}
    </>
  );
}

export default SuggestionCard;
