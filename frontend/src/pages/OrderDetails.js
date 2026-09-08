// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import api, { SERVER_URL } from "../utils/api";

// function OrderDetails() {
//   const { id } = useParams();
//   const [order, setOrder] = useState(null);
//   const [payments, setPayments] = useState([]);
//   const [images, setImages] = useState([]);
//   const [designers, setDesigners] = useState([]);

//   const [status, setStatus] = useState("");
//   const [assignedDesigner, setAssignedDesigner] = useState("");
//   const [deliveryForm, setDeliveryForm] = useState({
//     status: "Pending",
//     deliveryAddress: "",
//     scheduledDate: "",
//   });
//   const [paymentForm, setPaymentForm] = useState({
//     amount: "",
//     method: "Cash",
//     status: "Paid",
//     notes: "",
//   });

//   const [imageFile, setImageFile] = useState(null);
//   const [imageCaption, setImageCaption] = useState("");

//   useEffect(() => {
//     fetchAll();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const fetchAll = async () => {
//     try {
//       const [orderRes, deliveryRes, paymentRes, imageRes, designerRes] =
//         await Promise.all([
//           api.get(`/orders/${id}`),
//           api.get(`/deliveries/order/${id}`),
//           api.get(`/payments/order/${id}`),
//           api.get(`/designs/order/${id}`),
//           api.get(`/orders/assignable-designers`),
//         ]);
//       setOrder(orderRes.data);
//       setStatus(orderRes.data.status);
//       setAssignedDesigner(orderRes.data.assignedDesigner?._id || "");
//       setDesigners(designerRes.data);
//       setPayments(paymentRes.data);
//       setImages(imageRes.data);

//       if (deliveryRes.data) {
//         setDeliveryForm({
//           status: deliveryRes.data.status,
//           deliveryAddress: deliveryRes.data.deliveryAddress || "",
//           scheduledDate: deliveryRes.data.scheduledDate
//             ? deliveryRes.data.scheduledDate.substring(0, 10)
//             : "",
//         });
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleStatusUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       const update = { status };
//       if (assignedDesigner) update.assignedDesigner = assignedDesigner;
//       await api.put(`/orders/${id}`, update);
//       fetchAll();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleDeliverySubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post("/deliveries", { order: id, ...deliveryForm });
//       fetchAll();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handlePaymentSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post("/payments", {
//         order: id,
//         customer: order.customer._id,
//         ...paymentForm,
//       });
//       setPaymentForm({ amount: "", method: "Cash", status: "Paid", notes: "" });
//       fetchAll();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleImageUpload = async (e) => {
//     e.preventDefault();
//     if (!imageFile) return;

//     const formData = new FormData();
//     formData.append("image", imageFile);
//     formData.append("order", id);
//     formData.append("customer", order.customer._id);
//     formData.append("caption", imageCaption);

//     try {
//       await api.post("/designs", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setImageFile(null);
//       setImageCaption("");
//       fetchAll();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   if (!order) return <p>Loading...</p>;

//   const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
//   const balance = order.totalAmount - totalPaid;

//   return (
//     <div>
//       <Link to="/orders" className="btn btn-sm btn-outline-secondary mb-3">
//         Back to Orders
//       </Link>

//       <div className="card p-3 shadow-sm mb-4">
//         <h4>{order.orderNumber}</h4>
//         <p className="mb-1">
//           Customer: {order.customer.name} ({order.customer.phone})
//         </p>
//         <p className="mb-1">Items: {order.items}</p>
//         <p className="mb-1">Total Amount: Rs. {order.totalAmount}</p>
//         <p className="mb-1">
//           Paid: Rs. {totalPaid} | Balance: Rs. {balance}
//         </p>
//         <p className="mb-0">Notes: {order.notes || "-"}</p>

