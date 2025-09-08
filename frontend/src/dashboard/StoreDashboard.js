import { useEffect, useState } from "react";

export default function StoreDashboard({ token }) {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const loadStores = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/store/dashboard`, { headers: { Authorization: `Bearer ${token}` } });
      setStores(await res.json());
    };
    loadStores();
  }, [token]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Store Owner Dashboard</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100"><th>ID</th><th>Name</th><th>Email</th><th>Address</th><th>Avg Rating</th></tr>
        </thead>
        <tbody>
          {stores.map(s=>(
            <tr key={s.id} className="border-t">
              <td>{s.id}</td><td>{s.name}</td><td>{s.email}</td><td>{s.address}</td><td>{s.avgRating.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
