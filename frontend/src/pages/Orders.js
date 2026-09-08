// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import api from '../utils/api';

// function Orders() {
//   const [orders, setOrders] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     customer: '', items: '', totalAmount: '', advanceAmount: '', deliveryDate: '', notes: '',
//   });
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchOrders();
//     fetchCustomers();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const { data } = await api.get('/orders');
//       setOrders(data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const fetchCustomers = async () => {
//     try {
//       const { data } = await api.get('/customers');
//       setCustomers(data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       await api.post('/orders', formData);
//       setFormData({ customer: '', items: '', totalAmount: '', advanceAmount: '', deliveryDate: '', notes: '' });
//       setShowForm(false);
//       fetchOrders();
//     } catch (err) {
//       setError((err.response && err.response.data && err.response.data.message) || 'Could not create order');
//     }
//   };

//   return (
//     <div>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3>Orders</h3>
//         <button className="btn btn-dark" onClick={() => setShowForm(!showForm)}>
//           {showForm ? 'Cancel' : '+ New Order'}
//         </button>
//       </div>

//       {showForm && (
//         <div className="card p-3 mb-4 shadow-sm">
//           {error && <div className="alert alert-danger py-2">{error}</div>}
//           <form onSubmit={handleSubmit}>
//             <div className="row g-2">
//               <div className="col-md-4">
//                 <select className="form-select" name="customer" value={formData.customer} onChange={handleChange} required>
//                   <option value="">Select Customer</option>
//                   {customers.map((c) => (
//                     <option key={c._id} value={c._id}>{c.name} - {c.phone}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="col-md-8">
//                 <input className="form-control" name="items" placeholder="Order Items (e.g. 2 Blouses, 1 Saree Fall)" value={formData.items} onChange={handleChange} required />
//               </div>
//               <div className="col-md-4">
//                 <input type="number" className="form-control" name="totalAmount" placeholder="Total Amount" value={formData.totalAmount} onChange={handleChange} required />
//               </div>
//               <div className="col-md-4">
//                 <input type="number" className="form-control" name="advanceAmount" placeholder="Advance Paid" value={formData.advanceAmount} onChange={handleChange} />
//               </div>
//               <div className="col-md-4">
//                 <input type="date" className="form-control" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} />
//               </div>
//               <div className="col-md-12">
//                 <input className="form-control" name="notes" placeholder="Notes (optional)" value={formData.notes} onChange={handleChange} />
//               </div>
//             </div>
//             <button type="submit" className="btn btn-success mt-3">Create Order</button>
//           </form>
//         </div>
//       )}

