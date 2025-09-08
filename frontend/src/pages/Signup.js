import { useState } from "react";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", address: "", role: "user" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) alert("Signup successful! Please login."); else alert(data.message);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full p-2 border rounded" name="name" placeholder="Name" onChange={handleChange} />
        <input className="w-full p-2 border rounded" name="email" type="email" placeholder="Email" onChange={handleChange} />
        <input className="w-full p-2 border rounded" name="password" type="password" placeholder="Password" onChange={handleChange} />
        <input className="w-full p-2 border rounded" name="address" placeholder="Address" onChange={handleChange} />
        <select className="w-full p-2 border rounded" name="role" onChange={handleChange}>
          <option value="user">User</option>
          <option value="store_owner">Store Owner</option>
        </select>
        <button className="bg-blue-600 text-white w-full py-2 rounded" >Signup</button>
      </form>
    </div>
  );
}
