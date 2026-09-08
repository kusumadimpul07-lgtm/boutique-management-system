// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import api, { SERVER_URL } from "../utils/api";

// function CustomerDetails() {
//   const { id } = useParams();
//   const [customer, setCustomer] = useState(null);
//   const [measurements, setMeasurements] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [images, setImages] = useState([]);

//   const [showMeasureForm, setShowMeasureForm] = useState(false);
//   const [measureData, setMeasureData] = useState({
//     title: "",
//     chest: "",
//     waist: "",
//     hip: "",
//     shoulder: "",
//     sleeveLength: "",
//     armhole: "",
//     neck: "",
//     topLength: "",
//     bottomLength: "",
//     inseam: "",
//     unit: "inches",
//     notes: "",
//   });

//   const [imageFile, setImageFile] = useState(null);
//   const [imageCaption, setImageCaption] = useState("");
//   const [imagePrice, setImagePrice] = useState("");

//   const [portalPassword, setPortalPassword] = useState("");
//   const [portalMessage, setPortalMessage] = useState("");

//   useEffect(() => {
//     fetchAll();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const fetchAll = async () => {
//     try {
//       const [custRes, measureRes, orderRes, imageRes] = await Promise.all([
//         api.get(`/customers/${id}`),
//         api.get(`/measurements/customer/${id}`),
//         api.get(`/orders/customer/${id}`),
//         api.get(`/designs/customer/${id}`),
//       ]);
//       setCustomer(custRes.data);
//       setMeasurements(measureRes.data);
//       setOrders(orderRes.data);
//       setImages(imageRes.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleMeasureChange = (e) => {
//     setMeasureData({ ...measureData, [e.target.name]: e.target.value });
//   };

//   const handleMeasureSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post("/measurements", { ...measureData, customer: id });
//       setShowMeasureForm(false);
//       setMeasureData({
//         title: "",
//         chest: "",
//         waist: "",
//         hip: "",
//         shoulder: "",
//         sleeveLength: "",
//         armhole: "",
//         neck: "",
//         topLength: "",
//         bottomLength: "",
//         inseam: "",
//         unit: "inches",
//         notes: "",
//       });
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
//     formData.append("customer", id);
//     formData.append("caption", imageCaption);
//     formData.append("price", imagePrice);

//     try {
//       await api.post("/designs", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setImageFile(null);
//       setImageCaption("");
//       setImagePrice("");
//       fetchAll();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleSetPortalPassword = async (e) => {
//     e.preventDefault();
//     setPortalMessage("");
//     try {
//       await api.put(`/customers/${id}`, { password: portalPassword });
//       setPortalPassword("");
//       setPortalMessage(
//         "Portal password saved. The customer can now log in at /customer-login.",
//       );
//       fetchAll();
//     } catch (error) {
//       console.error(error);
//       setPortalMessage("Could not save the password. Please try again.");
//     }
//   };

//   if (!customer) return <p>Loading...</p>;

//   return (
//     <div>
//       <Link to="/customers" className="btn btn-sm btn-outline-secondary mb-3">
//         Back to Customers
//       </Link>

//       <div className="card p-3 shadow-sm mb-4">
//         <h4>{customer.name}</h4>
//         <p className="mb-1">Phone: {customer.phone}</p>
//         <p className="mb-1">Email: {customer.email || "-"}</p>
//         <p className="mb-0">Address: {customer.address || "-"}</p>
//       </div>

//       <div className="card p-3 shadow-sm mb-4">
//         <div className="d-flex justify-content-between align-items-center mb-2">
//           <h5 className="mb-0">Customer Portal Access</h5>
//           <span
//             className={`badge ${customer.hasPortalAccess ? "bg-success" : "bg-secondary"}`}
//           >
//             {customer.hasPortalAccess ? "Enabled" : "Not set up"}
//           </span>
//         </div>
//         <p className="text-muted" style={{ fontSize: "0.9rem" }}>
//           Customers log in with their phone number at{" "}
//           <strong>/customer-login</strong> to see their order status and pay
//           online.
//         </p>
//         {portalMessage && (
//           <div className="alert alert-info py-2">{portalMessage}</div>
//         )}
//         <form
//           onSubmit={handleSetPortalPassword}
//           className="d-flex gap-2"
//           style={{ maxWidth: "400px" }}
//         >
//           <input
//             type="text"
//             className="form-control"
//             placeholder={
//               customer.hasPortalAccess
//                 ? "New password (to reset)"
//                 : "Set a password"
//             }
//             value={portalPassword}
//             onChange={(e) => setPortalPassword(e.target.value)}
//             required
//           />
//           <button type="submit" className="btn btn-dark text-nowrap">
//             {customer.hasPortalAccess ? "Reset Password" : "Enable Access"}
//           </button>
//         </form>
//       </div>

