import React, { useState } from "react";
import customerApi from "../../utils/customerApi";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

function CustomerProfile() {
  const { customer, login } = useCustomerAuth();
  const [name, setName] = useState(customer ? customer.name : "");
  const [email, setEmail] = useState(
    customer && customer.email ? customer.email : "",
  );
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const { data } = await customerApi.put("/customer-auth/profile", {
        name,
        email,
        password,
      });

      login({
        ...customer,
        name: data.name,
        email: data.email,
      });

      setPassword("");
      setMessage("Profile updated successfully");
    } catch (err) {
      setError(
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
          "Could not update profile",
      );
    }
  };

  return (
    <div
      className="container-fluid py-3 py-md-4"
      style={{
        minHeight: "100vh",
        backgroundColor: "#fffaf5",
        color: "#4a2928",
      }}
    >
      {/* HEADER */}
      <div className="mb-4">
        <span
          className="badge rounded-pill px-3 py-2 mb-2"
          style={{
            backgroundColor: "#ead7d0",
            color: "#743d4b",
            fontWeight: "500",
          }}
        >
          BOUTIQ • ACCOUNT
        </span>

        <h3 className="fw-bold mb-1" style={{ color: "#4a2928" }}>
          <i
            className="bi bi-person-circle me-2"
            style={{ color: "#743d4b" }}
          ></i>
          My Profile
        </h3>

        <p className="mb-0" style={{ color: "#806b65" }}>
          Manage your personal information and account settings.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-7 col-xl-6">
          {/* PROFILE CARD */}
          <div
            className="card border-0 rounded-4 overflow-hidden"
            style={{
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 20px rgba(116, 61, 75, 0.08)",
              border: "1px solid #eadfd7",
            }}
          >
            {/* PROFILE HEADER */}
            <div
              className="p-4"
              style={{
                backgroundColor: "#f2e7dc",
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: "62px",
                    height: "62px",
                    backgroundColor: "#ead7d0",
                    color: "#743d4b",
                  }}
                >
                  <i className="bi bi-person fs-3"></i>
                </div>

                <div>
                  <h5
                    className="mb-1 fw-bold"
                    style={{ color: "#4a2928" }}
                  >
                    {customer?.name || "Customer"}
                  </h5>

                  <small style={{ color: "#765d57" }}>
                    Update your account details
                  </small>
                </div>
              </div>
            </div>

            {/* FORM */}
            <div className="card-body p-3 p-md-4">
              {/* SUCCESS MESSAGE */}
              {message && (
                <div
                  className="d-flex align-items-center gap-2 rounded-3 px-3 py-2 mb-3"
                  style={{
                    backgroundColor: "#e3eee0",
                    color: "#52614c",
                  }}
                >
                  <i className="bi bi-check-circle-fill"></i>
                  <span>{message}</span>
                </div>
              )}

              {/* ERROR MESSAGE */}
              {error && (
                <div
                  className="d-flex align-items-center gap-2 rounded-3 px-3 py-2 mb-3"
                  style={{
                    backgroundColor: "#f3dfdb",
                    color: "#743d4b",
                  }}
                >
                  <i className="bi bi-exclamation-circle-fill"></i>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* NAME */}
                <div className="mb-3">
                  <label
                    className="form-label fw-semibold"
                    style={{ color: "#5b3733" }}
                  >
                    <i
                      className="bi bi-person me-2"
                      style={{ color: "#743d4b" }}
                    ></i>
                    Name
                  </label>

                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    style={{
                      borderColor: "#e5d5cc",
                      color: "#4a2928",
                    }}
                  />
                </div>

                {/* PHONE */}
                <div className="mb-3">
                  <label
                    className="form-label fw-semibold"
                    style={{ color: "#5b3733" }}
                  >
                    <i
                      className="bi bi-telephone me-2"
                      style={{ color: "#743d4b" }}
                    ></i>
                    Phone Number
                  </label>

                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={customer ? customer.phone : ""}
                    disabled
                    style={{
                      backgroundColor: "#f7eee5",
                      borderColor: "#e5d5cc",
                      color: "#806b65",
                    }}
                  />

                  <div
                    className="form-text mt-2"
                    style={{ color: "#907872" }}
                  >
                    <i className="bi bi-info-circle me-1"></i>
                    Contact the shop to change your phone number.
                  </div>
                </div>

                {/* EMAIL */}
                <div className="mb-3">
                  <label
                    className="form-label fw-semibold"
                    style={{ color: "#5b3733" }}
                  >
                    <i
                      className="bi bi-envelope me-2"
                      style={{ color: "#743d4b" }}
                    ></i>
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control form-control-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    style={{
                      borderColor: "#e5d5cc",
                      color: "#4a2928",
                    }}
                  />
                </div>

                {/* PASSWORD */}
                <div className="mb-4">
                  <label
                    className="form-label fw-semibold"
                    style={{ color: "#5b3733" }}
                  >
                    <i
                      className="bi bi-lock me-2"
                      style={{ color: "#743d4b" }}
                    ></i>
                    New Password
                  </label>

                  <input
                    type="password"
                    className="form-control form-control-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    style={{
                      borderColor: "#e5d5cc",
                      color: "#4a2928",
                    }}
                  />

                  <div
                    className="form-text mt-2"
                    style={{ color: "#907872" }}
                  >
                    Leave blank if you don't want to change your password.
                  </div>
                </div>

                {/* SAVE BUTTON */}
                <button
                  type="submit"
                  className="btn btn-lg w-100 fw-semibold"
                  style={{
                    backgroundColor: "#743d4b",
                    color: "#ffffff",
                    border: "none",
                  }}
                >
                  <i className="bi bi-check2-circle me-2"></i>
                  Save Changes
                </button>
              </form>
            </div>
          </div>

          {/* SECURITY CARD */}
          <div
            className="card border-0 rounded-4 mt-3"
            style={{
              backgroundColor: "#f7eee5",
              border: "1px solid #eadfd7",
            }}
          >
            <div className="card-body p-3">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: "42px",
                    height: "42px",
                    backgroundColor: "#e3eee0",
                    color: "#52614c",
                  }}
                >
                  <i className="bi bi-shield-check fs-5"></i>
                </div>

                <div>
                  <div
                    className="fw-semibold"
                    style={{ color: "#5b3733" }}
                  >
                    Your account is secure
                  </div>

                  <small style={{ color: "#806b65" }}>
                    Keep your email and password up to date.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerProfile;