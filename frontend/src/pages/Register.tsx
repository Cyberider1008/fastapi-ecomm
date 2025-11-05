import { useState } from 'react'
import { register as apiRegister } from '../services/auth'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [address, setAddress] = useState('')
  const [contact, setContact] = useState('')
  const [dob, setDob] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const navigate = useNavigate()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    try {
      const form = new FormData()
      form.append('name', name)
      form.append('email', email)
      form.append('password', password)
      if (address) form.append('address', address)
      if (contact) form.append('contact_number', contact)
      if (dob) form.append('dob', dob)
      if (photo) form.append('profile_photo', photo)
      await apiRegister(form)
      setSuccess('Registered. You can login now.')
      setTimeout(() => navigate('/login'), 800)
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? 'Registration failed')
    }
  }

  return (
    <div>
      <h3>User Registration</h3>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 500 }}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <input placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
        <input placeholder="Contact number" value={contact} onChange={e => setContact(e.target.value)} />
        <input type="date" placeholder="DOB" value={dob} onChange={e => setDob(e.target.value)} />
        <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files?.[0] ?? null)} />
        <button type="submit">Register</button>
      </form>
    </div>
  )
}


