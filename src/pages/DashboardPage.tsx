// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../lib/supabase";

// interface OrderStep {
//   title: string;
//   date: string;
//   status: "completed" | "current" | "pending";
//   description: string;
// }

// interface Order {
//   id: string;
//   item: string;
//   date: string;
//   status: string;
//   total: string;
//   steps: OrderStep[];
// }

// const DashboardPage = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAuth = async () => {
//       const { data } = await supabase.auth.getSession();

//       if (!data.session) {
//         navigate("/");
//       }
//     };

//     checkAuth();
//   }, [navigate]);

//   const [selectedOrder, setSelectedOrder] = useState<string | null>(
//     "ORD-2024-001"
//   );

//   // Mock Data
//   const orders: Order[] = [
//     {
//       id: "ORD-2024-001",
//       item: "Bespoke Italian Wool Suit",
//       date: "Dec 20, 2024",
//       status: "In Progress",
//       total: "$1,200",
//       steps: [
//         {
//           title: "Consultation",
//           date: "Dec 20",
//           status: "completed",
//           description: "Style consultation and fabric selection completed.",
//         },
//         {
//           title: "Measurement",
//           date: "Dec 20",
//           status: "completed",
//           description: "Detailed measurements taken.",
//         },
//         {
//           title: "Pattern Cutting",
//           date: "Dec 22",
//           status: "completed",
//           description: "Master tailor created your unique pattern.",
//         },
//         {
//           title: "First Fitting",
//           date: "Dec 26",
//           status: "current",
//           description: "Initial fitting to ensure perfect drape and comfort.",
//         },
//         {
//           title: "Final Stitching",
//           date: "Pending",
//           status: "pending",
//           description: "Final adjustments and finishing touches.",
//         },
//         {
//           title: "Delivery",
//           date: "Pending",
//           status: "pending",
//           description: "Ready for pickup/delivery.",
//         },
//       ],
//     },
//     {
//       id: "ORD-2023-089",
//       item: "Velvet Smoking Jacket",
//       date: "Nov 15, 2023",
//       status: "Delivered",
//       total: "$850",
//       steps: [
//         {
//           title: "Consultation",
//           date: "Nov 15",
//           status: "completed",
//           description: "Confirmed style and measurements.",
//         },
//         {
//           title: "Production",
//           date: "Nov 20",
//           status: "completed",
//           description: "Crafting completed.",
//         },
//         {
//           title: "Delivery",
//           date: "Nov 25",
//           status: "completed",
//           description: "Delivered to client.",
//         },
//       ],
//     },
//   ];

//   const currentOrder = orders.find((o) => o.id === selectedOrder);

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "var(--gradient-bg)",
//         color: "var(--color-text)",
//         padding: "2rem",
//         fontFamily: "var(--font-body)",
//       }}
//     >
//       {/* Header */}
//       <header
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "3rem",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//           <div
//             style={{
//               fontSize: "1.5rem",
//               fontWeight: "bold",
//               color: "var(--color-gold)",
//               cursor: "pointer",
//             }}
//             onClick={() => navigate("/")}
//           >
//             KM
//           </div>
//           <button
//             className="btn btn-outline"
//             style={{ fontSize: "0.8rem", padding: "8px 16px" }}
//             onClick={() => navigate("/")}
//           >
//             ← Back to Home
//           </button>
//         </div>
//         <h1
//           style={{
//             fontFamily: "var(--font-heading)",
//             color: "var(--color-cream)",
//           }}
//         >
//           My Dashboard
//         </h1>
//         <div style={{ width: "40px" }}></div> {/* Spacer for alignment */}
//       </header>

