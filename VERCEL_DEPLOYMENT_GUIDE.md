# Vercel Frontend Deployment Guide

## Setup Complete ✅

Your frontend is ready for Vercel deployment. The following has been configured:

### Files Created/Updated:

1. **`vercel.json`** - Vercel deployment configuration
   - Build command: `npm run build`
   - Output directory: `dist/`
   - Configured for SPA (Single Page Application) routing

2. **`.env.example`** - Environment variables template
   - `VITE_API_URL` - Your backend API URL

3. **`src/utils/api.js`** - Centralized API client
   - Handles all API requests
   - Supports environment-based API URL configuration
   - Consistent error handling across all endpoints

4. **Updated Files**:
   - `src/app/state/ProductContext.jsx` - Uses centralized API client
   - `src/app/pages/AdminDashboard.jsx` - Uses centralized API client
   - `src/app/pages/CheckoutPage.jsx` - Uses centralized API client
   - `src/app/ui/Payment.jsx` - Uses centralized API client

---

## Deployment Steps

### Step 1: Prepare Your Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Frontend ready for Vercel deployment"
```

### Step 2: Push to GitHub

```bash
# Create a new repository on GitHub (if you haven't already)
# Then push your code:
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

### Step 3: Connect to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up / Log in with your GitHub account
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect it's a Vite project

### Step 4: Set Environment Variables

In Vercel Project Settings → Environment Variables, add:

```
VITE_API_URL=https://your-backend-api.com
```

**Options for `VITE_API_URL`:**

- If backend is also on Vercel: `https://your-backend.vercel.app`
- If backend is on a custom domain: `https://api.yourdomain.com`
- For local development: `http://localhost:5000`

### Step 5: Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your frontend will be live at `https://your-project.vercel.app`

---

## Build & Test Locally

### Build for Production:

```bash
npm run build
```

This creates an optimized `dist/` folder ready for deployment.

### Preview the Build:

```bash
npm run preview
```

Opens the production build locally at `http://localhost:4173`

---

## Environment Variables

### Development (Local):

The Vite proxy in `vite.config.js` redirects `/api` requests to `http://localhost:5000` when running `npm run dev`.

### Production (Vercel):

The `VITE_API_URL` environment variable overrides the default `/api` path. Set it to your production backend URL.

---

## API Configuration

All API calls now use the centralized `src/utils/api.js` module which automatically uses:

1. The `VITE_API_URL` environment variable if set
2. Relative `/api` path as fallback

**Example API calls:**

```javascript
import { apiFetch, apiPost, apiPut, apiDelete } from "@/utils/api.js";

// GET request
const products = await apiFetch("/api/products");

// POST request
const newProduct = await apiPost("/api/products", { title: "...", price: 100 });

// PUT request
const updated = await apiPut("/api/products/123", { price: 120 });

// DELETE request
await apiDelete("/api/products/123");
```

---

## Troubleshooting

### Build Fails on Vercel

- Check that `package.json` has all required dependencies
- Ensure `.env.example` is committed (for reference)
- Check the Vercel build logs for specific errors

### API Calls Return 404

- Verify `VITE_API_URL` environment variable is set correctly
- Ensure your backend is running and accessible
- Check browser console for CORS errors

### Products Not Loading

- Verify backend API is responding: `curl https://your-backend.vercel.app/api/products`
- Check `VITE_API_URL` in Vercel Project Settings
- Clear browser cache and try again

---

## Production Checklist

- ✅ `npm run build` completes successfully
- ✅ No console errors when running `npm run preview`
- ✅ Backend API URL is set in Vercel environment variables
- ✅ Backend is deployed and responding
- ✅ Products load when visiting the site
- ✅ Admin dashboard works (if needed)
- ✅ Cart and checkout flow tested

---

## Next Steps

1. Deploy your backend to Vercel, AWS, or your preferred platform
2. Set the `VITE_API_URL` to your backend URL
3. Test all features in production
4. Monitor Vercel Analytics for performance

Enjoy your luxury fashion store! 🎉
