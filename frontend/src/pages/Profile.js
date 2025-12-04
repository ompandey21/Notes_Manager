import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/apiServices';
import { useApp, getErrorMessage, formatDate } from '../utils/helpers';
import '../styles/profile.css';

/**
 * Profile view with logout action
 */
const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useApp();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(!user);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      setError('');

      try {
        const fetchedProfile = await authService.getProfile();
        if (isMounted) {
          setProfile(fetchedProfile);
        }
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <header>
          <p className="profile-tag">Account</p>
          <h1>My Profile</h1>
          <p className="profile-subtitle">Manage your account and logout securely.</p>
        </header>

        {loading ? (
          <p className="loading">Loading profile...</p>
        ) : (
          <div className="profile-details">
            {error && <div className="error-message">{error}</div>}
            <div className="profile-row">
              <span>Username</span>
              <strong>{profile?.username || '—'}</strong>
            </div>
            <div className="profile-row">
              <span>Email</span>
              <strong>{profile?.email || '—'}</strong>
            </div>
            <div className="profile-row">
              <span>Role</span>
              <strong>{profile?.role || 'Member'}</strong>
            </div>
            <div className="profile-row">
              <span>Member since</span>
              <strong>
                {profile?.createdAt ? formatDate(profile.createdAt) : '—'}
              </strong>
            </div>
          </div>
        )}

        <div className="profile-actions">
          <button className="btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
