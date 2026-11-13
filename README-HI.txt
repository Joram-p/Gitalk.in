GITALK.IN — FREE ENGLISH LEARNING WEBSITE
=========================================

इस पैकेज में:
- Home page और अलग Speaking, Grammar, Spelling, Vocabulary, Translate, Audio & Video pages
- Hindi explanations, browser text-to-speech, microphone speaking practice (browser support पर निर्भर)
- Hindi ↔ English translation (MyMemory free public endpoint; limits/availability लागू)
- Firebase Email/Password Admin login और Firestore में updates publish करना
- Responsive mobile/desktop design

महत्वपूर्ण:
यह website static frontend है। Admin login तभी सुरक्षित तरीके से काम करेगा जब Firebase setup पूरा हो। केवल HTML/JavaScript में password लिखना सुरक्षित नहीं है, इसलिए ऐसा नहीं किया गया। Firebase UID allowlist + Firestore Security Rules admin-only publishing लागू करते हैं।

A. GitHub Pages पर website डालना (free)
1. GitHub पर नया public repository बनाएं, उदाहरण: gitalk-english.
2. ZIP extract करके सभी files repository के root में upload करें.
3. Repository → Settings → Pages → Deploy from a branch → main / root → Save.
4. Gitalk.in domain जोड़ने के लिए GitHub Pages settings में Custom domain में gitalk.in डालें.
5. अपने domain provider में GitHub Pages द्वारा बताए DNS records लगाएं. DNS update होने में समय लग सकता है.
6. HTTPS enable करें. अपने मौजूदा domain records बदलने से पहले पुराने DNS का backup रखें.

B. Admin login को सिर्फ अपने लिए चालू करें
1. https://console.firebase.google.com पर Google account से Firebase project बनाएं.
2. Authentication → Get started → Sign-in method → Email/Password enable करें.
3. Authentication → Users → Add user से अपना email और मजबूत password बनाएं. किसी दूसरे को account न दें.
4. बने हुए user का UID copy करें.
5. Project settings → General → Your apps → Web app बनाकर Firebase config values copy करें.
6. firebase-config.js में apiKey, authDomain, projectId, appId और ADMIN_UID भरें.
7. firestore.rules में PASTE_YOUR_ADMIN_USER_UID को उसी UID से बदलें. Firestore Database बनाएं और Rules tab में पूरी rules file publish करें.
8. Admin page खोलें: https://gitalk.in/admin.html. अपने Firebase email/password से login करें.
9. Admin dashboard में title और details लिखकर Publish update करें.

SECURITY CHECKLIST
- Firebase Admin SDK/service account key कभी website में upload न करें.
- Firebase UID केवल अपने account का रखें. UID सार्वजनिक करना password साझा करने जैसा नहीं है, फिर भी इसे अनावश्यक रूप से share न करें.
- Firebase Authentication में केवल अपना user रखें; public sign-up enable न करें.
- मजबूत, unique password और अपने Google account पर 2-step verification रखें.
- Firestore rules को test करें. Rules में owner UID के अलावा किसी को write access नहीं है.
- अगर Firebase config में गलती हो तो Admin login काम नहीं करेगा; public lessons फिर भी चलेंगे.

C. Content updates
इस starter version में Admin dashboard से siteUpdates collection में announcements/lesson updates publish होते हैं. Public home pages के sample lessons अभी HTML files में हैं; dashboard से उन मूल lessons को edit नहीं किया जाता. नए lesson content pages में जोड़ने के लिए संबंधित HTML page edit करके GitHub पर commit करें. आगे के version में lessons को Firestore से dynamic load किया जा सकता है.

D. Feature notes
- Audio pronunciation: device/browser की Speech Synthesis सुविधा उपयोग करता है.
- Microphone: browser SpeechRecognition support और permission पर निर्भर; हर device पर उपलब्ध नहीं.
- Translator: third-party free service है; privacy-sensitive text न डालें, accuracy verify करें.
- Video: फिलहाल curated YouTube search links हैं, embedded/licensed videos नहीं.
- Website learning content शुरुआती sample curriculum है, अभी 0–17 की पूरी textbook/course library नहीं है. सामग्री को शिक्षक/अभिभावक की निगरानी में उपयोग करें.
