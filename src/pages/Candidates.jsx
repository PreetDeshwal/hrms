import { useState, useEffect, useRef } from 'react'
import { FaDownload, FaEdit, FaTrash, FaPlus, FaFileAlt, FaEllipsisV } from 'react-icons/fa'
import jsPDF from 'jspdf'
import './Candidates.css'

const STATUS_OPTIONS = ['New', 'Selected', 'Rejected']
const POSITION_OPTIONS = [
  'All Positions',
  'Senior Developer',
  'UI/UX Designer',
  'Full Stack Developer',
  'Human Resource Intern',
  'Full Time Designer',
  'Full Time Developer'
]

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


export default function Candidates() {
  const [candidates, setCandidates] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [positionFilter, setPositionFilter] = useState('')
  const [showMenu, setShowMenu] = useState(null)
  const menuRefs = useRef({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    resumeFile: null,
    status: 'New' // Default status for new candidates
  })
  const [editId, setEditId] = useState(null)
  const [fileUploadName, setFileUploadName] = useState('No file chosen')

  useEffect(() => {
    const stored = localStorage.getItem('candidates')
    if (stored) setCandidates(JSON.parse(stored))
    else {
      setCandidates(initialCandidates)
      localStorage.setItem('candidates', JSON.stringify(initialCandidates))
    }
  }, [])

  // Close action menu on outside click
  useEffect(() => {
    function handleClick(e) {
      if (
        showMenu !== null &&
        menuRefs.current[showMenu] &&
        !menuRefs.current[showMenu].contains(e.target)
      ) {
        setShowMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showMenu])

  const handleStatusChange = (id, newStatus) => {
    const updated = candidates.map((c) =>
      c.id === id ? { ...c, status: newStatus } : c
    )
    setCandidates(updated)
    localStorage.setItem('candidates', JSON.stringify(updated))
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      const updated = candidates.filter((c) => c.id !== id)
      setCandidates(updated)
      localStorage.setItem('candidates', JSON.stringify(updated))
    }
  }

  const downloadResume = (candidate) => {
    const pdf = new jsPDF()
    pdf.setFontSize(20)
    pdf.text(candidate.fullName, 20, 20)
    pdf.setFontSize(12)
    pdf.text(`Email: ${candidate.email}`, 20, 30)
    pdf.text(`Phone: ${candidate.phone}`, 20, 37)
    pdf.text(`Position: ${candidate.position}`, 20, 44)
    pdf.text(`Status: ${candidate.status}`, 20, 51)
    pdf.setFontSize(14)
    pdf.text('Resume', 20, 65)
    pdf.setFontSize(10)
    const resumeText = candidate.resume || 'No resume content available.'
    const textLines = pdf.splitTextToSize(resumeText, 170)
    pdf.text(textLines, 20, 75)
    pdf.save(`${candidate.fullName.replace(/\s+/g, '_')}_Resume.pdf`)
  }

  // Filtering
  let filtered = candidates.filter((c) =>
    c.fullName.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.position.toLowerCase().includes(search.toLowerCase())
  )
  if (statusFilter) filtered = filtered.filter((c) => c.status === statusFilter)
  if (positionFilter && positionFilter !== 'All Positions')
    filtered = filtered.filter((c) => c.position === positionFilter)

  // Modal handlers
  const openModal = (candidate = null) => {
    if (candidate) {
      setFormData({
        fullName: candidate.fullName,
        email: candidate.email,
        phone: candidate.phone,
        position: candidate.position,
        experience: candidate.experience,
        resumeFile: null,
        status: candidate.status
      })
      setEditId(candidate.id)
    } else {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        resumeFile: null,
        status: 'New'
      })
      setEditId(null)
    }
    setFileUploadName('No file chosen')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditId(null)
  }

  const handleFormChange = (e) => {
    const { name, value, files } = e.target
    
    if (name === 'resumeFile' && files && files[0]) {
      setFormData((prev) => ({ ...prev, resumeFile: files[0] }))
      setFileUploadName(files[0].name)
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.position ||
      !formData.experience
    ) {
      alert('Please fill all required fields.')
      return
    }
    
    // Process file or use text content
    let resumeContent = 'No resume provided'
    if (formData.resumeFile) {
      // In a real app, you'd upload the file to a server
      // Here we'll just store the filename
      resumeContent = `Resume uploaded: ${formData.resumeFile.name}`
    }
    
    if (editId) {
      const updated = candidates.map((c) =>
        c.id === editId ? { 
          ...c, 
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          position: formData.position,
          experience: formData.experience,
          resume: resumeContent,
          // Status stays the same or can be updated separately
        } : c
      )
      setCandidates(updated)
      localStorage.setItem('candidates', JSON.stringify(updated))
    } else {
      const newCandidate = {
        id: Date.now().toString(),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        experience: formData.experience,
        status: 'New', // Default status for new candidates
        resume: resumeContent
      }
      const updated = [...candidates, newCandidate]
      setCandidates(updated)
      localStorage.setItem('candidates', JSON.stringify(updated))
    }
    closeModal()
  }

  return (
    <div className="candidates-ui-container">
      <div className="candidates-ui-filters">
        <select
          className="candidates-ui-dropdown"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          className="candidates-ui-dropdown"
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
        >
          {POSITION_OPTIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <div className="candidates-ui-search-add">
          <input
            className="candidates-ui-search"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="candidates-ui-add-btn" onClick={() => openModal()}>
            <FaPlus style={{ marginRight: 6 }} /> Add Candidate
          </button>
        </div>
      </div>
      <div className="candidates-ui-table-container">
        <table className="candidates-ui-table">
          <thead>
            <tr>
              <th>Sr no.</th>
              <th>Candidates Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Position</th>
              <th>Status</th>
              <th>Experience</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, idx) => (
              <tr key={c.id}>
                <td>{String(idx + 1).padStart(2, '0')}</td>
                <td>{c.fullName}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.position}</td>
                <td>
                  <select
                    className={`candidates-ui-status-dropdown status-${c.status.toLowerCase()}`}
                    value={c.status}
                    onChange={(e) => handleStatusChange(c.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td>{c.experience}</td>
                <td>
                  <div
                    className="candidates-ui-action-menu"
                    ref={el => (menuRefs.current[c.id] = el)}
                  >
                    <button
                      className="candidates-ui-action-dots"
                      onClick={() => setShowMenu(showMenu === c.id ? null : c.id)}
                      tabIndex={0}
                    >
                      <FaEllipsisV />
                    </button>
                    {showMenu === c.id && (
                      <div className="candidates-ui-action-dropdown">
                        <button onClick={() => { downloadResume(c); setShowMenu(null); }}>
                          <FaDownload style={{ marginRight: 8 }} /> Download Resume
                        </button>
                        <button onClick={() => { handleDelete(c.id); setShowMenu(null); }}>
                          <span style={{ marginRight: 8 }}>🗑️</span> Delete Candidate
                        </button>
                        <button onClick={() => { openModal(c); setShowMenu(null); }}>
                          <span style={{ marginRight: 8 }}>✏️</span> Edit Candidate
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: '#888' }}>No candidates found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Modal with File Upload instead of Status */}
      {isModalOpen && (
        <div className="candidates-ui-modal-overlay" onClick={closeModal}>
          <div className="candidates-ui-modal" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: 16 }}>
              {editId ? 'Edit Candidate' : 'Add Candidate'}
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="candidates-ui-modal-row">
                <div className="candidates-ui-modal-group">
                  <label>Full Name*</label>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="candidates-ui-modal-group">
                  <label>Email Address*</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
              <div className="candidates-ui-modal-row">
                <div className="candidates-ui-modal-group">
                  <label>Phone Number*</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="candidates-ui-modal-group">
                  <label>Position*</label>
                  <input
                    name="position"
                    value={formData.position}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
              <div className="candidates-ui-modal-row">
                <div className="candidates-ui-modal-group">
                  <label>Experience*</label>
                  <input
                    name="experience"
                    value={formData.experience}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="candidates-ui-modal-group">
                  <label>Upload Resume*</label>
                  <div className="file-upload-container">
                    <label className="file-upload-button">
                      <FaFileAlt style={{ marginRight: 8 }} />
                      Choose File
                      <input
                        type="file"
                        name="resumeFile"
                        onChange={handleFormChange}
                        accept=".pdf,.doc,.docx"
                        style={{ display: 'none' }}
                        required={!editId} // Required only for new candidates
                      />
                    </label>
                    <div className="file-name">{fileUploadName}</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 18 }}>
                <button type="button" className="candidates-ui-modal-cancel" onClick={closeModal}>Cancel</button>
                <button className="candidates-ui-modal-submit" type="submit">
                  {editId ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
