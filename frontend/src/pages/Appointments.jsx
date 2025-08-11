import { useState, useEffect } from "react";
import axios from "axios";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    petName: "",
    ownerName: "",
    vetName: "",
    date: "",
    time: "",
    reason: ""
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch appointments from backend
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("/api/appointments");
      setAppointments(res.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        petName: form.petName?.trim(),
        ownerName: form.ownerName?.trim(),
        vetName: form.vetName?.trim(),
        date: form.date,
        time: form.time,
        reason: form.reason?.trim() || ""
      };

      if (editingId) {
        await axios.put(`/api/appointments/${editingId}`, payload);
      } else {
        await axios.post("/api/appointments", payload);
      }
      setForm({ petName: "", ownerName: "", vetName: "", date: "", time: "", reason: "" });
      setEditingId(null);
      fetchAppointments();
    } catch (error) {
      console.error("Error saving appointment:", error.response?.data || error.message);
      alert(typeof error.response?.data === "object" ? JSON.stringify(error.response.data) : (error.response?.data || error.message));
    }
  };

  const handleEdit = (appointment) => {
    setForm({
      petName: appointment.petName || "",
      ownerName: appointment.ownerName || "",
      vetName: appointment.vetName || "",
      date: appointment.date || "",
      time: appointment.time || "",
      reason: appointment.reason || ""
    });
    setEditingId(appointment._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/appointments/${id}`);
      fetchAppointments();
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">
        Appointment Management
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Pet Name"
          className="w-full border p-2 rounded"
          value={form.petName}
          onChange={(e) => setForm({ ...form, petName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Owner Name"
          className="w-full border p-2 rounded"
          value={form.ownerName}
          onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Vet Name"
          className="w-full border p-2 rounded"
          value={form.vetName}
          onChange={(e) => setForm({ ...form, vetName: e.target.value })}
          required
        />
        <input
          type="date"
          className="w-full border p-2 rounded"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        <input
          type="time"
          className="w-full border p-2 rounded"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Reason"
          className="w-full border p-2 rounded"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update Appointment" : "Add Appointment"}
        </button>
      </form>

      {/* List */}
      <ul className="space-y-3">
        {appointments.map((appointment) => (
          <li
            key={appointment._id}
            className="p-3 border rounded flex justify-between items-center"
          >
            <span>
              {appointment.petName} - {appointment.ownerName} - {appointment.vetName} -{" "}
              {appointment.date} {appointment.time} - {appointment.reason}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(appointment)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(appointment._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Appointments;
