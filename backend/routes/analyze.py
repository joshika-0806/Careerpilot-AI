from flask import Blueprint, request, jsonify
import uuid
import os

from services.parser import parse_resume
from services.ats import calculate_ats_score
from services.skill_extractor import extract_skills
from services.storage import save_report
from services.ats_engine import generate_ats_report
from services.auth import require_auth

analyze_bp = Blueprint("analyze", __name__)

@analyze_bp.route("/analyze", methods=["POST"])
@require_auth
def analyze_resume():
    user_id = getattr(request, 'user_id', 'default_user_sandbox')
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    filename = data.get("filename")
    job_role = data.get("job_role")
    tx_hash = data.get("tx_hash", None)

    if not filename or not job_role:
        return jsonify({"error": "filename and job_role required"}), 400

    # User isolated path primary, fallback to root uploads
    file_path = f"uploads/{user_id}/{filename}"
    if not os.path.exists(file_path):
        file_path = f"uploads/{filename}"

    try:
        # 1. Parse resume (text + structural sections)
        parsed_data = parse_resume(file_path)

        # 2. Extract skills
        skills = extract_skills(parsed_data.get("text", ""))

        # 3. ATS Job Role Matching
        ats_result = calculate_ats_score(skills, job_role)

        # 4. Generate structured scores and report from engine
        detailed_report = generate_ats_report(parsed_data)

        # 5. Build combined report
        # Weight: 70% overall profile score + 30% job-role skill matching
        overall_ats_score = int(detailed_report["overall_score"] * 0.7 + ats_result["score"] * 0.3)

        report = {
            "user_id": user_id,
            "filename": filename,
            "job_role": job_role,
            "parsed_data": {
                "text": parsed_data.get("text", ""),
                "email": parsed_data.get("email"),
                "phone": parsed_data.get("phone"),
                "linkedin": parsed_data.get("linkedin"),
                "github": parsed_data.get("github"),
                "summary": parsed_data.get("summary"),
                "experience": parsed_data.get("experience"),
                "education": parsed_data.get("education"),
                "projects": parsed_data.get("projects"),
                "certifications": parsed_data.get("certifications"),
            },
            "skills": skills,
            "matching_skills": ats_result["matching"],
            "missing_skills": ats_result["missing"],
            "ats_score": min(overall_ats_score, 100),
            "job_fit_score": ats_result["score"],
            "sub_scores": {
                "skills": detailed_report["skills_score"],
                "experience": detailed_report["experience_score"],
                "education": detailed_report["education_score"],
                "projects": detailed_report["projects_score"],
                "profile": detailed_report["profile_score"]
            },
            "strengths": detailed_report["strengths"],
            "weaknesses": detailed_report["weaknesses"],
            "suggestions": detailed_report["suggestions"],
            "blockchain": {
                "tx_hash": tx_hash,
                "secured": True if tx_hash else False
            }
        }

        # 6. Save report strictly associated with user's authenticated UID
        report_id = str(uuid.uuid4())
        save_report(user_id, report)

        return jsonify({
            "message": "Analysis complete",
            "user_id": user_id,
            "report_id": report_id,
            "report": report
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500