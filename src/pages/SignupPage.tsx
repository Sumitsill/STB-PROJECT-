// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// // import { useAuth } from '../context/AuthContext';
// import { supabase } from '../lib/supabase';
// const SignupPage = () => {
//     const navigate = useNavigate();
//     const { login } = useAuth();
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         password: '',
//         confirmPassword: ''
//     });

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (formData.password !== formData.confirmPassword) {
//             alert("Passwords do not match!");
//             return;
//         }
//         // Simulate signup success
//         login(); // Auto login
//         navigate('/');
//         // Optionally show a welcome message here or on the home page
//     };

//     return (
//         <div style={{
//             minHeight: '100vh',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             background: 'var(--gradient-bg)',
//             fontFamily: 'var(--font-body)',
//             padding: '2rem'
//         }}>
//             <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '500px' }}>
//                 <h2 style={{
//                     textAlign: 'center',
//                     marginBottom: '2rem',
//                     color: 'var(--color-gold)',
//                     fontFamily: 'var(--font-heading)',
//                     fontSize: '2rem'
//                 }}>Create Account</h2>

//                 <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
//                     <div>
//                         <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-cream)' }}>Full Name</label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             required
//                             className="input-field"
//                             placeholder="John Doe"
//                         />
//                     </div>
//                     <div>
//                         <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-cream)' }}>Email Address</label>
//                         <input
//                             type="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             required
//                             className="input-field"
//                             placeholder="john@example.com"
//                         />
//                     </div>
//                     <div>
//                         <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-cream)' }}>Password</label>
//                         <input
//                             type="password"
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             required
//                             className="input-field"
//                             placeholder="********"
//                         />
//                     </div>
//                     <div>
//                         <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-cream)' }}>Confirm Password</label>
//                         <input
//                             type="password"
//                             name="confirmPassword"
//                             value={formData.confirmPassword}
//                             onChange={handleChange}
//                             required
//                             className="input-field"
//                             placeholder="********"
//                         />
//                     </div>

//                     <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
//                         Sign Up
//                     </button>
//                 </form>

//                 <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--color-text-light)' }}>
//                     Already have an account? {' '}
//                     <span
//                         style={{ color: 'var(--color-gold)', cursor: 'pointer', textDecoration: 'underline' }}
//                         onClick={() => navigate('/')} // In a real app this might open login modal or go to login page
//                     >
//                         Return Home
//                     </span>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default SignupPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const SignupPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        navigate("/");
      }
    };

    checkSession();
  }, [navigate]);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Sign up user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name, // optional (auth metadata)
          },
        },
      });

      if (error) throw error;

      const user = data.user;
      if (!user) throw new Error("User not created");

      // 2️⃣ Insert profile with category = customer
      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email,
        category: "customer",
      });

      if (profileError) throw profileError;

      // 3️⃣ Redirect after success
      alert("Please click on the link sent to your email for verification!");
    } catch (err: any) {
      alert(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--gradient-bg)",
        fontFamily: "var(--font-body)",
        padding: "2rem",
      }}
    >
      <div
        className="glass-panel"
        style={{ padding: "3rem", width: "100%", maxWidth: "500px" }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            color: "var(--color-gold)",
            fontFamily: "var(--font-heading)",
            fontSize: "2rem",
          }}
        >
          Create Account
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input-field"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-field"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="input-field"
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="input-field"
          />

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          Already have an account?{" "}
          <span
            style={{ color: "var(--color-gold)", cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
