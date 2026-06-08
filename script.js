// ==================== توابع اصلی سایت ====================

// سیستم سبد خرید
let cart = [];

// بارگذاری سبد خرید از localStorage
if (localStorage.getItem('cart')) {
    try {
        cart = JSON.parse(localStorage.getItem('cart'));
    } catch (e) {
        cart = [];
        localStorage.removeItem('cart');
    }
}

// ==================== توابع ضروری ====================

// 1. نمایش نوتیفیکیشن
function showNotification(message, type = 'success', duration = 2500) {
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 12px 24px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 10px;
                animation: slideDown 0.3s ease, fadeOut 0.3s ease 2s forwards;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .notification.success { background-color: #00C9B1; }
            .notification.warning { background-color: #FFD166; color: #333; }
            .notification.info { background-color: #8A6BFF; }
            .notification.error { background-color: #FF6B4A; }
            
            @keyframes slideDown {
                from { top: -100px; opacity: 0; }
                to { top: 20px; opacity: 1; }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'info' ? 'ℹ️' : '❌'}</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), duration);
}

// 2. ایجاد دکمه‌های دسته‌بندی
function createCategoryButtons() {
    const container = document.getElementById('category-buttons');
    if (!container || !products) return;
    
    const categories = ['همه', ...new Set(products.map(product => product.category))];
    container.innerHTML = '';
    
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-btn';
        button.textContent = category === 'همه' ? 'همه محصولات' : category;
        button.dataset.category = category === 'همه' ? 'all' : category;
        
        button.addEventListener('click', (e) => {
            filterProducts(category === 'همه' ? 'all' : category, e.target);
        });
        
        container.appendChild(button);
    });
    
    const allBtn = container.querySelector('[data-category="all"]');
    if (allBtn) allBtn.classList.add('active');
}

// 3. نمایش محصولات (نسخه سازگار با دیتای فعلی)
function displayProducts(productsArray) {
    const grid = document.getElementById('productsGrid');
    const noProducts = document.getElementById('noProducts');
    
    if (!grid || !noProducts) return;
    
    grid.innerHTML = '';
    
    if (!productsArray || productsArray.length === 0) {
        noProducts.style.display = 'block';
        return;
    }
    
    noProducts.style.display = 'none';
    
    productsArray.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.category = product.category;
        
        const displayPrice = product.priceText || product.price;
        const stockCount = product.stock !== undefined ? product.stock : (product.available ? 10 : 0);
        const brandName = product.brand || (product.description ? product.description.split('|')[0]?.trim() : 'PulseGadgett');
        
        productCard.innerHTML = `
            ${stockCount === 0 ? '<div class="out-of-stock-badge">ناموجود</div>' : ''}
            <div class="product-image">
                <img src="${product.image || 'images/placeholder.jpg'}" alt="${product.name}" loading="lazy" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGM0YzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPtio2YrYstmF2YbbjCDYp9mG2K8iLz48L3N2Zz4='">
            </div>
            <div class="product-info">
                <h3 class="product-title">${escapeHtml(product.name)}</h3>
                <div class="product-brand">${escapeHtml(brandName)}</div>
                <p class="product-description">${escapeHtml(product.description || '')}</p>
                
                <div class="product-details">
                    <div class="product-price">${displayPrice}</div>
                    <div class="product-code">کد: ${product.code}</div>
                </div>
                
                <div class="product-actions">
                    <button class="add-to-cart-btn" 
                            data-product-id="${product.id}"
                            ${stockCount === 0 ? 'disabled' : ''}>
                        ${stockCount === 0 ? 'ناموجود' : '🛒 افزودن به سبد خرید'}
                    </button>
                </div>
            </div>
        `;
        
        const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
        if (addToCartBtn && stockCount > 0) {
            addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                addToCart(product.id);
            });
        }
        
        productCard.addEventListener('click', (e) => {
            if (!e.target.closest('.add-to-cart-btn')) {
                goToProduct(product.id);
            }
        });
        
        grid.appendChild(productCard);
    });
}

// تابع کمکی برای جلوگیری از XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 4. فیلتر محصولات
function filterProducts(category, targetButton = null) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (targetButton) {
        targetButton.classList.add('active');
    } else {
        const button = document.querySelector(`[data-category="${category === 'all' ? 'all' : category}"]`);
        if (button) button.classList.add('active');
    }
    
    if (category === 'all') {
        displayProducts(products);
    } else {
        const filteredProducts = products.filter(product => product.category === category);
        displayProducts(filteredProducts);
    }
}

// 5. جستجوی محصولات
function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        displayProducts(products);
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        (product.code && product.code.toLowerCase().includes(searchTerm)) ||
        (product.description && product.description.toLowerCase().includes(searchTerm)) ||
        (product.category && product.category.toLowerCase().includes(searchTerm))
    );
    
    displayProducts(filteredProducts);
}

// 6. رفتن به صفحه محصول
function goToProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

