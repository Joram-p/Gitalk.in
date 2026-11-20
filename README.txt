LINGUAFREE FULL COURSE SYSTEM (PHP + MySQL)

FEATURES
- Responsive homepage
- Student registration and login (passwords hashed)
- Four learning levels and sample lessons
- Lesson reading pages
- Mark lesson complete and track progress
- Basic admin dashboard
- Hindi explanations and English examples in starter lessons

INSTALLATION
1. Upload the project folder to your PHP hosting (PHP 8.0+ recommended).
2. Create a MySQL database, or import database/schema.sql (it creates linguafree).
3. Import database/seed.sql into the linguafree database.
4. Edit config.php and enter your database host, database name, username and password.
5. Open index.php in your browser and register a learner account.

MAKE AN ADMIN
For safety, registration never creates admins. After registering, run this SQL in phpMyAdmin:
UPDATE users SET role='admin' WHERE email='your-email@example.com';
Then log out and log in again.

IMPORTANT
- This is a functional starter course platform, not a production-hardened commercial LMS.
- The sample course contains 12 starter lessons. Add your complete lesson content in the lessons table.
- Admin dashboard currently provides overview only; content editing is done through phpMyAdmin.
- Use HTTPS in production. Add CSRF protection, rate limiting, email verification, password reset and backups before public launch.
- No AI service is connected in this package.
