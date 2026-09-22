import datetime
from services.auth import get_firestore_db, is_firebase_initialized

# In-memory user cache fallback if Firestore database API is disabled or unreachable
_user_cache = {}

class UserService:
    @staticmethod
    def get_user_ref(user_id):
        db = get_firestore_db()
        if db:
            return db.collection("users").document(str(user_id))
        return None

    @staticmethod
    def save_or_update_user(user_id, data):
        """
        Store or sync user details into Firestore (or local fallback cache if API is pending activation).
        """
        user_ref = UserService.get_user_ref(user_id)
        now = datetime.datetime.utcnow().isoformat()
        
        payload = {
            "uid": user_id,
            "email": data.get("email", ""),
            "displayName": data.get("displayName", ""),
            "photoURL": data.get("photoURL", ""),
            "last_login": now,
            "updated_at": now
        }
        
        # Include all user metadata and custom profile fields (address, phone, location, target_role, skills, bio, etc.)
        for key, value in data.items():
            if key not in payload and value is not None:
                payload[key] = value


        # Update in-memory fallback cache
        if user_id in _user_cache:
            _user_cache[user_id].update(payload)
        else:
            payload["created_at"] = now
            _user_cache[user_id] = payload.copy()

        if user_ref:
            try:
                doc = user_ref.get()
                if not doc.exists:
                    payload["created_at"] = now
                    user_ref.set(payload)
                else:
                    user_ref.set(payload, merge=True)
                return {"success": True, "stored_in": "firestore", "data": payload}
            except Exception as e:
                err_str = str(e)
                if "SERVICE_DISABLED" in err_str or "403" in err_str or "firestore.googleapis.com" in err_str:
                    print(f"[UserService Notice] Cloud Firestore API is disabled or not created yet in Google Cloud Console. Using active local user store fallback.")
                    return {
                        "success": True, 
                        "stored_in": "local_fallback", 
                        "notice": "Cloud Firestore API is not yet enabled in Firebase/GCP Console.",
                        "data": _user_cache[user_id]
                    }
                print(f"[UserService] Firestore write error: {e}")
                return {"success": True, "stored_in": "local_fallback", "error": err_str, "data": _user_cache[user_id]}
        else:
            return {"success": True, "stored_in": "local_fallback", "data": _user_cache[user_id]}

    @staticmethod
    def get_user_profile(user_id):
        """
        Retrieve user details from Firestore or local fallback cache.
        """
        user_ref = UserService.get_user_ref(user_id)
        if user_ref:
            try:
                doc = user_ref.get()
                if doc.exists:
                    return {"success": True, "profile": doc.to_dict()}
            except Exception as e:
                pass
        
        if user_id in _user_cache:
            return {"success": True, "profile": _user_cache[user_id], "source": "local_fallback"}
            
        return {"success": True, "profile": {"uid": user_id, "email": "", "displayName": "Demo User"}, "source": "default_stub"}

    @staticmethod
    def update_user_profile(user_id, updates):
        """
        Update specific profile fields.
        """
        user_ref = UserService.get_user_ref(user_id)
        updates["updated_at"] = datetime.datetime.utcnow().isoformat()
        
        if user_id in _user_cache:
            _user_cache[user_id].update(updates)
        else:
            _user_cache[user_id] = updates.copy()

        if user_ref:
            try:
                user_ref.set(updates, merge=True)
                doc = user_ref.get()
                if doc.exists:
                    return {"success": True, "profile": doc.to_dict()}
            except Exception as e:
                pass

        return {"success": True, "profile": _user_cache[user_id]}

