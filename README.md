# English Speaking Academy

A responsive bilingual (English/Hindi) academy website starter with a student demo dashboard and admin demo panel.

## Run locally
1. Extract the ZIP.
2. Open `index.html` in a modern browser.
3. No build step or package installation is required.

## Demo features
- Responsive landing page, course cards, vocabulary practice and mini quiz.
- English/Hindi language switch.
- Enquiry form stores entries in the current browser's localStorage.
- Student demo login: enter any name and phone number.
- Admin demo password: `admin123`.
- Admin can view saved enquiries, export CSV, and clear demo entries.

## Important before publishing
This is a front-end starter/demo, not a production learning management system.
- Admin password and student login are demo-only and are not secure authentication.
- Enquiries are stored only in the visitor's browser; they are not sent to the academy.
- For a real public website, connect a backend such as Supabase or your own API.
- Add secure authentication, database tables, role-based access rules, server-side validation, backups, privacy policy and HTTPS.
- Replace academy contact details and course information with your real details.
- Change the demo admin password only after implementing server-side authentication; changing the value in `app.js` alone is not secure.

## Suggested production database tables
- `profiles`: id, full_name, phone, role
- `courses`: id, title_en, title_hi, description_en, description_hi, duration, level, active
- `enquiries`: id, name, phone, course_id, created_at, status
- `lessons`: id, course_id, title, content, lesson_order
- `quiz_questions`: id, lesson_id, question, options, correct_option
- `student_progress`: id, student_id, lesson_id, completed_at, score

## Customization
- Edit text and course content in `index.html`.
- Change colors and layout in `style.css`.
- Update practice questions, demo login and admin demo logic in `app.js`.
