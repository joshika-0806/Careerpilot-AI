import re

# Basic fallback skill list (you will later move this to JSON DB)
COMMON_SKILLS = {
    "python", "java", "javascript", "c++", "sql",
    "flask", "django", "react", "node", "html", "css",
    "machine learning", "deep learning",
    "tensorflow", "pytorch",
    "pandas", "numpy",
    "git", "docker",
    "fastapi", "api"
}

def extract_skills(text):
    """
    Extract skills from resume text using keyword matching.
    """

    if not text:
        return []

    text = text.lower()

    found_skills = set()

    for skill in COMMON_SKILLS:
        # match whole word or phrase
        pattern = r"\b" + re.escape(skill.lower()) + r"\b"
        if re.search(pattern, text):
            found_skills.add(skill)

    return list(found_skills)