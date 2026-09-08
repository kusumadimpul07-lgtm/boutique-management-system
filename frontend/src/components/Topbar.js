import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-light bg-white border-bottom px-4 admin-topbar">
      <button
        type="button"
        className="mobile-menu-button"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        Menu
      </button>
      <span className="fw-semibold text-capitalize">
        Welcome, {user ? user.name : ""} ({user ? user.role : ""})
      </span>
      <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default Topbar;
