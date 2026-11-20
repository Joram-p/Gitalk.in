# English Speaking Academy — V2

A modern, responsive bilingual (English/Hindi) online English-learning platform starter.

## Included
- Responsive learning dashboard and sidebar navigation
- Course catalogue with search and level filter
- Video lesson area and lesson completion demo
- Vocabulary, speaking-topic and writing practice
- Interactive English quiz with score feedback
- Live class schedule (sample data)
- Student progress view
- Demo admin panel and enquiry export to CSV
- Hindi/English interface toggle
- Contact/enquiry form stored in browser localStorage

## Run locally
1. Extract the ZIP.
2. Open `index.html` in a modern browser.
3. For best results, use VS Code with the Live Server extension.

No build tools or package installation are required.

## Important: demo vs production
This ZIP is a front-end starter/demo. It does **not** include secure user authentication, a server, a real database, paid enrolment, video hosting, live video conferencing, email delivery, or role-based admin authorization. Enquiries and lesson completion are stored only in the current browser using localStorage. The sample student numbers, progress and live class timetable are illustrative.

Before accepting real students or payments, connect a backend such as Supabase:
- Supabase Auth for student/admin sign-in and role checks
- Postgres tables for profiles, courses, lessons, enrolments, progress and enquiries
- Supabase Storage or a video hosting provider for lesson media
- A trusted payment gateway integration for fees
- A video meeting provider for live classes
- Server-side validation, access policies, backups and privacy/terms pages

Never put service-role keys, payment secrets or admin passwords in browser JavaScript.

## Project structure
```
English_Speaking_Academy_V2/
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    ├── data.js
    └── app.js
```
