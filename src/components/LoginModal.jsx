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
  const animationIdRef = useRef(null);
  const petalArrayRef = useRef([]);

  const PINK_COLOR = "#eda5a5";

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setError("");
      setShowPass(false);
      setIsProcessing(false);
    }
  }, [isOpen]);

  // 🌸 Petal animation (FIXED for 13" Retina scaling)
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    if (!petalArrayRef.current.length) {
      const TOTAL = 10;
      const petalImg = new Image();
      petalImg.src = "https://djjjk9bjm164h.cloudfront.net/petal.png";

      class Petal {
        constructor() {
          this.reset();
        }
        reset() {
          this.x = Math.random() * window.innerWidth;
          this.y = Math.random() * window.innerHeight;
          this.w = 22 + Math.random() * 8;
          this.h = 16 + Math.random() * 6;
          this.opacity = 0.8;
          this.ySpeed = 0.15 + Math.random() * 0.15;
          this.angle = Math.random() * Math.PI * 2;
          this.angleSpeed = 0.003 + Math.random() * 0.002;
          this.swayDistance = 50;
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
          if (this.y > window.innerHeight + 20) {
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

    return () => {
      window.removeEventListener("resize", resizeCanvas);
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
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-3 sm:px-4"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
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
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-20 w-full max-w-sm text-center px-4 laptop13:px-3">
        <h2
          className="text-3xl sm:text-4xl laptop13:text-[2rem] mb-3 laptop13:mb-2"
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
                    fontSize: "0.75rem",
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
                    fontSize: "0.75rem",
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
              className="w-full px-3 py-2 text-sm border rounded-lg text-black"
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
            className="w-full py-2 text-sm font-semibold rounded-lg"
            style={{
              backgroundColor: isProcessing ? "#f7bfc1" : PINK_COLOR,
              color: "white",
            }}
          >
            {isProcessing ? "Processing..." : "Unlock"}
          </button>
        </form>
      </div>

      <style>{`
        .bg-wedding {
          background-position: center;
          background-repeat: no-repeat;
        }
        @media (min-width: 1024px) {
          .bg-wedding {
            background-size: contain;
            background-position: top center;
          }
        }
        @media (max-width: 1023px) {
          .bg-wedding {
            background-size: cover;
          }
        }
        @media (max-height: 900px) {
          .laptop13\\:text-\\[2rem\\] {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
