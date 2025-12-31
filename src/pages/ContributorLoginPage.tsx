import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const ContributorLoginPage = () => {
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
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error on change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 1️⃣ Login with Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email: formData.email,
          password: formData.password,
        }
      );

      if (authError) throw authError;

      const user = data.user;
      if (!user) throw new Error("Login failed");

      // 2️⃣ Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_type, category")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      // 3️⃣ Validate contributor
      if (profile.category !== "contributor") {
        await supabase.auth.signOut();
        throw new Error("Not a contributor account");
      }

      // 4️⃣ Redirect based on user_type
      if (profile.user_type === "individual") {
        navigate("/contributor-dashboard");
      } else if (profile.user_type === "tailoring_house") {
        navigate("/manufacturing-dashboard");
      } else {
        throw new Error("Invalid contributor type");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
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
            Contributor Portal
          </h2>
          <p
            style={{
              color: "var(--color-text-light)",
              fontSize: "0.9rem",
              marginTop: "0.5rem",
            }}
          >
            Login to your dashboard
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {error && (
            <div
              style={{
                padding: "0.5rem",
                background: "rgba(255, 0, 0, 0.1)",
                border: "1px solid #ff4444",
                color: "#ff4444",
                borderRadius: "4px",
                fontSize: "0.9rem",
              }}
            >
              {error}
            </div>
          )}

          {/* <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-cream)' }}>User ID</label>
                        <input
                            type="text"
                            name="userId"
                            value={formData.userId}
                            onChange={handleChange}
                            required
                            className="input-field"
                            placeholder="e.g. HR001 or MH001"
                        />
                    </div> */}

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
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="********"
                style={{ width: "100%", paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  color: "var(--color-text-light)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.44 0 .87-.03 1.28-.09" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.9rem",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
                color: "var(--color-text-light)",
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember Me
            </label>
            <span
              style={{
                color: "var(--color-gold)",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() =>
                alert("Reset password link sent to your registered email.")
              }
            >
              Forgot Password?
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: "0.5rem", width: "100%" }}
          >
            Login
          </button>

          <div
            style={{
              textAlign: "center",
              marginTop: "1rem",
              fontSize: "0.9rem",
              color: "var(--color-text-light)",
            }}
          >
            Don't have an account?{" "}
            <span
              style={{
                color: "var(--color-gold)",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => navigate("/contributor-signup")}
            >
              Sign up here
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn btn-outline"
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            Back to Site
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContributorLoginPage;
