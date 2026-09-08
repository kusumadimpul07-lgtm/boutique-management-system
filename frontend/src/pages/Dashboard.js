import React, { useEffect, useState } from "react";
import api from "../utils/api";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/dashboard");
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <div className="spinner-border text-secondary mb-3"></div>
        <p className="text-muted mb-0">Loading dashboard...</p>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Customers",
      value: stats?.totalCustomers || 0,
      icon: "bi-people",
      bg: "bg-primary-subtle",
      text: "text-primary",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: "bi-bag-heart",
      bg: "bg-success-subtle",
      text: "text-success",
    },
    {
      title: "Pending Orders",
      value: stats?.pendingOrders || 0,
      icon: "bi-hourglass-split",
      bg: "bg-warning-subtle",
      text: "text-warning-emphasis",
    },
    {
      title: "Total Revenue",
      value: `₹ ${stats?.totalRevenue || 0}`,
      icon: "bi-currency-rupee",
      bg: "bg-info-subtle",
      text: "text-info-emphasis",
    },
    {
      title: "Outstanding",
      value: `₹ ${stats?.outstandingBalance || 0}`,
      icon: "bi-wallet2",
      bg: "bg-secondary-subtle",
      text: "text-secondary",
    },
    {
      title: "Overdue",
      value: stats?.overdueOrders?.length || 0,
      icon: "bi-exclamation-circle",
      bg: "bg-danger-subtle",
      text: "text-danger",
    },
  ];

  return (
    <div className="pb-4">

      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
        <div>
          <div className="text-muted small fw-semibold">
            BOUTIQ MANAGEMENT
          </div>

          <h3 className="fw-semibold mb-1 mt-1">
            Dashboard ✨
          </h3>

          <p className="text-muted mb-0">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        <div className="mt-3 mt-md-0">
          <span className="badge bg-light text-dark border px-3 py-2">
            <i className="bi bi-calendar3 me-2"></i>
            {new Date().toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="row g-3 mb-4">
        {cards.map((card) => (
          <div
            className="col-12 col-sm-6 col-lg-4 col-xl-2"
            key={card.title}
          >
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-3">

                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <small className="text-muted">
                      {card.title}
                    </small>

                    <h4 className="fw-semibold mt-2 mb-0">
                      {card.value}
                    </h4>
                  </div>

                  <div className={`${card.bg} ${card.text} rounded-3 p-2`}>
                    <i className={`bi ${card.icon} fs-5`}></i>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* UPCOMING DELIVERIES + DESIGNER WORKLOAD */}
      <div className="row g-4">

        {/* UPCOMING DELIVERIES */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 h-100">

            <div className="card-header bg-white border-0 pt-4 px-4">
              <div className="d-flex justify-content-between align-items-center">

                <div>
                  <small className="text-muted fw-semibold">
                    SCHEDULE
                  </small>
                  <h5 className="fw-semibold mb-0 mt-1">
                    Upcoming Deliveries
                  </h5>
                </div>

                <span className="bg-light rounded-3 p-2">
                  <i className="bi bi-truck fs-5"></i>
                </span>

              </div>
            </div>

            <div className="card-body px-4">

              {stats?.upcomingDeliveries?.length > 0 ? (
                <div className="list-group list-group-flush">

                  {stats.upcomingDeliveries.map((order) => (
                    <div
                      key={order._id}
                      className="list-group-item px-0 py-3"
                    >

                      <div className="d-flex justify-content-between align-items-center gap-3">

                        <div className="d-flex align-items-center gap-3">

                          <div className="bg-light rounded-3 p-2">
                            <i className="bi bi-box-seam"></i>
                          </div>

                          <div>
                            <div className="fw-semibold">
                              {order.orderNumber}
                            </div>

                            <div className="text-muted small">
                              {order.customer
                                ? order.customer.name
                                : "Unknown"}
                            </div>

                            <div className="text-muted small">
                              {order.items}
                            </div>
                          </div>

                        </div>

                        <div className="text-end text-nowrap">
                          <small className="text-muted d-block">
                            DELIVERY
                          </small>

                          <span className="fw-semibold small">
                            {new Date(
                              order.deliveryDate
                            ).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </span>
                        </div>

                      </div>

                    </div>
                  ))}

                </div>
              ) : (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-calendar-check fs-2 d-block mb-2"></i>
                  No upcoming deliveries
                </div>
              )}

            </div>
          </div>
        </div>

        {/* DESIGNER WORKLOAD */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 h-100">

            <div className="card-header bg-white border-0 pt-4 px-4">
              <div className="d-flex justify-content-between align-items-center">

                <div>
                  <small className="text-muted fw-semibold">
                    TEAM
                  </small>

                  <h5 className="fw-semibold mb-0 mt-1">
                    Designer Workload
                  </h5>
                </div>

                <span className="bg-light rounded-3 p-2">
                  <i className="bi bi-scissors fs-5"></i>
                </span>

              </div>
            </div>

            <div className="card-body px-4">

              {stats?.designerWorkload?.length > 0 ? (
                <div className="list-group list-group-flush">

                  {stats.designerWorkload.map((designer) => (
                    <div
                      key={designer.name}
                      className="list-group-item px-0 py-3"
                    >

                      <div className="d-flex justify-content-between align-items-center">

                        <div className="d-flex align-items-center gap-2">

                          <div
                            className="bg-light rounded-circle d-flex align-items-center justify-content-center fw-semibold"
                            style={{
                              width: "40px",
                              height: "40px",
                            }}
                          >
                            {designer.name
                              ?.slice(0, 1)
                              .toUpperCase()}
                          </div>

                          <span className="fw-semibold small">
                            {designer.name}
                          </span>

                        </div>

                        <div className="text-end">

                          <span className="badge bg-dark me-1">
                            {designer.activeOrders} active
                          </span>

                          <span className="badge bg-light text-dark border">
                            {designer.completedOrders} done
                          </span>

                        </div>

                      </div>

                    </div>
                  ))}

                </div>
              ) : (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-person-workspace fs-2 d-block mb-2"></i>
                  No designer assignments yet
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

      {/* RECENT ORDERS */}
      <div className="card border-0 shadow-sm rounded-4 mt-4">

        <div className="card-header bg-white border-0 pt-4 px-4">
          <div className="d-flex justify-content-between align-items-center">

            <div>
              <small className="text-muted fw-semibold">
                ACTIVITY
              </small>

              <h5 className="fw-semibold mb-0 mt-1">
                Recent Orders
              </h5>
            </div>

            <span className="bg-light rounded-3 p-2">
              <i className="bi bi-clock-history fs-5"></i>
            </span>

          </div>
        </div>

        <div className="card-body px-4">

          {stats?.recentOrders?.length > 0 ? (
            <div className="list-group list-group-flush">

              {stats.recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="list-group-item px-0 py-3"
                >

                  <div className="d-flex justify-content-between align-items-center gap-3">

                    <div className="d-flex align-items-center gap-3">

                      <div className="bg-light rounded-3 p-2">
                        <i className="bi bi-bag"></i>
                      </div>

                      <div>
                        <div className="fw-semibold">
                          {order.orderNumber}
                        </div>

                        <small className="text-muted">
                          {order.customer
                            ? order.customer.name
                            : "Unknown"}
                        </small>
                      </div>

                    </div>

                    <span className="badge bg-secondary">
                      {order.status}
                    </span>

                  </div>

                </div>
              ))}

            </div>
          ) : (
            <div className="text-center text-muted py-5">
              <i className="bi bi-bag-x fs-2 d-block mb-2"></i>
              No orders yet
            </div>
          )}

        </div>
      </div>

    </div>
  );
}

export default Dashboard;