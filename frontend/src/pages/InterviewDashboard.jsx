import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function InterviewDashboard() {
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch companies from backend
    API.get("/api/interview/companies")
      .then(res => setCompanies(res.data))
      .catch(err => console.error("Error fetching companies:", err));
  }, []);

  return (
    <div className="interview-dashboard">
      <h1 className="page-title">Company-wise Interview Preparation</h1>
      <p className="page-subtitle">Select a company to start your preparation journey</p>
      
      <div className="company-grid">
        {companies.map(company => (
          <div key={company.id} className="company-card" onClick={() => navigate(`/interview/company/${company.id}`)}>
            <div className="company-logo-container">
              {company.logo_url ? (
                <img src={company.logo_url} alt={company.name} className="company-logo" />
              ) : (
                <div className="company-logo-placeholder">{company.name.charAt(0)}</div>
              )}
            </div>
            <h3>{company.name}</h3>
            <p>Difficulty: <span className={`difficulty ${(company.difficulty || "Medium").toLowerCase().replace(/\s+/g, '-')}`}>{company.difficulty || "Medium"}</span></p>
            <p>{company.total_questions || 0} Questions</p>
            <button className="primary-btn mt-2">Start Preparation</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InterviewDashboard;
