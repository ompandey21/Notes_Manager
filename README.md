# 📝 Notes Management System

A lightweight full-stack notes platform supporting note creation, tagging, categorization, searching, sharing with users/groups, comments, and version history.

---

## 🚀 1. Workflow Overview

### 🔹**1. User Authentication**
- Register using PLM (auto-hashed passwords)
- Login with email + password
- Session-based authentication

### 🔹**2. Notes Management**
- Create note (title, category, tags, rich text)
- Update note (auto version-history)
- Delete note
- Comment on notes
- Search by title/content/tags
- Filter by tag/category

### 🔹**3. Sharing Workflow**
- Share note with specific users
- Share note with groups
- Group members immediately see shared notes
- Each share updates user/group reference

### 🔹**4. Group Collaboration**
- Create group
- Add/remove members
- Promote/demote admin
- Share notes to group
- View group notes

### 🔹**5. Data Flow**

    User → Creates Note → Adds Tags/Category
    → Shares Note (User/Group)
    → Comments / Updates → Version History
    Group → Receives Shared Notes → Members collaborate

---

## ⚙️ 2. Setup

### Install Dependencies

npm install


### Environment Variables
MONGO_URI=mongodb://127.0.0.1:27017/notes_management_system
SESSION_SECRET=supersecretkey123
PORT=5000

### Run Server
npm run dev


---

## 📂 3. Folder Structure

    /models (User, Notes, Group)
    /routes (users.js, notes.js, groups.js)
    app.js
    .env
