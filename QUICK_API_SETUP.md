# Quick API Key Setup Guide

## ✅ Current Status
**No API key is configured in your project.**

The app is working in **demo mode** (which is fine for the hackathon!), but if you want AI-powered features, follow these steps:

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Get OpenAI API Key

1. Go to: **https://platform.openai.com/api-keys**
2. Sign up/Log in (free account)
3. Click **"Create new secret key"**
4. Copy the key (starts with `sk-`)

### Step 2: Add Credits (Required)

1. Go to: **https://platform.openai.com/account/billing**
2. Add payment method
3. Add $5-10 in credits (for testing)

### Step 3: Create .env File

**In PowerShell (from WINNERS folder):**

```powershell
cd backend
@"
OPENAI_API_KEY=sk-your-actual-key-here
PORT=3001
NODE_ENV=development
"@ | Out-File -FilePath .env -Encoding utf8
```

**Or manually:**
1. Go to `backend` folder
2. Create new file named `.env` (not `.env.txt`)
3. Paste this:

```
OPENAI_API_KEY=sk-your-actual-key-here
PORT=3001
NODE_ENV=development
```

4. Replace `sk-your-actual-key-here` with your actual key

### Step 4: Restart Backend

```powershell
# Stop current server (Ctrl+C)
# Then restart:
cd backend
npm run dev
```

---

## 💡 For Hackathon

### Option A: Use Demo Mode (Recommended)
- ✅ Works perfectly without API key
- ✅ Still personalized with CV/JD
- ✅ All features work
- ✅ No cost
- Just mention: "AI features require API key for full functionality"

### Option B: Add API Key
- ✅ Full AI-powered analysis
- ✅ More advanced personalization
- ✅ Better feedback
- ⚠️ Requires $5-10 credits
- ⚠️ Takes 5-10 minutes to set up

---

## 🔍 Check if API Key is Working

After setting up, when you start an interview:
- ✅ No timeout = API key working
- ❌ Timeout = API key not configured (uses demo mode)

---

## 📝 Current Status

**Your project:** No API key configured  
**Current mode:** Demo mode (works great!)  
**Action needed:** None required - demo mode is fine for hackathon

If you want AI features, follow the steps above!