// 7. نمایش/مخفی کردن سبد خرید
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    
    if (!cartSidebar || !overlay) return;
    
    const isActive = cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active', isActive);
    
    document.body.style.overflow = isActive ? 'hidden' : '';
}

// 8. اضافه کردن محصول به سبد خرید
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const stockCount = product.stock !== undefined ? product.stock : (product.available ? 10 : 0);
    
    if (!product || stockCount === 0) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity >= stockCount) {
            showNotification('این تعداد از محصول در انبار موجود نیست', 'warning');
            return;
        }
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            priceText: product.priceText || product.price,
            image: product.image,
            category: product.category,
            code: product.code,
            quantity: 1,
            maxStock: stockCount
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    showNotification(`${product.name} به سبد خرید اضافه شد`, 'success');
}

// 9. حذف محصول از سبد خرید
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    showNotification('محصول از سبد خرید حذف شد', 'info');
}

// 10. آپدیت تعداد محصول در سبد خرید
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    const product = products.find(p => p.id === productId);
    const stockCount = product ? (product.stock !== undefined ? product.stock : (product.available ? 10 : 0)) : item.maxStock;
    const newQuantity = item.quantity + change;
    
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    if (product && newQuantity > stockCount) {
        showNotification(`فقط ${stockCount} عدد از این محصول در انبار موجود است`, 'warning');
        return;
    }
    
    item.quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// 11. محاسبه قیمت کل سبد خرید
function calculateTotalPrice() {
    return cart.reduce((total, item) => {
        let price = 0;
        if (typeof item.price === 'number') {
            price = item.price;
        } else if (typeof item.price === 'string') {
            price = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
        }
        return total + (price * item.quantity);
    }, 0);
}

// 12. آپدیت نمایش سبد خرید
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const totalItems = document.getElementById('totalItems');
    
    if (!cartItems || !cartCount || !totalItems) return;
    
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalQuantity;
    totalItems.textContent = totalQuantity;
    
    const totalPrice = calculateTotalPrice();
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 48px; color: #ddd; margin-bottom: 20px;">🛒</div>
                    <p style="font-size: 18px; color: #666; margin-bottom: 10px;">سبد خرید شما خالی است</p>
                    <p style="font-size: 14px; color: #999;">محصولاتی را به سبد خرید اضافه کنید</p>
                </div>
            </div>
        `;
        updateTotalPriceInCart(totalPrice, totalQuantity);
        return;
    }
    
    cart.forEach(item => {
        let itemPrice = 0;
        if (typeof item.price === 'number') {
            itemPrice = item.price;
        } else if (typeof item.price === 'string') {
            itemPrice = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
        }
        const itemTotal = (itemPrice * item.quantity).toLocaleString('fa-IR') + ' تومان';
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image-container">
                <img src="${item.image || 'images/placeholder.jpg'}" alt="${escapeHtml(item.name)}" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIHJ4PSI4IiBmaWxsPSIjRjNGM0YzIi8+PC9zdmc+'>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${escapeHtml(item.name)}</div>
                <div class="cart-item-category">${escapeHtml(item.category || '')}</div>
                <div class="cart-item-code">کد: ${item.code || ''}</div>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="quantity-btn minus" onclick="updateQuantity(${item.id}, -1)">−</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn plus" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <div class="cart-item-price">${itemTotal}</div>
            </div>
            <button class="remove-item-btn" onclick="removeFromCart(${item.id})" title="حذف">
                ✕
            </button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    updateTotalPriceInCart(totalPrice, totalQuantity);
}

// 13. آپدیت قیمت کل در سبد خرید
function updateTotalPriceInCart(totalPrice, totalQuantity) {
    const cartFooter = document.querySelector('.cart-footer');
    if (!cartFooter) return;
    
    const totalPriceDisplay = `
        <div class="cart-summary">
            <div class="cart-summary-item">
                <span>تعداد کل:</span>
                <span class="summary-value">${totalQuantity} محصول</span>
            </div>
            <div class="cart-summary-item total-price">
                <span>مبلغ قابل پرداخت:</span>
                <span class="summary-value price-value">${totalPrice.toLocaleString('fa-IR')} تومان</span>
            </div>
        </div>
    `;
    
    const oldSummary = cartFooter.querySelector('.cart-summary');
    if (oldSummary) {
        oldSummary.outerHTML = totalPriceDisplay;
    } else {
        cartFooter.insertAdjacentHTML('afterbegin', totalPriceDisplay);
    }
}

// 14. ثبت سفارش
function checkout() {
    if (cart.length === 0) {
        showNotification('سبد خرید شما خالی است!', 'warning');
        return;
    }
    
    showMessengerModal();
}

// 15. نمایش مدال انتخاب پیام‌رسان
function showMessengerModal() {
    const totalPrice = calculateTotalPrice();
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const productList = cart.map(item => {
        let itemPrice = 0;
        if (typeof item.price === 'number') {
            itemPrice = item.price;
        } else if (typeof item.price === 'string') {
            itemPrice = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
        }
        const itemTotal = itemPrice * item.quantity;
        return `▫️ ${item.name} (${item.quantity} عدد) - ${itemTotal.toLocaleString('fa-IR')} تومان`;
    }).join('\n');
    
    const message = `🛒 سفارش جدید از PulseGadgett

