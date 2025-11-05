import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import { getToken, getUserRole, logout } from './services/auth'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import './App.css'

function PrivateRoute({ children, role }) {
  const token = getToken()
  if (!token) {
    return <Navigate to="/login" replace />
  }
  if (role) {
    const userRole = getUserRole()
    if (role === 'admin' && userRole !== 'admin') {
      return <Navigate to="/user" replace />
    }
    if (role === 'user' && userRole !== 'user') {
      return <Navigate to="/admin" replace />
    }
  }
  return children
}

function Header() {
  const token = getToken()
  const role = getUserRole()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">E-Com</Link>
        <nav>
          {token ? (
            <>
              {role === 'admin' && <Link to="/admin">Admin Dashboard</Link>}
              {role === 'user' && <Link to="/user">User Dashboard</Link>}
              <span className="role-badge">{role}</span>
              <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/user"
              element={
                <PrivateRoute role="user">
                  <UserDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute role="admin">
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<div className="card"><h2>404 - Page Not Found</h2></div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