//       <div className="card p-3 shadow-sm mb-4">
//         <div className="d-flex justify-content-between align-items-center">
//           <h5 className="mb-0">Measurements</h5>
//           <button
//             className="btn btn-sm btn-dark"
//             onClick={() => setShowMeasureForm(!showMeasureForm)}
//           >
//             {showMeasureForm ? "Cancel" : "+ Add Measurement"}
//           </button>
//         </div>

//         {showMeasureForm && (
//           <form onSubmit={handleMeasureSubmit} className="mt-3">
//             <div className="row g-2">
//               <div className="col-md-3">
//                 <input
//                   className="form-control"
//                   name="title"
//                   placeholder="Title (e.g. Blouse)"
//                   value={measureData.title}
//                   onChange={handleMeasureChange}
//                 />
//               </div>
//               <div className="col-md-3">
//                 <input
//                   className="form-control"
//                   name="chest"
//                   placeholder="Chest"
//                   value={measureData.chest}
//                   onChange={handleMeasureChange}
//                 />
//               </div>
//               <div className="col-md-3">
//                 <input
//                   className="form-control"
//                   name="waist"
//                   placeholder="Waist"
//                   value={measureData.waist}
//                   onChange={handleMeasureChange}
//                 />
//               </div>
//               <div className="col-md-3">
//                 <input
//                   className="form-control"
//                   name="hip"
//                   placeholder="Hip"
//                   value={measureData.hip}
//                   onChange={handleMeasureChange}
//                 />
//               </div>
//               <div className="col-md-3">
//                 <input
//                   className="form-control"
//                   name="shoulder"
//                   placeholder="Shoulder"
//                   value={measureData.shoulder}
//                   onChange={handleMeasureChange}
//                 />
//               </div>
//               <div className="col-md-3">
//                 <input
//                   className="form-control"
//                   name="sleeveLength"
//                   placeholder="Sleeve Length"
//                   value={measureData.sleeveLength}
//                   onChange={handleMeasureChange}
//                 />
//               </div>
//               <div className="col-md-3">
//                 <input
//                   className="form-control"
//                   name="armhole"
//                   placeholder="Armhole"
//                   value={measureData.armhole}
//                   onChange={handleMeasureChange}
//                 />
//               </div>
//               <div className="col-md-3">
//                 <input
//                   className="form-control"
//                   name="neck"
//                   placeholder="Neck"
//                   value={measureData.neck}
//                   onChange={handleMeasureChange}
//                 />
//               </div>
//               <div className="col-md-3">
//                 <input
//                   className="form-control"
//                   name="topLength"
//                   placeholder="Top Length"
//                   value={measureData.topLength}
//                   onChange={handleMeasureChange}
//                 />
//               </div>
//               <div className="col-md-3">
//                 <input
//                   className="form-control"
//                   name="bottomLength"
//                   placeholder="Bottom Length"
//                   value={measureData.bottomLength}
//                   onChange={handleMeasureChange}
//                 />
//               </div>
//               <div className="col-md-3">
//                 <input
//                   className="form-control"
//                   name="inseam"
//                   placeholder="Inseam"
//                   value={measureData.inseam}
//                   onChange={handleMeasureChange}
//                 />
//               </div>
//               <div className="col-md-3">
//                 <select
//                   className="form-select"
//                   name="unit"
//                   value={measureData.unit}
//                   onChange={handleMeasureChange}
//                 >
//                   <option value="inches">Inches</option>
//                   <option value="cm">Centimeters</option>
//                 </select>
//               </div>
//               <div className="col-md-12">
//                 <input
//                   className="form-control"
//                   name="notes"
//                   placeholder="Notes"
//                   value={measureData.notes}
//                   onChange={handleMeasureChange}
//                 />
//               </div>
//             </div>
//             <button type="submit" className="btn btn-success mt-3">
//               Save Measurement
//             </button>
//           </form>
//         )}

