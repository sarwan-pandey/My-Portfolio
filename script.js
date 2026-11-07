// Preloader Logic
window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            setTimeout(() => preloader.remove(), 500);
        }
    }, 1200);
});

// Vanilla Tilt 3D Effect for Cards
if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".services-box, .projects-box, .blog-card, .info-card, .cert-box"), {
        max: 10,
        speed: 400,
        glare: true,
        "max-glare": 0.25,
        scale: 1.02
    });
}

// Typed.js initialization
if (document.querySelector('.multiple-text') && typeof Typed !== 'undefined') {
    var typed = new Typed('.multiple-text', {
        strings: ['AI & ML Engineer', 'Computer Vision Specialist', 'Robotics & ROS 2 Developer', 'Deep Learning Enthusiast'],
        typeSpeed: 80,
        backSpeed: 60,
        backDelay: 1200,
        loop: true
    });
}

// Scroll section active link implementation
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.addEventListener('scroll', () => {
    let top = window.scrollY;
    sections.forEach(sec => {
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                let target = document.querySelector('header nav a[href*=' + id + ']');
                if (target) target.classList.add('active');
            });
        }
    });
});

// Modal functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // prevent background scrolling while modal is open
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside modal content
window.addEventListener('click', function(event) {
    if (event.target.classList && event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Testimonials Carousel
let currentTestimonial = 0;
function showTestimonial(index) {
    const slides = document.querySelectorAll('.testimonial-slide');
    if (slides.length === 0) return;
    slides.forEach(slide => slide.style.display = 'none');
    if (index >= slides.length) currentTestimonial = 0;
    else if (index < 0) currentTestimonial = slides.length - 1;
    else currentTestimonial = index;
    slides[currentTestimonial].style.display = 'block';
}

function nextTestimonial() {
    currentTestimonial++;
    showTestimonial(currentTestimonial);
}

function prevTestimonial() {
    currentTestimonial--;
    showTestimonial(currentTestimonial);
}

// AI Sentiment Analyzer Simulation
function analyzeSentiment() {
    const inputEl = document.getElementById('ai-input');
    if (!inputEl) return;
    const input = inputEl.value.trim();
    const resultDiv = document.getElementById('ai-result');
    
    if (input === '') {
        resultDiv.innerHTML = '<span style="color: #e63946;">Please enter some text!</span>';
        return;
    }
    
    resultDiv.innerHTML = '<span style="color: #777;">Analyzing with NLP model <i class="bx bx-loader-alt bx-spin"></i></span>';
    
    setTimeout(() => {
        const positiveWords = ['good', 'great', 'awesome', 'excellent', 'love', 'amazing', 'brilliant', 'fast', 'smart', 'best', 'accurate', 'impressive', 'intelligent'];
        const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'poor', 'worst', 'ugly', 'slow', 'fail', 'buggy', 'error'];
        
        const lowerInput = input.toLowerCase();
        let score = 0;
        
        positiveWords.forEach(word => { if (lowerInput.includes(word)) score++; });
        negativeWords.forEach(word => { if (lowerInput.includes(word)) score--; });
        
        if (score > 0) {
            resultDiv.innerHTML = '<span style="color: #2ecc71; background: rgba(46, 204, 113, 0.12); padding: 0.5rem 1.2rem; border-radius: 20px; border: 1px solid rgba(46, 204, 113, 0.3);"><i class="bx bx-smile"></i> Sentiment: Positive (Confidence 98.4%)</span>';
        } else if (score < 0) {
            resultDiv.innerHTML = '<span style="color: #e63946; background: rgba(230, 57, 70, 0.12); padding: 0.5rem 1.2rem; border-radius: 20px; border: 1px solid rgba(230, 57, 70, 0.3);"><i class="bx bx-sad"></i> Sentiment: Negative (Confidence 94.1%)</span>';
        } else {
            resultDiv.innerHTML = '<span style="color: #3498db; background: rgba(52, 152, 219, 0.12); padding: 0.5rem 1.2rem; border-radius: 20px; border: 1px solid rgba(52, 152, 219, 0.3);"><i class="bx bx-meh"></i> Sentiment: Neutral (Confidence 91.0%)</span>';
        }
    }, 1000);
}

// Custom Cursor Logic
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', function(e) {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 400, fill: "forwards" });
    });

    const interactives = document.querySelectorAll('a, button, .close-modal, .menu-item, .projects-box, .services-box, .cert-box, .info-card');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '48px';
            cursorOutline.style.height = '48px';
            cursorOutline.style.backgroundColor = 'rgba(230, 57, 70, 0.15)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '32px';
            cursorOutline.style.height = '32px';
            cursorOutline.style.backgroundColor = 'transparent';
        });
    });
}

// ScrollReveal Animations
if (typeof ScrollReveal !== 'undefined') {
    ScrollReveal({ 
        distance: '60px',
        duration: 1800,
        delay: 150,
    });

    ScrollReveal().reveal('.home-content, section.about .heading, section.testimonials .heading, section.contact .heading', { origin: 'top' });
    ScrollReveal().reveal('.home-img, .testimonial-wrapper', { origin: 'bottom' });
    ScrollReveal().reveal('.home-content h1, .about-img', { origin: 'left' });
    ScrollReveal().reveal('.home-content p, .about-content', { origin: 'right' });
}

// Dark Mode Toggle
const darkModeIcon = document.getElementById('dark-mode-icon');
if (darkModeIcon) {
    darkModeIcon.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            darkModeIcon.classList.replace('bx-moon', 'bx-sun');
        } else {
            darkModeIcon.classList.replace('bx-sun', 'bx-moon');
        }
    });
}

// Mobile Menu Toggle
const menuIcon = document.getElementById('menu-icon');
const navbar = document.querySelector('.navbar');

if (menuIcon && navbar) {
    menuIcon.addEventListener('click', () => {
        menuIcon.classList.toggle('bx-x');
        navbar.classList.toggle('active');
    });

    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', () => {
            menuIcon.classList.remove('bx-x');
            navbar.classList.remove('active');
        });
    });
}

// Chatbot Logic
function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    if (chatWindow) {
        chatWindow.classList.toggle('show');
        if (chatWindow.classList.contains('show')) {
            const input = document.getElementById('chat-input');
            if (input) input.focus();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleUserChat();
            }
        });
    }
});

function handleUserChat() {
    const inputField = document.getElementById('chat-input');
    if (!inputField) return;
    const userText = inputField.value.trim();
    if (!userText) return;
    
    const chatBody = document.getElementById('chat-body');
    
    // 1. Add User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'user-msg';
    userMsg.innerText = userText;
    chatBody.appendChild(userMsg);
    
    inputField.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // 2. Generate Bot Reply
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'bot-msg';
        
        let lower = userText.toLowerCase();
        let reply = "I'm Sarwan's personal AI Assistant! You can ask me about his AI/ML projects, robotics experience at IIIT Allahabad, technical skills, or hire him directly using the contact form below! 🚀";
        
        if (lower.includes("name") || lower.includes("who are you") || lower.includes("who is this") || lower.includes("sarwan")) {
            reply = "I represent <strong>Sarwan Kumar Pandey</strong>, a dedicated Computer Science student specializing in AI, Machine Learning, Deep Learning, and Robotics! 🤖✨";
        } else if (lower.includes("college") || lower.includes("university") || lower.includes("education") || lower.includes("degree") || lower.includes("study")) {
            reply = "Sarwan is pursuing his <strong>B.Tech in Computer Science (Artificial Intelligence & Machine Learning)</strong> at SR Institute of Management & Technology (2023–2027) in Lucknow! 🎓";
        } else if (lower.includes("experience") || lower.includes("iiit") || lower.includes("robotics") || lower.includes("internship") || lower.includes("work")) {
            reply = "Sarwan conducted research & development at the <strong>Center of Intelligent Robotics, IIIT Allahabad</strong>, implementing Reinforcement Learning, ROS 2 robotics workflows (simulation, navigation, SLAM), and AI drone vision systems! 🛰️";
        } else if (lower.includes("project") || lower.includes("portfolio") || lower.includes("build") || lower.includes("made")) {
            reply = "Sarwan's standout projects include:<br>• <strong>FaceID Studio</strong>: Multithreaded real-time face recognition (InsightFace + ONNX Runtime).<br>• <strong>RAG Pipeline</strong>: Document QA with LangChain, FAISS & Hugging Face.<br>• <strong>RNN Sequence Prediction</strong>: Time-series forecasting comparing RNN, LSTM, and GRU.<br>• <strong>Image Classifier App</strong>: CIFAR-10 CNN deployed with FastAPI! 💡";
        } else if (lower.includes("skill") || lower.includes("stack") || lower.includes("language") || lower.includes("tech") || lower.includes("tool")) {
            reply = "Sarwan's core stack:<br>• <strong>Languages</strong>: Python, SQL, C++<br>• <strong>AI/ML & Vision</strong>: TensorFlow, PyTorch, Keras, OpenCV, Scikit-learn, Hugging Face, FAISS, LangChain<br>• <strong>Robotics & Deployment</strong>: ROS 2 (Navigation, SLAM), FastAPI, Docker, Git! ⚡";
        } else if (lower.includes("cert") || lower.includes("award") || lower.includes("isro") || lower.includes("aws")) {
            reply = "Sarwan is certified in:<br>1. <strong>AWS Academy</strong> – Machine Learning Foundations<br>2. <strong>AWS Academy</strong> – Generative AI Foundations<br>3. <strong>ISRO (IIRS Dehradun)</strong> – AI/ML for Geodata Analytics! 📜";
        } else if (lower.includes("contact") || lower.includes("email") || lower.includes("hire") || lower.includes("phone") || lower.includes("reach")) {
            reply = "You can connect with Sarwan directly at <strong>sarwanpandey75@gmail.com</strong>, call <strong>+91-6206805982</strong>, or submit the contact form right here on this page! 📬";
        } else if (lower.includes("location") || lower.includes("where") || lower.includes("live") || lower.includes("city")) {
            reply = "Sarwan is based in <strong>Lucknow, India</strong>, and is open to on-site, hybrid, and remote engineering opportunities globally! 🌍";
        } else if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey")) {
            reply = "Hello there! 👋 How can I help you explore Sarwan's AI engineering, robotics, or computer vision portfolio today?";
        }
        
        botMsg.innerHTML = reply;
        chatBody.appendChild(botMsg);
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 700);
}

// Stats Counter Animation
const counters = document.querySelectorAll('.stat-number');
const speed = 120;

const animateCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const suffix = counter.getAttribute('data-suffix') || '';
            const count = +counter.innerText.replace(/[^0-9]/g, '');
            const inc = Math.max(1, Math.ceil(target / speed));

            if (count < target) {
                counter.innerText = Math.min(target, count + inc) + suffix;
                setTimeout(updateCount, 25);
            } else {
                counter.innerText = target + suffix;
            }
        };
        updateCount();
    });
};

const statsSection = document.querySelector('.stats-banner');
if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateCounters();
            observer.disconnect();
        }
    }, { threshold: 0.4 });
    observer.observe(statsSection);
}

// Particles.js Init with Red Theme
if (document.getElementById('particles-js') && typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        "particles": {
            "number": { "value": 65, "density": { "enable": true, "value_area": 850 } },
            "color": { "value": "#e63946" }, 
            "shape": { "type": "circle" },
            "opacity": { "value": 0.45, "random": false },
            "size": { "value": 3.2, "random": true },
            "line_linked": {
                "enable": true,
                "distance": 140,
                "color": "#e63946",
                "opacity": 0.22,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 1.8,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": { "enable": true, "mode": "grab" },
                "onclick": { "enable": true, "mode": "push" },
                "resize": true
            },
            "modes": {
                "grab": { "distance": 140, "line_linked": { "opacity": 0.8 } },
                "push": { "particles_nb": 4 }
            }
        },
        "retina_detect": true
    });
}

// Spotify Audio Widget Logic
function toggleAudio() {
    const audio = document.getElementById('bg-music');
    const icon = document.getElementById('music-icon');
    const bars = document.getElementById('music-bars');
    const textLabel = document.querySelector('.spotify-widget p');
    
    if (!audio) return;

    if (audio.paused) {
        audio.play().then(() => {
            if (icon) {
                icon.classList.remove('bx-play-circle');
                icon.classList.add('bx-pause-circle');
            }
            if (bars) bars.style.display = 'flex';
            if (textLabel) textLabel.innerText = 'Currently Playing';
        }).catch(err => {
            console.log('Audio playback permission:', err);
            if (textLabel) textLabel.innerText = 'Audio Ready';
        });
    } else {
        audio.pause();
        if (icon) {
            icon.classList.remove('bx-pause-circle');
            icon.classList.add('bx-play-circle');
        }
        if (bars) bars.style.display = 'none';
        if (textLabel) textLabel.innerText = 'Click to Play';
    }
}

// 1. Scroll Progress Bar
window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
        scrollProgress.style.width = progress + '%';
    }
});

// 2. Magnetic Buttons
const magneticButtons = document.querySelectorAll('.btn');
magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const position = btn.getBoundingClientRect();
        const x = e.clientX - position.left - position.width / 2;
        const y = e.clientY - position.top - position.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px) scale(1.04)`;
    });
    
    btn.addEventListener('mouseout', () => {
        btn.style.transform = 'translate(0px, 0px) scale(1)';
    });
});

// 3. Matrix Easter Egg (Type "sarwan")
let secretCode = ['s', 'a', 'r', 'w', 'a', 'n'];
let codeIndex = 0;
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key.toLowerCase() === secretCode[codeIndex]) {
        codeIndex++;
        if (codeIndex === secretCode.length) {
            triggerMatrix();
            codeIndex = 0;
        }
    } else {
        codeIndex = 0;
    }
});

function triggerMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.style.display = 'block';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789SARWANAIROBOTICS'.split('');
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = [];
    for (let x = 0; x < columns; x++) drops[x] = 1;
    
    const draw = setInterval(() => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#e63946'; // red matrix code!
        ctx.font = fontSize + 'px monospace';
        for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }, 33);
    
    setTimeout(() => {
        clearInterval(draw);
        canvas.style.display = 'none';
    }, 5000);
}

// 4. Flashlight Cursor Glow (Dark Mode Only)
const cursorGlow = document.getElementById('cursor-glow');
window.addEventListener('mousemove', (e) => {
    if (cursorGlow) {
        if (document.body.classList.contains('dark-mode')) {
            cursorGlow.style.display = 'block';
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        } else {
            cursorGlow.style.display = 'none';
        }
    }
});

// 5. Live Cyber Widget (Clock & Battery)
setInterval(() => {
    const timeEl = document.getElementById('cw-time');
    if (timeEl) timeEl.innerText = new Date().toLocaleTimeString();
}, 1000);

if ('getBattery' in navigator) {
    navigator.getBattery().then(function(battery) {
        function updateBatteryInfo() {
            const batEl = document.getElementById('cw-battery');
            if (batEl) batEl.innerText = Math.round(battery.level * 100) + '%';
        }
        updateBatteryInfo();
        battery.addEventListener('levelchange', updateBatteryInfo);
    });
}

// 6. UI Sound Effects
const clickSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3");
const swooshSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3");
clickSound.volume = 0.25;
swooshSound.volume = 0.35;

document.querySelectorAll('.btn, .close-modal, .navbar a').forEach(el => {
    el.addEventListener('click', () => { 
        clickSound.currentTime = 0; 
        clickSound.play().catch(e => {}); 
    });
});
const dmIcon = document.getElementById('dark-mode-icon');
if (dmIcon) {
    dmIcon.addEventListener('click', () => {
        swooshSound.currentTime = 0;
        swooshSound.play().catch(e => {});
    });
}

// 7. Interactive AJAX Contact Form & Confetti
const contactForm = document.getElementById('contact-form') || document.querySelector('.contact-form');
const formResult = document.getElementById('form-result');
const sendBtn = document.getElementById('send-btn') || document.querySelector('.send-btn');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('contact-name')?.value.trim() || 'Visitor';
        const emailInput = document.getElementById('contact-email')?.value.trim() || '';
        const subjectInput = document.getElementById('contact-subject')?.value.trim() || 'Portfolio Inquiry';
        const dateInput = document.getElementById('contact-date')?.value || '';
        const timeInput = document.getElementById('contact-time')?.value || '';
        const messageInput = document.getElementById('contact-message')?.value.trim() || '';
        const accessKeyInput = document.getElementById('access_key')?.value.trim() || '';

        // Helper: Trigger celebratory confetti
        const fireConfetti = () => {
            if (typeof confetti !== 'undefined') {
                var duration = 2.2 * 1000;
                var animationEnd = Date.now() + duration;
                var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999999, colors: ['#e63946', '#ff758f', '#2ecc71', '#ffffff'] };

                var interval = setInterval(function() {
                    var timeLeft = animationEnd - Date.now();
                    if (timeLeft <= 0) return clearInterval(interval);
                    var particleCount = 40 * (timeLeft / duration);
                    confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
                }, 220);
            }
        };

        // Construct pre-filled email links (Gmail & native Mailto)
        const emailBody = encodeURIComponent(
            `Name: ${nameInput}\nEmail: ${emailInput}\nPreferred Date/Time: ${dateInput || 'N/A'} ${timeInput || ''}\n\nMessage:\n${messageInput}`
        );
        const encodedSubject = encodeURIComponent(`[Portfolio Contact] ${subjectInput}`);
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=sarwanpandey75@gmail.com&su=${encodedSubject}&body=${emailBody}`;
        const mailtoUrl = `mailto:sarwanpandey75@gmail.com?subject=${encodedSubject}&body=${emailBody}`;

        // Case A: Access key is placeholder or default
        if (!accessKeyInput || accessKeyInput === 'YOUR_WEB3FORMS_ACCESS_KEY_HERE' || accessKeyInput === '26568aca-12db-4e23-8847-35ceeb629c11') {
            fireConfetti();
            if (formResult) {
                formResult.style.display = 'block';
                formResult.innerHTML = `
                    <div style="background: rgba(230, 57, 70, 0.08); border: 1.5px solid var(--main-color); color: var(--text-color); padding: 1.4rem; border-radius: 14px; text-align: center; margin-top: 1rem; box-shadow: 0 8px 25px rgba(230,57,70,0.12);">
                        <h4 style="color: var(--main-color); font-size: 1.15rem; margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: center; gap: 6px;">
                            <i class='bx bx-paper-plane'></i> Almost there! Send directly to Sarwan:
                        </h4>
                        <p style="font-size: 0.92rem; color: #555; margin-bottom: 1.2rem; line-height: 1.5;">
                            Click below to dispatch your message straight to <strong>sarwanpandey75@gmail.com</strong>:
                        </p>
                        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                            <a href="${gmailUrl}" target="_blank" class="btn" style="padding: 0.65rem 1.4rem; font-size: 0.9rem; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
                                <i class='bx bxl-google'></i> Open in Gmail
                            </a>
                            <a href="${mailtoUrl}" class="btn" style="padding: 0.65rem 1.4rem; font-size: 0.9rem; background: transparent; color: var(--main-color); border: 2px solid var(--main-color); text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
                                <i class='bx bx-envelope'></i> Default Email App
                            </a>
                        </div>
                        <div style="margin-top: 1rem; padding-top: 0.8rem; border-top: 1px dashed rgba(230,57,70,0.25); font-size: 0.82rem; color: #777;">
                            💡 <strong>Tip for Sarwan:</strong> To enable silent one-click background sending without email apps, generate your free key in 10s at <a href="https://web3forms.com" target="_blank" style="color: var(--main-color); text-decoration: underline;">web3forms.com</a> and paste it into <code>index.html</code>!
                        </div>
                    </div>
                `;
            }
            return;
        }

        // Case B: Access key is configured -> Send via AJAX without redirecting
        const originalBtnText = sendBtn ? sendBtn.innerHTML : 'Send Message';
        if (sendBtn) {
            sendBtn.disabled = true;
            sendBtn.innerHTML = 'Sending... <i class="bx bx-loader-alt bx-spin"></i>';
        }

        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const jsonBody = JSON.stringify(object);

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: jsonBody
            });

            const result = await response.json();

            if (response.status === 200 && result.success) {
                fireConfetti();
                if (formResult) {
                    formResult.style.display = 'block';
                    formResult.innerHTML = `
                        <div style="background: rgba(46, 204, 113, 0.12); border: 1.5px solid #2ecc71; color: var(--text-color); padding: 1.2rem; border-radius: 14px; text-align: center; margin-top: 1rem;">
                            <h4 style="color: #2ecc71; font-size: 1.2rem; margin-bottom: 0.3rem;">
                                <i class='bx bx-check-circle' style="vertical-align: middle;"></i> Message Sent Successfully!
                            </h4>
                            <p style="font-size: 0.95rem; color: #555;">
                                Thank you, <strong>${nameInput}</strong>! Your message has been routed to <strong>sarwanpandey75@gmail.com</strong>. Sarwan will get back to you shortly.
                            </p>
                        </div>
                    `;
                }
                contactForm.reset();
            } else {
                throw new Error(result.message || 'Transmission failed');
            }
        } catch (error) {
            console.error('Submission error:', error);
            if (formResult) {
                formResult.style.display = 'block';
                formResult.innerHTML = `
                    <div style="background: rgba(230, 57, 70, 0.08); border: 1.5px solid var(--main-color); padding: 1.2rem; border-radius: 14px; text-align: center; margin-top: 1rem;">
                        <p style="color: var(--main-color); font-weight: 600; margin-bottom: 0.4rem;"><i class='bx bx-error-circle'></i> Direct Send Alternative</p>
                        <p style="font-size: 0.9rem; color: #666; margin-bottom: 1rem;">Click below to send your pre-filled message directly to Sarwan:</p>
                        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                            <a href="${gmailUrl}" target="_blank" class="btn" style="padding: 0.6rem 1.4rem; font-size: 0.9rem; text-decoration: none;">Send via Gmail</a>
                            <a href="${mailtoUrl}" class="btn" style="padding: 0.6rem 1.4rem; font-size: 0.9rem; background: transparent; color: var(--main-color); border: 2px solid var(--main-color); text-decoration: none;">Open Mail App</a>
                        </div>
                    </div>
                `;
            }
        } finally {
            if (sendBtn) {
                sendBtn.disabled = false;
                sendBtn.innerHTML = originalBtnText;
            }
        }
    });
}

// 8. Dynamic Browser Tab
let docTitle = document.title;
window.addEventListener("blur", () => {
    document.title = "Come back! 🚀";
});
window.addEventListener("focus", () => {
    document.title = docTitle;
});

// 9. Custom Right-Click Menu
const customMenu = document.getElementById("custom-menu");
if (customMenu) {
    window.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        customMenu.style.display = "block";
        
        let x = e.pageX;
        let y = e.pageY;
        
        if (x + customMenu.offsetWidth > window.innerWidth) x = window.innerWidth - customMenu.offsetWidth - 10;
        if (y + customMenu.offsetHeight > window.innerHeight + window.scrollY) y = window.innerHeight + window.scrollY - customMenu.offsetHeight - 10;
        
        customMenu.style.left = x + "px";
        customMenu.style.top = y + "px";
    });
    window.addEventListener("click", () => {
        customMenu.style.display = "none";
    });
}

// 10. Developer Terminal Logic (`~` or '`')
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (e.target.id !== 'terminal-input') return;
    }
    if (e.key === '`' || e.key === '~') {
        e.preventDefault(); 
        const term = document.getElementById('dev-terminal');
        if (term) {
            term.style.display = (term.style.display === 'none' || term.style.display === '') ? 'flex' : 'none';
            if (term.style.display === 'flex') {
                const termInput = document.getElementById('terminal-input');
                if (termInput) termInput.focus();
            }
        }
    }
});

const termClose = document.getElementById('close-terminal');
if (termClose) {
    termClose.addEventListener('click', () => {
        document.getElementById('dev-terminal').style.display = 'none';
    });
}

const termInput = document.getElementById('terminal-input');
const termOutput = document.getElementById('terminal-output');
if (termInput) {
    termInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const cmd = termInput.value.trim().toLowerCase();
            termInput.value = '';
            
            let response = '';
            
            if (cmd === 'help') {
                response = 'Available commands:<br><br>- <b style="color:#e63946;">theme dark</b> | <b style="color:#e63946;">theme light</b> : Toggle website visual mode<br>- <b style="color:#e63946;">music play</b> | <b style="color:#e63946;">music pause</b> : Control ambient lofi beats<br>- <b style="color:#e63946;">goto [section]</b> : Navigate (e.g. <i>goto about, goto contact, goto projects</i>)<br>- <b style="color:#e63946;">matrix</b> : Trigger crimson digital rain protocol<br>- <b style="color:#e63946;">whoami</b> : Developer identity & bio<br>- <b style="color:#e63946;">ls</b> : List key project repositories & files<br>- <b style="color:#e63946;">cat resume.pdf</b> : Direct resume download link<br>- <b style="color:#e63946;">sudo hire sarwan</b> : Fast-track direct inquiry<br>- <b style="color:#e63946;">clear</b> : Clear terminal screen';
            } else if (cmd === 'theme dark') {
                document.body.classList.add('dark-mode');
                const ic = document.getElementById('dark-mode-icon');
                if (ic) ic.classList.replace('bx-moon', 'bx-sun');
                response = 'Theme changed to Dark Mode.';
            } else if (cmd === 'theme light') {
                document.body.classList.remove('dark-mode');
                const ic = document.getElementById('dark-mode-icon');
                if (ic) ic.classList.replace('bx-sun', 'bx-moon');
                response = 'Theme changed to Light Mode.';
            } else if (cmd === 'music play') {
                const audio = document.getElementById('bg-music');
                if (audio) { 
                    audio.play(); 
                    const mb = document.getElementById('music-bars');
                    if (mb) mb.style.display = 'flex'; 
                    response = 'Playing Lofi Beats... 🎵'; 
                }
            } else if (cmd === 'music pause') {
                const audio = document.getElementById('bg-music');
                if (audio) { 
                    audio.pause(); 
                    const mb = document.getElementById('music-bars');
                    if (mb) mb.style.display = 'none'; 
                    response = 'Music paused. 🛑'; 
                }
            } else if (cmd.startsWith('goto ')) {
                const section = cmd.split(' ')[1];
                const el = document.getElementById(section);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                    document.getElementById('dev-terminal').style.display = 'none';
                    response = `Navigating to ${section}...`;
                } else {
                    response = `Error: Section '${section}' not found. Try 'about', 'contact', 'testimonials'.`;
                }
            } else if (cmd === 'matrix') {
                if (typeof triggerMatrix === 'function') triggerMatrix();
                response = 'Initiating Crimson Matrix protocol...';
            } else if (cmd === 'whoami') {
                response = 'Sarwan Kumar Pandey - AI & ML Engineer, Computer Vision Specialist & Robotics Developer (Lucknow, India).';
            } else if (cmd === 'ls') {
                response = '<span style="color:#e63946;">face_id_studio.py</span>  <span style="color:#4ec9b0;">rag_pipeline.py</span>  <span style="color:#dcdcaa;">ros2_ws/</span>  <span style="color:#9cdcfe;">cifar10_cnn.py</span>  <span style="color:#c586c0;">rnn_benchmark.ipynb</span>  <span style="color:#ffb703;">resume.pdf</span>';
            } else if (cmd === 'cat resume.pdf') {
                response = 'Verified resume package ready: <a href="resume.pdf" target="_blank" style="color: #e63946; text-decoration: underline; font-weight: bold;">[Download Sarwan Kumar Pandey CV]</a>';
            } else if (cmd === 'sudo hire sarwan') {
                response = 'Access Granted. Redirecting to direct contact form...';
                setTimeout(() => window.location.href = '#contact', 1200);
            } else if (cmd === 'clear') {
                if (termOutput) termOutput.innerHTML = '';
                return;
            } else if (cmd !== '') {
                response = `sarwanos: command not found: ${cmd}. Type 'help' for available commands.`;
            }
            
            if (cmd !== '' && termOutput) {
                termOutput.innerHTML += `<div><span style="color: #569cd6;">sarwan@portfolio:~$</span> <span style="color:#fff;">${cmd}</span></div>`;
                termOutput.innerHTML += `<div style="margin-bottom: 12px; margin-top: 4px;">${response}</div>`;
            }
            
            const termBody = document.getElementById('terminal-body');
            if (termBody) termBody.scrollTop = termBody.scrollHeight;
        }
    });
}
