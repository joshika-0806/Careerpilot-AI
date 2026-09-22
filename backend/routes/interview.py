from flask import Blueprint, jsonify, request
from extensions import db
from models.interview import Company, Category, Question, UserProgress

interview_bp = Blueprint('interview', __name__, url_prefix='/api/interview')

@interview_bp.route('/companies', methods=['GET'])
def get_companies():
    companies = Company.query.all()
    return jsonify([c.to_dict() for c in companies]), 200

@interview_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([c.to_dict() for c in categories]), 200

@interview_bp.route('/company/<int:company_id>/summary', methods=['GET'])
def get_company_summary(company_id):
    company = Company.query.get_or_404(company_id)
    # Get unique categories that have questions for this company
    questions = Question.query.filter_by(company_id=company_id).all()
    
    cat_counts = {}
    for q in questions:
        if q.category_id not in cat_counts:
            cat_counts[q.category_id] = 0
        cat_counts[q.category_id] += 1
        
    categories = Category.query.filter(Category.id.in_(cat_counts.keys())).all()
    
    cat_data = []
    for c in categories:
        cat_data.append({
            "id": c.id,
            "name": c.name,
            "total": cat_counts[c.id],
            "progress": 0  # To be dynamically loaded from user progress later
        })
        
    return jsonify({
        "company": company.to_dict(),
        "categories": cat_data
    }), 200

@interview_bp.route('/questions/<int:company_id>/<int:category_id>', methods=['GET'])
def get_questions(company_id, category_id):
    questions = Question.query.filter_by(company_id=company_id, category_id=category_id).all()
    return jsonify([q.to_dict() for q in questions]), 200

@interview_bp.route('/company/<int:company_id>/all-questions', methods=['GET'])
def get_company_all_questions(company_id):
    company = Company.query.get_or_404(company_id)
    questions = Question.query.filter_by(company_id=company_id).all()
    categories = Category.query.all()
    cat_map = {c.id: c.name for c in categories}
    
    sections = {}
    for q in questions:
        c_name = cat_map.get(q.category_id, "General")
        if c_name not in sections:
            sections[c_name] = []
        sections[c_name].append(q.to_dict())
        
    return jsonify({
        "company": company.to_dict(),
        "sections": sections
    }), 200

@interview_bp.route('/code/submit', methods=['POST'])
def submit_code():
    data = request.json
    # TODO: Connect to code_evaluator service
    return jsonify({
        "score": 85,
        "correctness": "Correct",
        "time_complexity": "O(N)",
        "space_complexity": "O(1)",
        "optimization": "Looks good.",
        "edge_cases": "Missed empty array check."
    }), 200

@interview_bp.route('/hr/evaluate', methods=['POST'])
@interview_bp.route('/behavioral/evaluate', methods=['POST'])
def evaluate_hr():
    data = request.json or {}
    user_response = data.get('response') or data.get('answer') or ""
    question = data.get('question') or "Behavioral Question"
    
    words = user_response.strip().split()
    word_count = len(words)
    
    if word_count < 15:
        return jsonify({
            "score": 45,
            "communication": "Response is too brief to effectively evaluate depth.",
            "clarity": "Lacks detailed context and specific examples.",
            "structure": "Needs a structured framework like STAR (Situation, Task, Action, Result).",
            "confidence": "Low - brief answers may come across as hesitant or incomplete.",
            "areas_for_improvement": "Expand your response with a clear situation, the specific actions you personally took, and measurable results."
        }), 200
        
    response_lower = user_response.lower()
    has_situation = any(k in response_lower for k in ['when', 'during', 'project', 'time', 'situation', 'team', 'company', 'client'])
    has_action = any(k in response_lower for k in ['i decided', 'i created', 'i implemented', 'i spoke', 'i proposed', 'i took', 'i analyzed', 'i built', 'i solved', 'i initiated'])
    has_result = any(k in response_lower for k in ['result', 'outcome', 'led to', 'reduced', 'improved', 'increased', 'learned', 'successful', 'achieved', '%', 'percent'])
    has_metrics = any(char.isdigit() for char in user_response)
    
    score = 70
    if word_count > 40: score += 10
    if has_situation: score += 5
    if has_action: score += 5
    if has_result: score += 5
    if has_metrics: score += 5
    score = min(score, 98)
    
    communication = "Articulate and professional. Uses strong action verbs effectively." if has_action else "Good tone, but could use more proactive, action-oriented phrasing."
    clarity = "Very clear narration. The scenario and execution steps are easily understandable." if word_count > 30 else "Moderate clarity. Context is present but could be elaborated."
    
    if has_situation and has_action and has_result:
        structure = "Excellent STAR format adherence (Situation, Task, Action, Result clearly defined)."
    elif has_action:
        structure = "Good action description, but explicitly call out the initial Situation and final Result."
    else:
        structure = "Needs stronger structural alignment. Follow the STAR framework to organize your thoughts."
        
    confidence = "High - tone demonstrates clear ownership, initiative, and decisive leadership." if (has_action and word_count > 50) else "Moderate - message is clear, but adding direct ownership phrases will boost impact."
    
    improvements = []
    if not has_metrics:
        improvements.append("Quantify your impact with measurable metrics (e.g., improved performance by 30%, saved 15 hours/week).")
    if not has_result:
        improvements.append("Conclude with a clear business outcome or key lesson learned from the experience.")
    if word_count < 50:
        improvements.append("Provide additional context regarding technical constraints or trade-offs managed.")
    if not improvements:
        improvements.append("Outstanding response! Maintain this structured STAR approach during live interviews.")
        
    return jsonify({
        "score": score,
        "communication": communication,
        "problem_solving": "Analyzes problem root cause and trade-offs systematically." if (has_action and word_count > 35) else "Demonstrates basic problem solving; detail the exact analytical steps and trade-offs made.",
        "clarity": clarity,
        "structure": structure,
        "confidence": confidence,
        "professionalism": "High - maintains polite, professional corporate alignment and structured intent." if word_count > 25 else "Moderate - ensure formal language and professional framing.",
        "technical_depth": "Strong - demonstrates deep technical understanding, architecture awareness, and optimization mindset." if (has_action and word_count > 45) else "Moderate - elaborate further on specific data structures, algorithms, and system trade-offs.",
        "areas_for_improvement": " ".join(improvements)
    }), 200

