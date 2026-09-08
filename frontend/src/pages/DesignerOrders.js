// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import api, { SERVER_URL } from "../utils/api";

// const statuses = ["Pending", "In Progress", "Ready", "Completed", "Cancelled"];

// function DesignerOrders() {
//   const { id } = useParams();
//   const [orders, setOrders] = useState([]);
//   const [order, setOrder] = useState(null);
//   const [status, setStatus] = useState("Pending");
//   const [notes, setNotes] = useState("");
//   const [deliveryDate, setDeliveryDate] = useState("");
//   const [filter, setFilter] = useState("All");
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     fetchOrders();
//     api
//       .get("/notifications")
//       .then(({ data }) => setNotifications(data))
//       .catch(() => {});
//   }, []);
//   useEffect(() => {
//     if (id) fetchOrder(id);
//   }, [id]);

//   const fetchOrders = async () => {
//     try {
//       const { data } = await api.get("/orders/designer");
//       setOrders(data);
//     } catch (fetchError) {
//       setError(
//         fetchError.response?.data?.message || "Could not load your orders.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchOrder = async (orderId) => {
//     try {
//       const { data } = await api.get(`/orders/designer/${orderId}`);
//       setOrder(data);
//       setStatus(data.status);
//       setNotes(data.notes || "");
//       setDeliveryDate(
//         data.deliveryDate ? data.deliveryDate.substring(0, 10) : "",
//       );
//     } catch (fetchError) {
//       setError(
//         fetchError.response?.data?.message || "Could not load this order.",
//       );
//     }
//   };

//   const saveUpdate = async (event) => {
//     event.preventDefault();
//     setSaving(true);
//     setMessage("");
//     setError("");
//     try {
//       const { data } = await api.put(`/orders/designer/${id}`, {
//         status,
//         notes,
//         deliveryDate,
//       });
//       setOrder({ ...order, ...data });
//       setOrders((current) =>
//         current.map((item) =>
//           item._id === data._id ? { ...item, ...data } : item,
//         ),
//       );
//       setMessage("Production update saved.");
//     } catch (saveError) {
//       setError(
//         saveError.response?.data?.message || "Could not save this update.",
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <p>Loading your workroom...</p>;
//   if (id && !order)
//     return (
//       <div className="portal-empty">
//         <h4>Order unavailable</h4>
//         <p>{error || "This order is not assigned to you."}</p>
//         <Link to="/designer/orders" className="btn btn-dark">
//           Back to my orders
//         </Link>
//       </div>
//     );

