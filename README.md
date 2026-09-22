# CareerPilot AI

> **Enterprise-Grade Resume Intelligence, ATS Analytics & AI-Driven Interview Preparation Platform**

CareerPilot AI is a full-stack career acceleration platform powered by AI resume parsing, automated Applicant Tracking System (ATS) matching, cryptographic SHA-256 blockchain verification, and real-time user data synchronization via Firebase Admin SDK and Google Cloud Firestore.

---

## 🏛 System Architecture

```
                                  ┌──────────────────────────────┐
                                  │      React 19 + Vite App     │
                                  └──────────────┬───────────────┘
                                                 │
                                                 │ HTTP / REST APIs
                                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   Flask REST API Gateway (Port 5000)                             │
├──────────────────────────┬─────────────────────────────┬──────────────────────────┬─────────────┤
│   Firebase Auth & SDK    │   Resume Parsing & ATS      │   Blockchain Integrity   │  Interview  │
│  @require_auth Decorator │   PyMuPDF / spaCy Engine    │   SHA-256 Hash Ledger    │  Q&A Engine │
└────────────┬─────────────┴──────────────┬──────────────┴────────────┬─────────────┴──────┬──────┘
             │                            │                           │                    │
             ▼                            ▼                           ▼                    ▼
┌──────────────────────────┐ ┌──────────────────────────┐ ┌───────────────────┐ ┌──────────────┐
│  Google Cloud Firestore  │ │    User Uploads Storage  │ │ Blockchain Ledger │ │  SQLite DB   │
│   (users/{uid}/ profile) │ │ (/uploads/{userUID}/)    │ │ (SHA-256 Hashes)  │ │ (Q&A Bank)   │
└──────────────────────────┘ └──────────────────────────┘ └───────────────────┘ └──────────────┘
```

---

## ⚡ Core Features

- **🛡️ Secure Firebase Authentication & User Synchronization**: Scopes every request to an isolated `User UID`. User profiles, addresses, and account details are synchronized directly to Google Cloud Firestore via Firebase Admin SDK.
- **📄 Multi-Format Resume Parsing**: Extracts structured entities (contact details, experience, education, skills, projects, certifications) from PDF and DOCX files using PyMuPDF and `python-docx`.
- **🎯 Intelligent ATS Scoring Engine**: Evaluates candidate resumes against target job profiles to compute match scores, identify skill gaps, extract key strengths/weaknesses, and generate actionable recommendations.
- **🔗 Cryptographic Blockchain Integrity Verification**: Computes SHA-256 document hashes to verify resume authenticity on an immutable ledger without exposing sensitive Personal Identifiable Information (PII).
- **💡 Interactive Interview Preparation Portal**: Provides company-specific and category-specific interview question sets with AI-assisted scoring and performance tracking.
- **📊 Exportable Career Reports**: Generates downloadable PDF and JSON summary reports detailing candidate ATS analytics.

---

## 🛡️ Security & Privacy Architecture

Protecting candidate Personal Identifiable Information (PII) is a foundational design principle of CareerPilot AI:

1. **User UID Isolation**: Every API endpoint uses `@require_auth` to enforce data isolation per user.
2. **Private Credential Management**: Firebase Admin SDK initializes securely using `backend/firebase-key.json`, protected by strict `.gitignore` rules.
3. **Firestore & Storage Security Rules**: Restricts document access strictly to authenticated document owners (`users/{userId}`).
4. **Zero-PII Blockchain Verification**: Only cryptographic SHA-256 hashes are logged on the ledger. Raw resume content is **never** committed to the blockchain.
5. **Zero-Downtime Data Resilience**: Features an active local fallback cache for user details during cloud network or API provisioning states.

---

## 💻 Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19, Vite, React Router 7, Axios, Vanilla CSS / Glassmorphism UI |
| **Backend Services** | Python 3.10+, Flask, Flask-CORS, Flask-Talisman, Flask-Limiter, Flask-SQLAlchemy |
| **Cloud & Auth** | Firebase Auth, Firebase Admin SDK, Google Cloud Firestore, Firebase Storage |
| **Resume Extraction & NLP** | PyMuPDF (`fitz`), `python-docx`, spaCy, custom regex extraction pipelines |
| **Security & Ledger** | SHA-256 Cryptographic Hashing, Isolated User UID Storage |
| **Database Systems** | Google Cloud Firestore (User Profiles) & SQLite (`careerpilot.db` for Interview Bank) |

---

## 📡 API Reference

### 👤 User Profile & Synchronization
- `POST /api/user/sync` — Synchronize user profile attributes, authentication state, and address to Google Cloud Firestore.
- `GET /api/user/profile` — Fetch current user's profile and contact details.
- `PUT /api/user/profile` — Update specific profile fields (target role, skills, bio, phone, address).

### 📑 Resume Parsing & ATS Intelligence
- `POST /upload` — Upload and parse resume PDF/DOCX, calculate SHA-256 hash, and store record.
- `POST /analyze` — Evaluate uploaded resume against a target job role and return ATS score & gap analysis.
- `POST /verify` — Check document SHA-256 hash against the cryptographic ledger.
- `GET /report/<user_id>` — Retrieve structured analysis reports for a given user.

### 🧠 Interview Prep Portal
- `GET /api/interview/companies` — Retrieve available target company question sets.
- `GET /api/interview/categories` — Retrieve question categories (Technical, Coding, HR).
- `GET /api/interview/questions` — Fetch question banks filtered by company and category.
- `POST /api/interview/submit` — Submit candidate answers for AI evaluation and score recording.

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.9+**
- **Node.js 18+** and `npm`
- **Firebase Admin SDK Key**: Download from Firebase Console and save as `backend/firebase-key.json`.

---

### 🔧 1. Backend Setup

```bash
# Navigate to the project directory
cd backend

# Create and activate Python virtual environment
python -m venv venv

# On Windows PowerShell:
.\venv\Scripts\Activate.ps1

# On macOS / Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start Flask backend server
python app.py
```
> The Flask backend server will start on **`http://localhost:5000`**.

---

### 💻 2. Frontend Setup

```bash
# Open a new terminal in the project root
cd frontend

# Install dependencies
npm install

# Launch Vite development server
npm run dev
```
> The React frontend application will launch on **`http://localhost:5173`**.

---

## 📁 Repository Structure

```
Careerpilot-AI/
├── backend/
│   ├── app.py                   # Flask Application Entry Point
│   ├── firebase-key.json        # Firebase Admin SDK Credentials (Ignored in Git)
│   ├── requirements.txt         # Backend Python Dependencies
│   ├── models/                  # SQLAlchemy Database Models
│   ├── routes/                  # API Blueprint Controllers (user, upload, analyze, verify, interview)
│   ├── services/                # Core Business Logic (auth, user_service, parser, ats_engine, blockchain)
│   └── instance/                # Local SQLite Database Storage
│
├── frontend/
│   ├── package.json             # Frontend Node Dependencies
│   ├── vite.config.js           # Vite Configuration
│   └── src/
│       ├── context/             # AuthContext & State Management
│       ├── services/            # Firebase Web SDK & API Clients
│       ├── components/          # Reusable UI Components
│       └── pages/               # Application Page Views
│
├── firebase.json                # Firebase Deployment Configuration
├── firestore.rules              # Cloud Firestore Security Rules
└── storage.rules                # Firebase Storage Security Rules
```

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.
