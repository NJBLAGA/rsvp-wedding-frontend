import { useState, useEffect } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Alert from "@mui/material/Alert";
import { motion, AnimatePresence } from "framer-motion";
import PageBackground from "./PageBackground";

export default function LoginModal({ isOpen, onSubmit, logoutMessage }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setError("");
      setShowPass(false);
      setIsProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const success = await onSubmit(password);
    if (!success) {
      setError("Incorrect password. Please try again.");
      setPassword("");
      setTimeout(() => setError(""), 8000);
    } else {
      setError("");
    }
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-2 sm:px-4">
      <PageBackground />

      <div className="relative z-20 w-full max-w-sm text-center px-4">
        <h2
          className="text-3xl sm:text-4xl mb-4"
          style={{ fontFamily: "'Dancing Script', cursive", color: "#000" }}
        >
          Nicole & Nathan
        </h2>

        <div className="w-full flex flex-col gap-2 mb-2">
          <AnimatePresence>
            {logoutMessage && (
              <motion.div
                key="logout-alert"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <Alert
                  severity="info"
                  style={{
                    backgroundColor: "rgba(239,68,68,0.7)",
                    color: "white",
                    fontSize: "0.8rem",
                  }}
                >
                  {logoutMessage}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                key="error-alert"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <Alert
                  severity="error"
                  style={{
                    backgroundColor: "rgba(239,68,68,0.8)",
                    color: "white",
                    fontSize: "0.8rem",
                  }}
                >
                  {error}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-2 w-full"
        >
          <div className="relative w-full">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isProcessing}
              className="login-input w-full px-3 py-2 border rounded-lg text-sm text-black"
              style={{ borderColor: "var(--color-pink)", fontFamily: "'Poppins', sans-serif" }}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              style={{ color: "var(--color-pink)" }}
              onClick={() => setShowPass(!showPass)}
              disabled={isProcessing}
            >
              {showPass ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{
              backgroundColor: isProcessing ? "#f7bfc1" : "var(--color-pink)",
              color: "white",
              fontFamily: "'Poppins', sans-serif",
              cursor: isProcessing ? "not-allowed" : "pointer",
              border: "1px solid var(--color-pink)",
              boxShadow: "0 0 8px rgba(237,165,165,0.4)",
            }}
          >
            {isProcessing ? "Processing..." : "Unlock"}
          </button>

          <div className="mt-4 sm:mt-6 text-center w-full">
            <a
              href="mailto:nandnblaga@gmail.com?cc=nathanblaga90@gmail.com&subject=Password%20Request&body=Dear%20Nathan%20%26%20Nicole,%0D%0A%0D%0ACould%20you%20please%20resend%20us%20our%20password%20again.%0D%0A%0D%0AKind%20Regards"
              className="request-link inline-flex items-center justify-center gap-1 sm:gap-2"
              style={{
                color: "#6b6b6b",
                textDecoration: "none",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.9rem",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                className="sm:w-[18px] sm:h-[18px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b6b6b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="M22 7 12 13 2 7"></path>
              </svg>
              <span className="text-xs sm:text-sm md:text-base">
                Request Password
              </span>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
