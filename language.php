<?php
require_once __DIR__.'/config/config.php';
$lang=$_GET['lang']??'en';
if(in_array($lang,['en','hi'],true)){
 $_SESSION['site_lang']=$lang;
 if(current_user()){
  $s=db()->prepare("UPDATE users SET preferred_language=? WHERE id=?");
  $s->execute([$lang,current_user()['id']]);
  $_SESSION['user']['preferred_language']=$lang;
 }
}
$back=$_SERVER['HTTP_REFERER']??(BASE_URL.'/index.php');
if(strpos($back,BASE_URL)!==0)$back=BASE_URL.'/index.php';
header('Location: '.$back);exit;
