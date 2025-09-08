import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Home from "./pages/Home";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
    }
  }, [token, role]);

  const logout = () => {
    localStorage.clear();
    setToken("");
    setRole("");
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <Link to="/" className="font-bold text-lg">FullStack App</Link>
          <div className="space-x-4">
            {!token ? (
              <>
                <Link to="/signin" className="hover:underline">Signin</Link>
                <Link to="/signup" className="hover:underline">Signup</Link>
              </>
            ) : (
              <>
                <Link to="/" className="hover:underline">Dashboard</Link>
                <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
              </>
            )}
          </div>
        </nav>

        {/* Routes */}
        <main className="flex-1  bg-gray-100">
          <Routes>
            <Route path="/" element={<Home token={token} role={role} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin setToken={setToken} setRole={setRole} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white p-4 text-center">
          © {new Date().getFullYear()} FullStack App. All Rights Reserved.
        </footer>
      </div>
    </Router>
  );
}

export default App;
