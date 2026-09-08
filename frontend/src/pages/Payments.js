// import React, { useEffect, useState } from 'react';
// import api from '../utils/api';

// function Payments() {
//   const [payments, setPayments] = useState([]);

//   useEffect(() => {
//     fetchPayments();
//   }, []);

//   const fetchPayments = async () => {
//     try {
//       const { data } = await api.get('/payments');
//       setPayments(data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const total = payments.reduce((sum, p) => sum + Number(p.amount), 0);

//   return (
//     <div>
//       <h3 className="mb-4">Payments</h3>

//       <div className="card p-3 mb-3 shadow-sm" style={{ maxWidth: '250px' }}>
//         <h6 className="text-muted">Total Collected</h6>
//         <h4>Rs. {total}</h4>
//       </div>

//       <div className="card shadow-sm">
//         <table className="table mb-0">
//           <thead>
//             <tr>
//               <th>Order #</th>
//               <th>Customer</th>
//               <th>Amount</th>
//               <th>Method</th>
//               <th>Status</th>
//               <th>Source</th>
//               <th>Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {payments.map((p) => (
//               <tr key={p._id}>
//                 <td>{p.order ? p.order.orderNumber : '-'}</td>
//                 <td>{p.customer ? p.customer.name : '-'}</td>
//                 <td>Rs. {p.amount}</td>
//                 <td>{p.method}</td>
//                 <td><span className="badge bg-success">{p.status}</span></td>
//                 <td>
//                   {p.source === 'Online Payment' ? (
//                     <span className="badge bg-light text-dark border">Online</span>
//                   ) : (
//                     <span className="badge bg-light text-dark border">Staff</span>
//                   )}
//                 </td>
//                 <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
//               </tr>
//             ))}
//             {payments.length === 0 && (
//               <tr><td colSpan="7" className="text-center text-muted">No payments recorded</td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default Payments;

import React, { useEffect, useState } from 'react';
import api from '../utils/api';

