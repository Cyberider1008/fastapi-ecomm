import { useEffect, useState } from 'react'
import { api } from '../services/api'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(null)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/admin/users')
      setUsers(res.data)
    } catch (e) {
      setError(e?.response?.data?.detail || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  async function toggleActive(userId, currentStatus) {
    setToggling(userId)
    try {
      await api.patch(`/admin/users/${userId}/toggle-active`, {
        is_active: !currentStatus
      })
      await loadUsers()
    } catch (e) {
      setError(e?.response?.data?.detail || 'Failed to update user status')
    } finally {
      setToggling(null)
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="loading">Loading users...</div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="card">
        <h2>Admin Dashboard</h2>
        {error && <div className="error">{error}</div>}
        
        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <>
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>
                      {user.profile_photo_url ? (
                        <img src={user.profile_photo_url} alt={user.name} className="avatar" />
                      ) : (
                        <div className="avatar-placeholder">{user.name.charAt(0).toUpperCase()}</div>
                      )}
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.contact_number || '-'}</td>
                    <td>
                      <span className={`badge ${user.is_admin ? 'badge-admin' : 'badge-user'}`}>
                        {user.is_admin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td>
                      <span className={user.is_active ? 'status-active' : 'status-inactive'}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleActive(user.id, user.is_active)}
                        disabled={toggling === user.id}
                        className={`btn btn-sm ${user.is_active ? 'btn-danger' : 'btn-success'}`}
                      >
                        {toggling === user.id ? 'Updating...' : (user.is_active ? 'Deactivate' : 'Activate')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="user-count">Total users: {users.length}</p>
          </>
        )}
      </div>
    </div>
  )
}