📋 لیست محصولات:
${productList}

💰 جمع کل: ${totalPrice.toLocaleString('fa-IR')} تومان
📦 تعداد کل: ${totalQuantity} محصول

📞 لطفاً برای تکمیل سفارش با خریدار هماهنگ کنید.`;
    
    const modalHTML = `
        <div class="messenger-modal-overlay" id="messengerOverlay">
            <div class="messenger-modal">
                <div class="modal-header">
                    <h3>📨 ارسال سفارش</h3>
                    <button class="modal-close" onclick="closeMessengerModal()">×</button>
                </div>
                <div class="modal-body">
                    <p>سفارش شما آماده است. از طریق کدام پیام‌رسان می‌خواهید ارسال کنید؟</p>
                    <div class="messenger-options">
                        <button class="messenger-btn whatsapp-btn" onclick="sendOrderViaWhatsapp('${encodeURIComponent(message)}')">
                            <span class="btn-icon">💬</span>
                            <span class="btn-text">واتساپ</span>
                        </button>
                        <button class="messenger-btn telegram-btn" onclick="sendOrderViaTelegram('${encodeURIComponent(message)}')">
                            <span class="btn-icon">✈️</span>
                            <span class="btn-text">تلگرام</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const existingModal = document.getElementById('messengerOverlay');
    if (existingModal) existingModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// 16. بستن مدال
function closeMessengerModal() {
    const modal = document.getElementById('messengerOverlay');
    if (modal) modal.remove();
}

// 17. ارسال سفارش از طریق واتساپ
function sendOrderViaWhatsapp(encodedMessage) {
    const whatsappUrl = `https://wa.me/989965566964?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    completeOrder();
}

// 18. ارسال سفارش از طریق تلگرام
function sendOrderViaTelegram(encodedMessage) {
    const telegramUrl = `https://t.me/PG_supporter?text=${encodedMessage}`;
    window.open(telegramUrl, '_blank');
    completeOrder();
}

// 19. تکمیل سفارش
function completeOrder() {
    showNotification('سفارش شما با موفقیت ثبت شد!', 'success');
    
    cart = [];
    localStorage.removeItem('cart');
    updateCartDisplay();
    
    toggleCart();
    closeMessengerModal();
    
    setTimeout(() => {
        showNotification('از خرید شما متشکریم! به زودی با شما تماس می‌گیریم.', 'info');
    }, 1000);
}

// 20. مقداردهی اولیه Event Listeners
function initializeEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchProducts();
        });
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', searchProducts);
    }
    
    const cartIcon = document.getElementById('cartIcon');
    const closeCartButton = document.getElementById('closeCartButton');
    const checkoutButton = document.getElementById('checkoutButton');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartIcon) cartIcon.addEventListener('click', toggleCart);
    if (closeCartButton) closeCartButton.addEventListener('click', toggleCart);
    if (checkoutButton) checkoutButton.addEventListener('click', checkout);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);
    
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('messengerOverlay');
        if (modal && e.target === modal) {
            closeMessengerModal();
        }
    });
}

// ==================== انیمیشن‌های پیشرفته ====================

// فعال‌سازی اسکرول انیمیشن
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -10px 0px'
        });
        
        animatedElements.forEach(el => observer.observe(el));
    } else {
        animatedElements.forEach(el => el.classList.add('animate'));
    }
}

// بهبود افکت‌ها روی کارت محصولات
function enhanceProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.07}s`;
        card.style.animationFillMode = 'both';
        
        const addButton = card.querySelector('.add-to-cart-btn');
        if (addButton) {
            addButton.addEventListener('click', function() {
                this.classList.add('click-effect');
                setTimeout(() => this.classList.remove('click-effect'), 300);
            });
        }
        
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '100';
            this.classList.add('card-hovered');
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '';
            this.classList.remove('card-hovered');
        });
    });
}

// ==================== مقداردهی اولیه ====================

// اجرای اصلی
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 PulseGadgett در حال بارگذاری...');
    
    if (typeof products !== 'undefined' && Array.isArray(products)) {
        createCategoryButtons();
        displayProducts(products);
        updateCartDisplay();
        initializeEventListeners();
        
        // انیمیشن‌ها
        initScrollAnimations();
        enhanceProductCards();
        
        console.log('✅ سایت با موفقیت بارگذاری شد');

// ==================== اکسپورت توابع به اسکوپ گلوبال ====================

window.showNotification = showNotification;
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

console.log('✨ اسکریپت PulseGadgett بارگذاری شد!');
