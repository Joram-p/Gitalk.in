# Gitalk Advanced Website Starter

Includes a responsive homepage, service directory with search and category filters, Kids Learning page, Books & Printables catalogue page, privacy notice template, animated globe, and front-end login/register demo.

## Files
- `index.html` — homepage and services directory
- `kids.html` — learning activity page
- `books.html` — digital books/printables catalogue starter
- `privacy.html` — privacy notice template to customise
- `styles.css` — responsive styling and animations
- `app.js` — filters, mobile navigation, learning prompts, and demo auth modal

## Test locally
Extract the ZIP and open `index.html` in a browser. For a more reliable local preview, use VS Code with a Live Server extension.

## Publish on GitHub Pages
1. Open your website repository on GitHub.
2. Upload all files from this folder to the repository root (or replace old starter files after backing them up).
3. Open **Settings → Pages**.
4. Choose **Deploy from a branch**, select your main branch and `/ (root)`, then save.
5. Wait for deployment. If using a custom domain, configure the domain and DNS records in GitHub Pages settings.

## Important — production features
This package is a **front-end starter**, not a complete backend application:
- Login/register form is a visual demo. It does not create accounts, store passwords, send email verification, or reset passwords.
- To enable real authentication, connect a trusted service such as Supabase Auth or Firebase Authentication. Configure email verification, password reset, rate limiting, secure access policies and environment settings.
- No admin dashboard/database is connected yet. An admin panel needs a protected backend and authorization checks; do not put secret keys in public JavaScript.
- Books are currently catalogue placeholders. Add your own book files, rights/licences, prices and secure checkout/delivery before selling.
- Affiliate income requires programme approval and correct disclosures; add tracking IDs only after acceptance.
- External links are examples. Review each destination before launch.
- The privacy page is only a template, not legal advice. Update it to describe the real data practices and add your contact information.
- Do not collect bank card details or passwords directly on a static website.

## Customise
Edit service cards in `index.html`, book/activity cards in `books.html` and `kids.html`, and colours in the `:root` section of `styles.css`.
