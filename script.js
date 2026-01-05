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

// ==================== توابع تبدیل قیمت ====================

// تبدیل اعداد فارسی/عربی به انگلیسی
function convertPersianToEnglishNumbers(text) {
    if (!text) return '';
    
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    let result = text.toString();
    
    // تبدیل اعداد فارسی
    persianNumbers.forEach((persian, index) => {
        const regex = new RegExp(persian, 'g');
        result = result.replace(regex, englishNumbers[index]);
    });
    
    // تبدیل اعداد عربی
    arabicNumbers.forEach((arabic, index) => {
        const regex = new RegExp(arabic, 'g');
        result = result.replace(regex, englishNumbers[index]);
    });
    
    return result;
}

// تبدیل قیمت فارسی به عدد انگلیسی
function parsePersianPrice(priceText) {
    if (!priceText || typeof priceText !== 'string') {
        console.warn('⚠️ قیمت نامعتبر:', priceText);
        return 0;
    }
    
    let cleanText = convertPersianToEnglishNumbers(priceText);
    
    // حذف واحدها و کاراکترهای غیرعددی
    cleanText = cleanText.replace(/تومان/gi, '')
                         .replace(/ریال/gi, '')
                         .replace(/ /g, '')
                         .replace(/‌/g, '')
                         .replace(/,/g, '')
                         .replace(/\./g, '');
    
    // فقط اعداد را نگه دار
    cleanText = cleanText.replace(/[^\d]/g, '');
    
    if (!cleanText) {
        console.warn('⚠️ قیمت خالی پس از پاکسازی:', priceText);
        return 0;
    }
    
    const price = parseInt(cleanText, 10);
    
    if (isNaN(price)) {
        console.warn('⚠️ تبدیل به عدد ناموفق:', cleanText, 'از:', priceText);
        return 0;
    }
    
    return price;
}

// فرمت کردن قیمت به فارسی
function formatPrice(price) {
    if (typeof price !== 'number' || isNaN(price)) {
        return '۰ تومان';
    }
    return price.toLocaleString('fa-IR') + ' تومان';
}

// ==================== توابع اصلی ====================

// ایجاد دکمه‌های دسته‌بندی
function createCategoryButtons() {
    const container = document.getElementById('category-buttons');
    if (!container) return;
    
    // استخراج دسته‌بندی‌های منحصر به فرد
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
    
    // فعال کردن دکمه "همه" به صورت پیش‌فرض
    const allBtn = container.querySelector('[data-category="all"]');
    if (allBtn) allBtn.classList.add('active');
}

// نمایش محصولات
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
        
        productCard.innerHTML = `
            ${product.stock === 0 ? '<div class="out-of-stock-badge">ناموجود</div>' : ''}
            <div class="product-image">
                <img src="${product.image || 'images/placeholder.jpg'}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-brand">${product.brand}</div>
                <p class="product-description">${product.description}</p>
                
                <div class="product-details">
                    <div class="product-price">${product.price.toLocaleString('fa-IR')} تومان</div>
                    <div class="product-code">کد: ${product.code}</div>
                </div>
                
                <div class="product-actions">
                    <button class="add-to-cart-btn" 
                            data-product-id="${product.id}"
                            ${product.stock === 0 ? 'disabled' : ''}>
                        ${product.stock === 0 ? 'ناموجود' : '🛒 افزودن به سبد خرید'}
                    </button>
                </div>
            </div>
        `;
        
        // اضافه کردن رویداد کلیک برای دکمه افزودن به سبد
        const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
        if (addToCartBtn && product.stock > 0) {
            addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                addToCart(product.id);
            });
        }
        
        // اضافه کردن رویداد کلیک برای کل کارت (رفتن به صفحه محصول)
        productCard.addEventListener('click', (e) => {
            if (!e.target.closest('.add-to-cart-btn')) {
                goToProduct(product.id);
            }
        });
        
        grid.appendChild(productCard);
    });
}

