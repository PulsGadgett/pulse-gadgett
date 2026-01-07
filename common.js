// ==================== انیمیشن‌های مشترک برای تمام صفحات ====================

// ==================== توابع انیمیشن پایه ====================

// فعال‌سازی انیمیشن هنگام اسکرول
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    if (!animatedElements.length) return;
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                        
                        // انیمیشن برای فرزندان با تأخیر پلکانی
                        const children = entry.target.querySelectorAll('[data-child-animate]');
                        children.forEach((child, index) => {
                            setTimeout(() => {
                                child.classList.add('animate');
                            }, index * 150);
                        });
                    }, parseInt(delay));
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Fallback برای مرورگرهای قدیمی
        animatedElements.forEach(el => el.classList.add('animate'));
    }
}

// افکت موج برای دکمه‌ها
function addRippleEffect(element) {
    if (!element || element.classList.contains('ripple-added')) return;
    
    element.classList.add('ripple-added');
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    
    element.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.7);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            top: ${y}px;
            left: ${x}px;
            pointer-events: none;
            z-index: 1;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
}

// اعمال افکت موج روی تمام دکمه‌ها
function initRippleEffects() {
    const rippleElements = document.querySelectorAll('.btn-ripple, button:not(.no-ripple), .btn, .action-btn');
    
    rippleElements.forEach(element => {
        if (!element.disabled && !element.classList.contains('no-ripple')) {
            addRippleEffect(element);
        }
    });
}

// افکت hover برای کارت‌ها
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.hover-card, .feature-card, .service-card, .team-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 20px 40px rgba(255, 107, 74, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
}

// تبدیل HEX به RGB (اگر نیاز بود)
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
        : '255, 107, 74';
}

// ==================== انیمیشن‌های ورود صفحه ====================

