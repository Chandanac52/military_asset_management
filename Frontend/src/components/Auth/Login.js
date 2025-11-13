import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(credentials);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error (unexpected):', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const backgroundStyle = {
    backgroundImage: "url('/images/army_truck1.jpeg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px'
  };

  return (
    <div style={backgroundStyle}>
      <div
        style={{
          display: 'flex',
          gap: '25px',
          maxWidth: '850px',
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          padding: '35px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          alignItems: 'stretch'
        }}
      >
        {/* Login Form */}
        <form
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '2rem',
            borderRadius: '10px',
            flex: 1.6,
            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            minWidth: '350px'
          }}
          onSubmit={handleSubmit}
        >
          <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
            <h2 style={{
              color: '#2c5530',
              marginBottom: '0.4rem',
              fontSize: '1.7rem',
              fontWeight: '700'
            }}>
              Military Asset Management
            </h2>
            <p style={{
              color: '#7f8c8d',
              fontSize: '1rem',
              margin: 0
            }}>
              Secure Access Portal
            </p>
          </div>

          {error && (
            <div
              style={{
                background: '#f8d7da',
                color: '#721c24',
                padding: '0.8rem',
                borderRadius: '8px',
                marginBottom: '1.3rem',
                textAlign: 'center',
                border: '1px solid #f5c6cb',
                fontSize: '0.9rem'
              }}
            >
              {error}
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#2c5530',
              fontSize: '0.95rem'
            }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                fontSize: '0.95rem',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2c5530'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              placeholder="Enter your username"
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#2c5530',
              fontSize: '0.95rem'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                fontSize: '0.95rem',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2c5530'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#9ca3af' : '#2c5530',
              color: 'white',
              padding: '0.9rem 2rem',
              borderRadius: '8px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 700,
              fontSize: '1rem',
              width: '100%',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(44, 85, 48, 0.3)'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.background = '#1e3a22';
                e.target.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.background = '#2c5530';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            {loading ? 'Logging in...' : 'Login to System'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '10px',
            padding: '1.8rem',
            flex: 1,
            minWidth: '270px',
            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <h3 style={{
            margin: '0 0 1.2rem 0',
            color: '#2c5530',
            fontSize: '1.3rem',
            fontWeight: '700',
            textAlign: 'center'
          }}>
            Demo Credentials
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { role: 'Administrator', color: '#2c5530', user: 'admin', pass: 'password123' },
              { role: 'Base Commander', color: '#2563eb', user: 'commander_north', pass: 'password123' },
              { role: 'Logistics Officer', color: '#059669', user: 'logistics1', pass: 'password123' }
            ].map((acc, i) => (
              <div key={i} style={{
                padding: '1rem',
                background: '#f8f9fa',
                borderRadius: '8px',
                borderLeft: `4px solid ${acc.color}`
              }}>
                <div style={{
                  fontWeight: '700',
                  color: acc.color,
                  marginBottom: '0.4rem',
                  fontSize: '0.95rem'
                }}>
                  {acc.role}
                </div>
                <div style={{ color: '#4b5563', fontSize: '0.9rem' }}>
                  <div><strong>Username:</strong> {acc.user}</div>
                  <div><strong>Password:</strong> {acc.pass}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '1.5rem',
            padding: '0.8rem',
            background: '#e8f5e8',
            borderRadius: '8px',
            border: '1px solid #bbf7d0'
          }}>
            <p style={{
              margin: 0,
              color: '#065f46',
              fontSize: '0.85rem',
              textAlign: 'center'
            }}>
              All demo accounts have full access to explore the system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
