const Notification = require('../models/Notification');
const { Note } = require('../models/Note');

/**
 * Socket.IO Event Handlers
 * Manages real-time collaboration and notifications
 */
class SocketHandlers {
  /**
   * Initialize socket connection handlers
   */
  static initializeHandlers(io) {
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      /**
       * User joins a note for real-time editing
       */
      socket.on('join-note', async (data) => {
        const { noteId, userId } = data;
        const room = `note-${noteId}`;

        socket.join(room);
        console.log(`User ${userId} joined note ${noteId}`);

        // Notify others
        socket.to(room).emit('user-joined', {
          userId,
          timestamp: new Date(),
        });
      });

      /**
       * Handle real-time content updates
       */
      socket.on('note-update', async (data) => {
        const { noteId, userId, content, title } = data;
        const room = `note-${noteId}`;

        // Broadcast to all other users in the note
        socket.to(room).emit('note-updated', {
          userId,
          content,
          title,
          timestamp: new Date(),
        });

        console.log(`Note ${noteId} updated by ${userId}`);
      });

      /**
       * Handle cursor position tracking for multi-user awareness
       */
      socket.on('cursor-move', (data) => {
        const { noteId, userId, position, selection } = data;
        const room = `note-${noteId}`;

        socket.to(room).emit('cursor-position', {
          userId,
          position,
          selection,
          timestamp: new Date(),
        });
      });

      /**
       * Handle comments in real-time
       */
      socket.on('comment-added', (data) => {
        const { noteId, userId, comment, commentId } = data;
        const room = `note-${noteId}`;

        socket.to(room).emit('new-comment', {
          userId,
          comment,
          commentId,
          timestamp: new Date(),
        });
      });

      /**
       * User leaves note
       */
      socket.on('leave-note', (data) => {
        const { noteId, userId } = data;
        const room = `note-${noteId}`;

        socket.leave(room);
        socket.to(room).emit('user-left', {
          userId,
          timestamp: new Date(),
        });

        console.log(`User ${userId} left note ${noteId}`);
      });

      /**
       * Send real-time notification
       */
      socket.on('send-notification', async (data) => {
        const { recipientId, notificationType, message, noteId } = data;
        const recipientRoom = `user-${recipientId}`;

        io.to(recipientRoom).emit('notification-received', {
          type: notificationType,
          message,
          noteId,
          timestamp: new Date(),
        });

        console.log(`Notification sent to ${recipientId}`);
      });

      /**
       * Join user's notification room
       */
      socket.on('join-user-room', (data) => {
        const { userId } = data;
        const userRoom = `user-${userId}`;
        socket.join(userRoom);
        console.log(`User ${userId} joined notification room`);
      });

      /**
       * Disconnect handler
       */
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });

      /**
       * Error handler
       */
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    });
  }
}

module.exports = SocketHandlers;
