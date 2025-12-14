import { useState, useEffect, useRef } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import BackgroundImage from "../assets/16264603_v839-my-10a.svg";
import Alert from "@mui/material/Alert";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginModal({ isOpen, onSubmit, logoutMessage }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef(null);

  const PINK_COLOR = "#eda5a5";
  const animationIdRef = useRef(null);
  const petalArrayRef = useRef([]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setError("");
      setShowPass(false);
      setIsProcessing(false);
    }
  }, [isOpen]);

  // Petal animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (!petalArrayRef.current.length) {
      const TOTAL = 10;
      const petalImg = new Image();
      petalImg.src = "https://djjjk9bjm164h.cloudfront.net/petal.png";

      class Petal {
        constructor() {
          this.reset();
        }
        reset() {
          this.x = Math.random() * canvas.width;
          this.y =
            Math.random() < 0.5
              ? Math.random() * canvas.height
              : -Math.random() * canvas.height;
          this.w = 25 + Math.random() * 10;
          this.h = 18 + Math.random() * 8;
          this.opacity = 0.8;
          this.ySpeed = 0.05 + Math.random() * 0.1;
          this.angle = Math.random() * Math.PI * 2;
          this.angleSpeed = 0.003 + Math.random() * 0.002;
          this.swayDistance = 60;
        }
        draw() {
          ctx.globalAlpha = this.opacity;
          ctx.drawImage(
            petalImg,
            this.x + Math.sin(this.angle) * this.swayDistance,
            this.y,
            this.w,
            this.h,
          );
        }
        animate() {
          this.y += this.ySpeed;
          this.angle += this.angleSpeed;
          if (this.y > canvas.height + 20) {
            this.reset();
            this.y = -20;
          }
          this.draw();
        }
      }

      petalImg.addEventListener("load", () => {
        for (let i = 0; i < TOTAL; i++) {
          petalArrayRef.current.push(new Petal());
        }
        const render = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          petalArrayRef.current.forEach((p) => p.animate());
          animationIdRef.current = requestAnimationFrame(render);
        };
        render();
      });
    }

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-2 sm:px-4"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* ✅ 13-inch laptop ONLY styles */}
      <style>
        {`
          @media (max-width: 1366px) and (max-height: 900px) {
            .login-title {
              font-size: 1.8rem !important;
              margin-bottom: 0.75rem !important;
            }

            .login-input {
              padding: 0.45rem 0.6rem !important;
              font-size: 0.8rem !important;
            }

            .login-button {
              padding: 0.45rem 0 !important;
              font-size: 0.8rem !important;
            }
          }
        `}
      </style>

      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-wedding"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      />

      {/* Petals */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-20 w-full max-w-sm text-center px-4">
        <h2
          className="login-title text-3xl sm:text-4xl mb-4"
          style={{ fontFamily: "'Dancing Script', cursive", color: "#000" }}
        >
          Nicole & Nathan
        </h2>

        {/* Alerts */}
        <div className="w-full flex flex-col gap-2 mb-2">
          <AnimatePresence>
            {logoutMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
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
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
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

        {/* Form */}
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
              className="login-input w-full px-3 py-2 border rounded-lg focus:outline-none text-sm text-black"
              style={{ borderColor: PINK_COLOR }}
            />

            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              style={{ color: PINK_COLOR }}
              onClick={() => setShowPass(!showPass)}
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
            className="login-button w-full py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{
              backgroundColor: isProcessing ? "#f7bfc1" : PINK_COLOR,
              color: "white",
              border: `1px solid ${PINK_COLOR}`,
              boxShadow: "0 0 8px rgba(237,165,165,0.4)",
            }}
          >
            {isProcessing ? "Processing..." : "Unlock"}
          </button>
        </form>
      </div>
    </div>
  );
}
