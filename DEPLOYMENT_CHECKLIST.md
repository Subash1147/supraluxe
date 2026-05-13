# Vercel Deployment Checklist

## Pre-Deployment ✓

- [ ] All files saved and committed to git
- [ ] `npm install` completed (all dependencies installed)
- [ ] `npm run build` runs without errors
- [ ] `npm run preview` shows your site correctly

## GitHub Setup ✓

- [ ] Repository created on GitHub
- [ ] Code pushed to main branch
- [ ] `.env` files are in `.gitignore` (they won't be pushed)
- [ ] `.env.example` is committed (for reference)

## Vercel Setup ✓

- [ ] Vercel account created (https://vercel.com)
- [ ] GitHub account connected to Vercel
- [ ] New project created from your repository
- [ ] Vercel auto-detected it's a Vite project

## Environment Variables ✓

- [ ] In Vercel Project Settings → Environment Variables:
  - [ ] `VITE_API_URL` set to your backend URL
  - [ ] Example: `https://your-backend.vercel.app`

## Deploy ✓

- [ ] Click "Deploy" in Vercel
- [ ] Build completes successfully
- [ ] Site is live at `https://your-project.vercel.app`

## Post-Deployment Testing ✓

- [ ] Home page loads
- [ ] Products display correctly
- [ ] Product details page works
- [ ] Cart functionality works
- [ ] Checkout form displays
- [ ] Admin dashboard loads (if applicable)
- [ ] No console errors in DevTools

## Troubleshooting Checklist

If something doesn't work:

- [ ] Check Vercel build logs for errors
- [ ] Verify `VITE_API_URL` environment variable is set correctly
- [ ] Confirm backend API is running and accessible
- [ ] Check browser console for CORS or API errors
- [ ] Try clearing browser cache and reloading
- [ ] Verify backend returns data: `curl https://your-backend/api/products`

## Performance & Security

- [ ] Site loads in under 3 seconds
- [ ] No sensitive data in environment variables
- [ ] HTTPS is enabled (Vercel default)
- [ ] Images load correctly
- [ ] Mobile responsive design works

## Next Phase

- [ ] Set up custom domain (optional)
- [ ] Configure analytics
- [ ] Set up error monitoring
- [ ] Deploy backend API
- [ ] Test end-to-end payment flow

---

**Status:** Ready for Deployment! 🚀

For detailed instructions, see: `VERCEL_DEPLOYMENT_GUIDE.md`