//         <div className="table-responsive mt-3">
//           <table className="table table-sm">
//             <thead>
//               <tr>
//                 <th>Title</th>
//                 <th>Chest</th>
//                 <th>Waist</th>
//                 <th>Hip</th>
//                 <th>Shoulder</th>
//                 <th>Sleeve</th>
//                 <th>Unit</th>
//                 <th>Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {measurements.map((m) => (
//                 <tr key={m._id}>
//                   <td>{m.title}</td>
//                   <td>{m.chest || "-"}</td>
//                   <td>{m.waist || "-"}</td>
//                   <td>{m.hip || "-"}</td>
//                   <td>{m.shoulder || "-"}</td>
//                   <td>{m.sleeveLength || "-"}</td>
//                   <td>{m.unit}</td>
//                   <td>{new Date(m.createdAt).toLocaleDateString()}</td>
//                 </tr>
//               ))}
//               {measurements.length === 0 && (
//                 <tr>
//                   <td colSpan="8" className="text-center text-muted">
//                     No measurements recorded
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div className="card p-3 shadow-sm mb-4">
//         <h5>Orders</h5>
//         <ul className="list-group mt-2">
//           {orders.map((o) => (
//             <li
//               key={o._id}
//               className="list-group-item d-flex justify-content-between align-items-center"
//             >
//               <Link to={`/orders/${o._id}`}>
//                 {o.orderNumber} - {o.items}
//               </Link>
//               <span className="badge bg-secondary">{o.status}</span>
//             </li>
//           ))}
//           {orders.length === 0 && (
//             <li className="list-group-item text-muted">No orders yet</li>
//           )}
//         </ul>
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
//           <div className="col-md-2">
//             <input
//               type="number"
//               min="0"
//               className="form-control"
//               placeholder="Price"
//               value={imagePrice}
//               onChange={(e) => setImagePrice(e.target.value)}
//             />
//           </div>
//           <div className="col-md-1">
//             <button type="submit" className="btn btn-dark w-100">
//               Upload
//             </button>
//           </div>
//         </form>

//         <div className="row g-3 mt-3">
//           {images.map((img) => (
//             <div className="col-md-3" key={img._id}>
//               <div className="card h-100">
//                 <img
//                   src={`${SERVER_URL}${img.imageUrl}`}
//                   alt={img.caption || "design reference"}
//                   className="card-img-top"
//                   style={{ height: "150px", objectFit: "cover" }}
//                 />
//                 {img.caption && (
//                   <div className="card-body p-2">
//                     <small>{img.caption}</small>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//           {images.length === 0 && (
//             <p className="text-muted mt-2">No images uploaded yet</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CustomerDetails;

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { SERVER_URL } from "../utils/api";

