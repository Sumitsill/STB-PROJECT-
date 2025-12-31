import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";

const ContributorDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [contributorEmail, setContributorEmail] = useState<string | null>(null);
  const [assignedOrders, setAssignedOrders] = useState<any[]>([]);
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        navigate("contributor-login");
        return;
      }
      setContributorEmail(data.session.user.email ?? null);
    };

    checkAuth();
  }, [navigate]);
  useEffect(() => {
    if (!contributorEmail) return;

    const fetchAssignedOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, order_data, order_status, created_at")
        .eq("order_status", "assigned")
        .eq("contributor_email", contributorEmail)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setAssignedOrders(data || []);
    };

    fetchAssignedOrders();
  }, [contributorEmail]);

  const userName = location.state?.userName || "Contributor";
  const userId = location.state?.userId || "HR-Guest";

  const [onDuty, setOnDuty] = useState(true);
  const [serviceAreas, setServiceAreas] = useState([
    "North Station",
    "Fashion District",
    "Central Park",
  ]);
  const [activeTab, setActiveTab] = useState<
    "active" | "pending" | "completed" | "earnings"
  >("active");

  const [orders, setOrders] = useState<any[]>([]);

  // useEffect(() => {
  //   const fetchPendingOrders = async () => {
  //     const { data, error } = await supabase
  //       .from("orders")
  //       .select("id, order_data, order_status, created_at")
  //       .eq("order_status", "pending")
  //       .order("created_at", { ascending: false });

  //     if (error) {
  //       console.error("Error fetching orders:", error);
  //       return;
  //     }

  //     setOrders(data || []);
  //   };

  //   fetchPendingOrders();
  // }, []);

  useEffect(() => {
    if (!contributorEmail) return;

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, order_data, order_status, contributor_email, created_at")
        .or(
          `order_status.eq.pending, and(order_status.eq.assigned,contributor_email.eq.${contributorEmail}), and(order_status.eq.completed,contributor_email.eq.${contributorEmail})`
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        return;
      }

      setOrders(data || []);
    };

    fetchOrders();
  }, [contributorEmail]);

  // Mock Earnings Data
  const earningsData = [
    {
      id: "PAY-001",
      orderId: "ORD-2023-998",
      amount: "$120.00",
      status: "Paid",
      date: "2024-12-28",
      description: "Delivery Fee",
    },
    {
      id: "PAY-002",
      orderId: "ORD-2023-999",
      amount: "$45.50",
      status: "Processing",
      date: "2025-01-02",
      description: "Travel Reimbursement",
    },
    {
      id: "PAY-003",
      orderId: "ORD-2024-005",
      amount: "$300.00",
      status: "Due",
      date: "2025-01-05",
      description: "Special Handling",
    },
  ];

  const displayedOrders = orders.filter((order) => {
    if (activeTab === "active") {
      return order.order_status === "pending";
    }

    if (activeTab === "pending") {
      return (
        order.order_status === "assigned" &&
        order.contributor_email === contributorEmail
      );
    }

    if (activeTab === "completed") {
      return (
        order.order_status === "completed" &&
        order.contributor_email === contributorEmail
      );
    }

    return false;
  });

  const handleAddArea = () => {
    const newArea = window.prompt("Enter the name of the new area to serve:");
    if (newArea && newArea.trim() !== "") {
      setServiceAreas([...serviceAreas, newArea.trim()]);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleGrabOrder = async (orderId: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert("Not authenticated");
      return;
    }

    const contributorEmail = session.user.email;

    const { error } = await supabase
      .from("orders")
      .update({
        order_status: "assigned",
        contributor_email: contributorEmail,
      })
      .eq("id", orderId)
      .eq("order_status", "pending"); // safety check

    if (error) {
      console.error("Grab failed:", error);
      alert("Failed to grab order");
      return;
    }

    // Remove grabbed order from active list
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const handleMarkComplete = async (orderId: string) => {
    if (!contributorEmail) return;

    const { error } = await supabase
      .from("orders")
      .update({ order_status: "completed" })
      .eq("id", orderId)
      .eq("contributor_email", contributorEmail); // safety

    if (error) {
      alert("Failed to complete order");
      return;
    }

    // Remove from pending UI instantly
    setAssignedOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--gradient-bg)",
        color: "var(--color-text)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "1.5rem 2rem",
          background: "rgba(10, 25, 47, 0.9)",
          backdropFilter: "blur(10px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--color-primary-light)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "var(--color-gold)",
            }}
          >
            KM Logistics
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "0.5rem",
              }}
            >
              <div style={{ color: "var(--color-cream)", fontWeight: "bold" }}>
                {userName}
              </div>
              <div
                style={{
                  background: "rgba(255, 215, 0, 0.2)",
                  color: "#ffd700",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                }}
              >
                ⭐ 4.9/5
              </div>
            </div>
            <div
              style={{ fontSize: "0.8rem", color: "var(--color-text-light)" }}
            >
              ID: {userId}
            </div>
          </div>
          <button
            className="btn btn-outline"
            style={{ fontSize: "0.8rem", padding: "8px 16px" }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="container" style={{ padding: "3rem 2rem" }}>
        {/* Status & Service Areas Panel */}
        <div
          className="glass-panel"
          style={{
            padding: "2rem",
            marginBottom: "2rem",
            display: "flex",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          {/* Duty Status */}
          <div
            style={{
              flex: 1,
              minWidth: "250px",
              borderRight: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <h2
              style={{
                color: "var(--color-cream)",
                marginBottom: "1rem",
                fontSize: "1.2rem",
              }}
            >
              Duty Status
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                onClick={() => setOnDuty(!onDuty)}
                style={{
                  width: "60px",
                  height: "30px",
                  background: onDuty ? "#81c784" : "#ff4444",
                  borderRadius: "15px",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background 0.3s",
                }}
              >
                <div
                  style={{
                    width: "26px",
                    height: "26px",
                    background: "white",
                    borderRadius: "50%",
                    position: "absolute",
                    top: "2px",
                    left: onDuty ? "32px" : "2px",
                    transition: "left 0.3s",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  color: onDuty ? "#81c784" : "#ff4444",
                }}
              >
                {onDuty ? "ON FIELD" : "OFF FIELD"}
              </span>
            </div>
            <p
              style={{
                marginTop: "1rem",
                fontSize: "0.9rem",
                color: "var(--color-text-light)",
              }}
            >
              {onDuty
                ? "You are visible for new assignments."
                : "You are currently offline. No new orders will be assigned."}
            </p>
          </div>

          {/* Service Areas */}
          <div style={{ flex: 2, minWidth: "300px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h2 style={{ color: "var(--color-cream)", fontSize: "1.2rem" }}>
                Service Areas
              </h2>
              <button
                onClick={handleAddArea}
                className="btn btn-outline"
                style={{ fontSize: "0.8rem", padding: "4px 12px" }}
              >
                + Add Area
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem" }}>
              {serviceAreas.map((area, index) => (
                <span
                  key={index}
                  style={{
                    background: "rgba(255, 215, 0, 0.1)",
                    color: "var(--color-gold)",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "0.9rem",
                    border: "1px solid rgba(255, 215, 0, 0.2)",
                  }}
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "2rem",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              paddingBottom: "1rem",
            }}
          >
            <button
              onClick={() => setActiveTab("active")}
              style={{
                background: "transparent",
                border: "none",
                color:
                  activeTab === "active"
                    ? "var(--color-gold)"
                    : "var(--color-text-light)",
                fontWeight: activeTab === "active" ? "bold" : "normal",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Active Assignments
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              style={{
                background: "transparent",
                border: "none",
                color:
                  activeTab === "pending"
                    ? "var(--color-gold)"
                    : "var(--color-text-light)",
                fontWeight: activeTab === "pending" ? "bold" : "normal",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              style={{
                background: "transparent",
                border: "none",
                color:
                  activeTab === "completed"
                    ? "var(--color-gold)"
                    : "var(--color-text-light)",
                fontWeight: activeTab === "completed" ? "bold" : "normal",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveTab("earnings")}
              style={{
                background: "transparent",
                border: "none",
                color:
                  activeTab === "earnings"
                    ? "var(--color-gold)"
                    : "var(--color-text-light)",
                fontWeight: activeTab === "earnings" ? "bold" : "normal",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Earnings
            </button>
          </div>

          <div style={{ display: "grid", gap: "1rem" }}>
            {activeTab === "earnings" ? (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  color: "var(--color-text)",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      textAlign: "left",
                    }}
                  >
                    <th style={{ padding: "1rem", color: "var(--color-gold)" }}>
                      Payment ID
                    </th>
                    <th style={{ padding: "1rem", color: "var(--color-gold)" }}>
                      Order ID
                    </th>
                    <th style={{ padding: "1rem", color: "var(--color-gold)" }}>
                      Description
                    </th>
                    <th style={{ padding: "1rem", color: "var(--color-gold)" }}>
                      Date
                    </th>
                    <th style={{ padding: "1rem", color: "var(--color-gold)" }}>
                      Amount
                    </th>
                    <th style={{ padding: "1rem", color: "var(--color-gold)" }}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {earningsData.map((earn) => (
                    <tr
                      key={earn.id}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <td
                        style={{
                          padding: "1rem",
                          fontSize: "0.9rem",
                          color: "var(--color-text-light)",
                        }}
                      >
                        {earn.id}
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          fontSize: "0.9rem",
                          fontFamily: "monospace",
                        }}
                      >
                        {earn.orderId}
                      </td>
                      <td style={{ padding: "1rem" }}>{earn.description}</td>
                      <td style={{ padding: "1rem" }}>{earn.date}</td>
                      <td style={{ padding: "1rem", fontWeight: "bold" }}>
                        {earn.amount}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <span
                          style={{
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "0.85rem",
                            background:
                              earn.status === "Paid"
                                ? "rgba(76, 175, 80, 0.2)"
                                : earn.status === "Processing"
                                ? "rgba(33, 150, 243, 0.2)"
                                : "rgba(255, 87, 34, 0.2)",
                            color:
                              earn.status === "Paid"
                                ? "#81c784"
                                : earn.status === "Processing"
                                ? "#64b5f6"
                                : "#ff8a65",
                          }}
                        >
                          {earn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : displayedOrders.length > 0 ? (
              displayedOrders.map((order) => {
                const data = order.order_data;

                return (
                  <div
                    key={order.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1.5rem",
                      background: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: "1.1rem",
                          color: "var(--color-cream)",
                          marginBottom: "0.3rem",
                        }}
                      >
                        {data.garment} • {data.fabric}
                      </h3>

                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                          fontSize: "0.9rem",
                          color: "var(--color-text-light)",
                        }}
                      >
                        <span>Service: {data.service}</span>
                        <span style={{ color: "var(--color-gold)" }}>
                          📍 {data.location}
                        </span>
                      </div>

                      <div style={{ fontSize: "0.8rem", marginTop: "0.3rem" }}>
                        Delivery: {data.delivery}
                      </div>
                    </div>

                    {/* GRAB BUTTON */}
                    {activeTab === "active" && (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleGrabOrder(order.id)}
                      >
                        Grab
                      </button>
                    )}

                    {activeTab === "pending" && (
                      <button
                        className="btn btn-success"
                        onClick={() => handleMarkComplete(order.id)}
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <p
                style={{
                  color: "var(--color-text-light)",
                  padding: "1rem",
                  textAlign: "center",
                }}
              >
                No assignments in this category.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributorDashboardPage;
