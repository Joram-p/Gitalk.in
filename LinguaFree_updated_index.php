<?php
require_once __DIR__ . '/config/config.php';

$page_title = 'LinguaFree — Learn Languages, Connect with the World';
$user = current_user();

// Load only published courses and count their published lessons.
$courses = db()->query(
    "SELECT c.*, COUNT(l.id) AS lesson_count
     FROM courses c
     LEFT JOIN lessons l ON l.course_id = c.id AND l.is_published = 1
     WHERE c.is_published = 1
     GROUP BY c.id
     ORDER BY c.id DESC"
)->fetchAll();

$courseCount = count($courses);
$lessonCount = 0;
foreach ($courses as $course) {
    $lessonCount += (int)($course['lesson_count'] ?? 0);
}

include __DIR__ . '/includes/header.php';
?>

<style>
/* Homepage-only refinements. The shared V3.1 theme remains in assets/css/style.css. */
.home-hero{position:relative;overflow:hidden;display:grid;grid-template-columns:1.08fr .92fr;gap:34px;align-items:center;padding:clamp(30px,6vw,76px);margin:26px 0 22px;border-radius:30px;background:radial-gradient(circle at 80% 15%,rgba(255,255,255,.2),transparent 28%),linear-gradient(130deg,#21145f 0%,#5137bb 52%,#8065e8 100%);color:#fff;min-height:440px}
.home-hero:after{content:"";position:absolute;width:330px;height:330px;border:1px solid rgba(255,255,255,.16);border-radius:50%;right:-100px;bottom:-180px;box-shadow:0 0 0 35px rgba(255,255,255,.035),0 0 0 75px rgba(255,255,255,.025)}
.home-hero-copy,.home-hero-art{position:relative;z-index:1}.home-kicker{display:inline-flex;gap:8px;align-items:center;padding:8px 13px;border:1px solid rgba(255,255,255,.25);border-radius:99px;background:rgba(255,255,255,.1);font-size:12px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase}
.home-hero h1{font-size:clamp(38px,5.3vw,68px);line-height:1.04;letter-spacing:-2.5px;margin:22px 0 18px;color:#fff}.home-hero h1 span{color:#f6d879}.home-hero-copy>p{max-width:560px;color:rgba(255,255,255,.83);font-size:17px;line-height:1.75;margin:0 0 26px}.home-actions{display:flex;gap:12px;align-items:center;flex-wrap:wrap}.home-actions .btn{padding:14px 20px}.home-actions .btn-light{background:#fff;color:#34217f;border:1px solid #fff}.home-actions .btn-ghost{color:#fff;border:1px solid rgba(255,255,255,.4);background:rgba(255,255,255,.08)}
.home-proof{display:flex;gap:17px;flex-wrap:wrap;margin-top:27px;color:rgba(255,255,255,.86);font-size:13px}.home-proof b{color:#fff}.hero-orbit{min-height:300px;display:grid;place-items:center;position:relative}.orbit-globe{width:230px;height:230px;border-radius:50%;display:grid;place-items:center;font-size:112px;background:radial-gradient(circle at 35% 25%,#fff 0,#e9e3ff 10%,#b9a9ff 38%,#7660dc 72%);box-shadow:0 25px 75px rgba(13,5,58,.35),inset -18px -18px 35px rgba(42,22,120,.25);animation:globeFloat 5s ease-in-out infinite}.language-chip{position:absolute;padding:11px 15px;border-radius:14px;background:#fff;color:#29204c;box-shadow:0 12px 35px rgba(13,5,58,.2);font-size:14px;font-weight:800}.language-chip small{display:block;font-size:11px;color:#77718c;font-weight:600;margin-top:3px}.chip-one{top:12%;left:0}.chip-two{right:0;top:25%}.chip-three{bottom:9%;left:10%}.chip-four{bottom:5%;right:4%}@keyframes globeFloat{50%{transform:translateY(-12px)}}
.home-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin:18px 0 64px}.home-stat{padding:20px;border:1px solid #eceaf5;border-radius:18px;background:#fff;box-shadow:0 8px 25px rgba(31,20,79,.04)}.home-stat strong{display:block;font-size:25px;color:#39258f}.home-stat span{font-size:13px;color:#77738a}
.home-section{padding:30px 0 58px}.home-section-head{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:24px}.home-section-head h2,.home-how h2,.home-cta h2{font-size:clamp(27px,3.5vw,42px);letter-spacing:-1.2px;margin:8px 0;color:#211a3b}.home-section-head p,.home-how p{color:#77738a;line-height:1.7;margin:0}.home-eyebrow{font-size:11px;font-weight:900;letter-spacing:1.5px;color:#7659d5}.home-search{width:min(290px,100%);padding:13px 16px;border:1px solid #e6e2f1;border-radius:13px;background:#fff;font:inherit;outline:none}.home-search:focus{border-color:#8065e8;box-shadow:0 0 0 3px rgba(128,101,232,.12)}
.home-course-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:17px}.home-course{padding:21px;border:1px solid #eceaf5;border-radius:20px;background:#fff;box-shadow:0 9px 28px rgba(31,20,79,.045);transition:transform .2s,box-shadow .2s}.home-course:hover{transform:translateY(-4px);box-shadow:0 16px 35px rgba(31,20,79,.1)}.home-course-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:17px}.home-flag{font-size:34px}.home-free{padding:6px 9px;border-radius:99px;background:#e9f9ef;color:#168347;font-size:10px;font-weight:900;letter-spacing:.5px}.home-course h3{font-size:19px;margin:0 0 9px;color:#27213e}.home-course p{font-size:13px;line-height:1.65;color:#77738a;min-height:43px;margin:0 0 17px}.home-course-meta{display:flex;gap:10px;flex-wrap:wrap;color:#77738a;font-size:12px;margin-bottom:18px}.home-course-meta span{padding:6px 9px;background:#f5f3fb;border-radius:8px}.home-course .btn{display:block;text-align:center;width:100%}.home-empty{padding:30px;border:1px dashed #d8d2ea;border-radius:18px;text-align:center;color:#77738a}
.home-tools{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.home-tool{display:block;padding:20px;border:1px solid #eceaf5;border-radius:18px;background:#fff;text-decoration:none;color:inherit;transition:.2s}.home-tool:hover{transform:translateY(-3px);border-color:#c7baf2}.home-tool-icon{width:46px;height:46px;display:grid;place-items:center;border-radius:14px;background:#f0ecff;font-size:23px}.home-tool h3{font-size:16px;margin:15px 0 7px}.home-tool p{font-size:12px;line-height:1.65;color:#77738a;min-height:58px}.home-tool b{font-size:12px;color:#684bc8}
.home-how{display:grid;grid-template-columns:.8fr 1.2fr;gap:50px;padding:42px;margin:15px 0 60px;border-radius:25px;background:#f5f2ff}.home-steps{display:grid;grid-template-columns:1fr 1fr;gap:18px}.home-step{display:flex;gap:13px;padding:17px;background:#fff;border-radius:15px}.home-step-num{flex:0 0 35px;height:35px;display:grid;place-items:center;border-radius:11px;background:#eee9ff;color:#684bc8;font-weight:900}.home-step h3{font-size:14px;margin:2px 0 5px}.home-step p{font-size:12px;line-height:1.5;margin:0;color:#77738a}
.home-cta{display:flex;justify-content:space-between;align-items:center;gap:25px;padding:35px 40px;margin-bottom:45px;border-radius:24px;background:linear-gradient(110deg,#21145f,#6045c4);color:#fff}.home-cta h2{color:#fff;margin:6px 0}.home-cta p{color:rgba(255,255,255,.78);margin:0}.home-cta .btn{background:#fff;color:#39258f;white-space:nowrap}
@media(max-width:900px){.home-hero{grid-template-columns:1fr;padding:38px;min-height:0}.hero-orbit{min-height:270px}.home-course-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.home-tools{grid-template-columns:repeat(2,1fr)}.home-how{grid-template-columns:1fr;gap:25px}.home-stats{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.home-hero{padding:28px 21px;border-radius:22px;margin-top:15px}.home-hero h1{letter-spacing:-1.5px}.home-hero-copy>p{font-size:15px}.hero-orbit{min-height:235px}.orbit-globe{width:165px;height:165px;font-size:78px}.language-chip{font-size:11px;padding:8px 10px}.language-chip small{font-size:9px}.home-stats{gap:9px;margin-bottom:42px}.home-stat{padding:14px}.home-stat strong{font-size:20px}.home-stat span{font-size:11px}.home-section-head{align-items:stretch;flex-direction:column}.home-search{width:100%}.home-course-grid,.home-tools,.home-steps{grid-template-columns:1fr}.home-course p{min-height:0}.home-tool p{min-height:0}.home-how{padding:24px 18px;margin-bottom:42px}.home-cta{align-items:flex-start;flex-direction:column;padding:27px 22px}.home-cta .btn{width:100%;text-align:center}}
@media(prefers-reduced-motion:reduce){.orbit-globe,.home-course,.home-tool{animation:none;transition:none}}
</style>

<section class="home-hero">
    <div class="home-hero-copy">
        <span class="home-kicker">✦ <?= e(tr('YOUR FREE LANGUAGE JOURNEY','आपकी मुफ्त भाषा सीखने की यात्रा')) ?></span>
        <h1><?= e(tr('Speak a new language.','नई भाषा बोलें।')) ?><br><span><?= e(tr('Open a new world.','नई दुनिया खोलें।')) ?></span></h1>
        <p><?= e(tr('Learn English and 50+ languages with guided lessons, speaking practice and an AI conversation partner. Start at your level and learn at your own pace.','गाइडेड लेसन, बोलने की प्रैक्टिस और AI conversation partner के साथ अंग्रेज़ी और 50+ भाषाएँ सीखें। अपने स्तर से शुरुआत करें और अपनी गति से सीखें।')) ?></p>
        <div class="home-actions">
            <a class="btn btn-light" href="#courses"><?= e(tr('Explore free courses','मुफ्त कोर्स देखें')) ?> →</a>
            <?php if ($user): ?>
                <a class="btn btn-ghost" href="<?= BASE_URL ?>/dashboard.php"><?= e(tr('Go to dashboard','डैशबोर्ड खोलें')) ?> ↗</a>
            <?php else: ?>
                <a class="btn btn-ghost" href="<?= BASE_URL ?>/register.php"><?= e(tr('Create free account','मुफ्त अकाउंट बनाएँ')) ?> ↗</a>
            <?php endif; ?>
        </div>
        <div class="home-proof"><span>✓ <b><?= e(tr('Free learning','मुफ्त शिक्षा')) ?></b></span><span>✓ <b><?= e(tr('Learn on mobile','मोबाइल पर सीखें')) ?></b></span><span>✓ <b><?= e(tr('Beginner friendly','शुरुआती लोगों के लिए')) ?></b></span></div>
    </div>
    <div class="home-hero-art" aria-label="A globe surrounded by greetings in different languages">
        <div class="hero-orbit">
            <div class="orbit-globe" aria-hidden="true">🌍</div>
            <div class="language-chip chip-one">Hola!<small>Spanish · Hello</small></div>
            <div class="language-chip chip-two">こんにちは<small>Japanese · Hello</small></div>
            <div class="language-chip chip-three">Bonjour<small>French · Hello</small></div>
            <div class="language-chip chip-four">नमस्ते<small>Hindi · Hello</small></div>
        </div>
    </div>
</section>

<section class="home-stats" aria-label="Platform highlights">
    <div class="home-stat"><strong><?= $courseCount ?></strong><span><?= e(tr('Published courses','उपलब्ध कोर्स')) ?></span></div>
    <div class="home-stat"><strong><?= number_format($lessonCount) ?>+</strong><span><?= e(tr('Published lessons','उपलब्ध लेसन')) ?></span></div>
    <div class="home-stat"><strong>50+</strong><span><?= e(tr('Languages to explore','सीखने के लिए भाषाएँ')) ?></span></div>
    <div class="home-stat"><strong>100%</strong><span><?= e(tr('Free to get started','शुरुआत करना मुफ्त')) ?></span></div>
</section>

<section class="home-section" id="courses">
    <div class="home-section-head">
        <div><span class="home-eyebrow"><?= e(tr('FIND YOUR NEXT LANGUAGE','अपनी अगली भाषा चुनें')) ?></span><h2><?= e(tr('Choose a course.','कोर्स चुनें।')) ?></h2><p><?= e(tr('Short lessons help you build confidence one step at a time.','छोटे-छोटे लेसन से धीरे-धीरे आत्मविश्वास बढ़ाएँ।')) ?></p></div>
        <input id="courseSearch" class="home-search" type="search" placeholder="<?= e(tr('Search language or level...','भाषा या स्तर खोजें...')) ?>" aria-label="Search courses">
    </div>

    <?php if ($courses): ?>
        <div class="home-course-grid" id="courseGrid">
            <?php foreach ($courses as $course):
                $searchText = strtolower(($course['title'] ?? '') . ' ' . ($course['language_name'] ?? '') . ' ' . ($course['level'] ?? ''));
            ?>
                <article class="home-course" data-search="<?= e($searchText) ?>">
                    <div class="home-course-top"><span class="home-flag"><?= e($course['flag_emoji'] ?? '🌐') ?></span><span class="home-free">100% FREE</span></div>
                    <h3><?= e($course['title'] ?? 'Language Course') ?></h3>
                    <p><?= e($course['description'] ?? tr('Start learning with this free course.','इस मुफ्त कोर्स के साथ सीखना शुरू करें।')) ?></p>
                    <div class="home-course-meta"><span><?= e($course['level'] ?? 'All levels') ?></span><span><?= (int)$course['lesson_count'] ?> <?= e(tr('lessons','लेसन')) ?></span></div>
                    <a class="btn btn-card" href="<?= BASE_URL ?>/course.php?id=<?= (int)$course['id'] ?>"><?= e(tr('View course','कोर्स देखें')) ?> →</a>
                </article>
            <?php endforeach; ?>
        </div>
        <p id="noCourseMatch" class="home-empty" hidden><?= e(tr('No matching courses found. Try another search.','कोई मिलता-जुलता कोर्स नहीं मिला। दूसरा शब्द खोजें।')) ?></p>
    <?php else: ?>
        <div class="home-empty"><?= e(tr('Courses are being prepared. Please check back soon.','कोर्स तैयार किए जा रहे हैं। कृपया फिर से देखें।')) ?></div>
    <?php endif; ?>
</section>

<section class="home-section" id="practice">
    <div class="home-section-head"><div><span class="home-eyebrow"><?= e(tr('PRACTICE WITH CONFIDENCE','आत्मविश्वास के साथ अभ्यास करें')) ?></span><h2><?= e(tr('Learn it. Speak it.','सीखें भी, बोलें भी।')) ?></h2><p><?= e(tr('Use practical tools to turn lessons into real communication.','सीखी हुई भाषा को बातचीत में इस्तेमाल करने के लिए टूल्स का उपयोग करें।')) ?></p></div></div>
    <div class="home-tools">
        <a class="home-tool" href="<?= BASE_URL ?>/speaking.php"><span class="home-tool-icon">🎙️</span><h3><?= e(tr('Speaking Tutor','स्पीकिंग ट्यूटर')) ?></h3><p><?= e(tr('Practise speaking and review your transcript.','बोलने का अभ्यास करें और अपना ट्रांसक्रिप्ट देखें।')) ?></p><b><?= e(tr('Start speaking','बोलना शुरू करें')) ?> →</b></a>
        <a class="home-tool" href="<?= BASE_URL ?>/pronunciation.php"><span class="home-tool-icon">🔊</span><h3><?= e(tr('Pronunciation Lab','उच्चारण अभ्यास')) ?></h3><p><?= e(tr('Listen to words and practise clear pronunciation.','शब्द सुनें और सही उच्चारण का अभ्यास करें।')) ?></p><b><?= e(tr('Practise now','अभी अभ्यास करें')) ?> →</b></a>
        <a class="home-tool" href="<?= BASE_URL ?>/ai-tutor.php"><span class="home-tool-icon">✦</span><h3><?= e(tr('AI Conversation Partner','AI बातचीत साथी')) ?></h3><p><?= e(tr('Have guided conversations and learn from corrections.','गाइडेड बातचीत करें और सुधार से सीखें।')) ?></p><b><?= e(tr('Talk with AI','AI से बात करें')) ?> →</b></a>
        <a class="home-tool" href="<?= BASE_URL ?>/pronunciation-score.php"><span class="home-tool-icon">🎯</span><h3><?= e(tr('Pronunciation Score','उच्चारण स्कोर')) ?></h3><p><?= e(tr('Check your spoken practice with available scoring tools.','उपलब्ध स्कोरिंग टूल से अपने बोलने का अभ्यास जाँचें।')) ?></p><b><?= e(tr('Check score','स्कोर देखें')) ?> →</b></a>
    </div>
</section>

<section class="home-how" id="how">
    <div><span class="home-eyebrow"><?= e(tr('SIMPLE STEPS','आसान तरीके')) ?></span><h2><?= e(tr('Your progress starts with one lesson.','आपकी तरक्की एक लेसन से शुरू होती है।')) ?></h2><p><?= e(tr('Build a simple daily habit. Learn a little, practise often and keep moving forward.','रोज़ थोड़ा सीखें, नियमित अभ्यास करें और आगे बढ़ते रहें।')) ?></p></div>
    <div class="home-steps">
        <article class="home-step"><span class="home-step-num">01</span><div><h3><?= e(tr('Choose a language','भाषा चुनें')) ?></h3><p><?= e(tr('Pick the language you want to learn.','अपनी पसंद की भाषा चुनें।')) ?></p></div></article>
        <article class="home-step"><span class="home-step-num">02</span><div><h3><?= e(tr('Learn a lesson','एक लेसन सीखें')) ?></h3><p><?= e(tr('Study useful words and everyday phrases.','काम के शब्द और रोज़मर्रा के वाक्य सीखें।')) ?></p></div></article>
        <article class="home-step"><span class="home-step-num">03</span><div><h3><?= e(tr('Practise speaking','बोलने का अभ्यास करें')) ?></h3><p><?= e(tr('Use the speaking and pronunciation tools.','स्पीकिंग और उच्चारण टूल इस्तेमाल करें।')) ?></p></div></article>
        <article class="home-step"><span class="home-step-num">04</span><div><h3><?= e(tr('Track your progress','अपनी प्रगति देखें')) ?></h3><p><?= e(tr('Review lessons and celebrate milestones.','लेसन दोहराएँ और अपनी उपलब्धियाँ मनाएँ।')) ?></p></div></article>
    </div>
</section>

<section class="home-cta" id="about">
    <div><span class="home-eyebrow" style="color:#d9ccff"><?= e(tr('LANGUAGE FOR EVERYONE','हर किसी के लिए भाषा शिक्षा')) ?></span><h2><?= e(tr('Your next conversation starts here.','आपकी अगली बातचीत यहीं से शुरू होती है।')) ?></h2><p><?= e(tr('Join LinguaFree and take your first step today.','LinguaFree से जुड़ें और आज ही पहला कदम उठाएँ।')) ?></p></div>
    <a class="btn" href="<?= BASE_URL ?>/<?= $user ? 'dashboard.php' : 'register.php' ?>"><?= e($user ? tr('Open dashboard','डैशबोर्ड खोलें') : tr('Join for free','मुफ्त जुड़ें')) ?> →</a>
</section>

<script>
document.addEventListener('DOMContentLoaded', function () {
    const search = document.getElementById('courseSearch');
    const cards = Array.from(document.querySelectorAll('#courseGrid .home-course'));
    const emptyMessage = document.getElementById('noCourseMatch');
    if (!search) return;
    search.addEventListener('input', function () {
        const query = search.value.trim().toLowerCase();
        let visible = 0;
        cards.forEach(function (card) {
            const match = (card.dataset.search || '').includes(query);
            card.hidden = !match;
            if (match) visible++;
        });
        if (emptyMessage) emptyMessage.hidden = visible !== 0;
    });
});
</script>

<?php include __DIR__ . '/includes/footer.php'; ?>
