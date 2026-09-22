import json
import os

os.makedirs("data/companies", exist_ok=True)

companies = [
    {
        "name": "TCS",
        "difficulty": "Medium",
        "categories": ["Aptitude", "Coding", "Java", "SQL", "DBMS", "OS", "HR"]
    },
    {
        "name": "Cognizant (CTS)",
        "difficulty": "Medium",
        "categories": ["Coding", "SQL", "Java", "DBMS", "HR"]
    },
    {
        "name": "Infosys",
        "difficulty": "Easy",
        "categories": ["Aptitude", "Puzzle Questions", "Java", "SQL", "Coding", "HR"]
    },
    {
        "name": "Wipro",
        "difficulty": "Easy",
        "categories": ["Aptitude", "Java", "Coding", "HR"]
    },
    {
        "name": "Accenture",
        "difficulty": "Medium",
        "categories": ["Coding", "SQL", "OOP", "Java", "HR"]
    },
    {
        "name": "Capgemini",
        "difficulty": "Medium",
        "categories": ["Aptitude", "Coding", "Java", "DBMS", "HR"]
    },
    {
        "name": "Zoho",
        "difficulty": "Hard",
        "categories": ["Advanced DSA", "Java", "System Design Basics", "SQL", "OOP", "DBMS", "OS", "HR"]
    },
    {
        "name": "Amazon",
        "difficulty": "Hard",
        "categories": ["DSA", "Leadership Principles", "OOP", "SQL", "Behavioral Questions"]
    },
    {
        "name": "Microsoft",
        "difficulty": "Hard",
        "categories": ["DSA", "System Design", "OOP", "DBMS", "HR"]
    },
    {
        "name": "Google",
        "difficulty": "Hard",
        "categories": ["Advanced Algorithms", "Data Structures", "System Design", "Problem Solving", "Behavioral Questions"]
    }
]

def generate_questions(company_name, category):
    # Base dummy questions
    if "Coding" in category or "DSA" in category or "Algorithms" in category:
        return [
            {
                "title": f"{company_name} Specific Array Problem",
                "type": "coding",
                "difficulty": "Medium",
                "problem_statement": f"Given an array, solve the {company_name} array challenge.",
                "constraints": "1 <= N <= 10^5",
                "sample_input": "[1, 2, 3]",
                "sample_output": "6",
                "expected_time": "O(N)",
                "expected_space": "O(1)"
            },
            {
                "title": f"{company_name} String Manipulation",
                "type": "coding",
                "difficulty": "Easy",
                "problem_statement": f"Reverse the vowels in a given string according to {company_name}'s requirements.",
                "constraints": "1 <= S.length <= 10^4",
                "sample_input": "\"hello\"",
                "sample_output": "\"holle\"",
                "expected_time": "O(N)",
                "expected_space": "O(N)"
            }
        ]
    elif "HR" in category or "Behavioral" in category or "Leadership" in category:
        return [
            {
                "title": f"Why {company_name}?",
                "type": "hr",
                "difficulty": "Medium",
                "problem_statement": f"Why do you want to join {company_name}? What aligns with your goals?",
                "hint": f"Mention {company_name}'s core values or recent projects."
            }
        ]
    else:
        return [
            {
                "title": f"Core Concept of {category} at {company_name}",
                "type": "technical",
                "difficulty": "Medium",
                "problem_statement": f"Explain the core principles of {category} and how it applies to enterprise software.",
                "answer_text": f"Standard explanation of {category} with {company_name} context.",
                "hint": "Think about scalability."
            },
            {
                "title": f"Advanced {category} Interview Question",
                "type": "technical",
                "difficulty": "Hard",
                "problem_statement": f"What is a common pitfall in {category}?",
                "answer_text": f"A common pitfall is...",
                "hint": "Focus on memory or performance."
            }
        ]

for comp in companies:
    data = {
        "name": comp["name"],
        "difficulty": comp["difficulty"],
        "categories": []
    }
    for cat in comp["categories"]:
        data["categories"].append({
            "name": cat,
            "questions": generate_questions(comp["name"], cat)
        })
    
    filename = comp["name"].lower().replace(" ", "_").replace("(", "").replace(")", "")
    with open(f"data/companies/{filename}.json", "w") as f:
        json.dump(data, f, indent=2)

print("Generated all JSON files in data/companies/")
