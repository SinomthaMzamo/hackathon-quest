# How to Get Your OpenAI API Key

## Step 1: Create an OpenAI Account

1. Go to **https://platform.openai.com/**
2. Click **"Sign Up"** or **"Log In"**
3. Create an account (you can use Google/Microsoft to sign in)

## Step 2: Get Your API Key

1. Once logged in, go to: **https://platform.openai.com/api-keys**
2. Click **"Create new secret key"**
3. Give it a name (e.g., "VoiceCoach AI Hackathon")
4. **Copy the key immediately** - you won't be able to see it again!
   - It will look like: `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Step 3: Add Credits to Your Account

1. Go to: **https://platform.openai.com/account/billing**
2. Click **"Add payment method"** or **"Add credits"**
3. Add at least $5-10 in credits (for hackathon testing)
   - Note: OpenAI charges per API call, but for testing you won't use much

## Step 4: Add API Key to Your Project

### Option A: Create .env file manually

1. Navigate to the `backend` folder
2. Create a new file called `.env` (not `.env.example`)
3. Add this content:

```
OPENAI_API_KEY=sk-proj-your-actual-key-here
PORT=3001
NODE_ENV=development
```

4. Replace `sk-proj-your-actual-key-here` with your actual API key

### Option B: Use PowerShell (Windows)

```powershell
cd backend
@"
OPENAI_API_KEY=sk-proj-your-actual-key-here
PORT=3001
NODE_ENV=development
"@ | Out-File -FilePath .env -Encoding utf8
```

(Replace `sk-proj-your-actual-key-here` with your actual key)

## Step 5: Restart the Backend Server

After adding the API key:

1. Stop the backend server (Ctrl+C)
2. Restart it: `cd backend && npm run dev`
3. The API key will be loaded automatically

## Step 6: Test It

1. Try starting an interview again
2. It should work without timing out
3. You'll get AI-powered personalized questions!

---

## Important Notes

### Cost
- OpenAI charges per API call (very small amounts)
- For hackathon testing: ~$0.01-0.10 per interview session
- GPT-4 is more expensive than GPT-3.5
- You can monitor usage at: https://platform.openai.com/usage

### Free Alternative (If You Don't Want to Pay)
- The app works in **demo mode** without an API key
- Demo mode still uses your CV/JD for personalized questions
- Just won't have advanced AI analysis

### Security
- **NEVER commit your .env file to GitHub!**
- The `.env` file is already in `.gitignore`
- Your API key is private - don't share it

---

## Troubleshooting

### "Invalid API Key"
- Make sure you copied the entire key (starts with `sk-`)
- Check for extra spaces
- Make sure the `.env` file is in the `backend` folder

### "Insufficient Credits"
- Add credits at: https://platform.openai.com/account/billing
- Check your usage: https://platform.openai.com/usage

### "Rate Limit Exceeded"
- You're making too many requests too quickly
- Wait a few minutes and try again
- Consider using GPT-3.5 instead of GPT-4 (cheaper, faster)

---

## For Hackathon Demo

**If you don't want to set up an API key:**
- The app works perfectly in demo mode
- Questions are still personalized based on CV/JD
- You can demonstrate all features
- Just mention in your pitch that "AI features require API key configuration"

**If you do set up an API key:**
- You'll get advanced AI analysis
- More personalized questions
- Better feedback and recommendations
- Shows full technical capability

Either way, your hackathon submission will be impressive! 🚀
