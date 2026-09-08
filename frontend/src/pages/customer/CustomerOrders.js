// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import customerApi from "../../utils/customerApi";

// function CustomerOrders() {
//   const [orders, setOrders] = useState([]);
//   const [filter, setFilter] = useState("All");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const { data } = await customerApi.get("/customer-portal/orders");
//       setOrders(data);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <p>Loading your orders...</p>;

//   const visibleOrders =
//     filter === "All"
//       ? orders
//       : orders.filter((order) => order.status === filter);
//   const filters = [
//     "All",
//     "Pending",
//     "In Progress",
//     "Ready",
//     "Completed",
//     "Delivered",
//   ];

//   return (
//     <div>
//       <div className="portal-section-heading mb-4">
//         <div>
//           <p className="eyebrow mb-1">YOUR WORKROOM</p>
//           <h2 className="mb-0">My orders</h2>
//         </div>
//         <Link to="/customer/order-request" className="btn btn-dark">
//           Place an Order
//         </Link>
//       </div>

//       <div className="order-filter-bar mb-4">
//         {filters.map((option) => (
//           <button
//             type="button"
//             key={option}
//             className={filter === option ? "active" : ""}
//             onClick={() => setFilter(option)}
//           >
//             {option}
//           </button>
//         ))}
//       </div>

//       {orders.length === 0 && (
//         <p className="text-muted">
//           You don't have any orders yet. Browse our designs or tell us exactly
//           what you have in mind.
//         </p>
//       )}

//       <div className="row g-3">
//         {visibleOrders.map((o) => (
//           <div className="col-md-6" key={o._id}>
//             <Link
//               to={`/customer/orders/${o._id}`}
//               className="text-decoration-none text-dark"
//             >
//               <div className="card p-3 shadow-sm h-100">
//                 <div className="d-flex justify-content-between align-items-start">
//                   <h5 className="mb-1">{o.orderNumber}</h5>
//                   <span className="badge bg-secondary">{o.status}</span>
//                 </div>
//                 <p className="mb-1 text-muted">{o.items}</p>
//                 <p className="mb-0">
//                   Total: Rs. {Number(o.totalAmount).toLocaleString("en-IN")}
//                 </p>
//               </div>
//             </Link>
//           </div>
//         ))}
//       </div>
//       {orders.length > 0 && visibleOrders.length === 0 && (
//         <div className="portal-empty mt-3">
//           <p className="mb-0">No orders match this filter.</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default CustomerOrders;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import customerApi from "../../utils/customerApi";

