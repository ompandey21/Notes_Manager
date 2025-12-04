import React, { useState, useEffect } from 'react';
import { shareService, groupService, userService } from '../services/apiServices';
import { getErrorMessage } from '../utils/helpers';
import '../styles/share.css';

/**
 * Share Dialog Component
 */
const ShareDialog = ({ noteId, onClose }) => {
  const [permission, setPermission] = useState('VIEW');
  const [shareType, setShareType] = useState('user'); // user or group
  const [userEmail, setUserEmail] = useState('');
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Load shares and groups
   */
  useEffect(() => {
    loadShares();
    loadGroups();
  }, [noteId]);

  /**
   * Load shares
   */
  const loadShares = async () => {
    try {
      const data = await shareService.getNoteShares(noteId);
      setShares(data);
    } catch (err) {
      console.error('Failed to load shares:', err);
    }
  };

  /**
   * Load groups
   */
  const loadGroups = async () => {
    try {
      const data = await groupService.getGroups();
      setGroups(data);
    } catch (err) {
      console.error('Failed to load groups:', err);
    }
  };

  /**
   * Share with user
   */
  const handleShareUser = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const targetEmail = userEmail.trim();
      if (!targetEmail) {
        setError('Please enter a valid email');
        return;
      }

      const user = await userService.findByEmail(targetEmail);
      await shareService.shareWithUser(noteId, user._id, permission);
      setUserEmail('');
      loadShares();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Share with group
   */
  const handleShareGroup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await shareService.shareWithGroup(noteId, selectedGroupId, permission);
      setSelectedGroupId('');
      loadShares();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove share
   */
  const handleUnshare = async (sharedWithId) => {
    try {
      await shareService.unshareNote(noteId, sharedWithId);
      loadShares();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="share-dialog-overlay">
      <div className="share-dialog">
        <h2>Share Note</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="share-tabs">
          <button
            className={`tab ${shareType === 'user' ? 'active' : ''}`}
            onClick={() => setShareType('user')}
          >
            Share with User
          </button>
          <button
            className={`tab ${shareType === 'group' ? 'active' : ''}`}
            onClick={() => setShareType('group')}
          >
            Share with Group
          </button>
        </div>

        {shareType === 'user' ? (
          <form onSubmit={handleShareUser}>
            <input
              type="email"
              placeholder="User email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
              disabled={loading}
            />
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
              disabled={loading}
            >
              <option value="VIEW">View</option>
              <option value="COMMENT">Comment</option>
              <option value="EDIT">Edit</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Sharing...' : 'Share'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleShareGroup}>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Select a group</option>
              {groups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.name}
                </option>
              ))}
            </select>
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
              disabled={loading}
            >
              <option value="VIEW">View</option>
              <option value="COMMENT">Comment</option>
              <option value="EDIT">Edit</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Sharing...' : 'Share'}
            </button>
          </form>
        )}

        <div className="current-shares">
          <h3>Current Shares</h3>
          {shares.length === 0 ? (
            <p>Not shared yet</p>
          ) : (
            <div className="shares-list">
              {shares.map((share) => (
                <div key={share._id || share.groupId} className="share-item">
                  <div>
                    <p>
                      {share.sharedWith?.email || share.groupId?.name}
                    </p>
                    <span className="permission-badge">
                      {share.permission}
                    </span>
                  </div>
                  <button
                    onClick={() => handleUnshare(share.sharedWith?._id || share.groupId)}
                    className="btn-small btn-danger"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={onClose} className="btn-secondary">
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareDialog;
