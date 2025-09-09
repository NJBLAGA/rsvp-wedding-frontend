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
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Embedded CSS for petals & responsive fixes */}
      <style>{`
        .petal {
          position: absolute;
          width: 20px;
          height: 28px;
          background: radial-gradient(circle at 50% 50%, #ffe4e1 0%, ${PINK_COLOR} 100%);
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          opacity: 0.8;
          transform: rotate(0deg);
          animation: floatPetal linear infinite, sparkle 3s infinite alternate;
        }

        @keyframes floatPetal {
          0% { transform: translateY(0) translateX(0) rotate(0deg); }
          50% { transform: translateY(50vh) translateX(15px) rotate(180deg); }
          100% { transform: translateY(100vh) translateX(-15px) rotate(360deg); }
        }

        @keyframes sparkle {
          0% { opacity: 0.6; }
          50% { opacity: 0.9; }
          100% { opacity: 0.6; }
        }

        ${[...Array(PETAL_COUNT)]
          .map((_, i) => {
            const baseDelay = i % 5;
            const extraDelay = i % 2 === 0 ? 0 : 0.2;
            return `.petal-${i} { left: ${10 + i * 4}%; animation-duration: ${
              20 + (i % 5) * 2
            }s; animation-delay: ${baseDelay + extraDelay}s; }`;
          })
          .join("\n")}

        /* Modal responsive */
        .modal-card { width: 100%; max-width: 360px; padding: 2rem 1.5rem; }

        @media (min-width: 640px) {
          .modal-card { max-width: 400px; padding: 2.5rem 2rem; }
        }
        @media (min-width: 768px) {
          .modal-card { max-width: 480px; padding: 3rem 2.5rem; }
        }
        @media (min-width: 1024px) {
          .modal-card { max-width: 512px; padding: 3.5rem 3rem; }
        }

        /* Background responsive fixes */
        .modal-background {
          position: absolute;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background-image: url(${BackgroundImage});
          background-repeat: no-repeat;
          background-position: top center;
          z-index: 0;
        }

        @media (max-width: 639px) {
          .modal-background { background-size: cover; }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .modal-background { background-size: cover; }
        }
        @media (min-width: 1024px) {
          .modal-background { background-size: contain; }
        }
      `}</style>

      {/* Background */}
      <div className="modal-background" />

      {/* Animated Petals */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(PETAL_COUNT)].map((_, i) => (
          <div key={i} className={`petal petal-${i}`} />
        ))}
      </div>

      {/* Modal Card */}
      <div className="relative z-10 modal-card bg-white rounded-2xl shadow-lg">
        <h2
          className="modal-header text-base sm:text-3xl text-center mb-2"
          style={{ fontFamily: "'Dancing Script', cursive", color: PINK_COLOR }}
        >
          Welcome to our Wedding
        </h2>
        <p className="text-xs sm:text-sm text-center text-gray-500 mb-4 sm:mb-6">
          Please enter the passphrase you received
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
              className="modal-input w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 outline-none"
              style={{ borderColor: PINK_COLOR }}
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
              style={{ color: "red" }}
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
            }}
          >
            {isProcessing ? "Processing..." : "Unlock"}
          </button>
        </form>

        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm">
          <a
            href="mailto:nathanblaga90@gmail.com?cc=nicole.camilleri44@gmail.com&subject=Passphrase%20Request&body=Hi%20Nathan%20%26%20Nicole,%0D%0A%0D%0ACould%20you%20please%20send%20me%20the%20passphrase%20again,%20I%20am%20having%20trouble%20unlocking%20the%20RSVP%20page.%0D%0A%0D%0AKind%20Regards"
            className="hover:underline break-words"
            style={{ color: PINK_COLOR }}
          >
            Request Passphrase
          </a>
        </div>
      </div>
    </div>
  );
}