//   if (id) {
//     return (
//       <div>
//         <Link to="/designer/orders" className="text-muted text-decoration-none">
//           Back to my orders
//         </Link>
//         <div className="d-flex justify-content-between align-items-end mt-3 mb-4">
//           <div>
//             <p className="eyebrow mb-1">DESIGNER WORKROOM</p>
//             <h2 className="mb-1">{order.orderNumber}</h2>
//             <p className="text-muted mb-0">
//               Update the production progress for this piece.
//             </p>
//           </div>
//           <span className="status-pill">{order.status}</span>
//         </div>
//         {message && <div className="alert alert-success py-2">{message}</div>}
//         {error && <div className="alert alert-danger py-2">{error}</div>}
//         <div className="row g-4">
//           <div className="col-lg-7">
//             <div className="card p-4">
//               <div className="d-flex gap-3 align-items-start mb-4">
//                 {order.design?.imageUrl && (
//                   <img
//                     src={`${SERVER_URL}${order.design.imageUrl}`}
//                     alt={order.design.caption || "design"}
//                     className="designer-order-image"
//                   />
//                 )}
//                 <div>
//                   <p className="text-muted small mb-1">
//                     {order.design?.category || "Custom request"}
//                   </p>
//                   <h4>{order.design?.caption || order.items}</h4>
//                   <p className="mb-1">Customer: {order.customer?.name}</p>
//                   <p className="text-muted mb-0">
//                     Phone: {order.customer?.phone || "-"}
//                   </p>
//                 </div>
//               </div>
//               <div className="designer-brief">
//                 <span>Customer brief</span>
//                 <p>{order.items}</p>
//                 <span>Customer notes</span>
//                 <p className="mb-0">{order.notes || "No additional notes."}</p>
//               </div>
//               <div className="order-timeline mt-4">
//                 <h5>Production history</h5>
//                 {(order.statusHistory || [])
//                   .slice()
//                   .reverse()
//                   .map((event, index) => (
//                     <div
//                       className="order-timeline-item"
//                       key={`${event.status}-${event.createdAt}-${index}`}
//                     >
//                       <span className="order-timeline-dot" />
//                       <div>
//                         <strong>{event.status}</strong>
//                         <span className="text-muted ms-2 small">
//                           {event.createdAt
//                             ? new Date(event.createdAt).toLocaleString()
//                             : ""}
//                         </span>
//                         <p className="mb-0 text-muted small">
//                           {event.note || "Status updated"}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//               </div>
//             </div>
//           </div>
//           <div className="col-lg-5">
//             <div className="card p-4">
//               <h5>Production update</h5>
//               <form onSubmit={saveUpdate}>
//                 <label className="form-label">Status</label>
//                 <select
//                   className="form-select mb-3"
//                   value={status}
//                   onChange={(event) => setStatus(event.target.value)}
//                 >
//                   {statuses.map((item) => (
//                     <option key={item}>{item}</option>
//                   ))}
//                 </select>
//                 <label className="form-label">Target delivery date</label>
//                 <input
//                   type="date"
//                   className="form-control mb-3"
//                   value={deliveryDate}
//                   onChange={(event) => setDeliveryDate(event.target.value)}
//                 />
//                 <label className="form-label">Workroom notes</label>
//                 <textarea
//                   className="form-control mb-3"
//                   rows="5"
//                   value={notes}
//                   onChange={(event) => setNotes(event.target.value)}
//                   placeholder="Fabric received, fitting needed, sleeve adjustment..."
//                 />
//                 <button className="btn btn-dark w-100" disabled={saving}>
//                   {saving
//                     ? "Saving..."
//                     : status === "Completed"
//                       ? "Mark order completed"
//                       : "Save production update"}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const visibleOrders =
//     filter === "All" ? orders : orders.filter((item) => item.status === filter);
//   return (
//     <div>
//       {notifications.some((notification) => !notification.readAt) && (
//         <div className="designer-alert mb-4">
//           <strong>
//             {
//               notifications.filter((notification) => !notification.readAt)
//                 .length
//             }{" "}
//             new workroom update
//             {notifications.filter((notification) => !notification.readAt)
//               .length === 1
//               ? ""
//               : "s"}
//           </strong>
//           <span>
//             {
//               notifications.find((notification) => !notification.readAt)
//                 ?.message
//             }
//           </span>
//         </div>
//       )}
//       <div className="d-flex justify-content-between align-items-end mb-4">
//         <div>
//           <p className="eyebrow mb-1">DESIGNER WORKROOM</p>
//           <h2 className="mb-1">My assigned orders</h2>
//           <p className="text-muted mb-0">
//             Track the pieces connected to your catalog designs.
//           </p>
//         </div>
//         <span className="badge bg-light text-dark border">
//           {orders.length} assigned
//         </span>
//       </div>
//       {error && <div className="alert alert-danger py-2">{error}</div>}
//       <div className="order-filter-bar mb-4">
//         {["All", ...statuses].map((item) => (
//           <button
//             type="button"
//             className={filter === item ? "active" : ""}
//             key={item}
//             onClick={() => setFilter(item)}
//           >
//             {item}
//           </button>
//         ))}
//       </div>
//       <div className="row g-3">
//         {visibleOrders.map((item) => (
//           <div className="col-md-6 col-xl-4" key={item._id}>
//             <Link
//               to={`/designer/orders/${item._id}`}
//               className="designer-order-card text-decoration-none"
//             >
//               <div className="d-flex justify-content-between">
//                 <span className="portal-order-number">{item.orderNumber}</span>
//                 <span className="status-pill">{item.status}</span>
//               </div>
//               <h5>{item.design?.caption || item.items}</h5>
//               <p>Customer: {item.customer?.name || "Customer"}</p>
//               <small>
//                 {item.deliveryDate
//                   ? `Due ${new Date(item.deliveryDate).toLocaleDateString()}`
//                   : "No delivery date set"}
//               </small>
//             </Link>
//           </div>
//         ))}
//         {visibleOrders.length === 0 && (
//           <div className="portal-empty">
//             <h5>No assigned orders yet.</h5>
//             <p className="mb-0">
//               Orders placed from your catalog will appear here.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default DesignerOrders;

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { SERVER_URL } from "../utils/api";

