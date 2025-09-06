import { useState, useEffect, useRef } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Confetti from "react-confetti";

export default function Rsvp({ passphrase }) {
  const [records, setRecords] = useState([]);
  const [editCardId, setEditCardId] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Refs for guest inputs
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);

  // Track window size for Confetti
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);
    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  // Fetch RSVP data
  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `https://rsvp-wedding-backend.onrender.com/family/${passphrase}`,
        );
        if (!res.ok) throw new Error("Failed to fetch RSVP invitations");
        let data = await res.json();
        data.sort((a, b) =>
          a.is_guest === b.is_guest ? 0 : a.is_guest ? 1 : -1,
        );
        setRecords(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch RSVP invitation. Try again later.");
      } finally {
        setLoading(false);
      }
    };
    if (passphrase) fetchRecords();
  }, [passphrase]);

  const handleEditClick = (record) => {
    setEditCardId(record.id);
    setFormData({
      first_name: record.first_name || "",
      last_name: record.last_name || "",
      dietary_requirements: record.dietary_requirements || "",
      song_requests: record.song_requests || "",
      rsvp_status:
        record.rsvp_status === "Attending" ? "Attending" : "Not Attending",
      optional_comments: record.optional_comments || "",
    });
    setErrors({});
  };

  const handleChange = (field, value) => {
    const maxLength = ["first_name", "last_name"].includes(field) ? 25 : 100;
    if (value.length > maxLength) value = value.slice(0, maxLength);
    setFormData((prev) => ({ ...prev, [field]: value }));

    setErrors((prev) => {
      let msg = "";
      if (["first_name", "last_name"].includes(field) && !value.trim()) {
        msg = "This field is required";
      } else if (value.length >= maxLength) {
        msg = "Max character limit reached";
      }
      return { ...prev, [field]: msg };
    });
  };

  const handleSubmit = async (id, isGuest) => {
    const record = records.find((r) => r.id === id);

    if (isGuest) {
      let newErrors = {};
      if (!formData.first_name.trim()) {
        newErrors.first_name = "This field is required";
      }
      if (!formData.last_name.trim()) {
        newErrors.last_name = "This field is required";
      }
      if (Object.keys(newErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...newErrors }));
        // Auto-focus first missing field
        if (newErrors.first_name && firstNameRef.current) {
          firstNameRef.current.focus();
        } else if (newErrors.last_name && lastNameRef.current) {
          lastNameRef.current.focus();
        }
        return;
      }
    }

    if (
      Object.values(errors).some(
        (err) => err && !err.includes("Max character limit"),
      )
    ) {
      return; // stop if other validation errors exist
    }

    try {
      const payload = { ...formData };
      if (record.rsvp_expired) {
        delete payload.rsvp_status;
      }

      const response = await fetch(
        `https://rsvp-wedding-backend.onrender.com/rsvp/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!response.ok) throw new Error("Failed to update RSVP");

      const res = await fetch(
        `https://rsvp-wedding-backend.onrender.com/family/${passphrase}`,
      );
      let updatedData = await res.json();
      updatedData.sort((a, b) =>
        a.is_guest === b.is_guest ? 0 : a.is_guest ? 1 : -1,
      );
      setRecords(updatedData);
      setEditCardId(null);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Error updating RSVP. Try again.");
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 bg-white flex justify-center items-center z-50">
        <div className="flex items-center space-x-3 border-4 border-orange-500 bg-orange-100 text-orange-800 px-6 py-4 rounded-md shadow-lg animate-pulse">
          <svg
            className="animate-spin h-6 w-6 text-orange-600"
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

  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

  return (
    <div className="p-4 space-y-4">
      {showSuccess && (
        <>
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            numberOfPieces={150}
            recycle={false}
            gravity={0.2}
            friction={0.99}
          />
          <div className="flex items-center space-x-2 border-4 border-green-500 bg-green-100 text-green-800 px-4 py-2 rounded-md w-full sm:max-w-lg mx-auto">
            <CheckCircleIcon className="h-6 w-6" />
            <span className="font-semibold text-sm sm:text-base">
              RSVP updated!
            </span>
          </div>
        </>
      )}

      {records.map((record) => {
        const isEditing = editCardId === record.id;
        const isGuest = record.is_guest;
        const headingName =
          record.first_name && record.last_name
            ? `${record.first_name} ${record.last_name}`
            : isGuest
              ? "Plus One"
              : "Guest";

        return (
          <div
            key={record.id}
            className="border border-gray-300 rounded-xl p-5 shadow-sm w-full sm:max-w-lg mx-auto transition-all duration-200 text-sm sm:text-base break-words"
          >
            <h2 className="text-xl font-bold mb-3 text-gray-800 break-words">
              {headingName}
            </h2>

            {!isEditing ? (
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">RSVP Status:</span>{" "}
                  <span className="text-black font-semibold">
                    {record.rsvp_status}
                  </span>
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Dietary Requirements:</span>{" "}
                  {record.dietary_requirements || "None"}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Song Requests:</span>{" "}
                  {record.song_requests || "None"}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Optional Comments:</span>{" "}
                  {record.optional_comments || "None"}
                </p>

                <div className="flex justify-center mt-3">
                  <button
                    onClick={() => handleEditClick(record)}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors w-full md:w-1/2 mx-auto"
                  >
                    Edit RSVP
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 mt-3">
                {/* RSVP Status */}
                <label className="font-semibold">RSVP Status</label>
                <div className="flex space-x-4 items-center">
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name={`rsvp-${record.id}`}
                      value="Attending"
                      checked={formData.rsvp_status === "Attending"}
                      onChange={(e) =>
                        handleChange("rsvp_status", e.target.value)
                      }
                      className="accent-blue-500"
                      disabled={record.rsvp_expired}
                    />
                    <span>Attending</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name={`rsvp-${record.id}`}
                      value="Not Attending"
                      checked={formData.rsvp_status === "Not Attending"}
                      onChange={(e) =>
                        handleChange("rsvp_status", e.target.value)
                      }
                      className="accent-blue-500"
                      disabled={record.rsvp_expired}
                    />
                    <span>Not Attending</span>
                  </label>
                </div>

                {/* Guest names (required) */}
                {isGuest && (
                  <>
                    <div className="relative">
                      <label className="font-semibold">First Name</label>
                      <span className="absolute right-2 top-1 text-xs font-bold text-red-600">
                        {formData.first_name.length}/25
                      </span>
                      <input
                        ref={firstNameRef}
                        type="text"
                        value={formData.first_name}
                        onChange={(e) =>
                          handleChange("first_name", e.target.value)
                        }
                        placeholder="First Name"
                        className={`border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 ${
                          errors.first_name
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-400"
                        }`}
                      />
                      {errors.first_name && (
                        <p className="text-red-600 font-bold text-sm">
                          {errors.first_name}
                        </p>
                      )}
                    </div>

                    <div className="relative">
                      <label className="font-semibold">Last Name</label>
                      <span className="absolute right-2 top-1 text-xs font-bold text-red-600">
                        {formData.last_name.length}/25
                      </span>
                      <input
                        ref={lastNameRef}
                        type="text"
                        value={formData.last_name}
                        onChange={(e) =>
                          handleChange("last_name", e.target.value)
                        }
                        placeholder="Last Name"
                        className={`border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 ${
                          errors.last_name
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-400"
                        }`}
                      />
                      {errors.last_name && (
                        <p className="text-red-600 font-bold text-sm">
                          {errors.last_name}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* Dietary */}
                <div className="relative">
                  <label className="font-semibold">Dietary Requirements</label>
                  <span className="absolute right-2 top-1 text-xs font-bold text-red-600">
                    {formData.dietary_requirements.length}/100
                  </span>
                  <textarea
                    value={formData.dietary_requirements}
                    onChange={(e) =>
                      handleChange("dietary_requirements", e.target.value)
                    }
                    placeholder="Let us know your dietary requirements..."
                    className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 resize-none border-gray-300 focus:ring-blue-400"
                  />
                  {errors.dietary_requirements && (
                    <p className="text-red-600 font-bold text-sm">
                      {errors.dietary_requirements}
                    </p>
                  )}
                </div>

                {/* Song Requests */}
                <div className="relative">
                  <label className="font-semibold">Song Requests</label>
                  <span className="absolute right-2 top-1 text-xs font-bold text-red-600">
                    {formData.song_requests.length}/100
                  </span>
                  <textarea
                    value={formData.song_requests}
                    onChange={(e) =>
                      handleChange("song_requests", e.target.value)
                    }
                    placeholder="Let us know what bangers you want to listen to..."
                    className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 resize-none border-gray-300 focus:ring-blue-400"
                  />
                  {errors.song_requests && (
                    <p className="text-red-600 font-bold text-sm">
                      {errors.song_requests}
                    </p>
                  )}
                </div>

                {/* Optional Comments */}
                <div className="relative">
                  <label className="font-semibold">Optional Comments</label>
                  <span className="absolute right-2 top-1 text-xs font-bold text-red-600">
                    {formData.optional_comments.length}/100
                  </span>
                  <textarea
                    value={formData.optional_comments}
                    onChange={(e) =>
                      handleChange("optional_comments", e.target.value)
                    }
                    placeholder="Leave a cute message for the bride and groom..."
                    className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 resize-none border-gray-300 focus:ring-blue-400"
                  />
                  {errors.optional_comments && (
                    <p className="text-red-600 font-bold text-sm">
                      {errors.optional_comments}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 mt-3">
                  <button
                    onClick={() => handleSubmit(record.id, isGuest)}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded transition-colors flex-1 hover:bg-gray-300"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setEditCardId(null)}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