function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await customerApi.get("/customer-portal/orders");
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center py-5"
        style={{ minHeight: "60vh" }}
      >
        <div
          className="spinner-border mb-3"
          style={{ color: "#743d4b" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>

        <p
          className="mb-0"
          style={{ color: "#806b63" }}
        >
          Loading your orders...
        </p>
      </div>
    );
  }

  const visibleOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

  const filters = [
    "All",
    "Pending",
    "In Progress",
    "Ready",
    "Completed",
    "Delivered",
  ];

  return (
    <div className="container-fluid px-2 px-md-4 py-3 py-md-4 pb-5">

      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

        <div>
          <small
            className="fw-semibold"
            style={{
              color: "#8a5a5a",
              letterSpacing: "1.2px",
            }}
          >
            YOUR WORKROOM
          </small>

          <h2
            className="fw-semibold mb-1 mt-1"
            style={{ color: "#4a2928" }}
          >
            My Orders
          </h2>

          <p
            className="mb-0"
            style={{ color: "#806b63" }}
          >
            Track your boutique orders and their progress.
          </p>
        </div>

        <Link
          to="/customer/order-request"
          className="btn align-self-start align-self-md-center px-4 py-2"
          style={{
            backgroundColor: "#743d4b",
            color: "#fffaf5",
            border: "none",
            borderRadius: "9px",
          }}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Place an Order
        </Link>

      </div>

      {/* ORDER STATS */}
      {orders.length > 0 && (
        <div className="row g-3 mb-4">

          {/* TOTAL */}
          <div className="col-6 col-md-3">
            <div
              className="card border-0 shadow-sm rounded-4 h-100"
              style={{ backgroundColor: "#faf4ee" }}
            >
              <div className="card-body p-3 p-md-4">

                <div className="d-flex justify-content-between align-items-start gap-2">
                  <div>
                    <small
                      className="fw-semibold d-block"
                      style={{
                        color: "#8a5a5a",
                        letterSpacing: "1px",
                      }}
                    >
                      TOTAL ORDERS
                    </small>

                    <strong
                      className="fs-3 d-block mt-2"
                      style={{ color: "#4a2928" }}
                    >
                      {orders.length}
                    </strong>
                  </div>

                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "42px",
                      height: "42px",
                      backgroundColor: "#ead7d0",
                      color: "#743d4b",
                    }}
                  >
                    <i className="bi bi-bag-heart"></i>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* IN PROGRESS */}
          <div className="col-6 col-md-3">
            <div
              className="card border-0 shadow-sm rounded-4 h-100"
              style={{ backgroundColor: "#f1f2ea" }}
            >
              <div className="card-body p-3 p-md-4">

                <div className="d-flex justify-content-between align-items-start gap-2">
                  <div>
                    <small
                      className="fw-semibold d-block"
                      style={{
                        color: "#68705b",
                        letterSpacing: "1px",
                      }}
                    >
                      IN PROGRESS
                    </small>

                    <strong
                      className="fs-3 d-block mt-2"
                      style={{ color: "#4a2928" }}
                    >
                      {
                        orders.filter(
                          (o) => o.status === "In Progress"
                        ).length
                      }
                    </strong>
                  </div>

                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "42px",
                      height: "42px",
                      backgroundColor: "#dfe7d7",
                      color: "#68705b",
                    }}
                  >
                    <i className="bi bi-hourglass-split"></i>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* READY */}
          <div className="col-6 col-md-3">
            <div
              className="card border-0 shadow-sm rounded-4 h-100"
              style={{ backgroundColor: "#f5eee7" }}
            >
              <div className="card-body p-3 p-md-4">

                <div className="d-flex justify-content-between align-items-start gap-2">
                  <div>
                    <small
                      className="fw-semibold d-block"
                      style={{
                        color: "#806b63",
                        letterSpacing: "1px",
                      }}
                    >
                      READY
                    </small>

                    <strong
                      className="fs-3 d-block mt-2"
                      style={{ color: "#4a2928" }}
                    >
                      {
                        orders.filter(
                          (o) => o.status === "Ready"
                        ).length
                      }
                    </strong>
                  </div>

                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "42px",
                      height: "42px",
                      backgroundColor: "#e9dfd5",
                      color: "#743d4b",
                    }}
                  >
                    <i className="bi bi-check2-circle"></i>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* COMPLETED */}
          <div className="col-6 col-md-3">
            <div
              className="card border-0 shadow-sm rounded-4 h-100"
              style={{ backgroundColor: "#f3e9eb" }}
            >
              <div className="card-body p-3 p-md-4">

                <div className="d-flex justify-content-between align-items-start gap-2">
                  <div>
                    <small
                      className="fw-semibold d-block"
                      style={{
                        color: "#8a5a5a",
                        letterSpacing: "1px",
                      }}
                    >
                      COMPLETED
                    </small>

                    <strong
                      className="fs-3 d-block mt-2"
                      style={{ color: "#4a2928" }}
                    >
                      {
                        orders.filter(
                          (o) =>
                            o.status === "Completed" ||
                            o.status === "Delivered"
                        ).length
                      }
                    </strong>
                  </div>

                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "42px",
                      height: "42px",
                      backgroundColor: "#ead7d0",
                      color: "#743d4b",
                    }}
                  >
                    <i className="bi bi-stars"></i>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      )}

      {/* FILTERS */}
      <div
        className="card border-0 shadow-sm rounded-4 mb-4"
        style={{ backgroundColor: "#fffaf5" }}
      >
        <div className="card-body p-2">

          <div className="d-flex gap-2 overflow-auto pb-1">

            {filters.map((option) => (
              <button
                type="button"
                key={option}
                className="btn btn-sm text-nowrap"
                style={
                  filter === option
                    ? {
                        backgroundColor: "#743d4b",
                        color: "#fffaf5",
                        border: "1px solid #743d4b",
                        borderRadius: "8px",
                      }
                    : {
                        backgroundColor: "#f7eee5",
                        color: "#6b5148",
                        border: "1px solid #eaded6",
                        borderRadius: "8px",
                      }
                }
                onClick={() => setFilter(option)}
              >
                {option}

                {orders.length > 0 && (
                  <span
                    className="badge ms-2"
                    style={
                      filter === option
                        ? {
                            backgroundColor: "#f2e5df",
                            color: "#743d4b",
                          }
                        : {
                            backgroundColor: "#e9dfd5",
                            color: "#6b5148",
                          }
                    }
                  >
                    {option === "All"
                      ? orders.length
                      : orders.filter(
                          (order) =>
                            order.status === option
                        ).length}
                  </span>
                )}
              </button>
            ))}

          </div>
        </div>
      </div>

      {/* NO ORDERS */}
      {orders.length === 0 && (
        <div
          className="card border-0 shadow-sm rounded-4"
          style={{ backgroundColor: "#fffaf5" }}
        >
          <div className="card-body text-center py-5">

            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{
                width: "70px",
                height: "70px",
                backgroundColor: "#f2e5df",
                color: "#743d4b",
              }}
            >
              <i className="bi bi-bag fs-2"></i>
            </div>

            <h5
              className="fw-semibold"
              style={{ color: "#4a2928" }}
            >
              No orders yet
            </h5>

            <p
              className="mb-4"
              style={{ color: "#806b63" }}
            >
              Browse our designs or tell us exactly what
              you have in mind.
            </p>

            <Link
              to="/customer/order-request"
              className="btn px-4"
              style={{
                backgroundColor: "#743d4b",
                color: "#fffaf5",
                border: "none",
                borderRadius: "9px",
              }}
            >
              <i className="bi bi-plus-lg me-2"></i>
              Create Your First Order
            </Link>

          </div>
        </div>
      )}

      {/* ORDERS */}
      {orders.length > 0 && (
        <>
          {visibleOrders.length > 0 ? (
            <div className="row g-3">

              {visibleOrders.map((o) => (
                <div
                  className="col-12 col-md-6 col-xl-4"
                  key={o._id}
                >
                  <Link
                    to={`/customer/orders/${o._id}`}
                    className="text-decoration-none"
                  >
                    <div
                      className="card border-0 shadow-sm rounded-4 h-100"
                      style={{ backgroundColor: "#fffaf5" }}
                    >

                      <div className="card-body p-3 p-md-4">

                        {/* ORDER HEADER */}
                        <div className="d-flex justify-content-between align-items-start gap-2 mb-3">

                          <div>
                            <small
                              className="d-block fw-semibold"
                              style={{
                                color: "#8a5a5a",
                                letterSpacing: "1px",
                              }}
                            >
                              ORDER
                            </small>

                            <h5
                              className="fw-semibold mb-0 mt-1"
                              style={{ color: "#4a2928" }}
                            >
                              #{o.orderNumber}
                            </h5>
                          </div>

                          <span
                            className="badge rounded-pill px-3 py-2 flex-shrink-0"
                            style={{
                              backgroundColor: "#f0e5df",
                              color: "#743d4b",
                              fontWeight: "500",
                            }}
                          >
                            {o.status}
                          </span>

                        </div>

                        {/* ITEMS */}
                        <div
                          className="rounded-3 p-3 mb-3"
                          style={{ backgroundColor: "#f7eee5" }}
                        >

                          <div className="d-flex gap-2">

                            <i
                              className="bi bi-scissors mt-1"
                              style={{ color: "#8a5a5a" }}
                            ></i>

                            <div className="min-w-0">
                              <small
                                className="d-block fw-semibold"
                                style={{
                                  color: "#8a5a5a",
                                  letterSpacing: "0.8px",
                                }}
                              >
                                ORDER DETAILS
                              </small>

                              <span
                                className="text-break"
                                style={{ color: "#5b3733" }}
                              >
                                {o.items || "Custom boutique order"}
                              </span>
                            </div>

                          </div>

                        </div>

                        {/* AMOUNT */}
                        <div className="d-flex justify-content-between align-items-center gap-2">

                          <div>
                            <small
                              className="d-block"
                              style={{ color: "#806b63" }}
                            >
                              TOTAL
                            </small>

                            <strong
                              style={{ color: "#743d4b" }}
                            >
                              Rs.{" "}
                              {Number(
                                o.totalAmount
                              ).toLocaleString("en-IN")}
                            </strong>
                          </div>

                          <span
                            className="btn btn-sm"
                            style={{
                              border: "1px solid #c9aaa5",
                              color: "#743d4b",
                              backgroundColor: "#fffaf5",
                              borderRadius: "8px",
                            }}
                          >
                            View Order
                            <i className="bi bi-arrow-right ms-2"></i>
                          </span>

                        </div>

                      </div>

                    </div>
                  </Link>
                </div>
              ))}

            </div>
          ) : (
            /* NO MATCHING ORDERS */
            <div
              className="card border-0 shadow-sm rounded-4"
              style={{ backgroundColor: "#fffaf5" }}
            >
              <div className="card-body text-center py-5">

                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
                  style={{
                    width: "64px",
                    height: "64px",
                    backgroundColor: "#f2e5df",
                    color: "#743d4b",
                  }}
                >
                  <i className="bi bi-funnel fs-4"></i>
                </div>

                <h5
                  className="fw-semibold mt-3"
                  style={{ color: "#4a2928" }}
                >
                  No matching orders
                </h5>

                <p
                  className="mb-3"
                  style={{ color: "#806b63" }}
                >
                  No orders match the "{filter}" filter.
                </p>

                <button
                  type="button"
                  className="btn"
                  style={{
                    border: "1px solid #c9aaa5",
                    color: "#743d4b",
                    backgroundColor: "#fffaf5",
                    borderRadius: "8px",
                  }}
                  onClick={() => setFilter("All")}
                >
                  Show All Orders
                </button>

              </div>
            </div>
          )}

        </>
      )}

    </div>
  );
}

export default CustomerOrders;