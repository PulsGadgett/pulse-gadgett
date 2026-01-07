// ==================== بهینه‌سازی‌های نهایی برای انیمیشن‌ها ====================

// فعال‌سازی اسکرول انیمیشن با عملکرد بهتر
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target); // فقط یکبار اجرا شود
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -10px 0px'
        });
        
        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Fallback برای مرورگرهای قدیمی
        animatedElements.forEach(el => el.classList.add('animate'));
    }
}

// افکت پرتاب به سبد خرید بهبود یافته
function addThrowToCartEffect(button, productCard) {
    button.addEventListener('click', function() {
        const cardRect = productCard.getBoundingClientRect();
        const cartIcon = document.getElementById('cartIcon');
        const cartRect = cartIcon.getBoundingClientRect();
        
        // ایجاد المنت پرتابی با استایل CSS
        const throwElement = document.createElement('div');
        throwElement.className = 'throw-to-cart-animation';
        throwElement.innerHTML = `
            <div class="throw-dot"></div>
            <div class="throw-trail"></div>
        `;
        
        document.body.appendChild(throwElement);
        
        // تنظیم موقعیت اولیه
        const throwDot = throwElement.querySelector('.throw-dot');
        throwDot.style.left = `${cardRect.left + cardRect.width/2}px`;
        throwDot.style.top = `${cardRect.top + cardRect.height/2}px`;
        
        // انیمیشن پرتاب
        const animation = throwDot.animate([
            {
                left: `${cardRect.left + cardRect.width/2}px`,
                top: `${cardRect.top + cardRect.height/2}px`,
                transform: 'translate(-50%, -50%) scale(1)',
                opacity: 1
            },
            {
                left: `${cartRect.left + cartRect.width/2}px`,
                top: `${cartRect.top + cartRect.height/2}px`,
                transform: 'translate(-50%, -50%) scale(0.5)',
                opacity: 0.7
            }
        ], {
            duration: 700,
            easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        });
        
        // انیمیشن دنباله
        const trail = throwElement.querySelector('.throw-trail');
        const trailAnimation = trail.animate([
            { width: '0px', opacity: 0.8 },
            { width: `${Math.hypot(cartRect.left - cardRect.left, cartRect.top - cardRect.top)}px`, opacity: 0 }
        ], {
            duration: 700,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => {
            // افکت ضربه به سبد خرید
            cartIcon.classList.add('cart-bump');
            setTimeout(() => {
                cartIcon.classList.remove('cart-bump');
            }, 300);
            
            // پاکسازی
            setTimeout(() => throwElement.remove(), 100);
        };
    });
}

// بهبود افکت‌ها روی کارت محصولات
function enhanceProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
        // تأخیر انیمیشن پلکانی
        card.style.animationDelay = `${index * 0.07}s`;
        card.style.animationFillMode = 'both';
        
        // افکت پرتاب به سبد خرید
        const addButton = card.querySelector('.add-to-cart-btn');
        if (addButton) {
            addThrowToCartEffect(addButton, card);
            
            // افکت کلیک روی دکمه
            addButton.addEventListener('click', function() {
                this.classList.add('click-effect');
                setTimeout(() => this.classList.remove('click-effect'), 300);
            });
        }
        
        // افکت hover 3D بهبود یافته
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '100';
            this.classList.add('card-hovered');
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '';
            this.classList.remove('card-hovered');
        });
        
        // افکت حرکت ماوس برای جلوه 3D
        card.addEventListener('mousemove', function(e) {
            if (!this.classList.contains('card-hovered')) return;
            
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;
            
            this.style.transform = `
                translateY(-15px) 
                scale(1.03) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
            `;
        });
    });
}

// افکت تایپ‌نویس بهبود یافته با کرسور چشمک‌زن
function typeWriterEffect(element, text, speed = 70) {
    if (!element || !text) return;
    
    let i = 0;
    const originalText = element.textContent;
    element.textContent = '';
    element.style.position = 'relative';
    
    // ایجاد کرسور چشمک‌زن
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.textContent = '|';
    cursor.style.animation = 'blink 1s infinite';
    element.appendChild(cursor);
    
    function type() {
        if (i < text.length) {
            cursor.insertAdjacentHTML('beforebegin', text.charAt(i));
            i++;
            
            // افکت صدا (اختیاری)
            if (i % 3 === 0) {
                playTypeSound();
            }
            
            setTimeout(type, speed + Math.random() * 30); // تغییر سرعت طبیعی
        } else {
            // حذف کرسور پس از اتمام
            setTimeout(() => cursor.remove(), 500);
        }
    }
    
    type();
}

// صدای تایپ (اختیاری)
function playTypeSound() {
    // می‌توانید از Web Audio API برای صدای واقعی استفاده کنید
    // این یک پیاده‌سازی ساده است
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800 + Math.random() * 400;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // مرورگر از Web Audio API پشتیبانی نمی‌کند
        console.log('Web Audio API not supported');
    }
}

