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

export default function UserDashboard() {
  const [me, setMe] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    try {
      const res = await api.get('/users/me')
      setMe(res.data)
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? 'Failed to load profile')
    }
  }

  useEffect(() => { load() }, [])

  if (!me) return <div>{error ?? 'Loading...'}</div>

  return (
    <div>
      <h3>User Dashboard</h3>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        {me.profile_photo_url && <img src={me.profile_photo_url} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 40 }} />}
        <div>
          <div><b>{me.name}</b> ({me.email})</div>
          <div>Status: <span style={{ color: me.is_active ? 'green' : 'crimson' }}>{me.is_active ? 'Active' : 'Inactive'}</span></div>
          <div>Contact: {me.contact_number ?? '-'}</div>
          <div>Address: {me.address ?? '-'}</div>
          <div>DOB: {me.dob ?? '-'}</div>
        </div>
      </div>
    </div>
  )
}


