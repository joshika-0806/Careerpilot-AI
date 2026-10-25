import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { uploadResume, analyzeResume } from "../services/api";
import JobRoleDropDown from "./JobRoleDropDown";
import { ShieldCheck } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function UploadCard() {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const isValidFile = (candidate) => {
    const extension = candidate.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "docx"].includes(extension)) {
      alert("Please upload a PDF or DOCX file.");
      return false;
    }
    if (candidate.size > MAX_FILE_SIZE) {
      alert("The resume must be 5 MB or smaller.");
      return false;
    }
    return true;
  };

  // ── Drag handlers ───────────────────────────────────────────
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && isValidFile(dropped)) {
      setFile(dropped);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && isValidFile(selected)) setFile(selected);
  };

  // ── Upload + Analyze ────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload your resume first.");
      return;
    }
    if (!category) {
      alert("Please select a target job role.");
      return;
    }

    setIsLoading(true);

    try {
      // STEP 1: Upload the file with UID headers via api service
      setLoadingStep("Encrypting & Uploading resume…");
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("category", category);

      const uploadRes = await uploadResume(formData);

      if (!uploadRes.data.success) {
        alert(uploadRes.data.error || "Upload failed.");
        return;
      }

      const filename = uploadRes.data.filename;
      const txHash = uploadRes.data.blockchain?.tx_hash;

      // STEP 2: Run ATS analysis
      setLoadingStep("Analyzing resume against " + category + "…");
      const analyzeRes = await analyzeResume(filename, category, txHash);

      const report = analyzeRes.data.report;

      if (!report) {
        alert("Analysis failed. No report returned.");
        return;
      }

      // STEP 3: Navigate to report page
      navigate("/report", { state: { report } });

    } catch (err) {
      console.error(err);
      const responseMessage =
        err.response?.data?.error || err.response?.data?.message;
      if (err.response) {
        alert(
          `Backend request failed (${err.response.status}): ${
            responseMessage || "The server could not process the request."
          }`
        );
      } else {
        const apiUrl =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        alert(
          `Could not reach the backend at ${apiUrl}. Check your connection and try again. If this is the first request in a while, the free backend may need up to a minute to wake up.`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="upload-container">
      <div className="glass-card">
        {/* Job Role Selector */}
        <JobRoleDropDown
          value={category}
          onChange={setCategory}
          disabled={isLoading}
        />

        {/* Dropzone */}
        <div className="form-group">
          <label className="form-label">📄 Upload Resume</label>
          <div
            className={`dropzone ${isDragging ? "active" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isLoading && fileInputRef.current?.click()}
          >
            <span className="dropzone-icon">{file ? "✅" : "📂"}</span>
            {file ? (
              <>
                <p className="dropzone-text">
                  <strong style={{ color: "var(--secondary)" }}>{file.name}</strong>
                </p>
                <p className="dropzone-hint">
                  {(file.size / 1024).toFixed(1)} KB · Click to change file
                </p>
              </>
            ) : (
              <>
                <p className="dropzone-text">
                  <strong>Drag & drop</strong> your resume here, or <strong style={{ color: "var(--primary)" }}>browse</strong>
                </p>
                <p className="dropzone-hint">Supports PDF and DOCX · Max 5 MB</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Analyze Button */}
        <button
          className="btn-primary"
          onClick={handleAnalyze}
          disabled={isLoading || !file || !category}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              <span>{loadingStep}</span>
            </>
          ) : (
            <>
              <span>🚀 Analyze Resume</span>
            </>
          )}
        </button>

        {/* Security & Privacy Badge */}
        {!isLoading && (
          <div style={{
            marginTop: "16px",
            padding: "10px 14px",
            backgroundColor: "rgba(30, 41, 59, 0.6)",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.8rem",
            color: "#94a3b8",
            justifyContent: "center"
          }}>
            <ShieldCheck size={16} color="#38bdf8" />
            <span>
              Resumes isolated by Firebase Auth UID. Only SHA-256 hashes are logged to blockchain.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadCard;