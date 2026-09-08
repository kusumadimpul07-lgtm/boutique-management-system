// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import api from '../utils/api';

// function Deliveries() {
//   const [deliveries, setDeliveries] = useState([]);

//   useEffect(() => {
//     fetchDeliveries();
//   }, []);

//   const fetchDeliveries = async () => {
//     try {
//       const { data } = await api.get('/deliveries');
//       setDeliveries(data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <h3 className="mb-4">Deliveries</h3>
//       <div className="card shadow-sm">
//         <table className="table mb-0">
//           <thead>
//             <tr>
//               <th>Order #</th>
//               <th>Customer</th>
//               <th>Status</th>
//               <th>Scheduled Date</th>
//               <th>Address</th>
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             {deliveries.map((d) => (
//               <tr key={d._id}>
//                 <td>{d.order ? d.order.orderNumber : '-'}</td>
//                 <td>{d.order && d.order.customer ? d.order.customer.name : '-'}</td>
//                 <td><span className="badge bg-info text-dark">{d.status}</span></td>
//                 <td>{d.scheduledDate ? new Date(d.scheduledDate).toLocaleDateString() : '-'}</td>
//                 <td>{d.deliveryAddress || '-'}</td>
//                 <td>
//                   {d.order && <Link to={`/orders/${d.order._id}`} className="btn btn-sm btn-outline-dark">View Order</Link>}
//                 </td>
//               </tr>
//             ))}
//             {deliveries.length === 0 && (
//               <tr><td colSpan="6" className="text-center text-muted">No deliveries yet</td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default Deliveries;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const { data } = await api.get('/deliveries');
      setDeliveries(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>

      {/* Header */}
      <div className="mb-4">
        <div
          className="text-uppercase small fw-semibold mb-1"
          style={{
            color: '#8a5a5a',
            letterSpacing: '1.5px'
          }}
        >
          BOUTIQ LOGISTICS
        </div>

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-end gap-2">
          <div>
            <h2
              className="mb-1 fw-semibold"
              style={{ color: '#4a2928' }}
            >
              Deliveries
            </h2>

            <p className="text-muted mb-0">
              Keep track of scheduled customer deliveries.
            </p>
          </div>

          <span
            className="badge rounded-pill px-3 py-2 align-self-start align-self-sm-auto"
            style={{
              backgroundColor: '#ead7d0',
              color: '#743d4b'
            }}
          >
            <i className="bi bi-truck me-1"></i>
            {deliveries.length} deliveries
          </span>
        </div>
      </div>

      {/* Delivery Table */}
      <div
        className="card border-0 shadow-sm overflow-hidden"
        style={{
          backgroundColor: '#fffaf5',
          borderRadius: '16px'
        }}
      >
        <div className="table-responsive">
          <table className="table align-middle mb-0">

            <thead>
              <tr style={{ backgroundColor: '#f2e7dc' }}>
                <th
                  className="px-3 py-3"
                  style={{ color: '#5b3733' }}
                >
                  Order #
                </th>

                <th style={{ color: '#5b3733' }}>
                  Customer
                </th>

                <th style={{ color: '#5b3733' }}>
                  Status
                </th>

                <th style={{ color: '#5b3733' }}>
                  Scheduled Date
                </th>

                <th style={{ color: '#5b3733' }}>
                  Address
                </th>

                <th></th>
              </tr>
            </thead>

            <tbody>
              {deliveries.map((d) => (
                <tr key={d._id}>

                  {/* Order */}
                  <td className="px-3">
                    <span
                      className="fw-semibold"
                      style={{ color: '#743d4b' }}
                    >
                      {d.order ? d.order.orderNumber : '-'}
                    </span>
                  </td>

                  {/* Customer */}
                  <td>
                    {d.order && d.order.customer ? (
                      <div className="d-flex align-items-center gap-2">

                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{
                            width: '38px',
                            height: '38px',
                            backgroundColor: '#ead7d0',
                            color: '#743d4b'
                          }}
                        >
                          <i className="bi bi-person"></i>
                        </div>

                        <span
                          className="fw-medium"
                          style={{ color: '#4a2928' }}
                        >
                          {d.order.customer.name}
                        </span>

                      </div>
                    ) : (
                      '-'
                    )}
                  </td>

                  {/* Status */}
                  <td>
                    <span
                      className="badge rounded-pill px-3 py-2 text-capitalize"
                      style={{
                        backgroundColor: '#e8eee4',
                        color: '#52614c'
                      }}
                    >
                      <i className="bi bi-circle-fill me-1 small"></i>
                      {d.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <i
                        className="bi bi-calendar3"
                        style={{ color: '#8a5a5a' }}
                      ></i>

                      <span className="text-muted">
                        {d.scheduledDate
                          ? new Date(
                              d.scheduledDate
                            ).toLocaleDateString()
                          : '-'}
                      </span>
                    </div>
                  </td>

                  {/* Address */}
                  <td>
                    <div
                      className="text-muted"
                      style={{ minWidth: '180px' }}
                    >
                      {d.deliveryAddress || '-'}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="pe-3">
                    {d.order && (
                      <Link
                        to={`/orders/${d.order._id}`}
                        className="btn btn-sm"
                        style={{
                          backgroundColor: '#f2e7dc',
                          color: '#743d4b',
                          border: 'none',
                          borderRadius: '8px'
                        }}
                      >
                        <i className="bi bi-eye me-1"></i>
                        View Order
                      </Link>
                    )}
                  </td>

                </tr>
              ))}

              {/* Empty State */}
              {deliveries.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-5"
                  >
                    <div
                      className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: '64px',
                        height: '64px',
                        backgroundColor: '#f2e7dc',
                        color: '#8a5a5a'
                      }}
                    >
                      <i className="bi bi-truck fs-4"></i>
                    </div>

                    <h6
                      className="mb-1"
                      style={{ color: '#5b3733' }}
                    >
                      No deliveries yet
                    </h6>

                    <p className="small text-muted mb-0">
                      Scheduled deliveries will appear here.
                    </p>
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile hint */}
      {deliveries.length > 0 && (
        <div className="d-md-none text-muted small mt-2">
          <i className="bi bi-arrow-left-right me-1"></i>
          Swipe horizontally to view delivery details.
        </div>
      )}

    </div>
  );
}

export default Deliveries;