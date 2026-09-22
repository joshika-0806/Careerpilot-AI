import os
import re
import fitz  # PyMuPDF
from docx import Document


def extract_pdf(path):
    """Extract text from a PDF file."""

    text = ""

    try:
        with fitz.open(path) as pdf:
            for page in pdf:
                text += page.get_text()

    except Exception as e:
        print(f"Error reading PDF: {e}")

    return text


def extract_docx(path):
    """Extract text from a DOCX file."""

    text = ""

    try:
        doc = Document(path)

        for para in doc.paragraphs:
            if para.text.strip():
                text += para.text + "\n"

    except Exception as e:
        print(f"Error reading DOCX: {e}")

    return text


def extract_text(path):
    """Automatically detect file type and extract text."""

    if not os.path.exists(path):
        raise FileNotFoundError(f"File not found: {path}")

    ext = os.path.splitext(path)[1].lower()

    if ext == ".pdf":
        return extract_pdf(path)

    elif ext == ".docx":
        return extract_docx(path)

    else:
        raise ValueError(f"Unsupported file format: {ext}")


def mask_email(email):
    if not email or "@" not in email:
        return email
    name, domain = email.split("@", 1)
    if len(name) > 2:
        masked_name = name[:2] + "*" * (len(name) - 2)
    else:
        masked_name = name[0] + "*" if name else ""
    return f"{masked_name}@{domain}"

def mask_phone(phone):
    if not phone:
        return phone
    clean_phone = re.sub(r'[^\d+]', '', phone)
    if len(clean_phone) > 4:
        return "*" * (len(clean_phone) - 4) + clean_phone[-4:]
    return clean_phone

def parse_resume(file_path):
    """
    Parse resume text and segment into structured categories.
    """
    text = extract_text(file_path)
    
    # Extract email
    email_match = re.search(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
    email = email_match.group(0) if email_match else ""
    email = mask_email(email)
    
    # Extract phone
    phone_match = re.search(r"\+?\d[\d\-\s\(\)\.]{7,15}\d", text)
    phone = phone_match.group(0) if phone_match else ""
    phone = mask_phone(phone)
    
    # Extract links
    linkedin_match = re.search(r"linkedin\.com/in/[a-zA-Z0-9_-]+", text, re.IGNORECASE)
    linkedin = linkedin_match.group(0) if linkedin_match else ""
    
    github_match = re.search(r"github\.com/[a-zA-Z0-9_-]+", text, re.IGNORECASE)
    github = github_match.group(0) if github_match else ""
    
    # Heuristics for sections
    text_lower = text.lower()
    
    # Helper to extract content between headings
    def extract_section(section_keywords):
        for kw in section_keywords:
            pattern = rf"(?:^|\n)\s*{re.escape(kw)}\s*(?::|\n)"
            match = re.search(pattern, text_lower)
            if match:
                start_idx = match.end()
                # Find start of next section (headings list)
                all_headings = ["education", "experience", "work experience", "skills", "projects", "certifications", "summary", "profile", "languages", "interests"]
                next_start = len(text)
                for heading in all_headings:
                    if heading in section_keywords:
                        continue
                    next_pattern = rf"(?:^|\n)\s*{re.escape(heading)}\s*(?::|\n)"
                    next_match = re.search(next_pattern, text_lower[start_idx:])
                    if next_match:
                        pos = start_idx + next_match.start()
                        if pos < next_start:
                            next_start = pos
                section_text = text[start_idx:next_start].strip()
                # Split into non-empty lines
                return [line.strip() for line in section_text.split("\n") if line.strip()]
        return []

    experience = extract_section(["experience", "work experience", "professional experience", "employment history"])
    education = extract_section(["education", "academic background", "qualifications"])
    projects = extract_section(["projects", "personal projects", "academic projects"])
    certifications = extract_section(["certifications", "licenses & certifications", "credentials"])
    
    # Extract summary
    summary_lines = extract_section(["summary", "professional summary", "profile"])
    summary = " ".join(summary_lines) if summary_lines else ""
    
    # Extract skills using the existing skill_extractor
    from services.skill_extractor import extract_skills
    skills = extract_skills(text)
    
    return {
        "text": text,
        "email": email,
        "phone": phone,
        "linkedin": linkedin,
        "github": github,
        "experience": experience,
        "education": education,
        "projects": projects,
        "certifications": certifications,
        "summary": summary,
        "skills": skills
    }