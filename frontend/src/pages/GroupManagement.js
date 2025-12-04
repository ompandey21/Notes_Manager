import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupService } from '../services/apiServices';
import { useApp } from '../utils/helpers';
import { getErrorMessage } from '../utils/helpers';
import '../styles/groups.css';

/**
 * Groups Management Component
 */
const GroupManagement = () => {
  const navigate = useNavigate();
  const { user } = useApp();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  /**
   * Load groups
   */
  useEffect(() => {
    loadGroups();
  }, []);

  /**
   * Load groups
   */
  const loadGroups = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await groupService.getGroups();
      setGroups(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create group
   */
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const newGroup = await groupService.createGroup(
        formData.name,
        formData.description
      );
      setGroups((prev) => [newGroup, ...prev]);
      setFormData({ name: '', description: '' });
      setShowForm(false);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  /**
   * Delete group
   */
  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm('Delete this group?')) return;

    try {
      await groupService.deleteGroup(groupId);
      setGroups((prev) => prev.filter((g) => g._id !== groupId));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="groups-container">
      <div className="groups-header">
        <h1>Groups</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : '+ New Group'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="group-form">
          <form onSubmit={handleCreateGroup}>
            <input
              type="text"
              placeholder="Group Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <button type="submit" className="btn-primary">
              Create Group
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading groups...</div>
      ) : groups.length === 0 ? (
        <div className="empty-state">
          <p>No groups yet</p>
        </div>
      ) : (
        <div className="groups-list">
          {groups.map((group) => (
            <div key={group._id} className="group-card">
              <div className="group-info">
                <h3>{group.name}</h3>
                <p>{group.description}</p>
                <div className="group-members">
                  <p>Members: {group.members?.length || 0}</p>
                </div>
              </div>
              <div className="group-actions">
                <button
                  onClick={() => navigate(`/groups/${group._id}`)}
                  className="btn-small"
                >
                  Manage
                </button>
                {group.owner === user?.id && (
                  <button
                    onClick={() => handleDeleteGroup(group._id)}
                    className="btn-small btn-danger"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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

export default GroupManagement;
