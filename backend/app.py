from flask import Flask
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_talisman import Talisman
import os

# Import blueprints
from routes.upload import upload_bp
from routes.analyze import analyze_bp
from routes.report import report_bp
from routes.verify import verify_bp
from routes.interview import interview_bp
from routes.admin import admin_bp
from routes.user import user_bp

app = Flask(__name__)

# Configure SQLAlchemy (SQLite for now)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///careerpilot.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

from extensions import db
db.init_app(app)

# Import models so they are registered before create_all
from models.interview import Company, Category, Question, UserProgress

with app.app_context():
    db.create_all()

# Enforce a 5MB limit on uploaded files
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024

# Set up Security Headers (disable HTTPS force for local HTTP dev server)
Talisman(app, content_security_policy=None, force_https=False)

# Set up Rate Limiting
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

# Export limiter to use in routes if needed
app.extensions['limiter'] = limiter

# Configure CORS to allow all headers (including Authorization & X-User-UID) and methods
CORS(app, resources={r"/*": {"origins": "*"}}, allow_headers="*")

# Ensure upload directory exists
UPLOAD_FOLDER = (
    "/tmp/uploads" if os.environ.get("VERCEL") else "uploads"
)

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Health check endpoint
@app.route("/health", methods=["GET"])
@app.route("/api/health", methods=["GET"])
def health_check():
    return {"status": "ok", "backend": "connected"}, 200

# Register blueprints (both standard and /api prefixed for flexible client routing)
app.register_blueprint(upload_bp)
app.register_blueprint(upload_bp, name="upload_api", url_prefix="/api")

app.register_blueprint(analyze_bp)
app.register_blueprint(analyze_bp, name="analyze_api", url_prefix="/api")

app.register_blueprint(report_bp)
app.register_blueprint(report_bp, name="report_api", url_prefix="/api")

app.register_blueprint(verify_bp)
app.register_blueprint(verify_bp, name="verify_api", url_prefix="/api")

app.register_blueprint(interview_bp)
app.register_blueprint(admin_bp)

app.register_blueprint(user_bp)
app.register_blueprint(user_bp, name="user_direct", url_prefix="/user")


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=False,
    )