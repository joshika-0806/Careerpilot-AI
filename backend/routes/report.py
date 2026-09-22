from flask import Blueprint, jsonify
from services.storage import get_report

report_bp = Blueprint("report", __name__)

@report_bp.route("/report/<user_id>", methods=["GET"])
def get_user_report(user_id):
    report = get_report(user_id)

    if not report:
        return jsonify({"error": "Report not found"}), 404

    return jsonify(report)