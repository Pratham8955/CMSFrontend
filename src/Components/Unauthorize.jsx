import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorize = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>🔒</div>
        <h1 style={styles.title}>Access Denied</h1>
        <p style={styles.message}>
          You don't have permission to view this page. Please contact the administrator if you believe this is an error.
        </p>
        <div style={styles.buttonContainer}>
          <button 
            style={styles.button}
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
          <button 
            style={{...styles.button, ...styles.primaryButton}}
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    maxWidth: '450px',
    width: '100%',
    textAlign: 'center'
  },
  icon: {
    fontSize: '48px',
    marginBottom: '20px',
    color: '#dc3545'
  },
  title: {
    color: '#343a40',
    fontSize: '24px',
    marginBottom: '15px',
    fontWeight: '600'
  },
  message: {
    color: '#6c757d',
    fontSize: '16px',
    lineHeight: '1.5',
    marginBottom: '25px'
  },
  buttonContainer: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center'
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: '1px solid #dee2e6',
    backgroundColor: 'white',
    color: '#495057',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#f1f3f5'
    }
  },
  primaryButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    borderColor: '#dc3545',
    ':hover': {
      backgroundColor: '#c82333'
    }
  }
};

export default Unauthorize;