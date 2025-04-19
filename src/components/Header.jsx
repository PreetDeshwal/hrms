import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FaBell, FaUser, FaSearch } from 'react-icons/fa'
import './Header.css'

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const dropdownRef = useRef(null)
  const profileModalRef = useRef(null)
  const logoutModalRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileModalRef.current && !profileModalRef.current.contains(e.target)) {
        setShowProfileModal(false)
      }
      if (logoutModalRef.current && !logoutModalRef.current.contains(e.target)) {
        setShowLogoutModal(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showProfileModal, showLogoutModal])

  const handleProfile = () => {
    setShowDropdown(false)
    setShowProfileModal(true)
  }

  const handleLogoutClick = () => {
    setShowDropdown(false)
    setShowLogoutModal(true)
  }

  const handleLogoutConfirm = () => {
    logout()
    setShowLogoutModal(false)
    navigate('/login')
  }

  return (
    <>
      <header className="header">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
          />
        </div>

        <div className="header-actions">
          <div className="notification-icon">
            <FaBell />
            <span className="notification-badge">3</span>
          </div>

          <div className="user-menu">
            <button 
              className="user-button" 
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="user-avatar">
                <FaUser />
              </div>
              <span className="user-name">{user?.name || 'User'}</span>
            </button>

            {showDropdown && (
              <div className="user-dropdown" ref={dropdownRef}>
                <div className="user-info">
                  <div className="user-avatar">
                    <FaUser />
                  </div>
                  <div>
                    <p className="user-name">{user?.name || 'User'}</p>
                    <p className="user-email">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
                <ul className="dropdown-menu">
                  <li>
                    <button className="dropdown-link" onClick={handleProfile}>
                      My Profile
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-link" onClick={handleLogoutClick}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal-backdrop">
          <div className="profile-modal" ref={profileModalRef}>
            <div className="modal-header">
              <div className="user-avatar large">
                <FaUser />
              </div>
              <h2>{user?.name || 'User'}</h2>
              <p className="user-email">{user?.email || 'user@example.com'}</p>
            </div>
            <div className="modal-body">
              <div className="info-row">
                <span>Position:</span>
                <span>{user?.position || 'Not specified'}</span>
              </div>
              <div className="info-row">
                <span>Department:</span>
                <span>{user?.department || 'Not specified'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-backdrop">
          <div className="logout-modal" ref={logoutModalRef}>
            <div className="modal-header">
              <h2>Log Out</h2>
              <p>Are you sure you want to log out?</p>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button 
                className="logout-btn"
                onClick={handleLogoutConfirm}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