//         <form
//           onSubmit={handleStatusUpdate}
//           className="d-flex gap-2 mt-3"
//           style={{ maxWidth: "400px" }}
//         >
//           <select
//             className="form-select"
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//           >
//             <option value="Pending">Pending</option>
//             <option value="In Progress">In Progress</option>
//             <option value="Ready">Ready</option>
//             <option value="Completed">Completed</option>
//             <option value="Delivered">Delivered</option>
//             <option value="Cancelled">Cancelled</option>
//           </select>
//           <button type="submit" className="btn btn-dark">
//             Update Status
//           </button>
//         </form>
//         <div className="mt-3" style={{ maxWidth: "400px" }}>
//           <label className="form-label">Assigned designer</label>
//           <select
//             className="form-select"
//             value={assignedDesigner}
//             onChange={(e) => setAssignedDesigner(e.target.value)}
//           >
//             <option value="">Select designer</option>
//             {designers.map((designer) => (
//               <option key={designer._id} value={designer._id}>
//                 {designer.name}
//               </option>
//             ))}
//           </select>
//           <small className="text-muted">
//             Changing the designer sends them a new assignment notification.
//           </small>
//         </div>
//       </div>

//       <div className="row">
//         <div className="col-md-6">
//           <div className="card p-3 shadow-sm mb-4">
//             <h5>Delivery</h5>
//             <form onSubmit={handleDeliverySubmit} className="mt-2">
//               <div className="mb-2">
//                 <label className="form-label">Status</label>
//                 <select
//                   className="form-select"
//                   value={deliveryForm.status}
//                   onChange={(e) =>
//                     setDeliveryForm({ ...deliveryForm, status: e.target.value })
//                   }
//                 >
//                   <option value="Pending">Pending</option>
//                   <option value="Out for Delivery">Out for Delivery</option>
//                   <option value="Delivered">Delivered</option>
//                 </select>
//               </div>
//               <div className="mb-2">
//                 <label className="form-label">Delivery Address</label>
//                 <input
//                   className="form-control"
//                   value={deliveryForm.deliveryAddress}
//                   onChange={(e) =>
//                     setDeliveryForm({
//                       ...deliveryForm,
//                       deliveryAddress: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="mb-2">
//                 <label className="form-label">Scheduled Date</label>
//                 <input
//                   type="date"
//                   className="form-control"
//                   value={deliveryForm.scheduledDate}
//                   onChange={(e) =>
//                     setDeliveryForm({
//                       ...deliveryForm,
//                       scheduledDate: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <button type="submit" className="btn btn-success btn-sm">
//                 Save Delivery Info
//               </button>
//             </form>
//           </div>
//         </div>

//         <div className="col-md-6">
//           <div className="card p-3 shadow-sm mb-4">
//             <h5>Record Payment</h5>
//             <form onSubmit={handlePaymentSubmit} className="mt-2">
//               <div className="mb-2">
//                 <label className="form-label">Amount</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   value={paymentForm.amount}
//                   onChange={(e) =>
//                     setPaymentForm({ ...paymentForm, amount: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//               <div className="mb-2">
//                 <label className="form-label">Method</label>
//                 <select
//                   className="form-select"
//                   value={paymentForm.method}
//                   onChange={(e) =>
//                     setPaymentForm({ ...paymentForm, method: e.target.value })
//                   }
//                 >
//                   <option value="Cash">Cash</option>
//                   <option value="Card">Card</option>
//                   <option value="UPI">UPI</option>
//                   <option value="Bank Transfer">Bank Transfer</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
//               <button type="submit" className="btn btn-success btn-sm">
//                 Add Payment
//               </button>
//             </form>

//             <ul className="list-group mt-3">
//               {payments.map((p) => (
//                 <li
//                   key={p._id}
//                   className="list-group-item d-flex justify-content-between align-items-center"
//                 >
//                   <span>
//                     Rs. {p.amount} - {p.method}{" "}
//                     {p.source === "Online Payment" && (
//                       <span className="badge bg-light text-dark border ms-1">
//                         Paid online
//                       </span>
//                     )}
//                   </span>
//                   <span className="text-muted">
//                     {new Date(p.paymentDate).toLocaleDateString()}
//                   </span>
//                 </li>
//               ))}
//               {payments.length === 0 && (
//                 <li className="list-group-item text-muted">
//                   No payments recorded
//                 </li>
//               )}
//             </ul>
//           </div>
//         </div>
//       </div>

