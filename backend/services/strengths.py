def detect_strengths(resume):
    """
    Detect strengths in the resume.
    """

    strengths = []

    skills = resume.get("skills", [])
    projects = resume.get("projects", [])
    education = resume.get("education", [])
    certifications = resume.get("certifications", [])

    if len(skills) >= 10:
        strengths.append("Strong technical skill set")

    if "Python" in skills:
        strengths.append("Strong Python skills")

    if "Machine Learning" in skills:
        strengths.append("Machine Learning knowledge")

    if len(projects) >= 3:
        strengths.append("Multiple technical projects")

    if certifications:
        strengths.append("Relevant certifications")

    if resume.get("github"):
        strengths.append("GitHub profile available")

    if resume.get("linkedin"):
        strengths.append("LinkedIn profile available")

    if education:
        strengths.append("Educational qualifications listed")

    if resume.get("summary"):
        strengths.append("Professional summary included")

    return strengths