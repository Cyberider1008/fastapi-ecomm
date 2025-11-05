import { useState } from 'react'
import { login, getUserRole } from '../services/auth'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await login(email, password)
      const role = getUserRole()
      navigate(role === 'admin' ? '/admin' : '/user')
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? 'Login failed')
    }
  }

  return (
    <div>
      <h3>Login</h3>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 400 }}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}


