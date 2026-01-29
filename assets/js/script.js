document.addEventListener('DOMContentLoaded', () => {
    /* =========================================
       Theme Switcher Logic
       ========================================= */
    const themeBtn = document.getElementById('theme-toggle');
    const themeMenu = document.getElementById('theme-menu');
    const themeIcon = document.getElementById('theme-icon');
    const themeOptions = document.querySelectorAll('[data-set-theme]');
    const htmlElement = document.documentElement;

    // 1. Load saved theme or default to system
    const savedTheme = localStorage.getItem('theme') || 'system';
    applyTheme(savedTheme);

    // 2. Toggle Menu Visibility
    themeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        themeMenu.classList.toggle('active');
    });

    // 3. Handle specific theme selection
    themeOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedTheme = btn.getAttribute('data-set-theme');
            applyTheme(selectedTheme);
            localStorage.setItem('theme', selectedTheme);
            themeMenu.classList.remove('active');
        });
    });

    // 4. Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!themeMenu.contains(e.target) && !themeBtn.contains(e.target)) {
            themeMenu.classList.remove('active');
        }
    });

    // 5. System preference listener
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (localStorage.getItem('theme') === 'system') {
            applyTheme('system');
        }
    });

    function applyTheme(theme) {
        let isDark = false;

        if (theme === 'system') {
            isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            updateIcon('system');
        } else if (theme === 'dark') {
            isDark = true;
            updateIcon('dark');
        } else {
            isDark = false;
            updateIcon('light');
        }

        if (isDark) {
            htmlElement.setAttribute('data-theme', 'dark');
        } else {
            htmlElement.removeAttribute('data-theme');
        }
    }

    function updateIcon(theme) {
        // Change the main button icon based on selection
        themeIcon.className = ''; // reset
        if (theme === 'system') {
            themeIcon.classList.add('ri-computer-line');
        } else if (theme === 'dark') {
            themeIcon.classList.add('ri-moon-line');
        } else {
            themeIcon.classList.add('ri-sun-line');
        }
    }

/* ...existing code... */
    /* =========================================
       Mobile Navigation
       ========================================= */
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle icon
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('ri-menu-4-line');
                icon.classList.add('ri-close-line');
            } else {
                icon.classList.add('ri-menu-4-line');
                icon.classList.remove('ri-close-line');
            }
        });

        // Close mobile menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                icon.classList.add('ri-menu-4-line');
                icon.classList.remove('ri-close-line');
            });
        });
    }

    /* =========================================
       Contact Form (EmailJS)
       ========================================= */
    // Initialize EmailJS (Replace with your actual Public Key)
    // You can find this in EmailJS Dashboard -> Account -> API Keys
    emailjs.init("SjuUt62txy3p1NaMK"); 

    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = btn.innerText;
            
            // 1. Gather form data
            // NOTE: Make sure your EmailJS template variables match these names or Update them
            const templateParams = {
                from_name: document.getElementById('name').value,
                from_email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            // Basic Validation
            if (!templateParams.from_name || !templateParams.from_email || !templateParams.message) {
                showNotification('error', 'Missing Info', 'Please fill in all fields.');
                return;
            }

            // 2. Change button state
            btn.innerText = 'Sending...';
            btn.disabled = true;

            // 3. Send Email
            // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with actual values from EmailJS
            emailjs.send('service_okc0q1p', 'template_avlzuqj', templateParams)
                .then(function() {
                    btn.innerText = 'Message Sent!';
                    contactForm.reset();
                    showNotification('success', 'Message Sent!', 'I will get back to you shortly.');
                    setTimeout(() => {
                        btn.innerText = originalBtnText;
                        btn.disabled = false;
                    }, 3000);
                }, function(error) {
                    console.error('FAILED...', error);
                    btn.innerText = 'Failed. Try Again.';
                    showNotification('error', 'Delivery Failed', 'Something went wrong. Please try again.');
                    setTimeout(() => {
                        btn.innerText = originalBtnText;
                        btn.disabled = false;
                    }, 3000);
                });
        });
    }

    /* =========================================
       Notification Popup Logic
       ========================================= */
    const notificationPopup = document.getElementById('notification-popup');
    const notificationIcon = document.getElementById('notification-icon-symbol');
    const notificationTitle = document.getElementById('notification-title');
    const notificationMsg = document.getElementById('notification-message');
    const notificationClose = document.getElementById('notification-close');
    const notificationProgress = document.querySelector('.notification-progress');
    let notificationTimeout;

    if (notificationClose) {
        notificationClose.addEventListener('click', () => {
            notificationPopup.classList.remove('active');
            clearTimeout(notificationTimeout);
        });
    }

    function showNotification(type, title, message) {
        if (!notificationPopup) return;

        // Reset
        notificationPopup.classList.remove('active');
        clearTimeout(notificationTimeout);
        
        // Update Content
        notificationTitle.textContent = title;
        notificationMsg.textContent = message;

        // Update Icon & Styles
        if (type === 'success') {
            notificationIcon.className = 'ri-checkbox-circle-fill';
            notificationIcon.parentElement.className = 'notification-icon success';
        } else {
            notificationIcon.className = 'ri-error-warning-fill';
            notificationIcon.parentElement.className = 'notification-icon error';
        }

        // Show Popup (slight delay to allow reset if clicked rapidly)
        setTimeout(() => {
            notificationPopup.classList.add('active');
            
            // Handle Progress Bar Animation via CSS transition
            notificationProgress.style.transition = 'none';
            // notificationProgress.style.width = '0'; // (Optional logic if we were animating width directly)
            
            // Auto Hide after 5 seconds
            notificationTimeout = setTimeout(() => {
                notificationPopup.classList.remove('active');
            }, 5000);
        }, 10);
    }


    /* =========================================
       Smooth Scroll for Anchor Links (Optional Polish)
       ========================================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    /* =========================================
       Typewriter Effect
       ========================================= */
    const typewriterElement = document.getElementById('typewriter');
    const phrases = ["Student", "Problem Solver", "Contributor", "Open Source Enthusiast"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // Faster when deleting
        } else {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100; // Normal typing speed
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            // Finished typing phrase, pause before deleting
            isDeleting = true;
            typeSpeed = 2000; 
        } else if (isDeleting && charIndex === 0) {
            // Finished deleting, move to next phrase
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    if (typewriterElement) {
        type();
    }
});
