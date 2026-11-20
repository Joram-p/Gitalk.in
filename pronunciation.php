<?php
require_once __DIR__.'/config/config.php';
$page_title=tr('Audio Pronunciation Lab','ऑडियो उच्चारण अभ्यास').' — LinguaFree';
$sets=[
'en-US'=>['Hello','How are you?','Thank you very much.','Could you help me, please?','I am learning a new language.','Where is the nearest station?'],
'hi-IN'=>['नमस्ते','आप कैसे हैं?','आपका बहुत धन्यवाद।','क्या आप मेरी मदद कर सकते हैं?','मैं एक नई भाषा सीख रहा/रही हूँ।','सबसे नज़दीकी स्टेशन कहाँ है?'],
'es-ES'=>['Hola','¿Cómo estás?','Muchas gracias.','¿Puede ayudarme, por favor?'],
'fr-FR'=>['Bonjour','Comment allez-vous ?','Merci beaucoup.','Pouvez-vous m’aider, s’il vous plaît ?'],
'de-DE'=>['Hallo','Wie geht es dir?','Vielen Dank.','Können Sie mir bitte helfen?'],
'ja-JP'=>['こんにちは','お元気ですか。','ありがとうございます。','手伝っていただけますか。'],
'ko-KR'=>['안녕하세요','어떻게 지내세요?','정말 감사합니다.','도와주시겠어요?'],
'es-MX'=>['Buenos días','Mucho gusto','Hasta luego'],
'zh-CN'=>['你好','你好吗？','非常感谢。','请问，洗手间在哪里？'],
'ar-SA'=>['مرحبا','كيف حالك؟','شكرا جزيلا']
];
$language=$_GET['language']??(site_lang()==='hi'?'hi-IN':'en-US');if(!isset($sets[$language]))$language='en-US';
include __DIR__.'/includes/header.php';?>
<div class="page-head"><div><span class="eyebrow"><?= e(tr('LISTEN & REPEAT','सुनें और दोहराएँ')) ?></span><h1><?= e(tr('Pronunciation lab','उच्चारण प्रयोगशाला')) ?></h1><p><?= e(tr('Hear useful expressions with your device voice, then repeat them aloud.','अपने डिवाइस की आवाज़ में उपयोगी वाक्य सुनें और फिर उन्हें बोलकर दोहराएँ।')) ?></p></div></div>
<div class="pronunciation-panel"><label><?= e(tr('Choose language','भाषा चुनें')) ?><select id="audioLanguage"><?php foreach(['en-US'=>'English','hi-IN'=>'हिन्दी','es-ES'=>'Español','fr-FR'=>'Français','de-DE'=>'Deutsch','ja-JP'=>'日本語','ko-KR'=>'한국어','zh-CN'=>'中文','ar-SA'=>'العربية'] as $code=>$name):?><option value="<?= $code ?>" <?= $language===$code?'selected':'' ?>><?= $name ?></option><?php endforeach;?></select></label><div class="phrase-grid"><?php foreach($sets[$language] as $phrase):?><article class="phrase-card"><p><?= e($phrase) ?></p><button class="btn btn-outline speak-phrase" data-text="<?= e($phrase) ?>" data-lang="<?= e($language) ?>">🔊 <?= e(tr('Listen','सुनें')) ?></button></article><?php endforeach;?></div><div class="custom-speech"><label><?= e(tr('Type your own word or sentence','अपना शब्द या वाक्य लिखें')) ?><textarea id="customText" rows="3" placeholder="<?= e(tr('Type here...','यहाँ लिखें...')) ?>"></textarea></label><button class="btn btn-primary" id="speakCustom">▶ <?= e(tr('Play pronunciation','उच्चारण सुनें')) ?></button><p class="small-note"><?= e(tr('Available voices and pronunciation quality depend on your browser and operating system.','उपलब्ध आवाज़ और उच्चारण की गुणवत्ता आपके ब्राउज़र और ऑपरेटिंग सिस्टम पर निर्भर करती है।')) ?></p></div></div>
<script src="<?= BASE_URL ?>/assets/js/pronunciation.js"></script>
<?php include __DIR__.'/includes/footer.php';?>