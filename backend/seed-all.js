require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');
const Blog = require('./models/Blog');
const User = require('./models/User');

// ─── SEED DATA ────────────────────────────────────────────────────────────────

const eventsData = [
    // ── PAST EVENTS ──
    {
        title: 'Yoga & Meditation Retreat 2024',
        description: `## Yoga & Meditation Retreat 2024\n\nNirvana Club organized an immersive yoga and meditation retreat for IIIT Sri City students. The retreat focused on stress management techniques, breathing exercises (pranayama), and guided meditation.\n\n### Highlights\n- 3-hour guided yoga session\n- Pranayama breathing workshop\n- Group meditation practice\n- Discussion on integrating mindfulness in student life\n\nOver 80 students participated and reported feeling significantly calmer and more focused afterwards.`,
        startDate: new Date('2024-09-15T07:00:00.000Z'),
        endDate: new Date('2024-09-15T10:00:00.000Z'),
        location: 'IIIT Sri City, Open Air Amphitheatre',
        image: '',
        rsvpRequired: false,
        registrationLink: '',
        photosLink: '',
    },
    {
        title: 'Guest Lecture: Ethics in AI',
        description: `## Guest Lecture: Ethics in Artificial Intelligence\n\nDr. Ramesh Krishnamurthy from IIT Hyderabad delivered an insightful lecture on the ethical dimensions of Artificial Intelligence development.\n\n### Topics Covered\n- Bias and fairness in ML models\n- AI safety and alignment\n- Indian philosophical perspectives on technology ethics\n- Career paths in AI ethics\n\n### About the Speaker\nDr. Ramesh Krishnamurthy has 15+ years of experience in AI research and is a leading voice on responsible AI in India.`,
        startDate: new Date('2024-10-22T14:00:00.000Z'),
        endDate: new Date('2024-10-22T16:30:00.000Z'),
        location: 'Seminar Hall, Academic Block, IIIT Sri City',
        image: '',
        rsvpRequired: true,
        registrationLink: '',
        photosLink: '',
    },
    {
        title: 'Diwali Celebration & Cultural Evening',
        description: `## Diwali Celebration & Cultural Evening\n\nNirvana Club hosted a vibrant Diwali celebration bringing together students from all backgrounds to celebrate the festival of lights.\n\n### Program\n- Traditional lamp lighting ceremony\n- Classical dance performances\n- Live music — folk and devotional songs\n- Rangoli competition\n- Traditional sweets and snacks\n\nThe event was a beautiful reminder of our rich cultural heritage and the values of light over darkness, knowledge over ignorance.`,
        startDate: new Date('2024-11-01T17:00:00.000Z'),
        endDate: new Date('2024-11-01T21:00:00.000Z'),
        location: 'IIIT Sri City, Main Ground',
        image: '',
        rsvpRequired: false,
        registrationLink: '',
        photosLink: '',
    },
    {
        title: 'Reading Circle: The Bhagavad Gita',
        description: `## Reading Circle: The Bhagavad Gita\n\nAn enriching monthly reading circle session dedicated to understanding the timeless wisdom of the Bhagavad Gita and its relevance to modern student life.\n\n### Session Focus\n- Chapter 2: Sankhya Yoga — The Yoga of Knowledge\n- Discussion on duty, self-discipline and detachment from results\n- How these principles apply to academic pressure and career choices\n\n### Format\nOpen discussion, no prior reading required. All are welcome!`,
        startDate: new Date('2024-12-08T16:00:00.000Z'),
        endDate: new Date('2024-12-08T18:00:00.000Z'),
        location: 'Library Discussion Room, IIIT Sri City',
        image: '',
        rsvpRequired: false,
        registrationLink: '',
        photosLink: '',
    },
    {
        title: 'Mindfulness Workshop: Managing Exam Stress',
        description: `## Mindfulness Workshop: Managing Exam Stress\n\nWith semester exams approaching, Nirvana Club organized a practical mindfulness workshop to help students manage exam anxiety and improve focus.\n\n### What You Will Learn\n- The science behind stress and the stress response\n- 5-minute meditation techniques you can do anywhere\n- Journaling for clarity and mental declutter\n- Sleep hygiene tips for exam season\n- Nutritional tips for brain performance\n\nThis workshop was attended by over 120 students and received excellent feedback.`,
        startDate: new Date('2025-01-10T15:00:00.000Z'),
        endDate: new Date('2025-01-10T17:00:00.000Z'),
        location: 'LH-3, IIIT Sri City',
        image: '',
        rsvpRequired: true,
        registrationLink: '',
        photosLink: '',
    },
    {
        title: 'Annual General Meet 2024-25',
        description: `## Nirvana Club Annual General Meet 2024-25\n\nNirvana Club held its Annual General Meeting to review the year's activities, celebrate achievements, and welcome the new leadership team for 2025-26.\n\n### Agenda\n1. Review of 2024-25 events and initiatives\n2. Financial summary\n3. Appreciation ceremony for outgoing team\n4. Introduction of new team 2025-26\n5. Vision and roadmap for the upcoming year\n\n### Outgoing Lead\nHimanshu Saraswat led the club with exceptional dedication throughout 2024-25.`,
        startDate: new Date('2025-03-28T10:00:00.000Z'),
        endDate: new Date('2025-03-28T12:00:00.000Z'),
        location: 'Seminar Hall, IIIT Sri City',
        image: '',
        rsvpRequired: false,
        registrationLink: '',
        photosLink: '',
    },

    // ── UPCOMING EVENTS ──
    {
        title: 'International Yoga Day 2026',
        description: `## International Yoga Day 2026\n\nJoin Nirvana Club for our flagship International Yoga Day celebration! We invite all students, faculty, and staff to participate in this enriching outdoor yoga session.\n\n### Program\n- 6:00 AM — Warm-up & Surya Namaskar\n- 6:30 AM — Asana practice (beginner friendly)\n- 7:30 AM — Pranayama & meditation\n- 8:00 AM — Refreshments & community breakfast\n\n### What to Bring\n- Yoga mat (limited mats available on first-come basis)\n- Comfortable clothes\n- Water bottle\n- Positive energy! 🙏\n\nNo prior experience needed. All levels welcome.`,
        startDate: new Date('2026-06-21T06:00:00.000Z'),
        endDate: new Date('2026-06-21T08:30:00.000Z'),
        location: 'IIIT Sri City, Open Air Amphitheatre',
        image: '',
        rsvpRequired: true,
        registrationLink: '',
        photosLink: '',
    },
    {
        title: 'Workshop: Ancient Indian Science & Modern Technology',
        description: `## Workshop: Ancient Indian Science & Modern Technology\n\nExplore the fascinating connections between ancient Indian knowledge systems and modern scientific discoveries in this thought-provoking workshop.\n\n### Topics\n- Mathematics in ancient India (Aryabhata, Brahmagupta, Ramanujan)\n- Ayurveda and modern medicine — convergences and divergences\n- Ancient metallurgy, architecture and engineering\n- Philosophy of science in Indian thought\n\n### Speaker\nProf. Satish Chandra Tripathi, Professor of History of Science, University of Hyderabad.\n\nSeats are limited. Register early!`,
        startDate: new Date('2026-07-15T14:00:00.000Z'),
        endDate: new Date('2026-07-15T17:00:00.000Z'),
        location: 'Seminar Hall, Academic Block, IIIT Sri City',
        image: '',
        rsvpRequired: true,
        registrationLink: '',
        photosLink: '',
    },
    {
        title: 'Community Service Drive: Digital Literacy',
        description: `## Community Service Drive: Digital Literacy\n\nNirvana Club is organizing a digital literacy drive in the surrounding villages of Chittoor district. Volunteers from IIIT Sri City will teach basic computer skills, internet safety, and digital financial tools to local community members.\n\n### Activities\n- Basic computer usage training\n- UPI & digital payments workshop\n- Internet safety and online scam awareness\n- Introduction to government digital services (DigiLocker, UMANG)\n\n### How to Volunteer\nSign up using the registration link. Transport from campus will be arranged. Lunch provided.`,
        startDate: new Date('2026-08-10T08:00:00.000Z'),
        endDate: new Date('2026-08-10T17:00:00.000Z'),
        location: 'Chittoor District Villages (transport from campus)',
        image: '',
        rsvpRequired: true,
        registrationLink: '',
        photosLink: '',
    },
];

