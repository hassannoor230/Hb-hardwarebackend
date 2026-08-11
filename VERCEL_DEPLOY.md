# HB Hardware Backend - Vercel Deployment Guide

## Prerequisites
- Vercel account
- MongoDB Atlas cluster
- Git repository (optional but recommended)

## Step 1: Prepare Your Repository

Make sure these files exist in your `server/` folder:
- `vercel.json` - Vercel configuration
- `api/index.js` - Serverless function entry point
- `server.js` - Local server entry point
- `app.js` - Express app configuration

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI
```bash
cd server
vercel login
vercel
```

### Option B: Using Vercel Dashboard
1. Go to https://vercel.com
2. Click "New Project"
3. Import your repository
4. Set **Root Directory** to `server`
5. Click "Deploy"

## Step 3: Set Environment Variables in Vercel

Go to your project settings → Environment Variables and add:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A secure random string |
| `AI_API_KEY` | Your OpenAI API key (optional) |
| `AI_PROVIDER` | `openai` |
| `AI_MODEL` | `gpt-4o-mini` |
| `GOOGLE_MAPS_API_KEY` | Your Google Places API key (optional) |
| `ADMIN_PASSWORD` | Your admin password |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | Your frontend URL (e.g., `https://your-frontend.vercel.app`) |

## Step 4: MongoDB Atlas Configuration

### Important: Whitelist Vercel IPs

1. Go to MongoDB Atlas → Network Access
2. Add IP Address: `0.0.0.0/0` (allows access from anywhere - **only for testing**)
3. For production, whitelist Vercel's IP ranges:
   - https://vercel.com/ips

### Or use Vercel Environment Variables
You can also add your MongoDB username and password as separate environment variables:
- `MONGODB_USER`
- `MONGODB_PASSWORD`

## Step 5: Update Frontend API URL

After deploying your backend to Vercel, update your frontend to point to the Vercel backend URL.

In your frontend `.env` or API configuration:
```
VITE_API_URL=https://your-backend.vercel.app
```

## Step 6: Test Your Deployment

1. Visit your Vercel backend URL: `https://your-backend.vercel.app/`
   - Should return: `{"success":true,"message":"HB Hardware Backend API",...}`

2. Test health endpoint: `https://your-backend.vercel.app/health`
   - Should return: `{"success":true,"status":"OK",...}`

3. Test products endpoint: `https://your-backend.vercel.app/api/v1/products`
   - Should return your products list

## Troubleshooting

### 500 Error on /favicon.ico
This is fixed in the current code. The server now returns 204 No Content for favicon requests.

### 500 Error on API routes
Check Vercel function logs:
1. Go to Vercel Dashboard → Your Project → Functions
2. Click on the failing function
3. Check logs for errors

Common issues:
- MongoDB connection failed → Check IP whitelist and credentials
- Environment variables not set → Check Vercel env vars
- Cold start timeout → MongoDB connection takes too long

### MongoDB Connection Issues in Serverless

Vercel serverless functions have a 10-second cold start limit. If MongoDB connection is slow:

1. Use a MongoDB connection string with `retryWrites=true&w=majority`
2. Consider using MongoDB Atlas serverless instance
3. Add connection pooling

### CORS Errors

Make sure `CLIENT_URL` environment variable is set to your frontend URL in Vercel.

## Local Development

For local development, use:
```bash
cd server
npm run dev
```

This will start the server on `http://localhost:5000`

## Vercel Configuration Details

The `vercel.json` file configures:
- All `/api/*` requests → `api/index.js` serverless function
- All other requests → `api/index.js` serverless function
- Sets `NODE_ENV=production`

## Notes

- First request to Vercel may be slow (cold start)
- MongoDB connection happens on each cold start
- Serverless functions have a 10-second execution limit
- For heavy operations, consider using a background job queue
