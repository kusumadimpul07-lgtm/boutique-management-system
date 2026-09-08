// import React, { useEffect, useState } from "react";
// import api, { SERVER_URL } from "../utils/api";

// function Staff() {
//   const [staffList, setStaffList] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phone: "",
//     role: "staff",
//   });
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchStaff();
//   }, []);

//   const fetchStaff = async () => {
//     try {
//       const { data } = await api.get("/staff");
//       setStaffList(data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       await api.post("/staff", formData);
//       setFormData({
//         name: "",
//         email: "",
//         password: "",
//         phone: "",
//         role: "staff",
//       });
//       setShowForm(false);
//       fetchStaff();
//     } catch (err) {
//       setError(
//         (err.response && err.response.data && err.response.data.message) ||
//           "Could not create staff account",
//       );
//     }
//   };

//   const toggleActive = async (staff) => {
//     try {
//       await api.put(`/staff/${staff._id}`, { isActive: !staff.isActive });
//       fetchStaff();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleDelete = async (staffId) => {
//     if (!window.confirm("Are you sure you want to remove this staff member?"))
//       return;
//     try {
//       await api.delete(`/staff/${staffId}`);
//       fetchStaff();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const uploadProfile = async (staff, file) => {
//     if (!file) return;
//     const formData = new FormData();
//     formData.append("profilePicture", file);
//     try {
//       await api.put(`/staff/${staff._id}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       fetchStaff();
//     } catch (uploadError) {
//       setError("Could not upload the profile picture.");
//     }
//   };

//   const initials = (name) =>
//     name
//       .split(" ")
//       .map((part) => part[0])
//       .slice(0, 2)
//       .join("")
//       .toUpperCase();

//   return (
//     <div>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3>Team Management</h3>
//         <button className="btn btn-dark" onClick={() => setShowForm(!showForm)}>
//           {showForm ? "Cancel" : "+ Add Team Member"}
//         </button>
//       </div>

//       {showForm && (
//         <div className="card p-3 mb-4 shadow-sm">
//           {error && <div className="alert alert-danger py-2">{error}</div>}
//           <form onSubmit={handleSubmit}>
//             <div className="row g-2">
//               <div className="col-md-3">
//                 <input
//                   className="form-control"
//                   name="name"
//                   placeholder="Full Name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="col-md-3">
//                 <input
//                   type="email"
//                   className="form-control"
//                   name="email"
//                   placeholder="Email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="col-md-3">
//                 <input
//                   type="password"
//                   className="form-control"
//                   name="password"
//                   placeholder="Password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="col-md-2">
//                 <input
//                   className="form-control"
//                   name="phone"
//                   placeholder="Phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="col-md-2">
//                 <select
//                   className="form-select"
//                   name="role"
//                   value={formData.role}
//                   onChange={handleChange}
//                 >
//                   <option value="staff">Staff</option>
//                   <option value="designer">Designer</option>
//                 </select>
//               </div>
//             </div>
//             <button type="submit" className="btn btn-success mt-3">
//               Create Account
//             </button>
//           </form>
//         </div>
//       )}