const statuses = ["Pending", "In Progress", "Ready", "Completed", "Cancelled"];

function DesignerOrders() {
  const { id } = useParams();

  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [designerProfile, setDesignerProfile] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [notes, setNotes] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchOrders();

    api
      .get("/auth/profile")
      .then(({ data }) => {
        setDesignerProfile(data);
      })
      .catch(() => {});

    api
      .get("/notifications")
      .then(({ data }) => setNotifications(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (id) fetchOrder(id);
  }, [id]);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/designer");
      setOrders(data);
    } catch (fetchError) {
      setError(
        fetchError.response?.data?.message || "Could not load your orders.",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchOrder = async (orderId) => {
    try {
      const { data } = await api.get(`/orders/designer/${orderId}`);

      setOrder(data);
      setStatus(data.status);
      setNotes(data.notes || "");
      setDeliveryDate(
        data.deliveryDate ? data.deliveryDate.substring(0, 10) : "",
      );
    } catch (fetchError) {
      setError(
        fetchError.response?.data?.message || "Could not load this order.",
      );
    }
  };

  const saveUpdate = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const { data } = await api.put(`/orders/designer/${id}`, {
        status,
        notes,
        deliveryDate,
      });

      setOrder({ ...order, ...data });

      setOrders((current) =>
        current.map((item) =>
          item._id === data._id ? { ...item, ...data } : item,
        ),
      );

      setMessage("Production update saved.");
    } catch (saveError) {
      setError(
        saveError.response?.data?.message || "Could not save this update.",
      );
    } finally {
      setSaving(false);
    }
  };

  const getStatusIcon = (currentStatus) => {
    switch (currentStatus) {
      case "Pending":
        return "bi-hourglass-split";
      case "In Progress":
        return "bi-scissors";
      case "Ready":
        return "bi-stars";
      case "Completed":
        return "bi-check2-circle";
      case "Cancelled":
        return "bi-x-circle";
      default:
        return "bi-circle";
    }
  };

  const getStatusClass = (currentStatus) => {
    switch (currentStatus) {
      case "Pending":
        return "status-pending";
      case "In Progress":
        return "status-progress";
      case "Ready":
        return "status-ready";
      case "Completed":
        return "status-completed";
      case "Cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <div className="designer-loading">
        <div className="spinner-border text-dark" role="status" />
        <p className="mt-3 mb-0">Preparing your workroom...</p>
      </div>
    );
  }

  /*
   * =========================
   * ORDER DETAIL PAGE
   * =========================
   */

  if (id && !order) {
    return (
      <div className="portal-empty designer-empty">
        <div className="designer-empty-icon">
          <i className="bi bi-search"></i>
        </div>

        <p className="designer-mini-label">WORKROOM</p>

        <h4>Order unavailable</h4>

        <p>{error || "This order is not assigned to you."}</p>

        <Link to="/designer/orders" className="btn btn-dark px-4">
          <i className="bi bi-arrow-left me-2"></i>
          Back to my orders
        </Link>
      </div>
    );
  }

  if (id) {
    return (
      <div className="designer-page">
        {/* Back */}
        <Link to="/designer/orders" className="designer-back-link">
          <i className="bi bi-arrow-left"></i>
          Back to my workroom
        </Link>

        {/* Header */}
        <div className="designer-detail-header mt-4 mb-4">
          <div>
            <p className="designer-mini-label mb-2">DESIGNER WORKROOM</p>

            <h2 className="designer-title mb-1">{order.orderNumber}</h2>

            <p className="designer-subtitle mb-0">
              From sketch to stitch — bring this piece to life.
            </p>
          </div>

          <span className={`designer-status ${getStatusClass(order.status)}`}>
            <i className={`bi ${getStatusIcon(order.status)}`}></i>

            {order.status}
          </span>
        </div>

        {/* Alerts */}
        {message && (
          <div className="designer-success mb-4">
            <i className="bi bi-check-circle-fill"></i>
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="designer-error mb-4">
            <i className="bi bi-exclamation-circle-fill"></i>
            <span>{error}</span>
          </div>
        )}

        <div className="row g-4">
          {/* LEFT */}
          <div className="col-lg-7">
            {/* Design card */}
            <div className="designer-card designer-design-card">
              {order.design?.imageUrl ? (
                <div className="designer-detail-image-wrap">
                  <img
                    src={`${SERVER_URL}${order.design.imageUrl}`}
                    alt={order.design.caption || "Boutique design"}
                    className="designer-detail-image"
                  />
                </div>
              ) : (
                <div className="designer-no-image">
                  <i className="bi bi-scissors"></i>
                  <span>Custom design</span>
                </div>
              )}

              <div className="designer-design-info">
                <p className="designer-category">
                  {order.design?.category || "CUSTOM REQUEST"}
                </p>

                <h3>{order.design?.caption || order.items}</h3>

                <div className="designer-customer">
                  <div>
                    <small>CUSTOMER</small>
                    <strong>{order.customer?.name || "Customer"}</strong>
                  </div>
                </div>

                {order.customer?.phone && (
                  <div className="designer-phone">
                    <i className="bi bi-telephone"></i>
                    {order.customer.phone}
                  </div>
                )}
              </div>
            </div>

            {/* Customer brief */}
            <div className="designer-card mt-4">
              <div className="designer-card-heading">
                <div className="designer-heading-icon">
                  <i className="bi bi-chat-square-text"></i>
                </div>

                <div>
                  <p className="designer-mini-label mb-0">THE BRIEF</p>
                  <h5 className="mb-0">Customer's vision</h5>
                </div>
              </div>

              <div className="designer-brief-modern">
                <p className="brief-label">DESIGN REQUEST</p>

                <p className="brief-main">{order.items}</p>

                <div className="brief-divider"></div>

                <p className="brief-label">ADDITIONAL NOTES</p>

                <p className="brief-notes mb-0">
                  {order.notes ||
                    "No additional notes were added for this piece."}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="designer-card mt-4">
              <div className="designer-card-heading">
                <div className="designer-heading-icon">
                  <i className="bi bi-clock-history"></i>
                </div>

                <div>
                  <p className="designer-mini-label mb-0">THE JOURNEY</p>

                  <h5 className="mb-0">Production history</h5>
                </div>
              </div>

              <div className="designer-timeline">
                {(order.statusHistory || [])
                  .slice()
                  .reverse()
                  .map((event, index) => (
                    <div
                      className="designer-timeline-item"
                      key={`${event.status}-${event.createdAt}-${index}`}
                    >
                      <div className="designer-timeline-marker">
                        <i className={`bi ${getStatusIcon(event.status)}`}></i>
                      </div>

                      <div className="designer-timeline-content">
                        <div className="d-flex justify-content-between align-items-start gap-2">
                          <strong>{event.status}</strong>

                          <small>
                            {event.createdAt
                              ? new Date(event.createdAt).toLocaleDateString()
                              : ""}
                          </small>
                        </div>

                        <p>{event.note || "Status updated"}</p>
                      </div>
                    </div>
                  ))}

                {(!order.statusHistory || order.statusHistory.length === 0) && (
                  <div className="text-muted small">
                    Production history will appear here as this piece moves
                    forward.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-lg-5">
            <div className="designer-card designer-update-card">
              <div className="designer-update-header">
                <div>
                  <p className="designer-mini-label mb-1">WORKROOM ACTION</p>

                  <h4>Update production</h4>
                </div>

                <div className="designer-scissors">
                  <i className="bi bi-scissors"></i>
                </div>
              </div>

              <p className="designer-form-intro">
                Keep the customer journey moving by updating the latest
                production stage.
              </p>

              <form onSubmit={saveUpdate}>
                <label className="designer-label">CURRENT STATUS</label>

                <select
                  className="form-select designer-input mb-4"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  {statuses.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <label className="designer-label">TARGET DELIVERY</label>

                <input
                  type="date"
                  className="form-control designer-input mb-4"
                  value={deliveryDate}
                  onChange={(event) => setDeliveryDate(event.target.value)}
                />

                <label className="designer-label">WORKROOM NOTES</label>

                <textarea
                  className="form-control designer-input mb-4"
                  rows="5"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Fabric received, fitting needed, sleeve adjustment..."
                />

                <button
                  className="btn designer-save-btn w-100"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Saving...
                    </>
                  ) : status === "Completed" ? (
                    <>
                      <i className="bi bi-check2-circle me-2"></i>
                      Mark order completed
                    </>
                  ) : (
                    <>
                      Save production update
                      <i className="bi bi-arrow-right ms-2"></i>
                    </>
                  )}
                </button>
              </form>

              <div className="designer-quote">
                <i className="bi bi-quote"></i>
                <span>Great design is in the details.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
   * =========================
   * ORDERS LIST
   * =========================
   */

  const visibleOrders =
    filter === "All" ? orders : orders.filter((item) => item.status === filter);

  const activeOrders = orders.filter(
    (item) => item.status === "Pending" || item.status === "In Progress",
  ).length;

  const readyOrders = orders.filter((item) => item.status === "Ready").length;

  const completedOrders = orders.filter(
    (item) => item.status === "Completed",
  ).length;

  const unreadNotifications = notifications.filter(
    (notification) => !notification.readAt,
  ).length;

  return (
    <div className="designer-page">
      {/* Hero */}
      <div className="designer-hero">
        <div>
          <p className="designer-mini-label mb-2">BOUTIQ · DESIGNER WORKROOM</p>

          <h1>{getGreeting()}, designer.</h1>

          <p>Every stitch brings the design closer to its final form.</p>
        </div>

        <div className="designer-hero-icon designer-profile-hero">
          {designerProfile?.profilePicture ? (
            <img
              src={`${SERVER_URL}${designerProfile.profilePicture}`}
              alt={designerProfile.name || "Designer"}
            />
          ) : (
            <span>
              {designerProfile?.name?.slice(0, 1)?.toUpperCase() || "D"}
            </span>
          )}
        </div>
      </div>

      {/* Notification */}
      {unreadNotifications > 0 && (
        <div className="designer-alert mb-4">
          <div className="designer-alert-icon">
            <i className="bi bi-bell"></i>
          </div>

          <div>
            <strong>
              {unreadNotifications} new workroom update
              {unreadNotifications === 1 ? "" : "s"}
            </strong>

            <span>
              {
                notifications.find((notification) => !notification.readAt)
                  ?.message
              }
            </span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="designer-stat-card">
            <div className="designer-stat-icon">
              <i className="bi bi-briefcase"></i>
            </div>

            <div>
              <span>Total pieces</span>
              <strong>{orders.length}</strong>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="designer-stat-card">
            <div className="designer-stat-icon">
              <i className="bi bi-scissors"></i>
            </div>

            <div>
              <span>In the workroom</span>
              <strong>{activeOrders}</strong>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="designer-stat-card">
            <div className="designer-stat-icon">
              <i className="bi bi-stars"></i>
            </div>

            <div>
              <span>Ready</span>
              <strong>{readyOrders}</strong>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="designer-stat-card">
            <div className="designer-stat-icon">
              <i className="bi bi-check2-circle"></i>
            </div>

            <div>
              <span>Completed</span>
              <strong>{completedOrders}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Section header */}
      <div className="designer-section-header mb-3">
        <div>
          <p className="designer-mini-label mb-1">YOUR COLLECTION</p>

          <h3>Assigned pieces</h3>
        </div>

        <span className="designer-count">{orders.length} pieces</span>
      </div>

      {error && (
        <div className="designer-error mb-4">
          <i className="bi bi-exclamation-circle-fill"></i>
          <span>{error}</span>
        </div>
      )}

      {/* Filters */}
      <div className="designer-filter-bar mb-4">
        {["All", ...statuses].map((item) => (
          <button
            type="button"
            className={
              filter === item ? "designer-filter active" : "designer-filter"
            }
            key={item}
            onClick={() => setFilter(item)}
          >
            {item !== "All" && <i className={`bi ${getStatusIcon(item)}`}></i>}

            {item}

            {item === "All" && <span>{orders.length}</span>}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="row g-4">
        {visibleOrders.map((item) => (
          <div className="col-md-6 col-xl-4" key={item._id}>
            <Link
              to={`/designer/orders/${item._id}`}
              className="designer-order-card"
            >
              {/* Image */}
              {item.design?.imageUrl ? (
                <div className="designer-order-image-wrap">
                  <img
                    src={`${SERVER_URL}${item.design.imageUrl}`}
                    alt={item.design.caption || "Design"}
                    className="designer-order-image"
                  />
                </div>
              ) : (
                <div className="designer-order-placeholder">
                  <i className="bi bi-scissors"></i>
                </div>
              )}

              {/* Card body */}
              <div className="designer-order-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="portal-order-number">
                    {item.orderNumber}
                  </span>

                  <span
                    className={`designer-status small-status ${getStatusClass(
                      item.status,
                    )}`}
                  >
                    <i className={`bi ${getStatusIcon(item.status)}`}></i>

                    {item.status}
                  </span>
                </div>

                <p className="designer-order-category">
                  {item.design?.category || "CUSTOM DESIGN"}
                </p>

                <h5>{item.design?.caption || item.items}</h5>

                <div className="designer-order-customer">
                  <span>{item.customer?.name || "Customer"}</span>
                </div>

                <div className="designer-order-footer">
                  <small>
                    <i className="bi bi-calendar3 me-1"></i>

                    {item.deliveryDate
                      ? `Due ${new Date(
                          item.deliveryDate,
                        ).toLocaleDateString()}`
                      : "No delivery date"}
                  </small>

                  <span>
                    View piece
                    <i className="bi bi-arrow-up-right ms-1"></i>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}

        {visibleOrders.length === 0 && (
          <div className="col-12">
            <div className="designer-empty">
              <div className="designer-empty-icon">
                <i className="bi bi-scissors"></i>
              </div>

              <p className="designer-mini-label">YOUR WORKROOM</p>

              <h4>Your workroom is quiet... for now.</h4>

              <p>New designs assigned to you will appear here.</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom quote */}
      {visibleOrders.length > 0 && (
        <div className="designer-bottom-quote">
          <span className="quote-line"></span>

          <p>“The beauty is in the details.”</p>

          <span className="quote-line"></span>
        </div>
      )}
    </div>
  );
}

export default DesignerOrders;
