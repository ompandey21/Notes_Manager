# Collaborative Notes Application

A production-quality, real-time collaborative note-taking application built with React and Express.js, featuring real-time editing, sharing, and notifications.

## Features

### Core Functionality
- **Authentication & Authorization**
  - User signup and login with JWT tokens
  - Role-based access control (USER, ADMIN)
  - Protected routes and API endpoints

- **Notes Management**
  - Create, read, update, delete notes
  - Rich text editor with formatting options
  - Version history with restore capability
  - Soft delete with recovery option

- **Tags & Organization**
  - Create and manage tags with custom colors
  - Filter notes by tags, date range, and search
  - Most used tags analytics

- **Real-Time Collaboration**
  - Live co-editing with Socket.IO
  - Multi-user cursor tracking
  - Last-writer-wins conflict resolution
  - Automatic save on content updates

- **Sharing & Permissions**
  - Share notes with specific users or groups
  - Three-tier permissions: VIEW, COMMENT, EDIT
  - Share note with entire teams/groups
  - Permission management interface

- **Groups/Teams**
  - Create and manage groups
  - Add/remove group members
  - Share notes with entire groups
  - Group-based collaboration

- **Notifications**
  - Real-time notification delivery via Socket.IO
  - Persistent notification storage in database
  - Mark as read functionality
  - Notification badge with unread count

- **Search & Filtering**
  - Full-text search in titles and content
  - Filter by tags, owner, and date range
  - Separate views for owned and shared notes

- **Admin Dashboard**
  - User management and deactivation
  - Analytics dashboard (notes, users, tags, groups)
  - Most active users tracking
  - Most used tags analytics

## Tech Stack

### Backend
- **Node.js & Express.js** - REST API server
- **MongoDB & Mongoose** - NoSQL database and ODM
- **Socket.IO** - Real-time communication
- **JWT** - Authentication tokens
- **Bcryptjs** - Password hashing
- **Helmet & CORS** - Security middleware
- **Express-validator** - Input validation

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time updates
- **React Quill** - Rich text editor
- **React Hook Form** - Form management
- **React Icons** - Icon library

## Project Structure

```
note_making/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── constants.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Note.js
│   │   │   ├── Group.js
│   │   │   └── Notification.js
│   │   ├── services/
│   │   │   ├── AuthService.js
│   │   │   ├── NoteService.js
│   │   │   ├── TagService.js
│   │   │   ├── GroupService.js
│   │   │   ├── ShareService.js
│   │   │   └── NotificationService.js
│   │   ├── controllers/
│   │   │   ├── AuthController.js
│   │   │   ├── NoteController.js
│   │   │   ├── TagController.js
│   │   │   ├── GroupController.js
│   │   │   ├── ShareController.js
│   │   │   ├── NotificationController.js
│   │   │   └── AdminController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── noteRoutes.js
│   │   │   ├── tagRoutes.js
│   │   │   ├── groupRoutes.js
│   │   │   ├── shareRoutes.js
│   │   │   ├── notificationRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── socket/
│   │   │   └── handlers.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── NoteEditor.js
    │   │   ├── GroupManagement.js
    │   │   └── AdminDashboard.js
    │   ├── components/
    │   │   ├── TagFilter.js
    │   │   ├── NotificationBell.js
    │   │   └── ShareDialog.js
    │   ├── services/
    │   │   ├── api.js
    │   │   └── apiServices.js
    │   ├── context/
    │   │   └── AppContext.js
    │   ├── utils/
    │   │   └── helpers.js
    │   ├── styles/
    │   │   ├── global.css
    │   │   ├── auth.css
    │   │   ├── dashboard.css
    │   │   ├── editor.css
    │   │   ├── notification.css
    │   │   ├── share.css
    │   │   ├── groups.css
    │   │   └── admin.css
    │   ├── App.js
    │   └── index.js
    ├── public/
    │   └── index.html
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env
   ```

4. **Update .env with your configuration:**
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/collaborative-notes
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

6. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Notes
- `POST /api/notes` - Create note
- `GET /api/notes` - Get user's notes with filters
- `GET /api/notes/:id` - Get note by ID
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/:id/tags` - Add tag to note
- `DELETE /api/notes/:id/tags` - Remove tag from note
- `GET /api/notes/:id/versions` - Get note versions
- `POST /api/notes/:id/versions/restore` - Restore version
- `POST /api/notes/:id/comments` - Add comment
- `GET /api/notes/:id/comments` - Get comments

### Tags
- `POST /api/tags` - Create tag
- `GET /api/tags` - Get user tags
- `PUT /api/tags/:id` - Update tag
- `DELETE /api/tags/:id` - Delete tag
- `GET /api/tags/most-used` - Get most used tags

### Groups
- `POST /api/groups` - Create group
- `GET /api/groups` - Get user's groups
- `GET /api/groups/:id` - Get group by ID
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group
- `POST /api/groups/:id/members` - Add member
- `DELETE /api/groups/:id/members` - Remove member

### Sharing
- `POST /api/shares/:id/share-user` - Share with user
- `POST /api/shares/:id/share-group` - Share with group
- `DELETE /api/shares/:id/unshare` - Unshare note
- `GET /api/shares/shared` - Get shared notes
- `PUT /api/shares/:id/permission` - Update permission
- `GET /api/shares/:id/shares` - Get note shares

### Notifications
- `GET /api/notifications` - Get notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Admin
- `GET /api/admin/users` - Get all users (paginated)
- `PUT /api/admin/users/:userId/deactivate` - Deactivate user
- `PUT /api/admin/users/:userId/activate` - Activate user
- `GET /api/admin/analytics` - Get analytics
- `GET /api/admin/users/:userId/activity` - Get user activity

## Socket.IO Events

### Client to Server
- `join-note` - Join note for real-time editing
- `leave-note` - Leave note
- `note-update` - Update note content
- `cursor-move` - Share cursor position
- `comment-added` - Notify new comment
- `join-user-room` - Join user notification room

### Server to Client
- `note-updated` - Note was updated
- `user-joined` - User joined note
- `user-left` - User left note
- `cursor-position` - Cursor position from another user
- `new-comment` - New comment added
- `notification-received` - New notification

## Security Features

- **Password Hashing**: Bcryptjs with 10 salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Express-validator for server-side validation
- **CORS**: Configured for frontend domain only
- **Helmet**: Security headers middleware
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **XSS Prevention**: HTML sanitization in utilities
- **Role-Based Access Control**: USER and ADMIN roles

## Performance Optimizations

- **Database Indexing**: Indexed fields for fast queries
- **Text Search**: MongoDB text index for full-text search
- **Pagination**: Limit results for large datasets
- **Lazy Loading**: Load data on demand
- **Debounced Updates**: Reduce frequency of socket emissions
- **Connection Pooling**: MongoDB connection reuse

## Testing

To test the application:

1. Create test accounts with different roles
2. Create notes with various tags
3. Share notes with other users/groups
4. Test collaborative editing with multiple clients
5. Test notifications in real-time
6. Test admin features with admin account

## Deployment

### Backend (Heroku/Railway)
1. Set environment variables in deployment platform
2. Push to Git repository
3. Platform automatically builds and deploys

### Frontend (Vercel/Netlify)
1. Build React app: `npm run build`
2. Deploy the `build` folder to hosting service
3. Update API URL environment variable

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify network access if using MongoDB Atlas

### Socket.IO Connection Issues
- Check that backend is running
- Verify FRONTEND_URL in backend .env
- Check browser console for connection errors

### CORS Errors
- Verify FRONTEND_URL matches your frontend domain
- Check that backend CORS is properly configured

## Future Enhancements

- End-to-end encryption for sensitive notes
- Rich media support (images, videos)
- Collaborative drawing/whiteboard
- Export notes to PDF/Word
- Offline sync capability
- Mobile applications
- Advanced analytics and insights
- Integration with external services
- Dark mode theme
- Accessibility improvements

## License

MIT

## Support

For issues and questions, please contact the development team.
made with ❤️ by the Collaborative Notes Application Team.
