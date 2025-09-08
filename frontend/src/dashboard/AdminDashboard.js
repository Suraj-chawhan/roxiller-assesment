import { useEffect, useState } from "react";

export default function AdminDashboard({ token }) {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });

  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });

  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editStoreData, setEditStoreData] = useState({
    id: "",
    name: "",
    email: "",
    address: "",
  });


  useEffect(() => {
    const loadDashboard = async () => {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/admin/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(await res.json());
      loadUsers();
      loadStores();
      loadOwners();
    };
    loadDashboard();
  }, [token]);


  const loadUsers = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(await res.json());
  };


  const deleteUser = async (id) => {
    await fetch(`${process.env.REACT_APP_API_URL}/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadUsers();
  };


  const loadOwners = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const all = await res.json();
    setOwners(all.filter((u) => u.role === "store_owner"));
  };


  const createUser = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newUser),
    });
    if (res.ok) {
      alert("User created");
      setNewUser({ name: "", email: "", password: "", address: "", role: "user" });
      loadUsers();
    } else {
      const err = await res.json();
      alert(err.message);
    }
  };

  
  const createStore = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/stores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newStore),
    });
    if (res.ok) {
      alert("Store created");
      setNewStore({ name: "", email: "", address: "", owner_id: "" });
      loadStores();
    } else {
      const err = await res.json();
      alert(err.message);
    }
  };
  const loadStores = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/stores`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStores(await res.json());
  };

  
  const deleteStore = async (id) => {
    await fetch(`${process.env.REACT_APP_API_URL}/stores/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadStores();
  };

  
  const openEditModal = (s) => {
    setEditStoreData({
      id: s.id,
      name: s.name,
      email: s.email,
      address: s.address,
    });
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    setEditStoreData({ ...editStoreData, [e.target.name]: e.target.value });
  };

  const saveEditStore = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/stores/${editStoreData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: editStoreData.name,
        email: editStoreData.email,
        address: editStoreData.address,
      }),
    });
    setEditModalOpen(false);
    loadStores();
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>

    
      <div className="bg-white p-4 rounded shadow flex space-x-6">
        <p>
          <b>Users:</b> {stats.totalUsers}
        </p>
        <p>
          <b>Stores:</b> {stats.totalStores}
        </p>
        <p>
          <b>Ratings:</b> {stats.totalRatings}
        </p>
      </div>

      {/* Create User */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-3">Create User</h3>
        <div className="flex flex-wrap gap-2">
          <input
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="border p-2 flex-1"
          />
          <input
            placeholder="Email"
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border p-2 flex-1"
          />
          <input
            placeholder="Password"
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="border p-2 flex-1"
          />
          <input
            placeholder="Address"
            value={newUser.address}
            onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
            className="border p-2 flex-1"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="border p-2"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="store_owner">Store Owner</option>
          </select>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={createUser}
          >
            Create
          </button>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2">Users</h3>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u.id} className="border-t">
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.address}</td>
                <td>{u.role}</td>
                <td>
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Store */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2">Create Store</h3>
        <div className="flex flex-wrap gap-2">
          <input
            placeholder="Name"
            value={newStore.name}
            onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
            className="border p-2 flex-1"
          />
          <input
            placeholder="Email"
            type="email"
            value={newStore.email}
            onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
            className="border p-2 flex-1"
          />
          <input
            placeholder="Address"
            value={newStore.address}
            onChange={(e) =>
              setNewStore({ ...newStore, address: e.target.value })
            }
            className="border p-2 flex-1"
          />
          <select
            value={newStore.owner_id}
            onChange={(e) =>
              setNewStore({ ...newStore, owner_id: e.target.value })
            }
            className="border p-2"
          >
            <option value="">Select Owner</option>
            {owners?.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={createStore}
          >
            Create
          </button>
        </div>
      </div>

      {/* Stores List */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2">Stores</h3>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Owner</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores?.map((s) => (
              <tr key={s.id} className="border-t">
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.address}</td>
                <td>{s.owner_id}</td>
                <td>
                  <button
                    className="text-blue-600 mr-2"
                    onClick={() => openEditModal(s)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => deleteStore(s.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Store Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Edit Store</h3>
            <input
              type="text"
              name="name"
              value={editStoreData.name}
              onChange={handleEditChange}
              placeholder="Name"
              className="border p-2 w-full mb-3"
            />
            <input
              type="email"
              name="email"
              value={editStoreData.email}
              onChange={handleEditChange}
              placeholder="Email"
              className="border p-2 w-full mb-3"
            />
            <input
              type="text"
              name="address"
              value={editStoreData.address}
              onChange={handleEditChange}
              placeholder="Address"
              className="border p-2 w-full mb-3"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveEditStore}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
  
