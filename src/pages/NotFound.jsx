import { Link } from 'react-router-dom'
import Button from '../components/Button/Button'
import { FaHome } from 'react-icons/fa'
import './NotFound.css'

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-text">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button
            variant="primary"
            leftIcon={<FaHome />}
          >
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound