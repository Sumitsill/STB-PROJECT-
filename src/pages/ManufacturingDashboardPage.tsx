import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";

const ManufacturingDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        navigate("contributor-login");
      }
    };

    checkAuth();
  }, [navigate]);
  const userName = location.state?.userName || "Manufacturing Unit";
  const userId = location.state?.userId || "MH-Guest";

  const [acceptingOrders, setAcceptingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "active" | "pending" | "completed" | "earnings"
  >("active");

  // Mock Data Initial State
  const [orders, setOrders] = useState([
    {
      id: "MFG-092",
      item: "Italian Wool Suit (Batch A)",
      quantity: 50,
      status: "Cutting",
      deadline: "2025-01-10",
      type: "active",
    },
    {
      id: "MFG-093",
      item: "Silk Shirts (Batch B)",
      quantity: 120,
      status: "Stitching",
      deadline: "2025-01-15",
      type: "active",
    },
    {
      id: "MFG-095",
      item: "Velvet Jackets",
      quantity: 30,
      status: "Quality Check",
      deadline: "2025-01-05",
      type: "active",
    },
    {
      id: "MFG-101",
      item: "Linen Trousers",
      quantity: 200,
      status: "Material Sourcing",
      deadline: "2025-01-25",
      type: "pending",
    },
    {
      id: "MFG-102",
      item: "Cotton Vests",
      quantity: 500,
      status: "Queue",
      deadline: "2025-02-01",
      type: "pending",
    },
    {
      id: "MFG-050",
      item: "Winter Overcoats",
      quantity: 80,
      status: "Delivered",
      deadline: "2024-12-15",
      type: "completed",
    },
    {
      id: "MFG-051",
      item: "Wedding Sherwanis",
      quantity: 15,
      status: "Delivered",
      deadline: "2024-12-20",
      type: "completed",
    },
  ]);

  // Add mock earnings data
  const earningsData = [
    { id: "MFG-050", amount: "$4,000", status: "Paid", date: "2024-12-15" },
    { id: "MFG-051", amount: "$750", status: "Paid", date: "2024-12-20" },
    {
      id: "MFG-092",
      amount: "$2,500",
      status: "Processing",
      date: "2025-01-10",
    },
    { id: "MFG-093", amount: "$6,000", status: "Due", date: "2025-01-15" },
  ];

  const displayedOrders = orders.filter((order) => order.type === activeTab);
  const activeOrderCount = orders.filter((o) => o.type === "active").length;
  const CAPACITY_LIMIT = 5;

  // State for tracking which order is being edited
  const [editingId, setEditingId] = useState<string | null>(null);

  // Status Options
  const statusOptions = [
    "Queue",
    "Material Sourcing",
    "Cutting",
    "Stitching",
    "Quality Check",
    "Packaging",
    "Delivered",
  ];

  const handleToggle = () => {
    if (!acceptingOrders && activeOrderCount >= CAPACITY_LIMIT) {
      if (
        !window.confirm(
          "Warning: You are reaching full capacity. Are you sure you want to take more orders?"
        )
      ) {
        return;
      }
    }
    setAcceptingOrders(!acceptingOrders);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          // If status becomes Delivered, move to completed
          if (newStatus === "Delivered") {
            return { ...order, status: newStatus, type: "completed" };
          }
          // If currently pending and status changes to active type status (e.g. Cutting), move to active
          // For simplicity, let's say anything not Queue/Material Sourcing is active,
          // but here user just asked to update info. We'll keep type logic simple.
          // If it was pending and user starts work (e.g. Cutting), move to active?
          // Let's stick to: Delivered -> Completed. Others stays in their tab or move based on logic?
          // For this request: "only update once order is completed no changes" implies we just lock 'completed'.
          return { ...order, status: newStatus };
        }
        return order;
      })
    );
    setEditingId(null); // Exit editing mode after update
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
            KM Manufacturing
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
                ⭐ 4.8/5
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
        {/* Capacity Control Section */}
        <div
          className="glass-panel"
          style={{
            padding: "2rem",
            marginBottom: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "rgba(212, 175, 55, 0.05)",
          }}
        >
          <div>
            <h2 style={{ color: "var(--color-cream)", marginBottom: "0.5rem" }}>
              Unit Capacity Status
            </h2>
            <p style={{ color: "var(--color-text-light)" }}>
              Active Batches:{" "}
              <strong
                style={{
                  color:
                    activeOrderCount >= CAPACITY_LIMIT
                      ? "#ff4444"
                      : "var(--color-gold)",
                }}
              >
                {activeOrderCount}
              </strong>{" "}
              / {CAPACITY_LIMIT}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span
              style={{
                color: acceptingOrders ? "#81c784" : "#ff4444",
                fontWeight: "bold",
              }}
            >
              {activeOrderCount < CAPACITY_LIMIT
                ? "• FILLING CAPACITY"
                : acceptingOrders
                ? "• CAPACITY MET (OVERFLOW ALLOWED)"
                : "• MAX CAPACITY REACHED"}
            </span>
            <button
              onClick={handleToggle}
              className={
                acceptingOrders ? "btn btn-primary" : "btn btn-outline"
              }
              style={{
                minWidth: "150px",
                opacity: activeOrderCount < CAPACITY_LIMIT ? 0.5 : 1,
                cursor:
                  activeOrderCount < CAPACITY_LIMIT ? "not-allowed" : "pointer",
              }}
              disabled={activeOrderCount < CAPACITY_LIMIT}
            >
              {activeOrderCount < CAPACITY_LIMIT
                ? "Orders Incoming"
                : acceptingOrders
                ? "Stop Incoming"
                : "Activate Incoming"}
            </button>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "2rem" }}>
          {/* Tabs */}
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
              Active Orders
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
              Pending Approval
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
              Completed History
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

          <div style={{ display: "grid", gap: "1.5rem" }}>
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
                      Order ID
                    </th>
                    <th style={{ padding: "1rem", color: "var(--color-gold)" }}>
                      Date
                    </th>
                    <th style={{ padding: "1rem", color: "var(--color-gold)" }}>
                      Amount
                    </th>
                    <th style={{ padding: "1rem", color: "var(--color-gold)" }}>
                      Payment Status
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
                      <td style={{ padding: "1rem" }}>{earn.id}</td>
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
              displayedOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    padding: "1.5rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    display: "grid",
                    gridTemplateColumns: "1.5fr 1fr 1fr auto",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        color: "var(--color-cream)",
                        marginBottom: "0.2rem",
                      }}
                    >
                      {order.item}
                    </h3>
                    <p
                      style={{
                        color: "var(--color-text-light)",
                        fontSize: "0.9rem",
                      }}
                    >
                      ID: {order.id}
                    </p>
                  </div>

                  <div>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--color-text-light)",
                      }}
                    >
                      Quantity
                    </p>
                    <p style={{ fontWeight: "bold" }}>{order.quantity} units</p>
                  </div>

                  <div>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--color-text-light)",
                      }}
                    >
                      Deadline
                    </p>
                    <p style={{ fontWeight: "bold" }}>{order.deadline}</p>
                  </div>

                  {/* Status Display or Dropdown */}
                  <div style={{ minWidth: "150px", textAlign: "right" }}>
                    {/* If Completed, show read-only Badge */}
                    {activeTab === "completed" ? (
                      <span
                        style={{
                          padding: "0.5rem 1rem",
                          borderRadius: "20px",
                          fontSize: "0.9rem",
                          background: "rgba(76, 175, 80, 0.2)",
                          color: "#81c784",
                          display: "inline-block",
                        }}
                      >
                        {order.status}
                      </span>
                    ) : // Active/Pending: Check if being edited
                    editingId === order.id ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "0.5rem",
                          alignItems: "center",
                          justifyContent: "flex-end",
                        }}
                      >
                        <select
                          autoFocus
                          value={order.status}
                          onChange={(e) =>
                            handleStatusUpdate(order.id, e.target.value)
                          }
                          style={{
                            padding: "0.5rem",
                            borderRadius: "4px",
                            background: "rgba(10, 25, 47, 0.9)",
                            color: "var(--color-text)",
                            border: "1px solid var(--color-gold)",
                            cursor: "pointer",
                            width: "auto",
                          }}
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => setEditingId(null)}
                          style={{
                            fontSize: "0.8rem",
                            color: "#ff4444",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "0.5rem",
                          justifyContent: "flex-end",
                        }}
                      >
                        <span
                          style={{
                            padding: "0.5rem 1rem",
                            borderRadius: "20px",
                            fontSize: "0.9rem",
                            background: "rgba(33, 150, 243, 0.2)",
                            color: "#64b5f6",
                            display: "inline-block",
                          }}
                        >
                          {order.status}
                        </span>
                        <button
                          onClick={() => setEditingId(order.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--color-text-light)",
                            padding: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "color 0.2s",
                          }}
                          title="Update Status"
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = "var(--color-gold)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color =
                              "var(--color-text-light)")
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p
                style={{
                  color: "var(--color-text-light)",
                  padding: "2rem",
                  textAlign: "center",
                }}
              >
                No orders in this category.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturingDashboardPage;
