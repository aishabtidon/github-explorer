# GitHub Explorer (React + Express)

Full-stack app that **proxies the GitHub API through Express** and provides:
- **User search**
- **User details** (avatar, bio, a subset of repos)
- **Repo details** (description, created date, last commit date, last 5 commits)

> No direct calls from the front end to GitHub. All requests go through the backend.

## Quick start

```bash
# in project root
npm install
npm run dev
Server: http://localhost:3001
Client: http://localhost:5173

# Run tests
npm test

Uses Helmet on the backend, loading indicators, and distinct styles for external links.

---

## 2) Server (Express)

### `server/package.json`
```json
{
  "name": "github-explorer-server",
  "version": "1.0.0",
  "description": "API for GitHub Explorer",
  "main": "src/index.js",
  "type": "commonjs",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest --runInBand"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.19.2",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "node-fetch": "^2.7.0"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "nodemon": "^3.1.4",
    "supertest": "^7.0.0"
  }
}