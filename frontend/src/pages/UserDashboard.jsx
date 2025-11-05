import { useEffect, useState } from 'react'
import { api } from '../services/api'

export default function UserDashboard() {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/users/me')
      setUser(res.data)
    } catch (e) {
      setError(e?.response?.data?.detail || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="loading">Loading profile...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="error">{error}</div>
        <button onClick={loadProfile} className="btn btn-primary">Retry</button>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="card">
        <div className="error">No profile data found</div>
      </div>
    )
  }

  return (
    <div className="user-dashboard">
      <div className="card">
        <h2>User Dashboard</h2>
        <div className="profile">
          {user.profile_photo_url && (
            <img src={user.profile_photo_url} alt={user.name} className="profile-photo" />
          )}
          <div className="profile-info">
            <h3>{user.name}</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Status:</strong> 
              <span className={user.is_active ? 'status-active' : 'status-inactive'}>
                {user.is_active ? ' Active' : ' Inactive'}
              </span>
            </p>
            <p><strong>Role:</strong> {user.is_admin ? 'Admin' : 'User'}</p>
            {user.contact_number && <p><strong>Contact:</strong> {user.contact_number}</p>}
            {user.address && <p><strong>Address:</strong> {user.address}</p>}
            {user.dob && <p><strong>Date of Birth:</strong> {new Date(user.dob).toLocaleDateString()}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
