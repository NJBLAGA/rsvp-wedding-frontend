import { useState, useEffect } from "react";

export default function Rsvp({ passphrase }) {
  const [records, setRecords] = useState([]);
  const [editCardId, setEditCardId] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `https://rsvp-wedding-backend.onrender.com/family/${passphrase}`,
        );
        if (!res.ok) throw new Error("Failed to fetch records");
        let data = await res.json();

        // Sort: non-guests first, guests last
        data.sort((a, b) =>
          a.is_guest === b.is_guest ? 0 : a.is_guest ? 1 : -1,
        );

        setRecords(data);
      } catch (err) {
        console.error(err);
        setError("Unable to fetch RSVP records. Try again later.");
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
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (id, isGuest) => {
    if (
      isGuest &&
      (!formData.first_name.trim() || !formData.last_name.trim())
    ) {
      alert("Guests must have both First Name and Last Name.");
      return;
    }

    try {
      const response = await fetch(
        `https://rsvp-wedding-backend.onrender.com/rsvp/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
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
      alert("RSVP updated!");
    } catch (err) {
      console.error(err);
      alert("Error updating RSVP. Try again.");
    }
  };

  if (loading)
    return <p className="text-center mt-4">Loading RSVP records...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

  return (
    <div className="p-4 space-y-4">
      {records.map((record) => {
        const isEditing = editCardId === record.id;
        const isGuest = record.is_guest;

        const displayName =
          isGuest && (!record.first_name || !record.last_name)
            ? "Plus One"
            : `${record.first_name} ${record.last_name}`;

        return (
          <div
            key={record.id}
            className="bg-white shadow-md rounded-lg p-4 space-y-2"
          >
            <h2 className="text-xl font-semibold">{displayName}</h2>

            {!isEditing ? (
              <>
                <p>
                  <span className="font-semibold">Dietary Requirements:</span>{" "}
                  {record.dietary_requirements || "None"}
                </p>
                <p>
                  <span className="font-semibold">Song Request:</span>{" "}
                  {record.song_requests || "None"}
                </p>
                <p>
                  <span className="font-semibold">RSVP Status:</span>{" "}
                  {record.rsvp_status}
                </p>
                <p>
                  <span className="font-semibold">Optional Comments:</span>{" "}
                  {record.optional_comments || "None"}
                </p>
                <button
                  onClick={() => handleEditClick(record)}
                  className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                {isGuest && (
                  <>
                    <label className="font-semibold">First Name</label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) =>
                        handleChange("first_name", e.target.value)
                      }
                      className="border px-2 py-1 rounded w-full"
                    />
                    <label className="font-semibold">Last Name</label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) =>
                        handleChange("last_name", e.target.value)
                      }
                      className="border px-2 py-1 rounded w-full"
                    />
                  </>
                )}
                <label className="font-semibold">Dietary Requirements</label>
                <input
                  type="text"
                  value={formData.dietary_requirements}
                  onChange={(e) =>
                    handleChange("dietary_requirements", e.target.value)
                  }
                  className="border px-2 py-1 rounded w-full"
                />

                <label className="font-semibold">Song Requests</label>
                <textarea
                  value={formData.song_requests}
                  onChange={(e) =>
                    handleChange("song_requests", e.target.value)
                  }
                  className="border px-2 py-1 rounded w-full"
                />

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
                    />
                    <span>Not Attending</span>
                  </label>
                </div>

                <label className="font-semibold">Optional Comments</label>
                <input
                  type="text"
                  value={formData.optional_comments}
                  onChange={(e) =>
                    handleChange("optional_comments", e.target.value)
                  }
                  className="border px-2 py-1 rounded w-full"
                />

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSubmit(record.id, isGuest)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Submit RSVP
                  </button>
                  <button
                    onClick={() => setEditCardId(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
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
