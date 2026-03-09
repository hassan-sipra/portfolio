// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', currentTheme);

// Update icon based on current theme
const updateThemeIcon = (theme) => {
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
};

// Initialize theme icon
updateThemeIcon(currentTheme);

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentTheme = body.getAttribute('data-theme');
    
    if (window.scrollY > 100) {
        if (currentTheme === 'dark') {
            navbar.style.background = 'rgba(15, 23, 42, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.4)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        }
    } else {
        if (currentTheme === 'dark') {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    }
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Skill bars animation
const skillBars = document.querySelectorAll('.skill-progress');

const animateSkillBars = () => {
    skillBars.forEach(bar => {
        const rect = bar.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !bar.classList.contains('animate')) {
            const width = bar.getAttribute('data-width');
            bar.style.setProperty('--target-width', width + '%');
            bar.classList.add('animate');
        }
    });
};

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .project-card, .achievement-card, .skill-item');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Counter animation for achievements
const counters = document.querySelectorAll('.achievement-card h3');
let hasAnimated = false;

const animateCounters = () => {
    if (hasAnimated) return;
    
    const achievementsSection = document.getElementById('achievements');
    const rect = achievementsSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isVisible) {
        hasAnimated = true;
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    setTimeout(updateCounter, 20);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }
};

// Contact form handling with Formspree
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form elements
        const nameInput = contactForm.querySelector('input[name="name"]');
        const emailInput = contactForm.querySelector('input[name="email"]');
        const subjectInput = contactForm.querySelector('input[name="subject"]');
        const messageInput = contactForm.querySelector('textarea[name="message"]');
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = subjectInput.value.trim();
        const message = messageInput.value.trim();
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            // Submit form to Formspree
            const formData = new FormData(contactForm);
            
            const response = await fetch('https://formspree.io/f/xrbylorn', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showNotification('Thank you for your message! I will get back to you soon.', 'success');
                contactForm.reset();
            } else {
                const data = await response.json();
                if (data.errors) {
                    showNotification('There was an error sending your message. Please try again.', 'error');
                } else {
                    showNotification('Thank you for your message! I will get back to you soon.', 'success');
                    contactForm.reset();
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('There was an error sending your message. Please try again.', 'error');
        } finally {
            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

// Download CV button functionality
const downloadBtn = document.querySelector('.btn-secondary');
if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
        // Create CV content based on the resume information
        const cvContent = createCVContent();
        downloadCV(cvContent);
    });
}

// Function to create CV content
function createCVContent() {
    const cvData = {
        name: "HASSAN SIPRA",
        title: "FULL STACK DEVELOPER",
        phone: "9099524991",
        email: "hassansipra42135@gmail.com",
        location: "Chhapi (Palanpur), Gujarat",
        about: "FULL STACK DEVELOPER WITH EXPERTISE IN JAVASCRIPT, REACT, NODE.JS, AND MYSQL. SKILLED IN BUILDING SCALABLE, USER-FRIENDLY APPLICATIONS WITH CLEAN AND EFFICIENT CODE. QUICK LEARNER AND PASSIONATE ABOUT NEW TECHNOLOGIES.",
        education: "HIGHER SECONDARY, MAHI HIGH SCHOOL, 2023",
        skills: ["HTML5", "CSS", "TAILWIND", "JAVASCRIPT", "REACT.JS", "NODE.JS", "EXPRESS.JS", "MYSQL", "GIT", "GITHUB"],
        experience: {
            company: "Valuda's Tech Park",
            position: "Full Stack Developer Intern",
            duration: "July 2024 - Present",
            responsibilities: [
                "Worked as a Full Stack Developer Intern focusing on React, Node.js, and MySQL.",
                "Developed and modified 5+ websites and created custom reusable components.",
                "My responsibilities included user authentication, CRUD operation, REST API development, security and frontend design with React.",
                "I have experience handling both frontend and backend development with database."
            ]
        },
        projects: [
            {
                name: "Ajva Motors",
                link: "LINK",
                tech: ["React.Js", "Node.Js", "Express.Js", "MySQL"],
                description: [
                    "Developed a business and information website for showcasing cars and company details.",
                    "Designed a responsive frontend in React.js and built a secure admin panel for content management."
                ]
            },
            {
                name: "E-Commerce - Web",
                tech: ["React.Js", "Node.Js", "Express.Js", "MySQL"],
                description: [
                    "Developed a full-stack online shopping platform with product catalog, cart, and checkout system.",
                    "Integrated Razorpay payment gateway for secure online transactions."
                ]
            },
            {
                name: "School - Web",
                tech: ["React.Js", "Node.Js", "Express.Js", "MySQL"],
                description: [
                    "Built a web-based school management system with modules for student admission, class & section management, and promotion.",
                    "Implemented JWT authentication for secure login and role-based access."
                ]
            }
        ]
    };
    
    return cvData;
}

