<?php
require_once __DIR__.'/config/config.php';require_login();
$u=current_user();$page_title='My dashboard — LinguaFree';
if($u['role']==='admin') redirect('/admin/index.php');
if($u['role']==='teacher') redirect('/teacher/index.php');
$q=db()->prepare("SELECT c.*, e.enrolled_at,(SELECT COUNT(*) FROM lessons l WHERE l.course_id=c.id AND l.is_published=1) total_lessons,(SELECT COUNT(*) FROM lesson_progress p JOIN lessons l2 ON l2.id=p.lesson_id WHERE p.user_id=? AND l2.course_id=c.id) done_lessons FROM enrollments e JOIN courses c ON c.id=e.course_id WHERE e.user_id=? ORDER BY e.enrolled_at DESC");$q->execute([$u['id'],$u['id']]);$courses=$q->fetchAll();
include __DIR__.'/includes/header.php'; ?>
<div class="page-head"><div><span class="eyebrow">STUDENT SPACE</span><h1>Welcome, <?= e($u['name']) ?>.</h1><p>Your learning journey, all in one place.</p></div><a class="btn btn-primary" href="<?= BASE_URL ?>/index.php#courses">Explore courses →</a></div>
<div class="dashboard-stats"><div><b><?= count($courses) ?></b><span>Enrolled courses</span></div><div><b><?= array_sum(array_column($courses,'done_lessons')) ?></b><span>Lessons completed</span></div><div><b>Free</b><span>All course access</span></div></div>
<h2 class="subheading">My courses</h2><div class="course-grid"><?php foreach($courses as $c):$pct=(int)$c['total_lessons']?round(100*$c['done_lessons']/$c['total_lessons']):0; ?><article class="course-card"><div class="course-top"><span class="flag"><?= e($c['flag_emoji']) ?></span><span class="free-pill"><?= $pct ?>% COMPLETE</span></div><h3><?= e($c['title']) ?></h3><p><?= e($c['description']) ?></p><div class="progress"><span style="width:<?= $pct ?>%"></span></div><div class="meta"><span><?= (int)$c['done_lessons'] ?>/<?= (int)$c['total_lessons'] ?> lessons</span></div><a class="btn btn-card" href="<?= BASE_URL ?>/course.php?id=<?= (int)$c['id'] ?>">Continue learning →</a></article><?php endforeach; ?></div>
<?php if(!$courses): ?><div class="empty">You have not enrolled in a course yet. <a href="<?= BASE_URL ?>/index.php#courses">Explore free courses →</a></div><?php endif; ?>
<?php include __DIR__.'/includes/footer.php'; ?>