//       <div
//         className="container"
//         style={{
//           display: "grid",
//           gridTemplateColumns: "minmax(300px, 1fr) 2fr",
//           gap: "2rem",
//         }}
//       >
//         {/* Sidebar: Order List */}
//         <div
//           className="glass-panel slide-up"
//           style={{ padding: "1.5rem", height: "fit-content" }}
//         >
//           <h3
//             style={{
//               borderBottom: "1px solid var(--color-primary-light)",
//               paddingBottom: "1rem",
//               marginBottom: "1.5rem",
//               color: "var(--color-gold)",
//             }}
//           >
//             Order History
//           </h3>
//           <div
//             style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
//           >
//             {orders.map((order) => (
//               <div
//                 key={order.id}
//                 onClick={() => setSelectedOrder(order.id)}
//                 style={{
//                   padding: "1rem",
//                   borderRadius: "8px",
//                   background:
//                     selectedOrder === order.id
//                       ? "rgba(212, 175, 55, 0.1)"
//                       : "rgba(255, 255, 255, 0.03)",
//                   border: `1px solid ${
//                     selectedOrder === order.id
//                       ? "var(--color-gold)"
//                       : "transparent"
//                   }`,
//                   cursor: "pointer",
//                   transition: "all 0.3s ease",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     marginBottom: "0.5rem",
//                   }}
//                 >
//                   <span
//                     style={{ fontWeight: "bold", color: "var(--color-cream)" }}
//                   >
//                     {order.id}
//                   </span>
//                   <span
//                     style={{
//                       fontSize: "0.8rem",
//                       padding: "2px 8px",
//                       borderRadius: "10px",
//                       background:
//                         order.status === "Delivered"
//                           ? "rgba(100, 255, 100, 0.1)"
//                           : "rgba(212, 175, 55, 0.1)",
//                       color:
//                         order.status === "Delivered"
//                           ? "#64ff64"
//                           : "var(--color-gold)",
//                     }}
//                   >
//                     {order.status}
//                   </span>
//                 </div>
//                 <p style={{ fontSize: "0.9rem", marginBottom: "0.2rem" }}>
//                   {order.item}
//                 </p>
//                 <p
//                   style={{
//                     fontSize: "0.8rem",
//                     color: "var(--color-text-light)",
//                   }}
//                 >
//                   {order.date}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Main Content: Detailed Timeline */}
//         <div
//           className="glass-panel slide-up"
//           style={{ padding: "2rem", animationDelay: "0.1s" }}
//         >
//           {currentOrder ? (
//             <>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "flex-start",
//                   marginBottom: "2rem",
//                 }}
//               >
//                 <div>
//                   <h2
//                     style={{
//                       color: "var(--color-cream)",
//                       marginBottom: "0.5rem",
//                     }}
//                   >
//                     {currentOrder.item}
//                   </h2>
//                   <p style={{ color: "var(--color-gold)" }}>
//                     Total: {currentOrder.total}
//                   </p>
//                 </div>
//                 <div style={{ textAlign: "right" }}>
//                   <p
//                     style={{
//                       fontSize: "0.9rem",
//                       color: "var(--color-text-light)",
//                     }}
//                   >
//                     Order ID: {currentOrder.id}
//                   </p>
//                   <p
//                     style={{
//                       fontSize: "0.9rem",
//                       color: "var(--color-text-light)",
//                     }}
//                   >
//                     Placed on: {currentOrder.date}
//                   </p>
//                 </div>
//               </div>

//               <h3
//                 style={{
//                   marginBottom: "1.5rem",
//                   borderBottom: "1px solid var(--color-primary-light)",
//                   paddingBottom: "0.5rem",
//                 }}
//               >
//                 Order Timeline
//               </h3>

//               <div
//                 style={{
//                   position: "relative",
//                   paddingLeft: "2rem",
//                   borderLeft: "2px solid var(--color-primary-light)",
//                 }}
//               >
//                 {currentOrder.steps.map((step, index) => (
//                   <div
//                     key={index}
//                     style={{ marginBottom: "2rem", position: "relative" }}
//                   >
//                     {/* Status Dot */}
//                     <div
//                       style={{
//                         position: "absolute",
//                         left: "-2.6rem",
//                         top: "0",
//                         width: "16px",
//                         height: "16px",
//                         borderRadius: "50%",
//                         background:
//                           step.status === "completed"
//                             ? "var(--color-gold)"
//                             : step.status === "current"
//                             ? "var(--color-primary)"
//                             : "var(--color-primary-light)",
//                         border: `2px solid ${
//                           step.status === "current"
//                             ? "var(--color-gold)"
//                             : "transparent"
//                         }`,
//                         boxShadow:
//                           step.status === "current"
//                             ? "0 0 10px var(--color-gold)"
//                             : "none",
//                         zIndex: 1,
//                       }}
//                     ></div>

