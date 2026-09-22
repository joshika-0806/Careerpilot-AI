/**
 * SkillCard — Displays matching and missing skills for the target role.
 * Props: { matchingSkills, missingSkills, jobRole }
 */
function SkillCard({ matchingSkills = [], missingSkills = [], jobRole = "" }) {
  return (
    <div className="glass-card">
      <div className="section-header">
        <span className="section-icon">🎯</span>
        <h3>Target Role Skill Assessment</h3>
      </div>

      {jobRole && (
        <p className="skill-card-desc">
          Skills required for{" "}
          <strong style={{ color: "var(--primary)" }}>{jobRole}</strong> matched
          against your resume:
        </p>
      )}

      {/* Matching Skills */}
      <p className="skills-section-title match">
        ✓ Matching Skills
        <span className="skills-count">{matchingSkills.length}</span>
      </p>
      <div className="skills-container">
        {matchingSkills.length > 0 ? (
          matchingSkills.map((skill, i) => (
            <span key={i} className="skill-badge match">
              {skill}
            </span>
          ))
        ) : (
          <div className="empty-state" style={{ padding: "12px 0" }}>
            <span>No matching skills detected for this role.</span>
          </div>
        )}
      </div>

      {/* Missing Skills */}
      <p className="skills-section-title missing" style={{ marginTop: "20px" }}>
        ✗ Missing Skills
        <span className="skills-count">{missingSkills.length}</span>
      </p>
      <div className="skills-container">
        {missingSkills.length > 0 ? (
          missingSkills.map((skill, i) => (
            <span key={i} className="skill-badge missing">
              {skill}
            </span>
          ))
        ) : (
          <p style={{ color: "var(--secondary)", fontSize: "0.9rem" }}>
            🎉 You have all the recommended skills for this role!
          </p>
        )}
      </div>
    </div>
  );
}

export default SkillCard;
