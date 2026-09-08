// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import customerApi from "../../utils/customerApi";
// import { useCustomerAuth } from "../../context/CustomerAuthContext";

// function CustomerLogin() {
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const { login } = useCustomerAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const { data } = await customerApi.post("/customer-auth/login", {
//         phone,
//         password,
//       });
//       login(data);
//       navigate("/customer/home");
//     } catch (err) {
//       setError(
//         (err.response && err.response.data && err.response.data.message) ||
//           "Login failed. Please try again.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-wrapper">
//       <div className="login-card">
//         <h3 className="text-center mb-1">BOUTIQ</h3>
//         <p className="text-center text-muted mb-4">
//           Track your order and pay online
//         </p>

//         {error && <div className="alert alert-danger py-2">{error}</div>}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label className="form-label">Phone Number</label>
//             <input
//               className="form-control"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Password</label>
//             <input
//               type="password"
//               className="form-control"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="btn btn-dark w-100"
//             disabled={loading}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p
//           className="text-center text-muted mt-3 mb-1"
//           style={{ fontSize: "0.85rem" }}
//         >
//           No password yet? Ask the shop to set one up for you.
//         </p>
//         <p className="text-center mb-0">
//           <Link to="/login" style={{ fontSize: "0.85rem" }}>
//             Shop staff login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default CustomerLogin;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import customerApi from "../../utils/customerApi";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

function CustomerLogin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useCustomerAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await customerApi.post("/customer-auth/login", {
        phone,
        password,
      });
      login(data);
      navigate("/customer/home");
    } catch (err) {
      setError(
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-3">

      <div className="row w-100 justify-content-center">

        <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">

          <div className="card border-0 shadow rounded-4 overflow-hidden">

            {/* TOP BRAND SECTION */}
            <div className="card-body text-center px-4 px-md-5 pt-5 pb-4">

              <div
                className="bg-dark text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{
                  width: "58px",
                  height: "58px",
                }}
              >
                <i className="bi bi-scissors fs-4"></i>
              </div>

              <h2 className="fw-semibold mb-1">
                BOUTIQ
              </h2>

              <p className="text-muted mb-4">
                Your personal boutique space
              </p>

              {/* ERROR */}
              {error && (
                <div
                  className="alert alert-danger text-start py-2 small"
                  role="alert"
                >
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}

              {/* LOGIN FORM */}
              <form onSubmit={handleSubmit} className="text-start">

                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    Phone Number
                  </label>

                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <i className="bi bi-phone"></i>
                    </span>

                    <input
                      type="tel"
                      className="form-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    Password
                  </label>

                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <i className="bi bi-lock"></i>
                    </span>

                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-dark w-100 py-2 mt-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login
                      <i className="bi bi-arrow-right ms-2"></i>
                    </>
                  )}
                </button>

              </form>

              {/* HELP TEXT */}
              <div className="border-top mt-4 pt-3">

                <p className="text-muted small mb-2">
                  <i className="bi bi-info-circle me-1"></i>
                  No password yet?
                </p>

                <p className="text-muted small mb-0">
                  Ask the shop to set one up for you.
                </p>

              </div>

            </div>

            {/* STAFF LOGIN */}
            <div className="bg-light border-top text-center p-3">

              <small className="text-muted">
                Are you a shop staff member?
              </small>

              <div className="mt-1">
                <Link
                  to="/login"
                  className="text-dark fw-semibold text-decoration-none small"
                >
                  Staff Login
                  <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>

            </div>

          </div>

          <p className="text-center text-muted small mt-3 mb-0">
            © BOUTIQ · Your style, your way.
          </p>

        </div>

      </div>

    </div>
  );
}

export default CustomerLogin;