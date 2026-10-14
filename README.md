# Gitalk Website Starter

A responsive, static website starter for Gitalk.in. It includes a light theme, animated globe illustration, service directory, search/filter, Kids Learning page, and a front-end-only login/register dialog.

## Files
- `index.html` — homepage and service directory
- `kids.html` — kids learning activity page
- `styles.css` — responsive design and animations
- `app.js` — search, filters, mobile navigation, demo modal and learning activities

## Run locally
1. Extract the ZIP.
2. Open `index.html` in a browser.
3. For local development, you can use VS Code with the Live Server extension.

## Publish with GitHub Pages
1. Upload all four files to the root of your GitHub repository.
2. In GitHub, open **Settings → Pages**.
3. Choose **Deploy from a branch**, select your main branch and `/ (root)`, then save.
4. Wait for the deployment and open the Pages URL. If using a custom domain, configure DNS and the custom domain in GitHub Pages.

## Important notes before production
- The login/register dialog is a visual demo only. It does **not** create accounts, send verification emails, or save passwords.
- Never store passwords in browser JavaScript or local storage.
- For real authentication, connect Supabase Auth, Firebase Authentication, or another trusted authentication provider. Set up email verification, password reset, database access rules, and spam protection.
- If adding payments, use a trusted payment provider and never collect card details directly in this static site.
- External service links currently point to example official platforms. Review every destination before publishing and add your own affiliate parameters only after approval.
- This starter does not include an admin panel or backend database yet. These need a secure backend and authorization rules.
- Check all external links, accessibility, privacy policy, terms, and contact details before making the site public.

## Customisation
- Edit the service cards in `index.html`.
- Change colours and layout in `styles.css` (`:root` variables are near the top).
- Add learning activities in `app.js`.
