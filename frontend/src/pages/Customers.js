// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import api from '../utils/api';

// function Customers() {
//   const [customers, setCustomers] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '', gender: 'female', password: '' });
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

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
//       await api.post('/customers', formData);
//       setFormData({ name: '', phone: '', email: '', address: '', gender: 'female', password: '' });
//       setShowForm(false);
//       fetchCustomers();
//     } catch (err) {
//       setError((err.response && err.response.data && err.response.data.message) || 'Could not add customer');
//     }
//   };

//   return (
//     <div>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3>Customers</h3>
//         <button className="btn btn-dark" onClick={() => setShowForm(!showForm)}>
//           {showForm ? 'Cancel' : '+ Add Customer'}
//         </button>
//       </div>

//       {showForm && (
//         <div className="card p-3 mb-4 shadow-sm">
//           {error && <div className="alert alert-danger py-2">{error}</div>}
//           <form onSubmit={handleSubmit}>
//             <div className="row g-2">
//               <div className="col-md-4">
//                 <input className="form-control" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
//               </div>
//               <div className="col-md-4">
//                 <input className="form-control" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
//               </div>
//               <div className="col-md-4">
//                 <input className="form-control" name="email" placeholder="Email (optional)" value={formData.email} onChange={handleChange} />
//               </div>
//               <div className="col-md-8">
//                 <input className="form-control" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
//               </div>
//               <div className="col-md-4">
//                 <select className="form-select" name="gender" value={formData.gender} onChange={handleChange}>
//                   <option value="female">Female</option>
//                   <option value="male">Male</option>
//                   <option value="other">Other</option>
//                 </select>
//               </div>
//               <div className="col-md-8">
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="password"
//                   placeholder="Customer Portal Password (optional)"
//                   value={formData.password}
//                   onChange={handleChange}
//                 />
//                 <small className="text-muted">
//                   Set this so the customer can log in at /customer-login to track their order and pay online. Leave blank to add later.
//                 </small>
//               </div>
//             </div>
//             <button type="submit" className="btn btn-success mt-3">Save Customer</button>
//           </form>
//         </div>
//       )}

