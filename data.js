const COURSES = [
 {id:1,title:"Basic English Foundations",level:"Beginner",duration:"4 weeks",lessons:18,price:"₹999",description:"Build a strong foundation with grammar, vocabulary and everyday phrases.",symbol:"Aa",cover:"",progress:45},
 {id:2,title:"Spoken English Mastery",level:"Intermediate",duration:"6 weeks",lessons:24,price:"₹1,499",description:"Speak naturally in daily conversations with confidence and clarity.",symbol:"◉",cover:"cover-blue",progress:30},
 {id:3,title:"Interview & Career English",level:"Advanced",duration:"3 weeks",lessons:12,price:"₹1,199",description:"Prepare for interviews, presentations and professional communication.",symbol:"✦",cover:"cover-peach",progress:0},
 {id:4,title:"Grammar Made Simple",level:"Beginner",duration:"3 weeks",lessons:15,price:"₹799",description:"Understand tenses, sentence structure and common grammar patterns.",symbol:"✎",cover:"",progress:0},
 {id:5,title:"English for Daily Life",level:"Intermediate",duration:"4 weeks",lessons:20,price:"₹999",description:"Useful English for shopping, travel, phone calls and social situations.",symbol:"☼",cover:"cover-blue",progress:0},
 {id:6,title:"Fluency & Pronunciation",level:"Advanced",duration:"5 weeks",lessons:20,price:"₹1,699",description:"Improve pronunciation, listening skills, rhythm and fluency.",symbol:"♫",cover:"cover-peach",progress:0}
];
const LESSONS=["Introducing yourself in English","Common greetings and responses","Talking about your family","Daily routine vocabulary","Asking questions politely","Practice: A short conversation"];
const WORDS=[
 {word:"Confident",meaning:"आत्मविश्वासी — feeling sure about yourself.",example:"I feel confident when I practice every day."},
 {word:"Improve",meaning:"सुधारना — to make something better.",example:"I want to improve my spoken English."},
 {word:"Opportunity",meaning:"अवसर — a chance to do something.",example:"Learning English can create new opportunities."},
 {word:"Polite",meaning:"विनम्र — showing good manners and respect.",example:"It is polite to say please and thank you."},
 {word:"Achieve",meaning:"हासिल करना — to successfully reach a goal.",example:"You can achieve your goals with practice."}
];
const TOPICS=["Talk about your daily routine.","Describe your favourite place.","What makes a good friend?","Talk about a skill you want to learn.","Describe your last memorable day."];
const QUIZ=[
 {q:"Choose the correct sentence.",a:["She go to school.","She goes to school.","She going to school."],correct:1,why:"With he, she or it, use 'goes' in the simple present."},
 {q:"What is the past tense of 'write'?",a:["Writed","Written","Wrote"],correct:2,why:"The simple past form of write is wrote."},
 {q:"Complete: I have lived here ___ 2020.",a:["for","since","from"],correct:1,why:"Use 'since' with a starting point in time."},
 {q:"Which is a polite request?",a:["Give me water.","Could I have some water, please?","Water now."],correct:1,why:"'Could I... please?' is a polite request."},
 {q:"Choose the correct article: She is ___ honest person.",a:["a","an","the"],correct:1,why:"Use 'an' before a vowel sound. Honest begins with a silent h."}
];
const LIVE_CLASSES=[
 {name:"Everyday Conversation Club",date:"25 Nov 2026 • 6:00 PM",teacher:"Anita Sharma",level:"Beginner"},
 {name:"Grammar Q&A Session",date:"27 Nov 2026 • 5:30 PM",teacher:"Rahul Mehta",level:"All levels"},
 {name:"Interview Speaking Practice",date:"29 Nov 2026 • 7:00 PM",teacher:"Neha Verma",level:"Advanced"}
];