// افکت ورود پلکانی
function initPageEntrance() {
    // هدر
    const header = document.querySelector('.site-header');
    if (header) {
        header.style.opacity = '0';
        header.style.transform = 'translateY(-30px)';
        
        setTimeout(() => {
            header.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            header.style.opacity = '1';
            header.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // محتوای اصلی
    const mainContent = document.querySelector('main, .main-content');
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            mainContent.style.transition = 'all 0.6s ease 0.3s';
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // فوتر
    const footer = document.querySelector('.site-footer');
    if (footer) {
        footer.style.opacity = '0';
        
        setTimeout(() => {
            footer.style.transition = 'opacity 0.6s ease 0.8s';
            footer.style.opacity = '1';
        }, 800);
    }
}

// ==================== نوتیفیکیشن مشترک ====================

function showCommonNotification(message, type = 'info', duration = 3000) {
    // حذف نوتیفیکیشن قبلی
    const existing = document.querySelector('.site-notification');
    if (existing) {
        existing.classList.add('fade-out');
        setTimeout(() => existing.remove(), 300);
    }
    
    // ایجاد نوتیفیکیشن جدید
    const notification = document.createElement('div');
    notification.className = `site-notification notification-${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icons[type] || icons.info}</span>
            <span class="notification-text">${message}</span>
        </div>
        <div class="notification-progress"></div>
    `;
    
    document.body.appendChild(notification);
    
    // انیمیشن نوار پیشرفت
    const progress = notification.querySelector('.notification-progress');
    if (progress) {
        progress.style.animation = `notificationProgress ${duration}ms linear`;
    }
    
    // حذف خودکار
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// ==================== ناوبری متحرک ====================

// منوی فعال
function initActiveNav() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link, .main-nav a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        if (currentPath.includes(linkPath) || 
            (currentPath === '/' && linkPath === 'index.html') ||
            (linkPath !== 'index.html' && currentPath.includes(linkPath.replace('.html', '')))) {
            
            link.classList.add('active');
            
            // افکت پالس برای لینک فعال
            const intervalId = setInterval(() => {
                if (document.body.contains(link)) {
                    link.classList.toggle('pulse-subtle');
                } else {
                    clearInterval(intervalId);
                }
            }, 3000);
        }
        
        // افکت hover
        link.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// ==================== انیمیشن‌های متن ====================

// افکت تایپ برای عناوین - نسخه ایمن و ساده
function initTypewriterEffects() {
    console.log('🔤 راه‌اندازی افکت تایپ‌نویس...');
    
    const typeElements = document.querySelectorAll('[data-typewriter]');
    if (!typeElements.length) return;
    
    typeElements.forEach((element, index) => {
        // تأخیر پلکانی
        setTimeout(() => {
            safeTypewriterEffect(element);
        }, index * 300);
    });
}

// تابع ایمن برای افکت تایپ
function safeTypewriterEffect(element) {
    if (!element || !document.body.contains(element)) return;
    
    try {
        const originalText = element.textContent || element.innerText;
        if (!originalText.trim()) return;
        
        // ذخیره متن اصلی
        element.dataset.originalText = originalText;
        
        // پاک کردن محتوا
        element.innerHTML = '';
        
        // ایجاد کانتینر برای متن
        const textSpan = document.createElement('span');
        textSpan.className = 'typing-text';
        element.appendChild(textSpan);
        
        // ایجاد کرسور
        const cursorSpan = document.createElement('span');
        cursorSpan.className = 'typing-cursor';
        cursorSpan.textContent = '|';
        cursorSpan.style.cssText = `
            display: inline-block;
            animation: blink 1s infinite;
            margin-right: 2px;
            color: #FF6B4A;
            font-weight: bold;
        `;
        element.appendChild(cursorSpan);
        
        // تنظیم سرعت
        const speed = parseInt(element.dataset.speed) || 60;
        const variation = 20;
        
        let charIndex = 0;
        
        function typeNextChar() {
            if (!document.body.contains(element)) return;
            
            if (charIndex < originalText.length) {
                textSpan.textContent += originalText.charAt(charIndex);
                charIndex++;
                
                const nextSpeed = speed + (Math.random() * variation - variation/2);
                setTimeout(typeNextChar, nextSpeed);
            } else {
                setTimeout(() => {
                    if (cursorSpan && cursorSpan.parentNode) {
                        cursorSpan.style.animation = 'none';
                        cursorSpan.style.opacity = '0';
                        cursorSpan.style.transition = 'opacity 0.3s ease';
                        
                        setTimeout(() => {
                            if (cursorSpan.parentNode) cursorSpan.remove();
                        }, 300);
                    }
                }, 800);
            }
        }
        
        // شروع تایپ
        setTimeout(typeNextChar, 500);
        
    } catch (error) {
        console.error('خطا در افکت تایپ:', error);
        // بازیابی متن اصلی در صورت خطا
        if (element && element.dataset.originalText) {
            element.textContent = element.dataset.originalText;
        }
    }
}

// افکت شمارش برای اعداد
function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-counter]');
    
    if (!counters.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target) || 100;
                const duration = parseInt(counter.dataset.duration) || 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.floor(current).toLocaleString('fa-IR');
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString('fa-IR');
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// ==================== انیمیشن‌های فرم ====================

// افکت فوکوس برای فیلدهای فرم
function initFormAnimations() {
    const formInputs = document.querySelectorAll('input, textarea, select');
    
    formInputs.forEach(input => {
        // افکت فوکوس
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            this.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            this.style.transform = '';
        });
        
        // افکت اعتبارسنجی
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });
    
    // افکت ارسال فرم
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('[type="submit"]');
            if (submitBtn) {
                submitBtn.classList.add('submitting');
                submitBtn.innerHTML = '<span class="btn-loader"></span> در حال ارسال...';
            }
        });
    });
}

// ==================== انیمیشن‌های تصاویر ====================

// افکت لودینگ تصاویر
function initImageAnimations() {
    const images = document.querySelectorAll('img[data-lazy]');
    
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transform = 'scale(0.95)';
        img.style.transition = 'all 0.5s ease';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src || img.dataset.lazy;
                    
                    if (src) {
                        img.src = src;
                        img.onload = () => {
                            img.style.opacity = '1';
                            img.style.transform = 'scale(1)';
                        };
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(img);
    });
}

// ==================== افکت‌های پس‌زمینه ====================

// گرادیانت متحرک
function initAnimatedBackgrounds() {
    const gradientElements = document.querySelectorAll('.animated-bg, .gradient-bg');
    
    gradientElements.forEach(element => {
        element.style.background = `linear-gradient(-45deg, 
            #FF6B4A20, 
            #00C9B120, 
            #8A6BFF20, 
            #FFD16620
        )`;
        element.style.backgroundSize = '400% 400%';
        element.style.animation = 'gradientShift 15s ease infinite';
    });
}

// ==================== تابع مقداردهی اولیه ====================

function initAllAnimations() {
    console.log('✨ راه‌اندازی انیمیشن‌های مشترک PulseGadgett...');
    
    // انیمیشن‌های اصلی
    initScrollAnimations();
    initRippleEffects();
    initCardHoverEffects();
    initPageEntrance();
    initActiveNav();
    
    // انیمیشن‌های ویژه
    initTypewriterEffects();
    initCounterAnimations();
    initFormAnimations();
    initImageAnimations();
    initAnimatedBackgrounds();
    
    // اعمال استایل‌های CSS
    injectAnimationStyles();
    
    console.log('✅ انیمیشن‌های مشترک راه‌اندازی شدند!');
}

