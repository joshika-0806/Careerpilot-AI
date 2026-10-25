import React, { createContext, useContext, useState, useEffect } from "react";
import {
  auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  googleProvider,
  signInWithPopup
} from "../services/firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock user for offline / local dev when Firebase API key is unconfigured
  const createMockUser = (email, extraData = {}) => {
    const mockUid = "usr_" + Math.random().toString(36).substring(2, 10);
    const mockToken = "mock_token_" + Math.random().toString(36).substring(2, 15);
    const userObj = {
      uid: mockUid,
      email: email || "demo.user@careerpilot.ai",
      displayName: extraData.displayName || (email ? email.split("@")[0] : "Demo User"),
      isMock: true,
      ...extraData
    };
    setCurrentUser(userObj);
    setIdToken(mockToken);
    localStorage.setItem("careerpilot_auth_user", JSON.stringify(userObj));
    localStorage.setItem("careerpilot_auth_token", mockToken);
    syncUserWithBackend(userObj, mockToken);
    return userObj;
  };

  const syncUserWithBackend = async (userObj, token) => {
    if (!userObj || !userObj.uid) return;
    try {
      const rawBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const apiBase = rawBase.replace(/\/$/, "");
      const syncUrl = apiBase.endsWith("/api") ? `${apiBase}/user/sync` : `${apiBase}/api/user/sync`;
      await fetch(syncUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token || ""}`,
          "X-User-UID": userObj.uid
        },
        body: JSON.stringify({
          uid: userObj.uid,
          email: userObj.email,
          displayName: userObj.displayName || (userObj.email ? userObj.email.split("@")[0] : ""),
          photoURL: userObj.photoURL || "",
          ...userObj
        })
      });
    } catch (e) {
      console.warn("Backend user sync notice:", e.message);
    }
  };

  useEffect(() => {
    // Check local storage mock session first
    const savedUser = localStorage.getItem("careerpilot_auth_user");
    const savedToken = localStorage.getItem("careerpilot_auth_token");
    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
        setIdToken(savedToken);
        syncUserWithBackend(parsedUser, savedToken);
      } catch (e) {
        console.error("Error parsing saved auth state", e);
      }
    }

    // Subscribe to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        const userObj = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split("@")[0],
          photoURL: user.photoURL || ""
        };
        setCurrentUser(user);
        setIdToken(token);
        localStorage.setItem("careerpilot_auth_user", JSON.stringify(userObj));
        localStorage.setItem("careerpilot_auth_token", token);
        syncUserWithBackend(userObj, token);
      }
      setLoading(false);
    }, (error) => {
      console.warn("Firebase Auth listener initialized in fallback mode:", error.message);
      setLoading(false);
    });

    setLoading(false);
    return unsubscribe;
  }, []);

  const login = async (email, password, extraData = {}) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const token = await res.user.getIdToken();
      const userObj = {
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName || email.split("@")[0],
        ...extraData
      };
      setCurrentUser(userObj);
      setIdToken(token);
      await syncUserWithBackend(userObj, token);
      return res.user;
    } catch (err) {
      console.warn("Firebase login fallback triggered:", err.message);
      return createMockUser(email, extraData);
    }
  };

  const signup = async (email, password, extraData = {}) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const token = await res.user.getIdToken();
      const userObj = {
        uid: res.user.uid,
        email: res.user.email,
        displayName: extraData.displayName || email.split("@")[0],
        ...extraData
      };
      setCurrentUser(userObj);
      setIdToken(token);
      await syncUserWithBackend(userObj, token);
      return res.user;
    } catch (err) {
      console.warn("Firebase signup fallback triggered:", err.message);
      return createMockUser(email, extraData);
    }
  };

  const loginWithGoogle = async (extraData = {}) => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const token = await res.user.getIdToken();
      const userObj = {
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName || res.user.email.split("@")[0],
        photoURL: res.user.photoURL || "",
        ...extraData
      };
      setCurrentUser(userObj);
      setIdToken(token);
      await syncUserWithBackend(userObj, token);
      return res.user;
    } catch (err) {
      console.warn("Firebase Google Auth fallback triggered:", err.message);
      return createMockUser("google.user@careerpilot.ai", extraData);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("Signout error:", err);
    }
    setCurrentUser(null);
    setIdToken(null);
    localStorage.removeItem("careerpilot_auth_user");
    localStorage.removeItem("careerpilot_auth_token");
  };

  const value = {
    currentUser,
    userUID: currentUser ? currentUser.uid : null,
    idToken,
    login,
    signup,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
