import re


def calculate_skills_score(skills):
    """
    Score out of 30
    """

    if not skills:
        return 0

    count = len(set(skills))

    if count >= 20:
        return 30
    elif count >= 11:
        return 25
    elif count >= 6:
        return 18
    elif count >= 1:
        return 10

    return 0


def calculate_experience_score(experience):
    """
    Score out of 20
    """

    if not experience:
        return 0

    text = " ".join(experience).lower()

    if re.search(r'5\+?\s*years|five years', text):
        return 20

    if re.search(r'4\+?\s*years|four years', text):
        return 20

    if re.search(r'3\+?\s*years|three years', text):
        return 20

    if re.search(r'2\+?\s*years|two years', text):
        return 16

    if re.search(r'1\+?\s*years|one year', text):
        return 12

    if "intern" in text:
        return 8

    return 5


def calculate_education_score(education):
    """
    Score out of 15
    """

    if not education:
        return 0

    text = " ".join(education).lower()

    if "phd" in text:
        return 15

    if "master" in text or "m.tech" in text or "m.e" in text:
        return 13

    if (
        "bachelor" in text
        or "b.tech" in text
        or "b.e" in text
        or "bsc" in text
    ):
        return 10

    return 5


def calculate_projects_score(projects):
    """
    Score out of 15
    """

    if not projects:
        return 0

    count = len(projects)

    if count >= 3:
        return 15

    if count == 2:
        return 10

    if count == 1:
        return 5

    return 0


def calculate_profile_score(resume):
    """
    Score out of 20
    """

    score = 0

    if resume.get("email"):
        score += 3

    if resume.get("phone"):
        score += 3

    if resume.get("linkedin"):
        score += 4

    if resume.get("github"):
        score += 4

    if resume.get("summary"):
        score += 3

    if resume.get("certifications"):
        score += 3

    return score


def calculate_overall_score(
    skills_score,
    experience_score,
    education_score,
    projects_score,
    profile_score,
):
    return (
        skills_score
        + experience_score
        + education_score
        + projects_score
        + profile_score
    )