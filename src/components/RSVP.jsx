import { useEffect, useState, useRef } from "react";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundImage from "../assets/16264603_v839-my-10a.svg";

export default function Rsvp({ token, onLogout, refreshAccessToken }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editRecord, setEditRecord] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const petalArrayRef = useRef([]);
  const PINK_COLOR = "#eda5a5";

  const fetchRsvpData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        "https://rsvp-wedding-backend.onrender.com/family",
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.status === 401) {
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          onLogout();
          return;
        }
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch RSVP records.");

      let data = await res.json();
      data.sort((a, b) =>
        a.is_guest === b.is_guest ? 0 : a.is_guest ? 1 : -1,
      );
      setRecords(data);
    } catch (err) {
      console.error(err);
      setError("Could not load RSVP records. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchRsvpData();
  }, [token]);

  // Petal animation (kept as-is)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (!petalArrayRef.current.length) {
      const TOTAL = 20;
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
          this.xSpeed = 0.2 + Math.random() * 0.15;
          this.ySpeed = 0.1 + Math.random() * 0.15;
          this.flipSpeed = Math.random() * 0.01;
        }
        draw() {
          if (this.y > canvas.height || this.x > canvas.width) {
            this.x = -25;
            this.y = Math.random() * canvas.height * 2 - canvas.height;
            this.xSpeed = 0.2 + Math.random() * 0.15;
            this.ySpeed = 0.1 + Math.random() * 0.15;
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
          this.x += this.xSpeed;
          this.y += this.ySpeed;
          this.flip += this.flipSpeed;
          this.draw();
        }
      }

      petalImg.addEventListener("load", () => {
        for (let i = 0; i < TOTAL; i++) petalArrayRef.current.push(new Petal());
        const render = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          petalArrayRef.current.forEach((p) => p.animate());
          animationIdRef.current = requestAnimationFrame(render);
        };
        render();
      });
    }

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, []);

  const openEditModal = (record) => {
    setEditRecord({
      ...record,
      song_requests: record.song_requests?.join(", ") || "",
    });
    document.getElementById("edit_modal").showModal();
  };
  const closeEditModal = () => {
    document.getElementById("edit_modal").close();
    setEditRecord(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setEditRecord({ ...editRecord, [name]: checked ? value : "" });
    } else {
      setEditRecord({ ...editRecord, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch(
        `https://rsvp-wedding-backend.onrender.com/rsvp/${editRecord.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            first_name: editRecord.is_guest ? editRecord.first_name : undefined,
            last_name: editRecord.is_guest ? editRecord.last_name : undefined,
            dietary_requirements: editRecord.dietary_requirements,
            rsvp_status: editRecord.rsvp_status,
            song_requests: editRecord.song_requests
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          }),
        },
      );
      if (!res.ok) throw new Error("Failed to update record");
      await fetchRsvpData();
      closeEditModal();
      // Show success & confetti
      setShowSuccess(true);
      setShowConfetti(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      setTimeout(() => {
        setShowConfetti(false);
      }, 10000); // confetti 10s
    } catch (err) {
      console.error(err);
      setError("Error! Task failed successfully.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden px-4 py-6">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-no-repeat bg-center bg-contain"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
      />

      {/* Title */}
      <h1
        className="relative z-20 text-4xl sm:text-5xl md:text-6xl font-semibold mb-4 text-center mt-32"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        RSVP
      </h1>

      {/* Alerts */}
      <div className="relative z-20 flex flex-col items-center mt-2 gap-2">
        {loading && !error && (
          <motion.div
            role="alert"
            className="alert alert-warning w-full max-w-md"
            style={{ opacity: 0.5 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
          >
            Loading...
          </motion.div>
        )}
        {error && (
          <motion.div
            role="alert"
            className="alert alert-error w-full max-w-md"
            style={{ opacity: 0.5 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.div>
        )}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              role="alert"
              className="alert alert-success w-full max-w-md"
              style={{ opacity: 0.5 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
            >
              RSVP submitted successfully!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confetti */}
      {showConfetti && (
        <Confetti recycle={false} numberOfPieces={200} gravity={0.2} />
      )}

      {/* Cards */}
      <div className="relative z-20 flex flex-col gap-6 max-w-md mx-auto mt-4">
        {records.map((record) => {
          const fullName =
            `${record.first_name || ""} ${record.last_name || ""}`.trim() ||
            "Guest";
          return (
            <div
              key={record.id}
              className="card w-full bg-transparent rounded-lg relative p-4 flex flex-col gap-2"
            >
              <h2
                className="text-3xl sm:text-4xl"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                {fullName}
              </h2>
              <p>
                <strong>RSVP Status:</strong>{" "}
                {record.rsvp_status || "Not responded"}
              </p>
              <p>
                <strong>Dietary Requirements:</strong>{" "}
                {record.dietary_requirements || ""}
              </p>
              <p>
                <strong>Song Requests:</strong>{" "}
                {record.song_requests?.join(", ") || ""}
              </p>
              <button
                className="btn mt-2"
                onClick={() => openEditModal(record)}
                style={{
                  backgroundColor: PINK_COLOR,
                  color: "white",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: "normal",
                  border: "none",
                  fontSize: "1.1rem",
                  alignSelf: "flex-start",
                  padding: "0.4rem 0.8rem",
                }}
              >
                Edit RSVP
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <dialog
        id="edit_modal"
        className="modal backdrop-blur-[1px] backdrop:bg-black/10"
      >
        <form
          method="dialog"
          onSubmit={handleSubmit}
          className="modal-box w-full max-w-md bg-white flex flex-col gap-4 relative border border-gray-200 shadow-sm rounded-lg p-6"
        >
          <button
            type="button"
            className="absolute right-2 top-2 text-black"
            onClick={closeEditModal}
          >
            ✕
          </button>
          <h3
            className="text-4xl text-center mb-4"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Edit RSVP
          </h3>
          {editRecord && (
            <>
              {/* RSVP checkboxes */}
              <label className="font-medium">RSVP Status</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="rsvp_status"
                    value="Attending"
                    checked={editRecord.rsvp_status === "Attending"}
                    onChange={handleChange}
                    className="checkbox"
                  />
                  Attending
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="rsvp_status"
                    value="Not Attending"
                    checked={editRecord.rsvp_status === "Not Attending"}
                    onChange={handleChange}
                    className="checkbox"
                  />
                  Not Attending
                </label>
              </div>

              {editRecord.is_guest && (
                <>
                  <label className="font-medium">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={editRecord.first_name || ""}
                    onChange={handleChange}
                    className="input w-full px-3 py-2 border rounded-lg text-sm"
                  />
                  <label className="font-medium">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={editRecord.last_name || ""}
                    onChange={handleChange}
                    className="input w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </>
              )}
              <label className="font-medium">Dietary Requirements</label>
              <input
                type="text"
                name="dietary_requirements"
                placeholder="Dietary Requirements"
                value={editRecord.dietary_requirements || ""}
                onChange={handleChange}
                className="input w-full px-3 py-2 border rounded-lg text-sm"
              />
              <label className="font-medium">Song Requests</label>
              <input
                type="text"
                name="song_requests"
                placeholder="Song Requests (comma separated)"
                value={editRecord.song_requests || ""}
                onChange={handleChange}
                className="input w-full px-3 py-2 border rounded-lg text-sm"
              />

              <button
                type="submit"
                className="btn mt-4 mx-auto"
                disabled={updating}
                style={{
                  backgroundColor: PINK_COLOR,
                  width: "50%",
                  color: "white",
                  border: "none",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: "normal",
                }}
              >
                Submit
              </button>
            </>
          )}
        </form>
      </dialog>

      <style>{`
        .bg-no-repeat { background-repeat: no-repeat; background-position: center; background-size: contain; }
        input { font-family: 'Poppins', sans-serif; border: 1px solid black; background-color: white; }
        input:focus { background-color: rgb(237,165,165); outline: none; border-color: ${PINK_COLOR}; }
        .checkbox { width: 16px; height: 16px; border: 1px solid ${PINK_COLOR}; border-radius: 4px; background-color: white; cursor: pointer; appearance: none; position: relative; }
        .checkbox:checked::after { content: "✔"; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: ${PINK_COLOR}; font-size: 14px; }
        .alert { padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 500; text-align: center; }
        .alert-warning { background-color: #facc15; color: black; }
        .alert-error { background-color: #ef4444; color: white; }
        .alert-success { background-color: #22c55e; color: white; }
      `}</style>
    </div>
  );
}
