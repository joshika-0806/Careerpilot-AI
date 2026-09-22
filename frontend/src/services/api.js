import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000",
});

// Interceptor to attach Firebase Auth ID Token & User UID headers
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("careerpilot_auth_token");
    const userStr = localStorage.getItem("careerpilot_auth_user");

    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }

    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            if (user.uid) {
                config.headers["X-User-UID"] = user.uid;
            }
        } catch (e) {
            console.error("Error setting X-User-UID header:", e);
        }
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export const uploadResume = (formData) =>
    API.post("/upload", formData);

export const analyzeResume = (filename, job_role, tx_hash) =>
    API.post("/analyze", { filename, job_role, tx_hash });

export const verifyResume = (filename, tx_hash) =>
    API.post("/verify", { filename, tx_hash });

export const getReport = (user_id) =>
    API.get(`/report/${user_id}`);

export default API;