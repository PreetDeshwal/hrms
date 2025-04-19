import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  FaUserPlus,
  FaUsers,
  FaChartBar,
  FaCalendarAlt,
  FaCalendarCheck,
  FaSignOutAlt,
  FaRegStar
} from 'react-icons/fa'
import Logo from './Logo'
import LogoutModal from './LogoutModal'
import './Sidebar.css'

const Sidebar = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogoutClick = () => setShowLogoutModal(true)
  const handleCancel = () => setShowLogoutModal(false)
  const handleLogoutConfirm = () => {
    setShowLogoutModal(false)
    logout()
    navigate('/login')
  }

  return (
    <>
      <aside className="custom-sidebar">
        <div className="sidebar-logo">
          <Logo />
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Recruitment</div>
          <NavLink
            to="/candidates"
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            <FaUserPlus />
            <span>Candidates</span>
          </NavLink>
          <div className="sidebar-section-label">Organization</div>
          <NavLink
            to="/employees"
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            <FaUsers />
            <span>Employees</span>
          </NavLink>
          <NavLink
            to="/attendance"
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            <FaCalendarCheck />
            <span>Attendance</span>
          </NavLink>
          <NavLink
            to="/leaves"
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            <FaRegStar />
            <span>Leaves</span>
          </NavLink>
          <div className="sidebar-section-label">Others</div>
          <button className="sidebar-link logout-link" onClick={handleLogoutClick}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </nav>
      </aside>
      <LogoutModal
        open={showLogoutModal}
        onCancel={handleCancel}
        onLogout={handleLogoutConfirm}
      />
    </>
  )
}

export default Sidebar
