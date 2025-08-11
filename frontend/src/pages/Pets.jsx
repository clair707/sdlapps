import { useState, useEffect } from "react";
import axios from "axios";

const Pets = () => {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({ name: "", type: "", age: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch Pets From Backend
  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const res = await axios.get("/api/pets");
      setPets(res.data);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/pets/${editingId}`, form);
      } else {
        await axios.post("/api/pets", form);
      }
      setForm({ name: "", type: "", age: "" });
      setEditingId(null);
      fetchPets();
    } catch (error) {
      console.error("Error saving pet:", error);
    }
  };

  const handleEdit = (pet) => {
    setForm({ name: pet.name, type: pet.type, age: pet.age });
    setEditingId(pet._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/pets/${id}`);
      fetchPets();
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Pet Management</h1>

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
          placeholder="Type (e.g., Dog, Cat)"
          className="w-full border p-2 rounded"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Age"
          className="w-full border p-2 rounded"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
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
            <span>
              {pet.name} - {pet.type} - {pet.age} years old
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