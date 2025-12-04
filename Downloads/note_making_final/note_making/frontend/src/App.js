import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, AppContext } from './context/AppContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NoteEditor from './pages/NoteEditor';
import GroupManagement from './pages/GroupManagement';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import './styles/global.css';

/**
 * Protected Route Component
 */
const ProtectedRoute = ({ children }) => {
  const { token } = React.useContext(AppContext);
  return token ? children : <Navigate to="/login" replace />;
};

const HomeRedirect = () => {
  const { token } = React.useContext(AppContext);
  return token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

/**
 * Main App Component
 */
const App = () => {
  return (
    <Router>
      <AppProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notes/new"
            element={
              <ProtectedRoute>
                <NoteEditor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notes/:id"
            element={
              <ProtectedRoute>
                <NoteEditor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/groups"
            element={
              <ProtectedRoute>
                <GroupManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<HomeRedirect />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="*" element={<HomeRedirect />} />
        </Routes>
      </AppProvider>
    </Router>
  );
};

export default App;
