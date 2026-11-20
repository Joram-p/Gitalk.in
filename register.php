<?php
require_once __DIR__.'/config/config.php';
if(current_user()) redirect('/dashboard.php');
$page_title='Create free account — LinguaFree';
$errors=[];
if($_SERVER['REQUEST_METHOD']==='POST'){
 verify_csrf(); $name=trim($_POST['name']??''); $email=strtolower(trim($_POST['email']??'')); $pass=$_POST['password']??''; $lang=$_POST['preferred_language']??'en';
 if(mb_strlen($name)<2) $errors[]='Please enter your name.';
 if(!filter_var($email,FILTER_VALIDATE_EMAIL)) $errors[]='Enter a valid email address.';
 if(strlen($pass)<10) $errors[]='Password must be at least 10 characters.';
 if(!in_array($lang,['en','hi'],true)) $lang='en';
 if(!$errors){try{$s=db()->prepare("INSERT INTO users(name,email,password_hash,preferred_language) VALUES(?,?,?,?)");$s->execute([$name,$email,password_hash($pass,PASSWORD_DEFAULT),$lang]);session_regenerate_id(true);$_SESSION['user']=['id'=>(int)db()->lastInsertId(),'name'=>$name,'email'=>$email,'role'=>'student','preferred_language'=>$lang];redirect('/dashboard.php');}catch(PDOException $e){$errors[]='This email may already be registered.';}}
}
include __DIR__.'/includes/header.php'; ?>
<div class="auth-wrap"><form class="auth-card" method="post"><span class="eyebrow">START LEARNING FREE</span><h1>Create your account</h1><p>No subscription. No course fees.</p><?php foreach($errors as $err): ?><div class="notice error"><?= e($err) ?></div><?php endforeach; ?><input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>"><label>Full name<input name="name" required maxlength="120" value="<?= e($_POST['name']??'') ?>"></label><label>Email address<input name="email" type="email" required value="<?= e($_POST['email']??'') ?>"></label><label>Password<input name="password" type="password" minlength="10" required autocomplete="new-password"></label><label>Preferred website language<select name="preferred_language"><option value="en">English</option><option value="hi">हिन्दी</option></select></label><button class="btn btn-primary full">Create free account →</button><small>Already registered? <a href="<?= BASE_URL ?>/login.php">Log in</a></small></form></div>
<?php include __DIR__.'/includes/footer.php'; ?>