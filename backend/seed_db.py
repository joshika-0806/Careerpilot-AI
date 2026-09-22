import os
import json
from app import app
from extensions import db
from models.interview import Company, Category, Question

def seed_database():
    with app.app_context():
        print("Recreating DB schema...")
        db.drop_all()
        db.create_all()

        companies_dir = "data/companies"
        if not os.path.exists(companies_dir):
            print(f"Directory {companies_dir} does not exist.")
            return

        for filename in os.listdir(companies_dir):
            if filename.endswith(".json"):
                filepath = os.path.join(companies_dir, filename)
                with open(filepath, "r") as f:
                    data = json.load(f)
                
                print(f"Seeding {data['name']}...")
                
                company = Company(name=data["name"], difficulty=data.get("difficulty", "Medium"))
                db.session.add(company)
                db.session.flush() # get company.id

                for cat_data in data.get("categories", []):
                    cat_name = cat_data["name"]
                    
                    # Create or fetch category
                    category = Category.query.filter_by(name=cat_name).first()
                    if not category:
                        category = Category(name=cat_name)
                        db.session.add(category)
                        db.session.flush() # get category.id

                    for q_data in cat_data.get("questions", []):
                        question = Question(
                            company_id=company.id,
                            category_id=category.id,
                            title=q_data.get("title", ""),
                            type=q_data.get("type", "technical"),
                            difficulty=q_data.get("difficulty", "Medium"),
                            problem_statement=q_data.get("problem_statement", ""),
                            options=json.dumps(q_data.get("options")) if isinstance(q_data.get("options"), list) else q_data.get("options"),
                            constraints=q_data.get("constraints"),
                            sample_input=q_data.get("sample_input"),
                            sample_output=q_data.get("sample_output"),
                            expected_time=q_data.get("expected_time"),
                            expected_space=q_data.get("expected_space"),
                            answer_text=q_data.get("answer_text"),
                            hint=q_data.get("hint"),
                            tags=q_data.get("tags")
                        )
                        db.session.add(question)
        
        db.session.commit()
        print("Database seeded successfully with company-specific datasets!")

if __name__ == "__main__":
    seed_database()
