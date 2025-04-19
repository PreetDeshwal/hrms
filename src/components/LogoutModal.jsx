import React from "react";
import "./LogoutModal.css";

const LogoutModal = ({ open, onCancel, onLogout }) => {
  if (!open) return null;
  return (
    <div className="logout-modal-overlay">
      <div className="logout-modal-box">
        <div className="logout-modal-header">Log Out</div>
        <div className="logout-modal-content">
          <div className="logout-modal-message">
            Are you sure you want to log out?
          </div>
          <div className="logout-modal-actions">
            <button className="logout-modal-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button className="logout-modal-logout" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
