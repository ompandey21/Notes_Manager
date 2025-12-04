import { useState } from "react";
// import api from "../api/axios";
// import { useNavigate } from "react-router-dom";

export default function LoginPage() {
//   const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

//   const login = async () => {
//     try {
//       const res = await api.post("/auth/login", form);
//       localStorage.setItem("token", res.data.token);
//       navigate("/dashboard");
//     } catch (err) {
//       alert(`Login failed ${err}`);
//     }
//   };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-xl font-bold mb-4">Login</h1>

      <input
        className="w-full p-2 border rounded mb-3"
        placeholder="Email"
        onChange={(e) => setForm({...form, email: e.target.value})}
      />
      <input
        className="w-full p-2 border rounded mb-3"
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({...form, password: e.target.value})}
      />

      <button className="w-full bg-blue-600 text-white p-2 rounded" 
    //   onClick={login}
      >
        Login
      </button>

      <p className="text-center mt-3 text-sm">
        Don’t have an account? <a className="text-blue-500" href="/register">Register</a>
      </p>
    </div>
  );
}
