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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-2 sm:px-4">
      <div
        className="absolute inset-0 bg-wedding"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* ⬇️ SCALE WRAPPER */}
      <div className="login-scale-wrapper relative z-20 w-full max-w-sm text-center px-4">
        <h2
          className="login-heading text-3xl sm:text-4xl mb-4"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Nicole & Nathan
        </h2>

        <div className="w-full flex flex-col gap-2 mb-2">
          <AnimatePresence>
            {logoutMessage && (
              <Alert className="login-alert" severity="info">
                {logoutMessage}
              </Alert>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {error && (
              <Alert className="login-alert" severity="error">
                {error}
              </Alert>
            )}
          </AnimatePresence>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />

          <button type="submit" className="login-button">
            {isProcessing ? "Processing..." : "Unlock"}
          </button>

          <div className="login-request mt-4">Request Password</div>
        </form>
      </div>

      <style>{`
        /* =========================
           13-INCH LAPTOP SCALING
           ========================= */
        @media (min-width: 1280px) and (max-width: 1440px) and (max-height: 900px) {
          .login-scale-wrapper {
            transform: scale(0.88);
            transform-origin: center;
          }

          .login-heading {
            font-size: 2.4rem;
          }

          .login-input {
            font-size: 0.85rem;
            padding: 0.45rem 0.75rem;
          }

          .login-button {
            font-size: 0.85rem;
            padding: 0.45rem;
          }

          .login-alert {
            font-size: 0.75rem;
          }

          .login-request {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}
