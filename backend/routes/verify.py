from flask import Blueprint, request, jsonify
from services.blockchain import verify_file_on_chain
from services.auth import require_auth
import os

verify_bp = Blueprint("verify", __name__)

@verify_bp.route("/verify", methods=["POST"])
@require_auth
def verify_resume():
    user_id = getattr(request, 'user_id', 'default_user_sandbox')
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
        
    filename = data.get("filename")
    tx_hash = data.get("tx_hash")
    file_hash = data.get("file_hash")
    
    if not tx_hash:
        return jsonify({"error": "tx_hash required for verification"}), 400
        
    # Search file path within user's isolated directory
    file_path = os.path.join("uploads", user_id, filename) if filename else None
    
    target = file_path if (file_path and os.path.exists(file_path)) else (file_hash or filename)
    
    result = verify_file_on_chain(target, tx_hash)
    return jsonify(result)
