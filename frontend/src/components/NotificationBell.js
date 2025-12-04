import React, { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import { useApp } from '../utils/helpers';
import { formatRelativeTime } from '../utils/helpers';
import '../styles/notification.css';

/**
 * Notification Bell Component
 */
const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    fetchNotifications,
  } = useApp();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const bellRef = useRef(null);

  const handleNotificationClick = async (notificationId, status) => {
    if (status === 'UNREAD') {
      try {
        await markNotificationAsRead(notificationId);
      } catch (error) {
        console.error('Could not mark notification as read:', error);
      }
    }
  };

  const toggleDropdown = () => {
    if (!showDropdown) {
      fetchNotifications().catch((error) => {
        console.error('Failed to refresh notifications:', error);
      });
    }
    setShowDropdown((prev) => !prev);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        showDropdown &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        bellRef.current &&
        !bellRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showDropdown]);

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <button
        className="bell-btn"
        onClick={toggleDropdown}
        ref={bellRef}
        aria-label="Toggle notifications"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-dropdown" role="dialog" aria-live="polite">
          <div className="dropdown-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="btn-small"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <p className="empty-message">No notifications yet</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`notification-item ${
                    notification.status === 'UNREAD' ? 'unread' : ''
                  }`}
                  onClick={() =>
                    handleNotificationClick(notification._id, notification.status)
                  }
                >
                  <p className="notification-message">
                    {notification.message}
                  </p>
                  <span className="notification-time">
                    {formatRelativeTime(notification.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
