// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import api from "../utils/api";
// import { useAuth } from "../context/AuthContext";

// function Login({ designerOnly = false }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const { data } = await api.post("/auth/login", { email, password });
//       if (designerOnly && data.role !== "designer") {
//         setError("This login is for designers only.");
//         return;
//       }
//       login(data);
//       navigate(data.role === "designer" ? "/catalog" : "/dashboard");
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
//           {designerOnly
//             ? "Designer Studio Login"
//             : "Boutique Management System"}
//         </p>

//         {error && <div className="alert alert-danger py-2">{error}</div>}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label className="form-label">Email</label>
//             <input
//               type="email"
//               className="form-control"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
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

//         <p className="text-center mt-3 mb-0">
//           <Link to="/customer-login" style={{ fontSize: "0.85rem" }}>
//             Are you a customer? Log in here
//           </Link>
//         </p>
//         {!designerOnly && (
//           <p className="text-center mb-0">
//             <Link to="/designer-login" style={{ fontSize: "0.85rem" }}>
//               Designer login
//             </Link>
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Login;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

function Login({ designerOnly = false }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", { email, password });
      if (designerOnly && data.role !== "designer") {
        setError("This login is for designers only.");
        return;
      }
      login(data);
      navigate(data.role === "designer" ? "/catalog" : "/dashboard");
    } catch (err) {
      setError(
        (err.response && err.response.data && err.response.data.message) ||
          "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center p-3"
      style={{
        backgroundColor: "#f7eee5",
      }}
    >
      <div
        className="card border-0 shadow-sm w-100"
        style={{
          maxWidth: "430px",
          backgroundColor: "#fffaf5",
          borderRadius: "20px",
        }}
      >
        <div className="card-body p-4 p-sm-5">

          {/* Brand */}
          <div className="text-center mb-4">
            <div
              className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
              style={{
                width: "64px",
                height: "64px",
                backgroundColor: "#ead7d0",
                color: "#743d4b",
              }}
            >
              <i className="bi bi-scissors fs-3"></i>
            </div>

            <h2
              className="fw-semibold mb-1"
              style={{
                color: "#4a2928",
                letterSpacing: "2px",
              }}
            >
              BOUTIQ
            </h2>

            <p className="text-muted mb-0">
              {designerOnly
                ? "Designer Studio Login"
                : "Boutique Management System"}
            </p>
          </div>

          {/* Error */}
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

          {/* Login Form */}
          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label
                className="form-label small fw-semibold"
                style={{ color: "#5b3733" }}
              >
                Email
              </label>

              <div className="input-group">
                <span
                  className="input-group-text border-end-0"
                  style={{
                    backgroundColor: "#f7eee5",
                    color: "#8a5a5a",
                  }}
                >
                  <i className="bi bi-envelope"></i>
                </span>

                <input
                  type="email"
                  className="form-control border-start-0"
                  style={{ backgroundColor: "#fffdf9" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                className="form-label small fw-semibold"
                style={{ color: "#5b3733" }}
              >
                Password
              </label>

              <div className="input-group">
                <span
                  className="input-group-text border-end-0"
                  style={{
                    backgroundColor: "#f7eee5",
                    color: "#8a5a5a",
                  }}
                >
                  <i className="bi bi-lock"></i>
                </span>

                <input
                  type="password"
                  className="form-control border-start-0"
                  style={{ backgroundColor: "#fffdf9" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn w-100 py-2"
              disabled={loading}
              style={{
                backgroundColor: "#743d4b",
                color: "#fffaf5",
                border: "none",
                borderRadius: "10px",
              }}
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
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Login
                </>
              )}
            </button>
          </form>

          {/* Customer Login */}
          <div className="text-center mt-4">
            <p className="small text-muted mb-2">
              Are you a customer?
            </p>

            <Link
              to="/customer-login"
              className="text-decoration-none fw-semibold"
              style={{ color: "#743d4b" }}
            >
              Customer Login
              <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          {/* Designer Login */}
          {!designerOnly && (
            <div className="text-center mt-3 pt-3 border-top">
              <Link
                to="/designer-login"
                className="text-decoration-none small"
                style={{ color: "#8a5a5a" }}
              >
                <i className="bi bi-scissors me-1"></i>
                Designer login
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Login;