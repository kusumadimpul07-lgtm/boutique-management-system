// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import customerApi, { SERVER_URL } from "../../utils/customerApi";

// function CustomerOrderRequest() {
//   const navigate = useNavigate();
//   const [designs, setDesigns] = useState([]);
//   const [services, setServices] = useState([]);
//   const [designers, setDesigners] = useState([]);
//   const [items, setItems] = useState("");
//   const [notes, setNotes] = useState("");
//   const [referenceFiles, setReferenceFiles] = useState([]);
//   const [deliveryDate, setDeliveryDate] = useState("");
//   const [selectedDesign, setSelectedDesign] = useState(null);
//   const [selectedDesignerId, setSelectedDesignerId] = useState("");
//   const [serviceType, setServiceType] = useState("blouse");
//   const [quantity, setQuantity] = useState(1);
//   const [designerFilter, setDesignerFilter] = useState("All designers");
//   const [categoryFilter, setCategoryFilter] = useState("All categories");
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     Promise.all([
//       customerApi.get("/customer-portal/designs"),
//       customerApi.get("/customer-portal/pricing"),
//       customerApi.get("/customer-portal/designers"),
//     ])
//       .then(([designResponse, pricingResponse, designerResponse]) => {
//         setDesigns(designResponse.data);
//         setServices(pricingResponse.data);
//         setDesigners(designerResponse.data);
//         if (pricingResponse.data.length > 0)
//           setServiceType(pricingResponse.data[0].id);
//       })
//       .catch(() =>
//         setError(
//           "Design inspiration could not be loaded. You can still place a custom request.",
//         ),
//       )
//       .finally(() => setLoading(false));
//   }, []);

//   const chooseDesign = (design) => {
//     setSelectedDesign((current) =>
//       current === design._id ? null : design._id,
//     );
//     setSelectedDesignerId(design.designerId || "");
//     setItems(
//       (current) =>
//         current ||
//         `I would like an outfit inspired by ${design.caption || "this design"}.`,
//     );
//   };

//   const chooseService = (event) => {
//     setServiceType(event.target.value);
//     setSelectedDesign(null);
//   };

//   const chooseDesigner = (event) => {
//     setSelectedDesignerId(event.target.value);
//     setSelectedDesign(null);
//   };

//   const selectedService = services.find(
//     (service) => service.id === serviceType,
//   );
//   const unitPrice = selectedDesign
//     ? Number(
//         designs.find((design) => design._id === selectedDesign)?.price || 0,
//       )
//     : Number(selectedService?.price || 0);
//   const estimatedTotal = unitPrice * Number(quantity || 0);
//   const categories = [
//     "All categories",
//     ...new Set(designs.map((design) => design.category).filter(Boolean)),
//   ];
//   const visibleDesigns = designs.filter(
//     (design) =>
//       (designerFilter === "All designers" ||
//         design.designer === designerFilter) &&
//       (!selectedDesignerId || design.designerId === selectedDesignerId) &&
//       (categoryFilter === "All categories" ||
//         design.category === categoryFilter),
//   );

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setError("");
//     setSubmitting(true);
//     try {
//       const { data } = await customerApi.post("/customer-portal/orders", {
//         items,
//         notes,
//         deliveryDate,
//         designId: selectedDesign || undefined,
//         designerId: selectedDesignerId || undefined,
//         serviceType: selectedDesign ? undefined : serviceType,
//         quantity: Number(quantity),
//       });
//       if (referenceFiles.length > 0) {
//         const formData = new FormData();
//         referenceFiles.forEach((file) => formData.append("images", file));
//         await customerApi.post(
//           `/customer-portal/orders/${data._id}/references`,
//           formData,
//           {
//             headers: { "Content-Type": "multipart/form-data" },
//           },
//         );
//       }
//       navigate(`/customer/orders/${data._id}`);
//     } catch (submitError) {
//       setError(
//         submitError.response?.data?.message ||
//           "Could not submit your request. Please try again.",
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div>
//       <div className="d-flex justify-content-between align-items-start mb-4 gap-3">
//         <div>
//           <Link
//             to="/customer/orders"
//             className="text-muted text-decoration-none"
//           >
//             My Orders
//           </Link>
//           <h3 className="mb-1 mt-2">Create your next look</h3>
//           <p className="text-muted mb-0">
//             Choose an inspiration or describe exactly what you want. Our team
//             will review it and confirm the price.
//           </p>
//         </div>
//       </div>

//       {error && <div className="alert alert-danger">{error}</div>}

//       <div className="row g-4">
//         <div className="col-lg-7">
//           <div className="card p-4 h-100">
//             <h5 className="mb-3">Design inspiration</h5>
//             {loading && <p className="text-muted">Loading designs...</p>}
//             {!loading && designs.length === 0 && (
//               <p className="text-muted">
//                 No designs have been added yet. Use the request form to share
//                 your own idea.
//               </p>
//             )}
//             <div className="row g-2 mb-3">
//               <div className="col-sm-6">
//                 <select
//                   className="form-select form-select-sm"
//                   value={designerFilter}
//                   onChange={(event) => setDesignerFilter(event.target.value)}
//                 >
//                   <option>All designers</option>
//                   {designers.map((designer) => (
//                     <option key={designer.name}>{designer.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="col-sm-6">
//                 <select
//                   className="form-select form-select-sm"
//                   value={categoryFilter}
//                   onChange={(event) => setCategoryFilter(event.target.value)}
//                 >
//                   <option>All categories</option>
//                   {categories.slice(1).map((category) => (
//                     <option key={category}>{category}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//             <div className="row g-3">
//               {visibleDesigns.map((design) => (
//                 <div className="col-sm-6" key={design._id}>
//                   <button
//                     type="button"
//                     className={`catalog-design w-100 p-0 ${selectedDesign === design._id ? "selected" : ""}`}
//                     onClick={() => chooseDesign(design)}
//                   >
//                     <img
//                       src={`${SERVER_URL}${design.imageUrl}`}
//                       alt={design.caption || "Boutique design inspiration"}
//                     />
//                     <span>
//                       {design.caption || "Use this design"}{" "}
//                       <strong>Rs. {design.price} each</strong>
//                       <small className="d-block text-muted">
//                         <span className="catalog-designer-line">
//                           {design.designerProfilePicture ? (
//                             <img
//                               src={`${SERVER_URL}${design.designerProfilePicture}`}
//                               alt=""
//                               className="catalog-designer-avatar"
//                             />
//                           ) : (
//                             <span className="catalog-designer-avatar catalog-designer-fallback">
//                               {design.designer?.slice(0, 1) || "B"}
//                             </span>
//                           )}
//                           {design.designer}{" "}
//                         </span>
//                         {design.category && `· ${design.category}`}
//                       </small>
//                     </span>
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="col-lg-5">
//           <div className="card p-4">
//             <h5 className="mb-3">Your request</h5>
//             <form onSubmit={handleSubmit}>
//               <label className="form-label">Choose a designer</label>
//               <select
//                 className="form-select mb-3"
//                 value={selectedDesignerId}
//                 onChange={chooseDesigner}
//                 required
//               >
//                 <option value="">Select designer</option>
//                 {designers.map((designer) => (
//                   <option key={designer._id} value={designer._id}>
//                     {designer.name}
//                   </option>
//                 ))}
//               </select>
//               {selectedDesign && (
//                 <div className="alert alert-info py-2">
//                   This design is assigned to{" "}
//                   {designers.find(
//                     (designer) => designer._id === selectedDesignerId,
//                   )?.name || "the selected designer"}
//                   .
//                 </div>
//               )}
//               <label className="form-label">What are you ordering?</label>
//               <select
//                 className="form-select mb-3"
//                 value={serviceType}
//                 onChange={chooseService}
//                 disabled={Boolean(selectedDesign)}
//                 required
//               >
//                 {services.map((service) => (
//                   <option key={service.id} value={service.id}>
//                     {service.name} - Rs. {service.price}
//                   </option>
//                 ))}
//               </select>
//               {selectedDesign && (
//                 <div className="alert alert-info py-2">
//                   Selected design pricing is being used. Choose a custom service
//                   above to switch back.
//                 </div>
//               )}

//               <label className="form-label">Quantity</label>
//               <input
//                 type="number"
//                 className="form-control mb-3"
//                 min="1"
//                 max="20"
//                 step="1"
//                 value={quantity}
//                 onChange={(event) => setQuantity(event.target.value)}
//                 required
//               />

//               <label className="form-label">What would you like made?</label>
//               <textarea
//                 className="form-control mb-3"
//                 rows="5"
//                 value={items}
//                 onChange={(event) => setItems(event.target.value)}
//                 placeholder="Example: A silk blouse with elbow-length sleeves, boat neck and matching lining"
//                 required
//               />

//               <label className="form-label">
//                 Reference photos{" "}
//                 <span className="text-muted">(optional, up to 5 images)</span>
//               </label>
//               <input
//                 type="file"
//                 className="form-control mb-3"
//                 accept="image/jpeg,image/png,image/gif,image/webp"
//                 multiple
//                 onChange={(event) =>
//                   setReferenceFiles(Array.from(event.target.files).slice(0, 5))
//                 }
//               />
//               {referenceFiles.length > 0 && (
//                 <small className="text-muted d-block mb-3">
//                   {referenceFiles.length} reference photo
//                   {referenceFiles.length === 1 ? "" : "s"} selected.
//                 </small>
//               )}

//               <div className="d-flex justify-content-between align-items-center border-top border-bottom py-3 mb-3">
//                 <span>Estimated total</span>
//                 <strong>Rs. {estimatedTotal.toLocaleString("en-IN")}</strong>
//               </div>

//               <label className="form-label">
//                 Preferred delivery date{" "}
//                 <span className="text-muted">(optional)</span>
//               </label>
//               <input
//                 type="date"
//                 className="form-control mb-3"
//                 value={deliveryDate}
//                 onChange={(event) => setDeliveryDate(event.target.value)}
//                 min={new Date().toISOString().split("T")[0]}
//               />

//               <label className="form-label">
//                 Measurements or other notes{" "}
//                 <span className="text-muted">(optional)</span>
//               </label>
//               <textarea
//                 className="form-control mb-3"
//                 rows="4"
//                 value={notes}
//                 onChange={(event) => setNotes(event.target.value)}
//                 placeholder="Fabric, color, measurements, occasion, or anything else we should know"
//               />

//               <button
//                 type="submit"
//                 className="btn btn-dark w-100"
//                 disabled={submitting}
//               >
//                 {submitting ? "Sending request..." : "Send order request"}
//               </button>
//               <p className="small text-muted mt-3 mb-0">
//                 You will be taken to payment after submitting. The shop may
//                 contact you if measurements or final customization changes the
//                 estimate.
//               </p>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CustomerOrderRequest;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import customerApi, { SERVER_URL } from "../../utils/customerApi";

function CustomerOrderRequest() {
  const navigate = useNavigate();

  const [designs, setDesigns] = useState([]);
  const [services, setServices] = useState([]);
  const [designers, setDesigners] = useState([]);

  const [items, setItems] = useState("");
  const [notes, setNotes] = useState("");
  const [referenceFiles, setReferenceFiles] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState("");

  const [selectedDesign, setSelectedDesign] = useState(null);
  const [selectedDesignerId, setSelectedDesignerId] = useState("");
  const [serviceType, setServiceType] = useState("blouse");
  const [quantity, setQuantity] = useState(1);

  const [designerFilter, setDesignerFilter] = useState("All designers");
  const [categoryFilter, setCategoryFilter] = useState("All categories");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      customerApi.get("/customer-portal/designs"),
      customerApi.get("/customer-portal/pricing"),
      customerApi.get("/customer-portal/designers"),
    ])
      .then(([designResponse, pricingResponse, designerResponse]) => {
        setDesigns(designResponse.data);
        setServices(pricingResponse.data);
        setDesigners(designerResponse.data);

        if (pricingResponse.data.length > 0) {
          setServiceType(pricingResponse.data[0].id);
        }
      })
      .catch(() =>
        setError(
          "Design inspiration could not be loaded. You can still place a custom request.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  const chooseDesign = (design) => {
    setSelectedDesign((current) =>
      current === design._id ? null : design._id,
    );

    setSelectedDesignerId(design.designerId || "");

    setItems(
      (current) =>
        current ||
        `I would like an outfit inspired by ${design.caption || "this design"}.`,
    );
  };

  const chooseService = (event) => {
    setServiceType(event.target.value);
    setSelectedDesign(null);
  };

  const chooseDesigner = (event) => {
    setSelectedDesignerId(event.target.value);
    setSelectedDesign(null);
  };

  const selectedService = services.find(
    (service) => service.id === serviceType,
  );

  const unitPrice = selectedDesign
    ? Number(
        designs.find((design) => design._id === selectedDesign)?.price || 0,
      )
    : Number(selectedService?.price || 0);

  const estimatedTotal = unitPrice * Number(quantity || 0);

  const categories = [
    "All categories",
    ...new Set(designs.map((design) => design.category).filter(Boolean)),
  ];

  const visibleDesigns = designs.filter(
    (design) =>
      (designerFilter === "All designers" ||
        design.designer === designerFilter) &&
      (!selectedDesignerId || design.designerId === selectedDesignerId) &&
      (categoryFilter === "All categories" ||
        design.category === categoryFilter),
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const { data } = await customerApi.post("/customer-portal/orders", {
        items,
        notes,
        deliveryDate,
        designId: selectedDesign || undefined,
        designerId: selectedDesignerId || undefined,
        serviceType: selectedDesign ? undefined : serviceType,
        quantity: Number(quantity),
      });

      if (referenceFiles.length > 0) {
        const formData = new FormData();

        referenceFiles.forEach((file) => {
          formData.append("images", file);
        });

        await customerApi.post(
          `/customer-portal/orders/${data._id}/references`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
      }

      navigate(`/customer/orders/${data._id}`);
    } catch (submitError) {
      setError(
        submitError.response?.data?.message ||
          "Could not submit your request. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="container-fluid px-2 px-md-4 py-3 py-md-4"
      style={{
        backgroundColor: "#fffaf5",
        minHeight: "100vh",
        color: "#4a2928",
      }}
    >
      {/* PAGE HEADER */}
      <div className="mb-4">
        <Link
          to="/customer/orders"
          className="text-decoration-none small fw-semibold"
          style={{ color: "#743d4b" }}
        >
          <i className="bi bi-arrow-left me-1"></i>
          My Orders
        </Link>

        <div className="mt-3">
          <span
            className="badge rounded-pill px-3 py-2 mb-2"
            style={{
              backgroundColor: "#ead7d0",
              color: "#743d4b",
              fontWeight: "500",
            }}
          >
            BOUTIQ • CUSTOM REQUEST
          </span>

          <h2 className="fw-bold mb-1" style={{ color: "#4a2928" }}>
            Create Your Next Look
          </h2>

          <p className="mb-0" style={{ color: "#765d57" }}>
            Choose an inspiration or describe exactly what you want.
            Our team will review it and confirm the price.
          </p>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div
          className="alert d-flex align-items-start gap-2 mb-4 border-0 rounded-3"
          style={{
            backgroundColor: "#f3dfdb",
            color: "#743d4b",
          }}
        >
          <i className="bi bi-exclamation-circle-fill mt-1"></i>
          <span>{error}</span>
        </div>
      )}

      <div className="row g-4">
        {/* LEFT - DESIGN CATALOG */}
        <div className="col-12 col-lg-7">
          <div
            className="card h-100 border-0 rounded-4 overflow-hidden"
            style={{
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 18px rgba(116, 61, 75, 0.08)",
              border: "1px solid #eadfd7",
            }}
          >
            <div className="card-body p-3 p-md-4">
              {/* SECTION HEADER */}
              <div className="d-flex align-items-center gap-3 mb-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: "44px",
                    height: "44px",
                    backgroundColor: "#ead7d0",
                    color: "#743d4b",
                  }}
                >
                  <i className="bi bi-palette fs-5"></i>
                </div>

                <div>
                  <h5 className="fw-bold mb-0" style={{ color: "#4a2928" }}>
                    Design Inspiration
                  </h5>

                  <small style={{ color: "#806b65" }}>
                    Select a design to use as inspiration
                  </small>
                </div>
              </div>

              {/* LOADING */}
              {loading && (
                <div className="text-center py-5">
                  <div
                    className="spinner-border mb-3"
                    role="status"
                    style={{ color: "#743d4b" }}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>

                  <p className="mb-0" style={{ color: "#806b65" }}>
                    Loading designs...
                  </p>
                </div>
              )}

              {/* EMPTY */}
              {!loading && designs.length === 0 && (
                <div
                  className="text-center py-5 rounded-4"
                  style={{ backgroundColor: "#f7eee5" }}
                >
                  <i
                    className="bi bi-images fs-1"
                    style={{ color: "#b9938b" }}
                  ></i>

                  <h6 className="fw-semibold mt-3" style={{ color: "#4a2928" }}>
                    No designs available
                  </h6>

                  <p className="mb-0 px-3" style={{ color: "#806b65" }}>
                    You can still use the request form to share your own idea.
                  </p>
                </div>
              )}

              {/* FILTERS */}
              {!loading && designs.length > 0 && (
                <>
                  <div
                    className="rounded-4 p-3 mb-4"
                    style={{
                      backgroundColor: "#f7eee5",
                      border: "1px solid #eadfd7",
                    }}
                  >
                    <div className="row g-3">
                      <div className="col-12 col-sm-6">
                        <label
                          className="form-label small fw-semibold mb-1"
                          style={{ color: "#5b3733" }}
                        >
                          Designer
                        </label>

                        <select
                          className="form-select border-0 shadow-sm"
                          value={designerFilter}
                          onChange={(event) =>
                            setDesignerFilter(event.target.value)
                          }
                          style={{
                            backgroundColor: "#ffffff",
                            color: "#4a2928",
                          }}
                        >
                          <option>All designers</option>

                          {designers.map((designer) => (
                            <option
                              key={designer.name}
                              value={designer.name}
                            >
                              {designer.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-12 col-sm-6">
                        <label
                          className="form-label small fw-semibold mb-1"
                          style={{ color: "#5b3733" }}
                        >
                          Category
                        </label>

                        <select
                          className="form-select border-0 shadow-sm"
                          value={categoryFilter}
                          onChange={(event) =>
                            setCategoryFilter(event.target.value)
                          }
                          style={{
                            backgroundColor: "#ffffff",
                            color: "#4a2928",
                          }}
                        >
                          <option>All categories</option>

                          {categories.slice(1).map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* DESIGNS */}
                  <div className="row g-3">
                    {visibleDesigns.map((design) => {
                      const isSelected = selectedDesign === design._id;

                      return (
                        <div
                          className="col-12 col-sm-6"
                          key={design._id}
                        >
                          <button
                            type="button"
                            className="btn w-100 text-start p-0 overflow-hidden"
                            onClick={() => chooseDesign(design)}
                            style={{
                              backgroundColor: "#ffffff",
                              borderRadius: "16px",
                              border: isSelected
                                ? "3px solid #743d4b"
                                : "1px solid #eadfd7",
                              boxShadow: isSelected
                                ? "0 5px 18px rgba(116, 61, 75, 0.16)"
                                : "0 3px 12px rgba(116, 61, 75, 0.06)",
                            }}
                          >
                            {/* IMAGE */}
                            <div className="position-relative">
                              <img
                                src={`${SERVER_URL}${design.imageUrl}`}
                                alt={
                                  design.caption ||
                                  "Boutique design inspiration"
                                }
                                className="img-fluid w-100"
                                style={{
                                  height: "250px",
                                  objectFit: "cover",
                                }}
                              />

                              {isSelected && (
                                <span
                                  className="position-absolute top-0 end-0 m-2 badge rounded-pill px-3 py-2"
                                  style={{
                                    backgroundColor: "#743d4b",
                                    color: "#ffffff",
                                  }}
                                >
                                  <i className="bi bi-check-lg me-1"></i>
                                  Selected
                                </span>
                              )}
                            </div>

                            {/* DESIGN INFO */}
                            <div className="p-3">
                              <div className="d-flex justify-content-between align-items-start gap-2">
                                <div>
                                  <div
                                    className="fw-semibold"
                                    style={{ color: "#4a2928" }}
                                  >
                                    {design.caption || "Use this design"}
                                  </div>

                                  {design.category && (
                                    <small style={{ color: "#806b65" }}>
                                      {design.category}
                                    </small>
                                  )}
                                </div>

                                <span
                                  className="badge text-nowrap rounded-pill"
                                  style={{
                                    backgroundColor: "#f2e7dc",
                                    color: "#743d4b",
                                  }}
                                >
                                  Rs. {design.price}
                                </span>
                              </div>

                              {/* DESIGNER */}
                              <div className="d-flex align-items-center gap-2 mt-3">
                                {design.designerProfilePicture ? (
                                  <img
                                    src={`${SERVER_URL}${design.designerProfilePicture}`}
                                    alt=""
                                    className="rounded-circle"
                                    style={{
                                      width: "34px",
                                      height: "34px",
                                      objectFit: "cover",
                                    }}
                                  />
                                ) : (
                                  <span
                                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-semibold"
                                    style={{
                                      width: "34px",
                                      height: "34px",
                                      backgroundColor: "#ead7d0",
                                      color: "#743d4b",
                                    }}
                                  >
                                    {design.designer?.slice(0, 1) || "B"}
                                  </span>
                                )}

                                <div>
                                  <small
                                    className="d-block"
                                    style={{ color: "#907872" }}
                                  >
                                    Designed by
                                  </small>

                                  <small
                                    className="fw-semibold"
                                    style={{ color: "#5b3733" }}
                                  >
                                    {design.designer}
                                  </small>
                                </div>
                              </div>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {visibleDesigns.length === 0 && (
                    <div className="text-center py-5">
                      <i
                        className="bi bi-search fs-2"
                        style={{ color: "#b9938b" }}
                      ></i>

                      <p
                        className="mb-0 mt-2"
                        style={{ color: "#806b65" }}
                      >
                        No designs match your selected filters.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT - REQUEST FORM */}
        <div className="col-12 col-lg-5">
          <div
            className="card border-0 rounded-4"
            style={{
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 18px rgba(116, 61, 75, 0.08)",
              border: "1px solid #eadfd7",
            }}
          >
            <div className="card-body p-3 p-md-4">
              {/* FORM HEADER */}
              <div className="d-flex align-items-center gap-3 mb-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: "44px",
                    height: "44px",
                    backgroundColor: "#ead7d0",
                    color: "#743d4b",
                  }}
                >
                  <i className="bi bi-pencil-square fs-5"></i>
                </div>

                <div>
                  <h5 className="fw-bold mb-0" style={{ color: "#4a2928" }}>
                    Your Request
                  </h5>

                  <small style={{ color: "#806b65" }}>
                    Tell us what you'd like made
                  </small>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* DESIGNER */}
                <div className="mb-3">
                  <label
                    className="form-label fw-semibold"
                    style={{ color: "#5b3733" }}
                  >
                    Choose a designer
                  </label>

                  <select
                    className="form-select"
                    value={selectedDesignerId}
                    onChange={chooseDesigner}
                    required
                    style={{
                      borderColor: "#e5d5cc",
                      color: "#4a2928",
                    }}
                  >
                    <option value="">Select designer</option>

                    {designers.map((designer) => (
                      <option key={designer._id} value={designer._id}>
                        {designer.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SELECTED DESIGN MESSAGE */}
                {selectedDesign && (
                  <div
                    className="d-flex gap-2 py-2 px-3 rounded-3 mb-3"
                    style={{
                      backgroundColor: "#e3eee0",
                      color: "#52614c",
                    }}
                  >
                    <i className="bi bi-info-circle mt-1"></i>

                    <small>
                      This design is assigned to{" "}
                      <strong>
                        {designers.find(
                          (designer) =>
                            designer._id === selectedDesignerId,
                        )?.name || "the selected designer"}
                      </strong>
                      .
                    </small>
                  </div>
                )}

                {/* SERVICE */}
                <div className="mb-3">
                  <label
                    className="form-label fw-semibold"
                    style={{ color: "#5b3733" }}
                  >
                    What are you ordering?
                  </label>

                  <select
                    className="form-select"
                    value={serviceType}
                    onChange={chooseService}
                    disabled={Boolean(selectedDesign)}
                    required
                    style={{
                      borderColor: "#e5d5cc",
                      color: "#4a2928",
                    }}
                  >
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} - Rs. {service.price}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedDesign && (
                  <div
                    className="py-2 px-3 rounded-3 mb-3"
                    style={{
                      backgroundColor: "#f4e8d8",
                      color: "#76553e",
                    }}
                  >
                    <small>
                      <i className="bi bi-tag me-1"></i>
                      Selected design pricing is being used. Choose a custom
                      service above to switch back.
                    </small>
                  </div>
                )}

                {/* QUANTITY */}
                <div className="mb-3">
                  <label
                    className="form-label fw-semibold"
                    style={{ color: "#5b3733" }}
                  >
                    Quantity
                  </label>

                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    max="20"
                    step="1"
                    value={quantity}
                    onChange={(event) =>
                      setQuantity(event.target.value)
                    }
                    required
                    style={{
                      borderColor: "#e5d5cc",
                      color: "#4a2928",
                    }}
                  />
                </div>

                {/* ITEMS */}
                <div className="mb-3">
                  <label
                    className="form-label fw-semibold"
                    style={{ color: "#5b3733" }}
                  >
                    What would you like made?
                  </label>

                  <textarea
                    className="form-control"
                    rows="4"
                    value={items}
                    onChange={(event) =>
                      setItems(event.target.value)
                    }
                    placeholder="Example: A silk blouse with elbow-length sleeves, boat neck and matching lining"
                    required
                    style={{
                      borderColor: "#e5d5cc",
                      color: "#4a2928",
                    }}
                  />
                </div>

                {/* REFERENCE PHOTOS */}
                <div className="mb-3">
                  <label
                    className="form-label fw-semibold"
                    style={{ color: "#5b3733" }}
                  >
                    Reference photos{" "}
                    <span
                      className="fw-normal"
                      style={{ color: "#907872" }}
                    >
                      (optional, up to 5)
                    </span>
                  </label>

                  <input
                    type="file"
                    className="form-control"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    multiple
                    onChange={(event) =>
                      setReferenceFiles(
                        Array.from(event.target.files).slice(0, 5),
                      )
                    }
                    style={{
                      borderColor: "#e5d5cc",
                    }}
                  />

                  {referenceFiles.length > 0 && (
                    <div
                      className="border-0 mt-2 py-2 px-3 rounded-3"
                      style={{
                        backgroundColor: "#f7eee5",
                        color: "#6b4843",
                      }}
                    >
                      <small>
                        <i className="bi bi-images me-1"></i>
                        {referenceFiles.length} reference photo
                        {referenceFiles.length === 1 ? "" : "s"} selected.
                      </small>
                    </div>
                  )}
                </div>

                {/* ESTIMATED TOTAL */}
                <div
                  className="rounded-4 p-3 my-4"
                  style={{
                    backgroundColor: "#743d4b",
                    color: "#ffffff",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center gap-3">
                    <div>
                      <small style={{ opacity: 0.8 }}>
                        Estimated Total
                      </small>

                      <div
                        className="small"
                        style={{ opacity: 0.8 }}
                      >
                        {quantity} × Rs.{" "}
                        {unitPrice.toLocaleString("en-IN")}
                      </div>
                    </div>

                    <strong className="fs-4 text-nowrap">
                      Rs. {estimatedTotal.toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>

                {/* DELIVERY DATE */}
                <div className="mb-3">
                  <label
                    className="form-label fw-semibold"
                    style={{ color: "#5b3733" }}
                  >
                    Preferred delivery date{" "}
                    <span
                      className="fw-normal"
                      style={{ color: "#907872" }}
                    >
                      (optional)
                    </span>
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    value={deliveryDate}
                    onChange={(event) =>
                      setDeliveryDate(event.target.value)
                    }
                    min={new Date().toISOString().split("T")[0]}
                    style={{
                      borderColor: "#e5d5cc",
                      color: "#4a2928",
                    }}
                  />
                </div>

                {/* NOTES */}
                <div className="mb-3">
                  <label
                    className="form-label fw-semibold"
                    style={{ color: "#5b3733" }}
                  >
                    Measurements or other notes{" "}
                    <span
                      className="fw-normal"
                      style={{ color: "#907872" }}
                    >
                      (optional)
                    </span>
                  </label>

                  <textarea
                    className="form-control"
                    rows="3"
                    value={notes}
                    onChange={(event) =>
                      setNotes(event.target.value)
                    }
                    placeholder="Fabric, color, measurements, occasion, or anything else we should know"
                    style={{
                      borderColor: "#e5d5cc",
                      color: "#4a2928",
                    }}
                  />
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="btn w-100 py-2 fw-semibold"
                  disabled={submitting}
                  style={{
                    backgroundColor: "#743d4b",
                    color: "#ffffff",
                    border: "none",
                  }}
                >
                  {submitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Sending request...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-2"></i>
                      Send Order Request
                    </>
                  )}
                </button>

                {/* INFO */}
                <div className="d-flex gap-2 mt-3">
                  <i
                    className="bi bi-info-circle"
                    style={{ color: "#907872" }}
                  ></i>

                  <p
                    className="small mb-0"
                    style={{ color: "#806b65" }}
                  >
                    After submitting, you'll be taken to your order. The shop
                    may contact you if measurements or final customization
                    changes the estimate.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerOrderRequest;