// ===== GLOBAL VARIABLES =====
let currentView = 'home';
let articles = [];
let currentArticleId = null;

// ===== ARTICLE DATA =====
const articlesData = [
    {
        id: 1,
        title: 'The Art of Digital Minimalism',
        date: '2025-03-15',
        readTime: '8 min',
        category: 'Lifestyle',
        tags: ['Minimalism', 'Digital Detox', 'Mindfulness'],
        excerpt: 'Exploring how reducing digital clutter can lead to a more focused and intentional life in our hyper‑connected world.',
        content: `# The Art of Digital Minimalism

In an age where our screens glow brighter than the stars, finding peace in the digital noise has become a rare skill. Digital minimalism isn't about abandoning technology—it's about using it with intention.

## The Constant Connection

We check our phones an average of 96 times a day. Each notification pulls our attention away from the present moment, fragmenting our focus like starlight scattered through a prism.

### Principles I Follow:

1. **Intentional Usage**: Every app on my phone serves a clear purpose. If it doesn't enrich my life, it doesn't stay.
2. **Notification Fasting**: Turning off all non‑essential notifications was like discovering silence in a crowded room.
3. **Digital Sabbaths**: One day each week completely screen‑free. The first few hours are uncomfortable, then something magical happens—I remember how to be bored, and boredom breeds creativity.

## The Tools That Help

- **Forest App**: Plants virtual trees when I stay focused
- **News Feed Eradicator**: Removes endless scrolling from social media
- **Simple Phone Launcher**: Reduces visual clutter to essentials

> "What information consumes is rather obvious: it consumes the attention of its recipients. Hence a wealth of information creates a poverty of attention." — Herbert Simon

## The Results

After six months of practicing digital minimalism:
- My average screen time dropped from 5.2 to 1.8 hours daily
- I finished three books I'd been "meaning to read" for years
- My concentration during deep work sessions improved by 40%
- I actually notice the stars at night now

The digital world, like the cosmos, is vast and beautiful—but we need to look up from our screens to see it.`
    },
    {
        id: 2,
        title: 'Building a DIY Raspberry Pi Telescope Controller',
        date: '2025-02-28',
        readTime: '12 min',
        category: 'Technology',
        tags: ['Raspberry Pi', 'Astronomy', 'DIY', 'Python'],
        excerpt: 'How I turned a Raspberry Pi into an automated telescope mount controller for under $100.',
        content: `# Building a DIY Raspberry Pi Telescope Controller

Astronomy has always been about patience—waiting for the right night, the right alignment, the right moment. But what if we could let technology handle the waiting?

## The Problem

Manual telescope tracking is frustrating. You finally find Jupiter, take your eye away to check a star chart, and suddenly it's drifted out of view. Commercial tracking mounts cost hundreds, sometimes thousands of dollars.

## The Solution: Raspberry Pi to the Rescue

With a Raspberry Pi 4, a stepper motor, and some 3D‑printed parts, I built an automated tracking system for about $85.

### Components:
- Raspberry Pi 4 (4GB)
- NEMA 17 stepper motor
- DRV8825 motor driver
- 12V power supply
- Custom 3D‑printed gear assembly
- Python control software

## The Code

\`\`\`python
import RPi.GPIO as GPIO
import time
from astropy.coordinates import EarthLocation, AltAz
from astropy.time import Time

class TelescopeController:
    def __init__(self):
        self.location = EarthLocation(lat=31.2304, lng=121.4737, height=10)
        self.current_ra = 0.0
        self.current_dec = 0.0
        
    def track_object(self, ra, dec):
        """Smoothly track celestial object"""
        # Calculate motor steps needed
        steps = self.calculate_steps(ra, dec)
        self.stepper_move(steps)
        
    def calculate_steps(self, ra, dec):
        """Convert RA/Dec to motor steps"""
        # Simplified calculation for demo
        return int((ra - self.current_ra) * 1000)
\`\`\`

## Challenges & Solutions

1. **Gear Backlash**: 3D‑printed gears had too much play. Solution: Added spring‑loaded tensioners.
2. **Weatherproofing**: Electronics don't like dew. Solution: IP65 enclosure with silica gel packets.
3. **Power Stability**: Stepper motor caused voltage drops. Solution: Separate power supply for motors.

## The Payoff

The first night it automatically tracked the Orion Nebula for two hours while I simply watched through the eyepiece was magical. I captured this image of M42:

![Orion Nebula](https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)

## Next Steps

- Add GPS for automatic location detection
- Integrate with Stellarium for object database
- Implement plate solving for precise alignment

Sometimes the best way to connect with the cosmos is to let machines handle the details while we enjoy the view.`
    },
    {
        id: 3,
        title: 'Why Every Developer Should Learn Astronomy',
        date: '2025-02-10',
        readTime: '6 min',
        category: 'Philosophy',
        tags: ['Astronomy', 'Programming', 'Perspective'],
        excerpt: 'How studying the stars changes the way you think about code, complexity, and our place in the universe.',
        content: `# Why Every Developer Should Learn Astronomy

We spend our days manipulating abstract symbols on screens, building digital castles in the cloud. Meanwhile, actual castles of gas and dust are forming stars light‑years away. Here's why looking up matters.

## Scale Changes Everything

The average JavaScript framework has about 500,000 lines of code. That feels massive until you consider:
- The Milky Way contains 100–400 billion stars
- Each star is a complex nuclear fusion reactor
- The universe has been running without a single reboot for 13.8 billion years

Suddenly, your microservices architecture feels less daunting.

## Debugging on Cosmic Timescales

When your code breaks, you get error messages. When the universe "breaks" (like when a star goes supernova), it creates:
- Heavier elements like gold and uranium
- Neutron stars that spin 716 times per second
- Gravitational waves that ripple through spacetime

**Perspective**: That bug that kept you up until 3 AM? In cosmic terms, it's less significant than a single photon from a dying star.

## Patterns in the Chaos

Astronomy teaches pattern recognition:
- Spiral galaxies follow logarithmic spirals (Fibonacci in space!)
- Planetary orbits obey simple mathematical relationships
- Star clusters form fractal‑like distributions

These same patterns appear in:
- Network traffic graphs
- Database index structures
- User behavior analytics

## The Ultimate Refactoring

Every atom in your body was forged in a star that lived and died before the Earth formed. The carbon in your DNA, the iron in your blood, the calcium in your bones—all stellar remnants.

> We are literally made of star‑stuff. The code we write is just star‑stuff thinking about itself.

## Practical Benefits

1. **Problem‑Solving**: If you can calculate orbital mechanics, you can optimize a database query
2. **Patience**: Some astronomical processes take millions of years. Waiting for CI/CD feels shorter
3. **Humility**: The universe has been running complex systems longer than we've existed

## Try This Tonight

1. Find Polaris (the North Star)
2. Observe it for 15 minutes
3. Notice how everything else rotates around it
4. Consider: That light left Polaris 433 years ago—around when Shakespeare was writing Hamlet

Then go back to your code. You'll see it differently.

Because in the end, we're not just writing code. We're arranging stardust into patterns that can think about the stars they came from.`
    },
    {
        id: 4,
        title: 'Creating Ambient Space Music with Web Audio API',
        date: '2025-01-22',
        readTime: '10 min',
        category: 'Creative',
        tags: ['Web Audio', 'Music', 'Synthesis', 'JavaScript'],
        excerpt: 'How I use JavaScript and the Web Audio API to generate generative space ambient soundscapes.',
        content: `# Creating Ambient Space Music with Web Audio API

Silence in space isn't actually silent—it's filled with electromagnetic vibrations that, if we could hear them, would sound like the universe's symphony. Here's how I recreate that feeling in the browser.

## The Concept

Traditional music has structure: verses, choruses, melodies. Space ambient is different—it's about texture, atmosphere, and emergence. It should feel like something that's always been there, not something that was composed.

## The Setup

\`\`\`javascript
class SpaceSynth {
    constructor() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.oscillators = [];
        this.filters = [];
        this.delayNodes = [];
        
        this.init();
    }
    
    init() {
        // Create 5 detuned oscillators for "star cluster" effect
        for (let i = 0; i < 5; i++) {
            const osc = this.audioCtx.createOscillator();
            osc.frequency.value = 110 + (i * 0.7);
            osc.detune.value = i * 3; // Slight detuning for richness
            
            const filter = this.audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 800 + (i * 100);
            
            osc.connect(filter);
            filter.connect(this.audioCtx.destination);
            
            this.oscillators.push(osc);
            this.filters.push(filter);
        }
    }
    
    start() {
        this.oscillators.forEach(osc => osc.start());
    }
}
\`\`\`

## Sound Design Elements

### 1. Drifting Pads
Slow LFOs modulating filter cutoff to simulate "gas cloud" movement.

### 2. Meteoric Percussion
Granular synthesis of noise bursts, panned randomly across stereo field.

### 3. Pulsar Rhythms
Precise, regular clicks that gradually phase in and out like rotating neutron stars.

### 4. Cosmic Reverb
Convolution reverb using impulse responses recorded in large empty spaces (cathedrals, caves).

## Generative Techniques

The music should never repeat exactly. I use:

\`\`\`javascript
function generateMelodicFragment() {
    // Use celestial data as seed
    const now = new Date();
    const seed = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    
    // Simple algorithm using prime numbers for "natural" feel
    const notes = [];
    for (let i = 0; i < 8; i++) {
        const noteValue = (seed * (i + 1) * 13) % 12;
        notes.push(baseNote + noteValue);
    }
    
    return notes;
}
\`\`\`

## The Result

You can listen to a sample I created: [Space Ambient Generator](https://example.com)

The browser becomes a window not just to visual space, but to auditory space. Each visit creates a unique soundscape based on the time of day, browser characteristics, and random cosmic seeds.

## Why This Matters

We experience the universe primarily visually, but sound adds emotional depth. The haunting beauty of space isn't just in its images—it's in the silence between stars, the imagined echoes of cosmic events, the rhythm of celestial mechanics.

Next time you're debugging at 2 AM, try leaving this running in the background. You might just feel like you're floating among the stars while you fix that race condition.`
    }
];

// ===== DOM ELEMENTS =====
const enterBlogButton = document.getElementById('enterBlog');
const navLinks = document.querySelectorAll('.nav-link');
const contentViews = document.querySelectorAll('.content-view');
const articlesList = document.getElementById('articlesList');
const articleDetailView = document.getElementById('articleDetailView');
const articleTitle = document.getElementById('articleTitle');
const articleDate = document.getElementById('articleDate');
const articleReadTime = document.getElementById('articleReadTime');
const articleCategory = document.getElementById('articleCategory');
const articleTags = document.getElementById('articleTags');
const articleContent = document.getElementById('articleContent');
const backToArticles = document.getElementById('backToArticles');
const readMoreLinks = document.querySelectorAll('.read-more');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on
    if (enterBlogButton) {
        // Starry page
        initStarryPage();
    } else {
        // Blog page
        initBlogPage();
    }
});

// ===== STARRY PAGE FUNCTIONS =====
function initStarryPage() {
    enterBlogButton.addEventListener('click', function() {
        // Add ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            top: ${y}px;
            left: ${x}px;
        `;
        
        this.appendChild(ripple);
        
        // Navigate after animation
        setTimeout(() => {
            window.location.href = 'blog.html';
        }, 600);
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Animate stars
    animateStars();
}

function animateStars() {
    const stars = document.querySelectorAll('.star-point');
    stars.forEach((star, index) => {
        // Random movement
        star.style.animationDelay = `${index * 0.3}s`;
        
        // Occasionally twinkle brighter
        setInterval(() => {
            if (Math.random() > 0.7) {
                star.style.boxShadow = '0 0 30px #fff, 0 0 60px #6a11cb, 0 0 90px #ff7ee7';
                setTimeout(() => {
                    star.style.boxShadow = '0 0 20px #fff, 0 0 40px #6a11cb, 0 0 60px #ff7ee7';
                }, 300);
            }
        }, 2000 + Math.random() * 3000);
    });
}

// ===== BLOG PAGE FUNCTIONS =====
function initBlogPage() {
    articles = articlesData;
    
    // Set up navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const view = this.getAttribute('data-view');
            switchView(view);
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Set up "read more" links
    readMoreLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const view = this.getAttribute('data-view');
            switchView(view);
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            document.querySelector(`[data-view="${view}"]`).classList.add('active');
        });
    });
    
    // Set up back button
    if (backToArticles) {
        backToArticles.addEventListener('click', function(e) {
            e.preventDefault();
            switchView('articles');
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            document.querySelector('[data-view="articles"]').classList.add('active');
        });
    }
    
    // Initialize articles list
    renderArticlesList();
    
    // Show home view by default
    switchView('home');
}

function switchView(viewName) {
    // Hide all views
    contentViews.forEach(view => {
        view.style.display = 'none';
    });
    
    // Show selected view
    const targetView = document.getElementById(`${viewName}View`);
    if (targetView) {
        targetView.style.display = 'block';
        currentView = viewName;
        
        // If switching to articles view, refresh list
        if (viewName === 'articles') {
            renderArticlesList();
        }
    }
}

function renderArticlesList() {
    if (!articlesList) return;
    
    articlesList.innerHTML = '';
    
    articles.forEach(article => {
        const articleElement = document.createElement('article');
        articleElement.className = 'article-card';
        articleElement.setAttribute('data-id', article.id);
        
        const tagsHtml = article.tags.map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('');
        
        articleElement.innerHTML = `
            <h2 class="article-title">${article.title}</h2>
            <div class="article-meta">
                <span><i class="far fa-calendar"></i> ${formatDate(article.date)}</span>
                <span><i class="far fa-clock"></i> ${article.readTime} read</span>
                <span><i class="far fa-folder"></i> ${article.category}</span>
            </div>
            <div class="article-tags">
                ${tagsHtml}
            </div>
            <p class="article-excerpt">${article.excerpt}</p>
            <div class="article-read-more">
                <a href="#" class="read-more">Read full article <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
        
        // Add click event
        articleElement.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            showArticle(id);
        });
        
        articlesList.appendChild(articleElement);
    });
}

function showArticle(id) {
    const article = articles.find(a => a.id === id);
    if (!article) return;
    
    currentArticleId = id;
    
    // Update article detail view
    articleTitle.textContent = article.title;
    articleDate.textContent = formatDate(article.date);
    articleReadTime.textContent = article.readTime;
    articleCategory.textContent = article.category;
    
    // Update tags
    articleTags.innerHTML = '';
    article.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        articleTags.appendChild(tagElement);
    });
    
    // Render markdown content
    articleContent.innerHTML = marked.parse(article.content);
    
    // Apply syntax highlighting
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
    
    // Switch to article detail view
    switchView('articleDetail');
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}