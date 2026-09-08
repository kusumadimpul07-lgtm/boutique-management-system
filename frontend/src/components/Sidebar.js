import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar({ onNavigate }) {
  const { user } = useAuth();

  if (user && user.role === "designer") {
    return (
      <div className="sidebar p-3">
        <h4 className="brand-title mb-4">BOUTIQ</h4>
        <p className="sidebar-role-label">DESIGNER WORKROOM</p>
        <ul className="nav nav-pills flex-column gap-1" onClick={onNavigate}>
          <li className="nav-item">
            <NavLink to="/designer/orders" className="nav-link">
              My Assigned Orders
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/catalog" className="nav-link">
              My Design Catalog
            </NavLink>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className="sidebar p-3">
      <h4 className="brand-title mb-4">BOUTIQ</h4>
      <ul className="nav nav-pills flex-column gap-1" onClick={onNavigate}>
        <li className="nav-item">
          <NavLink to="/dashboard" className="nav-link">
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/customers" className="nav-link">
            Customers
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/orders" className="nav-link">
            Orders
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/deliveries" className="nav-link">
            Deliveries
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/payments" className="nav-link">
            Payments
          </NavLink>
        </li>
        {user && user.role === "owner" && (
          <li className="nav-item">
            <NavLink to="/staff" className="nav-link">
              Staff
            </NavLink>
          </li>
        )}
        {user && ["owner", "designer"].includes(user.role) && (
          <li className="nav-item">
            <NavLink to="/catalog" className="nav-link">
              Design Catalog
            </NavLink>
          </li>
        )}
        <li className="nav-item">
          <NavLink to="/ai-assistant" className="nav-link">
            AI Assistant
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/settings" className="nav-link">
            Settings
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
