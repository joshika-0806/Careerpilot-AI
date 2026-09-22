from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
from datetime import datetime


def generate_pdf_report(data, output_path):

    doc = SimpleDocTemplate(output_path, pagesize=A4)
    styles = getSampleStyleSheet()
    content = []

    def add(title, value):
        content.append(Paragraph(f"<b>{title}</b>", styles["Heading3"]))
        content.append(Spacer(1, 5))
        content.append(Paragraph(str(value), styles["BodyText"]))
        content.append(Spacer(1, 10))

    # Title
    content.append(Paragraph("CareerPilot AI - Resume Report", styles["Title"]))
    content.append(Spacer(1, 20))

    content.append(Paragraph(f"Generated on: {datetime.now()}", styles["Normal"]))
    content.append(Spacer(1, 20))

    # ATS Score
    add("ATS Score", f"{data.get('ats_score', 0)}%")

    # Summary
    add("AI Summary", data.get("summary", "N/A"))

    # Matching Skills
    add("Matching Skills", ", ".join(data.get("matching_skills", [])))

    # Missing Skills
    add("Missing Skills", ", ".join(data.get("missing_skills", [])))

    # Suggestions
    add("Suggestions", "\n".join(data.get("suggestions", [])))

    # Interview Questions
    add("Interview Questions", "\n".join(data.get("interview_questions", [])))

    doc.build(content)