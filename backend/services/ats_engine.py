from services.scoring import (
    calculate_skills_score,
    calculate_experience_score,
    calculate_education_score,
    calculate_projects_score,
    calculate_profile_score,
    calculate_overall_score
)

from services.strengths import detect_strengths
from services.weakness import detect_weaknesses
from services.suggestions import generate_suggestions


def generate_ats_report(resume):
    """
    Generate complete ATS report from parsed resume.
    """

    skills_score = calculate_skills_score(
        resume.get("skills", [])
    )

    experience_score = calculate_experience_score(
        resume.get("experience", [])
    )

    education_score = calculate_education_score(
        resume.get("education", [])
    )

    projects_score = calculate_projects_score(
        resume.get("projects", [])
    )

    profile_score = calculate_profile_score(resume)

    overall_score = calculate_overall_score(
        skills_score,
        experience_score,
        education_score,
        projects_score,
        profile_score
    )

    strengths = detect_strengths(resume)

    weaknesses = detect_weaknesses(resume)

    suggestions = generate_suggestions(weaknesses)

    ats_report = {
        "overall_score": overall_score,
        "skills_score": skills_score,
        "experience_score": experience_score,
        "education_score": education_score,
        "projects_score": projects_score,
        "profile_score": profile_score,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "suggestions": suggestions
    }

    return ats_report