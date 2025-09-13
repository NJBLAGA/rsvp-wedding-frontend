import { useState, useEffect, useRef } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import BackgroundImage from "../assets/16264603_v839-my-10a.svg";

export default function LoginModal({ isOpen, onSubmit }) {
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef(null);

  const PINK_COLOR = "#eda5a5";

  // Reset modal state when closed
  useEffect(() => {
    if (!isOpen) {
      setPassphrase("");
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

    const TOTAL = 100;
    const petalArray = [];
    let mouseX = 0;

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
        this.xSpeed = 0.2 + Math.random() * 0.3; // slow
        this.ySpeed = 0.1 + Math.random() * 0.3; // slow
        this.flipSpeed = Math.random() * 0.01;
      }
      draw() {
        if (this.y > canvas.height || this.x > canvas.width) {
          this.x = -petalImg.width;
          this.y = Math.random() * canvas.height * 2 - canvas.height;
          this.xSpeed = 0.2 + Math.random() * 0.3;
          this.ySpeed = 0.1 + Math.random() * 0.3;
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
        this.x += this.xSpeed + mouseX * 2;
        this.y += this.ySpeed + mouseX * 1;
        this.flip += this.flipSpeed;
        this.draw();
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // clear but keep transparency
      petalArray.forEach((p) => p.animate());
      requestAnimationFrame(render);
    };

    const handleMouseMove = (e) => {
      mouseX =
        (e.clientX || (e.touches && e.touches[0].clientX)) / window.innerWidth;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleMouseMove);
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    petalImg.addEventListener("load", () => {
      for (let i = 0; i < TOTAL; i++) {
        petalArray.push(new Petal());
      }
      render();
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const success = await onSubmit(passphrase);
    if (!success) {
      setError("Incorrect passphrase.\nPlease try again.");
      setPassphrase("");
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
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${BackgroundImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "top center",
        }}
      />

      {/* Petals Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
      />

      {/* Transparent modal container */}
      <div className="relative z-20 modal-card">
        <h2
          className="modal-header mb-2"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Welcome to our Wedding
        </h2>

        <p
          className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6"
          style={{ fontFamily: "'Poppins', sans-serif'" }}
        >
          Please enter your passphrase
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-2 sm:space-y-3 w-full"
        >
          <div className="relative w-full">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter passphrase"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              required
              className="modal-input w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none"
              style={{
                borderColor: PINK_COLOR,
                fontFamily: "'Poppins', sans-serif'",
              }}
              disabled={isProcessing}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-pink-700"
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

          {error && (
            <p
              className="text-center text-xs sm:text-sm whitespace-pre-line"
              style={{ color: "red", fontFamily: "'Poppins', sans-serif'" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="modal-button w-full py-2 text-sm sm:text-base rounded-lg transition text-white"
            style={{
              backgroundColor: isProcessing ? "#f7bfc1" : PINK_COLOR,
              cursor: isProcessing ? "not-allowed" : "pointer",
              fontFamily: "'Poppins', sans-serif'",
            }}
          >
            {isProcessing ? "Processing..." : "Unlock"}
          </button>
        </form>
      </div>

      <style>{`
        .modal-card { width: 90%; max-width: 360px; padding: 1.5rem; margin-top:2rem; text-align:center; background:transparent; box-shadow:none; }
        .modal-input:focus { outline:none !important; border-color:${PINK_COLOR}; background-color:#fff9f9; animation:pinkPulse 1.8s ease-in-out infinite; }
        .modal-button:hover,.modal-button:focus { outline:none !important; animation:pinkPulse 1.8s ease-in-out infinite; }
        @keyframes pinkPulse { 0%{box-shadow:0 0 6px rgba(237,165,165,0.6);} 50%{box-shadow:0 0 12px rgba(237,165,165,0.8);} 100%{box-shadow:0 0 6px rgba(237,165,165,0.6);} }
        @media (max-width: 639px) { .modal-header { font-size: 2.2rem; color: #000; } }
        @media (min-width: 640px) and (max-width:1023px) { .modal-header { font-size: 2.5rem; color: #000; } }
        @media (min-width: 1024px) { .modal-header { font-size: 3rem; color: #000; } }
      `}</style>
    </div>
  );
}