// افکت موج برای دکمه‌ها
function addRippleEffect(element) {
    element.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
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
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
}

// انیمیشن برای دکمه‌های دسته‌بندی
function enhanceCategoryButtons() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach((btn, index) => {
        // تأخیر انیمیشن پلکانی
        btn.style.animationDelay = `${index * 0.05}s`;
        
        // افکت موج
        addRippleEffect(btn);
        
        // افکت hover
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = '';
            }
        });
    });
}

// انیمیشن برای ورود صفحه
function initPageEntranceAnimations() {
    // افکت برای هدر
    const header = document.querySelector('.site-header');
    if (header) {
        header.style.opacity = '0';
        header.style.transform = 'translateY(-30px)';
        
        setTimeout(() => {
            header.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            header.style.opacity = '1';
            header.style.transform = 'translateY(0)';
        }, 200);
    }
    
    // افکت برای دسته‌بندی‌ها
    const categories = document.querySelector('.categories');
    if (categories) {
        categories.style.opacity = '0';
        
        setTimeout(() => {
            categories.style.transition = 'opacity 0.6s ease 0.3s';
            categories.style.opacity = '1';
        }, 500);
    }
    
    // افکت برای عنوان سایت
    const siteTitle = document.querySelector('.site-title');
    if (siteTitle && !siteTitle.dataset.animated) {
        siteTitle.dataset.animated = 'true';
        setTimeout(() => {
            typeWriterEffect(siteTitle, siteTitle.textContent, 60);
        }, 800);
    }
}

// بهبود نمایش نوتیفیکیشن
function showEnhancedNotification(message, type = 'success', duration = 2500) {
    // حذف نوتیفیکیشن قبلی
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.classList.add('fade-out');
        setTimeout(() => existingNotification.remove(), 300);
    }
    
    // ایجاد نوتیفیکیشن جدید
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'info' ? 'ℹ️' : '❌'}</span>
            <span class="notification-text">${message}</span>
        </div>
        <div class="notification-progress"></div>
    `;
    
    document.body.appendChild(notification);
    
    // انیمیشن پیشرفت
    const progress = notification.querySelector('.notification-progress');
    if (progress) {
        progress.style.animation = `progress ${duration}ms linear`;
    }
    
    // حذف خودکار
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, duration);
}

// جایگزینی تابع نوتیفیکیشن اصلی
const originalShowNotification = showNotification;
showNotification = showEnhancedNotification;

// ==================== CSS اضافی برای انیمیشن‌های جدید ====================

const enhancedAnimationStyles = document.createElement('style');
enhancedAnimationStyles.textContent = `
    /* انیمیشن‌های پیشرفته */
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }
    
    @keyframes progress {
        from { width: 100%; }
        to { width: 0%; }
    }
    
    @keyframes cart-bump {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    
    /* استایل‌های نوتیفیکیشن پیشرفته */
    .notification {
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
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    .notification.fade-out {
        animation: notificationSlideOut 0.3s ease forwards;
    }
    
    @keyframes notificationSlideOut {
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
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
    
    /* استایل‌های پرتاب به سبد خرید */
    .throw-to-cart-animation {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9998;
    }
    
    .throw-dot {
        position: absolute;
        width: 20px;
        height: 20px;
        background: var(--primary);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 20px rgba(255,107,74,0.8);
        filter: blur(1px);
    }
    
    .throw-trail {
        position: absolute;
        height: 3px;
        background: linear-gradient(90deg, var(--primary), transparent);
        transform-origin: left center;
        border-radius: 2px;
        opacity: 0;
    }
    
    /* افکت‌های دکمه */
    .click-effect {
        animation: click-pulse 0.3s ease;
    }
    
    @keyframes click-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(0.95); }
        100% { transform: scale(1); }
    }
    
    .cart-bump {
        animation: cart-bump 0.3s ease;
    }
    
    /* کارت hover شده */
    .card-hovered {
        transition: transform 0.2s ease-out !important;
    }
    
    /* تایپ‌نویس */
    .typewriter-cursor {
        display: inline-block;
        margin-right: 2px;
        color: var(--primary);
        font-weight: bold;
    }
    
    /* رنگ‌بندی نوتیفیکیشن‌ها با پالت شما */
    .notification.success { 
        background: linear-gradient(135deg, var(--success), rgba(0, 201, 177, 0.9)); 
    }
    .notification.warning { 
        background: linear-gradient(135deg, var(--warning), rgba(255, 209, 102, 0.9));
        color: var(--text);
    }
    .notification.info { 
        background: linear-gradient(135deg, var(--accent), rgba(138, 107, 255, 0.9)); 
    }
    .notification.error { 
        background: linear-gradient(135deg, var(--error), rgba(255, 107, 74, 0.9)); 
    }
    
    /* بهینه‌سازی عملکرد */
    .will-change {
        will-change: transform, opacity;
    }
    
    /* کاهش حرکت برای کاربران حساس */
    @media (prefers-reduced-motion: reduce) {
        .notification,
        .throw-to-cart-animation,
        .click-effect,
        .cart-bump {
            animation: none !important;
            transition: none !important;
        }
    }
`;

document.head.appendChild(enhancedAnimationStyles);

// ==================== به‌روزرسانی مقداردهی اولیه ====================

// جایگزینی تابع DOMContentLoaded اصلی
const originalDOMContentLoaded = () => {
    console.log('🚀 PulseGadgett در حال بارگذاری با انیمیشن‌های پیشرفته...');
    
    // بررسی وجود داده‌های محصول
    if (typeof products !== 'undefined' && Array.isArray(products)) {
        createCategoryButtons();
        displayProducts(products);
        updateCartDisplay();
        initializeEventListeners();
        
        // انیمیشن‌های پیشرفته
        initScrollAnimations();
        enhanceProductCards();
        enhanceCategoryButtons();
        initPageEntranceAnimations();
        
        console.log('✅ سایت با انیمیشن‌های پیشرفته بارگذاری شد');
    } else {
        console.error('❌ داده‌های محصول یافت نشد!');
        showEnhancedNotification('خطا در بارگذاری محصولات. لطفاً صفحه را refresh کنید.', 'error');
    }
};

// حذف event listener قبلی اگر وجود دارد
document.removeEventListener('DOMContentLoaded', originalDOMContentLoaded);
document.addEventListener('DOMContentLoaded', originalDOMContentLoaded);

// ==================== توابع گلوبال جدید ====================

window.addRippleEffect = addRippleEffect;
window.enhanceProductCards = enhanceProductCards;
window.initScrollAnimations = initScrollAnimations;

// پیام خوشامدگویی هنگام بارگذاری
window.addEventListener('load', () => {
    setTimeout(() => {
        showEnhancedNotification('🛒 به PulseGadgett خوش آمدید!', 'info', 2000);
    }, 1000);
});

// بهبود عملکرد هنگام تغییر اندازه پنجره
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // تنظیم مجدد انیمیشن‌ها
        document.querySelectorAll('.product-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.07}s`;
        });
    }, 250);
});

