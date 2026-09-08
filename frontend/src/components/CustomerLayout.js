import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import customerApi from "../utils/customerApi";

// A lighter top-nav layout for the customer-facing portal (no admin sidebar)
function CustomerLayout({ children }) {
  const { customer, logout } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    customerApi
      .get("/customer-portal/notifications")
      .then(({ data }) => setNotifications(data))
      .catch(() => {});
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.readAt,
  ).length;
  const markRead = async (notification) => {
    if (notification.readAt) return;
    try {
      await customerApi.patch(
        `/customer-portal/notifications/${notification._id}/read`,
      );
      setNotifications((current) =>
        current.map((item) =>
          item._id === notification._id
            ? { ...item, readAt: new Date().toISOString() }
            : item,
        ),
      );
    } catch (error) {
      // Keep the notification visible if the read request fails.
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/customer-login");
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <div className="portal-shell">
      <aside className={`portal-sidebar ${mobileNavOpen ? "open" : ""}`}>
        <Link to="/customer/home" className="portal-brand text-decoration-none">
          <span>B</span>
          <strong>BOUTIQ</strong>
          <small>MADE FOR YOU</small>
        </Link>
        <div className="portal-welcome">
          <span>WELCOME BACK</span>
          <strong>{customer ? customer.name : "Guest"}</strong>
        </div>
        <nav className="portal-nav" onClick={() => setMobileNavOpen(false)}>
          <Link
            to="/customer/home"
            className={isActive("/customer/home") ? "active" : ""}
          >
            <span>01</span>Overview
          </Link>
          <Link
            to="/customer/orders"
            className={isActive("/customer/orders") ? "active" : ""}
          >
            <span>02</span>My orders
          </Link>
          <Link
            to="/customer/order-request"
            className={isActive("/customer/order-request") ? "active" : ""}
          >
            <span>03</span>New order
          </Link>
          <Link
            to="/customer/profile"
            className={isActive("/customer/profile") ? "active" : ""}
          >
            <span>04</span>My profile
          </Link>
          <Link
            to="/customer/assistant"
            className={isActive("/customer/assistant") ? "active" : ""}
          >
            <span>05</span>Style assistant
          </Link>
        </nav>
        <div className="portal-sidebar-footer">
          <p>Need help with an order?</p>
          <span>Talk to the BOUTIQ studio</span>
          <button type="button" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>
      <main className="portal-main">
        <header className="portal-topbar">
          <button
            type="button"
            className="portal-menu-button"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open portal navigation"
          >
            Menu
          </button>
          <span className="portal-mobile-brand">BOUTIQ</span>
          <span className="portal-date">YOUR PERSONAL STYLE SPACE</span>
          <div className="portal-notifications">
            <button
              type="button"
              className="notification-button"
              onClick={() => setShowNotifications((current) => !current)}
              aria-label="Notifications"
            >
              Updates {unreadCount > 0 && <span>{unreadCount}</span>}
            </button>
            {showNotifications && (
              <div className="notification-menu">
                <strong>Recent updates</strong>
                {notifications.length === 0 && (
                  <p className="text-muted small mb-0 mt-2">No updates yet.</p>
                )}
                {notifications.slice(0, 6).map((notification) => (
                  <button
                    type="button"
                    key={notification._id}
                    className={`notification-item ${notification.readAt ? "" : "unread"}`}
                    onClick={() => markRead(notification)}
                  >
                    <strong>{notification.title}</strong>
                    <small>{notification.message}</small>
                    <time>
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </time>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            className="portal-signout"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </header>
        {mobileNavOpen && (
          <button
            type="button"
            className="portal-drawer-backdrop"
            aria-label="Close portal navigation"
            onClick={() => setMobileNavOpen(false)}
          />
        )}
        <div className="portal-content">{children}</div>
      </main>
    </div>
  );
}

export default CustomerLayout;
