import { useState, useEffect } from "react";
import Home from "./components/Home";
import Rsvp from "./components/RSVP";
import Schedule from "./components/Schedule";
import QandA from "./components/QandA";
import LoginModal from "./components/LoginModal";

export default function App() {
  // Initialize from localStorage
  const storedPass = localStorage.getItem("passphrase");
  const storedTab = localStorage.getItem("activeTab");

  const [passphrase, setPassphrase] = useState(storedPass || "");
  const [isLoggedIn, setIsLoggedIn] = useState(!!storedPass);
  const [activeTab, setActiveTab] = useState(storedTab || "Home");

  // Save tab when it changes
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("activeTab", activeTab);
    }
  }, [activeTab, isLoggedIn]);

  const handleLogin = async (inputPass) => {
    try {
      const res = await fetch(
        `https://rsvp-wedding-backend.onrender.com/family/${inputPass}`,
      );
      if (!res.ok) return false;

      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setPassphrase(inputPass);
        localStorage.setItem("passphrase", inputPass);
        setIsLoggedIn(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassphrase("");
    localStorage.removeItem("passphrase");
    localStorage.removeItem("activeTab"); // reset tab on logout
    setActiveTab("Home");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal */}
      <LoginModal isOpen={!isLoggedIn} onSubmit={handleLogin} />

      {/* Only show app if logged in */}
      {isLoggedIn && (
        <>
          {/* Navigation */}
          <nav className="flex justify-center space-x-6 border-b p-4 bg-white shadow-sm">
            {["Home", "RSVP", "Schedule", "Q&A"].map((tab) => (
              <button
                key={tab}
                className={`pb-1 ${
                  activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}

            {/* Logout inline tab */}
            <button
              onClick={handleLogout}
              className="pb-1 text-gray-600 hover:text-blue-600"
            >
              Logout
            </button>
          </nav>

          {/* Content */}
          <main>
            {activeTab === "Home" && <Home />}
            {activeTab === "RSVP" && <Rsvp passphrase={passphrase} />}
            {activeTab === "Schedule" && <Schedule />}
            {activeTab === "Q&A" && <QandA />}
          </main>
        </>
      )}
    </div>
  );
}
