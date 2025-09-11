import { useState, useEffect } from "react";
import Home from "./components/Home";
import Rsvp from "./components/RSVP";
import Schedule from "./components/Schedule";
import Details from "./components/Details.jsx";
import LoginModal from "./components/LoginModal";

export default function App() {
  const storedToken = localStorage.getItem("token");
  const storedTab = localStorage.getItem("activeTab");

  const [token, setToken] = useState(storedToken || "");
  const [isLoggedIn, setIsLoggedIn] = useState(!!storedToken);
  const [activeTab, setActiveTab] = useState(storedTab || "Home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn) localStorage.setItem("activeTab", activeTab);
  }, [activeTab, isLoggedIn]);

  const handleLogin = async (inputPass) => {
    try {
      const res = await fetch(
        "https://rsvp-wedding-backend.onrender.com/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pass_key: inputPass }),
        },
      );

      if (!res.ok) return false;

      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
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
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("activeTab");
    setActiveTab("Home");
    setMenuOpen(false);
  };

  const PETAL_PINK = "#d38c8c";

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <LoginModal isOpen={!isLoggedIn} onSubmit={handleLogin} />

      {isLoggedIn && (
        <>
          {/* Navigation */}
          <nav className="border-b p-4 bg-white shadow-sm">
            {/* Desktop Nav */}
            <div className="hidden md:flex justify-center space-x-8">
              {["Home", "RSVP", "Schedule", "Details"].map((tab) => (
                <button
                  key={tab}
                  className="pb-1 font-normal"
                  style={{
                    fontSize: "1.1rem",
                    borderBottom:
                      activeTab === tab ? `2px solid ${PETAL_PINK}` : "none",
                    color: activeTab === tab ? PETAL_PINK : "#000",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                  onClick={() => setActiveTab(tab)}
                  onMouseOver={(e) => {
                    if (activeTab !== tab)
                      e.currentTarget.style.color = PETAL_PINK;
                  }}
                  onMouseOut={(e) => {
                    if (activeTab !== tab)
                      e.currentTarget.style.color =
                        activeTab === tab ? PETAL_PINK : "#000";
                  }}
                >
                  {tab}
                </button>
              ))}

              <button
                onClick={handleLogout}
                className="pb-1 font-normal"
                style={{
                  fontSize: "1.1rem",
                  color: "#000",
                  fontFamily: "'Poppins', sans-serif",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = PETAL_PINK)}
                onMouseOut={(e) => (e.currentTarget.style.color = "#000")}
              >
                Logout
              </button>
            </div>

            {/* Mobile Nav */}
            <div className="md:hidden flex justify-between items-center">
              <span
                style={{
                  color: "#000",
                  fontWeight: 400,
                  fontSize: "1.6rem",
                  fontFamily: "'Dancing Script', cursive",
                }}
              >
                Nicole & Nathan
              </span>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-black focus:outline-none"
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

            {/* Mobile Dropdown */}
            {menuOpen && (
              <div className="md:hidden mt-2 flex flex-col space-y-2">
                {["Home", "RSVP", "Schedule", "Details"].map((tab) => (
                  <button
                    key={tab}
                    className="text-left font-normal px-2 py-1"
                    style={{
                      fontSize: "1.1rem",
                      color: activeTab === tab ? PETAL_PINK : "#000",
                      fontFamily: "'Poppins', sans-serif",
                    }}
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
                  className="text-left font-normal px-2 py-1"
                  style={{
                    fontSize: "1.1rem",
                    color: "#000",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.color = PETAL_PINK)
                  }
                  onMouseOut={(e) => (e.currentTarget.style.color = "#000")}
                >
                  Logout
                </button>
              </div>
            )}
          </nav>

          {/* Main content */}
          <main className="min-h-screen" style={{ color: "#000" }}>
            {activeTab === "Home" && <Home />}
            {activeTab === "RSVP" && <Rsvp token={token} />}
            {activeTab === "Schedule" && <Schedule />}
            {activeTab === "Details" && <Details />}
          </main>
        </>
      )}
    </div>
  );
}
