def detect_weaknesses(resume):
    """
    Detect missing sections or weaknesses.
    """

    weaknesses = []

    skills = resume.get("skills", [])
    projects = resume.get("projects", [])
    certifications = resume.get("certifications", [])
    experience = resume.get("experience", [])

    if len(skills) < 8:
        weaknesses.append("Limited technical skills")

    if not projects:
        weaknesses.append("No projects listed")

    if not certifications:
        weaknesses.append("No certifications")

    if not resume.get("github"):
        weaknesses.append("Missing GitHub profile")

    if not resume.get("linkedin"):
        weaknesses.append("Missing LinkedIn profile")

    if not resume.get("summary"):
        weaknesses.append("Missing professional summary")

    if not experience:
        weaknesses.append("No experience section")

    return weaknesses