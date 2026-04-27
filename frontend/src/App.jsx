import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './styles/theme.css';

// Components
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Plans from './pages/Plans';
import Refer from './pages/Refer';
import Profile from './pages/Profile';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import History from './pages/History';
import Settings from './pages/Settings';

// Admin Components
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPlans from './pages/admin/AdminPlans';
import AdminLogin from './pages/admin/AdminLogin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Standard User Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="plans" element={<Plans />} />
            <Route path="refer" element={<Refer />} />
            <Route path="profile" element={<Profile />} />
            <Route path="deposit" element={<Deposit />} />
            <Route path="withdraw" element={<Withdraw />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Admin Login (Public) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="transactions" element={<AdminTransactions />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="plans" element={<AdminPlans />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
