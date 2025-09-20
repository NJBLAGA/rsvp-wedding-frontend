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

  // Petal animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (!petalArrayRef.current.length) {
      const TOTAL = 15;
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
    } else {
      setEditRecord({ ...editRecord, [name]: value });

      if (name === "dietary_requirements" && value.length >= 200) {
        setFieldErrors((prev) => ({
          ...prev,
          dietary_requirements: "Max Characters Reached",
        }));
      } else if (name === "dietary_requirements") {
        setFieldErrors((prev) => ({ ...prev, dietary_requirements: "" }));
      }

      if (name === "song_input" && value.length >= 50) {
        setFieldErrors((prev) => ({
          ...prev,
          song_requests: "Max Character limit reached",
        }));
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

      // Close modal immediately
      const modal = document.getElementById("edit_modal");
      if (modal) modal.close();
      setEditRecord(null);

      setTimeout(() => setShowSuccess(false), 5000);
      setTimeout(() => setShowConfetti(false), 7000);
    } catch (err) {
      console.error(err);
      setError("Error! Task failed successfully.");
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
        song_requests: "Max Character limit reached",
      }));
      return;
    }

    if (editRecord.song_requests.includes(song)) {
      setFieldErrors((prev) => ({
        ...prev,
        song_requests: "Duplicate song not allowed",
      }));
      setSongInput("");
      return;
    }

    if (editRecord.song_requests.length >= 10) {
      setFieldErrors((prev) => ({
        ...prev,
        song_requests: "Max 10 songs allowed",
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
        className="absolute inset-0 z-0 bg-no-repeat bg-center bg-contain"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      />

      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
      />

      <h1
        className="relative z-20 text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-center mt-6 xs:mt-8 sm:mt-10 md:mt-16 lg:mt-25"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        Your Invitation Awaits
      </h1>

      {/* Alerts */}
      <div className="relative z-20 flex flex-col items-center mt-1 gap-4">
        <AnimatePresence mode="wait">
          {showProcessing && (
            <motion.div
              key="processing"
              role="alert"
              className="alert w-full max-w-lg my-4 flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 0.6, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              style={{
                backgroundColor: "rgba(250,204,21,0.6)",
                color: "white",
                border: "1px solid rgba(250,204,21,0.6)",
                boxShadow: "0 0 8px rgba(250,204,21,0.4)",
              }}
            >
              <span className="animate-spin">⏳</span> Processing
            </motion.div>
          )}

          {showSuccess && !loading && (
            <motion.div
              key="success"
              role="alert"
              className="alert w-full max-w-lg my-4 flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.9, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              style={{
                backgroundColor: "rgba(34,197,94,0.6)",
                color: "white",
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
              className="alert w-full max-w-lg my-4 flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 0.9, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
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
      <div className="relative z-20 flex flex-col gap-6 max-w-md mx-auto mt-1">
        {records.map((record) => {
          const fullName =
            `${record.first_name || ""} ${record.last_name || ""}`.trim();
          return (
            <div
              key={record.id}
              className="card w-full bg-transparent rounded-lg relative p-4 flex flex-col gap-2 my-4"
            >
              <h2
                ref={(el) => (fullNameRefs.current[record.id] = el)}
                className="text-3xl sm:text-4xl leading-none"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                {fullName || "Guest"}
              </h2>
              <p className="my-2">
                <strong>RSVP Status:</strong>{" "}
                {record.rsvp_status || "Not responded"}
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
                  fontSize: "1rem",
                  height: "2.2rem",
                  minWidth: "6rem",
                  padding: "0 0.8rem",
                  alignSelf: "flex-start",
                  borderRadius: "0.35rem",
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

          {editRecord && (
            <>
              <h3
                className="text-4xl text-center mb-4"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                {`${editRecord.first_name || ""} ${editRecord.last_name || ""}`.trim() ||
                  "Guest"}
              </h3>

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
                  {fieldErrors.first_name && (
                    <p
                      className="text-sm font-bold mt-1"
                      style={{ color: PINK_COLOR }}
                    >
                      {fieldErrors.first_name}
                    </p>
                  )}

                  <label className="font-medium">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={editRecord.last_name || ""}
                    onChange={handleChange}
                    className="input w-full px-3 py-2 border rounded-lg text-sm"
                  />
                  {fieldErrors.last_name && (
                    <p
                      className="text-sm font-bold mt-1"
                      style={{ color: PINK_COLOR }}
                    >
                      {fieldErrors.last_name}
                    </p>
                  )}
                </>
              )}

              {/* Dietary Requirements */}
              <label className="font-medium relative flex flex-col">
                Dietary Requirements
                <span
                  className="absolute right-2 top-0 text-sm font-bold"
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
                rows={6}
                className="input w-full px-3 py-2 border rounded-lg text-sm resize-none"
                style={{ height: "8rem" }}
              />
              {fieldErrors.dietary_requirements && (
                <p
                  className="text-sm font-bold mt-1"
                  style={{ color: PINK_COLOR }}
                >
                  {fieldErrors.dietary_requirements}
                </p>
              )}

              {/* Song Requests */}
              <label className="font-medium relative flex flex-col">
                Song Requests
                <span
                  className="absolute right-2 top-0 text-sm font-bold"
                  style={{ color: PINK_COLOR }}
                >
                  {editRecord.song_requests.length}/10
                </span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a song"
                  value={songInput}
                  onChange={(e) => setSongInput(e.target.value)}
                  maxLength={50}
                  className="input w-full px-3 py-2 border rounded-lg text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddSong}
                  style={{
                    backgroundColor: PINK_COLOR,
                    color: "white",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: "normal",
                    border: "none",
                    borderRadius: "0.35rem",
                    padding: "0 1rem",
                  }}
                >
                  Add
                </button>
              </div>
              {fieldErrors.song_requests && (
                <p
                  className="text-sm font-bold mt-1"
                  style={{ color: PINK_COLOR }}
                >
                  {fieldErrors.song_requests}
                </p>
              )}

              <div
                ref={songChipContainerRef}
                className="flex flex-wrap -mt-1 gap-2 overflow-x-auto"
              >
                {editRecord.song_requests.map((song, idx) => (
                  <Chip
                    key={idx}
                    label={song}
                    onDelete={() => handleDeleteSong(song)}
                    className="mt-1"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="btn mt-4 mx-auto"
                disabled={updating}
                style={{
                  backgroundColor: PINK_COLOR,
                  width: "50%",
                  height: "2rem",
                  color: "white",
                  border: "none",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: "normal",
                }}
              >
                {updating ? "Processing..." : "Save & Submit"}
              </button>
            </>
          )}
        </form>
      </dialog>

      <style>{`
        .bg-no-repeat { background-repeat: no-repeat; background-position: center; background-size: contain; }
        input, textarea { font-family: 'Poppins', sans-serif; border: 1px solid black; background-color: white; }
        input:focus, textarea:focus { background-color: rgba(237,165,165,0.3); outline: none; border-color: ${PINK_COLOR}; }
        textarea { width: 100%; height: 8rem; resize: none; word-wrap: break-word; }
        .checkbox { width: 16px; height: 16px; border: 1px solid ${PINK_COLOR}; border-radius: 4px; background-color: white; cursor: pointer; appearance: none; position: relative; }
        .checkbox:checked { background-color: rgba(237,165,165,0.3); }
        .checkbox:checked::after { content: "✔"; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: ${PINK_COLOR}; font-size: 14px; }
        @media (max-width: 767px) {
          dialog#edit_modal .modal-box { width: 90% !important; height: 70vh !important; overflow-y: auto; }
        }
      `}</style>
    </div>
  );
}
