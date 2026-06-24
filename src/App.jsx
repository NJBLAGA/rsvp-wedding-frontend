import { useState, useEffect, useCallback } from "react";
import Home from "./components/Home";
import Rsvp from "./components/RSVP";
import Schedule from "./components/Schedule";
import FAQs from "./components/FAQs.jsx";
import LoginModal from "./components/LoginModal";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

const PINK = "#eda5a5";
const TABS = ["Home", "RSVP", "Schedule", "FAQs"];

export default function App() {
  const storedAccessToken = localStorage.getItem("accessToken");
  const storedTab = localStorage.getItem("activeTab");

  const [accessToken, setAccessToken] = useState(storedAccessToken || "");
  const [isLoggedIn, setIsLoggedIn] = useState(!!storedAccessToken);
  const [activeTab, setActiveTab] = useState(storedTab || "Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");

  useEffect(() => {
    if (isLoggedIn) localStorage.setItem("activeTab", activeTab);
  }, [activeTab, isLoggedIn]);

  const refreshAccessToken = useCallback(async () => {
    try {
      const res = await fetch("https://rsvp-wedding-backend.onrender.com/token/refresh", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data.accessToken) {
        setAccessToken(data.accessToken);
        localStorage.setItem("accessToken", data.accessToken);
        setIsLoggedIn(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Refresh token failed:", err);
      return false;
    }
  }, []);

  useEffect(() => {
    if (!storedAccessToken) refreshAccessToken();
  }, [refreshAccessToken, storedAccessToken]);

  const handleLogin = async (inputPass) => {
    try {
      const res = await fetch("https://rsvp-wedding-backend.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ pass_key: inputPass }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data.accessToken) {
        setAccessToken(data.accessToken);
        localStorage.setItem("accessToken", data.accessToken);
        setIsLoggedIn(true);
        setLogoutMessage("");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const handleLogout = async (message = "") => {
    try {
      await fetch("https://rsvp-wedding-backend.onrender.com/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }

    setIsLoggedIn(false);
    setAccessToken("");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("activeTab");
    setActiveTab("Home");
    setMenuOpen(false);

    if (message) {
      setLogoutMessage(message);
      setTimeout(() => setLogoutMessage(""), 8000);
      window.scrollTo(0, 0);
    }
  };

  const handleSessionExpired = async () => {
    const refreshed = await refreshAccessToken();
    if (!refreshed) handleLogout("Your session has expired. Please log in again.");
  };

  const drawerList = (
    <Box
      sx={{
        width: 250,
        backgroundColor: "#fff",
        height: "100%",
        boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        paddingTop: 2,
      }}
      role="presentation"
      onClick={() => setMenuOpen(false)}
      onKeyDown={() => setMenuOpen(false)}
    >
      <List>
        {TABS.map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              sx={{
                borderRadius: 2,
                marginX: 2,
                marginY: 0.5,
                color: activeTab === text ? PINK : "#000",
                fontWeight: activeTab === text ? "600" : "400",
                background:
                  activeTab === text
                    ? "linear-gradient(90deg, rgba(237,165,165,0.15), rgba(237,165,165,0.05))"
                    : "transparent",
                borderLeft: activeTab === text ? `4px solid ${PINK}` : "none",
                transition: "all 0.3s ease",
                "&:hover": { backgroundColor: "rgba(237,165,165,0.2)", color: PINK },
              }}
              onClick={() => setActiveTab(text)}
            >
              <ListItemText primary={text} sx={{ paddingLeft: 1 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              borderRadius: 2,
              marginX: 2,
              marginY: 0.5,
              color: "#000",
              "&:hover": { backgroundColor: "rgba(237,165,165,0.2)", color: PINK },
            }}
            onClick={() => handleLogout()}
          >
            <ListItemText primary="Logout" sx={{ paddingLeft: 1 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoggedIn && (
        <LoginModal
          isOpen={!isLoggedIn}
          onSubmit={handleLogin}
          logoutMessage={logoutMessage}
        />
      )}

      {isLoggedIn && (
        <>
          <nav className="border-b p-4 bg-white shadow-sm">
            {/* Desktop */}
            <div className="hidden md:flex justify-center space-x-8">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={`nav-btn ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
              <button
                className="nav-btn"
                onClick={() => handleLogout()}
              >
                Logout
              </button>
            </div>

            {/* Mobile */}
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
                style={{
                  fontWeight: 300,
                  fontSize: "1.8rem",
                  fontFamily: "'Dancing Script', cursive",
                  color: "#000",
                  transition: "all 0.3s ease",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    transition: "transform 0.3s ease",
                    fontSize: menuOpen ? "2.6rem" : "2rem",
                  }}
                >
                  {menuOpen ? "×" : "☰"}
                </span>
              </button>
            </div>
          </nav>

          <SwipeableDrawer
            anchor="left"
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            onOpen={() => setMenuOpen(true)}
          >
            {drawerList}
          </SwipeableDrawer>

          <main className="min-h-screen" style={{ color: "#000" }}>
            {activeTab === "Home" && <Home />}
            {activeTab === "RSVP" && (
              <Rsvp
                token={accessToken}
                onLogout={handleSessionExpired}
                refreshAccessToken={refreshAccessToken}
              />
            )}
            {activeTab === "Schedule" && <Schedule />}
            {activeTab === "FAQs" && <FAQs />}
          </main>
        </>
      )}
    </div>
  );
}
