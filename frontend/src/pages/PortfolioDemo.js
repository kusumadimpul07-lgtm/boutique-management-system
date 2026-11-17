import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Portfolio.css";

const demoOrders = [
  { number: "BQ-1048", client: "Aarohi Mehta", item: "Embroidered kurta set", due: "Today", status: "Ready for fitting" },
  { number: "BQ-1047", client: "Nisha Rao", item: "Silk occasion saree", due: "Nov 21", status: "In progress" },
  { number: "BQ-1046", client: "Diya Kapoor", item: "Linen co-ord set", due: "Nov 23", status: "Materials ready" },
  { number: "BQ-1045", client: "Mira Shah", item: "Custom blouse", due: "Nov 25", status: "In progress" },
];

const demoCustomers = [
  { initials: "AM", name: "Aarohi Mehta", phone: "+91 98XXX XX214", orders: 6, lastVisit: "Nov 12" },
  { initials: "NR", name: "Nisha Rao", phone: "+91 97XXX XX805", orders: 3, lastVisit: "Nov 10" },
  { initials: "DK", name: "Diya Kapoor", phone: "+91 99XXX XX137", orders: 4, lastVisit: "Nov 08" },
  { initials: "MS", name: "Mira Shah", phone: "+91 96XXX XX492", orders: 2, lastVisit: "Nov 05" },
];

const navigation = [
  { id: "overview", label: "Overview", icon: "bi-grid-1x2" },
  { id: "orders", label: "Orders", icon: "bi-bag" },
  { id: "customers", label: "Customers", icon: "bi-people" },
];

function PortfolioDemo() {
  const [activeView, setActiveView] = useState("overview");

  return (
    <main className="demo-page">
      <header className="demo-topbar">
        <Link to="/" className="portfolio-brand">
          <span className="portfolio-brand-mark"><i className="bi bi-scissors" aria-hidden="true"></i></span>
          BOUTIQ
        </Link>
        <div className="demo-topbar-right">
          <span className="demo-preview-label"><i className="bi bi-eye" aria-hidden="true"></i> READ-ONLY PREVIEW</span>
          <Link to="/">Back to portfolio <i className="bi bi-arrow-up-right" aria-hidden="true"></i></Link>
        </div>
      </header>

      <div className="demo-frame">
        <aside className="demo-sidebar">
          <div className="demo-sidebar-heading">
            <span className="demo-sidebar-overline">SAMPLE WORKSPACE</span>
            <strong>Studio dashboard</strong>
          </div>
          <nav aria-label="Demo sections">
            {navigation.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`demo-nav-item${activeView === item.id ? " is-active" : ""}`}
                onClick={() => setActiveView(item.id)}
                aria-pressed={activeView === item.id}
              >
                <i className={`bi ${item.icon}`} aria-hidden="true"></i>
                {item.label}
                {item.id === "orders" && <span className="demo-nav-count">4</span>}
              </button>
            ))}
          </nav>
          <div className="demo-sidebar-note">
            <i className="bi bi-shield-check" aria-hidden="true"></i>
            <p>This preview is separate from the live boutique account.</p>
          </div>
        </aside>

        <section className="demo-content">
          <div className="demo-content-heading">
            <div>
              <span className="portfolio-eyebrow">BOUTIQ MANAGEMENT</span>
              <h1>{activeView === "overview" ? "Studio overview" : activeView === "orders" ? "Orders" : "Customers"}</h1>
              <p>Explore a sample workspace. All names and figures are fictional.</p>
            </div>
            <span className="demo-date"><i className="bi bi-calendar3" aria-hidden="true"></i> Tuesday, Nov 17</span>
          </div>

          {activeView === "overview" && (
            <>
              <div className="demo-metrics">
                <Metric icon="bi-people" label="Customers" value="128" note="Across the studio" />
                <Metric icon="bi-bag-heart" label="Active orders" value="18" note="6 in progress" />
                <Metric icon="bi-hourglass-split" label="Due this week" value="04" note="Next delivery today" />
                <Metric icon="bi-wallet2" label="Outstanding" value="₹24,500" note="Sample balance" />
              </div>
              <div className="demo-panel">
                <div className="demo-panel-heading">
                  <div><span className="demo-panel-overline">KEEP WORK MOVING</span><h2>Upcoming orders</h2></div>
                  <button type="button" className="demo-view-all" onClick={() => setActiveView("orders")}>
                    View all <i className="bi bi-arrow-right" aria-hidden="true"></i>
                  </button>
                </div>
                <OrdersTable rows={demoOrders.slice(0, 3)} />
              </div>
              <div className="demo-bottom-note">
                <i className="bi bi-info-circle" aria-hidden="true"></i>
                This is a read-only portfolio preview. No customer information or live business data is shown.
              </div>
            </>
          )}

          {activeView === "orders" && (
            <div className="demo-panel">
              <div className="demo-panel-heading">
                <div><span className="demo-panel-overline">SAMPLE WORKSPACE</span><h2>Recent orders</h2></div>
                <span className="demo-table-count">4 sample orders</span>
              </div>
              <OrdersTable rows={demoOrders} />
            </div>
          )}

          {activeView === "customers" && (
            <div className="demo-panel">
              <div className="demo-panel-heading">
                <div><span className="demo-panel-overline">CLIENT RELATIONSHIPS</span><h2>Recent customers</h2></div>
                <span className="demo-table-count">4 sample profiles</span>
              </div>
              <div className="demo-table-wrap">
                <table className="demo-table">
                  <thead><tr><th>CLIENT</th><th>PHONE</th><th>ORDERS</th><th>LAST VISIT</th></tr></thead>
                  <tbody>
                    {demoCustomers.map((customer) => (
                      <tr key={customer.name}>
                        <td><span className="demo-customer"><span className="demo-avatar">{customer.initials}</span><strong>{customer.name}</strong></span></td>
                        <td>{customer.phone}</td>
                        <td>{customer.orders} orders</td>
                        <td>{customer.lastVisit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Metric({ icon, label, value, note }) {
  return (
    <article className="demo-metric">
      <span className="demo-metric-icon"><i className={`bi ${icon}`} aria-hidden="true"></i></span>
      <span className="demo-metric-label">{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}

function OrdersTable({ rows }) {
  return (
    <div className="demo-table-wrap">
      <table className="demo-table">
        <thead><tr><th>ORDER</th><th>CLIENT</th><th>ITEM</th><th>DUE</th><th>STATUS</th></tr></thead>
        <tbody>
          {rows.map((order) => (
            <tr key={order.number}>
              <td><strong>{order.number}</strong></td>
              <td>{order.client}</td>
              <td>{order.item}</td>
              <td>{order.due}</td>
              <td><span className={`demo-status${order.status === "Ready for fitting" ? " is-ready" : ""}`}>{order.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PortfolioDemo;