const blogsData = [
    {
        title: 'Finding Balance: A Student\'s Guide to Mindfulness',
        summary: 'Practical mindfulness techniques for IIIT students to reduce stress and improve academic performance without spending hours meditating.',
        content: `# Finding Balance: A Student's Guide to Mindfulness

University life is exciting — but let's be honest, it can be overwhelming. Between assignments, exams, projects, placements, and social life, it's easy to feel like you're constantly running on empty.

Mindfulness doesn't have to mean sitting cross-legged for an hour. Here are five practical techniques you can start today.

## 1. The 2-Minute Morning Reset

Before you open your phone in the morning, spend just 2 minutes focusing on your breath. Breathe in for 4 counts, hold for 4, out for 4. This simple technique activates your parasympathetic nervous system, setting a calm tone for the day.

## 2. Mindful Eating

Instead of scrolling through your phone at the mess, try eating one meal a day without any screen. Notice the flavors, textures, and smells. This trains attention and also improves digestion.

## 3. The Study-Break Reset

Every 45 minutes of study, take a 5-minute break. During this break, step outside if possible, look at the sky, and take 5 deep breaths. This resets your focus and prevents mental fatigue.

## 4. The Evening Reflection

Spend 5 minutes before sleep writing down:
- 3 things that went well today
- 1 thing you're grateful for
- 1 intention for tomorrow

This practice rewires your brain towards positivity over time.

## 5. Single-Tasking

Our brains are not built for multitasking. When studying, close all irrelevant tabs and put your phone in another room. The quality of focused work beats hours of distracted study.

## The Science Behind It

Research from Harvard shows that mindfulness meditation physically changes brain structure, increasing grey matter in areas associated with learning, memory, and emotional regulation. You don't need an hour — even 10 minutes a day shows measurable results within 8 weeks.

**Start small. Be consistent. The compound effect is real.**`,
        tags: ['Mindfulness', 'Student Life', 'Mental Health', 'Productivity'],
        status: 'APPROVED',
        isPublished: true,
    },
    {
        title: 'What the Bhagavad Gita Taught Me About Handling Failure',
        summary: 'A personal reflection on how the ancient wisdom of the Bhagavad Gita helped navigate academic failure and emerge stronger.',
        content: `# What the Bhagavad Gita Taught Me About Handling Failure

Last semester, I failed two courses. I'd never failed anything before.

The shame, the calls home, the looks from classmates — it was one of the hardest periods of my life. I didn't know how to process it. Then, almost by accident, I picked up a copy of the Bhagavad Gita from the library.

## Karma Yoga: Do Your Duty, Release the Result

The central teaching that hit me hardest was from Chapter 2, Verse 47:

> *"You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions."*

I realized I had been so focused on grades — the outcome — that I had lost joy in the process of learning. I studied to score, not to understand. The Gita was telling me something fundamental: focus on the effort, release the attachment to results.

This doesn't mean not caring. It means giving your absolute best and accepting what comes with equanimity.

## Nishkama Karma in Practice

Arjuna faces a crisis of action on the battlefield of Kurukshetra. Krishna doesn't tell him to give up or to stop caring. He tells him to act according to his duty with full effort — but without ego-driven attachment to winning or losing.

For a student: study with full sincerity. Prepare with complete dedication. Then let the exam happen. Don't let anxiety about results poison the preparation.

## What Changed for Me

After reading the Gita (and joining Nirvana Club's reading circle), I restructured how I studied:
- I stopped tracking my marks obsessively
- I started asking "Do I understand this?" instead of "Will this come in the exam?"
- I found a study group where we discussed concepts, not just solved past papers

My grades recovered. But more importantly, I found genuine love for what I was learning.

## A Note to Anyone Struggling

Failure is not the opposite of success. It's part of the path. The Gita calls this the nature of life itself — a constant flux of birth, decay, and renewal. Every "failure" is a death of an old version of yourself making room for something new.

**You are not your grade. You are the awareness behind the experience.**`,
        tags: ['Bhagavad Gita', 'Philosophy', 'Student Life', 'Personal Growth'],
        status: 'APPROVED',
        isPublished: true,
    },
    {
        title: 'Nirvana Club: Our Journey — Year in Review 2024-25',
        summary: 'A comprehensive look back at Nirvana Club\'s activities, events, and growth throughout the 2024-25 academic year.',
        content: `# Nirvana Club: Our Journey — Year in Review 2024-25

As we close out an incredible academic year, we wanted to take a moment to reflect on everything we've accomplished together as a community.

## By the Numbers

- **12+** events organized
- **500+** total participants across all events
- **6** reading circle sessions
- **3** guest speakers hosted
- **90** active club members

## Highlights of the Year

### International Yoga Day 2024
Our biggest event of the year — over 200 students and faculty joined us for an early morning yoga session at the amphitheatre. The energy was electric and the sunrise backdrop was breathtaking.

### Ethics in AI — Guest Lecture
Dr. Ramesh Krishnamurthy's lecture on AI ethics drew the largest audience of any Nirvana event to date. The Q&A session ran 45 minutes overtime — that's how engaged the audience was!

### Bhagavad Gita Reading Circle
Our monthly reading circles became a campus institution. Started with 8 people in September, by March we had 40+ regular attendees. We completed all 18 chapters over the year.

### Community Service
Our digital literacy drive in three villages of Chittoor district reached over 150 community members. Watching an elderly woman make her first UPI transaction was one of the most rewarding moments of the year.

## The New Team

We're thrilled to welcome our 2025-26 leadership team:
- **Club Lead**: Himanshu Saraswat
- **Co-Lead**: Jeet Tushar Mahajan & Yash Ghule

The new team brings fresh energy and ambitious plans for the year ahead.

## Looking Forward to 2025-26

Plans for the upcoming year include:
- Monthly mindfulness workshops
- Collaboration with other clubs for interdisciplinary events
- A podcast series featuring alumni and guest speakers
- Expanded community outreach programs

Thank you to every member, volunteer, attendee, and supporter who made this year what it was. Nirvana is not just a club — it's a community.

**Om Shanti 🙏**`,
        tags: ['Club News', 'Year in Review', 'Community', 'Events'],
        status: 'APPROVED',
        isPublished: true,
    },
    {
        title: 'The Science of Breath: Why Pranayama Works',
        summary: 'An evidence-based look at how ancient breathing techniques (pranayama) affect the nervous system, brain, and mental health.',
        content: `# The Science of Breath: Why Pranayama Works

Pranayama — the ancient yogic science of breath control — has been practiced for thousands of years. Modern neuroscience is now explaining exactly *why* it works so powerfully.

## The Autonomic Nervous System

Your autonomic nervous system has two modes:
- **Sympathetic**: Fight-or-flight. Stress hormones spike, heart rate rises, digestion pauses.
- **Parasympathetic**: Rest-and-digest. Heart rate slows, cortisol drops, healing accelerates.

Most of us spend too much time in sympathetic mode — deadline anxiety, notification stress, social pressure. Pranayama is one of the most powerful tools to consciously shift into parasympathetic mode.

## The Vagus Nerve Connection

Slow, deep breathing (especially with extended exhale) stimulates the vagus nerve — the longest cranial nerve, connecting brain to gut. Vagus nerve stimulation:
- Lowers heart rate
- Reduces inflammation
- Improves mood (increases GABA, serotonin)
- Enhances focus and cognitive flexibility

## Three Evidence-Backed Techniques

### 1. Nadi Shodhana (Alternate Nostril Breathing)
**How**: Close right nostril, inhale through left. Close left, exhale right. Inhale right. Close right, exhale left. That's one round.

**Research**: A 2017 study in the *Journal of Clinical and Diagnostic Research* found that 12 weeks of Nadi Shodhana significantly reduced anxiety scores and improved cardiovascular efficiency in college students.

### 2. Bhramari (Humming Bee Breath)
**How**: Inhale deeply. On exhale, hum like a bee with mouth closed. Feel the vibration in your skull.

**Research**: The humming vibration stimulates the vagus nerve and releases nitric oxide — a molecule that dilates blood vessels and reduces blood pressure. Studies show it reduces test anxiety in students.

### 3. Box Breathing (Equal Ratio)
**How**: Inhale 4 counts → Hold 4 → Exhale 4 → Hold 4. Repeat.

**Research**: Used by Navy SEALs and elite athletes. Studies show it reduces cortisol and improves performance under pressure within minutes.

## Practical Recommendations for Students

- **Before an exam**: 5 minutes of box breathing
- **When anxious or stressed**: 10 rounds of Bhramari
- **Daily maintenance**: 5-10 minutes of Nadi Shodhana morning or evening

The ancient yogis didn't have fMRI machines. But they understood something profound: the breath is the bridge between the conscious and unconscious mind. Modern science is simply validating what they discovered.

**Breathe. It changes everything.**`,
        tags: ['Pranayama', 'Science', 'Mental Health', 'Yoga', 'Wellness'],
        status: 'APPROVED',
        isPublished: true,
    },
];

