import { useEffect, useState, useRef } from "react";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundImage from "../assets/16264603_v839-my-10a.svg";
import Chip from "@mui/material/Chip";

export default function Rsvp({ token, onLogout, refreshAccessToken }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editRecord, setEditRecord] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [songInput, setSongInput] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [charCounts, setCharCounts] = useState({});

  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const petalArrayRef = useRef([]);
  const fullNameRefs = useRef({});
  const songChipContainerRef = useRef(null);
  const PINK_COLOR = "#eda5a5";

  // Fetch RSVP Data
  const fetchRsvpData = async () => {
    setLoading(true);
    setError("");
    setShowProcessing(true);
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
      setShowProcessing(false);
    }
  };

  useEffect(() => {
    if (token) fetchRsvpData();
  }, [token]);

  // Petal animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (!petalArrayRef.current.length) {
      const TOTAL = 10;
      const petalImg = new Image();
      petalImg.src = "https://djjjk9bjm164h.cloudfront.net/petal.png";

      class Petal {
        constructor() {
          this.reset();
        }
        reset() {
          this.x = Math.random() * canvas.width;
          this.y =
            Math.random() < 0.5
              ? Math.random() * canvas.height
              : -Math.random() * canvas.height;
          this.w = 25 + Math.random() * 10;
          this.h = 18 + Math.random() * 8;
          this.opacity = 0.8;
          this.ySpeed = 0.05 + Math.random() * 0.1;
          this.angle = Math.random() * Math.PI * 2;
          this.angleSpeed = 0.003 + Math.random() * 0.002;
          this.swayDistance = 60;
        }
        draw() {
          ctx.globalAlpha = this.opacity;
          ctx.drawImage(
            petalImg,
            this.x + Math.sin(this.angle) * this.swayDistance,
            this.y,
            this.w,
            this.h,
          );
        }
        animate() {
          this.y += this.ySpeed;
          this.angle += this.angleSpeed;
          if (this.y > canvas.height + 20) {
            this.reset();
            this.y = -20;
          }
          this.draw();
        }
      }

      petalImg.addEventListener("load", () => {
        for (let i = 0; i < TOTAL; i++) {
          petalArrayRef.current.push(new Petal());
        }
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

  // Modal handling
  const openEditModal = (record) => {
    setEditRecord({
      ...record,
      song_requests: record.song_requests?.slice() || [],
    });
    setSongInput("");
    setFieldErrors({});
    setCharCounts({});
    document.getElementById("edit_modal").showModal();
  };

  const closeEditModal = () => {
    setEditRecord(null);
    setSongInput("");
    setFieldErrors({});
    setCharCounts({});
    setShowProcessing(false);
    const modal = document.getElementById("edit_modal");
    if (modal) modal.close();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setEditRecord({ ...editRecord, [name]: checked ? value : "" });
    } else if (name === "song_input") {
      setSongInput(value);
      if (value.length >= 50) {
        setFieldErrors((prev) => ({
          ...prev,
          song_input: "Max Characters Reached",
        }));
      } else {
        setFieldErrors((prev) => ({ ...prev, song_input: "" }));
      }
    } else {
      setEditRecord({ ...editRecord, [name]: value });
      setCharCounts((prev) => ({ ...prev, [name]: value.length }));

      if (name === "dietary_requirements") {
        if (value.length >= 200) {
          setFieldErrors((prev) => ({
            ...prev,
            dietary_requirements: "Max Characters Reached",
          }));
        } else {
          setFieldErrors((prev) => ({ ...prev, dietary_requirements: "" }));
        }
      }

      if (name === "first_name" || name === "last_name") {
        if (value.length >= 20) {
          setFieldErrors((prev) => ({
            ...prev,
            [name]: "Max Characters Reached",
          }));
        } else {
          setFieldErrors((prev) => ({ ...prev, [name]: "" }));
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (editRecord.is_guest) {
      if (!editRecord.first_name?.trim())
        errors.first_name = "First name is required";
      if (!editRecord.last_name?.trim())
        errors.last_name = "Last name is required";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setUpdating(true);
    setShowProcessing(true);
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
            rsvp_status: editRecord.rsvp_status,
            dietary_requirements: editRecord.dietary_requirements,
            song_requests: editRecord.song_requests,
          }),
        },
      );
      if (!res.ok) throw new Error("Failed to update record");
      await fetchRsvpData();
      setShowProcessing(false);
      setShowSuccess(true);
      setShowConfetti(true);
      const modal = document.getElementById("edit_modal");
      if (modal) modal.close();
      setEditRecord(null);
      setTimeout(() => setShowSuccess(false), 5000);
      setTimeout(() => setShowConfetti(false), 7000);
    } catch (err) {
      console.error(err);
      setError("Opps - Something Went Wrong!");
      setShowProcessing(false);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddSong = () => {
    const song = songInput.trim();
    if (!song) return;
    if (song.length > 50) {
      setFieldErrors((prev) => ({
        ...prev,
        song_input: "Max Character Limit Reached",
      }));
      return;
    }
    if (editRecord.song_requests.includes(song)) {
      setFieldErrors((prev) => ({
        ...prev,
        song_requests: "Duplicate song are not allowed",
      }));
      setSongInput("");
      return;
    }
    if (editRecord.song_requests.length >= 10) {
      setFieldErrors((prev) => ({
        ...prev,
        song_requests: "Sorry - Max limit of 10 songs allowed",
      }));
      return;
    }
    setEditRecord((prev) => {
      const updated = { ...prev, song_requests: [...prev.song_requests, song] };
      setTimeout(() => {
        if (songChipContainerRef.current) {
          songChipContainerRef.current.scrollTo({
            left: songChipContainerRef.current.scrollWidth,
            behavior: "smooth",
          });
        }
      }, 50);
      return updated;
    });
    setSongInput("");
    setFieldErrors((prev) => ({ ...prev, song_requests: "" }));
  };

  const handleDeleteSong = (song) => {
    setEditRecord((prev) => ({
      ...prev,
      song_requests: prev.song_requests.filter((s) => s !== song),
    }));
  };

  useEffect(() => {
    records.forEach((record) => {
      const el = fullNameRefs.current[record.id];
      if (el)
        el.style.setProperty(
          "--button-height",
          `${el.getBoundingClientRect().height}px`,
        );
    });
  }, [records]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden px-4 py-6">
      {/* Background Image */}
      <div
        className="absolute top-0 left-0 w-full h-full z-0 bg-desktop"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
      />

      {/* H1 */}
      <h1
        className="relative z-20 text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-semibold text-center mt-12 sm:mt-16 md:mt-20 lg:mt-32 rsvp-title"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        RSVP
      </h1>

      {/* Alerts */}
      <div className="relative z-20 flex flex-col items-center mt-2 gap-4 min-h-[3rem]">
        <AnimatePresence mode="wait">
          {showProcessing && !editRecord && (
            <motion.div
              key="processing"
              role="alert"
              className="alert w-full max-w-lg flex items-center gap-2 h-10 sm:h-12 text-sm sm:text-base md:text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                backgroundColor: "rgba(237,165,165,0.6)",
                color: "#000000",
                border: "1px solid rgba(237,165,165,0.6)",
                boxShadow: "0 0 8px rgba(237,165,165,0.4)",
              }}
            >
              <span className="animate-spin">⏳</span> Processing
            </motion.div>
          )}

          {showSuccess && !loading && (
            <motion.div
              key="success"
              role="alert"
              className="alert w-full max-w-lg flex items-center gap-2 h-10 sm:h-12 text-sm sm:text-base md:text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                backgroundColor: "rgba(34,197,94,0.6)",
                border: "1px solid rgba(34,197,94,0.6)",
                boxShadow: "0 0 8px rgba(34,197,94,0.4)",
              }}
            >
              ✅ RSVP Submitted Successfully!
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              role="alert"
              className="alert w-full max-w-lg flex items-center gap-2 h-10 sm:h-12 text-sm sm:text-base md:text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                backgroundColor: "rgba(239,68,68,0.6)",
                color: "white",
                border: "1px solid rgba(239,68,68,0.6)",
                boxShadow: "0 0 8px rgba(239,68,68,0.4)",
              }}
            >
              ❌ {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confetti */}
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={120}
          gravity={0.18}
          initialVelocityX={{ min: -7, max: 7 }}
          initialVelocityY={{ min: 7, max: 20 }}
          confettiSource={{ x: 0, y: 0, w: window.innerWidth, h: 0 }}
        />
      )}

      {/* RSVP Cards */}
      <div className="relative z-20 flex flex-col gap-4 sm:gap-6 max-w-lg mx-auto mt-6 cards-wrapper">
        <AnimatePresence>
          {records.map((record) => {
            const fullName =
              `${record.first_name || ""} ${record.last_name || ""}`.trim();
            return (
              <motion.div
                layout
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
                className="card w-full rounded-lg flex flex-col gap-3 p-2 sm:p-3 md:p-4"
              >
                <h2
                  ref={(el) => (fullNameRefs.current[record.id] = el)}
                  className="guest-name text-xl sm:text-2xl md:text-3xl font-medium leading-snug"
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                  {fullName || "Guest"}
                </h2>
                <p className="text-sm sm:text-base md:text-lg">
                  <strong>RSVP Status:</strong>{" "}
                  {record.rsvp_status || "Not responded"}
                </p>
                <button
                  className="btn self-start mt-1 sm:mt-2 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-md edit-btn"
                  onClick={() => openEditModal(record)}
                  style={{
                    backgroundColor: "rgba(237,165,165,0.8)",
                    border: `1px solid ${PINK_COLOR}`,
                    color: "white",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Edit RSVP
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <dialog
        id="edit_modal"
        className="modal backdrop-blur-[1px] backdrop:bg-black/10"
      >
        <form
          method="dialog"
          onSubmit={handleSubmit}
          className="modal-box w-[95vw] sm:w-[600px] max-w-md bg-white flex flex-col gap-4 relative border border-gray-200 shadow-sm rounded-lg p-4 sm:p-6 pb-6 overflow-y-auto"
        >
          {/* Close */}
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-600 hover:text-black text-lg sm:text-xl"
            onClick={closeEditModal}
          >
            ✕
          </button>

          {editRecord && (
            <>
              <h3
                className="modal-name text-2xl sm:text-4xl text-center mb-3 sm:mb-4"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                {`${editRecord.first_name || ""} ${editRecord.last_name || ""}`.trim() ||
                  "Guest"}
              </h3>

              {/* RSVP Status */}
              <label className="font-medium text-sm sm:text-base mt-1 sm:mt-2">
                RSVP Status
              </label>
              <div className="flex gap-3 sm:gap-4 mb-2">
                {["Attending", "Not Attending"].map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2 cursor-pointer text-sm sm:text-base"
                  >
                    <input
                      type="radio"
                      name="rsvp_status"
                      value={status}
                      checked={editRecord.rsvp_status === status}
                      onChange={handleChange}
                      className={`radio-pink ${editRecord.rsvp_expired ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={editRecord.rsvp_expired}
                    />
                    {status}
                  </label>
                ))}
              </div>

              {/* Guest-only fields */}
              {editRecord.is_guest && (
                <>
                  <div className="relative">
                    <label className="font-medium text-sm sm:text-base flex flex-col">
                      First Name
                    </label>
                    <span
                      className="absolute top-0 right-0 text-xs font-bold"
                      style={{
                        color: PINK_COLOR,
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {charCounts.first_name || 0}/20
                    </span>
                    <input
                      type="text"
                      name="first_name"
                      placeholder="First Name"
                      value={editRecord.first_name || ""}
                      onChange={handleChange}
                      maxLength={20}
                      className="input w-full px-2 py-1 sm:px-3 sm:py-2 border rounded-md text-sm sm:text-base"
                    />
                    {fieldErrors.first_name && (
                      <p
                        className="text-xs mt-1"
                        style={{
                          color: PINK_COLOR,
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        {fieldErrors.first_name}
                      </p>
                    )}
                  </div>

                  <div className="relative mt-2">
                    <label className="font-medium text-sm sm:text-base flex flex-col">
                      Last Name
                    </label>
                    <span
                      className="absolute top-0 right-0 text-xs font-bold"
                      style={{
                        color: PINK_COLOR,
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {charCounts.last_name || 0}/20
                    </span>
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Last Name"
                      value={editRecord.last_name || ""}
                      onChange={handleChange}
                      maxLength={20}
                      className="input w-full px-2 py-1 sm:px-3 sm:py-2 border rounded-md text-sm sm:text-base"
                    />
                    {fieldErrors.last_name && (
                      <p
                        className="text-xs mt-1"
                        style={{
                          color: PINK_COLOR,
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        {fieldErrors.last_name}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Dietary */}
              <div className="relative">
                <label className="font-medium text-sm sm:text-base flex flex-col">
                  Dietary Requirements
                </label>
                <span
                  className="absolute top-0 right-0 text-xs font-bold"
                  style={{
                    color: PINK_COLOR,
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {charCounts.dietary_requirements || 0}/200
                </span>
                <textarea
                  name="dietary_requirements"
                  placeholder="Dietary Requirements"
                  value={editRecord.dietary_requirements || ""}
                  onChange={handleChange}
                  maxLength={200}
                  rows={5}
                  className="input w-full px-2 py-1 sm:px-3 sm:py-2 border rounded-md text-sm sm:text-base resize-none"
                  style={{ height: "6rem" }}
                />
                {fieldErrors.dietary_requirements && (
                  <p
                    className="text-xs mt-1"
                    style={{
                      color: PINK_COLOR,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {fieldErrors.dietary_requirements}
                  </p>
                )}
              </div>

              {/* Songs */}
              <div className="relative">
                <label className="font-medium text-sm sm:text-base flex flex-col">
                  Song Requests
                </label>
                <span
                  className="absolute top-0 right-0 text-xs font-bold"
                  style={{
                    color: PINK_COLOR,
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {editRecord.song_requests.length}/10
                </span>
                <div className="relative flex gap-2 mt-1">
                  <input
                    type="text"
                    name="song_input"
                    placeholder="Add a song"
                    value={songInput}
                    onChange={handleChange}
                    maxLength={50}
                    className="input w-full px-2 py-1 sm:px-3 sm:py-2 border rounded-md text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={handleAddSong}
                    className="px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm"
                    style={{
                      backgroundColor: "rgba(237,165,165,0.8)",
                      border: `1px solid ${PINK_COLOR}`,
                      color: "white",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Add
                  </button>
                </div>
                {fieldErrors.song_input && (
                  <p
                    className="text-xs mt-1"
                    style={{
                      color: PINK_COLOR,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {fieldErrors.song_input}
                  </p>
                )}
                {fieldErrors.song_requests && (
                  <p
                    className="text-xs mt-1"
                    style={{
                      color: PINK_COLOR,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {fieldErrors.song_requests}
                  </p>
                )}
              </div>

              <div
                ref={songChipContainerRef}
                className="flex gap-2 overflow-x-auto overflow-y-hidden min-h-[2.5rem] py-1 px-1"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {editRecord.song_requests.map((song, idx) => (
                  <Chip
                    key={idx}
                    label={song}
                    onDelete={() => handleDeleteSong(song)}
                    className="shrink-0 text-xs sm:text-sm"
                    style={{ maxWidth: "200px" }}
                  />
                ))}
              </div>

              <button
                type="submit"
                className="btn mt-2 sm:mt-3 mx-auto text-xs sm:text-sm px-4 py-1 sm:px-6 sm:py-2 rounded-md mb-0"
                disabled={updating}
                style={{
                  backgroundColor: "rgba(237,165,165,0.8)",
                  border: `1px solid ${PINK_COLOR}`,
                  color: "white",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                {updating ? "Processing..." : "Save & Submit"}
              </button>
            </>
          )}
        </form>
      </dialog>

      <style>{`
        html, body { margin: 0; padding: 0; }

        .bg-desktop {
          background-size: contain;
          background-position: top center;
          background-repeat: no-repeat;
        }

        @media (max-width: 639px) {
          .bg-desktop {
            background-size: cover;
            background-position: center;
          }
        }

        /* Inputs & Textareas */
        input, textarea {
          font-family: 'Poppins', sans-serif;
          background-color: #ffffff !important;
          color: #000000 !important;
          border: 1px solid #000000 !important;
        }
        input::placeholder, textarea::placeholder { color: #6b7280; }
        input:focus, textarea:focus {
          background-color: rgba(237,165,165,0.15) !important;
          outline: none !important;
          border-color: ${PINK_COLOR} !important;
          box-shadow: 0 0 0 2px rgba(237,165,165,0.15);
        }

        /* Custom PINK square radio */
        .radio-pink {
          width: 22px;
          height: 22px;
          appearance: none;
          -webkit-appearance: none;
          background-color: #fff;
          border: 2px solid ${PINK_COLOR};
          border-radius: 4px;
          display: inline-block;
          position: relative;
          cursor: pointer;
          transition: all 0.15s ease-in-out;
        }
        .radio-pink:checked {
          background-color: rgba(237,165,165,0.15);
          border-color: ${PINK_COLOR};
        }
        .radio-pink:checked::after {
          content: "✔";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: ${PINK_COLOR};
          font-size: 14px;
          font-weight: bold;
        }
        .radio-pink:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Guest name adjustments */
        .guest-name { white-space: normal; word-break: break-word; }
        .modal-name { white-space: normal; word-break: break-word; }

        @media (max-width: 375px) {
          .guest-name { font-size: 1.2rem !important; margin-bottom: 0.25rem !important; }
          .modal-name { font-size: 1.6rem !important; margin-bottom: 0.5rem !important; padding: 0.25rem 0 !important; }
        }
        @media (max-width: 360px) {
          .guest-name { font-size: 1.1rem !important; margin-bottom: 0.2rem !important; }
          .modal-name { font-size: 1.4rem !important; margin-bottom: 0.4rem !important; padding: 0.2rem 0 !important; }
        }

        /* Edit RSVP Button */
        .edit-btn { min-width: 4.25rem; }
        @media (max-width: 375px) {
          .cards-wrapper { margin-top: 0.35rem !important; }
          .edit-btn { font-size: 0.7rem !important; padding: 0.22rem 0.42rem !important; }
        }
        @media (max-width: 480px) {
          .btn { font-size: 0.78rem !important; padding: 0.28rem 0.5rem !important; }
        }
        @media (max-width: 360px) {
          .btn { font-size: 0.72rem !important; padding: 0.22rem 0.42rem !important; }
        }

        /* H1 responsive */
        @media (max-width: 1024px) {
          h1 { font-size: 3rem !important; margin-top: 8rem !important; }
        }
        @media (max-width: 768px) {
          h1 { font-size: 2.5rem !important; margin-top: 5.5rem !important; }
        }
        @media (max-width: 480px) {
          h1 { font-size: 2rem !important; margin-top: 4.5rem !important; }
        }
        @media (max-width: 360px) {
          h1 { font-size: 1.75rem !important; margin-top: 4rem !important; }
        }
        @media (min-width: 361px) and (max-width: 375px) {
          h1 { font-size: 2rem !important; margin-top: 3.5rem !important; }
        }

        /* Alerts */
        @media (max-width: 480px) {
          .alert { font-size: 0.85rem !important; height: 2.5rem !important; }
        }
        @media (max-width: 360px) {
          .alert { font-size: 0.8rem !important; height: 2.3rem !important; }
        }
      `}</style>
    </div>
  );
}