// اضافه کردن افکت موج به دکمه‌های مهم
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const importantButtons = [
            '.cart-button',
            '.checkout-btn',
            '.search-btn',
            '.support-btn'
        ];
        
        importantButtons.forEach(selector => {
            document.querySelectorAll(selector).forEach(btn => {
                addRippleEffect(btn);
            });
        });
    }, 1000);
});

// ==================== بهبود تجربه کاربری ====================

// نمایش وضعیت بارگذاری
function showLoadingState() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner-dot"></div>
            <div class="spinner-dot"></div>
            <div class="spinner-dot"></div>
        </div>
        <p>در حال بارگذاری...</p>
    `;
    
    document.body.appendChild(loadingOverlay);
    
    return {
        hide: () => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => loadingOverlay.remove(), 300);
        }
    };
}

// CSS برای loading overlay
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 249, 240, 0.95);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 99999;
        transition: opacity 0.3s ease;
    }
    
    .loading-spinner {
        display: flex;
        gap: 8px;
        margin-bottom: 20px;
    }
    
    .spinner-dot {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--primary);
        animation: dot-pulse 1.4s ease-in-out infinite;
    }
    
    .spinner-dot:nth-child(2) { animation-delay: 0.2s; background: var(--secondary); }
    .spinner-dot:nth-child(3) { animation-delay: 0.4s; background: var(--accent); }
    
    @keyframes dot-pulse {
        0%, 60%, 100% { transform: scale(1); opacity: 1; }
        30% { transform: scale(1.5); opacity: 0.7; }
    }
    
    .loading-overlay p {
        color: var(--text);
        font-size: 1.2rem;
        font-weight: 600;
        margin-top: 10px;
    }
`;

document.head.appendChild(loadingStyles);

console.log('✨ انیمیشن‌های پیشرفته PulseGadgett بارگذاری شدند!');

// ==================== اکسپورت توابع به اسکوپ گلوبال ====================

// اطمینان از دسترسی جهانی به توابع ضروری
window.showNotification = showNotification || showEnhancedNotification;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.toggleCart = toggleCart;
window.checkout = checkout;
window.searchProducts = searchProducts;
window.filterProducts = filterProducts;
window.goToProduct = goToProduct;
window.closeMessengerModal = closeMessengerModal;
window.sendOrderViaWhatsapp = sendOrderViaWhatsapp;
window.sendOrderViaTelegram = sendOrderViaTelegram;

// تابع test برای بررسی
window.testNotification = function() {
    showNotification('این یک تست است!', 'success');
};

console.log('✅ توابع اسکریپت در اسکوپ گلوبال بارگذاری شدند');
