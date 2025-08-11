import { useState, useEffect } from "react";
import axios from "axios";

// Axios instance: base URL via Nginx proxy, attach token if present
const api = axios.create({ baseURL: "/api" });
api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

const Pets = () => {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({
    name: "",
    species: "",
    age: "",
    ownerName: "",
    ownerContact: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const res = await api.get("/pets");
      setPets(res.data || []);
    } catch (error) {
      console.error("Error fetching pets:", error);
      setErrorMsg(
        typeof error.response?.data === "object"
          ? JSON.stringify(error.response.data)
          : error.response?.data || error.message
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Map to backend-required fields and coerce types
    const payload = {
      name: form.name?.trim(),
      species: form.species?.trim(), // NOT "type"
      age: form.age !== "" ? Number(form.age) : undefined,
      ownerName: form.ownerName?.trim(),
      ownerContact: form.ownerContact?.trim(),
    };

    try {
      if (editingId) {
        await api.put(`/pets/${editingId}`, payload);
      } else {
        await api.post("/pets", payload);
      }
      setForm({ name: "", species: "", age: "", ownerName: "", ownerContact: "" });
      setEditingId(null);
      fetchPets();
    } catch (error) {
      const msg =
        typeof error.response?.data === "object"
          ? JSON.stringify(error.response.data)
          : error.response?.data || error.message;
      console.error("Error saving pet:", msg);
      setErrorMsg(msg);
      alert(msg); // make the reason visible for quick debugging
    }
  };

  const handleEdit = (pet) => {
    setForm({
      name: pet.name || "",
      species: pet.species || "",
      age: pet.age ?? "",
      ownerName: pet.ownerName || "",
      ownerContact: pet.ownerContact || "",
    });
    setEditingId(pet._id);
  };

  const handleDelete = async (id) => {
    setErrorMsg("");
    try {
      await api.delete(`/pets/${id}`);
      fetchPets();
    } catch (error) {
      console.error("Error deleting pet:", error);
      setErrorMsg(
        typeof error.response?.data === "object"
          ? JSON.stringify(error.response.data)
          : error.response?.data || error.message
      );
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Pet Management</h1>

      {errorMsg && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Species (e.g., Dog, Cat)"
          className="w-full border p-2 rounded"
          value={form.species}
          onChange={(e) => setForm({ ...form, species: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Age"
          className="w-full border p-2 rounded"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
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
          placeholder="Owner Contact"
          className="w-full border p-2 rounded"
          value={form.ownerContact}
          onChange={(e) => setForm({ ...form, ownerContact: e.target.value })}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update Pet" : "Add Pet"}
        </button>
      </form>

      {/* List */}
      <ul className="space-y-3">
        {pets.map((pet) => (
          <li
            key={pet._id}
            className="p-3 border rounded flex justify-between items-center"
          >
            <span className="text-gray-800">
              <strong>{pet.name}</strong> — {pet.species} — {pet.age ?? "-"} yrs —{" "}
              {pet.ownerName} ({pet.ownerContact})
            </span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(pet)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(pet._id)}
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

export default Pets;