// فیلتر محصولات
function filterProducts(category, targetButton = null) {
    // حذف کلاس active از همه دکمه‌ها
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // اضافه کردن کلاس active به دکمه انتخاب شده
    if (targetButton) {
        targetButton.classList.add('active');
    } else {
        const button = document.querySelector(`[data-category="${category === 'all' ? 'all' : category}"]`);
        if (button) button.classList.add('active');
    }
    
    // فیلتر کردن محصولات
    if (category === 'all') {
        displayProducts(products);
    } else {
        const filteredProducts = products.filter(product => product.category === category);
        displayProducts(filteredProducts);
    }
}

// جستجوی محصولات
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
        (product.category && product.category.toLowerCase().includes(searchTerm)) ||
        (product.brand && product.brand.toLowerCase().includes(searchTerm))
    );
    
    displayProducts(filteredProducts);
}

// رفتن به صفحه محصول
function goToProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

// نمایش/مخفی کردن سبد خرید
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    
    if (!cartSidebar || !overlay) return;
    
    const isActive = cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active', isActive);
    
    // جلوگیری از اسکرول صفحه هنگام باز بودن سبد خرید
    document.body.style.overflow = isActive ? 'hidden' : '';
}

// اضافه کردن محصول به سبد خرید
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock === 0) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity >= product.stock) {
            showNotification('این تعداد از محصول در انبار موجود نیست', 'warning');
            return;
        }
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            code: product.code,
            quantity: 1,
            maxStock: product.stock
        });
    }
    
    // ذخیره در localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // آپدیت نمایش
    updateCartDisplay();
    
    // نمایش پیام موفقیت
    showNotification(`${product.name} به سبد خرید اضافه شد`, 'success');
}

// حذف محصول از سبد خرید
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    
    showNotification('محصول از سبد خرید حذف شد', 'info');
}

// آپدیت تعداد محصول در سبد خرید
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    const product = products.find(p => p.id === productId);
    const newQuantity = item.quantity + change;
    
    // بررسی موجودی انبار
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    if (product && newQuantity > product.stock) {
        showNotification(`فقط ${product.stock} عدد از این محصول در انبار موجود است`, 'warning');
        return;
    }
    
    item.quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// نمایش نوتیفیکیشن
