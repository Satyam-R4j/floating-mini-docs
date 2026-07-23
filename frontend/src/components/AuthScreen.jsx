import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { LuMail, LuLock, LuUser, LuArrowRight } from "react-icons/lu";
import { IoWarning } from "react-icons/io5";
import { motion, AnimatePresence } from "motion/react";

function AuthScreen() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("kai");
  const [email, setEmail] = useState("kai");
  const [password, setPassword] = useState("k41");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (isLogin) {
      const emailOrUsername = email || username;
      if (!emailOrUsername || !password) {
        setError("All fields are required");
        setSubmitting(false);
        return;
      }
      const result = await login(emailOrUsername, password);
      if (!result.success) {
        setError(result.error || "Failed to login. Please check credentials.");
      }
    } else {
      if (!username || !email || !password) {
        setError("All fields are required");
        setSubmitting(false);
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long");
        setSubmitting(false);
        return;
      }
      const result = await register(username, email, password);
      if (!result.success) {
        setError(result.error || "Failed to register new account.");
      }
    }
    setSubmitting(false);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-[6px]">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="w-full max-w-md overflow-hidden rounded-[28px] md:rounded-[36px] bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl shadow-2xl p-6 md:p-10 text-white"
      >
        {/* Title Watermark Logo */}
        <div className="flex flex-col items-center justify-center text-center mb-6 md:mb-8 select-none">
          <div className="h-14 w-14 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/30 mb-4">
            <span className="text-2xl font-black tracking-tighter text-zinc-950 font-['Poppins']">D</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-xs text-zinc-500 mt-2 font-medium tracking-wide">
            {isLogin
              ? "Sign in to access your personal Doddle dashboard"
              : "Register to start managing your micro-document cards"}
          </p>
        </div>

        {/* Error Notification Alert */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="mb-5 flex items-center gap-3 p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800/40 text-rose-300 text-xs font-semibold leading-relaxed overflow-hidden"
            >
              <IoWarning size="1.25em" className="flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                key="username-input"
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="space-y-1.5 overflow-hidden"
              >
                <label className="text-xs font-semibold text-zinc-400 ml-1">Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500">
                    <LuUser size="1.1em" />
                  </span>
                  <input
                    type="text"
                    required={!isLogin}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full rounded-2xl bg-zinc-950/50 border border-zinc-800 pl-11 pr-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email or Username for Login, Email for Register */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 ml-1">
              {isLogin ? "Username or Email" : "Email Address"}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500">
                <LuMail size="1.1em" />
              </span>
              <input
                type={isLogin ? "text" : "email"}
                required
                value={isLogin ? username || email : email}
                onChange={(e) => {
                  if (isLogin) {
                    setUsername(e.target.value);
                    setEmail(e.target.value);
                  } else {
                    setEmail(e.target.value);
                  }
                }}
                placeholder={isLogin ? "Enter email or username" : "you@example.com"}
                className="w-full rounded-2xl bg-zinc-950/50 border border-zinc-800 pl-11 pr-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 ml-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500">
                <LuLock size="1.1em" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl bg-zinc-950/50 border border-zinc-800 pl-11 pr-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-6 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-zinc-950 font-bold py-3.5 px-6 text-sm cursor-pointer shadow-lg shadow-emerald-950/20 active:scale-[0.98] transition-all duration-150"
          >
            {submitting ? (
              <span className="h-4 w-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isLogin ? "Authenticate Session" : "Create Account"}</span>
                <LuArrowRight size="1.1em" className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Footer State Toggle */}
        <div className="mt-8 text-center text-xs font-semibold text-zinc-500">
          <span>{isLogin ? "Don't have an account? " : "Already have an account? "}</span>
          <button
            onClick={toggleAuthMode}
            className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 decoration-emerald-500/40 hover:decoration-emerald-400 cursor-pointer transition-colors"
          >
            {isLogin ? "Register Now" : "Sign In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default AuthScreen;
