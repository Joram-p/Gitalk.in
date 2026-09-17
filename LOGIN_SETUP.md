# Gitalk.in Login/Register Fix

The site now has root-level authentication entry points:
- /login.php
- /register.php
- /profile.php
- /logout.php

Pretty Apache routes are also provided:
- /login
- /register
- /profile
- /logout

## Important
PHP must be enabled on the hosting server and the MySQL database from `auth/database.sql` must be imported.
Edit `auth/config.php` with the real database host/name/user/password.

If your hosting only serves static HTML (no PHP), these authentication files cannot execute; use PHP hosting or deploy the backend separately.
