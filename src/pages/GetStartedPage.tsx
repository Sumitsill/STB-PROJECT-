import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginModal from "../components/LoginModal";
import { supabase } from "../lib/supabase";

const GetStartedPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    location: "",
    service: "",
    garment: "",
    fabric: "",
    colors: {},
    delivery: "",
    design: "",
    file: null,
  });

  const totalSteps = 10;

  const garmentOptions = {
    Male: ["Suit", "Shirt", "Trousers", "Sherwani", "Kurta Pajama"],
    Female: ["Lehenga", "Blouse", "Salwar Kameez", "Gown", "Saree"],
    Other: ["Suit", "Shirt", "Kurta", "Gown", "Trousers"],
  };

  const garmentParts = {
    // Male
    Suit: ["Jacket", "Trousers", "Waistcoat"],
    Shirt: ["Main Color", "Collar & Cuffs"],
    Trousers: ["Main Color"],
    Sherwani: ["Sherwani", "Churidar/Bottom", "Stole"],
    "Kurta Pajama": ["Kurta", "Pajama"],
    // Female
    Lehenga: ["Lehenga (Skirt)", "Blouse", "Dupatta"],
    Blouse: ["Main Color"],
    "Salwar Kameez": ["Kameez (Top)", "Salwar (Bottom)", "Dupatta"],
    Gown: ["Main Color"],
    Saree: ["Saree", "Blouse"],
    // Common
    Kurta: ["Kurta", "Bottom"],
    default: ["Main Color"],
  };

  const fabricOptions = {
    // Male
    Suit: ["Italian Wool", "Linen", "Terry Rayon", "Velvet"],
    Shirt: ["Egyptian Cotton", "Linen", "Satin", "Oxford"],
    Trousers: ["Cotton", "Wool", "Linen", "Corduroy"],
    Sherwani: ["Silk", "Brocade", "Velvet", "Jacquard"],
    "Kurta Pajama": ["Cotton", "Silk", "Linen", "Khadi"],
    // Female
    Lehenga: ["Silk", "Net", "Georgette", "Velvet"],
    Blouse: ["Silk", "Cotton", "Brocade", "Net"],
    "Salwar Kameez": ["Cotton", "Silk", "Chiffon", "Georgette"],
    Gown: ["Satin", "Net", "Sequin", "Velvet"],
    Saree: ["Silk", "Chiffon", "Georgette", "Cotton"],
    // Common
    Kurta: ["Cotton", "Silk", "Linen", "Khadi"],
  };

  const { isAuthenticated } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate("/");
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleColorChange = (part, value) => {
    setFormData((prev) => ({
      ...prev,
      colors: { ...prev.colors, [part]: value },
    }));
  };

  const placeOrder = async () => {
    // 1️⃣ Check session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setIsLoginModalOpen(true);
      return;
    }

    const user = session.user;

    // 2️⃣ Insert order
    const { error } = await supabase.from("orders").insert({
      user_id: user.id, // 🔗 auth.users.id
      email: user.email, // 📧 logged-in email
      order_data: {
        ...formData,
        file: formData.file ? formData.file.name : null,
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    // 3️⃣ Success dialog (reuse your existing UI)
    const dialog = document.createElement("div");
    dialog.className = "glass-panel fade-in";
    dialog.style.position = "fixed";
    dialog.style.top = "50%";
    dialog.style.left = "50%";
    dialog.style.transform = "translate(-50%, -50%)";
    dialog.style.padding = "3rem";
    dialog.style.zIndex = "1000";
    dialog.style.textAlign = "center";
    dialog.style.background = "rgba(10, 25, 47, 0.98)";
    dialog.style.border = "1px solid var(--color-gold)";
    dialog.style.width = "90%";
    dialog.style.maxWidth = "500px";

    dialog.innerHTML = `
    <div style="font-size: 3rem; margin-bottom: 1rem;">✨</div>
    <h2 style="color: var(--color-gold); margin-bottom: 1.5rem;">Thank You!</h2>
    <p style="margin-bottom: 2rem;">
      Your order request has been received.
    </p>
    <button id="close-thank-you"
      style="padding: 12px 32px; background: var(--color-gold); border: none; cursor: pointer;">
      Return Home
    </button>
  `;

    document.body.appendChild(dialog);

    document.getElementById("close-thank-you")!.onclick = () => {
      document.body.removeChild(dialog);
      navigate("/");
    };
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="wizard-step fade-in">
            <h2 style={{ marginBottom: "2rem", textAlign: "center" }}>
              What is your age?
            </h2>
            <div className="input-group">
              <input
                type="number"
                className="input-field"
                placeholder="Enter your age"
                value={formData.age}
                onChange={(e) => handleChange("age", e.target.value)}
                autoFocus
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="wizard-step fade-in">
            <h2 style={{ marginBottom: "2rem", textAlign: "center" }}>
              Gender
            </h2>
            <div className="selection-grid">
              {["Male", "Female", "Other"].map((opt) => (
                <div
                  key={opt}
                  className={`selection-card ${
                    formData.gender === opt ? "selected" : ""
                  }`}
                  onClick={() => {
                    handleChange("gender", opt);
                    handleChange("garment", "");
                    handleChange("fabric", "");
                    handleChange("colors", {});
                  }}
                >
                  <h3>{opt}</h3>
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="wizard-step fade-in">
            <h2 style={{ marginBottom: "2rem", textAlign: "center" }}>
              Where are you located?
            </h2>
            <div className="input-group">
              <input
                type="text"
                className="input-field"
                placeholder="City/Region"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                autoFocus
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ fontSize: "0.9rem", padding: "8px 16px" }}
                onClick={() => {
                  if (navigator.geolocation) {
                    const btn = document.activeElement;
                    const originalText = btn.innerText;
                    btn.innerText = "Locating...";

                    navigator.geolocation.getCurrentPosition(
                      async (position) => {
                        try {
                          const { latitude, longitude } = position.coords;
                          const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                          );
                          const data = await response.json();
                          const address =
                            data.address.city ||
                            data.address.town ||
                            data.address.village ||
                            data.display_name.split(",")[0];
                          handleChange("location", `${address} (Verified)`);
                          btn.innerText = "Location Verified ✓";
                          setTimeout(
                            () => (btn.innerText = originalText),
                            3000
                          );
                        } catch (error) {
                          console.error("Geocoding failed", error);
                          handleChange(
                            "location",
                            `${position.coords.latitude.toFixed(
                              4
                            )}, ${position.coords.longitude.toFixed(4)}`
                          );
                          btn.innerText = originalText;
                        }
                      },
                      (error) => {
                        alert("Unable to retrieve your location");
                        btn.innerText = originalText;
                      }
                    );
                  } else {
                    alert("Geolocation is not supported by your browser");
                  }
                }}
              >
                📍 Use Current Location
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="wizard-step fade-in">
            <h2 style={{ marginBottom: "2rem", textAlign: "center" }}>
              Service you want?
            </h2>
            <div className="selection-grid">
              {["Stitching", "Alteration", "Styling", "Bulk Order"].map(
                (opt) => (
                  <div
                    key={opt}
                    className={`selection-card ${
                      formData.service === opt ? "selected" : ""
                    }`}
                    onClick={() => handleChange("service", opt)}
                  >
                    <h3>{opt}</h3>
                  </div>
                )
              )}
            </div>
          </div>
        );
      case 5:
        const currentGarments =
          garmentOptions[formData.gender] || garmentOptions["Other"];
        return (
          <div className="wizard-step fade-in">
            <h2 style={{ marginBottom: "2rem", textAlign: "center" }}>
              Garment Required
            </h2>
            <div className="selection-grid">
              {currentGarments.map((opt) => (
                <div
                  key={opt}
                  className={`selection-card ${
                    formData.garment === opt ? "selected" : ""
                  }`}
                  onClick={() => {
                    handleChange("garment", opt);
                    handleChange("fabric", "");
                    handleChange("colors", {});
                  }}
                >
                  <h3>{opt}</h3>
                </div>
              ))}
            </div>
          </div>
        );
      case 6:
        const currentFabrics = fabricOptions[formData.garment] || [];
        return (
          <div className="wizard-step fade-in">
            <h2 style={{ marginBottom: "2rem", textAlign: "center" }}>
              Fabric Preference
            </h2>
            <div
              className="input-group"
              style={{ maxWidth: "400px", margin: "0 auto" }}
            >
              <select
                className="input-field"
                value={formData.fabric}
                onChange={(e) => handleChange("fabric", e.target.value)}
                style={{ cursor: "pointer" }}
              >
                <option value="" disabled>
                  Select a fabric
                </option>
                {currentFabrics.map((opt) => (
                  <option key={opt} value={opt} style={{ color: "black" }}>
                    {opt}
                  </option>
                ))}
                <option
                  value="Not Sure"
                  style={{ color: "black", fontWeight: "bold" }}
                >
                  Not Sure / Consultant's Choice
                </option>
              </select>
            </div>
          </div>
        );
      case 7:
        const parts = garmentParts[formData.garment] ||
          garmentParts["default"] || ["Main Color"];
        return (
          <div className="wizard-step fade-in">
            <h2 style={{ marginBottom: "2rem", textAlign: "center" }}>
              Color Selection
            </h2>
            <p
              style={{
                textAlign: "center",
                marginBottom: "2rem",
                color: "var(--color-text-light)",
              }}
            >
              Choose preferred colors for each part of your {formData.garment}
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                maxWidth: "500px",
                margin: "0 auto",
              }}
            >
              {parts.map((part) => (
                <div
                  key={part}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "rgba(255,255,255,0.03)",
                    padding: "1rem",
                    borderRadius: "8px",
                  }}
                >
                  <label
                    style={{ fontSize: "1.1rem", color: "var(--color-gold)" }}
                  >
                    {part}
                  </label>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Navy Blue"
                      value={formData.colors ? formData.colors[part] || "" : ""}
                      onChange={(e) => handleColorChange(part, e.target.value)}
                      style={{ width: "150px", padding: "0.5rem" }}
                    />
                    <input
                      type="color"
                      value={
                        formData.colors &&
                        formData.colors[part] &&
                        formData.colors[part].includes("#")
                          ? formData.colors[part]
                          : "#000000"
                      }
                      onChange={(e) => handleColorChange(part, e.target.value)}
                      style={{
                        width: "40px",
                        height: "40px",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 8:
        return (
          <div className="wizard-step fade-in">
            <h2 style={{ marginBottom: "2rem", textAlign: "center" }}>
              Delivery Period
            </h2>
            <div className="selection-grid">
              {[
                "Standard (7-10 Days)",
                "Express (3-5 Days)",
                "Urgent (24-48 Hrs)",
              ].map((opt) => (
                <div
                  key={opt}
                  className={`selection-card ${
                    formData.delivery === opt ? "selected" : ""
                  }`}
                  onClick={() => handleChange("delivery", opt)}
                >
                  <h3>{opt}</h3>
                </div>
              ))}
            </div>
          </div>
        );
      case 9:
        return (
          <div className="wizard-step fade-in">
            <h2 style={{ marginBottom: "2rem", textAlign: "center" }}>
              Design Preference
            </h2>
            <div className="selection-grid">
              {[
                { label: "Personal Design", desc: "I have my own design" },
                { label: "Pre-fed Design", desc: "Choose from catalogue" },
              ].map((opt) => (
                <div
                  key={opt.label}
                  className={`selection-card ${
                    formData.design === opt.label ? "selected" : ""
                  }`}
                  onClick={() => handleChange("design", opt.label)}
                >
                  <h3>{opt.label}</h3>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      opacity: 0.7,
                      marginTop: "0.5rem",
                    }}
                  >
                    {opt.desc}
                  </p>
                </div>
              ))}
            </div>
            {formData.design === "Personal Design" && (
              <div
                className="fade-in"
                style={{ marginTop: "2rem", textAlign: "center" }}
              >
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  id="file-upload"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleChange("file", file);
                      // Show success dialog
                      const dialog = document.createElement("div");
                      dialog.className = "glass-panel fade-in";
                      dialog.style.position = "fixed";
                      dialog.style.top = "50%";
                      dialog.style.left = "50%";
                      dialog.style.transform = "translate(-50%, -50%)";
                      dialog.style.padding = "2rem";
                      dialog.style.zIndex = "1000";
                      dialog.style.textAlign = "center";
                      dialog.style.background = "rgba(10, 25, 47, 0.95)";
                      dialog.style.border = "1px solid var(--color-gold)";
                      dialog.innerHTML = `
                                                <h3 style="color: var(--color-gold); margin-bottom: 1rem;">Upload Successful!</h3>
                                                <p style="margin-bottom: 1.5rem; color: var(--color-text);">${file.name} has been attached.</p>
                                                <button id="close-dialog" style="padding: 8px 24px; background: var(--color-primary); color: var(--color-gold); border: 1px solid var(--color-gold); cursor: pointer; border-radius: 4px;">OK</button>
                                            `;
                      document.body.appendChild(dialog);
                      document.getElementById("close-dialog").onclick = () =>
                        document.body.removeChild(dialog);
                    }
                  }}
                />
                <label
                  htmlFor="file-upload"
                  className="btn btn-outline"
                  style={{
                    cursor: "pointer",
                    display: "inline-block",
                    marginTop: "1rem",
                  }}
                >
                  {formData.file
                    ? `Change File (${formData.file.name})`
                    : "📂 Upload Design (Image/PDF)"}
                </label>
              </div>
            )}
          </div>
        );
      case 10:
        return (
          <div className="wizard-step fade-in">
            <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
              Review your request
            </h2>

            {/* Receipt Container */}
            <div
              style={{
                background: "#f6f6e9",
                color: "#0a192f",
                padding: "2rem",
                borderRadius: "4px",
                position: "relative",
                fontFamily: "Courier New, monospace",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                marginBottom: "2rem",
                maxHeight: "500px",
                overflowY: "auto",
              }}
            >
              {/* Receipt Header */}
              <div
                style={{
                  borderBottom: "2px dashed #0a192f",
                  paddingBottom: "1rem",
                  marginBottom: "1rem",
                  textAlign: "center",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.5rem",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    marginBottom: "0.5rem",
                    color: "#0a192f",
                  }}
                >
                  Kingsman
                </h3>
                <p style={{ fontSize: "0.8rem", textTransform: "uppercase" }}>
                  Bespoke Tailoring Request
                </p>
                <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  Date: {new Date().toLocaleDateString()}
                </p>
              </div>

              {/* Customer Details */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h4
                  style={{
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "0.2rem",
                    marginBottom: "0.5rem",
                    color: "#0a192f",
                  }}
                >
                  Customer Info
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem",
                    fontSize: "0.9rem",
                  }}
                >
                  <div>
                    <strong>Age:</strong> {formData.age}
                  </div>
                  <div>
                    <strong>Gender:</strong> {formData.gender}
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <strong>Location:</strong> {formData.location}
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h4
                  style={{
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "0.2rem",
                    marginBottom: "0.5rem",
                    color: "#0a192f",
                  }}
                >
                  Order Details
                </h4>
                <table
                  style={{
                    width: "100%",
                    fontSize: "0.9rem",
                    borderCollapse: "collapse",
                  }}
                >
                  <tbody>
                    <tr>
                      <td style={{ padding: "4px 0", color: "#0a192f" }}>
                        Service Type
                      </td>
                      <td style={{ textAlign: "right", fontWeight: "bold" }}>
                        {formData.service}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "4px 0", color: "#0a192f" }}>
                        Garment
                      </td>
                      <td style={{ textAlign: "right", fontWeight: "bold" }}>
                        {formData.garment}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "4px 0", color: "#0a192f" }}>
                        Fabric
                      </td>
                      <td style={{ textAlign: "right", fontWeight: "bold" }}>
                        {formData.fabric}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "4px 0", color: "#0a192f" }}>
                        Delivery
                      </td>
                      <td style={{ textAlign: "right", fontWeight: "bold" }}>
                        {formData.delivery}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "4px 0", color: "#0a192f" }}>
                        Design Mode
                      </td>
                      <td style={{ textAlign: "right", fontWeight: "bold" }}>
                        {formData.design}
                      </td>
                    </tr>
                    {formData.file && (
                      <tr>
                        <td style={{ padding: "4px 0", color: "#0a192f" }}>
                          Attached File
                        </td>
                        <td style={{ textAlign: "right", fontWeight: "bold" }}>
                          {formData.file.name}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Colors Section */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h4
                  style={{
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "0.2rem",
                    marginBottom: "0.5rem",
                    color: "#0a192f",
                  }}
                >
                  Color Specifications
                </h4>
                {formData.colors && Object.keys(formData.colors).length > 0 ? (
                  <ul
                    style={{
                      listStyle: "none",
                      fontSize: "0.9rem",
                      padding: 0,
                    }}
                  >
                    {Object.entries(formData.colors).map(([part, color]) => (
                      <li
                        key={part}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "4px",
                        }}
                      >
                        <span>- {part}</span>
                        <span style={{ fontWeight: "bold" }}>{color}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: "0.9rem", fontStyle: "italic" }}>
                    No specific colors selected
                  </p>
                )}
              </div>

              {/* Total Footer */}
              <div
                style={{
                  borderTop: "2px dashed #0a192f",
                  paddingTop: "1rem",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "#0a192f",
                  }}
                >
                  Estimated Total: TBD
                </p>
                <p
                  style={{
                    fontSize: "0.7rem",
                    marginTop: "0.5rem",
                    opacity: 0.8,
                  }}
                >
                  *Final pricing provided after consultation
                </p>
              </div>
            </div>

            <p
              style={{
                textAlign: "center",
                fontSize: "0.9rem",
                color: "var(--color-text-light)",
                marginBottom: "1rem",
              }}
            >
              Please review the receipt above before placing your order.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="wizard-container">
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={() => {}}
      />
      <div className="glass-panel wizard-card" style={{ padding: "3rem" }}>
        {/* Progress Dots */}
        <div className="wizard-progress">
          {[...Array(totalSteps)].map((_, i) => (
            <div
              key={i}
              className={`progress-dot ${i + 1 <= step ? "active" : ""}`}
            ></div>
          ))}
        </div>

        {/* Dynamic Step Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {renderStep()}
        </div>

        {/* Controls */}
        <div className="wizard-controls">
          <button
            onClick={handleBack}
            className="btn btn-outline"
            style={{ padding: "10px 24px" }}
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>

          {step < totalSteps ? (
            <button
              onClick={handleNext}
              className="btn btn-primary"
              style={{ padding: "10px 24px" }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={placeOrder}
              className="btn btn-primary"
              style={{ padding: "10px 24px" }}
            >
              Place Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetStartedPage;
