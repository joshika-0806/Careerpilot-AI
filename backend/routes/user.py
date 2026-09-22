from flask import Blueprint, request, jsonify
from services.auth import require_auth
from services.user_service import UserService

user_bp = Blueprint("user", __name__, url_prefix="/api/user")

@user_bp.route("/sync", methods=["POST"])
@require_auth
def sync_user():
    """
    Sync user authentication details into Firestore on login/signup.
    """
    user_id = getattr(request, "user_id", "default_user_sandbox")
    data = request.get_json() or {}
    
    result = UserService.save_or_update_user(user_id, data)
    return jsonify(result), 200

@user_bp.route("/profile", methods=["GET"])
@require_auth
def get_profile():
    """
    Get user profile details from Firestore.
    """
    user_id = getattr(request, "user_id", "default_user_sandbox")
    result = UserService.get_user_profile(user_id)
    return jsonify(result), 200

@user_bp.route("/profile", methods=["PUT"])
@require_auth
def update_profile():
    """
    Update user profile details in Firestore.
    """
    user_id = getattr(request, "user_id", "default_user_sandbox")
    updates = request.get_json() or {}
    
    result = UserService.update_user_profile(user_id, updates)
    return jsonify(result), 200
