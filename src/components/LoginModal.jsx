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

  useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setError("");
      setShowPass(false);
      setIsProcessing(false);
    }
  }, [isOpen]);

  // 🌸 Petal animation
  useEffect(() => {
    if (!isOpen) return;

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
          this.y = Math.random() * canvas.height;
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

      petalImg.onload = () => {
        for (let i = 0; i < TOTAL; i++) {
          petalArrayRef.current.push(new Petal());
        }

        const render = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          petalArrayRef.current.forEach((p) => p.animate());
          animationIdRef.current = requestAnimationFrame(render);
        };
        render();
      };
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
      {/* 🔽 SCALE WRAPPER */}
      <div className="login-scale-wrapper relative w-full h-full flex items-center justify-center">
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Background */}
        <div
          className="absolute inset-0 z-0 bg-wedding"
          style={{ backgroundImage: `url(${BackgroundImage})` }}
        />

        {/* Petals */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        />

        {/* Content */}
        <div className="relative z-20 w-full max-w-sm text-center px-4">
          <h2
            className="text-3xl sm:text-4xl mb-4"
            style={{ fontFamily: "'Dancing Script', cursive", color: "#000" }}
          >
            Nicole & Nathan
          </h2>

          {/* Alerts */}
          <div className="flex flex-col gap-2 mb-2">
            <AnimatePresence>
              {logoutMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Alert
                    severity="info"
                    sx={{
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
                >
                  <Alert
                    severity="error"
                    sx={{
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
                disabled={isProcessing}
                required
                className="w-full px-3 py-2 border rounded-lg text-sm text-black"
                style={{ borderColor: PINK_COLOR }}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2"
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
              className="w-full py-2 rounded-lg text-sm font-semibold"
              style={{
                backgroundColor: isProcessing ? "#f7bfc1" : PINK_COLOR,
                color: "white",
              }}
            >
              {isProcessing ? "Processing..." : "Unlock"}
            </button>

            <div className="mt-4 text-center">
              <a
                href="mailto:nathanblaga90@gmail.com?cc=nicole.camilleri44@gmail.com"
                className="request-link inline-flex items-center gap-2"
                style={{ fontSize: "0.9rem", color: "#6b6b6b" }}
              >
                Request Password
              </a>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .login-scale-wrapper {
          transform: scale(1);
          transform-origin: center;
        }

        @media (max-width: 1440px) and (max-height: 900px) {
          .login-scale-wrapper {
            transform: scale(0.8);
          }
        }

        .bg-wedding {
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
        }

        input:focus {
          outline: none;
          border-color: ${PINK_COLOR};
          background-color: #fff9f9;
        }

        .request-link:hover {
          color: ${PINK_COLOR};
        }
      `}</style>
    </div>
  );
}
