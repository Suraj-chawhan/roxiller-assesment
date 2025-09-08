import { useNavigate } from "react-router-dom";
import AdminDashboard from "../dashboard/AdminDashboard";
import StoreDashboard from "../dashboard/StoreDashboard";
import UserDashboard from "../dashboard/UserDashboard";

export default function Home({ token, role }) {
  const navigate = useNavigate();

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex flex-col justify-center items-center text-center ">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            Welcome to <span className="text-yellow-300">FullStack App</span>
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-blue-100 mb-8">
            A modern platform to manage stores, track ratings, and empower
            administrators, store owners, and users with powerful dashboards.
          </p>
          <button
            onClick={() => navigate("/signin")}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-full shadow-lg transition transform hover:scale-105"
          >
            🚀 Start Now
          </button>
        </div>

        {/* Features Section */}
        <div className="bg-white text-gray-900 py-16 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <h3 className="text-xl font-bold mb-3">📦 Add Stores Easily</h3>
            <p>
              Store owners can add and manage stores with a few clicks,
              ensuring smooth operations.
            </p>
          </div>

          <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <h3 className="text-xl font-bold mb-3">⭐ Track Store Ratings</h3>
            <p>
              Users can rate stores and see feedback, while owners monitor their
              performance in real time.
            </p>
          </div>

          <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
            <h3 className="text-xl font-bold mb-3">🛡 Manage Users</h3>
            <p>
              Admins can create, edit, or delete users seamlessly with a
              powerful control panel.
            </p>
          </div>

          <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white">
            <h3 className="text-xl font-bold mb-3">🏪 Manage Stores</h3>
            <p>
              Admins and store owners can manage store details, ensuring data is
              always up to date.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Role-based dashboards
  if (role === "admin") return <AdminDashboard token={token} />;
  if (role === "store_owner") return <StoreDashboard token={token} />;
  if (role === "user") return <UserDashboard token={token} />;

  return <p className="text-center mt-20">⚠️ Invalid role</p>;
}
