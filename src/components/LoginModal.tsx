// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// interface LoginModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onLogin: () => void;
// }

// const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
//     const navigate = useNavigate();
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

//     if (!isOpen) return null;

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         // Simulate login
//         if (email && password) {
//             onLogin();
//             onClose();
//         } else {
//             alert('Please enter dummy credentials');
//         }
//     };

//     return (
//         <div style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: 'rgba(0, 0, 0, 0.7)',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             zIndex: 1000
//         }} onClick={onClose}>
//             <div style={{
//                 backgroundColor: '#fff',
//                 padding: '2rem',
//                 borderRadius: '8px',
//                 width: '90%',
//                 maxWidth: '400px',
//                 position: 'relative'
//             }} onClick={e => e.stopPropagation()}>
//                 <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1a1a1a' }}>Login</h2>
//                 <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//                     <input
//                         type="email"
//                         placeholder="Email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
//                         autoFocus
//                     />
//                     <input
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
//                     />
//                     <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
//                         <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.8rem' }}>
//                             Login
//                         </button>
//                         <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1, padding: '0.8rem' }}>
//                             Cancel
//                         </button>
//                     </div>
//                 </form>
//                 <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
//                     Don't have an account?{' '}
//                     <span
//                         style={{ color: '#d4af37', cursor: 'pointer', fontWeight: 'bold' }}
//                         onClick={() => {
//                             onClose();
//                             navigate('/signup');
//                         }}
//                     >
//                         Sign Up
//                     </span>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LoginModal;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 1️⃣ Login with Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

      if (authError) throw authError;

      const user = data.user;
      if (!user) throw new Error("Login failed");

      // 2️⃣ Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("category")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      // 3️⃣ Validate customer
      if (profile.category !== "customer") {
        await supabase.auth.signOut(); // 🔐 important
        alert("Not a customer account");
      }

      // 4️⃣ Success → redirect customer
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "400px",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Login</h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "0.8rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "0.8rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>
        </form>

        <div
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            fontSize: "0.9rem",
          }}
        >
          Don't have an account?{" "}
          <span
            style={{ color: "#d4af37", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => {
              onClose();
              navigate("/signup");
            }}
          >
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
