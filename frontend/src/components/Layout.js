import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

// Wraps every protected page with the sidebar + top bar
function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-shell d-flex">
      <div className={`admin-sidebar-shell ${sidebarOpen ? "open" : ""}`}>
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </div>
      <div className="flex-grow-1">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="p-4">{children}</div>
      </div>
      {sidebarOpen && (
        <button
          type="button"
          className="mobile-drawer-backdrop"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default Layout;
