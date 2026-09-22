import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import { UserCheck, Lock } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const { currentUser, userUID } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <header className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            <span className="logo-icon">🚀</span>
            <span className="logo-text">CareerPilot <span className="highlight">AI</span></span>
          </div>
          <nav className="navbar-links" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link to="/" className="nav-link">Home</Link>
            <a href="#features" className="nav-link" onClick={() => navigate("/")}>Features</a>
            <Link to="/interview" className="nav-link">Interview Prep</Link>
            
            {/* Firebase Auth & Security Status Button */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "20px",
                backgroundColor: currentUser ? "rgba(34, 197, 94, 0.15)" : "rgba(56, 189, 248, 0.15)",
                border: currentUser ? "1px solid rgba(34, 197, 94, 0.4)" : "1px solid rgba(56, 189, 248, 0.4)",
                color: currentUser ? "#4ade80" : "#38bdf8",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {currentUser ? <UserCheck size={16} /> : <Lock size={16} />}
              {currentUser ? `UID: ${userUID.substring(0, 8)}...` : "Firebase Auth"}
            </button>

            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="nav-link nav-btn">
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}

export default Navbar;
