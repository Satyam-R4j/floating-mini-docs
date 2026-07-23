import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { IoClose, IoWarning } from "react-icons/io5";
import { LuUser, LuMail, LuLock, LuCalendar, LuFolder, LuDatabase, LuShieldCheck } from "react-icons/lu";
import { motion, AnimatePresence } from "motion/react";

function ProfileModal({ isOpen, onClose, totalDocs, totalSize }) {
  const { user, updateProfile, updatePassword } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Edit profile state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  // Security password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityError, setSecurityError] = useState("");
  const [securitySuccess, setSecuritySuccess] = useState("");
  const [securitySubmitting, setSecuritySubmitting] = useState(false);

  // Pre-fill user data when modal loads or user data updates
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
    setProfileError("");
    setProfileSuccess("");
    setSecurityError("");
    setSecuritySuccess("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }, [user, isOpen]);

  // Handle ESC close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setProfileSubmitting(true);

    if (!username.trim() || !email.trim()) {
      setProfileError("All fields are required");
      setProfileSubmitting(false);
      return;
    }

    const result = await updateProfile(username.trim(), email.trim());
    if (result.success) {
      setProfileSuccess("Workspace profile updated successfully!");
    } else {
      setProfileError(result.error || "Failed to update profile");
    }
    setProfileSubmitting(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSecurityError("");
    setSecuritySuccess("");
    setSecuritySubmitting(true);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setSecurityError("All password fields are required");
      setSecuritySubmitting(false);
      return;
    }

    if (newPassword.length < 6) {
      setSecurityError("New password must be at least 6 characters long");
      setSecuritySubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecurityError("Confirm password does not match new password");
      setSecuritySubmitting(false);
      return;
    }

    const result = await updatePassword(currentPassword, newPassword);
    if (result.success) {
      setSecuritySuccess("Password updated successfully! Keep it secure.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setSecurityError(result.error || "Failed to update password. Verify current password.");
    }
    setSecuritySubmitting(false);
  };

  const getJoinDate = () => {
    if (!user || !user.createdAt) return "May 2026";
    const date = new Date(user.createdAt);
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Settings Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative z-10 w-full max-w-lg max-h-[85vh] md:max-h-[90vh] flex flex-col overflow-hidden rounded-[28px] md:rounded-[36px] bg-zinc-950/90 border border-zinc-800/80 shadow-2xl p-4 md:p-8 text-white"
          >
            {/* Header section */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-5 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-zinc-900 text-emerald-400">
                  <LuUser size="1.25em" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight">Workspace Profile</h3>
                  <p className="text-[10px] text-zinc-500 font-medium mt-0.5">Manage credentials, stats, & settings</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors duration-150"
              >
                <IoClose size="1.2em" />
              </button>
            </div>

            {/* Navigation Tabs Header */}
            <div className="flex border-b border-zinc-900 mb-6 flex-shrink-0 p-1 bg-zinc-900/30 rounded-2xl border border-zinc-800/40">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex-1 py-2 px-1.5 md:px-3 rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-150 ${
                  activeTab === "overview"
                    ? "bg-zinc-800 text-emerald-400 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Overview Stats
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex-1 py-2 px-1.5 md:px-3 rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-150 ${
                  activeTab === "settings"
                    ? "bg-zinc-800 text-emerald-400 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Account Settings
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`flex-1 py-2 px-1.5 md:px-3 rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-150 ${
                  activeTab === "security"
                    ? "bg-zinc-800 text-emerald-400 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Workspace Security
              </button>
            </div>

            {/* Tab content - Scrollable */}
            <div className="flex-1 overflow-y-auto pr-1 pb-4 scrollbar-thin scrollbar-thumb-zinc-800 min-h-0">
              
              {/* TAB 1: OVERVIEW STATS */}
              {activeTab === "overview" && user && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  {/* Account Badge Card */}
                  <div className="p-4 sm:p-5 rounded-3xl bg-zinc-900/40 border border-zinc-800/40 flex items-center gap-3 sm:gap-4">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-zinc-950 font-black text-2xl uppercase">
                      {user.username ? user.username.charAt(0) : "U"}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-zinc-100">{user.username}</h4>
                      <p className="text-xs text-zinc-500 font-medium">{user.email}</p>
                    </div>
                  </div>

                  {/* Analytic Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Stat item 1 */}
                    <div className="p-4 rounded-2xl bg-zinc-900/20 border border-zinc-800/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Storage Files</span>
                        <LuFolder className="text-emerald-400" size="1.1em" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-zinc-100">{totalDocs}</h4>
                        <p className="text-[9px] text-zinc-500 font-medium mt-0.5">Total documents saved</p>
                      </div>
                    </div>

                    {/* Stat item 2 */}
                    <div className="p-4 rounded-2xl bg-zinc-900/20 border border-zinc-800/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Space Allocated</span>
                        <LuDatabase className="text-indigo-400" size="1.1em" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-zinc-100">{totalSize}</h4>
                        <p className="text-[9px] text-zinc-500 font-medium mt-0.5">Combined files size</p>
                      </div>
                    </div>
                  </div>

                  {/* Membership metadata */}
                  <div className="p-4 rounded-2xl bg-zinc-900/20 border border-zinc-800/20 flex items-center gap-3">
                    <LuCalendar className="text-amber-400" size="1.2em" />
                    <div>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider leading-none">Joined Workspace</p>
                      <h5 className="text-sm font-semibold text-zinc-200 mt-1.5">{getJoinDate()}</h5>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: EDIT PROFILE */}
              {activeTab === "settings" && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    {profileError && (
                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-950/60 border border-rose-800/40 text-rose-300 text-xs font-semibold leading-relaxed">
                        <IoWarning size="1.2em" className="flex-shrink-0 text-rose-400" />
                        <span>{profileError}</span>
                      </div>
                    )}
                    {profileSuccess && (
                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-xs font-semibold leading-relaxed">
                        <LuShieldCheck size="1.2em" className="flex-shrink-0 text-emerald-400" />
                        <span>{profileSuccess}</span>
                      </div>
                    )}

                    {/* Edit Username */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-400 ml-1">Username</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500">
                          <LuUser size="1.1em" />
                        </span>
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Username"
                          className="w-full rounded-2xl bg-zinc-900 border border-zinc-800 pl-11 pr-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150"
                        />
                      </div>
                    </div>

                    {/* Edit Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-400 ml-1">Email Address</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500">
                          <LuMail size="1.1em" />
                        </span>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full rounded-2xl bg-zinc-900 border border-zinc-800 pl-11 pr-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={profileSubmitting}
                      className="w-full mt-4 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3 px-6 text-xs cursor-pointer transition-all duration-150 shadow-md"
                    >
                      {profileSubmitting ? (
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "Save Profile Details"
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* TAB 3: WORKSPACE SECURITY */}
              {activeTab === "security" && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    {securityError && (
                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-950/60 border border-rose-800/40 text-rose-300 text-xs font-semibold leading-relaxed">
                        <IoWarning size="1.2em" className="flex-shrink-0 text-rose-400" />
                        <span>{securityError}</span>
                      </div>
                    )}
                    {securitySuccess && (
                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-xs font-semibold leading-relaxed">
                        <LuShieldCheck size="1.2em" className="flex-shrink-0 text-emerald-400" />
                        <span>{securitySuccess}</span>
                      </div>
                    )}

                    {/* Current Password */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-400 ml-1">Current Password</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500">
                          <LuLock size="1.1em" />
                        </span>
                        <input
                          type="password"
                          required
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full rounded-2xl bg-zinc-900 border border-zinc-800 pl-11 pr-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150"
                        />
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-400 ml-1">New Password</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500">
                          <LuLock size="1.1em" />
                        </span>
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimum 6 characters"
                          className="w-full rounded-2xl bg-zinc-900 border border-zinc-800 pl-11 pr-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150"
                        />
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-400 ml-1">Confirm New Password</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500">
                          <LuLock size="1.1em" />
                        </span>
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="w-full rounded-2xl bg-zinc-900 border border-zinc-800 pl-11 pr-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={securitySubmitting}
                      className="w-full mt-4 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3 px-6 text-xs cursor-pointer transition-all duration-150 shadow-md"
                    >
                      {securitySubmitting ? (
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "Update Login Password"
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

            </div>

            {/* Pinned close button footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900 mt-5 flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-zinc-800 hover:border-zinc-700/80 hover:bg-zinc-900/40 py-2 px-5 text-xs font-semibold transition-all duration-150"
              >
                Close Profile
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ProfileModal;
