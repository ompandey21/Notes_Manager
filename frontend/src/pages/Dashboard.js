import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { noteService, tagService, shareService, notificationService } from '../services/apiServices';
import { useApp } from '../utils/helpers';
import { getErrorMessage, formatDate, truncateText } from '../utils/helpers';
import NotificationBell from '../components/NotificationBell';
import TagFilter from '../components/TagFilter';
import ShareDialog from '../components/ShareDialog';
import '../styles/dashboard.css';

/**
 * Dashboard Component
 * Main interface for viewing and managing notes
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, fetchNotifications } = useApp();

  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [shareNoteId, setShareNoteId] = useState(null);
  const [view, setView] = useState('my-notes'); // my-notes, shared

  /**
   * Load notes and tags
   */
  useEffect(() => {
    loadData();
    fetchNotifications();
  }, []);

  /**
   * Reload when view changes
   */
  useEffect(() => {
    loadNotes();
  }, [view, selectedTag, searchQuery]);

  /**
   * Load all data
   */
  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      await Promise.all([loadNotes(), loadTags()]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load notes
   */
  const loadNotes = async () => {
    try {
      let data;
      if (view === 'shared') {
        data = await shareService.getSharedNotes();
      } else {
        const filters = {};
        if (selectedTag) filters.tag = selectedTag;
        if (searchQuery) filters.search = searchQuery;
        data = await noteService.getNotes(filters);
      }
      setNotes(data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  /**
   * Load tags
   */
  const loadTags = async () => {
    try {
      const data = await tagService.getTags();
      setTags(data);
    } catch (err) {
      console.error('Failed to load tags:', err);
    }
  };

  /**
   * Delete note
   */
  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await noteService.deleteNote(noteId);
      setNotes((prev) => prev.filter((n) => n._id !== noteId));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Collaborative Notes</h2>
          <button
            onClick={() => navigate('/notes/new')}
            className="btn-primary"
          >
            + New Note
          </button>
        </div>

        <div className="sidebar-section">
          <h3>Views</h3>
          <button
            className={`sidebar-btn ${view === 'my-notes' ? 'active' : ''}`}
            onClick={() => { setView('my-notes'); setSelectedTag(null); }}
          >
            My Notes
          </button>
          <button
            className={`sidebar-btn ${view === 'shared' ? 'active' : ''}`}
            onClick={() => setView('shared')}
          >
            Shared with Me
          </button>
        </div>

        <div className="sidebar-section">
          <h3>Tags</h3>
          <TagFilter
            tags={tags}
            selectedTag={selectedTag}
            onSelectTag={setSelectedTag}
          />
        </div>

        <div className="sidebar-section">
          <h3>Quick Links</h3>
          <button
            className="sidebar-btn"
            onClick={() => navigate('/groups')}
          >
            Groups
          </button>
          {user?.role === 'ADMIN' && (
            <button
              className="sidebar-btn"
              onClick={() => navigate('/admin')}
            >
              Admin Panel
            </button>
          )}
          <button
            className="sidebar-btn"
            onClick={() => navigate('/profile')}
          >
            Profile
          </button>
        </div>
      </div>

      <div className="dashboard-main">
        <div className="dashboard-header">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <NotificationBell />
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <p>No notes found</p>
            <button
              onClick={() => navigate('/notes/new')}
              className="btn-primary"
            >
              Create your first note
            </button>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <div key={note._id} className="note-card">
                <h3
                  onClick={() => navigate(`/notes/${note._id}`)}
                  className="note-title"
                >
                  {note.title}
                </h3>
                <p className="note-preview">
                  {truncateText(note.content.replace(/<[^>]*>/g, ''), 120)}
                </p>
                <div className="note-tags">
                  {note.tags?.map((tag) => (
                    <span
                      key={tag._id}
                      className="tag"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
                <div className="note-meta">
                  <span className="note-date">{formatDate(note.updatedAt)}</span>
                </div>
                <div className="note-actions">
                  <button
                    onClick={() => navigate(`/notes/${note._id}`)}
                    className="btn-small"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShareNoteId(note._id)}
                    className="btn-small"
                  >
                    Share
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="btn-small btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {shareNoteId && (
          <ShareDialog
            noteId={shareNoteId}
            onClose={() => setShareNoteId(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
