import React, { createContext, useState, useEffect, useContext } from "react";
import { getApiUrl } from "../config";

const AuthContext = createContext(null);

const safeJson = async (response) => {
  try {
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (e) {
    console.warn("Malformed JSON response ignored:", e.message);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("doddle_token"));
  const [loading, setLoading] = useState(true);

  // Initialize and load profile if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(getApiUrl("/api/auth/me"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await safeJson(response);
          if (userData) {
            setUser(userData);
          } else {
            // Invalid data fallback
            localStorage.removeItem("doddle_token");
            setToken(null);
            setUser(null);
          }
        } else {
          // Token expired or invalid
          localStorage.removeItem("doddle_token");
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (username, email, password) => {
    try {
      const response = await fetch(getApiUrl("/api/auth/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await safeJson(response);

      if (!response.ok) {
        throw new Error(data?.message || "Registration failed");
      }

      localStorage.setItem("doddle_token", data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error.message);
      return { success: false, error: error.message };
    }
  };

  // Login user
  const login = async (emailOrUsername, password) => {
    try {
      const response = await fetch(getApiUrl("/api/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await safeJson(response);

      if (!response.ok) {
        throw new Error(data?.message || "Login failed");
      }

      localStorage.setItem("doddle_token", data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error.message);
      return { success: false, error: error.message };
    }
  };

  // Update Profile details
  const updateProfile = async (username, email) => {
    try {
      const response = await fetch(getApiUrl("/api/auth/profile"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email }),
      });

      const data = await safeJson(response);

      if (!response.ok) {
        throw new Error(data?.message || "Profile update failed");
      }

      localStorage.setItem("doddle_token", data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error("Update profile error:", error.message);
      return { success: false, error: error.message };
    }
  };

  // Update secure password
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      const response = await fetch(getApiUrl("/api/auth/password"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await safeJson(response);

      if (!response.ok) {
        throw new Error(data?.message || "Password update failed");
      }

      return { success: true };
    } catch (error) {
      console.error("Update password error:", error.message);
      return { success: false, error: error.message };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("doddle_token");
    setToken(null);
    setUser(null);
  };

  // Authenticated fetch wrapper for other endpoints
  const authFetch = async (url, options = {}) => {
    const headers = { ...options.headers };

    // Skip content-type json header if payload is multipart form data
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const fullUrl = getApiUrl(url);
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Automatic logout on token expiration
      logout();
    }

    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        login,
        logout,
        authFetch,
        updateProfile,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
