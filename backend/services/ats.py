import re

skills_database = [
    "python",
    "java",
    "react",
    "javascript",
    "html",
    "css",
    "sql",
    "flask",
    "django",
    "node",
    "mongodb",
    "git",
    "docker"
]


def calculate_ats(text):

    text = text.lower()

    found = []

    for skill in skills_database:
        if re.search(r"\b" + re.escape(skill) + r"\b", text):
            found.append(skill)

    score = min(len(found) * 8, 100)

    suggestions = []

    if score < 40:
        suggestions.append("Add more technical skills.")

    if "projects" not in text:
        suggestions.append("Add Projects section.")

    if "education" not in text:
        suggestions.append("Add Education section.")

    if "experience" not in text:
        suggestions.append("Add Experience section.")

    return {
        "ats_score": score,
        "skills": found,
        "suggestions": suggestions
    }


def calculate_ats_score(skills, job_role):
    """
    Compare skills in resume against job role required skills.
    Returns: score, matching, missing
    """
    # Normalize job role name
    role = job_role.lower().strip()
    
    # Skills mapping for different roles
    role_skills = {
        "software engineer": ["python", "java", "javascript", "sql", "git", "docker", "react", "node", "api"],
        "data scientist": ["python", "sql", "machine learning", "deep learning", "tensorflow", "pytorch", "pandas", "numpy"],
        "frontend developer": ["javascript", "html", "css", "react", "git", "node"],
        "backend developer": ["python", "java", "sql", "flask", "django", "node", "git", "docker", "fastapi", "api"]
    }
    
    # Standardize roles
    if "software" in role:
        target_role = "software engineer"
    elif "data" in role:
        target_role = "data scientist"
    elif "front" in role:
        target_role = "frontend developer"
    elif "back" in role:
        target_role = "backend developer"
    else:
        # Fallback to general tech skills if role not recognized
        target_role = "software engineer"
        
    required_skills = role_skills[target_role]
    
    # Normalize skills lists
    skills_lower = [s.lower().strip() for s in skills]
    
    matching = [s for s in required_skills if s in skills_lower]
    missing = [s for s in required_skills if s not in skills_lower]
    
    # Calculate score as percentage of matching skills
    if not required_skills:
        score = 100
    else:
        score = int((len(matching) / len(required_skills)) * 100)
        
    return {
        "score": score,
        "matching": matching,
        "missing": missing
    }