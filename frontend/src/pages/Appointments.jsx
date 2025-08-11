import { useState, useEffect } from "react";
import axios from "axios";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  // Form and editingId state kept for logic, but form UI will be removed
  const [form, setForm] = useState({
    petName: "",
    ownerName: "",
    date: "",
    time: "",
    reason: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [showCreatePlaceholder, setShowCreatePlaceholder] = useState(false);

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
      if (editingId) {
        await axios.put(`/api/appointments/${editingId}`, form);
      } else {
        await axios.post("/api/appointments", form);
      }
      setForm({ petName: "", ownerName: "", date: "", time: "", reason: "" });
      setEditingId(null);
      fetchAppointments();
    } catch (error) {
      console.error("Error saving appointment:", error);
    }
  };

  const handleEdit = (appointment) => {
    setForm({
      petName: appointment.petName,
      ownerName: appointment.ownerName,
      date: appointment.date,
      time: appointment.time,
      reason: appointment.reason
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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">
        Appointment Management
      </h1>
      <div className="flex gap-8">
        {/* Appointment List - left side */}
        <div className="flex-1">
          <ul className="space-y-3">
            {appointments.map((appointment) => (
              <li
                key={appointment._id}
                className="p-3 border rounded"
              >
                <span>
                  {appointment.petName} - {appointment.ownerName} -{" "}
                  {appointment.date} {appointment.time} - {appointment.reason}
                </span>
              </li>
            ))}
          </ul>
        </div>
        {/* Action Buttons - right side */}
        <div className="flex flex-col gap-4 min-w-[200px]">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
            onClick={() => setShowCreatePlaceholder((prev) => !prev)}
          >
            Create Appointment
          </button>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded font-semibold"
            onClick={() => {
              // Only proceed if an appointment is selected
              // For now, just edit the first one as a placeholder.
              if (appointments.length > 0) handleEdit(appointments[0]);
            }}
          >
            Update Appointment
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold"
            onClick={() => {
              // Only proceed if an appointment is selected
              // For now, just delete the first one as a placeholder.
              if (appointments.length > 0) handleDelete(appointments[0]._id);
            }}
          >
            Delete Appointment
          </button>
          {showCreatePlaceholder && (
            <div className="mt-2 text-sm text-blue-700 bg-blue-100 rounded p-2 border border-blue-200">
              {/* Placeholder for future create form/modal */}
              Create form coming soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
