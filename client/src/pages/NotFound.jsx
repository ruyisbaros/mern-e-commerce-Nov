import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className="position-relative" style={{ minHeight: "calc(100vh - 70px)" }}>
            <h2 className="position-absolute text-secondary" style={{ top: "50%", left: "50%", transform: 'translate(-50%, -50%)' }}>404 || Page not found. <br /> Please try again or <Link to="/">turn</Link> Homepage</h2>
        </div>
    )
}

export default NotFound
