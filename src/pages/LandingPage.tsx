import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from '../context/AuthContext';
import LoginModal from "../components/LoginModal";
import { supabase } from "../lib/supabase";

const LandingPage = () => {
  const navigate = useNavigate();
  const scrollToInfo = () => {
    document
      .getElementById("info-section")
      .scrollIntoView({ behavior: "smooth" });
  };

  // const { isAuthenticated, login, logout } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [showLegacy, setShowLegacy] = useState(false);

  

  // Simple scroll animation hook
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById("info-section");
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(!!data.session);
    });

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const timelineData = [
    {
      title: "Consultation",
      desc: "We begin with a personal consultation to understand your style, preferences, and the occasion.",
      date: "Step 1",
    },
    {
      title: "Measurement",
      desc: "Our master tailors take over 30 precise measurements to ensure a flawless fit unique to your physique.",
      date: "Step 2",
    },
    {
      title: "Fabric Selection",
      desc: "Choose from our curated collection of premium Italian wools, Egyptian cottons, and fine silks.",
      date: "Step 3",
    },
    {
      title: "Crafting",
      desc: "Your garment is hand-cut and stitched by expert artisans, dedicating hours to every detail.",
      date: "Step 4",
    },
    {
      title: "Final Fitting",
      desc: "We ensure every inch allows for movement and comfort before the final delivery.",
      date: "Step 5",
    },
  ];

  return (
    <div className="landing-page">
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={() => setIsLoginModalOpen(false)}
      />

      {/* Navbar */}
      <nav
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          padding: "1.5rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            color: "var(--color-gold)",
            cursor: "pointer",
          }}
          onClick={() => navigate("/contributor-login")}
        >
          KM
        </div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <button
            className="btn btn-outline"
            style={{ fontSize: "0.8rem", padding: "8px 20px" }}
            onClick={() => {
              if (isAuthenticated) {
                navigate("/dashboard");
              } else {
                setIsLoginModalOpen(true);
              }
            }}
          >
            Orders Placed
          </button>
          {!isAuthenticated ? (
            <button
              className="btn btn-primary"
              style={{ fontSize: "0.8rem", padding: "8px 20px" }}
              onClick={() => setIsLoginModalOpen(true)}
            >
              Login
            </button>
          ) : (
            <button
              className="btn btn-outline"
              style={{
                fontSize: "0.8rem",
                padding: "8px 20px",
                borderColor: "var(--color-gold)",
                color: "var(--color-gold)",
              }}
              onClick={async () => {
                await supabase.auth.signOut();
              }}
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="hero"
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 2rem",
          position: "relative",
          overflow: "hidden",
          // New Sophisticated Background
          background: `
                    linear-gradient(rgba(10, 25, 47, 0.9), rgba(10, 25, 47, 0.8)),
                    repeating-linear-gradient(45deg, rgba(212, 175, 55, 0.05) 0px, rgba(212, 175, 55, 0.05) 1px, transparent 1px, transparent 10px),
                    radial-gradient(circle at 50% 50%, #172a45 0%, #0a192f 100%)
                `,
        }}
      >
        {/* Decorative Elements */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "60vw",
            height: "60vw",
            background:
              "radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 60%)",
            borderRadius: "50%",
            filter: "blur(50px)",
            zIndex: 0,
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            right: "-10%",
            width: "60vw",
            height: "60vw",
            background:
              "radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 60%)",
            borderRadius: "50%",
            filter: "blur(50px)",
            zIndex: 0,
          }}
        ></div>

        <div
          className="container slide-up"
          style={{ position: "relative", zIndex: 1 }}
        >
          <p
            style={{
              textTransform: "uppercase",
              letterSpacing: "3px",
              color: "var(--color-gold)",
              marginBottom: "1rem",
              fontSize: "0.9rem",
            }}
          >
            Reviving Classic Fashion
          </p>
          <h1
            style={{
              fontSize: "clamp(3.5rem, 6vw, 6rem)",
              marginBottom: "1.5rem",
              lineHeight: 1,
            }}
          >
            Kings<span className="text-gold">man</span>
          </h1>
          <p
            style={{
              fontSize: "1.3rem",
              color: "var(--color-text-light)",
              marginBottom: "3rem",
              maxWidth: "650px",
              margin: "0 auto 3rem",
              fontWeight: 300,
            }}
          >
            Where tradition meets modern luxury. Experience the art of the
            perfect fit, tailored exclusively for you.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button onClick={scrollToInfo} className="btn btn-outline">
              Our Process
            </button>
            <Link to="/get-started" className="btn btn-primary">
              Get Started
            </Link>
            <Link
              to="/check-with-ai"
              className="btn btn-outline"
              style={{
                borderColor: "var(--color-gold)",
                color: "var(--color-gold)",
              }}
            >
              ✨ Check with AI
            </Link>
          </div>
        </div>
      </section>

      {/* Timeline Section (Replaces Old Info Section) */}
      <section
        id="info-section"
        style={{ padding: "8rem 0", background: "var(--color-primary-light)" }}
      >
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
              The Journey to <span className="text-gold">Perfection</span>
            </h2>
            <p
              style={{
                color: "var(--color-text-light)",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              We don't just make clothes; we craft experiences. Here is how we
              bring your vision to life.
            </p>
          </div>

          <div className={`timeline ${isVisible ? "fade-in" : ""}`}>
            {timelineData.map((item, index) => (
              <div
                key={index}
                className={`timeline-item ${
                  index % 2 === 0 ? "timeline-left" : "timeline-right"
                }`}
              >
                <div className="timeline-content">
                  <span
                    style={{
                      color: "var(--color-gold)",
                      fontWeight: "bold",
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      display: "block",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {item.date}
                  </span>
                  <h3 style={{ marginBottom: "0.5rem", fontSize: "1.5rem" }}>
                    {item.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--color-text-light)",
                      fontSize: "0.95rem",
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: "4rem",
              display: "flex",
              gap: "1.5rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setShowLegacy(true)}
              className="btn btn-outline"
            >
              About our Legacy
            </button>
            <Link to="/get-started" className="btn btn-primary">
              Begin Your Journey
            </Link>
          </div>
        </div>
      </section>

      {/* Legacy Modal */}
      {showLegacy && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.8)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
          onClick={() => setShowLegacy(false)}
        >
          <div
            className="glass-panel slide-up"
            style={{ maxWidth: "600px", padding: "3rem", position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowLegacy(false)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "none",
                border: "none",
                color: "var(--color-text)",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
            <h2
              style={{
                marginBottom: "1.5rem",
                color: "var(--color-gold)",
                textAlign: "center",
              }}
            >
              Our Legacy
            </h2>
            <div
              style={{ color: "var(--color-text-light)", lineHeight: "1.8" }}
            >
              <p style={{ marginBottom: "1rem" }}>
                Established in June 2025, <strong>Kingsman</strong> began as a
                modest atelier in Kolkata, driven by a singular passion: to
                revive the lost art of true bespoke tailoring.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                We have joined forces with 10+ artisans and craftsmen to create
                a legacy of excellence. For we believe that true excellence is
                not just about the quality of the garment, but also about the
                care and attention that goes into it.
              </p>
              <p>
                Contact our Support at +91 8910887363 (10:00 AM -7:00 PM)
                Headoffice: Bhowanipore, Kolkata
              </p>
            </div>
          </div>
        </div>
      )}

      <footer
        style={{
          padding: "3rem 0",
          textAlign: "center",
          color: "var(--color-text-light)",
          fontSize: "0.9rem",
          background: "var(--color-primary)",
        }}
      >
        <div className="container">
          <h2
            style={{
              fontSize: "1.5rem",
              marginBottom: "1rem",
              cursor: "pointer",
            }}
            onClick={() => navigate("/admin-login")}
          >
            Kings<span className="text-gold">man</span>
          </h2>
          <p>
            &copy; {new Date().getFullYear()} Bespoke Tailoring. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
