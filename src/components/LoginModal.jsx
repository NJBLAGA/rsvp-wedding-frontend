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

  // Petal animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (!petalArrayRef.current.length) {
      const TOTAL = 30;
      const petalImg = new Image();
      petalImg.src = "https://djjjk9bjm164h.cloudfront.net/petal.png";

      class Petal {
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height * 2 - canvas.height;
          this.w = 25 + Math.random() * 15;
          this.h = 20 + Math.random() * 10;
          this.opacity = this.w / 50;
          this.flip = Math.random();
          this.xSpeed = 0.2 + Math.random() * 0.15;
          this.ySpeed = 0.1 + Math.random() * 0.15;
          this.flipSpeed = Math.random() * 0.01;
        }
        draw() {
          if (this.y > canvas.height || this.x > canvas.width) {
            this.x = -25;
            this.y = Math.random() * canvas.height * 2 - canvas.height;
            this.xSpeed = 0.2 + Math.random() * 0.15;
            this.ySpeed = 0.1 + Math.random() * 0.15;
            this.flip = Math.random();
          }
          ctx.globalAlpha = this.opacity;
          ctx.drawImage(
            petalImg,
            this.x,
            this.y,
            this.w * (0.6 + Math.abs(Math.cos(this.flip)) / 3),
            this.h * (0.8 + Math.abs(Math.sin(this.flip)) / 5),
          );
        }
        animate() {
          this.x += this.xSpeed;
          this.y += this.ySpeed;
          this.flip += this.flipSpeed;
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
      setError("Incorrect password.\nPlease try again."); // line break
      setPassword("");
    } else {
      setError("");
    }
    setIsProcessing(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-2 sm:px-4"
      style={{ fontFamily: "'Poppins', sans-serif'" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      />

      {/* Petals Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
      />

      {/* Centered UI */}
      <div className="relative z-20 w-full max-w-sm text-center px-4">
        <h2
          className="text-3xl sm:text-4xl mb-4"
          style={{ fontFamily: "'Dancing Script', cursive", color: "#000" }}
        >
          Welcome to our Wedding
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
                fontFamily: "'Poppins', sans-serif'",
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
            className="w-full py-2 text-white rounded-lg text-sm"
            style={{
              backgroundColor: isProcessing ? "#f7bfc1" : PINK_COLOR,
              cursor: isProcessing ? "not-allowed" : "pointer",
              fontFamily: "'Poppins', sans-serif'",
            }}
          >
            {isProcessing ? "Processing..." : "Unlock"}
          </button>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              onClose={() => setError("")}
              className="w-full mt-2"
              style={{
                fontSize: "0.85rem",
                display: "flex",
                justifyContent: "center",
              }}
              sx={{
                "& .MuiAlert-message": {
                  width: "100%",
                  textAlign: "center",
                  display: "block",
                  lineHeight: 1.3,
                },
                "& .MuiAlert-action": {
                  alignSelf: "center",
                  color: "#d32f2f",
                  fontSize: "0.85rem",
                },
                "& .MuiAlert-icon": {
                  fontSize: "1.2rem",
                  alignSelf: "center",
                },
              }}
            >
              {error.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </Alert>
          )}

          {/* Request Password Link */}
          <div className="mt-4 sm:mt-6 text-center w-full">
            <a
              href="mailto:nathanblaga90@gmail.com?cc=nicole.camilleri44@gmail.com&subject=Password%20Request&body=Dear%20Nathan%20%26%20Nicole,%0D%0A%0D%0ACould%20you%20please%20resend%20us%20our%20password%20again.%0D%0A%0D%0AKind%20Regards"
              className="request-link inline-flex items-center justify-center gap-2"
              style={{
                color: "#6b6b6b",
                textDecoration: "none",
                fontFamily: "'Poppins', sans-serif'",
                fontSize: "1.2rem",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
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
              Request Password
            </a>
          </div>
        </form>
      </div>

      <style>{`
        .bg-cover {
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        @media (min-width: 640px) and (max-width: 1023px) {
          .bg-cover {
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
          }
        }

        @media (min-width: 1024px) {
          .bg-cover {
            background-size: contain;
            background-position: top center;
            background-repeat: no-repeat;
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