function CustomerDetails() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [orders, setOrders] = useState([]);
  const [images, setImages] = useState([]);

  const [showMeasureForm, setShowMeasureForm] = useState(false);
  const [measureData, setMeasureData] = useState({
    title: "",
    chest: "",
    waist: "",
    hip: "",
    shoulder: "",
    sleeveLength: "",
    armhole: "",
    neck: "",
    topLength: "",
    bottomLength: "",
    inseam: "",
    unit: "inches",
    notes: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imageCaption, setImageCaption] = useState("");
  const [imagePrice, setImagePrice] = useState("");

  const [portalPassword, setPortalPassword] = useState("");
  const [portalMessage, setPortalMessage] = useState("");

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchAll = async () => {
    try {
      const [custRes, measureRes, orderRes, imageRes] = await Promise.all([
        api.get(`/customers/${id}`),
        api.get(`/measurements/customer/${id}`),
        api.get(`/orders/customer/${id}`),
        api.get(`/designs/customer/${id}`),
      ]);
      setCustomer(custRes.data);
      setMeasurements(measureRes.data);
      setOrders(orderRes.data);
      setImages(imageRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMeasureChange = (e) => {
    setMeasureData({ ...measureData, [e.target.name]: e.target.value });
  };

  const handleMeasureSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/measurements", { ...measureData, customer: id });
      setShowMeasureForm(false);
      setMeasureData({
        title: "",
        chest: "",
        waist: "",
        hip: "",
        shoulder: "",
        sleeveLength: "",
        armhole: "",
        neck: "",
        topLength: "",
        bottomLength: "",
        inseam: "",
        unit: "inches",
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
    formData.append("customer", id);
    formData.append("caption", imageCaption);
    formData.append("price", imagePrice);

    try {
      await api.post("/designs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImageFile(null);
      setImageCaption("");
      setImagePrice("");
      fetchAll();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetPortalPassword = async (e) => {
    e.preventDefault();
    setPortalMessage("");
    try {
      await api.put(`/customers/${id}`, { password: portalPassword });
      setPortalPassword("");
      setPortalMessage(
        "Portal password saved. The customer can now log in at /customer-login.",
      );
      fetchAll();
    } catch (error) {
      console.error(error);
      setPortalMessage("Could not save the password. Please try again.");
    }
  };

  if (!customer) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border"
          style={{ color: "#743d4b" }}
          role="status"
        ></div>
        <p className="text-muted mt-3 mb-0">Loading customer...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid px-2 px-md-3">

      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <Link
            to="/customers"
            className="text-decoration-none small"
            style={{ color: "#743d4b" }}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Back to Customers
          </Link>

          <h2
            className="fw-bold mt-2 mb-1"
            style={{ color: "#4a2928" }}
          >
            Customer Details
          </h2>

          <p className="text-muted mb-0">
            Customer profile, measurements, orders and references.
          </p>
        </div>

        <div
          className="rounded-pill px-3 py-2 small fw-semibold align-self-start align-self-sm-auto"
          style={{
            backgroundColor: "#f1e1d7",
            color: "#743d4b",
          }}
        >
          <i className="bi bi-person-check me-1"></i>
          Customer
        </div>
      </div>

      {/* Customer Information */}
      <div
        className="card border-0 shadow-sm rounded-4 mb-4"
        style={{ backgroundColor: "#faf5ee" }}
      >
        <div className="card-body p-3 p-md-4">
          <div className="row g-3 align-items-center">

            <div className="col-12 col-md-5">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: "58px",
                    height: "58px",
                    backgroundColor: "#ead7d0",
                    color: "#743d4b",
                  }}
                >
                  <i className="bi bi-person fs-3"></i>
                </div>

                <div>
                  <h4
                    className="fw-bold mb-1"
                    style={{ color: "#4a2928" }}
                  >
                    {customer.name}
                  </h4>
                  <small className="text-muted">
                    Customer profile
                  </small>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-7">
              <div className="row g-2">
                <div className="col-12 col-sm-4">
                  <div
                    className="rounded-3 p-3 h-100"
                    style={{ backgroundColor: "#f2e7dc" }}
                  >
                    <small className="text-muted d-block mb-1">
                      <i className="bi bi-telephone me-1"></i>
                      Phone
                    </small>
                    <span className="fw-semibold">
                      {customer.phone}
                    </span>
                  </div>
                </div>

                <div className="col-12 col-sm-4">
                  <div
                    className="rounded-3 p-3 h-100"
                    style={{ backgroundColor: "#f2e7dc" }}
                  >
                    <small className="text-muted d-block mb-1">
                      <i className="bi bi-envelope me-1"></i>
                      Email
                    </small>
                    <span className="fw-semibold text-break">
                      {customer.email || "-"}
                    </span>
                  </div>
                </div>

                <div className="col-12 col-sm-4">
                  <div
                    className="rounded-3 p-3 h-100"
                    style={{ backgroundColor: "#f2e7dc" }}
                  >
                    <small className="text-muted d-block mb-1">
                      <i className="bi bi-geo-alt me-1"></i>
                      Address
                    </small>
                    <span className="fw-semibold">
                      {customer.address || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Customer Portal */}
      <div
        className="card border-0 shadow-sm rounded-4 mb-4"
        style={{ backgroundColor: "#fffaf5" }}
      >
        <div className="card-body p-3 p-md-4">

          <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
            <div>
              <h5
                className="fw-bold mb-1"
                style={{ color: "#4a2928" }}
              >
                <i
                  className="bi bi-phone me-2"
                  style={{ color: "#743d4b" }}
                ></i>
                Customer Portal Access
              </h5>

              <p className="text-muted small mb-0">
                Customers can view order status and pay online through
                their portal.
              </p>
            </div>

            <span
              className="badge rounded-pill px-3 py-2 align-self-start"
              style={{
                backgroundColor: customer.hasPortalAccess
                  ? "#e6eee2"
                  : "#eee7df",
                color: customer.hasPortalAccess
                  ? "#53664d"
                  : "#74665b",
              }}
            >
              <i
                className={`bi ${
                  customer.hasPortalAccess
                    ? "bi-check-circle"
                    : "bi-dash-circle"
                } me-1`}
              ></i>
              {customer.hasPortalAccess ? "Enabled" : "Not set up"}
            </span>
          </div>

          <div
            className="rounded-3 p-3 mb-3"
            style={{ backgroundColor: "#f5eee6" }}
          >
            <small className="text-muted">
              Customers log in with their phone number at{" "}
              <strong>/customer-login</strong>.
            </small>
          </div>

          {portalMessage && (
            <div
              className="alert border-0 rounded-3 py-2"
              style={{
                backgroundColor: "#eee3d7",
                color: "#694b43",
              }}
            >
              <i className="bi bi-info-circle me-2"></i>
              {portalMessage}
            </div>
          )}

          <form
            onSubmit={handleSetPortalPassword}
            className="row g-2"
          >
            <div className="col-12 col-md-8 col-lg-6">
              <input
                type="text"
                className="form-control"
                placeholder={
                  customer.hasPortalAccess
                    ? "New password (to reset)"
                    : "Set a password"
                }
                value={portalPassword}
                onChange={(e) => setPortalPassword(e.target.value)}
                required
              />
            </div>

            <div className="col-12 col-md-auto">
              <button
                type="submit"
                className="btn w-100"
                style={{
                  backgroundColor: "#743d4b",
                  color: "#fff8f2",
                  border: "none",
                }}
              >
                <i className="bi bi-key me-2"></i>
                {customer.hasPortalAccess
                  ? "Reset Password"
                  : "Enable Access"}
              </button>
            </div>
          </form>

        </div>
      </div>

      {/* Measurements */}
      <div
        className="card border-0 shadow-sm rounded-4 mb-4"
        style={{ backgroundColor: "#fffaf5" }}
      >
        <div className="card-body p-3 p-md-4">

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
            <div>
              <h5
                className="fw-bold mb-1"
                style={{ color: "#4a2928" }}
              >
                <i
                  className="bi bi-rulers me-2"
                  style={{ color: "#743d4b" }}
                ></i>
                Measurements
              </h5>

              <small className="text-muted">
                Saved measurements for this customer.
              </small>
            </div>

            <button
              className="btn btn-sm"
              style={{
                backgroundColor: "#ead7d0",
                color: "#743d4b",
                border: "1px solid #ddc3ba",
              }}
              onClick={() => setShowMeasureForm(!showMeasureForm)}
            >
              <i
                className={`bi ${
                  showMeasureForm ? "bi-x-lg" : "bi-plus-lg"
                } me-1`}
              ></i>
              {showMeasureForm ? "Cancel" : "Add Measurement"}
            </button>
          </div>

          {/* Measurement Form */}
          {showMeasureForm && (
            <div
              className="rounded-4 p-3 p-md-4 mt-4"
              style={{ backgroundColor: "#f7eee5" }}
            >
              <h6
                className="fw-bold mb-3"
                style={{ color: "#5b3733" }}
              >
                New Measurement
              </h6>

              <form onSubmit={handleMeasureSubmit}>
                <div className="row g-2">

                  <div className="col-12 col-sm-6 col-lg-3">
                    <input
                      className="form-control"
                      name="title"
                      placeholder="Title (e.g. Blouse)"
                      value={measureData.title}
                      onChange={handleMeasureChange}
                    />
                  </div>

                  <div className="col-6 col-sm-3 col-lg-3">
                    <input
                      className="form-control"
                      name="chest"
                      placeholder="Chest"
                      value={measureData.chest}
                      onChange={handleMeasureChange}
                    />
                  </div>

                  <div className="col-6 col-sm-3 col-lg-3">
                    <input
                      className="form-control"
                      name="waist"
                      placeholder="Waist"
                      value={measureData.waist}
                      onChange={handleMeasureChange}
                    />
                  </div>

                  <div className="col-6 col-sm-3 col-lg-3">
                    <input
                      className="form-control"
                      name="hip"
                      placeholder="Hip"
                      value={measureData.hip}
                      onChange={handleMeasureChange}
                    />
                  </div>

                  <div className="col-6 col-sm-3 col-lg-3">
                    <input
                      className="form-control"
                      name="shoulder"
                      placeholder="Shoulder"
                      value={measureData.shoulder}
                      onChange={handleMeasureChange}
                    />
                  </div>

                  <div className="col-6 col-sm-3 col-lg-3">
                    <input
                      className="form-control"
                      name="sleeveLength"
                      placeholder="Sleeve Length"
                      value={measureData.sleeveLength}
                      onChange={handleMeasureChange}
                    />
                  </div>

                  <div className="col-6 col-sm-3 col-lg-3">
                    <input
                      className="form-control"
                      name="armhole"
                      placeholder="Armhole"
                      value={measureData.armhole}
                      onChange={handleMeasureChange}
                    />
                  </div>

                  <div className="col-6 col-sm-3 col-lg-3">
                    <input
                      className="form-control"
                      name="neck"
                      placeholder="Neck"
                      value={measureData.neck}
                      onChange={handleMeasureChange}
                    />
                  </div>

                  <div className="col-6 col-sm-3 col-lg-3">
                    <input
                      className="form-control"
                      name="topLength"
                      placeholder="Top Length"
                      value={measureData.topLength}
                      onChange={handleMeasureChange}
                    />
                  </div>

                  <div className="col-6 col-sm-3 col-lg-3">
                    <input
                      className="form-control"
                      name="bottomLength"
                      placeholder="Bottom Length"
                      value={measureData.bottomLength}
                      onChange={handleMeasureChange}
                    />
                  </div>

                  <div className="col-6 col-sm-3 col-lg-3">
                    <input
                      className="form-control"
                      name="inseam"
                      placeholder="Inseam"
                      value={measureData.inseam}
                      onChange={handleMeasureChange}
                    />
                  </div>

                  <div className="col-6 col-sm-3 col-lg-3">
                    <select
                      className="form-select"
                      name="unit"
                      value={measureData.unit}
                      onChange={handleMeasureChange}
                    >
                      <option value="inches">Inches</option>
                      <option value="cm">Centimeters</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <input
                      className="form-control"
                      name="notes"
                      placeholder="Notes"
                      value={measureData.notes}
                      onChange={handleMeasureChange}
                    />
                  </div>

                </div>

                <button
                  type="submit"
                  className="btn mt-3"
                  style={{
                    backgroundColor: "#743d4b",
                    color: "#fff8f2",
                    border: "none",
                  }}
                >
                  <i className="bi bi-check2 me-2"></i>
                  Save Measurement
                </button>
              </form>
            </div>
          )}

          {/* Measurements Table */}
          <div className="table-responsive mt-4">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th
                    className="small text-uppercase"
                    style={{ color: "#765b52" }}
                  >
                    Title
                  </th>
                  <th>Chest</th>
                  <th>Waist</th>
                  <th>Hip</th>
                  <th>Shoulder</th>
                  <th>Sleeve</th>
                  <th>Unit</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {measurements.map((m) => (
                  <tr key={m._id}>
                    <td className="fw-semibold">{m.title}</td>
                    <td>{m.chest || "-"}</td>
                    <td>{m.waist || "-"}</td>
                    <td>{m.hip || "-"}</td>
                    <td>{m.shoulder || "-"}</td>
                    <td>{m.sleeveLength || "-"}</td>
                    <td>{m.unit}</td>
                    <td>
                      {new Date(m.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}

                {measurements.length === 0 && (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center text-muted py-4"
                    >
                      <i className="bi bi-rulers d-block fs-3 mb-2"></i>
                      No measurements recorded
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* Orders */}
      <div
        className="card border-0 shadow-sm rounded-4 mb-4"
        style={{ backgroundColor: "#fffaf5" }}
      >
        <div className="card-body p-3 p-md-4">

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5
                className="fw-bold mb-1"
                style={{ color: "#4a2928" }}
              >
                <i
                  className="bi bi-bag me-2"
                  style={{ color: "#743d4b" }}
                ></i>
                Orders
              </h5>

              <small className="text-muted">
                Customer order history.
              </small>
            </div>

            <span
              className="badge rounded-pill"
              style={{
                backgroundColor: "#eee1d7",
                color: "#6e4b45",
              }}
            >
              {orders.length}
            </span>
          </div>

          <div className="list-group">
            {orders.map((o) => (
              <Link
                key={o._id}
                to={`/orders/${o._id}`}
                className="list-group-item list-group-item-action border-0 mb-2 rounded-3"
                style={{ backgroundColor: "#f6eee6" }}
              >
                <div className="d-flex flex-column flex-sm-row justify-content-between gap-2">

                  <div>
                    <div
                      className="fw-semibold"
                      style={{ color: "#5b3437" }}
                    >
                      {o.orderNumber}
                    </div>

                    <small className="text-muted">
                      {o.items}
                    </small>
                  </div>

                  <span
                    className="badge rounded-pill align-self-start"
                    style={{
                      backgroundColor: "#ead7d0",
                      color: "#743d4b",
                    }}
                  >
                    {o.status}
                  </span>

                </div>
              </Link>
            ))}

            {orders.length === 0 && (
              <div
                className="text-center rounded-3 py-4"
                style={{ backgroundColor: "#f7eee5" }}
              >
                <i className="bi bi-bag-x fs-3 d-block mb-2"></i>
                <span className="text-muted">
                  No orders yet
                </span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Design / Reference Images */}
      <div
        className="card border-0 shadow-sm rounded-4"
        style={{ backgroundColor: "#fffaf5" }}
      >
        <div className="card-body p-3 p-md-4">

          <div className="mb-3">
            <h5
              className="fw-bold mb-1"
              style={{ color: "#4a2928" }}
            >
              <i
                className="bi bi-images me-2"
                style={{ color: "#743d4b" }}
              ></i>
              Design / Reference Images
            </h5>

            <small className="text-muted">
              Upload customer designs or reference images.
            </small>
          </div>

          <form
            onSubmit={handleImageUpload}
            className="row g-2 align-items-center"
          >
            <div className="col-12 col-md-5">
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) =>
                  setImageFile(e.target.files[0])
                }
              />
            </div>

            <div className="col-12 col-md-4">
              <input
                className="form-control"
                placeholder="Caption (optional)"
                value={imageCaption}
                onChange={(e) =>
                  setImageCaption(e.target.value)
                }
              />
            </div>

            <div className="col-12 col-md-2">
              <input
                type="number"
                min="0"
                className="form-control"
                placeholder="Price"
                value={imagePrice}
                onChange={(e) =>
                  setImagePrice(e.target.value)
                }
              />
            </div>

            <div className="col-12 col-md-1">
              <button
                type="submit"
                className="btn w-100"
                style={{
                  backgroundColor: "#743d4b",
                  color: "#fff8f2",
                  border: "none",
                }}
              >
                <i className="bi bi-upload me-md-1"></i>
                <span className="d-md-none d-lg-inline">
                  Upload
                </span>
              </button>
            </div>
          </form>

          <div className="row g-3 mt-2">

            {images.map((img) => (
              <div
                className="col-12 col-sm-6 col-md-4 col-lg-3"
                key={img._id}
              >
                <div
                  className="card border-0 shadow-sm rounded-4 overflow-hidden h-100"
                  style={{ backgroundColor: "#f7eee5" }}
                >
                  <img
                    src={`${SERVER_URL}${img.imageUrl}`}
                    alt={
                      img.caption || "design reference"
                    }
                    className="w-100"
                    style={{
                      height: "180px",
                      objectFit: "cover",
                    }}
                  />

                  {img.caption && (
                    <div className="card-body p-3">
                      <small
                        className="fw-semibold"
                        style={{ color: "#5b3733" }}
                      >
                        {img.caption}
                      </small>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {images.length === 0 && (
              <div className="col-12">
                <div
                  className="text-center rounded-4 py-5"
                  style={{ backgroundColor: "#f7eee5" }}
                >
                  <i className="bi bi-image fs-2 d-block mb-2"></i>
                  <p className="text-muted mb-0">
                    No images uploaded yet
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

export default CustomerDetails;