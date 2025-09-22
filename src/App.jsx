import { useState, useEffect, useCallback } from "react";
import Home from "./components/Home";
import Rsvp from "./components/RSVP";
import Schedule from "./components/Schedule";
import FAQ from "./components/FAQ.jsx";
import LoginModal from "./components/LoginModal";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

export default function App() {
  const storedAccessToken = localStorage.getItem("accessToken");
  const storedRefreshToken = localStorage.getItem("refreshToken");
  const storedTab = localStorage.getItem("activeTab");

  const [accessToken, setAccessToken] = useState(storedAccessToken || "");
  const [refreshToken, setRefreshToken] = useState(storedRefreshToken || "");
  const [isLoggedIn, setIsLoggedIn] = useState(!!storedAccessToken);
  const [activeTab, setActiveTab] = useState(storedTab || "Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  const PETAL_PINK = "#d38c8c";

  useEffect(() => {
    if (isLoggedIn) localStorage.setItem("activeTab", activeTab);
  }, [activeTab, isLoggedIn]);

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) return false;
    try {
      const res = await fetch(
        "https://rsvp-wedding-backend.onrender.com/refresh_token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: refreshToken }),
        },
      );
      if (!res.ok) return false;
      const data = await res.json();
      if (data.accessToken) {
        setAccessToken(data.accessToken);
        localStorage.setItem("accessToken", data.accessToken);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Refresh token failed:", err);
      return false;
    }
  }, [refreshToken]);

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
      if (data.accessToken && data.refreshToken) {
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        setIsLoggedIn(true);
        setSessionExpired(false);
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
    setAccessToken("");
    setRefreshToken("");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("activeTab");
    setActiveTab("Home");
    setMenuOpen(false);
  };

  const handleSessionExpired = async () => {
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      handleLogout();
      setSessionExpired(true);
    }
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
        {["Home", "RSVP", "Schedule", "FAQ"].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              sx={{
                borderRadius: 2,
                marginX: 2,
                marginY: 0.5,
                color: activeTab === text ? PETAL_PINK : "#000",
                fontWeight: activeTab === text ? "600" : "400",
                background:
                  activeTab === text
                    ? "linear-gradient(90deg, rgba(211,140,140,0.15), rgba(211,140,140,0.05))"
                    : "transparent",
                borderLeft:
                  activeTab === text ? `4px solid ${PETAL_PINK}` : "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(211,140,140,0.2)",
                  color: PETAL_PINK,
                },
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
              fontWeight: "400",
              "&:hover": {
                backgroundColor: "rgba(211,140,140,0.2)",
                color: PETAL_PINK,
              },
            }}
            onClick={handleLogout}
          >
            <ListItemText primary="Logout" sx={{ paddingLeft: 1 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Inline CSS for navbar button font sizes */}
      <style>{`
        .navbar-desktop-btn {
          font-size: 16px !important;
        }
        @media (min-width: 768px) {
          .navbar-desktop-btn {
            font-size: 20px !important;
          }
        }
      `}</style>

      <LoginModal
        isOpen={!isLoggedIn && !sessionExpired}
        onSubmit={handleLogin}
      />

      {sessionExpired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 max-w-sm text-center shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Session Expired</h2>
            <p className="mb-4">
              Your session has expired. Please log in again.
            </p>
            <LoginModal isOpen={true} onSubmit={handleLogin} />
          </div>
        </div>
      )}

      {isLoggedIn && (
        <>
          <nav className="border-b p-4 bg-white shadow-sm">
            {/* Desktop Navbar */}
            <div className="hidden md:flex justify-center space-x-8">
              {["Home", "RSVP", "Schedule", "FAQ"].map((tab) => (
                <button
                  key={tab}
                  className="navbar-desktop-btn pb-1 font-normal"
                  style={{
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
                className="navbar-desktop-btn pb-1 font-normal"
                style={{
                  color: "#000",
                  fontFamily: "'Poppins', sans-serif",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = PETAL_PINK)}
                onMouseOut={(e) => (e.currentTarget.style.color = "#000")}
              >
                Logout
              </button>
            </div>

            {/* Mobile Navbar */}
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
                    fontSize: menuOpen ? "2.6rem" : "2rem", // bigger X close
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
            {activeTab === "FAQ" && <FAQ />}
          </main>
        </>
      )}
    </div>
  );
}
