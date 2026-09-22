# Simple in-memory storage (Milestone phase)
REPORT_DB = {}

def save_report(user_id, data):
    REPORT_DB[user_id] = data
    REPORT_DB["latest"] = data
    return True

def get_report(user_id):
    return REPORT_DB.get(user_id, None)