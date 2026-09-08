// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import customerApi, { SERVER_URL } from "../../utils/customerApi";
// import { useCustomerAuth } from "../../context/CustomerAuthContext";

// // Loads Razorpay's checkout script only when it's actually needed
// function loadRazorpayScript() {
//   return new Promise((resolve) => {
//     if (window.Razorpay) {
//       resolve(true);
//       return;
//     }
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);
//     document.body.appendChild(script);
//   });
// }

// function CustomerOrderDetail() {
//   const { id } = useParams();
//   const { customer } = useCustomerAuth();

//   const [order, setOrder] = useState(null);
//   const [delivery, setDelivery] = useState(null);
//   const [images, setImages] = useState([]);
//   const [payments, setPayments] = useState([]);
//   const [gatewayAvailable, setGatewayAvailable] = useState(true);

//   const [payAmount, setPayAmount] = useState("");
//   const [paying, setPaying] = useState(false);
//   const [payMessage, setPayMessage] = useState("");
//   const [payError, setPayError] = useState("");
//   const [receipt, setReceipt] = useState(null);

//   useEffect(() => {
//     fetchAll();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const fetchAll = async () => {
//     try {
//       const [orderRes, deliveryRes, imageRes, paymentRes, statusRes] =
//         await Promise.all([
//           customerApi.get(`/customer-portal/orders/${id}`),
//           customerApi.get(`/customer-portal/orders/${id}/delivery`),
//           customerApi.get(`/customer-portal/orders/${id}/designs`),
//           customerApi.get(`/customer-portal/orders/${id}/payments`),
//           customerApi.get("/customer-portal/payments/status"),
//         ]);

//       setOrder(orderRes.data);
//       setDelivery(deliveryRes.data);
//       setImages(imageRes.data);
//       setPayments(paymentRes.data);
//       setGatewayAvailable(statusRes.data.available);

