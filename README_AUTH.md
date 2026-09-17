# Gitalk.in — PHP + MySQL Login/Register

This package upgrades the demo Login/Register into a real session-based authentication starter.

## Requirements
- PHP 8.1+
- MySQL/MariaDB
- HTTPS in production

## Setup
1. Create a MySQL database/user, or import `database.sql`.
2. Edit `auth/config.php` with the real DB host, database, username and password.
3. Upload the Gitalk theme folder to your PHP hosting.
4. Open `/auth/register.php` to create the first user.
5. After login, `/auth/profile.php` shows the current session user.

## Security included
- PDO-style prepared queries via MySQLi prepared statements
- `password_hash()` / `password_verify()`
- CSRF token
- Session ID regeneration after login
- HttpOnly + SameSite cookies
- Basic input validation

## Still to add for production
- Email/SMS OTP provider
- Password reset flow
- Email verification
- Rate limiting / login throttling
- CAPTCHA where appropriate
- Admin roles/permissions
- Audit logs
- Account recovery and device/session management

Do not put real database passwords into a public Git repository.
