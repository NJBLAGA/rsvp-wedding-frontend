import { useState, useEffect } from "react";
import Home from "./components/Home";
import Rsvp from "./components/RSVP";
import Schedule from "./components/Schedule";
import FAQ from "./components/FAQ";
import LoginModal from "./components/LoginModal";

export default function App() {
  const storedPass = localStorage.getItem("passphrase");
  const storedTab = localStorage.getItem("activeTab");

  const [passphrase, setPassphrase] = useState(storedPass || "");
  const [isLoggedIn, setIsLoggedIn] = useState(!!storedPass);
  const [activeTab, setActiveTab] = useState(storedTab || "Home");
  const [menuOpen, setMenuOpen] = useState(false);

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
    localStorage.removeItem("activeTab");
    setActiveTab("Home");
    setMenuOpen(false);
  };

  const tabs = ["Home", "RSVP", "Schedule", "FAQ"]; // updated to match component

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal */}
      <LoginModal isOpen={!isLoggedIn} onSubmit={handleLogin} />

      {isLoggedIn && (
        <>
          {/* Navigation */}
          <nav className="border-b p-4 bg-white shadow-sm">
            {/* Desktop */}
            <div className="hidden md:flex justify-center space-x-6">
              {tabs.map((tab) => (
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
              <button
                onClick={handleLogout}
                className="pb-1 text-gray-600 hover:text-blue-600"
              >
                Logout
              </button>
            </div>

            {/* Mobile */}
            <div className="md:hidden flex justify-between items-center">
              <span className="font-semibold text-blue-600">
                Nicole & Nathan
              </span>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-600 hover:text-blue-600 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {menuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>

            {menuOpen && (
              <div className="md:hidden mt-2 flex flex-col space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={`text-left px-2 py-1 ${
                      activeTab === tab
                        ? "text-blue-600 font-semibold"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                    onClick={() => {
                      setActiveTab(tab);
                      setMenuOpen(false);
                    }}
                  >
                    {tab}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="text-left px-2 py-1 text-gray-600 hover:text-blue-600"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>

          {/* Main content */}
          <main>
            {activeTab === "Home" && <Home />}
            {activeTab === "RSVP" && <Rsvp passphrase={passphrase} />}
            {activeTab === "Schedule" && <Schedule />}
            {activeTab === "FAQ" && <FAQ />}
          </main>
        </>
      )}
    </div>
  );
}
