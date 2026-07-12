import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const initialLoginState = { email: '', password: '' };
const initialRegisterState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  departmentId: ''
};

const Login = ({ mode = 'login' }) => {
  const [loginData, setLoginData] = useState(initialLoginState);
  const [registerData, setRegisterData] = useState(initialRegisterState);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, registerUser, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isRegisterMode = useMemo(() => mode === 'register', [mode]);

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (event) => {
    const { name, value } = event.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      await signIn(loginData);
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email,
        password: registerData.password,
        role: 'EMPLOYEE',
        departmentId: registerData.departmentId || undefined,
        isActive: true
      };

      await registerUser(payload);
      setSuccessMessage('User created successfully.');
      setRegisterData(initialRegisterState);
    } catch (err) {
      setError(err?.response?.data?.message || 'User creation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-hero">
          <div className="auth-badge">EcoSphere</div>
          <h1>Secure access for your sustainability workspace</h1>
          <p>Sign in to your dashboard or create a new team member account from an admin session.</p>
        </div>

        <div className="auth-form-panel">
          <div className="auth-toggle">
            <Link to="/login" className={!isRegisterMode ? 'active' : ''}>Login</Link>
            <Link to="/register" className={isRegisterMode ? 'active' : ''}>Register</Link>
          </div>

          {isRegisterMode ? (
            <form className="auth-form" onSubmit={handleRegisterSubmit}>
              <div className="field-grid">
                <label>
                  <span>First name</span>
                  <input name="firstName" value={registerData.firstName} onChange={handleRegisterChange} required />
                </label>
                <label>
                  <span>Last name</span>
                  <input name="lastName" value={registerData.lastName} onChange={handleRegisterChange} required />
                </label>
              </div>

              <label>
                <span>Email address</span>
                <input name="email" type="email" value={registerData.email} onChange={handleRegisterChange} required />
              </label>

              <div className="field-grid">
                <label>
                  <span>Password</span>
                  <input name="password" type="password" value={registerData.password} onChange={handleRegisterChange} required />
                </label>
                <label>
                  <span>Confirm password</span>
                  <input name="confirmPassword" type="password" value={registerData.confirmPassword} onChange={handleRegisterChange} required />
                </label>
              </div>

              <label>
                <span>Department ID</span>
                <input name="departmentId" value={registerData.departmentId} onChange={handleRegisterChange} placeholder="Optional" />
              </label>

              <p className="hint">This registration form creates employee accounts only.</p>

              {error ? <p className="error-message">{error}</p> : null}
              {successMessage ? <p className="success-message">{successMessage}</p> : null}

              <button className="primary-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <label>
                <span>Email address</span>
                <input name="email" type="email" value={loginData.email} onChange={handleLoginChange} required />
              </label>

              <label>
                <span>Password</span>
                <input name="password" type="password" value={loginData.password} onChange={handleLoginChange} required />
              </label>

              {error ? <p className="error-message">{error}</p> : null}
              {successMessage ? <p className="success-message">{successMessage}</p> : null}

              <button className="primary-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
