// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeScrollEffects();
    initializeContactForm();
    initializeKaomojiInteractions();
    initializeAnimations();
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('active')) {
            spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Reset hamburger animation
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll effects
function initializeScrollEffects() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Header background opacity based on scroll
        const opacity = Math.min(scrollTop / 100, 0.95);
        header.style.background = `rgba(255, 255, 255, ${opacity})`;
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.gallery-item, .feature-card, .kaomoji-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('すべてのフィールドを入力してください。', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('有効なメールアドレスを入力してください。', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = '送信中...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('メッセージが送信されました！ありがとうございます。', 'success');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 2rem',
        borderRadius: '10px',
        color: 'white',
        fontWeight: '600',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #f44336, #da190b)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Kaomoji interactions
function initializeKaomojiInteractions() {
    // Gallery item click to copy
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const kaomoji = this.querySelector('.gallery-kaomoji').textContent;
            copyToClipboard(kaomoji);
            showNotification(`${kaomoji} をクリップボードにコピーしました！`, 'success');
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Kaomoji showcase interactions
    const kaomojiItems = document.querySelectorAll('.kaomoji-item');
    kaomojiItems.forEach(item => {
        item.addEventListener('click', function() {
            const kaomoji = this.querySelector('.kaomoji').textContent;
            copyToClipboard(kaomoji);
            showNotification(`${kaomoji} をクリップボードにコピーしました！`, 'success');
        });
    });
    
    // Footer kaomoji interactions
    const footerKaomojis = document.querySelectorAll('.footer-kaomoji span');
    footerKaomojis.forEach(kaomoji => {
        kaomoji.addEventListener('click', function() {
            copyToClipboard(this.textContent);
            showNotification(`${this.textContent} をクリップボードにコピーしました！`, 'success');
        });
    });
    
    // Hero kaomoji animations
    const heroKaomojis = document.querySelectorAll('.kaomoji-large');
    heroKaomojis.forEach(kaomoji => {
        kaomoji.addEventListener('click', function() {
            copyToClipboard(this.textContent);
            showNotification(`${this.textContent} をクリップボードにコピーしました！`, 'success');
            
            // Special animation for hero kaomojis
            this.style.transform = 'scale(1.2) rotate(360deg)';
            setTimeout(() => {
                this.style.transform = '';
            }, 500);
        });
    });
}

// Copy to clipboard function
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API
        navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
        
        document.body.removeChild(textArea);
    }
}

// Initialize animations
function initializeAnimations() {
    // Add CSS for animation classes
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: slideInUp 0.6s ease-out forwards;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .notification {
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
    `;
    document.head.appendChild(style);
    
    // Random kaomoji generator for fun
    const randomKaomojis = [
        '(◕‿◕)', '(｡◕‿◕｡)', '(＾▽＾)', '(≧◡≦)', '(◡‿◡)',
        '(✿◠‿◠)', '(☆▽☆)', '(♥‿♥)', '(◕‿◕)♡', '(づ￣ ³￣)づ'
    ];
    
    // Add random kaomoji to page title periodically
    let originalTitle = document.title;
    setInterval(() => {
        const randomKaomoji = randomKaomojis[Math.floor(Math.random() * randomKaomojis.length)];
        document.title = `${randomKaomoji} ${originalTitle}`;
        
        setTimeout(() => {
            document.title = originalTitle;
        }, 2000);
    }, 10000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Press 'K' to show a random kaomoji notification
    if (e.key.toLowerCase() === 'k' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        const target = e.target;
        // Don't trigger if user is typing in an input field
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
            return;
        }
        
        const randomKaomojis = [
            '(◕‿◕)', '(｡◕‿◕｡)', '(＾▽＾)', '(≧◡≦)', '(◡‿◡)',
            '(✿◠‿◠)', '(☆▽☆)', '(♥‿♥)', '(◕‿◕)♡', '(づ￣ ³￣)づ'
        ];
        
        const randomKaomoji = randomKaomojis[Math.floor(Math.random() * randomKaomojis.length)];
        copyToClipboard(randomKaomoji);
        showNotification(`ランダム顔文字: ${randomKaomoji}`, 'info');
    }
});

// Performance optimization
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

// Optimize scroll events
const optimizedScrollHandler = debounce(function() {
    // Any additional scroll-based functionality can go here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Add loading state management
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add a subtle entrance animation to the main content
    const mainContent = document.querySelector('.main');
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            mainContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'translateY(0)';
        }, 100);
    }
});

// Error handling for any JavaScript errors
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Optionally show a user-friendly error message
    // showNotification('申し訳ございませんが、エラーが発生しました。', 'error');
});

// Service worker registration (for future PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service worker can be added later for offline functionality
        console.log('Service Worker support detected');
    });
}
