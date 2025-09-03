import { useState } from "react";

export default function LoginModal({ isOpen, onSubmit }) {
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit(passphrase);
    if (!success) {
      setError("Incorrect passphrase.\nPlease try again.");
      setPassphrase("");
    } else {
      setError("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg w-4/5 max-w-sm py-10 px-6">
        <h2 className="text-xl font-semibold text-center mb-2">
          Welcome to Our Wedding RSVP
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Enter the passphrase you received from your host
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-3"
        >
          <div className="relative w-3/4">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter passphrase"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "👁" : "🔒"}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center whitespace-pre-line">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-3/4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Unlock
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="mailto:nathanblaga90@gmail.com?cc=nicole.camilleri44@gmail.com&subject=Passphrase%20Request&body=Hi%20Nathan%20%26%20Nicole,%0D%0A%0D%0ACould%20you%20please%20send%20me%20the%20passphrase%20again,%20I%20am%20having%20trouble%20unlocking%20the%20RSVP%20page.%0D%0A%0D%0AKind%20Regards"
            className="text-sm text-blue-600 hover:underline"
          >
            Ask the Host
          </a>
        </div>
      </div>
    </div>
  );
}
