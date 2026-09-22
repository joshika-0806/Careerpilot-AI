from extensions import db
import datetime

class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    logo_url = db.Column(db.String(255), nullable=True)
    difficulty = db.Column(db.String(50), default="Medium")
    
    questions = db.relationship('Question', backref='company', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "logo_url": self.logo_url,
            "difficulty": self.difficulty,
            "total_questions": len(self.questions)
        }

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    
    questions = db.relationship('Question', backref='category', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name
        }

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    
    title = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(50), default="technical") # coding, technical, hr
    difficulty = db.Column(db.String(50), default="Medium")
    problem_statement = db.Column(db.Text, nullable=False)
    
    # Specific to coding
    constraints = db.Column(db.Text, nullable=True)
    sample_input = db.Column(db.Text, nullable=True)
    sample_output = db.Column(db.Text, nullable=True)
    expected_time = db.Column(db.String(100), nullable=True)
    expected_space = db.Column(db.String(100), nullable=True)
    
    # Specific to technical/HR/aptitude
    options = db.Column(db.Text, nullable=True)
    answer_text = db.Column(db.Text, nullable=True)
    hint = db.Column(db.Text, nullable=True)
    tags = db.Column(db.String(255), nullable=True) # comma separated

    def to_dict(self):
        return {
            "id": self.id,
            "company_id": self.company_id,
            "category_id": self.category_id,
            "title": self.title,
            "type": self.type,
            "difficulty": self.difficulty,
            "problem_statement": self.problem_statement,
            "options": self.options,
            "constraints": self.constraints,
            "sample_input": self.sample_input,
            "sample_output": self.sample_output,
            "expected_time": self.expected_time,
            "expected_space": self.expected_space,
            "answer_text": self.answer_text,
            "hint": self.hint,
            "tags": self.tags.split(',') if self.tags else [],
            "sub_category": self.tags if self.tags else ""
        }

class UserProgress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100), nullable=False) # string ID from auth/frontend
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    status = db.Column(db.String(50), default="Attempted") # Attempted, Solved
    score = db.Column(db.Float, nullable=True) # Used for AI scores
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "question_id": self.question_id,
            "status": self.status,
            "score": self.score,
            "timestamp": self.timestamp.isoformat()
        }

class MockInterviewReport(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=True)
    technical_score = db.Column(db.Float, nullable=False)
    hr_score = db.Column(db.Float, nullable=False)
    communication_score = db.Column(db.Float, nullable=False)
    overall_score = db.Column(db.Float, nullable=False)
    feedback = db.Column(db.Text, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "company_id": self.company_id,
            "technical_score": self.technical_score,
            "hr_score": self.hr_score,
            "communication_score": self.communication_score,
            "overall_score": self.overall_score,
            "feedback": self.feedback,
            "timestamp": self.timestamp.isoformat()
        }
