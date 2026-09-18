# Gitalk Free Real Authentication Setup

1. Create a Supabase Free project.
2. Open Project Settings -> API and copy Project URL + Publishable key into `supabase-config.js`.
3. Authentication -> Providers -> Email: enable Email signups and Email Confirmations.
4. Add your GitHub Pages URL to the Supabase allowed site/redirect URLs.
5. Upload these files to GitHub Pages.

Included: real email/password login, email verification, logout, password reset, profile session.

Never expose a `service_role`/secret key in frontend code.

Supabase currently lists a $0 Free plan with 50,000 monthly active users; quotas and inactivity rules apply.
