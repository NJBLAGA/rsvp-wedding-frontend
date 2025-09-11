import { useState, useEffect } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import BackgroundImage from "../assets/16264603_v839-my-10a.svg";

export default function LoginModal({ isOpen, onSubmit }) {
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const PETAL_COUNT = 25;
  const PINK_COLOR = "#eda5a5";
  const [petals, setPetals] = useState([]);

  // Generate petals once
  useEffect(() => {
    const generatedPetals = [...Array(PETAL_COUNT)].map((_, i) => {
      const randomLeft = Math.random() * 100;
      const randomDuration = 15 + Math.random() * 20;
      const randomDelay = Math.random() * 12;
      const randomSize = 16 + Math.random() * 14;
      const path = (i % 6) + 1;
      return { randomLeft, randomDuration, randomDelay, randomSize, path };
    });
    setPetals(generatedPetals);
  }, []);

  // Reset modal state when closed
  useEffect(() => {
    if (!isOpen) {
      setPassphrase("");
      setError("");
      setShowPass(false);
      setIsProcessing(false);
    }
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

      <style>{`
        .petal {
          position: absolute;
          background: radial-gradient(circle at 50% 50%, #ffe4e1 0%, ${PINK_COLOR} 100%);
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          opacity: 0.4;
          transform: rotate(0deg);
          animation: sparkle 3s infinite alternate;
        }

        @keyframes sparkle { 0% { opacity:0.2 } 50% { opacity:0.35 } 100% { opacity:0.8 } }

        /* Float paths */
        @keyframes floatPetal-1 { 0%{transform:translateY(0) translateX(0) rotate(0deg);} 50%{transform:translateY(50vh) translateX(20px) rotate(160deg);} 100%{transform:translateY(100vh) translateX(-20px) rotate(320deg);} }
        @keyframes floatPetal-2 { 0%{transform:translateY(0) translateX(0) rotate(0deg);} 50%{transform:translateY(60vh) translateX(-40px) rotate(-200deg);} 100%{transform:translateY(100vh) translateX(40px) rotate(-360deg);} }
        @keyframes floatPetal-3 { 0%{transform:translateY(0) translateX(0) rotate(0deg);} 33%{transform:translateY(33vh) translateX(30px) rotate(120deg);} 66%{transform:translateY(66vh) translateX(-30px) rotate(240deg);} 100%{transform:translateY(100vh) translateX(30px) rotate(360deg);} }
        @keyframes floatPetal-4 { 0%{transform:translateY(0) translateX(0) rotate(0deg) scale(1);} 50%{transform:translateY(70vh) translateX(50px) rotate(180deg) scale(1.2);} 100%{transform:translateY(100vh) translateX(-50px) rotate(360deg) scale(1);} }
        @keyframes floatPetal-5 { 0%{transform:translateY(0) translateX(0) rotate(0deg);} 25%{transform:translateY(25vh) translateX(-25px) rotate(-90deg);} 50%{transform:translateY(50vh) translateX(25px) rotate(90deg);} 75%{transform:translateY(75vh) translateX(-25px) rotate(-270deg);} 100%{transform:translateY(100vh) translateX(25px) rotate(360deg);} }
        @keyframes floatPetal-6 { 0%{transform:translateY(0) translateX(0) rotate(0deg) scale(1);} 50%{transform:translateY(55vh) translateX(60px) rotate(200deg) scale(0.9);} 100%{transform:translateY(100vh) translateX(-60px) rotate(400deg) scale(1.1);} }

        /* Petal positions from state */
        ${petals
          .map(
            (p, i) => `
          .petal-${i} {
            left: ${p.randomLeft}%;
            width: ${p.randomSize}px;
            height: ${p.randomSize * 1.4}px;
            animation:
              floatPetal-${p.path} ${p.randomDuration}s linear infinite,
              sparkle 3s infinite alternate;
            animation-delay: ${p.randomDelay}s;
          }
        `,
          )
          .join("\n")}

        /* Background responsive */
        .modal-background {
          position: absolute;
          top: 0; left: 0;
          width: 100vw;
          height: 100vh;
          background-image: url(${BackgroundImage});
          background-repeat: no-repeat;
          background-position: center top;
          z-index: 0;
        }

        @media (max-width: 639px) { .modal-background { background-size: cover; } }
        @media (min-width: 640px) and (max-width: 1023px) { .modal-background { background-size: contain; background-position: top center; } }
        @media (min-width: 1024px) { .modal-background { background-size: contain; background-position: top center; } }

        /* Focus & pulse */
        @keyframes pinkPulse { 0%{box-shadow:0 0 6px rgba(237,165,165,0.6);} 50%{box-shadow:0 0 12px rgba(237,165,165,0.8);} 100%{box-shadow:0 0 6px rgba(237,165,165,0.6);} }
        .modal-input:focus { outline:none !important; border-color:${PINK_COLOR}; background-color:#fff9f9; animation:pinkPulse 1.8s ease-in-out infinite; }
        .modal-button:hover,.modal-button:focus { outline:none !important; animation:pinkPulse 1.8s ease-in-out infinite; }

        /* Modal container transparent */
        .modal-card { width: 90%; max-width: 360px; padding: 1.5rem; margin-top:2rem; text-align:center; background:transparent; box-shadow:none; }

        /* Header scaling */
        @media (max-width: 639px) { .modal-header { font-size: 2.2rem; color: #000; } }
        @media (min-width: 640px) and (max-width:1023px) { .modal-header { font-size: 2.5rem; color: #000; } }
        @media (min-width: 1024px) { .modal-header { font-size: 3rem; color: #000; } }
      `}</style>

      {/* Background */}
      <div className="modal-background" />

      {/* Animated Petals */}
      <div className="absolute inset-0 pointer-events-none">
        {petals.map((_, i) => (
          <div key={i} className={`petal petal-${i}`} />
        ))}
      </div>

      {/* Transparent container */}
      <div className="relative z-10 modal-card">
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

        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm">
          <a
            href="mailto:nathanblaga90@gmail.com?cc=nicole.camilleri44@gmail.com&subject=Passphrase%20Request"
            className="request-link break-words"
            style={{
              color: "#6b6b6b",
              textDecoration: "none",
              fontFamily: "'Poppins', sans-serif'",
            }}
          >
            Request Passphrase
          </a>
        </div>
      </div>
    </div>
  );
}
