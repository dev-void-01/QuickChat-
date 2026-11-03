# Quick Chat

A real-time chat app built with **MongoDB, Express, React (Vite) and Socket.io**.

## Features
- Sign up (two steps: details, then bio) and log in with JWT
- One-to-one real-time messaging
- Send images in chat; shared photos appear in the right-hand panel
- Online / offline status
- Unseen message counters on the user list
- Search users
- Edit profile (name, bio, photo)
- Responsive layout (mobile shows one panel at a time)

## Requirements
- Node.js 18+
- MongoDB, either installed locally or a free MongoDB Atlas cluster

## Run locally

Requirements: Node.js 18+ and a running MongoDB instance or MongoDB Atlas cluster.

1. Install dependencies:
   ```bash
   npm run install:all
   ```
2. Create local environment files from the examples (PowerShell):
   ```powershell
   Copy-Item server/.env.example server/.env
   Copy-Item client/.env.example client/.env
   ```
3. Set `MONGODB_URI` in `server/.env` to your MongoDB connection string. Generate a
   unique JWT secret with:
   ```bash
   node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
   ```
   Put the result in `JWT_SECRET`. The server refuses to start without a strong secret.
   Never commit `.env` files or share their contents. The `.env.example` files contain
   placeholders and are safe to commit.
4. Start the server and client:
   ```bash
   npm run dev
   ```
5. Open the client URL printed by Vite (usually http://localhost:5173). If the backend's
   configured port is already in use, the dev launcher automatically selects another
   available port and connects the client to it.

To see real-time chat, sign up a second account in a different browser or an incognito window.

## Deploy the client to Vercel

The client can be deployed to Vercel as a Vite static site:

1. Import the GitHub repository and set the Vercel **Root Directory** to `client`.
2. Set the build command to `npm run build` and the output directory to `dist`.
3. Add `VITE_BACKEND_URL` as a Vercel environment variable, pointing to your deployed API
   (for example, `https://your-api.example.com`). Set it for each environment you deploy.

The Express API uses Socket.IO and needs a persistent Node.js host; Vercel's serverless
functions do not support this app's long-lived Socket.IO server. Deploy `server` to a
Node.js host that supports WebSockets, and set its `MONGODB_URI` and a unique,
high-entropy `JWT_SECRET` there. Never put server secrets in Vercel's client environment
variables or commit them to GitHub. Configure MongoDB Atlas network access for the API
host, and update `VITE_BACKEND_URL` to that API's public HTTPS URL.

## Images
By default, chat and profile images are stored in MongoDB as base64, so nothing else is needed.
To use Cloudinary instead, fill in `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and
`CLOUDINARY_API_SECRET` in `server/.env`. No code changes required.

## Structure
```
quickchat/
├─ server/   Express API + Socket.io (port 5000 by default)
│  ├─ controllers/  models/  routes/  middleware/  lib/
│  └─ server.js
└─ client/   React + Vite + Tailwind (port 5173 by default; Vite selects another if busy)
   └─ src/  pages/  components/  context/
```

## API
| Method | Route | Purpose |
|---|---|---|
| POST | /api/auth/signup | Create account |
| POST | /api/auth/login | Log in |
| GET | /api/auth/check | Validate token |
| PUT | /api/auth/update-profile | Update name, bio, photo |
| GET | /api/messages/users | Users + unseen counts |
| GET | /api/messages/:id | Conversation with a user |
| POST | /api/messages/send/:id | Send text or image |
| PUT | /api/messages/mark/:id | Mark a message as seen |

## Troubleshooting
- **"MongoDB connection failed"**: start MongoDB, or put an Atlas connection string in `server/.env`.
- **"Can't reach the server"** in the browser: the backend isn't running; check the terminal for errors.
- **Port in use**: change `PORT` in `server/.env` and `VITE_BACKEND_URL` in `client/.env`.