//       <div className="card shadow-sm">
//         <table className="table mb-0">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Phone</th>
//               <th>Role</th>
//               <th>Status</th>
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             {staffList.map((s) => (
//               <tr key={s._id}>
//                 <td>
//                   <div className="team-member-cell">
//                     {s.profilePicture ? (
//                       <img
//                         src={`${SERVER_URL}${s.profilePicture}`}
//                         alt={s.name}
//                         className="team-avatar"
//                       />
//                     ) : (
//                       <span className="team-avatar team-avatar-fallback">
//                         {initials(s.name)}
//                       </span>
//                     )}
//                     <div>
//                       <strong>{s.name}</strong>
//                       <small>
//                         {s.role === "designer"
//                           ? "Design studio"
//                           : "Operations team"}
//                       </small>
//                     </div>
//                   </div>
//                 </td>
//                 <td>{s.email}</td>
//                 <td>{s.phone || "-"}</td>
//                 <td>
//                   <span className="badge bg-light text-dark border">
//                     {s.role}
//                   </span>
//                 </td>
//                 <td>
//                   <span
//                     className={`badge ${s.isActive ? "bg-success" : "bg-secondary"}`}
//                   >
//                     {s.isActive ? "Active" : "Disabled"}
//                   </span>
//                 </td>
//                 <td className="d-flex gap-2">
//                   <label className="btn btn-sm btn-outline-dark mb-0">
//                     Photo
//                     <input
//                       type="file"
//                       accept="image/*"
//                       hidden
//                       onChange={(event) =>
//                         uploadProfile(s, event.target.files[0])
//                       }
//                     />
//                   </label>
//                   <button
//                     className="btn btn-sm btn-outline-warning"
//                     onClick={() => toggleActive(s)}
//                   >
//                     {s.isActive ? "Disable" : "Enable"}
//                   </button>
//                   <button
//                     className="btn btn-sm btn-outline-danger"
//                     onClick={() => handleDelete(s._id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//             {staffList.length === 0 && (
//               <tr>
//                 <td colSpan="6" className="text-center text-muted">
//                   No team members added yet
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default Staff;


import React, { useEffect, useState } from "react";
import api, { SERVER_URL } from "../utils/api";

function Staff() {
  const [staffList, setStaffList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "staff",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const { data } = await api.get("/staff");
      setStaffList(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/staff", formData);

      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "staff",
      });

      setShowForm(false);
      fetchStaff();
    } catch (err) {
      setError(
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
          "Could not create staff account",
      );
    }
  };

  const toggleActive = async (staff) => {
    try {
      await api.put(`/staff/${staff._id}`, {
        isActive: !staff.isActive,
      });
      fetchStaff();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (staffId) => {
    if (!window.confirm("Are you sure you want to remove this staff member?"))
      return;

    try {
      await api.delete(`/staff/${staffId}`);
      fetchStaff();
    } catch (error) {
      console.error(error);
    }
  };

  const uploadProfile = async (staff, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      await api.put(`/staff/${staff._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchStaff();
    } catch (uploadError) {
      setError("Could not upload the profile picture.");
    }
  };

  const initials = (name) =>
    name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <div
          className="text-uppercase small fw-semibold mb-1"
          style={{
            color: "#8a5a5a",
            letterSpacing: "1.5px",
          }}
        >
          BOUTIQ TEAM
        </div>

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-end gap-3">
          <div>
            <h2
              className="mb-1 fw-semibold"
              style={{ color: "#4a2928" }}
            >
              Team Management
            </h2>

            <p className="text-muted mb-0">
              Manage your staff and design team.
            </p>
          </div>

          <button
            className="btn px-4 py-2"
            onClick={() => setShowForm(!showForm)}
            style={{
              backgroundColor: "#743d4b",
              color: "#fffaf5",
              border: "none",
              borderRadius: "9px",
            }}
          >
            <i
              className={`bi ${
                showForm ? "bi-x-lg" : "bi-person-plus"
              } me-2`}
            ></i>

            {showForm ? "Cancel" : "Add Team Member"}
          </button>
        </div>
      </div>

      {/* Add Team Member Form */}
      {showForm && (
        <div
          className="card border-0 shadow-sm mb-4"
          style={{
            backgroundColor: "#fffaf5",
            borderRadius: "18px",
          }}
        >
          <div className="card-body p-3 p-sm-4">
            <div className="d-flex align-items-center mb-4">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                style={{
                  width: "44px",
                  height: "44px",
                  backgroundColor: "#ead7d0",
                  color: "#743d4b",
                }}
              >
                <i className="bi bi-person-plus"></i>
              </div>

              <div>
                <h5
                  className="mb-1"
                  style={{ color: "#4a2928" }}
                >
                  Add Team Member
                </h5>

                <p className="small text-muted mb-0">
                  Create a staff or designer account.
                </p>
              </div>
            </div>

            {error && (
              <div
                className="alert border-0 py-2 small"
                style={{
                  backgroundColor: "#f3dfdb",
                  color: "#743d4b",
                  borderRadius: "10px",
                }}
              >
                <i className="bi bi-exclamation-circle me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* Name */}
                <div className="col-12 col-md-6 col-xl-3">
                  <label
                    className="form-label small fw-semibold"
                    style={{ color: "#5b3733" }}
                  >
                    Full Name
                  </label>

                  <input
                    className="form-control"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="col-12 col-md-6 col-xl-3">
                  <label
                    className="form-label small fw-semibold"
                    style={{ color: "#5b3733" }}
                  >
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password */}
                <div className="col-12 col-md-6 col-xl-2">
                  <label
                    className="form-label small fw-semibold"
                    style={{ color: "#5b3733" }}
                  >
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="col-12 col-md-6 col-xl-2">
                  <label
                    className="form-label small fw-semibold"
                    style={{ color: "#5b3733" }}
                  >
                    Phone
                  </label>

                  <input
                    className="form-control"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                {/* Role */}
                <div className="col-12 col-md-6 col-xl-2">
                  <label
                    className="form-label small fw-semibold"
                    style={{ color: "#5b3733" }}
                  >
                    Role
                  </label>

                  <select
                    className="form-select"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="staff">Staff</option>
                    <option value="designer">Designer</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn mt-4 px-4"
                style={{
                  backgroundColor: "#743d4b",
                  color: "#fffaf5",
                  border: "none",
                  borderRadius: "9px",
                }}
              >
                <i className="bi bi-person-check me-2"></i>
                Create Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Team Count */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-4">
          <div
            className="card border-0 shadow-sm h-100"
            style={{
              backgroundColor: "#f7eee5",
              borderRadius: "18px",
            }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div
                    className="small fw-semibold mb-1"
                    style={{ color: "#8a5a5a" }}
                  >
                    TEAM MEMBERS
                  </div>

                  <h3
                    className="mb-1 fw-semibold"
                    style={{ color: "#4a2928" }}
                  >
                    {staffList.length}
                  </h3>

                  <small className="text-muted">
                    Staff & designers
                  </small>
                </div>

                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "#ead7d0",
                    color: "#743d4b",
                  }}
                >
                  <i className="bi bi-people fs-5"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Table */}
      <div
        className="card border-0 shadow-sm"
        style={{
          backgroundColor: "#fffaf5",
          borderRadius: "18px",
        }}
      >
        <div className="card-body p-0">
          {/* Table Heading */}
          <div className="p-3 p-sm-4 border-bottom">
            <div className="d-flex align-items-center">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                style={{
                  width: "42px",
                  height: "42px",
                  backgroundColor: "#f2e7dc",
                  color: "#743d4b",
                }}
              >
                <i className="bi bi-person-lines-fill"></i>
              </div>

              <div>
                <h5
                  className="mb-1"
                  style={{ color: "#4a2928" }}
                >
                  Your Team
                </h5>

                <p className="small text-muted mb-0">
                  Staff and designer accounts
                </p>
              </div>
            </div>
          </div>

          {/* Responsive Table */}
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f7eee5",
                  }}
                >
                  <th
                    className="px-3 py-3 small text-nowrap"
                    style={{ color: "#6b4843" }}
                  >
                    Name
                  </th>

                  <th
                    className="py-3 small text-nowrap"
                    style={{ color: "#6b4843" }}
                  >
                    Email
                  </th>

                  <th
                    className="py-3 small text-nowrap"
                    style={{ color: "#6b4843" }}
                  >
                    Phone
                  </th>

                  <th
                    className="py-3 small text-nowrap"
                    style={{ color: "#6b4843" }}
                  >
                    Role
                  </th>

                  <th
                    className="py-3 small text-nowrap"
                    style={{ color: "#6b4843" }}
                  >
                    Status
                  </th>

                  <th
                    className="px-3 py-3 small text-nowrap"
                    style={{ color: "#6b4843" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {staffList.map((s) => (
                  <tr key={s._id}>
                    {/* Name */}
                    <td className="px-3">
                      <div className="d-flex align-items-center gap-3">
                        {s.profilePicture ? (
                          <img
                            src={`${SERVER_URL}${s.profilePicture}`}
                            alt={s.name}
                            className="rounded-circle flex-shrink-0"
                            style={{
                              width: "44px",
                              height: "44px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <span
                            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-semibold"
                            style={{
                              width: "44px",
                              height: "44px",
                              backgroundColor: "#ead7d0",
                              color: "#743d4b",
                            }}
                          >
                            {initials(s.name)}
                          </span>
                        )}

                        <div>
                          <div
                            className="fw-semibold text-nowrap"
                            style={{ color: "#4a2928" }}
                          >
                            {s.name}
                          </div>

                          <small className="text-muted text-nowrap">
                            {s.role === "designer"
                              ? "Design studio"
                              : "Operations team"}
                          </small>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td>
                      <span
                        className="text-nowrap"
                        style={{ color: "#6b4843" }}
                      >
                        {s.email}
                      </span>
                    </td>

                    {/* Phone */}
                    <td>
                      <span
                        className="text-nowrap"
                        style={{ color: "#6b4843" }}
                      >
                        {s.phone || "-"}
                      </span>
                    </td>

                    {/* Role */}
                    <td>
                      <span
                        className="badge rounded-pill px-3 py-2"
                        style={{
                          backgroundColor:
                            s.role === "designer"
                              ? "#ead7d0"
                              : "#eee7dc",
                          color: "#743d4b",
                          fontWeight: "500",
                        }}
                      >
                        <i
                          className={`bi ${
                            s.role === "designer"
                              ? "bi-palette"
                              : "bi-person"
                          } me-1`}
                        ></i>

                        {s.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      <span
                        className="badge rounded-pill px-3 py-2"
                        style={{
                          backgroundColor: s.isActive
                            ? "#e3eee0"
                            : "#eee5df",
                          color: s.isActive
                            ? "#52614c"
                            : "#806b63",
                          fontWeight: "500",
                        }}
                      >
                        <i
                          className={`bi ${
                            s.isActive
                              ? "bi-check-circle"
                              : "bi-dash-circle"
                          } me-1`}
                        ></i>

                        {s.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-3">
                      <div className="d-flex gap-2 flex-wrap">
                        <label
                          className="btn btn-sm mb-0"
                          style={{
                            backgroundColor: "#f2e7dc",
                            color: "#743d4b",
                            border: "none",
                            borderRadius: "7px",
                          }}
                        >
                          <i className="bi bi-camera me-1"></i>
                          Photo

                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(event) =>
                              uploadProfile(
                                s,
                                event.target.files[0],
                              )
                            }
                          />
                        </label>

                        <button
                          className="btn btn-sm"
                          onClick={() => toggleActive(s)}
                          style={{
                            backgroundColor: s.isActive
                              ? "#eee7dc"
                              : "#e3eee0",
                            color: s.isActive
                              ? "#6b5148"
                              : "#52614c",
                            border: "none",
                            borderRadius: "7px",
                          }}
                        >
                          <i
                            className={`bi ${
                              s.isActive
                                ? "bi-pause-circle"
                                : "bi-play-circle"
                            } me-1`}
                          ></i>

                          {s.isActive ? "Disable" : "Enable"}
                        </button>

                        <button
                          className="btn btn-sm"
                          onClick={() => handleDelete(s._id)}
                          style={{
                            backgroundColor: "#f3dfdb",
                            color: "#743d4b",
                            border: "none",
                            borderRadius: "7px",
                          }}
                        >
                          <i className="bi bi-trash3 me-1"></i>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {staffList.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <div
                        className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                        style={{
                          width: "58px",
                          height: "58px",
                          backgroundColor: "#f2e7dc",
                          color: "#8a5a5a",
                        }}
                      >
                        <i className="bi bi-people fs-4"></i>
                      </div>

                      <h6 style={{ color: "#4a2928" }}>
                        No team members yet
                      </h6>

                      <p className="text-muted small mb-0">
                        Add your first staff member or designer.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Staff;