// Function to download CV as PDF-like content
function downloadCV(cvData) {
    // Create a formatted text version of the CV
    let cvText = `
${cvData.name}
${cvData.title}

CONTACT INFORMATION:
Phone: ${cvData.phone}
Email: ${cvData.email}
Location: ${cvData.location}

ABOUT ME:
${cvData.about}

EDUCATION:
${cvData.education}

TECHNICAL SKILLS:
${cvData.skills.join(', ')}

WORK EXPERIENCE:
${cvData.experience.company} | ${cvData.experience.position}
${cvData.experience.duration}

Responsibilities:
${cvData.experience.responsibilities.map(resp => `• ${resp}`).join('\n')}

PROJECTS:
${cvData.projects.map(project => `
${project.name}${project.link ? ' | ' + project.link : ''}
Technology: ${project.tech.join(', ')}
Description:
${project.description.map(desc => `• ${desc}`).join('\n')}
`).join('\n')}

---
Generated on ${new Date().toLocaleDateString()}
    `;
    
    // Create and download the file
    const blob = new Blob([cvText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Hassan_Sipra_CV.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    // Show success message
    showNotification('CV downloaded successfully!', 'success');
}

// Function to show notifications
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Create notification content with icon
    const icon = getNotificationIcon(type);
    notification.innerHTML = `
        <div class="notification-content">
            <i class="notification-icon ${icon}"></i>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification styles
    const bgColor = getNotificationColor(type);
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 0;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 500;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 400px;
        min-width: 300px;
        backdrop-filter: blur(10px);
    `;
    
    // Add content styles
    const style = document.createElement('style');
    style.textContent = `
        .notification-content {
            display: flex;
            align-items: center;
            padding: 1rem 1.5rem;
            gap: 0.75rem;
        }
        .notification-icon {
            font-size: 1.2rem;
            flex-shrink: 0;
        }
        .notification-message {
            flex: 1;
            line-height: 1.4;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 4px;
            opacity: 0.7;
            transition: opacity 0.2s ease;
            flex-shrink: 0;
        }
        .notification-close:hover {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Helper functions for notifications
function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return 'fas fa-check-circle';
        case 'error':
            return 'fas fa-exclamation-circle';
        case 'warning':
            return 'fas fa-exclamation-triangle';
        default:
            return 'fas fa-info-circle';
    }
}

function getNotificationColor(type) {
    switch (type) {
        case 'success':
            return '#10b981';
        case 'error':
            return '#ef4444';
        case 'warning':
            return '#f59e0b';
        default:
            return '#3b82f6';
    }
}

// Hire Me button functionality
const hireBtn = document.querySelector('.btn-primary');
if (hireBtn && hireBtn.textContent === 'Hire Me') {
    hireBtn.addEventListener('click', () => {
        // Scroll to contact section
        document.getElementById('contact').scrollIntoView({
            behavior: 'smooth'
        });
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Typing effect for hero title (optional enhancement)
const typeWriter = (element, text, speed = 100) => {
    let i = 0;
    element.innerHTML = '';
    
    const type = () => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };
    
    type();
};

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 100);
    }
});

// Add scroll event listeners
window.addEventListener('scroll', () => {
    animateSkillBars();
    animateCounters();
});

// Initialize animations on page load
window.addEventListener('load', () => {
    animateSkillBars();
    animateCounters();
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add hover effects for project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click effects for buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .nav-link.active {
        color: #2563eb !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);
