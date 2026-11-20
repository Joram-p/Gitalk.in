# LinguaFree — Free Language Learning Website

A responsive front-end starter website for a free language learning platform.

## Included
- Responsive landing page for desktop, tablet and mobile
- 12 sample language course cards
- Search, level filter and category filter
- Sample lesson view with vocabulary and a multiple-choice quiz
- Local progress tracking using browser localStorage
- Demo sign-up/login modal (not secure production authentication)
- Mobile navigation and toast notifications
- Course data kept in `app.js` for easy editing

## Run locally
1. Extract the ZIP.
2. Open `index.html` in a modern browser, or use VS Code Live Server.
3. No build tools are required.

## Important: demo vs production
This package is a working front-end prototype. Login/profile and progress are stored only in the current browser and are not synced across devices. The sample course lessons are starter content, not complete accredited courses. A production A-to-Z platform still needs:
- Backend/API and database (e.g. Supabase)
- Secure authentication, password reset and email verification
- Admin dashboard and role-based permissions
- Full lesson content, audio/video hosting and subtitles
- Real speech recognition/pronunciation assessment (where supported)
- Certificate verification, reporting, backups and privacy/terms pages
- Payment is not required for the free-course model, but optional donations can be added

## Customize courses
Edit the `courses` array near the top of `app.js`. Each course has an id, name, flag, level, category, lesson count, description and sample phrase.