// ─── MAIN ────────────────────────────────────────────────────────────────────

const seedAll = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected\n');

        // ── Find or create a system admin user for authorship ──
        let adminUser = await User.findOne({ role: 'SUPER_ADMIN' });

        if (!adminUser) {
            adminUser = await User.findOne({});
            if (!adminUser) {
                console.log('⚠️  No users found in DB. Creating a placeholder system user...');
                adminUser = await User.create({
                    clerkId: 'system_seed_user',
                    email: 'admin@nirvanaclub.iiits.in',
                    firstName: 'Nirvana',
                    lastName: 'Club',
                    role: 'SUPER_ADMIN',
                });
                console.log('✅ Created system user:', adminUser._id);
            } else {
                console.log(`ℹ️  Using existing user as author: ${adminUser.email}`);
            }
        } else {
            console.log(`✅ Found admin user: ${adminUser.email}`);
        }

        // ── Seed Events ──
        console.log('\n📅 Seeding Events...');
        await Event.deleteMany({});
        const eventsWithAuthor = eventsData.map(e => ({ ...e, createdBy: adminUser._id }));
        const insertedEvents = await Event.insertMany(eventsWithAuthor);
        const past = insertedEvents.filter(e => new Date(e.startDate) < new Date()).length;
        const upcoming = insertedEvents.filter(e => new Date(e.startDate) >= new Date()).length;
        console.log(`✅ Inserted ${insertedEvents.length} events (${past} past, ${upcoming} upcoming)`);

        // ── Seed Blogs ──
        console.log('\n📝 Seeding Blogs...');
        await Blog.deleteMany({});
        const blogsWithAuthor = blogsData.map(b => ({ ...b, author: adminUser._id, reviewedBy: adminUser._id, reviewedAt: new Date() }));
        const insertedBlogs = await Blog.insertMany(blogsWithAuthor);
        console.log(`✅ Inserted ${insertedBlogs.length} blogs`);

        // ── Summary ──
        console.log('\n─────────────────────────────────');
        console.log('📊 Seed Summary:');
        console.log(`   Events : ${insertedEvents.length}`);
        console.log(`   Blogs  : ${insertedBlogs.length}`);
        console.log(`   Members: (already seeded separately)`);
        console.log('─────────────────────────────────');
        console.log('🎉 All data seeded successfully!\n');

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err);
        process.exit(1);
    }
};

seedAll();
