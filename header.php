<?php require_once __DIR__ . '/../config/config.php'; $user=current_user(); $flash=get_flash(); ?>
<!doctype html><html lang="<?= ($user['preferred_language']??'en')==='hi'?'hi':'en' ?>"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Learn languages for free with LinguaFree."><title><?= e($page_title ?? 'LinguaFree') ?></title>
<link rel="stylesheet" href="<?= BASE_URL ?>/assets/css/style.css"></head><body>
<header class="site-header"><a class="brand" href="<?= BASE_URL ?>/index.php"><span class="brand-icon">L</span><span>Lingua<span>Free</span><small>LANGUAGE FOR EVERYONE</small></span></a>
<button class="mobile-menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="primaryNav">☰</button><nav id="primaryNav"><a href="<?= BASE_URL ?>/index.php#courses"><?= e(tr('Courses','कोर्स')) ?></a><?php if($user): ?><a href="<?= BASE_URL ?>/dashboard.php">Dashboard</a><?php endif; ?><a href="<?= BASE_URL ?>/index.php#about"><?= e(tr('About','हमारे बारे में')) ?></a><a href="<?= BASE_URL ?>/ai-tutor.php">AI Tutor</a><a href="<?= BASE_URL ?>/pronunciation-score.php">Pronunciation</a></nav>
<div class="header-actions"><a class="lang-switch" href="<?= BASE_URL ?>/language.php?lang=<?= site_lang()==='en'?'hi':'en' ?>"><?= site_lang()==='en'?'हिन्दी':'English' ?></a><?php if($user): ?><span class="welcome">Hi, <?= e($user['name']) ?></span><a class="btn btn-outline" href="<?= BASE_URL ?>/logout.php">Log out</a><?php else: ?><a class="btn btn-outline" href="<?= BASE_URL ?>/login.php">Log in</a><a class="btn btn-primary" href="<?= BASE_URL ?>/register.php">Join free</a><?php endif; ?></div>
</header><main class="container">
<?php if($flash): ?><div class="notice <?= e($flash['type']) ?>"><?= e($flash['message']) ?></div><?php endif; ?>