//       <div className="card p-3 shadow-sm">
//         <h5>Design / Reference Images</h5>
//         <form
//           onSubmit={handleImageUpload}
//           className="row g-2 align-items-center mt-2"
//         >
//           <div className="col-md-5">
//             <input
//               type="file"
//               className="form-control"
//               accept="image/*"
//               onChange={(e) => setImageFile(e.target.files[0])}
//             />
//           </div>
//           <div className="col-md-4">
//             <input
//               className="form-control"
//               placeholder="Caption (optional)"
//               value={imageCaption}
//               onChange={(e) => setImageCaption(e.target.value)}
//             />
//           </div>
//           <div className="col-md-3">
//             <button type="submit" className="btn btn-dark w-100">
//               Upload
//             </button>
//           </div>
//         </form>

//         <div className="row g-3 mt-3">
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
//             <p className="text-muted">No images uploaded for this order</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default OrderDetails;

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { SERVER_URL } from "../utils/api";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [payments, setPayments] = useState([]);
  const [images, setImages] = useState([]);
  const [designers, setDesigners] = useState([]);

  const [status, setStatus] = useState("");
  const [assignedDesigner, setAssignedDesigner] = useState("");
  const [deliveryForm, setDeliveryForm] = useState({
    status: "Pending",
    deliveryAddress: "",
    scheduledDate: "",
  });
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    method: "Cash",
    status: "Paid",
    notes: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imageCaption, setImageCaption] = useState("");

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchAll = async () => {
    try {
      const [orderRes, deliveryRes, paymentRes, imageRes, designerRes] =
        await Promise.all([
          api.get(`/orders/${id}`),
          api.get(`/deliveries/order/${id}`),
          api.get(`/payments/order/${id}`),
          api.get(`/designs/order/${id}`),
          api.get(`/orders/assignable-designers`),
        ]);

      setOrder(orderRes.data);
      setStatus(orderRes.data.status);
      setAssignedDesigner(orderRes.data.assignedDesigner?._id || "");
      setDesigners(designerRes.data);
      setPayments(paymentRes.data);
      setImages(imageRes.data);

      if (deliveryRes.data) {
        setDeliveryForm({
          status: deliveryRes.data.status,
          deliveryAddress: deliveryRes.data.deliveryAddress || "",
          scheduledDate: deliveryRes.data.scheduledDate
            ? deliveryRes.data.scheduledDate.substring(0, 10)
            : "",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();

    try {
      const update = { status };

      if (assignedDesigner) {
        update.assignedDesigner = assignedDesigner;
      }

      await api.put(`/orders/${id}`, update);
      fetchAll();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeliverySubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/deliveries", {
        order: id,
        ...deliveryForm,
      });

      fetchAll();
    } catch (error) {
      console.error(error);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/payments", {
        order: id,
        customer: order.customer._id,
        ...paymentForm,
      });

      setPaymentForm({
        amount: "",
        method: "Cash",
        status: "Paid",
        notes: "",
      });

      fetchAll();
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();

    if (!imageFile) return;

    const formData = new FormData();

    formData.append("image", imageFile);
    formData.append("order", id);
    formData.append("customer", order.customer._id);
    formData.append("caption", imageCaption);

    try {
      await api.post("/designs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setImageFile(null);
      setImageCaption("");
      fetchAll();
    } catch (error) {
      console.error(error);
    }
  };

  if (!order) {
    return (
      <div
        className="d-flex justify-content-center align-items-center py-5"
        style={{ color: "#743d4b" }}
      >
        <div className="text-center">
          <div
            className="spinner-border mb-3"
            role="status"
            style={{ color: "#743d4b" }}
          ></div>
          <p className="text-muted mb-0">Loading order...</p>
        </div>
      </div>
    );
  }

  const totalPaid = payments.reduce(
    (sum, p) => sum + Number(p.amount),
    0
  );

  const balance = order.totalAmount - totalPaid;

  return (
    <div>

      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">

        <div>
          <Link
            to="/orders"
            className="text-decoration-none small"
            style={{ color: "#8a5a5a" }}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Back to Orders
          </Link>

          <div
            className="text-uppercase small fw-semibold mt-3 mb-1"
            style={{
              color: "#8a5a5a",
              letterSpacing: "1.5px",
            }}
          >
            ORDER MANAGEMENT
          </div>

          <h2
            className="mb-1 fw-semibold"
            style={{ color: "#4a2928" }}
          >
            {order.orderNumber}
          </h2>

          <p className="text-muted mb-0">
            Manage order, delivery, payment and references.
          </p>
        </div>

        <span
          className="badge rounded-pill px-3 py-2 align-self-start align-self-sm-auto"
          style={{
            backgroundColor: "#ead7d0",
            color: "#743d4b",
          }}
        >
          <i className="bi bi-bag-check me-1"></i>
          {order.status}
        </span>

      </div>

      {/* Order Summary */}
      <div
        className="card border-0 shadow-sm mb-4"
        style={{
          backgroundColor: "#fffaf5",
          borderRadius: "16px",
        }}
      >
        <div className="card-body p-3 p-md-4">

          <div className="d-flex align-items-center mb-4">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center me-3"
              style={{
                width: "46px",
                height: "46px",
                backgroundColor: "#ead7d0",
                color: "#743d4b",
              }}
            >
              <i className="bi bi-receipt fs-5"></i>
            </div>

            <div>
              <h5
                className="mb-1"
                style={{ color: "#4a2928" }}
              >
                Order Summary
              </h5>

              <small className="text-muted">
                Customer and order information
              </small>
            </div>
          </div>

          <div className="row g-3">

            <div className="col-12 col-md-6 col-lg-4">
              <div
                className="p-3 rounded-3 h-100"
                style={{ backgroundColor: "#f7eee5" }}
              >
                <small className="text-muted d-block mb-1">
                  CUSTOMER
                </small>

                <strong style={{ color: "#4a2928" }}>
                  {order.customer.name}
                </strong>

                <div className="small text-muted mt-1">
                  <i className="bi bi-telephone me-1"></i>
                  {order.customer.phone}
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div
                className="p-3 rounded-3 h-100"
                style={{ backgroundColor: "#f7eee5" }}
              >
                <small className="text-muted d-block mb-1">
                  ITEMS
                </small>

                <strong style={{ color: "#4a2928" }}>
                  {order.items}
                </strong>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div
                className="p-3 rounded-3 h-100"
                style={{ backgroundColor: "#f7eee5" }}
              >
                <small className="text-muted d-block mb-1">
                  TOTAL AMOUNT
                </small>

                <strong
                  className="fs-5"
                  style={{ color: "#743d4b" }}
                >
                  Rs. {order.totalAmount}
                </strong>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div
                className="p-3 rounded-3"
                style={{ backgroundColor: "#e8eee4" }}
              >
                <small className="text-muted d-block mb-1">
                  PAID
                </small>

                <strong style={{ color: "#52614c" }}>
                  Rs. {totalPaid}
                </strong>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div
                className="p-3 rounded-3"
                style={{ backgroundColor: "#f3dfdb" }}
              >
                <small className="text-muted d-block mb-1">
                  BALANCE
                </small>

                <strong style={{ color: "#743d4b" }}>
                  Rs. {balance}
                </strong>
              </div>
            </div>

            <div className="col-12">
              <div
                className="p-3 rounded-3"
                style={{ backgroundColor: "#faf5ee" }}
              >
                <small className="text-muted d-block mb-1">
                  NOTES
                </small>

                <span style={{ color: "#5b3733" }}>
                  {order.notes || "-"}
                </span>
              </div>
            </div>

          </div>

          {/* Status + Designer */}
          <div className="row g-3 mt-2">

            <div className="col-12 col-lg-6">
              <div
                className="p-3 rounded-3 h-100"
                style={{
                  backgroundColor: "#f7eee5",
                }}
              >
                <label
                  className="form-label fw-semibold"
                  style={{ color: "#5b3733" }}
                >
                  <i className="bi bi-arrow-repeat me-2"></i>
                  Order Status
                </label>

                <form
                  onSubmit={handleStatusUpdate}
                  className="d-flex flex-column flex-sm-row gap-2"
                >
                  <select
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Ready">Ready</option>
                    <option value="Completed">Completed</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <button
                    type="submit"
                    className="btn px-4"
                    style={{
                      backgroundColor: "#743d4b",
                      color: "#fffaf5",
                      border: "none",
                      borderRadius: "9px",
                    }}
                  >
                    Update
                  </button>
                </form>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div
                className="p-3 rounded-3 h-100"
                style={{
                  backgroundColor: "#f7eee5",
                }}
              >
                <label
                  className="form-label fw-semibold"
                  style={{ color: "#5b3733" }}
                >
                  <i className="bi bi-scissors me-2"></i>
                  Assigned Designer
                </label>

                <select
                  className="form-select"
                  value={assignedDesigner}
                  onChange={(e) =>
                    setAssignedDesigner(e.target.value)
                  }
                >
                  <option value="">Select designer</option>

                  {designers.map((designer) => (
                    <option
                      key={designer._id}
                      value={designer._id}
                    >
                      {designer.name}
                    </option>
                  ))}
                </select>

                <small className="text-muted d-block mt-2">
                  Changing the designer sends them a new assignment
                  notification.
                </small>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Delivery + Payment */}
      <div className="row g-4">

        {/* Delivery */}
        <div className="col-12 col-lg-6">
          <div
            className="card border-0 shadow-sm h-100"
            style={{
              backgroundColor: "#fffaf5",
              borderRadius: "16px",
            }}
          >
            <div className="card-body p-3 p-md-4">

              <div className="d-flex align-items-center mb-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "44px",
                    height: "44px",
                    backgroundColor: "#e7e4d8",
                    color: "#68705b",
                  }}
                >
                  <i className="bi bi-truck fs-5"></i>
                </div>

                <div>
                  <h5
                    className="mb-1"
                    style={{ color: "#4a2928" }}
                  >
                    Delivery
                  </h5>

                  <small className="text-muted">
                    Schedule and update delivery details.
                  </small>
                </div>
              </div>

              <form onSubmit={handleDeliverySubmit}>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Status
                  </label>

                  <select
                    className="form-select"
                    value={deliveryForm.status}
                    onChange={(e) =>
                      setDeliveryForm({
                        ...deliveryForm,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Out for Delivery">
                      Out for Delivery
                    </option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Delivery Address
                  </label>

                  <input
                    className="form-control"
                    value={deliveryForm.deliveryAddress}
                    onChange={(e) =>
                      setDeliveryForm({
                        ...deliveryForm,
                        deliveryAddress: e.target.value,
                      })
                    }
                    placeholder="Enter delivery address"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Scheduled Date
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    value={deliveryForm.scheduledDate}
                    onChange={(e) =>
                      setDeliveryForm({
                        ...deliveryForm,
                        scheduledDate: e.target.value,
                      })
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="btn px-4"
                  style={{
                    backgroundColor: "#e7e4d8",
                    color: "#52614c",
                    border: "none",
                    borderRadius: "9px",
                  }}
                >
                  <i className="bi bi-check2 me-2"></i>
                  Save Delivery Info
                </button>

              </form>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="col-12 col-lg-6">
          <div
            className="card border-0 shadow-sm h-100"
            style={{
              backgroundColor: "#fffaf5",
              borderRadius: "16px",
            }}
          >
            <div className="card-body p-3 p-md-4">

              <div className="d-flex align-items-center mb-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "44px",
                    height: "44px",
                    backgroundColor: "#ead7d0",
                    color: "#743d4b",
                  }}
                >
                  <i className="bi bi-wallet2 fs-5"></i>
                </div>

                <div>
                  <h5
                    className="mb-1"
                    style={{ color: "#4a2928" }}
                  >
                    Record Payment
                  </h5>

                  <small className="text-muted">
                    Add an offline customer payment.
                  </small>
                </div>
              </div>

              <form onSubmit={handlePaymentSubmit}>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Amount
                  </label>

                  <div className="input-group">
                    <span
                      className="input-group-text"
                      style={{
                        backgroundColor: "#f7eee5",
                        color: "#743d4b",
                      }}
                    >
                      Rs.
                    </span>

                    <input
                      type="number"
                      className="form-control"
                      value={paymentForm.amount}
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          amount: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Method
                  </label>

                  <select
                    className="form-select"
                    value={paymentForm.method}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        method: e.target.value,
                      })
                    }
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">
                      Bank Transfer
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn px-4"
                  style={{
                    backgroundColor: "#743d4b",
                    color: "#fffaf5",
                    border: "none",
                    borderRadius: "9px",
                  }}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Payment
                </button>

              </form>

              {/* Payment History */}
              <div className="mt-4">
                <h6
                  className="mb-3"
                  style={{ color: "#5b3733" }}
                >
                  Payment History
                </h6>

                <div className="list-group">

                  {payments.map((p) => (
                    <div
                      key={p._id}
                      className="list-group-item border-0 mb-2 rounded-3 d-flex flex-column flex-sm-row justify-content-between gap-2"
                      style={{
                        backgroundColor: "#f7eee5",
                      }}
                    >
                      <div>
                        <strong style={{ color: "#4a2928" }}>
                          Rs. {p.amount}
                        </strong>

                        <span className="text-muted ms-2">
                          {p.method}
                        </span>

                        {p.source === "Online Payment" && (
                          <span
                            className="badge rounded-pill ms-2"
                            style={{
                              backgroundColor: "#e3eee0",
                              color: "#52614c",
                            }}
                          >
                            Paid online
                          </span>
                        )}
                      </div>

                      <small className="text-muted">
                        {new Date(
                          p.paymentDate
                        ).toLocaleDateString()}
                      </small>
                    </div>
                  ))}

                  {payments.length === 0 && (
                    <div
                      className="p-3 rounded-3 text-muted small"
                      style={{
                        backgroundColor: "#faf5ee",
                      }}
                    >
                      No payments recorded
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Images */}
      <div
        className="card border-0 shadow-sm mt-4"
        style={{
          backgroundColor: "#fffaf5",
          borderRadius: "16px",
        }}
      >
        <div className="card-body p-3 p-md-4">

          <div className="d-flex align-items-center mb-4">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center me-3"
              style={{
                width: "44px",
                height: "44px",
                backgroundColor: "#ead7d0",
                color: "#743d4b",
              }}
            >
              <i className="bi bi-images fs-5"></i>
            </div>

            <div>
              <h5
                className="mb-1"
                style={{ color: "#4a2928" }}
              >
                Design / Reference Images
              </h5>

              <small className="text-muted">
                Upload reference images for this order.
              </small>
            </div>
          </div>

          <form
            onSubmit={handleImageUpload}
            className="row g-3 align-items-end"
          >

            <div className="col-12 col-lg-5">
              <label className="form-label small fw-semibold">
                Image
              </label>

              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) =>
                  setImageFile(e.target.files[0])
                }
              />
            </div>

            <div className="col-12 col-lg-4">
              <label className="form-label small fw-semibold">
                Caption
              </label>

              <input
                className="form-control"
                placeholder="Caption (optional)"
                value={imageCaption}
                onChange={(e) =>
                  setImageCaption(e.target.value)
                }
              />
            </div>

            <div className="col-12 col-lg-3">
              <button
                type="submit"
                className="btn w-100"
                style={{
                  backgroundColor: "#743d4b",
                  color: "#fffaf5",
                  border: "none",
                  borderRadius: "9px",
                }}
              >
                <i className="bi bi-cloud-arrow-up me-2"></i>
                Upload
              </button>
            </div>

          </form>

          {/* Image Gallery */}
          <div className="row g-3 mt-2">

            {images.map((img) => (
              <div
                className="col-12 col-sm-6 col-md-4 col-lg-3"
                key={img._id}
              >
                <div
                  className="card border-0 overflow-hidden h-100"
                  style={{
                    backgroundColor: "#f7eee5",
                    borderRadius: "12px",
                  }}
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
                    <div className="p-2 small text-muted">
                      {img.caption}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {images.length === 0 && (
              <div className="col-12">
                <div
                  className="text-center py-5 rounded-3"
                  style={{
                    backgroundColor: "#faf5ee",
                  }}
                >
                  <div
                    className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "60px",
                      height: "60px",
                      backgroundColor: "#ead7d0",
                      color: "#743d4b",
                    }}
                  >
                    <i className="bi bi-image fs-4"></i>
                  </div>

                  <h6 style={{ color: "#5b3733" }}>
                    No images uploaded
                  </h6>

                  <p className="small text-muted mb-0">
                    Design references for this order will appear here.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
}

export default OrderDetails;