//       const paidSoFar = paymentRes.data.reduce((sum, p) => sum + p.amount, 0);
//       const balance = orderRes.data.totalAmount - paidSoFar;
//       setPayAmount(balance > 0 ? String(balance) : "");
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handlePayNow = async (e) => {
//     e.preventDefault();
//     setPayError("");
//     setPayMessage("");
//     setPaying(true);

//     try {
//       const scriptLoaded = await loadRazorpayScript();
//       if (!scriptLoaded) {
//         setPayError(
//           "Could not load the payment window. Check your connection and try again.",
//         );
//         setPaying(false);
//         return;
//       }

//       const { data } = await customerApi.post(
//         "/customer-portal/payments/create-order",
//         {
//           orderId: id,
//           amount: Number(payAmount),
//         },
//       );

//       const options = {
//         key: data.keyId,
//         amount: data.amount,
//         currency: data.currency,
//         name: "BOUTIQ",
//         description: `Payment for order ${order.orderNumber}`,
//         order_id: data.razorpayOrderId,
//         handler: async function (response) {
//           try {
//             const { data: verification } = await customerApi.post(
//               "/customer-portal/payments/verify",
//               {
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//                 orderId: id,
//               },
//             );
//             setReceipt(verification.payment);
//             setPayMessage("Payment successful! Thank you.");
//             fetchAll();
//           } catch (verifyError) {
//             setPayError(
//               "Payment could not be verified. Please contact the shop if money was deducted.",
//             );
//           }
//         },
//         prefill: {
//           name: customer ? customer.name : "",
//           contact: customer ? customer.phone : "",
//           email: customer && customer.email ? customer.email : "",
//         },
//         theme: { color: "#2b2233" },
//         modal: {
//           ondismiss: function () {
//             setPaying(false);
//           },
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.on("payment.failed", function () {
//         setPayError("Payment failed. Please try again.");
//         setPaying(false);
//       });
//       rzp.open();
//       setPaying(false);
//     } catch (error) {
//       setPayError(
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//           "Could not start payment",
//       );
//       setPaying(false);
//     }
//   };

//   if (!order) return <p>Loading...</p>;

//   const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
//   const balance = order.totalAmount - totalPaid;

//   return (
//     <div>
//       <Link
//         to="/customer/orders"
//         className="btn btn-sm btn-outline-secondary mb-3"
//       >
//         Back to My Orders
//       </Link>

//       <div className="card p-3 shadow-sm mb-4">
//         <div className="d-flex justify-content-between align-items-start">
//           <h4>{order.orderNumber}</h4>
//           <span className="badge bg-secondary">{order.status}</span>
//         </div>
//         <p className="mb-1">Items: {order.items}</p>
//         <p className="mb-1">Total Amount: Rs. {order.totalAmount}</p>
//         <p className="mb-0">
//           Paid: Rs. {totalPaid} | Balance: Rs. {balance}
//         </p>
//       </div>

//       <div className="card p-3 shadow-sm mb-4">
//         <h5>Order progress</h5>
//         <div className="order-timeline mt-3">
//           {(order.statusHistory || [])
//             .slice()
//             .reverse()
//             .map((event, index) => (
//               <div
//                 className="order-timeline-item"
//                 key={`${event.status}-${event.createdAt}-${index}`}
//               >
//                 <span className="order-timeline-dot" />
//                 <div>
//                   <strong>{event.status}</strong>
//                   <span className="text-muted ms-2 small">
//                     {event.createdAt
//                       ? new Date(event.createdAt).toLocaleString()
//                       : ""}
//                   </span>
//                   <p className="mb-0 text-muted small">
//                     {event.note || "Status updated"}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           {(!order.statusHistory || order.statusHistory.length === 0) && (
//             <p className="text-muted mb-0">
//               Progress updates will appear here.
//             </p>
//           )}
//         </div>
//       </div>

//       {delivery && (
//         <div className="card p-3 shadow-sm mb-4">
//           <h5>Delivery</h5>
//           <p className="mb-1">
//             Status:{" "}
//             <span className="badge bg-info text-dark">{delivery.status}</span>
//           </p>
//           {delivery.scheduledDate && (
//             <p className="mb-1">
//               Scheduled: {new Date(delivery.scheduledDate).toLocaleDateString()}
//             </p>
//           )}
//           {delivery.deliveryAddress && (
//             <p className="mb-0">Address: {delivery.deliveryAddress}</p>
//           )}
//         </div>
//       )}

//       <div className="card p-3 shadow-sm mb-4">
//         <h5>Payment</h5>

//         {payMessage && (
//           <div className="alert alert-success py-2">{payMessage}</div>
//         )}
//         {payError && <div className="alert alert-danger py-2">{payError}</div>}

//         {balance <= 0 ? (
//           <p className="text-success mb-0">
//             This order is fully paid. Thank you!
//           </p>
//         ) : gatewayAvailable ? (
//           <form
//             onSubmit={handlePayNow}
//             className="d-flex gap-2"
//             style={{ maxWidth: "350px" }}
//           >
//             <input
//               type="number"
//               className="form-control"
//               value={payAmount}
//               onChange={(e) => setPayAmount(e.target.value)}
//               min="1"
//               max={balance}
//               required
//             />
//             <button
//               type="submit"
//               className="btn btn-dark text-nowrap"
//               disabled={paying}
//             >
//               {paying ? "Please wait..." : `Pay Rs. ${payAmount || 0}`}
//             </button>
//           </form>
//         ) : (
//           <p className="text-muted mb-0">
//             Online payment isn't set up yet. Please pay Rs. {balance} directly
//             at the shop (cash, UPI or card).
//           </p>
//         )}

//         <ul className="list-group mt-3">
//           {payments.map((p) => (
//             <li
//               key={p._id}
//               className="list-group-item d-flex justify-content-between"
//             >
//               <span>
//                 Rs. {p.amount} - {p.method}
//                 <small className="d-block text-muted">
//                   Receipt: {p.receiptNumber || p._id}
//                 </small>
//               </span>
//               <span className="text-muted">
//                 {new Date(p.paymentDate).toLocaleDateString()}
//               </span>
//             </li>
//           ))}
//           {payments.length === 0 && (
//             <li className="list-group-item text-muted">
//               No payments recorded yet
//             </li>
//           )}
//         </ul>
//       </div>

//       {receipt && (
//         <div className="receipt-card mb-4" id="payment-receipt">
//           <div className="d-flex justify-content-between align-items-start gap-3">
//             <div>
//               <p className="eyebrow mb-1">PAYMENT RECEIPT</p>
//               <h4 className="mb-1">BOUTIQ</h4>
//               <p className="text-muted mb-0">Thank you for your payment.</p>
//             </div>
//             <button
//               type="button"
//               className="btn btn-sm btn-outline-dark receipt-print-button"
//               onClick={() => window.print()}
//             >
//               Print receipt
//             </button>
//           </div>
//           <div className="receipt-rule" />
//           <div className="row g-3 small">
//             <div className="col-6">
//               <span className="text-muted d-block">Receipt number</span>
//               <strong>{receipt.receiptNumber || receipt._id}</strong>
//             </div>
//             <div className="col-6">
//               <span className="text-muted d-block">Payment date</span>
//               <strong>
//                 {new Date(
//                   receipt.paymentDate || receipt.createdAt,
//                 ).toLocaleString()}
//               </strong>
//             </div>
//             <div className="col-6">
//               <span className="text-muted d-block">Order</span>
//               <strong>{order.orderNumber}</strong>
//             </div>
//             <div className="col-6">
//               <span className="text-muted d-block">Method</span>
//               <strong>{receipt.method}</strong>
//             </div>
//             <div className="col-12">
//               <span className="text-muted d-block">Amount paid</span>
//               <strong className="receipt-amount">
//                 Rs. {Number(receipt.amount).toLocaleString("en-IN")}
//               </strong>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="card p-3 shadow-sm">
//         <h5>Design / Reference Images</h5>
//         <div className="row g-3 mt-2">
//           {images.map((img) => (
//             <div className="col-md-3" key={img._id}>
//               <img
//                 src={`${SERVER_URL}${img.imageUrl}`}
//                 alt={img.caption || "design reference"}
//                 className="img-fluid rounded"
//               />
//             </div>
//           ))}
//           {images.length === 0 && (
//             <p className="text-muted">No images uploaded for this order yet</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CustomerOrderDetail;

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import customerApi, { SERVER_URL } from "../../utils/customerApi";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

// Loads Razorpay's checkout script only when it's actually needed
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function CustomerOrderDetail() {
  const { id } = useParams();
  const { customer } = useCustomerAuth();

  const [order, setOrder] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [images, setImages] = useState([]);
  const [payments, setPayments] = useState([]);
  const [gatewayAvailable, setGatewayAvailable] = useState(true);

  const [payAmount, setPayAmount] = useState("");
  const [paying, setPaying] = useState(false);
  const [payMessage, setPayMessage] = useState("");
  const [payError, setPayError] = useState("");
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchAll = async () => {
    try {
      const [orderRes, deliveryRes, imageRes, paymentRes, statusRes] =
        await Promise.all([
          customerApi.get(`/customer-portal/orders/${id}`),
          customerApi.get(`/customer-portal/orders/${id}/delivery`),
          customerApi.get(`/customer-portal/orders/${id}/designs`),
          customerApi.get(`/customer-portal/orders/${id}/payments`),
          customerApi.get("/customer-portal/payments/status"),
        ]);

      setOrder(orderRes.data);
      setDelivery(deliveryRes.data);
      setImages(imageRes.data);
      setPayments(paymentRes.data);
      setGatewayAvailable(statusRes.data.available);

      const paidSoFar = paymentRes.data.reduce(
        (sum, p) => sum + Number(p.amount),
        0,
      );

      const balance = orderRes.data.totalAmount - paidSoFar;

      setPayAmount(balance > 0 ? String(balance) : "");
    } catch (error) {
      console.error(error);
    }
  };

  const handlePayNow = async (e) => {
    e.preventDefault();
    setPayError("");
    setPayMessage("");
    setPaying(true);

    try {
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        setPayError(
          "Could not load the payment window. Check your connection and try again.",
        );
        setPaying(false);
        return;
      }

      const { data } = await customerApi.post(
        "/customer-portal/payments/create-order",
        {
          orderId: id,
          amount: Number(payAmount),
        },
      );

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "BOUTIQ",
        description: `Payment for order ${order.orderNumber}`,
        order_id: data.razorpayOrderId,

        handler: async function (response) {
          try {
            const { data: verification } = await customerApi.post(
              "/customer-portal/payments/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: id,
              },
            );

            setReceipt(verification.payment);
            setPayMessage("Payment successful! Thank you.");
            fetchAll();
          } catch (verifyError) {
            setPayError(
              "Payment could not be verified. Please contact the shop if money was deducted.",
            );
          }
        },

        prefill: {
          name: customer ? customer.name : "",
          contact: customer ? customer.phone : "",
          email: customer && customer.email ? customer.email : "",
        },

        theme: {
          color: "#743d4b",
        },

        modal: {
          ondismiss: function () {
            setPaying(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function () {
        setPayError("Payment failed. Please try again.");
        setPaying(false);
      });

      rzp.open();
      setPaying(false);
    } catch (error) {
      setPayError(
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
          "Could not start payment",
      );

      setPaying(false);
    }
  };

  if (!order) {
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
          Loading your order...
        </p>
      </div>
    );
  }

  const totalPaid = payments.reduce(
    (sum, p) => sum + Number(p.amount),
    0,
  );

  const balance = order.totalAmount - totalPaid;

  return (
    <div className="container-fluid px-2 px-md-4 py-3 py-md-4 pb-5">

      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

        <div>
          <Link
            to="/customer/orders"
            className="btn btn-sm mb-3"
            style={{
              backgroundColor: "#f5eee7",
              color: "#743d4b",
              border: "1px solid #dfcbc3",
              borderRadius: "8px",
            }}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Back to My Orders
          </Link>

          <h2
            className="fw-semibold mb-1"
            style={{ color: "#4a2928" }}
          >
            Order #{order.orderNumber}
          </h2>

          <p
            className="mb-0"
            style={{ color: "#806b63" }}
          >
            View your order details, progress and payments
          </p>
        </div>

        <span
          className="badge rounded-pill px-3 py-2 align-self-start align-self-md-center"
          style={{
            backgroundColor: "#ead7d0",
            color: "#743d4b",
            fontWeight: "500",
            fontSize: "0.9rem",
          }}
        >
          {order.status}
        </span>

      </div>

      {/* ORDER SUMMARY */}
      <div
        className="card border-0 shadow-sm rounded-4 mb-4"
        style={{ backgroundColor: "#fffaf5" }}
      >
        <div className="card-body p-3 p-md-4">

          <div className="d-flex align-items-center gap-3 mb-4">

            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: "44px",
                height: "44px",
                backgroundColor: "#f2e5df",
                color: "#743d4b",
              }}
            >
              <i className="bi bi-bag-check fs-5"></i>
            </div>

            <div>
              <h5
                className="fw-semibold mb-0"
                style={{ color: "#4a2928" }}
              >
                Order Summary
              </h5>

              <small style={{ color: "#806b63" }}>
                Your boutique order details
              </small>
            </div>

          </div>

          <div className="row g-3">

            {/* ITEMS */}
            <div className="col-12 col-md-6 col-xl-3">
              <div
                className="rounded-3 p-3 h-100"
                style={{ backgroundColor: "#f7eee5" }}
              >
                <small
                  className="d-block mb-1 fw-semibold"
                  style={{
                    color: "#8a5a5a",
                    letterSpacing: "0.8px",
                  }}
                >
                  ORDER ITEMS
                </small>

                <strong
                  className="text-break"
                  style={{ color: "#5b3733" }}
                >
                  {order.items || "—"}
                </strong>
              </div>
            </div>

            {/* TOTAL */}
            <div className="col-12 col-md-6 col-xl-3">
              <div
                className="rounded-3 p-3 h-100"
                style={{ backgroundColor: "#f5eee7" }}
              >
                <small
                  className="d-block mb-1 fw-semibold"
                  style={{
                    color: "#806b63",
                    letterSpacing: "0.8px",
                  }}
                >
                  TOTAL AMOUNT
                </small>

                <strong style={{ color: "#4a2928" }}>
                  Rs.{" "}
                  {Number(order.totalAmount).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            {/* PAID */}
            <div className="col-12 col-md-6 col-xl-3">
              <div
                className="rounded-3 p-3 h-100"
                style={{ backgroundColor: "#e8eee4" }}
              >
                <small
                  className="d-block mb-1 fw-semibold"
                  style={{
                    color: "#68705b",
                    letterSpacing: "0.8px",
                  }}
                >
                  PAID
                </small>

                <strong style={{ color: "#52614c" }}>
                  Rs. {totalPaid.toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            {/* BALANCE */}
            <div className="col-12 col-md-6 col-xl-3">
              <div
                className="rounded-3 p-3 h-100"
                style={{
                  backgroundColor:
                    balance > 0 ? "#f3e4df" : "#e8eee4",
                }}
              >
                <small
                  className="d-block mb-1 fw-semibold"
                  style={{
                    color:
                      balance > 0 ? "#8a5a5a" : "#68705b",
                    letterSpacing: "0.8px",
                  }}
                >
                  BALANCE
                </small>

                <strong
                  style={{
                    color:
                      balance > 0 ? "#743d4b" : "#52614c",
                  }}
                >
                  Rs. {balance.toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ORDER PROGRESS */}
      <div
        className="card border-0 shadow-sm rounded-4 mb-4"
        style={{ backgroundColor: "#fffaf5" }}
      >
        <div className="card-body p-3 p-md-4">

          <div className="d-flex align-items-center gap-3 mb-4">

            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: "44px",
                height: "44px",
                backgroundColor: "#f2e5df",
                color: "#743d4b",
              }}
            >
              <i className="bi bi-clock-history fs-5"></i>
            </div>

            <div>
              <h5
                className="fw-semibold mb-0"
                style={{ color: "#4a2928" }}
              >
                Order Progress
              </h5>

              <small style={{ color: "#806b63" }}>
                Follow the progress of your order
              </small>
            </div>

          </div>

          {(order.statusHistory || []).length > 0 ? (
            <div className="list-group list-group-flush">

              {(order.statusHistory || [])
                .slice()
                .reverse()
                .map((event, index) => (
                  <div
                    className="list-group-item px-0 py-3 border-0 border-bottom"
                    style={{ backgroundColor: "transparent" }}
                    key={`${event.status}-${event.createdAt}-${index}`}
                  >
                    <div className="d-flex gap-3">

                      <div className="flex-shrink-0">
                        <span
                          className="d-flex align-items-center justify-content-center rounded-circle"
                          style={{
                            width: "38px",
                            height: "38px",
                            backgroundColor:
                              index === 0
                                ? "#743d4b"
                                : "#f2e5df",
                            color:
                              index === 0
                                ? "#fffaf5"
                                : "#8a5a5a",
                          }}
                        >
                          <i
                            className={
                              index === 0
                                ? "bi bi-check-lg"
                                : "bi bi-circle"
                            }
                          ></i>
                        </span>
                      </div>

                      <div className="flex-grow-1">

                        <div className="d-flex flex-column flex-md-row justify-content-between gap-1">

                          <strong style={{ color: "#4a2928" }}>
                            {event.status}
                          </strong>

                          <small style={{ color: "#806b63" }}>
                            {event.createdAt
                              ? new Date(
                                  event.createdAt,
                                ).toLocaleString()
                              : ""}
                          </small>

                        </div>

                        <p
                          className="small mb-0 mt-1"
                          style={{ color: "#806b63" }}
                        >
                          {event.note || "Status updated"}
                        </p>

                      </div>

                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-4">

              <div
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
                style={{
                  width: "62px",
                  height: "62px",
                  backgroundColor: "#f2e5df",
                  color: "#743d4b",
                }}
              >
                <i className="bi bi-clock fs-4"></i>
              </div>

              <p
                className="mb-0 mt-3"
                style={{ color: "#806b63" }}
              >
                Progress updates will appear here.
              </p>

            </div>
          )}

        </div>
      </div>

      {/* DELIVERY */}
      {delivery && (
        <div
          className="card border-0 shadow-sm rounded-4 mb-4"
          style={{ backgroundColor: "#fffaf5" }}
        >
          <div className="card-body p-3 p-md-4">

            <div className="d-flex align-items-center gap-3 mb-4">

              <div
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: "44px",
                  height: "44px",
                  backgroundColor: "#e3eee0",
                  color: "#68705b",
                }}
              >
                <i className="bi bi-truck fs-5"></i>
              </div>

              <div>
                <h5
                  className="fw-semibold mb-0"
                  style={{ color: "#4a2928" }}
                >
                  Delivery
                </h5>

                <small style={{ color: "#806b63" }}>
                  Delivery information for your order
                </small>
              </div>

            </div>

            <div className="row g-3">

              {/* DELIVERY STATUS */}
              <div className="col-12 col-md-6">
                <div
                  className="rounded-3 p-3 h-100"
                  style={{ backgroundColor: "#f1f2ea" }}
                >
                  <small
                    className="d-block mb-2 fw-semibold"
                    style={{
                      color: "#68705b",
                      letterSpacing: "0.8px",
                    }}
                  >
                    DELIVERY STATUS
                  </small>

                  <span
                    className="badge rounded-pill px-3 py-2"
                    style={{
                      backgroundColor: "#dfe7d7",
                      color: "#52614c",
                      fontWeight: "500",
                    }}
                  >
                    {delivery.status}
                  </span>
                </div>
              </div>

              {/* DATE */}
              {delivery.scheduledDate && (
                <div className="col-12 col-md-6">
                  <div
                    className="rounded-3 p-3 h-100"
                    style={{ backgroundColor: "#f5eee7" }}
                  >
                    <small
                      className="d-block mb-1 fw-semibold"
                      style={{
                        color: "#806b63",
                        letterSpacing: "0.8px",
                      }}
                    >
                      SCHEDULED DATE
                    </small>

                    <strong style={{ color: "#4a2928" }}>
                      {new Date(
                        delivery.scheduledDate,
                      ).toLocaleDateString()}
                    </strong>
                  </div>
                </div>
              )}

              {/* ADDRESS */}
              {delivery.deliveryAddress && (
                <div className="col-12">
                  <div
                    className="rounded-3 p-3"
                    style={{ backgroundColor: "#f7eee5" }}
                  >
                    <small
                      className="d-block mb-1 fw-semibold"
                      style={{
                        color: "#8a5a5a",
                        letterSpacing: "0.8px",
                      }}
                    >
                      DELIVERY ADDRESS
                    </small>

                    <div
                      className="d-flex gap-2"
                      style={{ color: "#5b3733" }}
                    >
                      <i className="bi bi-geo-alt"></i>
                      <span>{delivery.deliveryAddress}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* PAYMENT */}
      <div
        className="card border-0 shadow-sm rounded-4 mb-4"
        style={{ backgroundColor: "#fffaf5" }}
      >
        <div className="card-body p-3 p-md-4">

          <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">

            <div className="d-flex align-items-center gap-3">

              <div
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: "44px",
                  height: "44px",
                  backgroundColor: "#f2e5df",
                  color: "#743d4b",
                }}
              >
                <i className="bi bi-credit-card fs-5"></i>
              </div>

              <div>
                <h5
                  className="fw-semibold mb-0"
                  style={{ color: "#4a2928" }}
                >
                  Payment
                </h5>

                <small style={{ color: "#806b63" }}>
                  Manage your order payment
                </small>
              </div>

            </div>

            <div className="text-md-end">
              <small
                className="d-block"
                style={{ color: "#806b63" }}
              >
                Remaining Balance
              </small>

              <strong
                className="fs-5"
                style={{ color: "#743d4b" }}
              >
                Rs. {balance.toLocaleString("en-IN")}
              </strong>
            </div>

          </div>

          {/* MESSAGES */}
          {payMessage && (
            <div
              className="alert d-flex align-items-center gap-2 border-0"
              style={{
                backgroundColor: "#e8eee4",
                color: "#52614c",
              }}
            >
              <i className="bi bi-check-circle-fill"></i>
              <span>{payMessage}</span>
            </div>
          )}

          {payError && (
            <div
              className="alert d-flex align-items-center gap-2 border-0"
              style={{
                backgroundColor: "#f3dfdb",
                color: "#7b4a46",
              }}
            >
              <i className="bi bi-exclamation-circle-fill"></i>
              <span>{payError}</span>
            </div>
          )}

          {/* PAYMENT ACTION */}
          {balance <= 0 ? (
            <div
              className="alert mb-0 border-0"
              style={{
                backgroundColor: "#e8eee4",
                color: "#52614c",
              }}
            >
              <div className="d-flex align-items-center gap-2">

                <i className="bi bi-check-circle-fill fs-5"></i>

                <div>
                  <strong>Order fully paid</strong>

                  <div className="small">
                    This order has no remaining balance. Thank you!
                  </div>
                </div>

              </div>
            </div>
          ) : gatewayAvailable ? (
            <div
              className="rounded-3 p-3 p-md-4 mb-4"
              style={{ backgroundColor: "#f7eee5" }}
            >

              <h6
                className="fw-semibold mb-3"
                style={{ color: "#4a2928" }}
              >
                Make a payment
              </h6>

              <form
                onSubmit={handlePayNow}
                className="row g-3 align-items-end"
              >
                <div className="col-12 col-sm-6 col-md-5">

                  <label
                    className="form-label small fw-semibold"
                    style={{ color: "#5b3733" }}
                  >
                    Payment Amount
                  </label>

                  <div className="input-group">

                    <span
                      className="input-group-text"
                      style={{
                        backgroundColor: "#fffaf5",
                        borderColor: "#dfcbc3",
                        color: "#743d4b",
                      }}
                    >
                      Rs.
                    </span>

                    <input
                      type="number"
                      className="form-control"
                      style={{
                        backgroundColor: "#fffaf5",
                        borderColor: "#dfcbc3",
                      }}
                      value={payAmount}
                      onChange={(e) =>
                        setPayAmount(e.target.value)
                      }
                      min="1"
                      max={balance}
                      required
                    />
                  </div>

                  <small style={{ color: "#806b63" }}>
                    Maximum: Rs.{" "}
                    {balance.toLocaleString("en-IN")}
                  </small>

                </div>

                <div className="col-12 col-sm-6 col-md-auto">

                  <button
                    type="submit"
                    className="btn w-100 px-4"
                    style={{
                      backgroundColor: "#743d4b",
                      color: "#fffaf5",
                      border: "none",
                      borderRadius: "9px",
                    }}
                    disabled={paying}
                  >
                    {paying ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Please wait...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-lock-fill me-2"></i>
                        Pay Rs. {payAmount || 0}
                      </>
                    )}
                  </button>

                </div>
              </form>

            </div>
          ) : (
            <div
              className="alert border-0"
              style={{
                backgroundColor: "#f5eee7",
                color: "#6b5148",
              }}
            >
              <div className="d-flex gap-2">

                <i className="bi bi-info-circle fs-5"></i>

                <div>
                  <strong>Online payment unavailable</strong>

                  <p className="mb-0 small mt-1">
                    Please pay Rs.{" "}
                    {balance.toLocaleString("en-IN")} directly
                    at the shop using cash, UPI or card.
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* PAYMENT HISTORY */}
          <h6
            className="fw-semibold mb-3"
            style={{ color: "#4a2928" }}
          >
            Payment History
          </h6>

          <div className="list-group">

            {payments.map((p) => (
              <div
                key={p._id}
                className="list-group-item border-0 border-bottom px-0 py-3"
                style={{ backgroundColor: "transparent" }}
              >
                <div className="d-flex flex-column flex-sm-row justify-content-between gap-2">

                  <div>

                    <div
                      className="fw-semibold"
                      style={{ color: "#4a2928" }}
                    >
                      Rs.{" "}
                      {Number(p.amount).toLocaleString("en-IN")}{" "}

                      <span
                        className="badge ms-1 rounded-pill"
                        style={{
                          backgroundColor: "#f2e5df",
                          color: "#743d4b",
                          fontWeight: "500",
                        }}
                      >
                        {p.method}
                      </span>
                    </div>

                    <small style={{ color: "#806b63" }}>
                      Receipt:{" "}
                      {p.receiptNumber || p._id}
                    </small>

                  </div>

                  <small style={{ color: "#806b63" }}>
                    {new Date(
                      p.paymentDate,
                    ).toLocaleDateString()}
                  </small>

                </div>
              </div>
            ))}

            {payments.length === 0 && (
              <div
                className="text-center py-4"
                style={{ color: "#806b63" }}
              >
                <i className="bi bi-receipt fs-3 d-block mb-2"></i>
                No payments recorded yet
              </div>
            )}

          </div>

        </div>
      </div>

      {/* RECEIPT */}
      {receipt && (
        <div
          className="card border-0 shadow-sm rounded-4 mb-4"
          id="payment-receipt"
          style={{ backgroundColor: "#fffaf5" }}
        >
          <div className="card-body p-3 p-md-4">

            <div className="d-flex flex-column flex-sm-row justify-content-between gap-3">

              <div>
                <small
                  className="fw-semibold"
                  style={{
                    color: "#8a5a5a",
                    letterSpacing: "1px",
                  }}
                >
                  PAYMENT RECEIPT
                </small>

                <h4
                  className="fw-semibold mb-1 mt-1"
                  style={{ color: "#743d4b" }}
                >
                  BOUTIQ
                </h4>

                <p
                  className="mb-0"
                  style={{ color: "#806b63" }}
                >
                  Thank you for your payment.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-sm align-self-start"
                style={{
                  backgroundColor: "#f5eee7",
                  color: "#743d4b",
                  border: "1px solid #dfcbc3",
                  borderRadius: "8px",
                }}
                onClick={() => window.print()}
              >
                <i className="bi bi-printer me-1"></i>
                Print Receipt
              </button>

            </div>

            <hr style={{ borderColor: "#eaded6" }} />

            <div className="row g-3 small">

              <div className="col-12 col-sm-6">
                <span
                  className="d-block"
                  style={{ color: "#806b63" }}
                >
                  Receipt Number
                </span>

                <strong style={{ color: "#4a2928" }}>
                  {receipt.receiptNumber || receipt._id}
                </strong>
              </div>

              <div className="col-12 col-sm-6">
                <span
                  className="d-block"
                  style={{ color: "#806b63" }}
                >
                  Payment Date
                </span>

                <strong style={{ color: "#4a2928" }}>
                  {new Date(
                    receipt.paymentDate ||
                      receipt.createdAt,
                  ).toLocaleString()}
                </strong>
              </div>

              <div className="col-12 col-sm-6">
                <span
                  className="d-block"
                  style={{ color: "#806b63" }}
                >
                  Order
                </span>

                <strong style={{ color: "#4a2928" }}>
                  {order.orderNumber}
                </strong>
              </div>

              <div className="col-12 col-sm-6">
                <span
                  className="d-block"
                  style={{ color: "#806b63" }}
                >
                  Method
                </span>

                <strong style={{ color: "#4a2928" }}>
                  {receipt.method}
                </strong>
              </div>

              <div className="col-12">
                <span
                  className="d-block"
                  style={{ color: "#806b63" }}
                >
                  Amount Paid
                </span>

                <strong
                  className="fs-4"
                  style={{ color: "#743d4b" }}
                >
                  Rs.{" "}
                  {Number(
                    receipt.amount,
                  ).toLocaleString("en-IN")}
                </strong>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* DESIGN / REFERENCE IMAGES */}
      <div
        className="card border-0 shadow-sm rounded-4"
        style={{ backgroundColor: "#fffaf5" }}
      >
        <div className="card-body p-3 p-md-4">

          <div className="d-flex align-items-center gap-3 mb-4">

            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: "44px",
                height: "44px",
                backgroundColor: "#f2e5df",
                color: "#743d4b",
              }}
            >
              <i className="bi bi-images fs-5"></i>
            </div>

            <div>
              <h5
                className="fw-semibold mb-0"
                style={{ color: "#4a2928" }}
              >
                Design / Reference Images
              </h5>

              <small style={{ color: "#806b63" }}>
                Images associated with your order
              </small>
            </div>

          </div>

          {images.length > 0 ? (
            <div className="row g-3">

              {images.map((img) => (
                <div
                  className="col-12 col-sm-6 col-md-4 col-lg-3"
                  key={img._id}
                >
                  <div
                    className="card border-0 shadow-sm overflow-hidden h-100 rounded-3"
                    style={{ backgroundColor: "#f7eee5" }}
                  >

                    <img
                      src={`${SERVER_URL}${img.imageUrl}`}
                      alt={
                        img.caption ||
                        "design reference"
                      }
                      className="img-fluid w-100"
                      style={{
                        height: "220px",
                        objectFit: "cover",
                      }}
                    />

                    {img.caption && (
                      <div className="card-body p-2">
                        <small style={{ color: "#6b5148" }}>
                          {img.caption}
                        </small>
                      </div>
                    )}

                  </div>
                </div>
              ))}

            </div>
          ) : (
            <div className="text-center py-5">

              <div
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
                style={{
                  width: "64px",
                  height: "64px",
                  backgroundColor: "#f2e5df",
                  color: "#743d4b",
                }}
              >
                <i className="bi bi-image fs-4"></i>
              </div>

              <p
                className="mb-0 mt-3"
                style={{ color: "#806b63" }}
              >
                No images uploaded for this order yet.
              </p>

            </div>
          )}

        </div>
      </div>

    </div>
  );
}

export default CustomerOrderDetail;