//                     <div
//                       style={{ opacity: step.status === "pending" ? 0.5 : 1 }}
//                     >
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           marginBottom: "0.2rem",
//                         }}
//                       >
//                         <h4
//                           style={{
//                             color:
//                               step.status === "current"
//                                 ? "var(--color-gold)"
//                                 : "var(--color-cream)",
//                           }}
//                         >
//                           {step.title}
//                         </h4>
//                         <span
//                           style={{
//                             fontSize: "0.85rem",
//                             color: "var(--color-text-light)",
//                           }}
//                         >
//                           {step.date}
//                         </span>
//                       </div>
//                       <p style={{ fontSize: "0.9rem" }}>{step.description}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           ) : (
//             <p>Select an order to view details.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface OrderStep {
  title: string;
  date: string;
  status: "completed" | "current" | "pending";
  description: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  orderData: any;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        navigate("/");
        return;
      }

      const user = data.session.user;

      // Fetch orders for the logged-in user
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        return;
      }

      if (ordersData) {
        const formattedOrders: Order[] = ordersData.map((order: any) => ({
          id: order.id,
          date: new Date(order.created_at).toLocaleDateString(),
          status: order.order_status,
          orderData: order.order_data,
        }));

        setOrders(formattedOrders);
        if (formattedOrders.length > 0) setSelectedOrder(formattedOrders[0].id);
      }
    };

    checkAuth();
  }, [navigate]);

  const currentOrder = orders.find((o) => o.id === selectedOrder);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--gradient-bg)",
        color: "var(--color-text)",
        padding: "2rem",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "3rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "var(--color-gold)",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            KM
          </div>
          <button
            className="btn btn-outline"
            style={{ fontSize: "0.8rem", padding: "8px 16px" }}
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </button>
        </div>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-cream)",
          }}
        >
          My Dashboard
        </h1>
        <div style={{ width: "40px" }}></div> {/* Spacer for alignment */}
      </header>

      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(300px, 1fr) 2fr",
          gap: "2rem",
        }}
      >
        {/* Sidebar: Order List */}
        <div
          className="glass-panel slide-up"
          style={{ padding: "1.5rem", height: "fit-content" }}
        >
          <h3
            style={{
              borderBottom: "1px solid var(--color-primary-light)",
              paddingBottom: "1rem",
              marginBottom: "1.5rem",
              color: "var(--color-gold)",
            }}
          >
            Order History
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order.id)}
                style={{
                  padding: "1rem",
                  borderRadius: "8px",
                  background:
                    selectedOrder === order.id
                      ? "rgba(212, 175, 55, 0.1)"
                      : "rgba(255, 255, 255, 0.03)",
                  border: `1px solid ${
                    selectedOrder === order.id
                      ? "var(--color-gold)"
                      : "transparent"
                  }`,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span
                    style={{ fontWeight: "bold", color: "var(--color-cream)" }}
                  >
                    {order.id}
                  </span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      background:
                        order.status === "Delivered"
                          ? "rgba(100, 255, 100, 0.1)"
                          : "rgba(212, 175, 55, 0.1)",
                      color:
                        order.status === "Delivered"
                          ? "#64ff64"
                          : "var(--color-gold)",
                    }}
                  >
                    {order.status}
                  </span>
                </div>
                <p style={{ fontSize: "0.9rem", marginBottom: "0.2rem" }}>
                  {order.orderData.service}
                </p>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--color-text-light)",
                  }}
                >
                  {order.date}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content: Detailed Timeline */}
        <div
          className="glass-panel slide-up"
          style={{ padding: "2rem", animationDelay: "0.1s" }}
        >
          {currentOrder ? (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "2rem",
                }}
              >
                <div>
                  <h2
                    style={{
                      color: "var(--color-cream)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {currentOrder.orderData.service}
                  </h2>
                  <p style={{ color: "var(--color-gold)" }}>
                    Total:{" "}
                    {currentOrder.orderData.total
                      ? "$" + currentOrder.orderData.price
                      : "TBD"}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--color-text-light)",
                    }}
                  >
                    Order ID: {currentOrder.id}
                  </p>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--color-text-light)",
                    }}
                  >
                    Placed on: {currentOrder.date}
                  </p>
                </div>
              </div>

              <div style={{ display: "grid", gap: "0.8rem" }}>
                <p>
                  <strong>Garment:</strong> {currentOrder.orderData.garment}
                </p>
                <p>
                  <strong>Fabric:</strong> {currentOrder.orderData.fabric}
                </p>
                <p>
                  <strong>Design:</strong> {currentOrder.orderData.design}
                </p>
                <p>
                  <strong>Service:</strong> {currentOrder.orderData.service}
                </p>
                <p>
                  <strong>Delivery:</strong> {currentOrder.orderData.delivery}
                </p>
                <p>
                  <strong>Location:</strong> {currentOrder.orderData.location}
                </p>
                <p>
                  <strong>Gender:</strong> {currentOrder.orderData.gender}
                </p>
                <p>
                  <strong>Age:</strong> {currentOrder.orderData.age}
                </p>
              </div>
              <h3 style={{ marginTop: "1.5rem" }}>Selected Colors</h3>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {Object.entries(currentOrder.orderData.colors || {}).map(
                  ([name, color]: any) => (
                    <div key={name} style={{ textAlign: "center" }}>
                      <div
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          background: color,
                          marginBottom: "0.3rem",
                          border: "1px solid #ccc",
                        }}
                      />
                      <small>{name}</small>
                    </div>
                  )
                )}
              </div>

              <p style={{ marginTop: "1rem" }}>
                <strong>Status:</strong>{" "}
                <span style={{ color: "var(--color-gold)" }}>
                  {currentOrder.status}
                </span>
              </p>
            </>
          ) : (
            <p>Select an order to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
