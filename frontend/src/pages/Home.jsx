import UploadCard from "../components/UploadCard";

function Home() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-badge">
          <span>🚀 Smart Resume Analytics</span>
        </div>
        <h1 className="hero-title">
          Land More Interviews with <br />
          <span className="gradient-text">CareerPilot AI</span>
        </h1>
        <p className="hero-subtitle">
          Optimize your resume for applicant tracking systems, verify skill gaps for your target job role, and get actionable recommendations in seconds.
        </p>
      </section>

      <UploadCard />

      <section id="features" className="features-section">
        <h2 className="features-title">Core Capability Breakdown</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>ATS Score Estimation</h3>
            <p>Heuristics-driven grading evaluate your profile structure, skills count, experience level, and project descriptions.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Target Role Matching</h3>
            <p>Select your targeted job role to identify exactly which core skills are matching or missing from your resume.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>Actionable Guidance</h3>
            <p>Get customized steps to restructure sections, expand project descriptions, and fill critical skill sets.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;