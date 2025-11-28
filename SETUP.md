# Quick Setup Guide

## Step 1: Install Dependencies

Run from the root directory:
```bash
npm run install:all
```

Or manually:
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

## Step 2: Configure OpenAI API

1. Get your OpenAI API key from https://platform.openai.com/api-keys
2. Create `backend/.env` file:
```bash
cd backend
cp .env.example .env
```
3. Edit `.env` and add your key:
```
OPENAI_API_KEY=sk-your-actual-api-key-here
PORT=3001
NODE_ENV=development
```

## Step 3: Start the Application

From the root directory:
```bash
npm run dev
```

This starts both frontend (port 3000) and backend (port 3001).

## Step 4: Access the Application

Open your browser to:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/health

## Troubleshooting

### Port Already in Use
If port 3000 or 3001 is taken, you can:
- Kill the process using the port
- Change ports in `frontend/vite.config.js` and `backend/server.js`

### OpenAI API Errors
- Make sure your API key is valid
- Check you have credits in your OpenAI account
- Verify the key is in `backend/.env` (not `.env.example`)

### Microphone Access
- The interview coach needs microphone permissions
- Make sure your browser allows microphone access
- Chrome/Edge work best for Web Speech API

### CORS Issues
- Make sure backend is running on port 3001
- Check that frontend proxy is configured in `vite.config.js`

## Testing Without OpenAI

For testing UI without API calls, you can:
1. Comment out API calls in components
2. Use mock data (see `Results.jsx` for example)
3. The quiz modules work without API (they're in backend/server.js)

## Production Build

```bash
cd frontend
npm run build
```

The `dist/` folder contains the production build.

## Next Steps

1. Test the interview coach with a real interview
2. Complete workplace readiness modules
3. Check the dashboard for progress tracking
4. Share your certificate!

Good luck with the hackathon! 🚀