//       <div className="card shadow-sm">
//         <table className="table mb-0">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Phone</th>
//               <th>Email</th>
//               <th>Address</th>
//               <th>Portal Access</th>
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             {customers.map((c) => (
//               <tr key={c._id}>
//                 <td>{c.name}</td>
//                 <td>{c.phone}</td>
//                 <td>{c.email || '-'}</td>
//                 <td>{c.address || '-'}</td>
//                 <td>
//                   <span className={`badge ${c.hasPortalAccess ? 'bg-success' : 'bg-secondary'}`}>
//                     {c.hasPortalAccess ? 'Enabled' : 'Not set up'}
//                   </span>
//                 </td>
//                 <td>
//                   <Link to={`/customers/${c._id}`} className="btn btn-sm btn-outline-dark">
//                     View
//                   </Link>
//                 </td>
//               </tr>
//             ))}
//             {customers.length === 0 && (
//               <tr>
//                 <td colSpan="6" className="text-center text-muted">No customers yet</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default Customers;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    gender: 'female',
    password: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

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
      await api.post('/customers', formData);
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        gender: 'female',
        password: ''
      });
      setShowForm(false);
      fetchCustomers();
    } catch (err) {
      setError(
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
          'Could not add customer'
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
            style={{ color: '#8a5a5a', letterSpacing: '1.5px' }}
          >
            BOUTIQ CLIENTS
          </div>

          <h2
            className="mb-1 fw-semibold"
            style={{ color: '#4a2928' }}
          >
            Customers
          </h2>

          <p className="mb-0 text-muted">
            Manage customer details, measurements and portal access.
          </p>
        </div>

        <button
          className="btn px-4 py-2"
          onClick={() => setShowForm(!showForm)}
          style={{
            backgroundColor: '#743d4b',
            color: '#fffaf5',
            borderRadius: '10px',
            border: 'none'
          }}
        >
          <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-person-plus'} me-2`}></i>
          {showForm ? 'Cancel' : 'Add Customer'}
        </button>
      </div>

      {/* Add Customer Form */}
      {showForm && (
        <div
          className="card border-0 shadow-sm mb-4"
          style={{
            backgroundColor: '#fffaf5',
            borderRadius: '16px'
          }}
        >
          <div className="card-body p-3 p-md-4">

            <div className="d-flex align-items-center mb-4">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{
                  width: '44px',
                  height: '44px',
                  backgroundColor: '#ead7d0',
                  color: '#743d4b'
                }}
              >
                <i className="bi bi-person-plus fs-5"></i>
              </div>

              <div>
                <h5 className="mb-1" style={{ color: '#4a2928' }}>
                  Add New Customer
                </h5>
                <p className="small text-muted mb-0">
                  Enter the customer's basic details.
                </p>
              </div>
            </div>

            {error && (
              <div
                className="alert border-0 py-2"
                style={{
                  backgroundColor: '#f3dfdb',
                  color: '#743d4b'
                }}
              >
                <i className="bi bi-exclamation-circle me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">

                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold">
                    Full Name
                  </label>
                  <input
                    className="form-control"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold">
                    Phone Number
                  </label>
                  <input
                    className="form-control"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold">
                    Email
                  </label>
                  <input
                    className="form-control"
                    name="email"
                    placeholder="Email (optional)"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12 col-md-8">
                  <label className="form-label small fw-semibold">
                    Address
                  </label>
                  <input
                    className="form-control"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold">
                    Gender
                  </label>
                  <select
                    className="form-select"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="col-12 col-md-8">
                  <label className="form-label small fw-semibold">
                    Customer Portal Password
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="password"
                    placeholder="Customer Portal Password (optional)"
                    value={formData.password}
                    onChange={handleChange}
                  />

                  <div className="small text-muted mt-2">
                    <i className="bi bi-info-circle me-1"></i>
                    Set this so the customer can log in at /customer-login
                    to track their order and pay online. Leave blank to add
                    later.
                  </div>
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
                    borderRadius: '9px'
                  }}
                >
                  <i className="bi bi-check2 me-2"></i>
                  Save Customer
                </button>

                <button
                  type="button"
                  className="btn px-4"
                  onClick={() => setShowForm(false)}
                  style={{
                    backgroundColor: '#f2e7dc',
                    color: '#5b3733',
                    border: 'none',
                    borderRadius: '9px'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer List */}
      <div
        className="card border-0 shadow-sm overflow-hidden"
        style={{
          backgroundColor: '#fffaf5',
          borderRadius: '16px'
        }}
      >

        {/* Desktop / Tablet Table */}
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr style={{ backgroundColor: '#f2e7dc' }}>
                <th
                  className="px-3 py-3"
                  style={{ color: '#5b3733' }}
                >
                  Customer
                </th>
                <th style={{ color: '#5b3733' }}>Phone</th>
                <th style={{ color: '#5b3733' }}>Email</th>
                <th style={{ color: '#5b3733' }}>Address</th>
                <th style={{ color: '#5b3733' }}>Portal Access</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {customers.map((c) => (
                <tr key={c._id}>

                  <td className="px-3">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#ead7d0',
                          color: '#743d4b'
                        }}
                      >
                        <i className="bi bi-person"></i>
                      </div>

                      <div>
                        <div
                          className="fw-semibold"
                          style={{ color: '#4a2928' }}
                        >
                          {c.name}
                        </div>

                        <small className="text-muted">
                          {c.gender
                            ? c.gender.charAt(0).toUpperCase() +
                              c.gender.slice(1)
                            : ''}
                        </small>
                      </div>
                    </div>
                  </td>

                  <td>{c.phone}</td>

                  <td>
                    <span className="text-muted">
                      {c.email || '-'}
                    </span>
                  </td>

                  <td>
                    <span className="text-muted">
                      {c.address || '-'}
                    </span>
                  </td>

                  <td>
                    <span
                      className="badge rounded-pill px-3 py-2"
                      style={{
                        backgroundColor: c.hasPortalAccess
                          ? '#e3eee0'
                          : '#eee7df',
                        color: c.hasPortalAccess
                          ? '#496047'
                          : '#75645a'
                      }}
                    >
                      <i
                        className={`bi ${
                          c.hasPortalAccess
                            ? 'bi-check-circle'
                            : 'bi-dash-circle'
                        } me-1`}
                      ></i>

                      {c.hasPortalAccess
                        ? 'Enabled'
                        : 'Not set up'}
                    </span>
                  </td>

                  <td className="pe-3">
                    <Link
                      to={`/customers/${c._id}`}
                      className="btn btn-sm"
                      style={{
                        backgroundColor: '#f2e7dc',
                        color: '#743d4b',
                        border: 'none',
                        borderRadius: '8px'
                      }}
                    >
                      <i className="bi bi-eye me-1"></i>
                      View
                    </Link>
                  </td>

                </tr>
              ))}

              {customers.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-5"
                  >
                    <div
                      className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#f2e7dc',
                        color: '#8a5a5a'
                      }}
                    >
                      <i className="bi bi-people fs-4"></i>
                    </div>

                    <h6
                      className="mb-1"
                      style={{ color: '#5b3733' }}
                    >
                      No customers yet
                    </h6>

                    <p className="small text-muted mb-0">
                      Add your first customer to get started.
                    </p>
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

      </div>

      {/* Small mobile helper */}
      {customers.length > 0 && (
        <div className="d-md-none text-muted small mt-2">
          <i className="bi bi-arrow-left-right me-1"></i>
          Swipe horizontally to view all customer details.
        </div>
      )}

    </div>
  );
}

export default Customers;