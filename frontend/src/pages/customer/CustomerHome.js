// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import customerApi, { SERVER_URL } from "../../utils/customerApi";

// function CustomerHome() {
//   const [orders, setOrders] = useState([]);
//   const [designs, setDesigns] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     Promise.all([
//       customerApi.get("/customer-portal/orders"),
//       customerApi.get("/customer-portal/designs"),
//     ])
//       .then(([ordersResponse, designsResponse]) => {
//         setOrders(ordersResponse.data);
//         setDesigns(designsResponse.data);
//       })
//       .catch((error) => console.error(error))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading)
//     return <div className="portal-loading">Preparing your BOUTIQ space...</div>;

//   const activeOrders = orders.filter(
//     (order) => !["Delivered", "Cancelled"].includes(order.status),
//   );
//   const latestOrder = orders[0];

//   return (
//     <div className="portal-page">
//       <section className="portal-hero mb-4">
//         <div>
//           <p className="eyebrow mb-2">YOUR PRIVATE FITTING ROOM</p>
//           <h1 className="mb-2">Make something that feels like you.</h1>
//           <p className="mb-0">
//             Explore our details, share your vision, and follow every stitch from
//             request to delivery.
//           </p>
//         </div>
//         <Link
//           to="/customer/order-request"
//           className="btn btn-light portal-hero-action"
//         >
//           Start a new order
//         </Link>
//       </section>

//       <div className="row g-3 mb-4">
//         <div className="col-sm-4">
//           <div className="portal-stat">
//             <span className="portal-stat-label">All orders</span>
//             <strong>{orders.length}</strong>
//             <span>Across your BOUTIQ history</span>
//           </div>
//         </div>
//         <div className="col-sm-4">
//           <div className="portal-stat">
//             <span className="portal-stat-label">In progress</span>
//             <strong>{activeOrders.length}</strong>
//             <span>Pieces moving through the studio</span>
//           </div>
//         </div>
//         <div className="col-sm-4">
//           <div className="portal-stat">
//             <span className="portal-stat-label">Design ideas</span>
//             <strong>{designs.length}</strong>
//             <span>Ready for your next look</span>
//           </div>
//         </div>
//       </div>

//       <div className="row g-4">
//         <div className="col-lg-7">
//           <div className="portal-section-heading">
//             <div>
//               <p className="eyebrow mb-1">YOUR WORKROOM</p>
//               <h2 className="mb-0">Keep an eye on your orders</h2>
//             </div>
//             <Link to="/customer/orders" className="text-dark">
//               View all
//             </Link>
//           </div>
//           {latestOrder ? (
//             <Link
//               to={`/customer/orders/${latestOrder._id}`}
//               className="portal-order-feature text-decoration-none"
//             >
//               <div>
//                 <span className="portal-order-number">
//                   {latestOrder.orderNumber}
//                 </span>
//                 <h3>{latestOrder.items}</h3>
//                 <p className="mb-0">
//                   Last updated{" "}
//                   {new Date(
//                     latestOrder.updatedAt || latestOrder.createdAt,
//                   ).toLocaleDateString()}
//                 </p>
//               </div>
//               <div className="text-end">
//                 <span className="status-pill">{latestOrder.status}</span>
//                 <strong className="d-block mt-3">
//                   Rs. {Number(latestOrder.totalAmount).toLocaleString("en-IN")}
//                 </strong>
//               </div>
//             </Link>
//           ) : (
//             <div className="portal-empty">
//               <h3>Your first piece starts here.</h3>
//               <p>Bring us a reference, a feeling, or a completely new idea.</p>
//               <Link to="/customer/order-request" className="btn btn-dark">
//                 Create an order
//               </Link>
//             </div>
//           )}
//         </div>

//         <div className="col-lg-5">
//           <div className="portal-section-heading">
//             <div>
//               <p className="eyebrow mb-1">QUICK START</p>
//               <h2 className="mb-0">What would you like to do?</h2>
//             </div>
//           </div>
//           <div className="quick-actions">
//             <Link to="/customer/order-request" className="quick-action">
//               <span className="quick-action-mark">01</span>
//               <span>
//                 <strong>Design a new order</strong>
//                 <small>Choose a reference or start from scratch</small>
//               </span>
//             </Link>
//             <Link to="/customer/orders" className="quick-action">
//               <span className="quick-action-mark">02</span>
//               <span>
//                 <strong>Track an order</strong>
//                 <small>See progress, delivery, and payment</small>
//               </span>
//             </Link>
//             <Link to="/customer/profile" className="quick-action">
//               <span className="quick-action-mark">03</span>
//               <span>
//                 <strong>Update your details</strong>
//                 <small>Keep your contact and account details current</small>
//               </span>
//             </Link>
//           </div>
//         </div>
//       </div>

