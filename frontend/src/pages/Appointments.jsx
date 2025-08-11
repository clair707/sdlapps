import { useState, useEffect } from "react";
import axios from "axios";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
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

  return (
    <div className="flex min-h-screen">
      {/* Main content (Appointment list) */}
      <div className="flex-1 p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">
          Appointment List
        </h1>

        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <ul className="space-y-3">
            {appointments.map((appointment) => (
              <li
                key={appointment._id}
                className="p-3 border rounded flex justify-between items-center"
              >
                <span>
                  {appointment.petName} - {appointment.ownerName} -{" "}
                  {appointment.vetName} - {appointment.date} {appointment.time} -{" "}
                  {appointment.reason}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 bg-gray-50 border-l px-6 py-8 flex flex-col gap-4 items-stretch fixed right-0 top-0 h-full">
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 font-semibold"
          onClick={() => alert("Create Appointment clicked")}
        >
          Create Appointment
        </button>
        <button
          className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 font-semibold"
          onClick={() => alert("Update Appointment clicked")}
        >
          Update Appointment
        </button>
        <button
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 font-semibold"
          onClick={() => alert("Delete Appointment clicked")}
        >
          Delete Appointment
        </button>
      </div>
    </div>
  );
};

export default Appointments;