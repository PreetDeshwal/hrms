import { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import './Attendance.css'

const STATUS_OPTIONS = ['Present', 'Absent', 'Late', 'Half Day']

export default function Attendance() {
  const [employees, setEmployees] = useState([])
  const [attendance, setAttendance] = useState([])
  const [date] = useState(new Date().toISOString().slice(0, 10))
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const storedEmployees = localStorage.getItem('employees')
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees))
    } else {
      // Demo employees
      setEmployees([
        {
          id: '1',
          profile: { img: 'https://randomuser.me/api/portraits/men/65.jpg', initials: 'AK', bgColor: '#4338ca' },
          fullName: 'Amit Kumar',
          position: 'Full Time',
          department: 'UI/UX Designer'
        },
        {
          id: '2',
          profile: { img: 'https://randomuser.me/api/portraits/women/44.jpg', initials: 'PS', bgColor: '#0891b2' },
          fullName: 'Priya Sharma',
          position: 'Full Time',
          department: 'UI/UX Designer'
        },
        {
          id: '3',
          profile: { img: 'https://randomuser.me/api/portraits/men/23.jpg', initials: 'RV', bgColor: '#7e22ce' },
          fullName: 'Rahul Verma',
          position: 'Senior',
          department: 'Backend Development'
        },
        {
          id: '4',
          profile: { img: 'https://randomuser.me/api/portraits/women/68.jpg', initials: 'SI', bgColor: '#be123c' },
          fullName: 'Sneha Iyer',
          position: 'Junior',
          department: 'Backend Development'
        },
        {
          id: '5',
          profile: { img: 'https://randomuser.me/api/portraits/men/31.jpg', initials: 'RS', bgColor: '#92400e' },
          fullName: 'Rohit Singh',
          position: 'Team Lead',
          department: 'Human Resource'
        }
      ])
      
    }

    const storedAttendance = localStorage.getItem('attendance')
    if (storedAttendance) {
      setAttendance(JSON.parse(storedAttendance))
    } else {
      const initialAttendance = [
        {
          id: '1',
          employeeId: '1',
          date,
          status: 'Present',
          task: 'Dashboard Home page Alignment'
        },
        {
          id: '2',
          employeeId: '2',
          date,
          status: 'Absent',
          task: 'Dashboard Login page design, Dashboard Home page design'
        },
        {
          id: '3',
          employeeId: '3',
          date,
          status: 'Absent',
          task: ''
        },
        {
          id: '4',
          employeeId: '4',
          date,
          status: 'Present',
          task: 'Dashboard login page integration'
        },
        {
          id: '5',
          employeeId: '5',
          date,
          status: 'Present',
          task: '4 scheduled interview, Sorting of resumes'
        }
      ]
      setAttendance(initialAttendance)
      localStorage.setItem('attendance', JSON.stringify(initialAttendance))
    }
  }, [date])

  // Merge employee and attendance data
  const getFilteredData = () => {
    const dateAttendance = attendance.filter(a => a.date === date)
    const attendanceMap = {}
    dateAttendance.forEach(record => {
      attendanceMap[record.employeeId] = {
        status: record.status,
        task: record.task
      }
    })
    return employees
      .map(employee => {
        const attendanceInfo = attendanceMap[employee.id] || { status: 'No Record', task: '' }
        return {
          ...employee,
          attendanceStatus: attendanceInfo.status,
          task: attendanceInfo.task
        }
      })
      .filter(employee => {
        if (statusFilter === 'all') return true
        return employee.attendanceStatus === statusFilter
      })
      .filter(employee =>
        employee.fullName.toLowerCase().includes(search.toLowerCase()) ||
        employee.position.toLowerCase().includes(search.toLowerCase()) ||
        employee.department.toLowerCase().includes(search.toLowerCase())
      )
  }

  const updateAttendanceStatus = (employeeId, newStatus) => {
    const existingRecordIndex = attendance.findIndex(
      a => a.employeeId === employeeId && a.date === date
    )
    let updatedAttendance
    if (existingRecordIndex >= 0) {
      updatedAttendance = [...attendance]
      updatedAttendance[existingRecordIndex] = {
        ...updatedAttendance[existingRecordIndex],
        status: newStatus
      }
    } else {
      const newRecord = {
        id: Date.now().toString(),
        employeeId,
        date,
        status: newStatus,
        task: ''
      }
      updatedAttendance = [...attendance, newRecord]
    }
    setAttendance(updatedAttendance)
    localStorage.setItem('attendance', JSON.stringify(updatedAttendance))
  }

  return (
    <div className="attendance-ui-page">
      <div className="attendance-ui-topbar">
        <select
          className="attendance-ui-status-filter"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">Status</option>
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <div className="attendance-ui-search-box">
          <FaSearch className="attendance-ui-search-icon" />
          <input
            className="attendance-ui-search"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="attendance-ui-table-container">
        <table className="attendance-ui-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Employee Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Task</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredData().map(row => (
              <tr key={row.id}>
                <td>
                  <div className="employee-avatar" style={{ background: row.profile.bgColor }}>
                    <img src={row.profile.img} alt={row.fullName} />
                  </div>
                </td>
                <td>{row.fullName}</td>
                <td>{row.position}</td>
                <td>{row.department}</td>
                <td>
                  <div className="attendance-ui-task-cell">
                    {row.task || (row.attendanceStatus === 'Present' ? 'No tasks assigned' : '--')}
                  </div>
                </td>
                <td>
                  <select
                    className={`attendance-ui-status-select status-${row.attendanceStatus.toLowerCase()}`}
                    value={row.attendanceStatus}
                    onChange={e => updateAttendanceStatus(row.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <button className="attendance-ui-action-btn">⋮</button>
                </td>
              </tr>
            ))}
            {getFilteredData().length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: '#888' }}>
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
