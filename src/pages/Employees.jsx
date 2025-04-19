import React, { useState, useRef, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./Employees.css";

const initialEmployees = [
  {
    id: "1",
    profile: {
      bgColor: "#4338ca",
      initials: "JC",
      img: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    fullName: "Jane Copper",
    email: "jane.copper@example.com",
    phone: "(704) 555-0127",
    position: "Intern",
    department: "Designer",
    dateOfJoining: "10/10/18"
  },
  {
    id: "2",
    profile: {
      bgColor: "#0891b2",
      initials: "AM",
      img: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    fullName: "Arlene McCoy",
    email: "arlene.mccoy@example.com",
    phone: "(302) 555-0107",
    position: "Full Time",
    department: "Designer",
    dateOfJoining: "11/12/19"
  },
  {
    id: "3",
    profile: {
      bgColor: "#7e22ce",
      initials: "CF",
      img: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    fullName: "Cody Fisher",
    email: "deanna.curtis@example.com",
    phone: "(252) 555-0126",
    position: "Senior",
    department: "Backend Development",
    dateOfJoining: "08/15/17"
  },
  {
    id: "4",
    profile: {
      bgColor: "#be123c",
      initials: "JW",
      img: "https://randomuser.me/api/portraits/women/4.jpg"
    },
    fullName: "Janney Wilson",
    email: "janney.wilson@example.com",
    phone: "(252) 555-0126",
    position: "Junior",
    department: "Backend Development",
    dateOfJoining: "12/04/17"
  },
  {
    id: "5",
    profile: {
      bgColor: "#92400e",
      initials: "LA",
      img: "https://randomuser.me/api/portraits/men/5.jpg"
    },
    fullName: "Leslie Alexander",
    email: "willie.jennings@example.com",
    phone: "(207) 555-0119",
    position: "Team Lead",
    department: "Human Resource",
    dateOfJoining: "05/30/14"
  }
];

const POSITION_OPTIONS = [
  "Position",
  "Intern",
  "Full Time",
  "Senior",
  "Junior",
  "Team Lead"
];

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState("Position");
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRefs = useRef({});

  useEffect(() => {
    // Simulated localStorage for demo
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

  // Filtering logic
  let filtered = employees.filter(
    (e) =>
      (position === "Position" || e.position === position) &&
      (e.fullName.toLowerCase().includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase()) ||
        e.phone.includes(search))
  );

  // Action handlers (replace with your real handlers)
  function handleEdit(employee) {
    alert("Edit: " + employee.fullName);
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
                          handleEdit(e);
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
    </div>
  );
}
