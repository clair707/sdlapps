import { useEffect, useState } from "react";
import api from "../api/axios"; // use the axios instance (step 1)
// If you skip step 1, replace `api` with `axios` and import axios directly.

const Appointments = () => {
  // List state
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);

  // Form state
  const [form, setForm] = useState({
    petId: "",
    datetime: "", // bound to <input type="datetime-local">
    reason: "",
    notes: "",
    status: "Scheduled", // Scheduled | Completed | Cancelled
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Load both pets (for dropdown) and appointments
    fetchPets();
    fetchAppointments();
  }, []);

  const fetchPets = async () => {
    try {
      const res = await api.get("/api/pets");
      setPets(res.data || []);
    } catch (error) {
      console.error("Error fetching pets:", error);
      setErrorMsg("Failed to load pets.");
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/appointments");
      // sort by datetime desc (newest first)
      const sorted = (res.data || []).sort(
        (a, b) => new Date(b.datetime) - new Date(a.datetime)
      );
      setAppointments(sorted);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setErrorMsg("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  const toISOStringIfPresent = (dtLocal) =>
    dtLocal ? new Date(dtLocal).toISOString() : "";

  const toLocalDatetimeValue = (isoString) => {
    // Convert ISO -> "YYYY-MM-DDTHH:MM" for <input type="datetime-local">
    if (!isoString) return "";
    const d = new Date(isoString);
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Basic validation
    if (!form.petId) return setErrorMsg("Please select a pet.");
    if (!form.datetime) return setErrorMsg("Please pick a date & time.");

    const payload = {
      petId: form.petId,
      datetime: toISOStringIfPresent(form.datetime),
      reason: form.reason.trim(),
      notes: form.notes.trim(),
      status: form.status,
    };

    try {
      if (editingId) {
        await api.put(`/api/appointments/${editingId}`, payload);
      } else {
        await api.post("/api/appointments", payload);
      }
      setForm({ petId: "", datetime: "", reason: "", notes: "", status: "Scheduled" });
      setEditingId(null);
      fetchAppointments();
    } catch (error) {
      console.error("Error saving appointment:", error);
      setErrorMsg("Failed to save. Please try again.");
    }
  };

  const handleEdit = (appt) => {
    setForm({
      petId: appt.petId || "",
      datetime: toLocalDatetimeValue(appt.datetime),
      reason: appt.reason || "",
      notes: appt.notes || "",
      status: appt.status || "Scheduled",
    });
    setEditingId(appt._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this appointment?");
    if (!ok) return;
    try {
      await api.delete(`/api/appointments/${id}`);
      fetchAppointments();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      setErrorMsg("Failed to delete. Please try again.");
    }
  };

  const petName = (id) => pets.find((p) => p._id === id)?.name || "Unknown";

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Appointment Management</h1>

      {/* Error banner */}
      {errorMsg && (
        <div className="mb-4 rounded border border-blue-200 bg-blue-50 text-blue-800 px-3 py-2">
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        {/* Pet select */}
        <select
          className="w-full border border-blue-200 p-2 rounded"
          value={form.petId}
          onChange={(e) => setForm({ ...form, petId: e.target.value })}
          required
        >
          <option value="">Select a pet</option>
          {pets.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} ({p.type})
            </option>
          ))}
        </select>

        {/* Date & time */}
        <input
          type="datetime-local"
          className="w-full border border-blue-200 p-2 rounded"
          value={form.datetime}
          onChange={(e) => setForm({ ...form, datetime: e.target.value })}
          required
        />

        {/* Reason */}
        <input
          type="text"
          placeholder="Reason (e.g., vaccination, check-up)"
          className="w-full border border-blue-200 p-2 rounded"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />

        {/* Notes */}
        <textarea
          placeholder="Notes (optional)"
          className="w-full border border-blue-200 p-2 rounded"
          rows={3}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        {/* Status */}
        <select
          className="w-full border border-blue-200 p-2 rounded"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option>Scheduled</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update Appointment" : "Create Appointment"}
        </button>
      </form>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-blue-600">Loading appointments…</div>
        ) : (
          appointments.map((a) => (
            <div
              key={a._id}
              className="p-3 border rounded flex flex-col sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="text-sm sm:text-base">
                <div className="font-medium">
                  {petName(a.petId)} — {a.status}
                </div>
                <div className="text-gray-600">
                  {new Date(a.datetime).toLocaleString()} {a.reason ? `· ${a.reason}` : ""}
                </div>
                {a.notes && <div className="text-gray-500">Notes: {a.notes}</div>}
              </div>
              <div className="mt-2 sm:mt-0 space-x-2">
                <button
                  onClick={() => handleEdit(a)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(a._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Appointments;