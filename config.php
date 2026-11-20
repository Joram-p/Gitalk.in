<?php
declare(strict_types=1);
session_start();

define('APP_NAME', 'LinguaFree');
define('BASE_URL', '/linguafree'); // Change to your folder name or domain path.
define('DB_HOST', 'localhost');
define('DB_NAME', 'linguafree');
define('DB_USER', 'root');
define('DB_PASS', '');

function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]);
    }
    return $pdo;
}
function e(?string $value): string { return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8'); }
function current_user(): ?array { return $_SESSION['user'] ?? null; }
function require_login(): void {
    if (!current_user()) { header('Location: ' . BASE_URL . '/login.php'); exit; }
}
function require_role(array $roles): void {
    require_login();
    if (!in_array(current_user()['role'], $roles, true)) { http_response_code(403); exit('Access denied'); }
}
function csrf_token(): string {
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf'];
}
function verify_csrf(): void {
    $token = $_POST['csrf'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!$token || !hash_equals(csrf_token(), $token)) { http_response_code(419); exit('Invalid security token. Refresh and try again.'); }
}
function flash(string $message, string $type='success'): void { $_SESSION['flash'] = ['message'=>$message,'type'=>$type]; }
function get_flash(): ?array { $f=$_SESSION['flash']??null; unset($_SESSION['flash']); return $f; }
function redirect(string $path): never { header('Location: ' . BASE_URL . $path); exit; }

function site_lang(): string {
    $lang = $_SESSION['site_lang'] ?? (current_user()['preferred_language'] ?? 'en');
    return in_array($lang, ['en','hi'], true) ? $lang : 'en';
}
function tr(string $en, string $hi): string {
    return site_lang() === 'hi' ? $hi : $en;
}
