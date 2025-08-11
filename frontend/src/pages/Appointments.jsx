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
    <div className="p-6 max-w-4xl mx-auto">
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
  );
};

export default Appointments;