//       <div className="card shadow-sm">
//         <table className="table mb-0">
//           <thead>
//             <tr>
//               <th>Order #</th>
//               <th>Customer</th>
//               <th>Items</th>
//               <th>Total</th>
//               <th>Status</th>
//               <th>Delivery Date</th>
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((o) => (
//               <tr key={o._id}>
//                 <td>{o.orderNumber}</td>
//                 <td>{o.customer ? o.customer.name : '-'}</td>
//                 <td>{o.items}</td>
//                 <td>Rs. {o.totalAmount}</td>
//                 <td><span className="badge bg-secondary">{o.status}</span></td>
//                 <td>{o.deliveryDate ? new Date(o.deliveryDate).toLocaleDateString() : '-'}</td>
//                 <td>
//                   <Link to={`/orders/${o._id}`} className="btn btn-sm btn-outline-dark">View</Link>
//                 </td>
//               </tr>
//             ))}
//             {orders.length === 0 && (
//               <tr><td colSpan="7" className="text-center text-muted">No orders yet</td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default Orders;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customer: '',
    items: '',
    totalAmount: '',
    advanceAmount: '',
    deliveryDate: '',
    notes: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data } = await api.get('/customers');
      setCustomers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/orders', formData);

      setFormData({
        customer: '',
        items: '',
        totalAmount: '',
        advanceAmount: '',
        deliveryDate: '',
        notes: '',
      });

      setShowForm(false);
      fetchOrders();
    } catch (err) {
      setError(
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
          'Could not create order'
      );
    }
  };

  return (
    <div>

      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <div
            className="text-uppercase small fw-semibold mb-1"
            style={{
              color: '#8a5a5a',
              letterSpacing: '1.5px',
            }}
          >
            BOUTIQ ORDERS
          </div>

          <h2
            className="mb-1 fw-semibold"
            style={{ color: '#4a2928' }}
          >
            Orders
          </h2>

          <p className="text-muted mb-0">
            Create and manage customer orders from one place.
          </p>
        </div>

        <button
          className="btn px-4 py-2"
          onClick={() => setShowForm(!showForm)}
          style={{
            backgroundColor: '#743d4b',
            color: '#fffaf5',
            border: 'none',
            borderRadius: '10px',
          }}
        >
          <i
            className={`bi ${
              showForm ? 'bi-x-lg' : 'bi-plus-lg'
            } me-2`}
          ></i>

          {showForm ? 'Cancel' : 'New Order'}
        </button>
      </div>

      {/* New Order Form */}
      {showForm && (
        <div
          className="card border-0 shadow-sm mb-4"
          style={{
            backgroundColor: '#fffaf5',
            borderRadius: '16px',
          }}
        >
          <div className="card-body p-3 p-md-4">

            <div className="d-flex align-items-center mb-4">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{
                  width: '46px',
                  height: '46px',
                  backgroundColor: '#ead7d0',
                  color: '#743d4b',
                }}
              >
                <i className="bi bi-bag-plus fs-5"></i>
              </div>

              <div>
                <h5
                  className="mb-1"
                  style={{ color: '#4a2928' }}
                >
                  Create New Order
                </h5>

                <p className="text-muted small mb-0">
                  Add the customer's order details below.
                </p>
              </div>
            </div>

            {error && (
              <div
                className="alert border-0 py-2"
                style={{
                  backgroundColor: '#f3dfdb',
                  color: '#743d4b',
                }}
              >
                <i className="bi bi-exclamation-circle me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">

                {/* Customer */}
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold">
                    Customer
                  </label>

                  <select
                    className="form-select"
                    name="customer"
                    value={formData.customer}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Customer
                    </option>

                    {customers.map((c) => (
                      <option
                        key={c._id}
                        value={c._id}
                      >
                        {c.name} - {c.phone}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Items */}
                <div className="col-12 col-md-8">
                  <label className="form-label small fw-semibold">
                    Order Items
                  </label>

                  <input
                    className="form-control"
                    name="items"
                    placeholder="e.g. 2 Blouses, 1 Saree Fall"
                    value={formData.items}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Total */}
                <div className="col-12 col-sm-4">
                  <label className="form-label small fw-semibold">
                    Total Amount
                  </label>

                  <div className="input-group">
                    <span
                      className="input-group-text"
                      style={{
                        backgroundColor: '#f2e7dc',
                        color: '#743d4b',
                      }}
                    >
                      Rs.
                    </span>

                    <input
                      type="number"
                      className="form-control"
                      name="totalAmount"
                      placeholder="Total"
                      value={formData.totalAmount}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Advance */}
                <div className="col-12 col-sm-4">
                  <label className="form-label small fw-semibold">
                    Advance Paid
                  </label>

                  <div className="input-group">
                    <span
                      className="input-group-text"
                      style={{
                        backgroundColor: '#f2e7dc',
                        color: '#743d4b',
                      }}
                    >
                      Rs.
                    </span>

                    <input
                      type="number"
                      className="form-control"
                      name="advanceAmount"
                      placeholder="Advance"
                      value={formData.advanceAmount}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Delivery */}
                <div className="col-12 col-sm-4">
                  <label className="form-label small fw-semibold">
                    Delivery Date
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleChange}
                  />
                </div>

                {/* Notes */}
                <div className="col-12">
                  <label className="form-label small fw-semibold">
                    Notes
                  </label>

                  <input
                    className="form-control"
                    name="notes"
                    placeholder="Notes (optional)"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>

              </div>

              <div className="d-flex flex-column flex-sm-row gap-2 mt-4">

                <button
                  type="submit"
                  className="btn px-4"
                  style={{
                    backgroundColor: '#743d4b',
                    color: '#fffaf5',
                    border: 'none',
                    borderRadius: '9px',
                  }}
                >
                  <i className="bi bi-check2 me-2"></i>
                  Create Order
                </button>

                <button
                  type="button"
                  className="btn px-4"
                  onClick={() => setShowForm(false)}
                  style={{
                    backgroundColor: '#f2e7dc',
                    color: '#5b3733',
                    border: 'none',
                    borderRadius: '9px',
                  }}
                >
                  Cancel
                </button>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div
        className="card border-0 shadow-sm overflow-hidden"
        style={{
          backgroundColor: '#fffaf5',
          borderRadius: '16px',
        }}
      >
        <div className="d-flex justify-content-between align-items-center p-3 p-md-4 pb-2">
          <div>
            <h5
              className="mb-1"
              style={{ color: '#4a2928' }}
            >
              All Orders
            </h5>

            <small className="text-muted">
              {orders.length} order
              {orders.length !== 1 ? 's' : ''} in total
            </small>
          </div>

          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: '42px',
              height: '42px',
              backgroundColor: '#ead7d0',
              color: '#743d4b',
            }}
          >
            <i className="bi bi-bag-check"></i>
          </div>
        </div>

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
                  Items
                </th>

                <th style={{ color: '#5b3733' }}>
                  Total
                </th>

                <th style={{ color: '#5b3733' }}>
                  Status
                </th>

                <th style={{ color: '#5b3733' }}>
                  Delivery Date
                </th>

                <th></th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>

                  {/* Order Number */}
                  <td className="px-3">
                    <span
                      className="fw-semibold"
                      style={{ color: '#743d4b' }}
                    >
                      {o.orderNumber}
                    </span>
                  </td>

                  {/* Customer */}
                  <td>
                    <div className="d-flex align-items-center gap-2">

                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: '38px',
                          height: '38px',
                          backgroundColor: '#ead7d0',
                          color: '#743d4b',
                        }}
                      >
                        <i className="bi bi-person"></i>
                      </div>

                      <span
                        className="fw-medium"
                        style={{ color: '#4a2928' }}
                      >
                        {o.customer
                          ? o.customer.name
                          : '-'}
                      </span>

                    </div>
                  </td>

                  {/* Items */}
                  <td>
                    <span
                      className="text-muted"
                      style={{ minWidth: '180px', display: 'block' }}
                    >
                      {o.items}
                    </span>
                  </td>

                  {/* Total */}
                  <td>
                    <strong style={{ color: '#5b3733' }}>
                      Rs. {o.totalAmount}
                    </strong>
                  </td>

                  {/* Status */}
                  <td>
                    <span
                      className="badge rounded-pill px-3 py-2"
                      style={{
                        backgroundColor: '#eee7df',
                        color: '#75645a',
                      }}
                    >
                      {o.status}
                    </span>
                  </td>

                  {/* Delivery Date */}
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <i
                        className="bi bi-calendar3"
                        style={{ color: '#8a5a5a' }}
                      ></i>

                      <span className="text-muted">
                        {o.deliveryDate
                          ? new Date(
                              o.deliveryDate
                            ).toLocaleDateString()
                          : '-'}
                      </span>
                    </div>
                  </td>

                  {/* View */}
                  <td className="pe-3">
                    <Link
                      to={`/orders/${o._id}`}
                      className="btn btn-sm"
                      style={{
                        backgroundColor: '#f2e7dc',
                        color: '#743d4b',
                        border: 'none',
                        borderRadius: '8px',
                      }}
                    >
                      <i className="bi bi-eye me-1"></i>
                      View
                    </Link>
                  </td>

                </tr>
              ))}

              {/* Empty State */}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-5"
                  >
                    <div
                      className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: '64px',
                        height: '64px',
                        backgroundColor: '#f2e7dc',
                        color: '#8a5a5a',
                      }}
                    >
                      <i className="bi bi-bag fs-4"></i>
                    </div>

                    <h6
                      className="mb-1"
                      style={{ color: '#5b3733' }}
                    >
                      No orders yet
                    </h6>

                    <p className="small text-muted mb-0">
                      Create your first order to get started.
                    </p>
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Hint */}
      {orders.length > 0 && (
        <div className="d-md-none text-muted small mt-2">
          <i className="bi bi-arrow-left-right me-1"></i>
          Swipe horizontally to view all order details.
        </div>
      )}

    </div>
  );
}

export default Orders;