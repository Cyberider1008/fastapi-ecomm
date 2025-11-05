import { Route, Routes, Navigate, Link } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import { getToken, getUserRole, logout } from './services/auth'

function PrivateRoute({ children, role }: { children: JSX.Element, role?: 'admin' | 'user' }) {
  const token = getToken()
  if (!token) return <Navigate to="/login" replace />
  if (role) {
    const userRole = getUserRole()
    if (role === 'admin' && userRole !== 'admin') return <Navigate to="/user" replace />
    if (role === 'user' && userRole !== 'user') return <Navigate to="/admin" replace />
  }
  return children
}

export default function App() {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 16 }}>
      <header style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ flex: 1 }}>E-Com</h2>
        <span style={{ opacity: 0.8 }}>Role: {getUserRole() ?? '-'}</span>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/user">User</Link>
        <Link to="/admin">Admin</Link>
        <button onClick={() => { logout(); window.location.href = '/login' }}>Logout</button>
      </header>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
        <Route path="/user" element={<PrivateRoute role="user"><UserDashboard /></PrivateRoute>} />
        <Route path="*" element={<div>Not found</div>} />
      </Routes>
    </div>
  )
}


