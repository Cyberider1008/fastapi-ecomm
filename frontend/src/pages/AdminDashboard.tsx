import { useEffect, useState } from 'react'
import { api } from '../services/api'

type User = {
  id: number
  name: string
  email: string
  address?: string
  contact_number?: string
  dob?: string
  profile_photo_url?: string
  is_active: boolean
  is_admin: boolean
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState<string | null>(null)

  async function load() {
    try {
      const res = await api.get('/admin/users')
      setUsers(res.data)
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? 'Failed to load users')
    }
  }

  async function toggle(id: number, currentStatus: boolean) {
    await api.patch(`/admin/users/${id}/toggle-active`, {
      is_active: !currentStatus
    })
    await load()
  }

  useEffect(() => { load() }, [])

  return (
    <div>
      <h3>Admin Dashboard</h3>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.profile_photo_url ? <img src={u.profile_photo_url} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 18 }} /> : '-'}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.contact_number ?? '-'}</td>
              <td>{u.is_admin ? 'Admin' : 'User'}</td>
              <td style={{ color: u.is_active ? 'green' : 'crimson' }}>{u.is_active ? 'Active' : 'Inactive'}</td>
              <td>
                <button onClick={() => toggle(u.id, u.is_active)}>{u.is_active ? 'Deactivate' : 'Activate'}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


