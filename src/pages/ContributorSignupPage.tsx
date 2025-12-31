import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const ContributorSignupPage = () => {
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
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    type: "",
    gender: "",
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
      // 1️⃣ Supabase Auth signup
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          },
        },
      });

      if (error) throw error;

      const user = data.user;
      if (!user) throw new Error("User not created");

      // 2️⃣ Insert into profiles with category = contributor
      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id, // 🔗 auth.users.id
        email: user.email,
        category: "contributor",
        user_type: formData.type,
        gender: formData.gender, // 👈 IMPORTANT
      });

      if (profileError) throw profileError;

      // 3️⃣ Success
      alert(
        "Contributor account created successfully! Please verify your email before login."
      );
      navigate("/contributor-login");
    } catch (err: any) {
      alert(err.message || "Signup failed");
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
              color: "var(--color-gold)",
              fontFamily: "var(--font-heading)",
              fontSize: "2rem",
            }}
          >
            Contributor Signup
          </h2>
          <p style={{ color: "var(--color-text-light)", marginTop: "0.5rem" }}>
            Join our community of artisans
          </p>
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
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Full Name"
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
              Gender
            </label>

            <select
              name="gender"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              required
              className="input-field"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "var(--color-cream)",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="email@example.com"
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
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "var(--color-cream)",
              }}
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="********"
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
              Type
            </label>

            <select
              name="type"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              required
              className="input-field"
            >
              <option value="">Select Type</option>
              <option value="individual">Individual</option>
              <option value="tailoring_house">Tailoring House</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: "1rem", width: "100%" }}
          >
            Sign Up
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "2rem",
            color: "var(--color-text-light)",
          }}
        >
          Already have an account?{" "}
          <span
            style={{
              color: "var(--color-gold)",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => navigate("/contributor-login")}
          >
            Login
          </span>
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="btn btn-outline"
          style={{ width: "100%", marginTop: "1rem" }}
        >
          Back to Site
        </button>
      </div>
    </div>
  );
};

export default ContributorSignupPage;
