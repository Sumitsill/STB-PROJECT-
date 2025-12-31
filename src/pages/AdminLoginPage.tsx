import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const AdminLoginPage = () => {
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

  const [formData, setFormData] = useState({
    adminId: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock validation
    if (formData.adminId === "admin" && formData.password === "admin") {
      alert("Admin Login Successful");
      navigate("/admin-dashboard");
    } else {
      alert("Invalid Credentials");
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
        style={{
          padding: "3rem",
          width: "100%",
          maxWidth: "400px",
          border: "1px solid var(--color-gold)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "1.5rem",
              color: "var(--color-gold)",
              marginBottom: "1rem",
            }}
          >
            KM
          </div>
          <h2
            style={{
              color: "var(--color-cream)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Admin Portal
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "var(--color-cream)",
              }}
            >
              Admin ID
            </label>
            <input
              type="text"
              name="adminId"
              value={formData.adminId}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Enter Admin ID"
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "var(--color-cream)",
              }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: "1rem", width: "100%" }}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn btn-outline"
            style={{ width: "100%" }}
          >
            Back to Site
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
