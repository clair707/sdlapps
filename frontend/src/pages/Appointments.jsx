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
    reason: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAppointments();g
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("/api/appointments");
      setAppointments(res.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      alert("Failed to load appointments");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update appointment
        await axios.put(`/api/appointments/${editingId}`, form);
        setEditingId(null);
      } else {
        // Create appointment
        await axios.post("/api/appointments", form);
      }
      setForm({
        petName: "",
        ownerName: "",
        vetName: "",
        date: "",
        time: "",
        reason: "",
      });
      fetchAppointments();
    } catch (error) {
      console.error("Error saving appointment:", error);
      alert("Failed to save appointment");
    }
  };

  const handleEdit = (appointment) => {
    setForm({
      petName: appointment.petName || "",
      ownerName: appointment.ownerName || "",
      vetName: appointment.vetName || "",
      date: appointment.date || "",
      time: appointment.time || "",
      reason: appointment.reason || "",
    });
    setEditingId(appointment._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await axios.delete(`/api/appointments/${id}`);
      fetchAppointments();
      // If deleting the appointment being edited, reset form
      if (editingId === id) {
        setEditingId(null);
        setForm({
          petName: "",
          ownerName: "",
          vetName: "",
          date: "",
          time: "",
          reason: "",
        });
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Failed to delete appointment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">Appointments</h1>
        {/* Form Section */}
        <form
          className="bg-white shadow rounded p-6 mb-8 flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl font-semibold mb-2">
            {editingId ? "Edit Appointment" : "Add Appointment"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pet Name</label>
              <input
                type="text"
                name="petName"
                value={form.petName}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Owner Name</label>
              <input
                type="text"
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Vet Name</label>
              <input
                type="text"
                name="vetName"
                value={form.vetName}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Reason</label>
              <input
                type="text"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold"
            >
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button
                type="button"
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 font-semibold"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    petName: "",
                    ownerName: "",
                    vetName: "",
                    date: "",
                    time: "",
                    reason: "",
                  });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        {/* List Section */}
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Appointment List</h2>
          {appointments.length === 0 ? (
            <p>No appointments found.</p>
          ) : (
            <ul className="divide-y">
              {appointments.map((appointment) => (
                <li
                  key={appointment._id}
                  className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                >
                  <div>
                    <span className="font-medium">{appointment.petName}</span>
                    {" - "}
                    <span>{appointment.ownerName}</span>
                    {" - "}
                    <span>{appointment.vetName}</span>
                    {" - "}
                    <span>
                      {appointment.date} {appointment.time}
                    </span>
                    {" - "}
                    <span>{appointment.reason}</span>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                      onClick={() => handleEdit(appointment)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                      onClick={() => handleDelete(appointment._id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;