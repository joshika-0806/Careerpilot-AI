def generate_suggestions(weaknesses):
    """
    Generate resume improvement suggestions
    based on detected weaknesses.
    """

    suggestions = []

    mapping = {
        "Limited technical skills":
            "Learn more in-demand technologies such as Docker, Kubernetes, AWS, CI/CD, and SQL.",

        "No projects listed":
            "Add 2–3 real-world projects with clear descriptions and measurable outcomes.",

        "No certifications":
            "Earn industry-recognized certifications (AWS, Google, Microsoft, Coursera, Udemy, etc.).",

        "Missing GitHub profile":
            "Create a GitHub profile and upload your projects with proper README files.",

        "Missing LinkedIn profile":
            "Create a professional LinkedIn profile and keep it updated.",

        "Missing professional summary":
            "Add a concise professional summary highlighting your skills and career goals.",

        "No experience section":
            "Include internships, freelance work, hackathons, or personal projects as experience."
    }

    for weakness in weaknesses:
        if weakness in mapping:
            suggestions.append(mapping[weakness])

    return suggestions