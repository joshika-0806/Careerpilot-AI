from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os

from services.parser import parse_resume
from services.auth import require_auth

upload_bp = Blueprint("upload", __name__)

BASE_UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {'pdf', 'docx'}
os.makedirs(BASE_UPLOAD_FOLDER, exist_ok=True)

# Configuration: Toggle automatic deletion of raw resume files post-analysis
DELETE_RESUME_AFTER_ANALYSIS = os.environ.get("DELETE_RESUME_AFTER_ANALYSIS", "false").lower() == "true"

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@upload_bp.route("/upload", methods=["POST"])
@require_auth
def upload_resume():
    user_id = getattr(request, 'user_id', 'default_user_sandbox')

    # Enforce UID-isolated upload directory
    user_upload_folder = os.path.join(BASE_UPLOAD_FOLDER, user_id)
    os.makedirs(user_upload_folder, exist_ok=True)

    # Check if file exists
    if "resume" not in request.files:
        return jsonify({
            "success": False,
            "error": "No file uploaded"
        }), 400

    file = request.files["resume"]

    if file.filename == "":
        return jsonify({
            "success": False,
            "error": "No file selected"
        }), 400

    if not allowed_file(file.filename):
        return jsonify({
            "success": False,
            "error": "Invalid file type. Only PDF and DOCX are allowed."
        }), 400

    try:
        # Save file securely in UID-isolated directory
        filename = secure_filename(file.filename)
        filepath = os.path.join(user_upload_folder, filename)
        file.save(filepath)

        # Blockchain Verification (Stores ONLY SHA-256 Hash on ledger)
        from services.blockchain import compute_file_hash, store_hash_on_chain
        file_hash = compute_file_hash(filepath)
        tx_hash = store_hash_on_chain(filename, file_hash, user_id)

        # Parse Resume
        resume_data = parse_resume(filepath)

        print(f"\n========== Parsed Resume [UID: {user_id}] ==========")
        print(resume_data)
        print("====================================================\n")

        # Optional Privacy Rule: Delete raw file after parsing if configured
        should_delete = request.form.get("delete_after_analysis", "").lower() == "true" or DELETE_RESUME_AFTER_ANALYSIS
        is_deleted = False
        if should_delete and os.path.exists(filepath):
            os.remove(filepath)
            is_deleted = True
            print(f"[Privacy Enforcement] Original resume {filepath} deleted post-analysis.")

        return jsonify({
            "success": True,
            "message": "Resume uploaded and secured successfully",
            "filename": filename,
            "filepath": filepath if not is_deleted else None,
            "user_id": user_id,
            "deleted_after_analysis": is_deleted,
            "data": resume_data,
            "blockchain": {
                "tx_hash": tx_hash,
                "file_hash": file_hash
            }
        })

    except Exception as e:
        print("Upload Error:", str(e))
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500