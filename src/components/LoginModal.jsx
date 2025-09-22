import { useState, useEffect, useRef } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import BackgroundImage from "../assets/16264603_v839-my-10a.svg";
import Alert from "@mui/material/Alert";

export default function LoginModal({ isOpen, onSubmit }) {
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

  // Standardized Petal Animation
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
      // ⏱ Auto clear error after 10s
      setTimeout(() => setError(""), 10000);
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
        className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-20 w-full max-w-sm text-center px-4">
        <h2
          className="text-3xl sm:text-4xl mb-4"
          style={{ fontFamily: "'Dancing Script', cursive", color: "#000" }}
        >
          Nicole & Nathan
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-2 w-full"
        >
          {/* Password Input */}
          <div className="relative w-full">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isProcessing}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none text-sm text-black"
              style={{
                borderColor: PINK_COLOR,
                fontFamily: "'Poppins', sans-serif",
              }}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              style={{ color: PINK_COLOR }}
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

          {/* Unlock Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{
              backgroundColor: isProcessing ? "#f7bfc1" : PINK_COLOR,
              color: "white",
              fontFamily: "'Poppins', sans-serif",
              cursor: isProcessing ? "not-allowed" : "pointer",
              border: `1px solid ${PINK_COLOR}`,
              boxShadow: "0 0 8px rgba(237,165,165,0.4)",
            }}
          >
            {isProcessing ? "Processing..." : "Unlock"}
          </button>

          {error && (
            <Alert
              severity="error"
              className="w-full mt-2 px-2 flex items-start"
              style={{
                fontSize: "0.8rem",
                textAlign: "left",
                backgroundColor: "rgba(239,68,68,0.7)",
                color: "white",
                border: "1px solid rgba(239,68,68,0.7)",
                boxShadow: "0 0 8px rgba(239,68,68,0.4)",
                lineHeight: "1.2",
                wordBreak: "break-word",
                whiteSpace: "normal",
                alignItems: "flex-start",
              }}
              slotProps={{
                message: {
                  style: {
                    marginTop: "2px",
                  },
                },
              }}
            >
              {error}
            </Alert>
          )}

          {/* Request Password Link */}
          <div className="mt-4 sm:mt-6 text-center w-full">
            <a
              href="mailto:nathanblaga90@gmail.com?cc=nicole.camilleri44@gmail.com&subject=Password%20Request&body=Dear%20Nathan%20%26%20Nicole,%0D%0A%0D%0ACould%20you%20please%20resend%20us%20our%20password%20again.%0D%0A%0D%0AKind%20Regards"
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

      <style>{`
        .bg-wedding {
          background-position: center;
          background-repeat: no-repeat;
        }
        @media (min-width: 1024px) {
          .bg-wedding {
            background-size: contain; /* ✅ Desktop: no stretching */
            background-position: top center;
          }
        }
        @media (max-width: 1023px) {
          .bg-wedding {
            background-size: cover; /* ✅ Mobile & tablet: fill */
          }
        }

        input:focus {
          outline: none !important;
          border-color: ${PINK_COLOR};
          background-color: #fff9f9;
        }
        .request-link:hover, .request-link:focus {
          color: ${PINK_COLOR};
        }
      `}</style>
    </div>
  );
}
