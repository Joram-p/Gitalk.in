<?php
require_once __DIR__.'/../config/config.php';
require_login();
if($_SERVER['REQUEST_METHOD']!=='POST'){http_response_code(405);exit;}
verify_csrf();
header('Content-Type: application/json; charset=utf-8');
$input=json_decode(file_get_contents('php://input'),true)??[];
$prompt=trim((string)($input['prompt']??''));
$transcript=trim((string)($input['transcript']??''));
$lang=preg_replace('/[^a-z-]/','',(string)($input['language']??'en-US'));
$score=max(0,min(100,(int)($input['score']??0)));
$feedback=trim((string)($input['feedback']??''));
if($prompt===''||$transcript===''){http_response_code(422);echo json_encode(['ok'=>false,'message'=>'Prompt and transcript are required.']);exit;}
$s=db()->prepare("INSERT INTO speaking_attempts(user_id,language_code,prompt_text,transcript,score,feedback) VALUES(?,?,?,?,?,?)");
$s->execute([current_user()['id'],$lang,mb_substr($prompt,0,500),mb_substr($transcript,0,3000),$score,mb_substr($feedback,0,2000)]);
echo json_encode(['ok'=>true,'message'=>'Practice saved.']);
