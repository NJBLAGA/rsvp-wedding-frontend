import { useState, useEffect } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function LoginModal({ isOpen, onSubmit }) {
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset state whenever modal closes or reopens
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
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm px-[10%]"
      style={{ backgroundColor: "#fffbf7" }}
    >
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm py-8 px-4 sm:py-10 sm:px-6">
        <h2 className="text-base sm:text-xl font-semibold text-center mb-2">
          Welcome to Our Wedding RSVP
        </h2>
        <p className="text-xs sm:text-sm text-center text-gray-500 mb-4 sm:mb-6">
          Enter the passphrase you received from your host
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-2 sm:space-y-3 w-full"
        >
          <div className="relative w-full sm:w-3/4">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter passphrase"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              disabled={isProcessing}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
            <p className="text-red-500 text-xs sm:text-sm text-center whitespace-pre-line">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full sm:w-3/4 py-2 text-sm sm:text-base rounded-lg transition ${
              isProcessing
                ? "bg-blue-400 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isProcessing ? "Processing..." : "Unlock"}
          </button>
        </form>

        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm">
          <a
            href="mailto:nathanblaga90@gmail.com?cc=nicole.camilleri44@gmail.com&subject=Passphrase%20Request&body=Hi%20Nathan%20%26%20Nicole,%0D%0A%0D%0ACould%20you%20please%20send%20me%20the%20passphrase%20again,%20I%20am%20having%20trouble%20unlocking%20the%20RSVP%20page.%0D%0A%0D%0AKind%20Regards"
            className="text-blue-600 hover:underline break-words"
          >
            Request Passphrase
          </a>
        </div>
      </div>
    </div>
  );
}