function Payments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data } = await api.get('/payments');
      setPayments(data);
    } catch (error) {
      console.error(error);
    }
  };

  const total = payments.reduce((sum, p) => sum + Number(p.amount), 0);

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
          BOUTIQ FINANCE
        </div>

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-end gap-2">
          <div>
            <h2
              className="mb-1 fw-semibold"
              style={{ color: '#4a2928' }}
            >
              Payments
            </h2>

            <p className="text-muted mb-0">
              Track all payments collected for boutique orders.
            </p>
          </div>
        </div>
      </div>

      {/* Total Collected */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-4">
          <div
            className="card border-0 shadow-sm h-100"
            style={{
              backgroundColor: '#f7eee5',
              borderRadius: '18px'
            }}
          >
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">

                <div>
                  <p
                    className="small fw-semibold mb-1"
                    style={{ color: '#8a5a5a' }}
                  >
                    TOTAL COLLECTED
                  </p>

                  <h3
                    className="mb-0 fw-semibold"
                    style={{ color: '#4a2928' }}
                  >
                    Rs. {total}
                  </h3>
                </div>

                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#ead7d0',
                    color: '#743d4b'
                  }}
                >
                  <i className="bi bi-wallet2 fs-5"></i>
                </div>

              </div>

              <small className="text-muted">
                Across {payments.length} payment
                {payments.length !== 1 ? 's' : ''}
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div
        className="card border-0 shadow-sm"
        style={{
          backgroundColor: '#fffaf5',
          borderRadius: '18px'
        }}
      >
        <div className="card-body p-0">

          {/* Table Header */}
          <div className="p-3 p-sm-4 border-bottom">
            <div className="d-flex align-items-center">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                style={{
                  width: '42px',
                  height: '42px',
                  backgroundColor: '#f2e7dc',
                  color: '#743d4b'
                }}
              >
                <i className="bi bi-receipt"></i>
              </div>

              <div>
                <h5
                  className="mb-1"
                  style={{ color: '#4a2928' }}
                >
                  Payment History
                </h5>

                <p className="small text-muted mb-0">
                  Recent payment transactions
                </p>
              </div>
            </div>
          </div>

          {/* Responsive Table */}
          <div className="table-responsive">
            <table className="table align-middle mb-0">

              <thead>
                <tr
                  style={{
                    backgroundColor: '#f7eee5'
                  }}
                >
                  <th
                    className="px-3 py-3 small text-nowrap"
                    style={{ color: '#6b4843' }}
                  >
                    Order #
                  </th>

                  <th
                    className="py-3 small text-nowrap"
                    style={{ color: '#6b4843' }}
                  >
                    Customer
                  </th>

                  <th
                    className="py-3 small text-nowrap"
                    style={{ color: '#6b4843' }}
                  >
                    Amount
                  </th>

                  <th
                    className="py-3 small text-nowrap"
                    style={{ color: '#6b4843' }}
                  >
                    Method
                  </th>

                  <th
                    className="py-3 small text-nowrap"
                    style={{ color: '#6b4843' }}
                  >
                    Status
                  </th>

                  <th
                    className="py-3 small text-nowrap"
                    style={{ color: '#6b4843' }}
                  >
                    Source
                  </th>

                  <th
                    className="px-3 py-3 small text-nowrap"
                    style={{ color: '#6b4843' }}
                  >
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {payments.map((p) => (
                  <tr key={p._id}>

                    <td className="px-3">
                      <span
                        className="fw-semibold"
                        style={{ color: '#743d4b' }}
                      >
                        {p.order ? p.order.orderNumber : '-'}
                      </span>
                    </td>

                    <td>
                      <div className="d-flex align-items-center gap-2">

                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{
                            width: '34px',
                            height: '34px',
                            backgroundColor: '#ead7d0',
                            color: '#743d4b'
                          }}
                        >
                          <i className="bi bi-person"></i>
                        </div>

                        <span
                          className="text-nowrap"
                          style={{ color: '#4a2928' }}
                        >
                          {p.customer ? p.customer.name : '-'}
                        </span>

                      </div>
                    </td>

                    <td>
                      <span
                        className="fw-semibold text-nowrap"
                        style={{ color: '#4a2928' }}
                      >
                        Rs. {p.amount}
                      </span>
                    </td>

                    <td>
                      <span
                        className="text-nowrap"
                        style={{ color: '#6b4843' }}
                      >
                        {p.method}
                      </span>
                    </td>

                    <td>
                      <span
                        className="badge rounded-pill px-3 py-2"
                        style={{
                          backgroundColor: '#e3eee0',
                          color: '#52614c',
                          fontWeight: '500'
                        }}
                      >
                        <i className="bi bi-check-circle me-1"></i>
                        {p.status}
                      </span>
                    </td>

                    <td>
                      {p.source === 'Online Payment' ? (
                        <span
                          className="badge rounded-pill px-3 py-2"
                          style={{
                            backgroundColor: '#eadfd8',
                            color: '#743d4b',
                            fontWeight: '500'
                          }}
                        >
                          <i className="bi bi-globe2 me-1"></i>
                          Online
                        </span>
                      ) : (
                        <span
                          className="badge rounded-pill px-3 py-2"
                          style={{
                            backgroundColor: '#eee7dc',
                            color: '#6b5148',
                            fontWeight: '500'
                          }}
                        >
                          <i className="bi bi-person-check me-1"></i>
                          Staff
                        </span>
                      )}
                    </td>

                    <td
                      className="px-3 text-nowrap"
                      style={{ color: '#6b4843' }}
                    >
                      {new Date(p.paymentDate).toLocaleDateString()}
                    </td>

                  </tr>
                ))}

                {payments.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-5"
                    >
                      <div
                        className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                        style={{
                          width: '58px',
                          height: '58px',
                          backgroundColor: '#f2e7dc',
                          color: '#8a5a5a'
                        }}
                      >
                        <i className="bi bi-wallet2 fs-4"></i>
                      </div>

                      <h6 style={{ color: '#4a2928' }}>
                        No payments yet
                      </h6>

                      <p className="text-muted small mb-0">
                        Payment records will appear here.
                      </p>
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Payments;