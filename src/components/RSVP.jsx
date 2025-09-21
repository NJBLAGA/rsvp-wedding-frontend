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
          this.xSpeed = 0.1 + Math.random() * 0.1;
          this.ySpeed = 0.05 + Math.random() * 0.1;
          this.flipSpeed = Math.random() * 0.01;
        }
        draw() {
          if (this.y > canvas.height || this.x > canvas.width) {
            this.x = -25;
            this.y = Math.random() * canvas.height * 2 - canvas.height;
            this.xSpeed = 0.1 + Math.random() * 0.1;
            this.ySpeed = 0.05 + Math.random() * 0.1;
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

  // Modal handling
  const openEditModal = (record) => {
    setEditRecord({
      ...record,
      song_requests: record.song_requests?.slice() || [],
    });
    setSongInput("");
    setFieldErrors({});
    document.getElementById("edit_modal").showModal();
  };

  const closeEditModal = () => {
    setEditRecord(null);
    setSongInput("");
    setFieldErrors({});
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
          song_requests: "Max Character Limit Reached",
        }));
      } else {
        setFieldErrors((prev) => ({ ...prev, song_requests: "" }));
      }
    } else {
      setEditRecord({ ...editRecord, [name]: value });

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
        song_requests: "Max Character Limit Reached",
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
        className="relative z-20 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-center mt-8 sm:mt-12 md:mt-16 lg:mt-20"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        RSVP
      </h1>

      {/* Alerts */}
      <div className="relative z-20 flex flex-col items-center mt-6 gap-4 min-h-[3rem]">
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
      <div className="relative z-20 flex flex-col gap-4 sm:gap-6 max-w-lg mx-auto mt-6">
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
                  className="text-xl sm:text-2xl md:text-3xl font-medium leading-snug"
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                  {fullName || "Guest"}
                </h2>
                <p className="text-sm sm:text-base md:text-lg">
                  <strong>RSVP Status:</strong>{" "}
                  {record.rsvp_status || "Not responded"}
                </p>
                <button
                  className="btn self-start mt-2 px-4 py-2 text-sm sm:text-base rounded-md"
                  onClick={() => openEditModal(record)}
                  style={{
                    backgroundColor: PINK_COLOR,
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
          className="modal-box w-[95vw] sm:w-[600px] h-[85vh] sm:h-auto max-w-md bg-white flex flex-col gap-4 relative border border-gray-200 shadow-sm rounded-lg p-4 sm:p-6 overflow-y-auto"
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
                className="text-xl sm:text-4xl text-center mb-3 sm:mb-4"
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
                      className={`checkbox theme-controller ${editRecord.rsvp_expired ? "disabled-radio" : ""}`}
                      disabled={editRecord.rsvp_expired}
                    />
                    {status}
                  </label>
                ))}
              </div>

              {editRecord.is_guest && (
                <>
                  <label className="font-medium text-sm sm:text-base relative flex flex-col">
                    First Name
                    <span
                      className="absolute right-2 top-0 text-xs sm:text-sm font-bold"
                      style={{ color: PINK_COLOR }}
                    >
                      {editRecord.first_name?.length || 0}/20
                    </span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={editRecord.first_name || ""}
                    onChange={handleChange}
                    maxLength={20}
                    className="input w-full px-2 py-1 sm:px-3 sm:py-2 border rounded-md text-sm sm:text-base"
                  />

                  <label className="font-medium text-sm sm:text-base relative flex flex-col mt-2">
                    Last Name
                    <span
                      className="absolute right-2 top-0 text-xs sm:text-sm font-bold"
                      style={{ color: PINK_COLOR }}
                    >
                      {editRecord.last_name?.length || 0}/20
                    </span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={editRecord.last_name || ""}
                    onChange={handleChange}
                    maxLength={20}
                    className="input w-full px-2 py-1 sm:px-3 sm:py-2 border rounded-md text-sm sm:text-base"
                  />
                </>
              )}

              <label className="font-medium text-sm sm:text-base relative flex flex-col">
                Dietary Requirements
                <span
                  className="absolute right-2 top-0 text-xs sm:text-sm font-bold"
                  style={{ color: PINK_COLOR }}
                >
                  {editRecord.dietary_requirements?.length || 0}/200
                </span>
              </label>
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

              <label className="font-medium text-sm sm:text-base relative flex flex-col">
                Song Requests
                <span
                  className="absolute right-2 top-0 text-xs sm:text-sm font-bold"
                  style={{ color: PINK_COLOR }}
                >
                  {editRecord.song_requests.length}/10
                </span>
              </label>
              <div className="flex gap-2">
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
                    backgroundColor: PINK_COLOR,
                    color: "white",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Add
                </button>
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
                className="btn mt-3 sm:mt-4 mx-auto text-xs sm:text-sm px-4 py-1 sm:px-6 sm:py-2 rounded-md"
                disabled={updating}
                style={{
                  backgroundColor: PINK_COLOR,
                  color: "white",
                  border: "none",
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

        input, textarea { font-family: 'Poppins', sans-serif; border: 1px solid black; background-color: white; }
        input:focus, textarea:focus { background-color: rgba(237,165,165,0.3); outline: none; border-color: ${PINK_COLOR}; }

        .checkbox {
          width: 22px;
          height: 22px;
          border: 2px solid ${PINK_COLOR};
          border-radius: 4px;
          background-color: rgba(237, 165, 165, 0.1);
          cursor: pointer;
          appearance: none;
          position: relative;
          transition: all 0.2s ease;
        }
        .checkbox:checked {
          background-color: rgba(237, 165, 165, 0.2);
          border-color: ${PINK_COLOR};
        }
        .checkbox:checked::after {
          content: "✔";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: ${PINK_COLOR};
          font-size: 16px;
          font-weight: bold;
        }

        @media (max-width: 639px) {
          dialog#edit_modal .modal-box {
            width: 90vw !important;
            height: 75vh !important;
            padding: 1rem !important;
            border-radius: 0.5rem !important;
            font-size: 0.9rem !important;
          }
          dialog#edit_modal h3 {
            font-size: 1.6rem !important;
            margin-bottom: 1rem !important;
          }
          dialog#edit_modal input,
          dialog#edit_modal textarea {
            font-size: 0.85rem !important;
            padding: 0.5rem !important;
          }
        }

        /* For devices ≤375px */
        @media (max-width: 375px) {
          dialog#edit_modal .modal-box {
            font-size: 0.8rem !important;
            padding: 0.75rem !important;
          }
          dialog#edit_modal h3 { font-size: 1.3rem !important; }
          dialog#edit_modal label { font-size: 0.8rem !important; }
          dialog#edit_modal input,
          dialog#edit_modal textarea {
            font-size: 0.8rem !important;
            padding: 0.4rem !important;
          }
          dialog#edit_modal button {
            font-size: 0.8rem !important;
            padding: 0.4rem 0.6rem !important;
          }
        }

        /* For devices ≤360px */
        @media (max-width: 360px) {
          dialog#edit_modal .modal-box {
            font-size: 0.75rem !important;
            padding: 0.6rem !important;
          }
          dialog#edit_modal h3 { font-size: 1.2rem !important; }
          dialog#edit_modal input,
          dialog#edit_modal textarea {
            font-size: 0.75rem !important;
            padding: 0.35rem !important;
          }
          dialog#edit_modal button {
            font-size: 0.75rem !important;
            padding: 0.35rem 0.5rem !important;
          }
        }

        .disabled-radio {
         background-color: #e5e5e5 !important;
         border-color: #bdbdbd !important;
         cursor: not-allowed;
        }
        .disabled-radio::after {
         color: #888888 !important;
        }

        /* Responsive tweaks for H1 */
        @media (max-width: 768px) {
          h1 { font-size: 2.25rem !important; margin-top: 1.5rem !important; }
        }
        @media (max-width: 480px) {
          h1 { font-size: 2rem !important; margin-top: 1.25rem !important; }
        }
        @media (max-width: 360px) {
          h1 { font-size: 1.75rem !important; margin-top: 1rem !important; }
        }

        /* Alerts scale */
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
