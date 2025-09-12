import { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import BackgroundImage from "../assets/16264603_v839-my-10a.svg";

export default function Rsvp({ token, onLogout }) {
  const [records, setRecords] = useState([]);
  const [editCardId, setEditCardId] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [petals, setPetals] = useState([]);

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);

  const PETAL_COUNT = 25;
  const PETAL_COLOR = "#f28ca0";
  const EDIT_COLOR = "rgb(200,120,120)";
  const MAX_CHAR_NAME = 30;
  const MAX_CHAR = 75;

  useEffect(() => {
    const updateWindowSize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);
    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  useEffect(() => {
    const generatedPetals = [...Array(PETAL_COUNT)].map((_, i) => {
      const randomLeft = Math.random() * 100;
      const randomDuration = 15 + Math.random() * 20;
      const randomDelay = Math.random() * 12;
      const randomSize = 16 + Math.random() * 14;
      const path = (i % 6) + 1;
      return { randomLeft, randomDuration, randomDelay, randomSize, path };
    });
    setPetals(generatedPetals);
  }, []);

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          "https://rsvp-wedding-backend.onrender.com/family",
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (!res.ok) {
          if (res.status === 401) {
            setError("Session expired, please log in again.");
            setTimeout(() => onLogout?.(), 1500);
            return;
          }
          throw new Error("Failed to fetch RSVP invitations");
        }

        let data = await res.json();
        data.sort((a, b) =>
          a.is_guest === b.is_guest ? 0 : a.is_guest ? -1 : 1,
        );
        setRecords(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch RSVP invitation. Try again later.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchRecords();
  }, [token, onLogout]);

  const handleEditClick = (record) => {
    setEditCardId(record.id);
    setFormData({
      first_name: record.first_name || "",
      last_name: record.last_name || "",
      dietary_requirements: record.dietary_requirements || "",
      song_requests: record.song_requests || "",
      optional_comments: record.optional_comments || "",
      rsvp_status:
        record.rsvp_status === "Attending" ? "Attending" : "Not Attending",
      is_guest: record.is_guest,
      firstNameError: false,
      lastNameError: false,
    });
  };

  const handleChange = (field, value) => {
    if (field === "first_name" || field === "last_name") {
      if (value.length > MAX_CHAR_NAME) value = value.slice(0, MAX_CHAR_NAME);
      if (field === "first_name" && value.trim()) {
        setFormData((prev) => ({ ...prev, firstNameError: false }));
      }
      if (field === "last_name" && value.trim()) {
        setFormData((prev) => ({ ...prev, lastNameError: false }));
      }
    } else if (value.length > MAX_CHAR) value = value.slice(0, MAX_CHAR);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (id) => {
    if (!formData.is_guest) {
      const firstEmpty = !formData.first_name.trim();
      const lastEmpty = !formData.last_name.trim();
      if (firstEmpty || lastEmpty) {
        setFormData((prev) => ({
          ...prev,
          firstNameError: firstEmpty,
          lastNameError: lastEmpty,
        }));
        return;
      }
    }

    try {
      const response = await fetch(
        `https://rsvp-wedding-backend.onrender.com/rsvp/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired, please log in again.");
          setTimeout(() => onLogout?.(), 1500);
          return;
        }
        throw new Error("Failed to update RSVP");
      }

      const res = await fetch(
        "https://rsvp-wedding-backend.onrender.com/family",
        { headers: { Authorization: `Bearer ${token}` } },
      );

      let updatedData = await res.json();
      updatedData.sort((a, b) =>
        a.is_guest === b.is_guest ? 0 : a.is_guest ? -1 : 1,
      );
      setRecords(updatedData);
      setEditCardId(null);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 10000);
    } catch (err) {
      console.error(err);
      alert("Error updating RSVP. Try again.");
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 bg-white flex justify-center items-center z-50">
        <div className="flex items-center space-x-3 border-4 border-[rgb(200,120,120)] bg-[rgb(255,230,230)] text-[rgb(200,120,120)] px-6 py-4 rounded-md shadow-lg animate-pulse">
          <svg
            className="animate-spin h-6 w-6 text-[rgb(200,120,120)]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          <span className="font-semibold text-base">
            Loading RSVP invitation...
          </span>
        </div>
      </div>
    );

  if (error && !error.includes("Session expired"))
    return <p className="text-center mt-4 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen relative overflow-hidden px-2 sm:px-3 flex flex-col items-center">
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Poppins:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Background & Petals */}
      <div
        className="absolute inset-0 bg-center"
        style={{
          backgroundImage: `url(${BackgroundImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 pointer-events-none">
        {petals.map((_, i) => (
          <div key={i} className={`petal petal-${i}`} />
        ))}
      </div>

      {/* H1 */}
      <h1 className="relative z-10 drop-shadow-lg text-gray-800 text-center mb-2 mt-10">
        Your Invitation Awaits
      </h1>

      {/* Success message */}
      {showSuccess && (
        <>
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            numberOfPieces={500}
            recycle={false}
            gravity={0.2}
            friction={0.99}
          />
          <div className="flex items-center space-x-2 border-2 border-green-500 bg-green-100 text-green-800 px-4 py-2 rounded-md mb-4 z-50 relative">
            <CheckCircleIcon className="h-6 w-6" />
            <span className="font-semibold text-sm">
              RSVP saved successfully!
            </span>
          </div>
        </>
      )}

      {/* RSVP Cards */}
      <div className="p-2 sm:p-4 space-y-3 w-full">
        {records.map((record) => {
          const isEditing = editCardId === record.id;
          const headingName =
            record.first_name && record.last_name
              ? `${record.first_name} ${record.last_name}`
              : record.is_guest
                ? "Guest"
                : "Plus One";

          return (
            <div key={record.id}>
              {isEditing ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
                  <div className="w-full sm:max-w-sm mx-auto bg-white/90 rounded-xl px-4 py-4 max-h-[60vh] overflow-y-auto relative edit-modal">
                    {/* Close button */}
                    <button
                      onClick={() => setEditCardId(null)}
                      className="absolute top-2 right-2 font-bold text-xl transition-colors duration-200"
                      style={{ color: "#666" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "rgb(200,120,120)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#666")
                      }
                    >
                      ×
                    </button>

                    <h2
                      className="font-cursive text-3xl text-gray-800 mb-4 text-center"
                      style={{ fontFamily: "'Dancing Script', cursive" }}
                    >
                      {headingName}
                    </h2>

                    <EditForm
                      record={record}
                      formData={formData}
                      handleChange={handleChange}
                      handleSubmit={handleSubmit}
                      firstNameRef={firstNameRef}
                      lastNameRef={lastNameRef}
                      isGuest={record.is_guest}
                      EDIT_COLOR={EDIT_COLOR}
                      MAX_CHAR_NAME={MAX_CHAR_NAME}
                      MAX_CHAR={MAX_CHAR}
                    />
                  </div>
                </div>
              ) : (
                <div className="relative bg-white w-full sm:max-w-xl mx-auto rounded-xl px-4 py-2 border border-gray-300 shadow hover:shadow-lg transition-shadow duration-300 text-sm rsvp-card">
                  <div className="flex justify-between items-center border-b border-gray-300 pb-1 mb-2">
                    <h2
                      className="font-cursive text-3xl text-gray-800"
                      style={{ fontFamily: "'Dancing Script', cursive" }}
                    >
                      {headingName}
                    </h2>
                    <button
                      onClick={() => handleEditClick(record)}
                      className="font-bold"
                      style={{
                        fontFamily: "'Dancing Script', cursive",
                        color: EDIT_COLOR,
                        fontSize: "1rem",
                      }}
                    >
                      Edit RSVP
                    </button>
                  </div>

                  <div className="space-y-1 text-sm">
                    {[
                      { label: "RSVP", value: record.rsvp_status },
                      {
                        label: "Dietary Requirements",
                        value: record.dietary_requirements,
                      },
                      { label: "Song Request", value: record.song_requests },
                      {
                        label: "Optional Comments",
                        value: record.optional_comments,
                      },
                    ].map((item, idx) => (
                      <p key={idx} className="text-sm">
                        <span className="font-semibold">{item.label}:</span>{" "}
                        <span className="inline-block break-words">
                          {item.value || ""}
                        </span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .petal {
          position: absolute;
          background: radial-gradient(circle at 50% 50%, #ffe4e1 0%, ${PETAL_COLOR} 100%);
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          opacity: 0.4;
          transform: rotate(0deg);
          animation: sparkle 3s infinite alternate;
        }
        @keyframes sparkle {0% {opacity:0.2} 50% {opacity:0.35} 100% {opacity:0.8}}
        @keyframes floatPetal-1 {0%{transform:translateY(0) translateX(0) rotate(0deg);}50%{transform:translateY(50vh) translateX(20px) rotate(160deg);}100%{transform:translateY(100vh) translateX(-20px) rotate(320deg);} }
        @keyframes floatPetal-2 {0%{transform:translateY(0) translateX(0) rotate(0deg);}50%{transform:translateY(60vh) translateX(-40px) rotate(-200deg);}100%{transform:translateY(100vh) translateX(40px) rotate(-360deg);} }
        @keyframes floatPetal-3 {0%{transform:translateY(0) translateX(0) rotate(0deg);}33%{transform:translateY(33vh) translateX(30px) rotate(120deg);}66%{transform:translateY(66vh) translateX(-30px) rotate(240deg);}100%{transform:translateY(100vh) translateX(30px) rotate(360deg);} }
        @keyframes floatPetal-4 {0%{transform:translateY(0) translateX(0) rotate(0deg) scale(1);}50%{transform:translateY(70vh) translateX(50px) rotate(180deg) scale(1.2);}100%{transform:translateY(100vh) translateX(-50px) rotate(360deg) scale(1);} }
        @keyframes floatPetal-5 {0%{transform:translateY(0) translateX(0) rotate(0deg);}25%{transform:translateY(25vh) translateX(-25px) rotate(-90deg);}50%{transform:translateY(50vh) translateX(25px) rotate(90deg);}75%{transform:translateY(75vh) translateX(-25px) rotate(-270deg);}100%{transform:translateY(100vh) translateX(25px) rotate(360deg);} }
        @keyframes floatPetal-6 {0%{transform:translateY(0) translateX(0) rotate(0deg) scale(1);}50%{transform:translateY(55vh) translateX(60px) rotate(200deg) scale(0.9);}100%{transform:translateY(100vh) translateX(-60px) rotate(400deg) scale(1.1);} }

        ${petals
          .map(
            (p, i) => `
          .petal-${i} {
            left: ${p.randomLeft}%;
            width: ${p.randomSize}px;
            height: ${p.randomSize * 1.4}px;
            animation: floatPetal-${p.path} ${p.randomDuration}s linear infinite, sparkle 3s infinite alternate;
            animation-delay: ${p.randomDelay}s;
          }
        `,
          )
          .join("\n")}

        .bg-center { background-size: cover; background-position: center; background-repeat: no-repeat; }
        @media (min-width: 1024px) { 
          .bg-center { background-size: contain !important; background-repeat: no-repeat; background-position: top center; } 
          .rsvp-card { max-width: 42rem; } /* slightly narrower */
        }

        h1 { font-family: 'Dancing Script', cursive; text-align: center; font-size: 3.5rem; margin-top: 8rem; }
        
        @media (max-width: 1024px) { 
          h1 { font-size: 1.75rem; margin-top: 3rem; }
          .rsvp-card { padding: 0.5rem; font-size: 0.4375rem; }
          .rsvp-card h2 { font-size: 0.75rem; }
          .rsvp-card button { font-size: 0.4375rem; padding: 0.125rem 0.25rem; }
          .edit-modal { padding: 0.5rem; max-height: 30vh; }
          .edit-modal h2 { font-size: 1rem; margin-bottom: 0.5rem; }
          .edit-modal input, .edit-modal textarea { font-size: 0.4375rem; padding: 0.25rem; }
          .edit-modal button { font-size: 0.4375rem; padding: 0.25rem 0.5rem; }
        }

        @media (max-width: 375px) { 
          h1 { font-size: 1rem; margin-top: 2.5rem; }
          .rsvp-card h2 { font-size: 0.625rem; }
          .edit-modal h2 { font-size: 0.75rem; }
          .edit-modal input, .edit-modal textarea { font-size: 0.375rem; }
          .edit-modal button { font-size: 0.375rem; padding: 0.2rem 0.4rem; }
        }
      `}</style>
    </div>
  );
}

// EditForm component
function EditForm({
  record,
  formData,
  handleChange,
  handleSubmit,
  firstNameRef,
  lastNameRef,
  isGuest,
  EDIT_COLOR,
  MAX_CHAR_NAME,
  MAX_CHAR,
}) {
  return (
    <form className="space-y-2 text-sm">
      {!isGuest && (
        <div className="flex gap-2">
          <div className="flex flex-col w-1/2 relative">
            <label className="text-sm font-semibold">First Name</label>
            <span className="absolute top-0 right-2 text-[rgb(200,120,120)] font-bold text-xs">
              {formData.first_name.length}/{MAX_CHAR_NAME}
            </span>
            <input
              ref={firstNameRef}
              type="text"
              placeholder="First Name"
              value={formData.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
              className={`border p-2 rounded w-full mt-1 ${
                formData.firstNameError ? "border-[rgb(200,120,120)]" : ""
              }`}
            />
            {formData.firstNameError && (
              <p className="text-[rgb(200,120,120)] font-bold text-xs mt-1">
                This field is required
              </p>
            )}
          </div>

          <div className="flex flex-col w-1/2 relative">
            <label className="text-sm font-semibold">Last Name</label>
            <span className="absolute top-0 right-2 text-[rgb(200,120,120)] font-bold text-xs">
              {formData.last_name.length}/{MAX_CHAR_NAME}
            </span>
            <input
              ref={lastNameRef}
              type="text"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
              className={`border p-2 rounded w-full mt-1 ${
                formData.lastNameError ? "border-[rgb(200,120,120)]" : ""
              }`}
            />
            {formData.lastNameError && (
              <p className="text-[rgb(200,120,120)] font-bold text-xs mt-1">
                This field is required
              </p>
            )}
          </div>
        </div>
      )}

      <div>
        <label className="block font-semibold mb-1">RSVP Status:</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              checked={formData.rsvp_status === "Attending"}
              onChange={() => handleChange("rsvp_status", "Attending")}
              style={{ accentColor: EDIT_COLOR }}
            />
            Attending
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              checked={formData.rsvp_status === "Not Attending"}
              onChange={() => handleChange("rsvp_status", "Not Attending")}
              style={{ accentColor: EDIT_COLOR }}
            />
            Not Attending
          </label>
        </div>
      </div>

      {["dietary_requirements", "song_requests", "optional_comments"].map(
        (field, idx) => (
          <div key={idx} className="flex flex-col space-y-1 relative">
            <label className="block font-semibold">
              {field.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              :
            </label>
            <span className="absolute top-0 right-2 text-[rgb(200,120,120)] font-bold text-xs">
              {formData[field].length}/{MAX_CHAR}
            </span>
            <textarea
              value={formData[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              rows={3}
              maxLength={MAX_CHAR}
              className="border p-2 rounded w-full resize-none mt-1"
            />
          </div>
        ),
      )}

      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={() => handleSubmit(record.id)}
          className="px-6 py-2 rounded text-white font-semibold"
          style={{ backgroundColor: EDIT_COLOR }}
        >
          Save
        </button>
      </div>
    </form>
  );
}
