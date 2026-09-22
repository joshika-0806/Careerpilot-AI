# 🎤 CareerPilot AI — Project Presentation & Judge's Pitch Guide

This document is your complete presentation guide for **CareerPilot AI**. Use it to present your project confidently to judges, professors, evaluators, or investors.

---

## 🚀 1. The Executive Pitch (Elevator Speeches)

### ⏱️ 30-Second Pitch
> *"CareerPilot AI is an enterprise-grade resume intelligence and career acceleration platform. We use AI and NLP to parse resumes, evaluate target job-role fit, generate ATS scores, and provide interactive interview practice. To ensure absolute data security and privacy, user profiles are synchronized live to Google Cloud Firestore using Firebase Admin SDK, while document authenticity is verified on an immutable blockchain ledger using zero-PII SHA-256 hashes."*

### ⏱️ 2-Minute Deep-Dive Pitch
> *"Job seekers today struggle with two major hurdles: resume ATS rejection and lack of targeted interview preparation. CareerPilot AI solves both while setting a new standard for user data privacy.*
>
> *When a candidate signs up, their profile and contact details are automatically authenticated and synchronized to Google Cloud Firestore via our backend Firebase Admin SDK integration. Candidates upload their resumes in PDF or DOCX format. Our backend parses the text using PyMuPDF and spaCy to extract structured candidate details, skills, experience, and education.*
>
> *Our custom ATS scoring engine evaluates the candidate's profile against target job descriptions, producing an instant ATS match score, identifying skill gaps, and generating actionable improvement recommendations.*
>
> *For document integrity, we generate a cryptographic SHA-256 hash of the resume and log it to a blockchain ledger. This proves document authenticity without ever revealing candidate PII on the chain.*
>
> *Finally, candidates can practice with our interactive interview portal featuring company-specific and category-specific technical and HR question banks with AI scoring."*

---

## 🛠️ 2. Detailed Technical Breakdown: What You Built & How It Works

### 1. Firebase Authentication & User Isolation
- **What was built**: Integrated Firebase Auth on the frontend with custom `@require_auth` middleware on the Flask backend.
- **Why it matters**: Every user request is scoped to an isolated `User UID`. Candidate data, uploads, and reports are protected from cross-tenant access.

### 2. Service Key Account & Cloud Firestore Database Integration
- **What was built**: Integrated the Google Firebase Admin SDK service account key (`backend/firebase-key.json`) into Flask.
- **Real-Time User Sync**: Built `POST /api/user/sync` and `UserService` to store and update user profile attributes (`uid`, `email`, `displayName`, `photoURL`, `address`, `phone`, `target_role`, `skills`, `bio`) directly into the `users` collection in Google Cloud Firestore.
- **Zero-Downtime Resilience**: Engine features an active local fallback cache so user updates persist gracefully even during cloud network or API provisioning states.

### 3. Multi-Format Resume Parsing Engine
- **What was built**: Automated text extraction and entity recognition engine utilizing `PyMuPDF` (`fitz`), `python-docx`, and `spaCy`.
- **Functionality**: Extracts structured sections (Contact Info, Professional Summary, Work Experience, Academic Background, Personal Projects, Certifications, and Skills).

### 4. ATS Scoring & Skill Match Engine
- **What was built**: An algorithmic matching engine (`services/ats_engine.py` and `services/scoring.py`).
- **Functionality**: Matches extracted candidate skills against required competencies for target job roles. Calculates an overall ATS score (0-100%), extracts matched skills, highlights missing skills, generates candidate strengths & weaknesses, and formulates career suggestions.

### 5. SHA-256 Blockchain Integrity Ledger
- **What was built**: Cryptographic document verification system (`services/blockchain.py`).
- **Privacy Design**: Computes the unique SHA-256 hash of the resume file. Only the 64-character hex hash is registered on the ledger. Raw resume content and PII are **never** committed to the blockchain.

### 6. Interactive Technical & HR Interview Portal
- **What was built**: A full interview preparation portal (`routes/interview.py` & `models/interview.py`).
- **Functionality**: Features structured question sets categorized by company (Google, Amazon, Microsoft, Meta, etc.) and topic (Technical, Coding, HR). Evaluates candidate answers and tracks score progress over time.

---

## 🎬 3. Live Demonstration Guide (Step-by-Step Demo Flow)

| Step | Action | What to Explain to Judges |
| :--- | :--- | :--- |
| **1. Authentication & Sync** | Sign in via Email/Google Auth. | *"Watch how candidate auth details—including email, display name, and address—are immediately validated and synchronized live to Google Cloud Firestore under `users/{uid}` via Firebase Admin SDK."* |
| **2. Resume Upload & Parsing** | Upload a candidate resume (PDF or DOCX). | *"Our backend receives the file, extracts raw text using PyMuPDF/python-docx, and parses candidate skills, experience, and contact info into structured JSON format."* |
| **3. ATS Score & Fit Report** | Select target job role (e.g. 'AI Engineer'). | *"Our ATS engine compares candidate skills against target role requirements, yielding an ATS match percentage, skill gap breakdown, and personalized recommendations."* |
| **4. Blockchain Verification** | Click **Verify Document Hash**. | *"We compute the resume's SHA-256 cryptographic signature. The ledger verifies document integrity without revealing any personal information on-chain."* |
| **5. Interview Prep Portal** | Navigate to Interview Section & attempt a question. | *"Candidates can practice company-specific interview questions, submit answers for AI scoring, and track performance history over time."* |

---

## ❓ 4. Anticipated Judge Questions & Technical Answers

### Q1: *"Why do you use Blockchain for resumes?"*
> **Answer**: *"Resumes are frequently altered or falsified in hiring processes. By recording the SHA-256 cryptographic hash of a verified resume on an immutable ledger, employers can instantly verify that a candidate's submitted resume matches the original verified document without altering the original file."*

### Q2: *"How do you handle candidate PII and privacy?"*
> **Answer**: *"Privacy is our top priority. We use strict user UID scoping and Firestore/Storage Security Rules to isolate user data. Furthermore, no Personal Identifiable Information (PII) is ever written to the blockchain—only the 256-bit cryptographic hash."*

### Q3: *"How does the Firebase Admin SDK service account integration work?"*
> **Answer**: *"Our Flask backend initializes the Firebase Admin SDK using a secure service account credential key (`firebase-key.json`). This gives our backend full authorized administrative access to manage user documents in Google Cloud Firestore (`users/{uid}`) securely from our backend server while keeping the key hidden from public frontend code."*

### Q4: *"What happens if the cloud database API is temporarily unavailable?"*
> **Answer**: *"We designed `UserService` with a resilient fallback architecture. If Cloud Firestore is temporarily unreachable or undergoing API activation, the service seamlessly logs updates into an active local memory cache so user operations never crash or fail for the candidate."*

---

## 📊 5. Summary of System API Endpoints

- `POST /api/user/sync` — Synchronizes authenticated user details, name, and address to Cloud Firestore.
- `GET /api/user/profile` — Fetches current user profile and address details.
- `PUT /api/user/profile` — Updates specific user profile fields in Firestore.
- `POST /upload` — Uploads PDF/DOCX resume, parses text, and computes SHA-256 hash.
- `POST /analyze` — Evaluates candidate profile against target job role for ATS metrics.
- `POST /verify` — Validates resume SHA-256 hash against the ledger.
- `GET /report/<user_id>` — Downloads structured candidate report.
- `GET /api/interview/questions` — Fetches company and category-specific interview questions.
- `POST /api/interview/submit` — Evaluates candidate interview response.
