# Quick Start Guide

## Prerequisites

- **Node.js** v14+ ([Download](https://nodejs.org/))
- **MongoDB** ([Install locally](https://docs.mongodb.com/manual/installation/) or use [Atlas](https://www.mongodb.com/cloud/atlas))
- **Git** (optional, for version control)

## 5-Minute Setup

### Step 1: Backend Setup (Terminal 1)

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Update .env with your MongoDB URI
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/collaborative-notes
# JWT_SECRET=dev_secret_key_change_in_production
# NODE_ENV=development
# FRONTEND_URL=http://localhost:3000

# Start the backend
npm run dev
```

**Expected output:**
```
✓ MongoDB connected successfully
🚀 Server running on port 5000
```

### Step 2: Frontend Setup (Terminal 2)

```bash
cd frontend

# Install dependencies
npm install

# Start the frontend
npm start
```

**Expected output:**
- Browser opens to `http://localhost:3000`
- App redirects to login page

### Step 3: Create Your Account

1. Click **"Register here"** on the login page
2. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
3. Click **"Register"**

You're now logged in! 🎉

## First Steps in the App

### Create a Note
1. Click **"+ New Note"** in the sidebar
2. Add a title: "My First Note"
3. Type some content in the editor
4. Click **"Save"**

### Try Collaboration
1. Open the app in another browser window
2. Log in with a different user (create another account)
3. First user: Create a note
4. First user: Click **"Share"** button
5. First user: Enter second user's email and set permission to "Edit"
6. Second user: Should see it in "Shared with Me"
7. Both can edit simultaneously and see live updates!

### Create a Tag
1. Go to Dashboard
2. In sidebar, scroll down and look for tag creation
3. Create a tag: Name="Work", Color="#FF5733"
4. Add it to your note using the note editor

### Create a Group
1. Click **"Groups"** in the sidebar
2. Click **"+ New Group"**
3. Name: "Team A", Description: "My team"
4. Click **"Create Group"**
5. Click **"Manage"** to add members
6. Add your other test user to the group
7. Share a note with the group

### Try Admin Panel (Optional)
1. Manually make your user an admin by updating database:
   ```javascript
   // In MongoDB
   db.users.updateOne(
     { email: "test@example.com" },
     { $set: { role: "ADMIN" } }
   )
   ```
2. Log out and back in
3. Click **"Admin Panel"** in sidebar
4. View analytics and manage users

## Testing Real-Time Features

### Live Editing Test
1. Open same note in 2 browser windows (different users)
2. User 1: Type in the editor
3. User 2: Should see changes in real-time ✓

### Notifications Test
1. User 1: Share a note with User 2
2. User 2: Check the bell icon 🔔
3. Should see "Note shared" notification ✓
4. Click notification to mark as read

## Troubleshooting

### Backend Won't Start
- **Error**: "MongoDB connection failed"
  - **Solution**: Make sure MongoDB is running
  - Local: Run `mongod` in another terminal
  - Atlas: Check connection string in .env

- **Error**: "Port 5000 already in use"
  - **Solution**: Change PORT in .env or kill process using port 5000

### Frontend Won't Load
- **Error**: "Cannot find module"
  - **Solution**: Run `npm install` in frontend folder
  
- **Error**: "API calls failing"
  - **Solution**: Make sure backend is running on port 5000

### Socket.IO Not Working
- **Issue**: Real-time updates not showing
  - **Solution**: Check browser console for connection errors
  - Verify backend and frontend URLs are correct
  - Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

## Project Structure at a Glance

```
Backend (Node.js + Express)
├── Models: Users, Notes, Tags, Groups, Notifications
├── Services: Business logic layer
├── Controllers: HTTP request handlers
├── Routes: API endpoints
└── Socket Handlers: Real-time events

Frontend (React)
├── Pages: Login, Register, Dashboard, Editor, Groups, Admin
├── Components: Reusable UI components
├── Services: API calls
├── Context: Global state management
└── Styles: CSS for each feature
```

## Common Tasks

### Add New Feature to Notes

1. **Backend**: Add field to Note model
2. **Backend**: Update NoteService and NoteController
3. **Backend**: Update note routes if needed
4. **Frontend**: Update apiServices with new API call
5. **Frontend**: Update NoteEditor component
6. **Test**: Create note with new feature

### Create Admin Account Manually

```javascript
// In MongoDB shell or Atlas UI
db.users.updateOne(
  { email: "admin@example.com" },
  { 
    $set: { 
      role: "ADMIN",
      isActive: true
    } 
  },
  { upsert: true }
)
```

### Reset All Data (Development Only)

```bash
# Backend terminal
# Stop the server (Ctrl+C)

# In MongoDB shell
mongo
> db.dropDatabase()

# Restart backend
npm run dev
```

## Next Steps

- Read [README.md](./README.md) for full documentation
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup
- Explore API endpoints in backend routes
- Customize styling in frontend/src/styles/
- Add more features!

## Getting Help

1. **Check the error**: Read browser console (F12) and server logs
2. **Read documentation**: See README.md and code comments
3. **Check logs**: 
   - Frontend: Browser DevTools (F12)
   - Backend: Terminal where `npm run dev` is running
   - Database: MongoDB Compass or Atlas UI

## Performance Tips

- Close unused browser tabs (saves memory)
- Use Firefox DevTools for better React profiling
- Monitor MongoDB with Compass
- Use PM2 for production process management
- Enable compression on backend

## Security Reminders

- Change JWT_SECRET in production ✓
- Use HTTPS in production ✓
- Validate all user inputs ✓
- Keep dependencies updated ✓
- Don't commit .env files ✓
- Use strong passwords ✓

## API Testing Tools

Try these tools to test API endpoints:

- **Postman**: Full-featured API testing
- **Insomnia**: Simple and fast
- **Thunder Client**: VS Code extension
- **cURL**: Command-line tool

Example request:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Performance Monitoring

### Monitor Backend
```bash
npm install -g pm2
pm2 start src/index.js
pm2 monit
```

### Monitor Frontend Build Size
```bash
npm run build
# Check the build/ folder size
```

### Database Indexes
```javascript
// Automatically created on app start, but verify:
db.notes.getIndexes()
db.tags.getIndexes()
```

---

**Happy coding! 🚀**

For issues, check logs first, then refer to main README.md