function showNotification(message, type = 'success') {
    // اگر استایل نوتیفیکیشن وجود ندارد، اضافه کن
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
            .notification.success { background-color: var(--success, #00C9B1); }
            .notification.warning { background-color: var(--warning, #FFD166); color: #333; }
            .notification.info { background-color: var(--accent, #8A6BFF); }
            .notification.error { background-color: var(--error, #FF6B4A); }
            
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
    
    // حذف نوتیفیکیشن قبلی
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // ایجاد نوتیفیکیشن جدید
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'info' ? 'ℹ️' : '❌'}</span>
        <span class="notification-text">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // حذف خودکار بعد از 2.5 ثانیه
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 2500);
}

// محاسبه قیمت کل سبد خرید
function calculateTotalPrice() {
    return cart.reduce((total, item) => {
        const price = parsePersianPrice(item.price);
        return total + (price * item.quantity);
    }, 0);
}

// آپدیت نمایش سبد خرید
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
        const itemTotal = formatPrice(parsePersianPrice(item.price) * item.quantity);
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image-container">
                <img src="${item.image || 'images/placeholder.jpg'}" alt="${item.name}" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIHJ4PSI4IiBmaWxsPSIjRjNGM0YzIi8+PC9zdmc+'">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-category">${item.category}</div>
                <div class="cart-item-code">کد: ${item.code}</div>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="quantity-btn minus" onclick="updateQuantity('${item.id}', -1)">−</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn plus" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
                <div class="cart-item-price">${itemTotal}</div>
            </div>
            <button class="remove-item-btn" onclick="removeFromCart('${item.id}')" title="حذف">
                ✕
            </button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    updateTotalPriceInCart(totalPrice, totalQuantity);
}

// آپدیت قیمت کل در سبد خرید
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
                <span class="summary-value price-value">${formatPrice(totalPrice)}</span>
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

// ثبت سفارش
function checkout() {
    if (cart.length === 0) {
        showNotification('سبد خرید شما خالی است!', 'warning');
        return;
    }
    
    showMessengerModal();
}

// نمایش مدال انتخاب پیام‌رسان
function showMessengerModal() {
    const totalPrice = calculateTotalPrice();
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // ساخت پیام سفارش
    const productList = cart.map(item => {
        const itemPrice = parsePersianPrice(item.price);
        return `▫️ ${item.name} (${item.quantity} عدد) - ${formatPrice(itemPrice * item.quantity)}`;
    }).join('\n');
    
    const message = `🛒 سفارش جدید از PulseGadgett

📋 لیست محصولات:
${productList}

💰 جمع کل: ${formatPrice(totalPrice)}
📦 تعداد کل: ${totalQuantity} محصول

📞 لطفاً برای تکمیل سفارش با خریدار هماهنگ کنید.`;
    
    // ایجاد مدال
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
    
    // حذف مدال قبلی اگر وجود دارد
    const existingModal = document.getElementById('messengerOverlay');
    if (existingModal) existingModal.remove();
    
    // اضافه کردن مدال جدید
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// بستن مدال
function closeMessengerModal() {
    const modal = document.getElementById('messengerOverlay');
    if (modal) modal.remove();
}

// ارسال سفارش از طریق واتساپ
function sendOrderViaWhatsapp(encodedMessage) {
    const whatsappUrl = `https://wa.me/989965566964?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    completeOrder();
}

// ارسال سفارش از طریق تلگرام
function sendOrderViaTelegram(encodedMessage) {
    const telegramUrl = `https://t.me/PG_supporter?text=${encodedMessage}`;
    window.open(telegramUrl, '_blank');
    completeOrder();
}

// تکمیل سفارش
function completeOrder() {
    showNotification('سفارش شما با موفقیت ثبت شد!', 'success');
    
    // خالی کردن سبد خرید
    cart = [];
    localStorage.removeItem('cart');
    updateCartDisplay();
    
    // بستن سبد خرید و مدال
    toggleCart();
    closeMessengerModal();
    
    // نمایش پیام تشکر
    setTimeout(() => {
        showNotification('از خرید شما متشکریم! به زودی با شما تماس می‌گیریم.', 'info');
    }, 1000);
}

// ==================== مقداردهی اولیه Event Listeners ====================

function initializeEventListeners() {
    // جستجو
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
    
    // سبد خرید
    const cartIcon = document.getElementById('cartIcon');
    const closeCartButton = document.getElementById('closeCartButton');
    const checkoutButton = document.getElementById('checkoutButton');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartIcon) cartIcon.addEventListener('click', toggleCart);
    if (closeCartButton) closeCartButton.addEventListener('click', toggleCart);
    if (checkoutButton) checkoutButton.addEventListener('click', checkout);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);
    
    // بستن مدال با کلیک خارج از آن
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('messengerOverlay');
        if (modal && e.target === modal) {
            closeMessengerModal();
        }
    });
}

// ==================== اجرای اولیه ====================

// اجرا پس از بارگذاری DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 PulseGadgett در حال بارگذاری...');
    
    // بررسی وجود داده‌های محصول
    if (typeof products !== 'undefined' && Array.isArray(products)) {
        createCategoryButtons();
        displayProducts(products);
        updateCartDisplay();
        initializeEventListeners();
        console.log('✅ سایت با موفقیت بارگذاری شد');
    } else {
        console.error('❌ داده‌های محصول یافت نشد!');
        showNotification('خطا در بارگذاری محصولات. لطفاً صفحه را refresh کنید.', 'error');
    }
});

// ==================== توابع کمکی گلوبال ====================

// برای دسترسی از طریق HTML
window.searchProducts = searchProducts;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.goToProduct = goToProduct;
window.toggleCart = toggleCart;
window.checkout = checkout;
window.filterProducts = filterProducts;
window.closeMessengerModal = closeMessengerModal;
window.sendOrderViaWhatsapp = sendOrderViaWhatsapp;
window.sendOrderViaTelegram = sendOrderViaTelegram;
