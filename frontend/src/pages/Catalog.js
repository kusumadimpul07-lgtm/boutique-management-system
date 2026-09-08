// import React, { useEffect, useState } from "react";
// import api, { SERVER_URL } from "../utils/api";
// import { useAuth } from "../context/AuthContext";

// const emptyForm = {
//   caption: "",
//   designer: "",
//   designerId: "",
//   category: "Blouses",
//   price: "",
// };

// function Catalog() {
//   const [designs, setDesigns] = useState([]);
//   const [form, setForm] = useState(emptyForm);
//   const [image, setImage] = useState(null);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [designers, setDesigners] = useState([]);
//   const { user } = useAuth();

//   useEffect(() => {
//     fetchCatalog();
//     if (user?.role === "owner") {
//       api
//         .get("/staff")
//         .then(({ data }) =>
//           setDesigners(
//             data.filter(
//               (member) => member.role === "designer" && member.isActive,
//             ),
//           ),
//         )
//         .catch(() => setError("Could not load designers."));
//     }
//   }, []);

//   const fetchCatalog = async () => {
//     try {
//       const { data } = await api.get("/designs/catalog");
//       setDesigns(data);
//     } catch (fetchError) {
//       setError("Could not load the catalog.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setMessage("");
//     setError("");
//     if (!image) {
//       setError("Please select a design image.");
//       return;
//     }
//     setSaving(true);
//     const formData = new FormData();
//     Object.entries(form).forEach(([key, value]) => formData.append(key, value));
//     formData.append("image", image);
//     try {
//       await api.post("/designs/catalog", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setForm(emptyForm);
//       setImage(null);
//       document.getElementById("catalog-image-input").value = "";
//       setMessage("Design added to the customer catalog.");
//       fetchCatalog();
//     } catch (saveError) {
//       setError(
//         saveError.response?.data?.message || "Could not add this design.",
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   const removeDesign = async (id) => {
//     if (!window.confirm("Remove this design from the customer catalog?"))
//       return;
//     try {
//       await api.delete(`/designs/${id}`);
//       setDesigns((current) => current.filter((design) => design._id !== id));
//     } catch (deleteError) {
//       setError("Could not remove this design.");
//     }
//   };

//   return (
//     <div>
//       <div className="d-flex justify-content-between align-items-end mb-4">
//         <div>
//           <p className="eyebrow mb-1">OWNER STUDIO</p>
//           <h2 className="mb-1">Design catalog</h2>
//           <p className="text-muted mb-0">
//             Publish designs customers can browse, price, and order.
//           </p>
//         </div>
//         <span className="badge bg-light text-dark border">
//           {designs.length} published
//         </span>
//       </div>
//       {message && <div className="alert alert-success py-2">{message}</div>}
//       {error && <div className="alert alert-danger py-2">{error}</div>}

//       <div className="row g-4">
//         <div className="col-lg-4">
//           <div className="card p-4">
//             <h5 className="mb-1">Publish a design</h5>
//             <p className="text-muted small mb-3">
//               Customers will see the designer, category, image, and starting
//               price.
//             </p>
//             <form onSubmit={handleSubmit}>
//               <label className="form-label">Design image</label>
//               <input
//                 id="catalog-image-input"
//                 type="file"
//                 accept="image/*"
//                 className="form-control mb-3"
//                 onChange={(event) => setImage(event.target.files[0])}
//                 required
//               />
//               <label className="form-label">Design name</label>
//               <input
//                 className="form-control mb-3"
//                 value={form.caption}
//                 onChange={(event) =>
//                   setForm({ ...form, caption: event.target.value })
//                 }
//                 placeholder="Example: Pearl neckline blouse"
//               />
//               <label className="form-label">Designer</label>
//               {user?.role === "owner" ? (
//                 <select
//                   className="form-select mb-3"
//                   value={form.designerId}
//                   onChange={(event) =>
//                     setForm({ ...form, designerId: event.target.value })
//                   }
//                   required
//                 >
//                   <option value="">Select designer</option>
//                   {designers.map((designer) => (
//                     <option key={designer._id} value={designer._id}>
//                       {designer.name}
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <input
//                   className="form-control mb-3"
//                   value={user?.name || ""}
//                   disabled
//                 />
//               )}
//               <label className="form-label">Category</label>
//               <select
//                 className="form-select mb-3"
//                 value={form.category}
//                 onChange={(event) =>
//                   setForm({ ...form, category: event.target.value })
//                 }
//               >
//                 <option>Blouses</option>
//                 <option>Sarees</option>
//                 <option>Dresses</option>
//                 <option>Salwar Suits</option>
//                 <option>Lehengas</option>
//                 <option>Kurtis</option>
//                 <option>Gowns</option>
//                 <option>Bridal Wear</option>
//                 <option>Men's Wear</option>
//                 <option>Kids Wear</option>
//                 <option>Alterations</option>
//                 <option>Accessories</option>
//               </select>
//               <label className="form-label">Starting price (Rs.)</label>
//               <input
//                 type="number"
//                 min="1"
//                 className="form-control mb-3"
//                 value={form.price}
//                 onChange={(event) =>
//                   setForm({ ...form, price: event.target.value })
//                 }
//                 required
//               />
//               <button className="btn btn-dark w-100" disabled={saving}>
//                 {saving ? "Publishing..." : "Publish to catalog"}
//               </button>
//             </form>
//           </div>
//         </div>
//         <div className="col-lg-8">
//           {loading ? (
//             <p className="text-muted">Loading catalog...</p>
//           ) : (
//             <div className="row g-3">
//               {designs.map((design) => (
//                 <div className="col-md-6 col-xl-4" key={design._id}>
//                   <div className="card h-100 overflow-hidden">
//                     <img
//                       src={`${SERVER_URL}${design.imageUrl}`}
//                       alt={design.caption || design.category}
//                       className="catalog-admin-image"
//                     />
//                     <div className="p-3">
//                       <span className="text-muted small">
//                         {design.category}
//                       </span>
//                       <h6 className="mt-1 mb-1">
//                         {design.caption || "Untitled design"}
//                       </h6>
//                       <p className="small mb-2">By {design.designer}</p>
//                       <div className="d-flex justify-content-between align-items-center">
//                         <strong>Rs. {design.price}</strong>
//                         <button
//                           type="button"
//                           className="btn btn-sm btn-outline-danger"
//                           onClick={() => removeDesign(design._id)}
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               {designs.length === 0 && (
//                 <div className="portal-empty">
//                   <h5>Your catalog is empty.</h5>
//                   <p className="mb-0">
//                     Publish the first design for customers to discover.
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Catalog;


import React, { useEffect, useState } from "react";
import api, { SERVER_URL } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  caption: "",
  designer: "",
  designerId: "",
  category: "Blouses",
  price: "",
};

function Catalog() {
  const [designs, setDesigns] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [designers, setDesigners] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchCatalog();
    if (user?.role === "owner") {
      api
        .get("/staff")
        .then(({ data }) =>
          setDesigners(
            data.filter(
              (member) => member.role === "designer" && member.isActive,
            ),
          ),
        )
        .catch(() => setError("Could not load designers."));
    }
  }, []);

  const fetchCatalog = async () => {
    try {
      const { data } = await api.get("/designs/catalog");
      setDesigns(data);
    } catch (fetchError) {
      setError("Could not load the catalog.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!image) {
      setError("Please select a design image.");
      return;
    }

    setSaving(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, value),
    );
    formData.append("image", image);

    try {
      await api.post("/designs/catalog", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm(emptyForm);
      setImage(null);
      document.getElementById("catalog-image-input").value = "";
      setMessage("Design added to the customer catalog.");
      fetchCatalog();
    } catch (saveError) {
      setError(
        saveError.response?.data?.message || "Could not add this design.",
      );
    } finally {
      setSaving(false);
    }
  };

  const removeDesign = async (id) => {
    if (!window.confirm("Remove this design from the customer catalog?"))
      return;

    try {
      await api.delete(`/designs/${id}`);
      setDesigns((current) =>
        current.filter((design) => design._id !== id),
      );
    } catch (deleteError) {
      setError("Could not remove this design.");
    }
  };

  return (
    <div className="container-fluid px-2 px-md-3">

      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
        <div>
          <div
            className="text-uppercase small fw-semibold mb-2"
            style={{ color: "#7b3f4f", letterSpacing: "2px" }}
          >
            OWNER STUDIO
          </div>

          <h2
            className="fw-bold mb-1"
            style={{ color: "#4a2928" }}
          >
            Design Catalog
          </h2>

          <p className="text-muted mb-0">
            Publish designs customers can browse, price, and order.
          </p>
        </div>

        <span
          className="badge rounded-pill px-3 py-2 align-self-start align-self-md-auto"
          style={{
            backgroundColor: "#f2e4d5",
            color: "#6d3d3d",
            border: "1px solid #dfcabb",
          }}
        >
          <i className="bi bi-grid-3x3-gap me-1"></i>
          {designs.length} published
        </span>
      </div>

      {/* Messages */}
      {message && (
        <div
          className="alert border-0 rounded-3 d-flex align-items-center gap-2"
          style={{
            backgroundColor: "#e9f0e5",
            color: "#52634a",
          }}
        >
          <i className="bi bi-check-circle-fill"></i>
          {message}
        </div>
      )}

      {error && (
        <div
          className="alert border-0 rounded-3 d-flex align-items-center gap-2"
          style={{
            backgroundColor: "#f5e3e0",
            color: "#794545",
          }}
        >
          <i className="bi bi-exclamation-circle-fill"></i>
          {error}
        </div>
      )}

      <div className="row g-4">

        {/* Publish Form */}
        <div className="col-12 col-lg-4">
          <div
            className="card border-0 shadow-sm rounded-4 h-100"
            style={{ backgroundColor: "#f8f1e8" }}
          >
            <div className="card-body p-3 p-md-4">

              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: "46px",
                    height: "46px",
                    backgroundColor: "#ead7d0",
                    color: "#743d4b",
                  }}
                >
                  <i className="bi bi-plus-lg fs-5"></i>
                </div>

                <div>
                  <h5 className="fw-bold mb-1" style={{ color: "#4a2928" }}>
                    Publish a Design
                  </h5>
                  <p className="text-muted small mb-0">
                    Add a new piece to your customer catalog.
                  </p>
                </div>
              </div>

              <hr style={{ borderColor: "#ddcfc2" }} />

              <form onSubmit={handleSubmit}>

                {/* Image */}
                <label className="form-label fw-semibold">
                  <i
                    className="bi bi-image me-2"
                    style={{ color: "#7b3f4f" }}
                  ></i>
                  Design Image
                </label>

                <input
                  id="catalog-image-input"
                  type="file"
                  accept="image/*"
                  className="form-control mb-3"
                  onChange={(event) =>
                    setImage(event.target.files[0])
                  }
                  required
                />

                {/* Design Name */}
                <label className="form-label fw-semibold">
                  <i
                    className="bi bi-pencil me-2"
                    style={{ color: "#7b3f4f" }}
                  ></i>
                  Design Name
                </label>

                <input
                  className="form-control mb-3"
                  value={form.caption}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      caption: event.target.value,
                    })
                  }
                  placeholder="Example: Pearl neckline blouse"
                />

                {/* Designer */}
                <label className="form-label fw-semibold">
                  <i
                    className="bi bi-person me-2"
                    style={{ color: "#7b3f4f" }}
                  ></i>
                  Designer
                </label>

                {user?.role === "owner" ? (
                  <select
                    className="form-select mb-3"
                    value={form.designerId}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        designerId: event.target.value,
                      })
                    }
                    required
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
                ) : (
                  <input
                    className="form-control mb-3"
                    value={user?.name || ""}
                    disabled
                  />
                )}

                {/* Category */}
                <label className="form-label fw-semibold">
                  <i
                    className="bi bi-tag me-2"
                    style={{ color: "#7b3f4f" }}
                  ></i>
                  Category
                </label>

                <select
                  className="form-select mb-3"
                  value={form.category}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      category: event.target.value,
                    })
                  }
                >
                  <option>Blouses</option>
                  <option>Sarees</option>
                  <option>Dresses</option>
                  <option>Salwar Suits</option>
                  <option>Lehengas</option>
                  <option>Kurtis</option>
                  <option>Gowns</option>
                  <option>Bridal Wear</option>
                  <option>Men's Wear</option>
                  <option>Kids Wear</option>
                  <option>Alterations</option>
                  <option>Accessories</option>
                </select>

                {/* Price */}
                <label className="form-label fw-semibold">
                  <i
                    className="bi bi-currency-rupee me-2"
                    style={{ color: "#7b3f4f" }}
                  ></i>
                  Starting Price
                </label>

                <input
                  type="number"
                  min="1"
                  className="form-control mb-4"
                  value={form.price}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      price: event.target.value,
                    })
                  }
                  placeholder="Enter price"
                  required
                />

                <button
                  className="btn w-100 rounded-3 py-2 fw-semibold"
                  style={{
                    backgroundColor: "#743d4b",
                    color: "#fff8f2",
                    border: "none",
                  }}
                  disabled={saving}
                >
                  <i
                    className={`bi ${
                      saving
                        ? "bi-hourglass-split"
                        : "bi-cloud-arrow-up"
                    } me-2`}
                  ></i>

                  {saving
                    ? "Publishing..."
                    : "Publish to Catalog"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Catalog */}
        <div className="col-12 col-lg-8">

          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h5 className="fw-bold mb-1" style={{ color: "#4a2928" }}>
                Published Designs
              </h5>
              <p className="text-muted small mb-0">
                Designs currently visible to customers.
              </p>
            </div>

            <i
              className="bi bi-stars fs-4"
              style={{ color: "#a27768" }}
            ></i>
          </div>

          {loading ? (
            <div
              className="card border-0 shadow-sm rounded-4"
              style={{ backgroundColor: "#faf6f0" }}
            >
              <div className="card-body text-center py-5">
                <div
                  className="spinner-border"
                  style={{ color: "#743d4b" }}
                  role="status"
                ></div>

                <p className="text-muted mt-3 mb-0">
                  Loading catalog...
                </p>
              </div>
            </div>
          ) : (
            <div className="row g-3">

              {designs.map((design) => (
                <div
                  className="col-12 col-sm-6 col-xl-4"
                  key={design._id}
                >
                  <div
                    className="card border-0 shadow-sm rounded-4 overflow-hidden h-100"
                    style={{ backgroundColor: "#fffaf5" }}
                  >

                    <div
                      className="position-relative overflow-hidden"
                      style={{ backgroundColor: "#eee2d6" }}
                    >
                      <img
                        src={`${SERVER_URL}${design.imageUrl}`}
                        alt={
                          design.caption || design.category
                        }
                        className="w-100"
                        style={{
                          height: "260px",
                          objectFit: "cover",
                        }}
                      />
                    </div>

                    <div className="card-body p-3">

                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span
                          className="badge rounded-pill fw-normal"
                          style={{
                            backgroundColor: "#eee0d6",
                            color: "#744b46",
                          }}
                        >
                          {design.category}
                        </span>

                        <span
                          className="small fw-semibold"
                          style={{ color: "#743d4b" }}
                        >
                          Rs. {design.price}
                        </span>
                      </div>

                      <h6
                        className="fw-bold mb-1"
                        style={{ color: "#4a2928" }}
                      >
                        {design.caption || "Untitled design"}
                      </h6>

                      <p className="text-muted small mb-3">
                        <i className="bi bi-person me-1"></i>
                        By {design.designer}
                      </p>

                      <button
                        type="button"
                        className="btn btn-sm w-100 rounded-3"
                        style={{
                          backgroundColor: "#f3e3df",
                          color: "#7a4148",
                          border: "1px solid #dfc7c1",
                        }}
                        onClick={() =>
                          removeDesign(design._id)
                        }
                      >
                        <i className="bi bi-trash3 me-1"></i>
                        Remove Design
                      </button>

                    </div>
                  </div>
                </div>
              ))}

              {designs.length === 0 && (
                <div className="col-12">
                  <div
                    className="card border-0 rounded-4 text-center py-5"
                    style={{
                      backgroundColor: "#f8f0e7",
                      border: "1px dashed #d7c3b6",
                    }}
                  >
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                      style={{
                        width: "60px",
                        height: "60px",
                        backgroundColor: "#ead7d0",
                        color: "#743d4b",
                      }}
                    >
                      <i className="bi bi-images fs-3"></i>
                    </div>

                    <h5
                      className="fw-bold"
                      style={{ color: "#4a2928" }}
                    >
                      Your catalog is empty.
                    </h5>

                    <p className="text-muted mb-0">
                      Publish the first design for customers to discover.
                    </p>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Catalog;