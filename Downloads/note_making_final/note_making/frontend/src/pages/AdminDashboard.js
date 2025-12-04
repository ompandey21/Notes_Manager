import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/apiServices';
import { useApp } from '../utils/helpers';
import { getErrorMessage, formatDate } from '../utils/helpers';
import '../styles/admin.css';

/**
 * Admin Dashboard Component
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useApp();

  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  /**
   * Load admin data
   */
  useEffect(() => {
    loadAdminData();
  }, [page]);

  /**
   * Load admin data
   */
  const loadAdminData = async () => {
    setLoading(true);
    setError('');

    try {
      const [analyticsData, usersData] = await Promise.all([
        adminService.getAnalytics(),
        adminService.getUsers(page, 20),
      ]);

      setAnalytics(analyticsData);
      setUsers(usersData.users);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Deactivate user
   */
  const handleDeactivateUser = async (userId) => {
    try {
      await adminService.deactivateUser(userId);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isActive: false } : u))
      );
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  /**
   * Activate user
   */
  const handleActivateUser = async (userId) => {
    try {
      await adminService.activateUser(userId);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isActive: true } : u))
      );
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) {
    return <div className="loading">Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      {error && <div className="error-message">{error}</div>}

      {analytics && (
        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>Total Users</h3>
            <p className="analytics-value">{analytics.totalUsers}</p>
          </div>
          <div className="analytics-card">
            <h3>Total Notes</h3>
            <p className="analytics-value">{analytics.totalNotes}</p>
          </div>
          <div className="analytics-card">
            <h3>Shared Notes</h3>
            <p className="analytics-value">{analytics.totalSharedNotes}</p>
          </div>
          <div className="analytics-card">
            <h3>Total Groups</h3>
            <p className="analytics-value">{analytics.totalGroups}</p>
          </div>
        </div>
      )}

      <div className="admin-section">
        <h2>Most Active Users</h2>
        {analytics?.mostActiveUsers?.length > 0 ? (
          <div className="users-list">
            {analytics.mostActiveUsers.map((user) => (
              <div key={user._id} className="user-item">
                <span>{user.username}</span>
                <span className="badge">{user.email}</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No user activity</p>
        )}
      </div>

      <div className="admin-section">
        <h2>Most Used Tags</h2>
        {analytics?.mostUsedTags?.length > 0 ? (
          <div className="tags-list">
            {analytics.mostUsedTags.map((tag) => (
              <div key={tag._id} className="tag-item">
                <span>{tag.tagInfo?.[0]?.name || 'Unknown'}</span>
                <span className="count">{tag.count} uses</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No tags used</p>
        )}
      </div>

      <div className="admin-section">
        <h2>Users Management</h2>
        {users.length > 0 ? (
          <table className="users-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.isActive ? '✓ Active' : '✗ Inactive'}</td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td>
                    {u.isActive ? (
                      <button
                        onClick={() => handleDeactivateUser(u._id)}
                        className="btn-small btn-danger"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivateUser(u._id)}
                        className="btn-small"
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users found</p>
        )}
      </div>

      <button
        onClick={() => navigate('/dashboard')}
        className="btn-secondary"
        style={{ marginTop: '20px' }}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default AdminDashboard;
