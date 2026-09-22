from flask import Blueprint, jsonify, request
from extensions import db
from models.interview import Company, Category, Question

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/companies', methods=['POST'])
def add_company():
    data = request.json
    new_company = Company(
        name=data.get('name'),
        logo_url=data.get('logo_url'),
        difficulty=data.get('difficulty', 'Medium')
    )
    db.session.add(new_company)
    db.session.commit()
    return jsonify(new_company.to_dict()), 201

@admin_bp.route('/categories', methods=['POST'])
def add_category():
    data = request.json
    new_category = Category(name=data.get('name'))
    db.session.add(new_category)
    db.session.commit()
    return jsonify(new_category.to_dict()), 201

@admin_bp.route('/questions', methods=['POST'])
def add_question():
    data = request.json
    new_question = Question(
        company_id=data.get('company_id'),
        category_id=data.get('category_id'),
        title=data.get('title'),
        type=data.get('type', 'technical'),
        difficulty=data.get('difficulty'),
        problem_statement=data.get('problem_statement'),
        constraints=data.get('constraints'),
        sample_input=data.get('sample_input'),
        sample_output=data.get('sample_output'),
        expected_time=data.get('expected_time'),
        expected_space=data.get('expected_space'),
        answer_text=data.get('answer_text'),
        hint=data.get('hint'),
        tags=data.get('tags')
    )
    db.session.add(new_question)
    db.session.commit()
    return jsonify(new_question.to_dict()), 201
