import { useEffect, useState } from "react";

export default function UserDashboard({ token }) {
  const [stores, setStores] = useState([]);
  const [storeId, setStoreId] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    const loadStores = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/stores`, { headers: { Authorization: `Bearer ${token}` } });
      setStores(await res.json());
    };
    loadStores();
  }, [token]);

  const submitRating = async () => {
    if (!storeId || !rating) return alert("Select store and rating");
    const res = await fetch(`${process.env.REACT_APP_API_URL}/ratings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ store_id: storeId, ratings: rating }),
    });
    if (res.ok) { alert("Rating submitted"); setRating(""); }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">User Dashboard</h2>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2">Rate a Store</h3>
        <select className="border p-2" onChange={(e)=>setStoreId(e.target.value)}>
          <option value="">Select store</option>
          {stores.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input type="number" min="1" max="5" className="border p-2 ml-2" value={rating} onChange={(e)=>setRating(e.target.value)} />
        <button className="bg-blue-600 text-white px-3 py-1 ml-2" onClick={submitRating}>Submit</button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2">All Stores</h3>
        <table className="w-full border">
          <thead><tr className="bg-gray-100"><th>ID</th><th>Name</th><th>Address</th><th>Ratings</th></tr></thead>
          <tbody>
            {stores.map(s=>(
              <tr key={s.id} className="border-t">
                <td>{s.id}</td><td>{s.name}</td><td>{s.address}</td>
                <td>{s.Ratings.map(r=>`${r.User.name}: ${r.ratings}`).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