// ==================== تزریق استایل‌های CSS ====================

function injectAnimationStyles() {
    if (document.querySelector('#pulse-common-animations-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'pulse-common-animations-styles';
    
    styles.textContent = `
        /* انیمیشن‌های مشترک */
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInLeft {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fadeInRight {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes ripple-animation {
            to { transform: scale(4); opacity: 0; }
        }
        
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
        
        @keyframes notificationProgress {
            from { width: 100%; }
            to { width: 0%; }
        }
        
        @keyframes pulse-subtle {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        @keyframes btn-loader {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* کلاس‌های انیمیشن مشترک */
        [data-animate] {
            opacity: 0;
        }
        
        [data-animate].animate {
            animation-fill-mode: both;
        }
        
        .animate-fade-up {
            animation: fadeInUp 0.6s ease-out;
        }
        
        .animate-fade-left {
            animation: fadeInLeft 0.6s ease-out;
        }
        
        .animate-fade-right {
            animation: fadeInRight 0.6s ease-out;
        }
        
        .animate-delay-100 { animation-delay: 0.1s; }
        .animate-delay-200 { animation-delay: 0.2s; }
        .animate-delay-300 { animation-delay: 0.3s; }
        .animate-delay-500 { animation-delay: 0.5s; }
        
        /* نوتیفیکیشن مشترک */
        .site-notification {
            position: fixed;
            top: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            padding: 16px 24px;
            border-radius: 12px;
            color: white;
            font-weight: 600;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            animation: notificationSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
            overflow: hidden;
            max-width: 90%;
            width: auto;
            min-width: 300px;
        }
        
        @keyframes notificationSlideIn {
            from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        
        .site-notification.fade-out {
            animation: notificationSlideOut 0.3s ease forwards;
        }
        
        @keyframes notificationSlideOut {
            to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 2;
        }
        
        .notification-icon {
            font-size: 20px;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }
        
        .notification-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: rgba(255,255,255,0.5);
            border-radius: 0 0 12px 12px;
        }
        
        /* رنگ نوتیفیکیشن‌ها با پالت اصلی */
        .notification-success { 
            background: linear-gradient(135deg, #00C9B1, #00C9B1cc);
        }
        .notification-error { 
            background: linear-gradient(135deg, #FF6B4A, #FF6B4Acc);
        }
        .notification-warning { 
            background: linear-gradient(135deg, #FFD166, #FFD166cc);
            color: #3A2D28;
        }
        .notification-info { 
            background: linear-gradient(135deg, #8A6BFF, #8A6BFFcc);
        }
        
        /* لینک فعال */
        .nav-link.active {
            position: relative;
        }
        
        .nav-link.active::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 50%;
            transform: translateX(-50%);
            width: 30px;
            height: 3px;
            background: #FF6B4A;
            border-radius: 2px;
            animation: pulse-subtle 2s infinite;
        }
        
        .pulse-subtle {
            animation: pulse-subtle 2s infinite;
        }
        
        /* لودر دکمه */
        .btn-loader {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: btn-loader 0.8s linear infinite;
            margin-left: 8px;
        }
        
        .submitting .btn-loader {
            display: inline-block;
        }
        
        /* کارت‌های hover */
        .hover-card {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .hover-card:hover {
            transform: translateY(-10px) scale(1.02);
            box-shadow: 0 20px 40px rgba(255, 107, 74, 0.15);
        }
        
        /* انیمیشن شناور */
        .float-animation {
            animation: float 3s ease-in-out infinite;
        }
        
        /* فرم */
        .focused label {
            color: #FF6B4A;
            transform: translateY(-20px) scale(0.9);
        }
        
        .has-value {
            border-color: #00C9B1 !important;
        }
        
        /* تایپ‌نویس */
        .typing-cursor {
            animation: blink 1s infinite;
        }
        
        /* بهینه‌سازی */
        .will-change {
            will-change: transform, opacity;
        }
        
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    
    document.head.appendChild(styles);
}

// ==================== مقداردهی اولیه ====================

// اجرا پس از بارگذاری کامل صفحه
document.addEventListener('DOMContentLoaded', initAllAnimations);

// برای دسترسی از صفحات دیگر
window.PulseCommonAnimations = {
    initAllAnimations,
    showCommonNotification,
    initScrollAnimations,
    initRippleEffects,
    initTypewriterEffects,
    initCounterAnimations
};

console.log('📦 کتابخانه انیمیشن‌های مشترک PulseGadgett بارگذاری شد');
