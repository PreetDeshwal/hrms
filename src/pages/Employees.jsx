import React, { useState, useEffect, useRef } from 'react'
import { FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa'
import './Employees.css'

const initialCandidates = [
  {
    id: '1',
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '9876543210',
    position: 'Senior Developer',
    status: 'New',
    experience: '3+',
    resume: 'Resume content for Aarav'
  },
  {
    id: '2',
    fullName: 'Priya Singh',
    email: 'priya.singh@example.com',
    phone: '9123456780',
    position: 'Human Resource Intern',
    status: 'New',
    experience: '1+',
    resume: 'Resume content for Priya'
  },
  {
    id: '3',
    fullName: 'Kabir Verma',
    email: 'kabir.verma@example.com',
    phone: '9988776655',
    position: 'Full Time Designer',
    status: 'Selected',
    experience: '2+',
    resume: 'Resume content for Kabir'
  },
  {
    id: '4',
    fullName: 'Sneha Iyer',
    email: 'sneha.iyer@example.com',
    phone: '9876501234',
    position: 'Full Time Developer',
    status: 'Rejected',
    experience: '0',
    resume: 'Resume content for Sneha'
  }
]


const POSITION_OPTIONS = [
  "Position",
  "Intern",
  "Full Time",
  "Senior",
  "Junior",
  "Team Lead"
];

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [search, setSearch] = useState("")
  const [position, setPosition] = useState("Position")
  const [menuOpen, setMenuOpen] = useState(null)
  const menuRefs = useRef({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editEmployee, setEditEmployee] = useState(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    dateOfJoining: ''
  })

  useEffect(() => {
    const stored = localStorage.getItem("employees");
    if (stored) setEmployees(JSON.parse(stored));
    else {
      setEmployees(initialEmployees);
      localStorage.setItem("employees", JSON.stringify(initialEmployees));
    }
  }, []);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e) {
      if (
        menuOpen !== null &&
        menuRefs.current[menuOpen] &&
        !menuRefs.current[menuOpen].contains(e.target)
      ) {
        setMenuOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  // Filtering
  let filtered = employees.filter(
    (e) =>
      (position === "Position" || e.position === position) &&
      (e.fullName.toLowerCase().includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase()) ||
        e.phone.includes(search))
  );

  // Helpers
  const getProfileInitials = (name) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const getRandomColor = () => {
    const colors = [
      "#4338ca", "#0891b2", "#7e22ce", "#be123c", "#92400e", "#166534", "#9f1239", "#1e40af"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Modal handlers
  function openAddModal() {
    setEditEmployee(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      dateOfJoining: "",
    });
    setIsModalOpen(true);
  }

  function openEditModal(employee) {
    setEditEmployee(employee);
    setFormData({
      fullName: employee.fullName,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      dateOfJoining: employee.dateOfJoining,
    });
    setIsModalOpen(true);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.position ||
      !formData.department ||
      !formData.dateOfJoining
    ) {
      alert("Please fill all fields");
      return;
    }
    if (editEmployee) {
      // Edit
      const updated = employees.map((emp) =>
        emp.id === editEmployee.id
          ? {
              ...emp,
              ...formData,
              profile: {
                ...emp.profile,
                initials: getProfileInitials(formData.fullName)
              }
            }
          : emp
      );
      setEmployees(updated);
      localStorage.setItem("employees", JSON.stringify(updated));
    } else {
      // Add
      const newEmployee = {
        id: Date.now().toString(),
        profile: {
          bgColor: getRandomColor(),
          initials: getProfileInitials(formData.fullName)
        },
        ...formData
      };
      const updated = [...employees, newEmployee];
      setEmployees(updated);
      localStorage.setItem("employees", JSON.stringify(updated));
    }
    setIsModalOpen(false);
  }

  function handleDelete(employee) {
    if (window.confirm(`Delete ${employee.fullName}?`)) {
      const updated = employees.filter((emp) => emp.id !== employee.id);
      setEmployees(updated);
      localStorage.setItem("employees", JSON.stringify(updated));
    }
  }

  return (
    <div className="employees-page">
      <div className="employees-header-row">
        <select
          className="employees-filter"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        >
          {POSITION_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <div className="employees-search-box">
          <input
            className="employees-search"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="employees-search-icon" aria-hidden>
            &#128269;
          </span>
        </div>
        <button className="add-employee-btn" onClick={openAddModal}>
          <FaUserPlus style={{ marginRight: 6 }} /> Add Employee
        </button>
      </div>
      <div className="employees-table-container">
        <table className="employees-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Employee Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Position</th>
              <th>Department</th>
              <th>Date of Joining</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id}>
                <td>
                  <div
                    className="employee-avatar"
                    style={{ background: e.profile.bgColor }}
                  >
                    {e.profile.img ? (
                      <img
                        src={e.profile.img}
                        alt={e.fullName}
                        style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                      />
                    ) : (
                      e.profile.initials
                    )}
                  </div>
                </td>
                <td>{e.fullName}</td>
                <td>{e.email}</td>
                <td>{e.phone}</td>
                <td>{e.position}</td>
                <td>{e.department}</td>
                <td>{e.dateOfJoining}</td>
                <td className="action-cell">
                  <button
                    className="action-button"
                    onClick={() => setMenuOpen(menuOpen === e.id ? null : e.id)}
                    aria-label="Open action menu"
                  >
                    ⋮
                  </button>
                  {menuOpen === e.id && (
                    <div
                      className="action-dropdown"
                      ref={(el) => (menuRefs.current[e.id] = el)}
                    >
                      <button
                        className="action-item"
                        onClick={() => {
                          openEditModal(e);
                          setMenuOpen(null);
                        }}
                      >
                        <FaEdit style={{ marginRight: 6 }} />
                        Edit
                      </button>
                      <button
                        className="action-item"
                        onClick={() => {
                          handleDelete(e);
                          setMenuOpen(null);
                        }}
                      >
                        <FaTrash style={{ marginRight: 6 }} />
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", color: "#888" }}>
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="employees-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="employees-modal" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: 16 }}>
              {editEmployee ? "Edit Employee" : "Add Employee"}
            </h2>
            <form onSubmit={handleSubmit} className="employee-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name*</label>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address*</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number*</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Position*</label>
                  <input
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Department*</label>
                  <input
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date of Joining*</label>
                  <input
                    name="dateOfJoining"
                    type="text"
                    placeholder="MM/DD/YY"
                    value={formData.dateOfJoining}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 18 }}>
                <button type="button" className="employees-modal-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button className="employees-modal-submit" type="submit">
                  {editEmployee ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
