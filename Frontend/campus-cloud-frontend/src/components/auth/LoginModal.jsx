import "./LoginModal.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

const LoginModal = ({ show, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, user } = useAuth();
  const navigate = useNavigate();
  
  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      // TEMP MOCK AUTH: login() ignores credentials and uses MOCK_USER
      await login({ username, password });
      
      // Navigate based on user role after login
      setTimeout(() => {
        if (onClose) onClose();
      }, 100);
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-modal-backdrop">
      <div className="login-modal card shadow-lg border-0">
        {/* HEADER */}
        <div className="login-modal-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <span className="logo-box">☁</span>
            <span className="fw-bold text-primary fs-5">CampusCloud</span>
          </div>
          <button className="btn-close" onClick={onClose}></button>
        </div>
        {/* BODY */}
        <div className="card-body px-4 pb-4">
          <h5 className="fw-bold mb-3">Login</h5>
          {error && <div className="alert alert-danger small mb-3">{error}</div>}
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="2508401200XX"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            {/* Remember / forgot */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="remember"
                />
                <label className="form-check-label" htmlFor="remember">Remember me</label>
              </div>
              <Link to="#" className="text-primary text-decoration-none">Forgot password?</Link>
            </div>
            {/* LOGIN BUTTON */}
            <button type="submit" className="btn btn-primary w-100 py-2">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
