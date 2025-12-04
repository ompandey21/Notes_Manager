# Environment Configuration Guide

## Backend Configuration

### Development Environment (.env)

```
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/collaborative-notes

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# CORS
FRONTEND_URL=http://localhost:3000

# Admin defaults (optional)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=AdminPassword123
```

### Production Environment (.env)

```
# Server
PORT=5000
NODE_ENV=production

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/collaborative-notes?retryWrites=true&w=majority

# JWT (Generate a strong secret)
JWT_SECRET=generate_a_long_random_string_here_at_least_32_characters

# CORS (Your production domain)
FRONTEND_URL=https://your-domain.com

# Optional: Sentry for error tracking
SENTRY_DSN=your_sentry_dsn_here
```

## Frontend Configuration

### Environment Variables (.env)

```
REACT_APP_API_URL=http://localhost:5000/api
```

### Production

```
REACT_APP_API_URL=https://api.your-domain.com/api
```

## Database Setup

### MongoDB Local Setup

1. Install MongoDB Community Edition
2. Start MongoDB:
   ```bash
   mongod
   ```
3. Connect with MongoDB Compass or mongosh

### MongoDB Atlas Setup

1. Create account at mongodb.com
2. Create a cluster
3. Add database user
4. Get connection string
5. Update MONGODB_URI in .env

### Database Initialization

MongoDB will auto-create collections and indexes on first use. To create indexes manually:

```javascript
// Run in MongoDB shell
db.notes.createIndex({ owner: 1, createdAt: -1 })
db.notes.createIndex({ owner: 1, isDeleted: 1 })
db.notes.createIndex({ title: "text", content: "text" })
db.tags.createIndex({ name: 1, owner: 1 }, { unique: true })
```

## Deployment Guides

### Heroku Backend Deployment

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku app**
   ```bash
   cd backend
   heroku create your-app-name
   ```

3. **Set environment variables**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set FRONTEND_URL=https://your-frontend-domain.com
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **View logs**
   ```bash
   heroku logs --tail
   ```

### Vercel Frontend Deployment

1. **Build the app**
   ```bash
   cd frontend
   npm run build
   ```

2. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set environment variables in Vercel dashboard**
   - `REACT_APP_API_URL` = Your backend API URL

### Docker Deployment

**Dockerfile for Backend:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src ./src

EXPOSE 5000

CMD ["node", "src/index.js"]
```

**Docker Compose (local development):**

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: collaborative-notes
    volumes:
      - mongo_data:/data/db

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://mongodb:27017/collaborative-notes
      JWT_SECRET: dev_secret_key
      NODE_ENV: development
      FRONTEND_URL: http://localhost:3000
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://localhost:5000/api
    depends_on:
      - backend

volumes:
  mongo_data:
```

**Build and run with Docker Compose:**

```bash
docker-compose up -d
```

## SSL/TLS Certificate Setup

### Using Let's Encrypt (Certbot)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d your-domain.com
```

### Update Nginx Configuration

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
    }
}
```

## Load Balancing with Nginx

```nginx
upstream backend {
    server backend1:5000;
    server backend2:5000;
    server backend3:5000;
}

server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

## Database Backup Strategy

### MongoDB Backup

```bash
# Local backup
mongodump --uri "mongodb://localhost:27017/collaborative-notes" --out ./backup

# Local restore
mongorestore --uri "mongodb://localhost:27017/collaborative-notes" ./backup/collaborative-notes

# Atlas backup (automatic - enabled by default)
# Configure backup retention in Atlas UI
```

### Automated Backup Script

```bash
#!/bin/bash
# backup.sh

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR

mongodump --uri "mongodb://localhost:27017/collaborative-notes" \
          --out "$BACKUP_DIR/backup_$TIMESTAMP"

# Keep only last 7 days
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;
```

## Monitoring & Logging

### PM2 Process Manager

```bash
npm install -g pm2

# Start with PM2
pm2 start src/index.js --name "collaborative-notes"

# Monitoring
pm2 monit

# Logs
pm2 logs

# Auto-restart on reboot
pm2 startup
pm2 save
```

### Winston Logger (Optional)

Add to backend for better logging:

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;
```

## Performance Optimization

### Enable Compression

```javascript
const compression = require('compression');
app.use(compression());
```

### Redis Caching

```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache frequently accessed data
client.setex('notes:' + userId, 3600, JSON.stringify(notes));
```

### Database Query Optimization

- Use projection to select only needed fields
- Create indexes on frequently queried fields
- Use aggregation pipeline for complex queries

## Security Hardening

### Additional Security Middleware

```javascript
// Rate limiting for different endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts
});

app.post('/api/auth/login', authLimiter, AuthController.login);

// Content Security Policy
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
  },
}));
```

## Continuous Integration/Deployment

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        env:
          HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
        run: |
          git remote add heroku https://git.heroku.com/your-app.git
          git push heroku main
```

## Maintenance Checklist

- [ ] Monitor disk space and memory usage
- [ ] Review and rotate security logs
- [ ] Update dependencies monthly
- [ ] Test backup restoration procedures
- [ ] Monitor database performance
- [ ] Review error logs for patterns
- [ ] Update SSL certificates before expiry
- [ ] Performance testing after updates
- [ ] Security audits quarterly
- [ ] User support and feedback review
