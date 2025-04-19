import { useState, useEffect } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns'
import { FaChevronLeft, FaChevronRight, FaCheck, FaUpload, FaCalendarAlt, FaSearch, FaTimes } from 'react-icons/fa'
import './Leaves.css'

const STATUS_OPTIONS = ['Approved', 'Pending', 'Rejected']

const employeesList = [
  { 
    name: 'Amit Kumar', 
    position: 'Senior Backend Developer', 
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg' 
  },
  { 
    name: 'Priya Sharma', 
    position: 'Full Time Designer', 
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg' 
  },
  { 
    name: 'Rahul Verma', 
    position: 'UI/UX Designer', 
    avatar: 'https://randomuser.me/api/portraits/men/23.jpg' 
  }
]


const initialLeaves = [
  {
    id: '1',
    employeeName: 'Preet Kumar',
    position: 'Senior Backend Developer',
    date: '2024-09-08',
    reason: 'Visiting House',
    status: 'Approved',
    doc: ''
  }
]

export default function Leaves() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [leaves, setLeaves] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Status')
  const [formData, setFormData] = useState({
    employeeName: '',
    position: '',
    date: '',
    reason: '',
    doc: '',
    status: 'Pending'
  })
  const [showCalendar, setShowCalendar] = useState(false)

  useEffect(() => {
    const storedLeaves = localStorage.getItem('leaves')
    if (storedLeaves) setLeaves(JSON.parse(storedLeaves))
    else setLeaves(initialLeaves)
  }, [])

  // Filtered leaves for table
  const filteredLeaves = leaves.filter(l =>
    (statusFilter === 'Status' || l.status === statusFilter) &&
    (l.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      l.position.toLowerCase().includes(search.toLowerCase()) ||
      l.reason.toLowerCase().includes(search.toLowerCase()))
  )

  // Calendar helpers
  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    return eachDayOfInterval({ start, end })
  }

  // Modal handlers
  function openModal() {
    setFormData({
      employeeName: '',
      position: '',
      date: '',
      reason: '',
      doc: '',
      status: 'Pending'
    })
    setIsModalOpen(true)
    setShowCalendar(false)
  }

  function closeModal() {
    setIsModalOpen(false)
    setShowCalendar(false)
  }

  function handleFormChange(e) {
    const { name, value, files } = e.target
    if (name === 'doc') {
      setFormData(prev => ({ ...prev, doc: files[0]?.name || '' }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  function handleEmployeeSelect(name, position) {
    setFormData(prev => ({
      ...prev,
      employeeName: name,
      position
    }))
  }

  function handleCalendarDatePick(date) {
    setFormData(prev => ({
      ...prev,
      date: format(date, 'yyyy-MM-dd')
    }))
    setShowCalendar(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!formData.employeeName || !formData.position || !formData.date || !formData.reason) {
      alert('Please fill all required fields.')
      return
    }
    const newLeave = {
      id: Date.now().toString(),
      ...formData
    }
    const updatedLeaves = [...leaves, newLeave]
    setLeaves(updatedLeaves)
    localStorage.setItem('leaves', JSON.stringify(updatedLeaves))
    closeModal()
  }

  // Calendar leaves
  const leavesThisMonth = leaves.filter(l =>
    isSameMonth(new Date(l.date), currentDate)
  )

  // Table status change
  function handleStatusChange(id, newStatus) {
    const updated = leaves.map(l =>
      l.id === id ? { ...l, status: newStatus } : l
    )
    setLeaves(updated)
    localStorage.setItem('leaves', JSON.stringify(updated))
  }

  return (
    <div className="leaves-page">
      <div className="leaves-toolbar">
        <select
          className="leaves-status-filter"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="Status">Status</option>
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <div className="leaves-search-box">
          <FaSearch className="leaves-search-icon" />
          <input
            className="leaves-search"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="leaves-add-btn" onClick={openModal}>
          Add Leave
        </button>
      </div>
      <div className="leaves-container">
        {/* Left: Leaves Table */}
        <div className="leaves-main">
          <div className="leaves-table-header">
            <span>Applied Leaves</span>
          </div>
          <table className="leaves-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Docs</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#888' }}>No leaves found.</td>
                </tr>
              )}
              {filteredLeaves.map(leave => {
                const emp = employeesList.find(e => e.name === leave.employeeName)
                return (
                  <tr key={leave.id}>
                    <td>
                      <div className="employee-avatar" style={{ background: '#5E17EB' }}>
                        {emp?.avatar
                          ? <img src={emp.avatar} alt={leave.employeeName} />
                          : leave.employeeName.split(' ').map(n => n[0]).join('')}
                      </div>
                    </td>
                    <td>
                      <div className="employee-info">
                        <div>{leave.employeeName}</div>
                        <div className="employee-position">{leave.position}</div>
                      </div>
                    </td>
                    <td>{format(new Date(leave.date), 'M/dd/yy')}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <select
                        className={`status-badge status-${leave.status.toLowerCase()}`}
                        value={leave.status}
                        onChange={e => handleStatusChange(leave.id, e.target.value)}
                        style={{
                          border: 'none',
                          outline: 'none',
                          fontWeight: 500,
                          borderRadius: '24px',
                          padding: '4px 12px'
                        }}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {leave.doc && (
                        <a href="#" className="leaves-doc-link" title={leave.doc}>
                          <FaUpload />
                        </a>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {/* Right: Calendar */}
        <div className="calendar-section">
          <div className="calendar-header">
            <span className="calendar-title">Leave Calendar</span>
            <div className="calendar-navigation">
              <button className="calendar-nav-btn" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                <FaChevronLeft />
              </button>
              <span>{format(currentDate, 'MMMM, yyyy')}</span>
              <button className="calendar-nav-btn" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                <FaChevronRight />
              </button>
            </div>
          </div>
          <div className="calendar-grid">
            <div className="weekdays">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day}>{day}</div>
              ))}
            </div>
            <div className="calendar-days">
              {getDaysInMonth().map(date => {
                const hasLeave = leavesThisMonth.some(l => isSameDay(new Date(l.date), date))
                return (
                  <div
                    key={date.toString()}
                    className={`calendar-day${hasLeave ? ' has-leave' : ''}`}
                  >
                    {format(date, 'd')}
                    {hasLeave && <span className="calendar-leave-dot"></span>}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="approved-leaves">
            <div className="approved-leaves-title">Approved Leaves</div>
            {leaves
              .filter(l => l.status === 'Approved')
              .map(l => {
                const emp = employeesList.find(e => e.name === l.employeeName)
                return (
                  <div key={l.id} className="approved-leave-item">
                    <div className="employee-avatar" style={{ background: '#5E17EB' }}>
                      {emp?.avatar
                        ? <img src={emp.avatar} alt={l.employeeName} />
                        : l.employeeName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div>{l.employeeName}</div>
                      <div className="leave-date">{format(new Date(l.date), 'M/dd/yy')}</div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="leaves-modal-overlay" onClick={closeModal}>
          <div className="leaves-modal" onClick={e => e.stopPropagation()}>
            <div className="leaves-modal-header">
              <span>Add New Leave</span>
              <button className="leaves-modal-close" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>
            <form className="leave-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Search Employee Name"
                    name="employeeName"
                    value={formData.employeeName}
                    onChange={handleFormChange}
                    list="employee-list"
                    required
                  />
                  <datalist id="employee-list">
                    {employeesList.map(e => (
                      <option
                        key={e.name}
                        value={e.name}
                        onClick={() => handleEmployeeSelect(e.name, e.position)}
                      />
                    ))}
                  </datalist>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Designation*"
                    name="position"
                    value={formData.position}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group" style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Leave Date*"
                    name="date"
                    value={formData.date}
                    onFocus={() => setShowCalendar(true)}
                    onChange={handleFormChange}
                    required
                    readOnly
                  />
                  <FaCalendarAlt
                    className="leaves-modal-dateicon"
                    onClick={() => setShowCalendar(v => !v)}
                  />
                  {showCalendar && (
                    <div className="leaves-modal-calendar">
                      <div className="calendar-navigation">
                        <button className="calendar-nav-btn" type="button" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                          <FaChevronLeft />
                        </button>
                        <span>{format(currentDate, 'MMMM, yyyy')}</span>
                        <button className="calendar-nav-btn" type="button" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                          <FaChevronRight />
                        </button>
                      </div>
                      <div className="calendar-grid">
                        <div className="weekdays">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day}>{day}</div>
                          ))}
                        </div>
                        <div className="calendar-days">
                          {getDaysInMonth().map(date => (
                            <div
                              key={date.toString()}
                              className="calendar-day"
                              onClick={() => handleCalendarDatePick(date)}
                            >
                              {format(date, 'd')}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label className="leaves-doc-upload">
                    <input
                      type="file"
                      name="doc"
                      style={{ display: 'none' }}
                      onChange={handleFormChange}
                    />
                    <span>Documents</span>
                    <FaUpload />
                  </label>
                  {formData.doc && <div className="leaves-doc-filename">{formData.doc}</div>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <input
                    type="text"
                    placeholder="Reason*"
                    name="reason"
                    value={formData.reason}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="leaves-status-select"
                    required
                  >
                    <option value="">Select Status*</option>
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button
                  type="submit"
                  className="leaves-modal-save"
                  disabled={
                    !formData.employeeName ||
                    !formData.position ||
                    !formData.date ||
                    !formData.reason ||
                    !formData.status
                  }
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