//       {designs.length > 0 && (
//         <section className="mt-5">
//           <div className="portal-section-heading">
//             <div>
//               <p className="eyebrow mb-1">THE EDIT</p>
//               <h2 className="mb-0">A little inspiration</h2>
//             </div>
//             <Link to="/customer/order-request" className="text-dark">
//               Browse all
//             </Link>
//           </div>
//           <div className="row g-3">
//             {designs.slice(0, 3).map((design) => (
//               <div className="col-md-4" key={design._id}>
//                 <Link
//                   to="/customer/order-request"
//                   className="inspiration-tile text-decoration-none"
//                 >
//                   <img
//                     src={`${SERVER_URL}${design.imageUrl}`}
//                     alt={design.caption || "BOUTIQ design"}
//                   />
//                   <div>
//                     <span>{design.caption || "BOUTIQ design"}</span>
//                     <strong>Rs. {design.price}</strong>
//                   </div>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}
//     </div>
//   );
// }

// export default CustomerHome;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import customerApi, { SERVER_URL } from "../../utils/customerApi";

function CustomerHome() {
  const [orders, setOrders] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      customerApi.get("/customer-portal/orders"),
      customerApi.get("/customer-portal/designs"),
    ])
      .then(([ordersResponse, designsResponse]) => {
        setOrders(ordersResponse.data);
        setDesigns(designsResponse.data);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center py-5"
        style={{ minHeight: "60vh" }}
      >
        <div
          className="spinner-border mb-3"
          style={{ color: "#743d4b" }}
        />
        <p
          className="mb-0"
          style={{ color: "#806b63" }}
        >
          Preparing your BOUTIQ space...
        </p>
      </div>
    );
  }

  const activeOrders = orders.filter(
    (order) => !["Delivered", "Cancelled"].includes(order.status)
  );

  const latestOrder = orders[0];

  return (
    <div className="pb-5">

      {/* HERO */}
      <div
        className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden"
        style={{
          backgroundColor: "#f4e6df",
          color: "#4a2928",
        }}
      >
        <div className="card-body p-4 p-md-5">
          <div className="row align-items-center">

            <div className="col-12 col-lg-8">
              <span
                className="badge rounded-pill mb-3 px-3 py-2"
                style={{
                  backgroundColor: "#fffaf5",
                  color: "#743d4b",
                  fontWeight: "500",
                }}
              >
                YOUR PRIVATE FITTING ROOM
              </span>

              <h1
                className="fw-semibold mb-3"
                style={{
                  color: "#4a2928",
                  fontSize: "clamp(2rem, 5vw, 3.4rem)",
                  lineHeight: "1.15",
                }}
              >
                Make something
                <br className="d-none d-md-block" />
                that feels like you.
              </h1>

              <p
                className="mb-4"
                style={{
                  color: "#765b56",
                  maxWidth: "620px",
                  lineHeight: "1.7",
                }}
              >
                Explore our designs, share your vision, and follow every
                stitch from request to delivery.
              </p>

              <Link
                to="/customer/order-request"
                className="btn px-4 py-2"
                style={{
                  backgroundColor: "#743d4b",
                  color: "#fffaf5",
                  border: "none",
                  borderRadius: "10px",
                }}
              >
                <i className="bi bi-plus-lg me-2"></i>
                Start a new order
              </Link>
            </div>

            <div className="col-lg-4 d-none d-lg-flex justify-content-end">
              <div
                className="text-center"
                style={{ color: "#9a6f72" }}
              >
                <i
                  className="bi bi-scissors"
                  style={{ fontSize: "100px" }}
                ></i>

                <div
                  className="small mt-2"
                  style={{ color: "#765b56" }}
                >
                  Crafted especially for you
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="row g-3 mb-4">

        {/* ALL ORDERS */}
        <div className="col-12 col-sm-4">
          <div
            className="card border-0 shadow-sm rounded-4 h-100"
            style={{ backgroundColor: "#faf4ee" }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">

                <div>
                  <small
                    className="fw-semibold"
                    style={{
                      color: "#8a5a5a",
                      letterSpacing: "1px",
                    }}
                  >
                    ALL ORDERS
                  </small>

                  <h2
                    className="fw-semibold mt-2 mb-1"
                    style={{ color: "#4a2928" }}
                  >
                    {orders.length}
                  </h2>

                  <small style={{ color: "#806b63" }}>
                    Across your BOUTIQ history
                  </small>
                </div>

                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "46px",
                    height: "46px",
                    backgroundColor: "#ead7d0",
                    color: "#743d4b",
                  }}
                >
                  <i className="bi bi-bag-heart fs-5"></i>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* IN PROGRESS */}
        <div className="col-12 col-sm-4">
          <div
            className="card border-0 shadow-sm rounded-4 h-100"
            style={{ backgroundColor: "#f0f2e9" }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">

                <div>
                  <small
                    className="fw-semibold"
                    style={{
                      color: "#68705b",
                      letterSpacing: "1px",
                    }}
                  >
                    IN PROGRESS
                  </small>

                  <h2
                    className="fw-semibold mt-2 mb-1"
                    style={{ color: "#4a2928" }}
                  >
                    {activeOrders.length}
                  </h2>

                  <small style={{ color: "#806b63" }}>
                    Pieces moving through the studio
                  </small>
                </div>

                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "46px",
                    height: "46px",
                    backgroundColor: "#dfe7d7",
                    color: "#68705b",
                  }}
                >
                  <i className="bi bi-hourglass-split fs-5"></i>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* DESIGN IDEAS */}
        <div className="col-12 col-sm-4">
          <div
            className="card border-0 shadow-sm rounded-4 h-100"
            style={{ backgroundColor: "#f3e9eb" }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">

                <div>
                  <small
                    className="fw-semibold"
                    style={{
                      color: "#8a5a5a",
                      letterSpacing: "1px",
                    }}
                  >
                    DESIGN IDEAS
                  </small>

                  <h2
                    className="fw-semibold mt-2 mb-1"
                    style={{ color: "#4a2928" }}
                  >
                    {designs.length}
                  </h2>

                  <small style={{ color: "#806b63" }}>
                    Ready for your next look
                  </small>
                </div>

                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "46px",
                    height: "46px",
                    backgroundColor: "#ead7d0",
                    color: "#743d4b",
                  }}
                >
                  <i className="bi bi-stars fs-5"></i>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ORDER + QUICK ACTIONS */}
      <div className="row g-4">

        {/* LATEST ORDER */}
        <div className="col-12 col-lg-7">

          <div className="d-flex justify-content-between align-items-end mb-3">
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

              <h4
                className="fw-semibold mb-0 mt-1"
                style={{ color: "#4a2928" }}
              >
                Keep an eye on your orders
              </h4>
            </div>

            <Link
              to="/customer/orders"
              className="text-decoration-none small"
              style={{ color: "#743d4b" }}
            >
              View all →
            </Link>
          </div>

          {latestOrder ? (
            <Link
              to={`/customer/orders/${latestOrder._id}`}
              className="text-decoration-none"
            >
              <div
                className="card border-0 shadow-sm rounded-4 h-100"
                style={{ backgroundColor: "#fffaf5" }}
              >
                <div className="card-body p-4">

                  <div className="d-flex justify-content-between align-items-start gap-3">

                    <div className="min-w-0">
                      <span
                        className="badge rounded-pill mb-3 px-3 py-2"
                        style={{
                          backgroundColor: "#f2e5df",
                          color: "#743d4b",
                          fontWeight: "500",
                        }}
                      >
                        {latestOrder.orderNumber}
                      </span>

                      <h4
                        className="fw-semibold text-break"
                        style={{ color: "#4a2928" }}
                      >
                        {latestOrder.items}
                      </h4>

                      <p
                        className="mb-0 small"
                        style={{ color: "#806b63" }}
                      >
                        Last updated{" "}
                        {new Date(
                          latestOrder.updatedAt ||
                            latestOrder.createdAt
                        ).toLocaleDateString("en-IN")}
                      </p>
                    </div>

                    <span
                      className="badge rounded-pill px-3 py-2 flex-shrink-0"
                      style={{
                        backgroundColor: "#eee5df",
                        color: "#6b5148",
                        fontWeight: "500",
                      }}
                    >
                      {latestOrder.status}
                    </span>

                  </div>

                  <hr style={{ borderColor: "#eaded6" }} />

                  <div className="d-flex justify-content-between align-items-center">
                    <span
                      className="small"
                      style={{ color: "#806b63" }}
                    >
                      Order total
                    </span>

                    <strong
                      className="fs-5"
                      style={{ color: "#743d4b" }}
                    >
                      ₹{" "}
                      {Number(
                        latestOrder.totalAmount
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>

                </div>
              </div>
            </Link>
          ) : (
            <div
              className="card border-0 shadow-sm rounded-4"
              style={{ backgroundColor: "#fffaf5" }}
            >
              <div className="card-body text-center py-5">

                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center"
                  style={{
                    width: "64px",
                    height: "64px",
                    backgroundColor: "#f2e5df",
                    color: "#743d4b",
                  }}
                >
                  <i className="bi bi-bag-plus fs-3"></i>
                </div>

                <h4
                  className="mt-3"
                  style={{ color: "#4a2928" }}
                >
                  Your first piece starts here.
                </h4>

                <p style={{ color: "#806b63" }}>
                  Bring us a reference, a feeling, or a completely
                  new idea.
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
                  Create an order
                </Link>

              </div>
            </div>
          )}

        </div>

        {/* QUICK ACTIONS */}
        <div className="col-12 col-lg-5">

          <div className="mb-3">
            <small
              className="fw-semibold"
              style={{
                color: "#8a5a5a",
                letterSpacing: "1.2px",
              }}
            >
              QUICK START
            </small>

            <h4
              className="fw-semibold mb-0 mt-1"
              style={{ color: "#4a2928" }}
            >
              What would you like to do?
            </h4>
          </div>

          <div className="d-grid gap-3">

            {/* NEW ORDER */}
            <Link
              to="/customer/order-request"
              className="card border-0 shadow-sm rounded-4 text-decoration-none"
              style={{ backgroundColor: "#f8eee9" }}
            >
              <div className="card-body p-3 d-flex align-items-center gap-3">

                <div
                  className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "#ead7d0",
                    color: "#743d4b",
                  }}
                >
                  <i className="bi bi-pencil-square fs-5"></i>
                </div>

                <div>
                  <strong
                    className="d-block"
                    style={{ color: "#4a2928" }}
                  >
                    Design a new order
                  </strong>

                  <small style={{ color: "#806b63" }}>
                    Choose a reference or start from scratch
                  </small>
                </div>

                <i
                  className="bi bi-chevron-right ms-auto"
                  style={{ color: "#9a7772" }}
                ></i>

              </div>
            </Link>

            {/* TRACK ORDER */}
            <Link
              to="/customer/orders"
              className="card border-0 shadow-sm rounded-4 text-decoration-none"
              style={{ backgroundColor: "#f1f2ea" }}
            >
              <div className="card-body p-3 d-flex align-items-center gap-3">

                <div
                  className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "#dfe7d7",
                    color: "#68705b",
                  }}
                >
                  <i className="bi bi-truck fs-5"></i>
                </div>

                <div>
                  <strong
                    className="d-block"
                    style={{ color: "#4a2928" }}
                  >
                    Track an order
                  </strong>

                  <small style={{ color: "#806b63" }}>
                    See progress, delivery, and payment
                  </small>
                </div>

                <i
                  className="bi bi-chevron-right ms-auto"
                  style={{ color: "#9a7772" }}
                ></i>

              </div>
            </Link>

            {/* PROFILE */}
            <Link
              to="/customer/profile"
              className="card border-0 shadow-sm rounded-4 text-decoration-none"
              style={{ backgroundColor: "#f5eee7" }}
            >
              <div className="card-body p-3 d-flex align-items-center gap-3">

                <div
                  className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "#e9dfd5",
                    color: "#743d4b",
                  }}
                >
                  <i className="bi bi-person fs-5"></i>
                </div>

                <div>
                  <strong
                    className="d-block"
                    style={{ color: "#4a2928" }}
                  >
                    Update your details
                  </strong>

                  <small style={{ color: "#806b63" }}>
                    Keep your contact and account details current
                  </small>
                </div>

                <i
                  className="bi bi-chevron-right ms-auto"
                  style={{ color: "#9a7772" }}
                ></i>

              </div>
            </Link>

          </div>
        </div>

      </div>

      {/* INSPIRATION */}
      {designs.length > 0 && (
        <section className="mt-5">

          <div className="d-flex justify-content-between align-items-end mb-3">
            <div>
              <small
                className="fw-semibold"
                style={{
                  color: "#8a5a5a",
                  letterSpacing: "1.2px",
                }}
              >
                THE EDIT
              </small>

              <h4
                className="fw-semibold mb-0 mt-1"
                style={{ color: "#4a2928" }}
              >
                A little inspiration
              </h4>
            </div>

            <Link
              to="/customer/order-request"
              className="text-decoration-none small"
              style={{ color: "#743d4b" }}
            >
              Browse all →
            </Link>
          </div>

          <div className="row g-3">

            {designs.slice(0, 3).map((design) => (
              <div
                className="col-12 col-sm-6 col-md-4"
                key={design._id}
              >
                <Link
                  to="/customer/order-request"
                  className="card border-0 shadow-sm rounded-4 overflow-hidden text-decoration-none h-100"
                  style={{ backgroundColor: "#fffaf5" }}
                >

                  <img
                    src={`${SERVER_URL}${design.imageUrl}`}
                    alt={design.caption || "BOUTIQ design"}
                    className="w-100"
                    style={{
                      height: "260px",
                      objectFit: "cover",
                    }}
                  />

                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center gap-2">

                      <span
                        className="fw-semibold text-break"
                        style={{ color: "#4a2928" }}
                      >
                        {design.caption || "BOUTIQ design"}
                      </span>

                      <strong
                        className="text-nowrap"
                        style={{ color: "#743d4b" }}
                      >
                        ₹ {design.price}
                      </strong>

                    </div>
                  </div>

                </Link>
              </div>
            ))}

          </div>
        </section>
      )}

    </div>
  );
}

export default CustomerHome;