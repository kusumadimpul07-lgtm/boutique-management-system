// import React, { useState } from 'react';
// import api from '../utils/api';
// import { useAuth } from '../context/AuthContext';

// function Settings() {
//   const { user, login } = useAuth();
//   const [name, setName] = useState(user ? user.name : '');
//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setError('');
//     try {
//       const { data } = await api.put('/auth/profile', { name, phone, password });
//       login({ ...user, name: data.name });
//       setPassword('');
//       setMessage('Profile updated successfully');
//     } catch (err) {
//       setError((err.response && err.response.data && err.response.data.message) || 'Could not update profile');
//     }
//   };

//   return (
//     <div>
//       <h3 className="mb-4">Settings</h3>
//       <div className="card p-4 shadow-sm" style={{ maxWidth: '500px' }}>
//         {message && <div className="alert alert-success py-2">{message}</div>}
//         {error && <div className="alert alert-danger py-2">{error}</div>}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label className="form-label">Name</label>
//             <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Email</label>
//             <input className="form-control" value={user ? user.email : ''} disabled />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Phone</label>
//             <input className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">New Password (leave blank to keep current)</label>
//             <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
//           </div>
//           <button type="submit" className="btn btn-dark">Save Changes</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Settings;

import React, { useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

function Settings() {
  const { user, login } = useAuth();
  const [name, setName] = useState(user ? user.name : '');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const { data } = await api.put('/auth/profile', {
        name,
        phone,
        password
      });

      login({ ...user, name: data.name });
      setPassword('');
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
          'Could not update profile'
      );
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
          BOUTIQ ACCOUNT
        </div>

        <h2
          className="mb-1 fw-semibold"
          style={{ color: '#4a2928' }}
        >
          Settings
        </h2>

        <p className="text-muted mb-0">
          Manage your profile and account details.
        </p>
      </div>

      {/* Settings Card */}
      <div
        className="card border-0 shadow-sm"
        style={{
          maxWidth: '600px',
          backgroundColor: '#fffaf5',
          borderRadius: '18px'
        }}
      >
        <div className="card-body p-3 p-sm-4 p-md-5">

          {/* Profile Header */}
          <div className="d-flex align-items-center mb-4">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
              style={{
                width: '52px',
                height: '52px',
                backgroundColor: '#ead7d0',
                color: '#743d4b'
              }}
            >
              <i className="bi bi-person-gear fs-5"></i>
            </div>

            <div>
              <h5
                className="mb-1"
                style={{ color: '#4a2928' }}
              >
                Profile Details
              </h5>

              <p className="small text-muted mb-0">
                Update your personal information.
              </p>
            </div>
          </div>

          {/* Messages */}
          {message && (
            <div
              className="alert border-0 py-2 small"
              style={{
                backgroundColor: '#e3eee0',
                color: '#52614c',
                borderRadius: '10px'
              }}
            >
              <i className="bi bi-check-circle me-2"></i>
              {message}
            </div>
          )}

          {error && (
            <div
              className="alert border-0 py-2 small"
              style={{
                backgroundColor: '#f3dfdb',
                color: '#743d4b',
                borderRadius: '10px'
              }}
            >
              <i className="bi bi-exclamation-circle me-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div className="mb-3">
              <label
                className="form-label small fw-semibold"
                style={{ color: '#5b3733' }}
              >
                Name
              </label>

              <div className="input-group">
                <span
                  className="input-group-text border-end-0"
                  style={{
                    backgroundColor: '#f7eee5',
                    color: '#8a5a5a'
                  }}
                >
                  <i className="bi bi-person"></i>
                </span>

                <input
                  className="form-control border-start-0"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label
                className="form-label small fw-semibold"
                style={{ color: '#5b3733' }}
              >
                Email
              </label>

              <div className="input-group">
                <span
                  className="input-group-text border-end-0"
                  style={{
                    backgroundColor: '#f2e7dc',
                    color: '#8a5a5a'
                  }}
                >
                  <i className="bi bi-envelope"></i>
                </span>

                <input
                  className="form-control border-start-0"
                  value={user ? user.email : ''}
                  disabled
                  style={{
                    backgroundColor: '#f7eee5'
                  }}
                />
              </div>

              <small className="text-muted">
                Email cannot be changed here.
              </small>
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label
                className="form-label small fw-semibold"
                style={{ color: '#5b3733' }}
              >
                Phone
              </label>

              <div className="input-group">
                <span
                  className="input-group-text border-end-0"
                  style={{
                    backgroundColor: '#f7eee5',
                    color: '#8a5a5a'
                  }}
                >
                  <i className="bi bi-telephone"></i>
                </span>

                <input
                  className="form-control border-start-0"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label
                className="form-label small fw-semibold"
                style={{ color: '#5b3733' }}
              >
                New Password
              </label>

              <div className="input-group">
                <span
                  className="input-group-text border-end-0"
                  style={{
                    backgroundColor: '#f7eee5',
                    color: '#8a5a5a'
                  }}
                >
                  <i className="bi bi-lock"></i>
                </span>

                <input
                  type="password"
                  className="form-control border-start-0"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>

              <small className="text-muted">
                Leave blank to keep your current password.
              </small>
            </div>

            {/* Save */}
            <button
              type="submit"
              className="btn px-4 py-2"
              style={{
                backgroundColor: '#743d4b',
                color: '#fffaf5',
                border: 'none',
                borderRadius: '9px'
              }}
            >
              <i className="bi bi-check2 me-2"></i>
              Save Changes
            </button>

          </form>
        </div>
      </div>

    </div>
  );
}

export default Settings;