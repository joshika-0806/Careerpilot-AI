import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, LogIn, UserPlus, LogOut, Lock, Key } from "lucide-react";

export default function AuthModal({ isOpen, onClose }) {
  const { currentUser, userUID, login, signup, loginWithGoogle, logout } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignUp) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to authenticate with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(15, 23, 42, 0.75)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: "#1e293b",
        borderRadius: "16px",
        padding: "32px",
        width: "90%",
        maxWidth: "440px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        color: "#f8fafc"
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ShieldCheck size={28} color="#38bdf8" />
            <h2 style={{ fontSize: "1.25rem", fontWeight: "700", margin: 0, color: "#f8fafc" }}>
              {currentUser ? "Security & Account" : (isSignUp ? "Create Secure Account" : "Firebase Security Login")}
            </h2>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#94a3b8",
              fontSize: "1.25rem",
              cursor: "pointer"
            }}
          >
            ✕
          </button>
        </div>

        {/* Security Badge Banner */}
        <div style={{
          backgroundColor: "rgba(56, 189, 248, 0.1)",
          border: "1px solid rgba(56, 189, 248, 0.3)",
          borderRadius: "8px",
          padding: "12px 14px",
          marginBottom: "20px",
          fontSize: "0.85rem",
          color: "#7dd3fc"
        }}>
          <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
            <Lock size={14} /> End-to-End PII Isolation
          </div>
          <div style={{ marginTop: "4px", fontSize: "0.8rem", color: "#cbd5e1" }}>
            Resumes and report metrics are isolated strictly to your Firebase Auth UID using Firestore & Storage Security Rules.
          </div>
        </div>

        {currentUser ? (
          <div>
            <div style={{ backgroundColor: "#0f172a", padding: "16px", borderRadius: "8px", marginBottom: "20px" }}>
              <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Logged In As</div>
              <div style={{ fontWeight: 600, color: "#38bdf8", wordBreak: "break-all" }}>{currentUser.email}</div>
              <div style={{ marginTop: "8px", fontSize: "0.85rem", color: "#94a3b8" }}>User UID (Isolated Sandbox)</div>
              <code style={{ fontSize: "0.75rem", backgroundColor: "#1e293b", padding: "4px 8px", borderRadius: "4px", color: "#4ade80", display: "inline-block", marginTop: "4px" }}>
                {userUID}
              </code>
            </div>

            <button
              onClick={() => { logout(); onClose(); }}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#ef4444",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                color: "#fca5a5",
                padding: "10px",
                borderRadius: "6px",
                marginBottom: "14px",
                fontSize: "0.85rem"
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "6px" }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@careerpilot.ai"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                  backgroundColor: "#0f172a",
                  color: "#f8fafc",
                  outline: "none"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "6px" }}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                  backgroundColor: "#0f172a",
                  color: "#f8fafc",
                  outline: "none"
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "12px"
              }}
            >
              {isSignUp ? <UserPlus size={18} /> : <LogIn size={18} />}
              {loading ? "Authenticating..." : (isSignUp ? "Register Account" : "Sign In with Firebase")}
            </button>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#334155",
                color: "#f8fafc",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "16px"
              }}
            >
              <Key size={18} color="#ea4335" /> Continue with Google
            </button>

            <div style={{ textAlign: "center", fontSize: "0.85rem", color: "#94a3b8" }}>
              {isSignUp ? "Already have an account?" : "Need an isolated user sandbox?"}{" "}
              <span
                onClick={() => setIsSignUp(!isSignUp)}
                style={{ color: "#38bdf8", cursor: "pointer", fontWeight: 600, textDecoration: "underline" }}
              >
                {isSignUp ? "Sign In" : "Create Account"}
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
