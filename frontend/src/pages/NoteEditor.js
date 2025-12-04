import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { noteService } from '../services/apiServices';
import { useApp } from '../utils/helpers';
import { getErrorMessage } from '../utils/helpers';
import 'react-quill/dist/quill.snow.css';
import '../styles/editor.css';

/**
 * Rich Text Editor Component
 * Allows creating and editing notes with real-time collaboration
 */
const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { socket, user } = useApp();
  
  const [note, setNote] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);

  /**
   * Load note if editing
   */
  useEffect(() => {
    if (id) {
      loadNote();
    }
  }, [id]);

  /**
   * Setup real-time collaboration
   */
  useEffect(() => {
    if (!socket || !id) return;

    socket.emit('join-note', { noteId: id, userId: user.id });

    socket.on('note-updated', (data) => {
      setNote((prev) => ({
        ...prev,
        content: data.content,
        title: data.title,
      }));
    });

    socket.on('user-joined', (data) => {
      setActiveUsers((prev) => [...prev, data.userId]);
    });

    socket.on('user-left', (data) => {
      setActiveUsers((prev) => prev.filter((uid) => uid !== data.userId));
    });

    return () => {
      socket.emit('leave-note', { noteId: id, userId: user.id });
      socket.off('note-updated');
      socket.off('user-joined');
      socket.off('user-left');
    };
  }, [socket, id, user.id]);

  /**
   * Load note
   */
  const loadNote = async () => {
    try {
      const data = await noteService.getNoteById(id);
      setNote(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle save
   */
  const handleSave = async () => {
    if (!note.title.trim()) {
      setError('Title is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      let savedNote;
      if (id) {
        savedNote = await noteService.updateNote(
          id,
          note.title,
          note.content
        );
      } else {
        savedNote = await noteService.createNote(note.title, note.content);
      }

      setNote(savedNote);
      navigate(`/notes/${savedNote._id}`);

      // Broadcast update via socket
      if (socket) {
        socket.emit('note-update', {
          noteId: savedNote._id,
          userId: user.id,
          title: note.title,
          content: note.content,
        });
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle title change
   */
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setNote((prev) => ({ ...prev, title: newTitle }));

    if (socket && id) {
      socket.emit('note-update', {
        noteId: id,
        userId: user.id,
        title: newTitle,
        content: note.content,
      });
    }
  };

  /**
   * Handle content change
   */
  const handleContentChange = (value) => {
    setNote((prev) => ({ ...prev, content: value }));

    if (socket && id) {
      socket.emit('note-update', {
        noteId: id,
        userId: user.id,
        title: note.title,
        content: value,
      });
    }
  };

  if (loading) {
    return <div className="loading">Loading note...</div>;
  }

  return (
    <div className="editor-container">
      {error && <div className="error-message">{error}</div>}

      <div className="editor-header">
        <input
          type="text"
          className="editor-title"
          value={note.title}
          onChange={handleTitleChange}
          placeholder="Note Title"
        />

        <div className="editor-actions">
          {activeUsers.length > 0 && (
            <span className="active-users">
              {activeUsers.length} editing
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            Back
          </button>
        </div>
      </div>

      <div className="editor-content">
        <ReactQuill
          value={note.content}
          onChange={handleContentChange}
          theme="snow"
          placeholder="Start typing your note..."
          modules={{
            toolbar: [
              ['bold', 'italic', 'underline'],
              ['blockquote', 'code-block'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image'],
              ['clean'],
            ],
          }}
        />
      </div>
    </div>
  );
};

export default NoteEditor;
