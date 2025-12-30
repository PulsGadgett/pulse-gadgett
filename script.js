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

// تبدیل قیمت فارسی به عدد انگلیسی
function parsePersianPrice(priceText) {
    if (!priceText) return 0;
    
    let cleanText = priceText.toString();
    
    // حذف "تومان" و فاصله‌ها
    cleanText = cleanText.replace(/تومان/g, '');
    cleanText = cleanText.replace(/ /g, '');
    
    // جایگزینی کامای فارسی با انگلیسی
    cleanText = cleanText.replace(/،/g, ',');
    cleanText = cleanText.replace(/٫/g, '.');
    
    // حذف تمام کاراکترهای غیرعددی به جز کاما و نقطه
    cleanText = cleanText.replace(/[^\d,.]/g, '');
    
    // اگر کاما به عنوان جداکننده هزارگان است، حذف شود
    if (cleanText.includes(',') && !cleanText.includes('.')) {
        cleanText = cleanText.replace(/,/g, '');
    }
    
    // تبدیل به عدد
    const price = parseFloat(cleanText.replace(/,/g, ''));
    return isNaN(price) ? 0 : price;
}

// محاسبه قیمت کل سبد خرید
function calculateTotalPrice() {
    return cart.reduce((total, item) => {
        const price = parsePersianPrice(item.price);
        return total + (price * item.quantity);
    }, 0);
}

// فرمت کردن قیمت به فارسی
function formatPrice(price) {
    return price.toLocaleString('fa-IR') + ' تومان';
}

// ایجاد دکمه‌های دسته‌بندی
function createCategoryButtons() {
    const container = document.getElementById('category-buttons');
    if (!container) return;
    
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

// نمایش محصولات
function displayProducts(productsArray) {
    const grid = document.getElementById('productsGrid');
    const noProducts = document.getElementById('noProducts');
    
    if (!grid || !noProducts) return;
    
    grid.innerHTML = '';
    
    if (productsArray.length === 0) {
        noProducts.style.display = 'block';
        return;
    }
    
    noProducts.style.display = 'none';
    
    productsArray.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.category = product.category;
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDI4MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI4MCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGM0YzRjMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ﺖﺳﺍ ﻥﺎﻤﺷ ﺭﺎﻛ ﻪﺑ ﺭﺩ ﻥﺎﺘﺴﻫﺍﺮﻓ</dGV4dD48L3N2Zz4=';">
                ${!product.available ? '<div class="product-badge">ناموجود</div>' : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                
                <div class="product-details">
                    <div class="product-code">
                        <span class="code-label">کد محصول:</span>
                        <span class="code-value">${product.code}</span>
                    </div>
                    <div class="product-price">
                        <span class="price-label">قیمت:</span>
                        <span class="price-value">${product.price}</span>
                    </div>
                </div>
                
                <div class="product-footer">
                    <span class="product-availability ${product.available ? 'in-stock' : 'out-of-stock'}">
                        ${product.available ? '🟢 موجود در انبار' : '🔴 ناموجود'}
                    </span>
                    ${product.available ? 
                        `<button class="add-to-cart-btn" data-product-id="${product.id}">
                            🛒 افزودن به سبد خرید
                        </button>` : 
                        ''
                    }
                </div>
            </div>
        `;
        
        const productImage = productCard.querySelector('.product-image');
        const productName = productCard.querySelector('.product-name');
        const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
        
        [productImage, productName].forEach(element => {
            if (element) {
                element.style.cursor = 'pointer';
                element.addEventListener('click', () => goToProduct(product.id));
            }
        });
        
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                addToCart(product.id);
            });
        }
        
        grid.appendChild(productCard);
    });
}

// فیلتر محصولات بر اساس دسته‌بندی
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
        product.code.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
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
    
    cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
}

// اضافه کردن محصول به سبد خرید
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    showAddedToCartMessage(product.name);
}

// حذف محصول از سبد خرید
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// نمایش پیام اضافه شدن به سبد خرید
function showAddedToCartMessage(productName) {
    if (!document.querySelector('#cartNotificationStyle')) {
        const style = document.createElement('style');
        style.id = 'cartNotificationStyle';
        style.textContent = `
            .cart-notification {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #4CAF50;
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                animation: slideDown 0.3s ease;
                max-width: 400px;
                width: 90%;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .notification-icon {
                font-size: 18px;
            }
            .notification-text {
                font-weight: 500;
            }
            @keyframes slideDown {
                from { top: -100px; opacity: 0; }
                to { top: 20px; opacity: 1; }
            }
            .cart-notification.fade-out {
                animation: fadeOut 0.3s ease forwards;
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    const message = document.createElement('div');
    message.className = 'cart-notification';
    message.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">✅</span>
            <span class="notification-text">${productName} به سبد خرید اضافه شد</span>
        </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.classList.add('fade-out');
        setTimeout(() => message.remove(), 300);
    }, 2000);
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
    
    const totalCartPrice = calculateTotalPrice();
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 48px; margin-bottom: 20px;">🛒</div>
                    <p style="font-size: 18px; color: #666; margin-bottom: 10px;">سبد خرید شما خالی است</p>
                    <p style="font-size: 14px; color: #999;">محصولاتی را به سبد خرید اضافه کنید</p>
                </div>
            </div>
        `;
        updateTotalPriceInCart(totalCartPrice, totalQuantity);
        return;
    }
    
    cart.forEach(item => {
        const price = parsePersianPrice(item.price);
        const itemTotal = price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; flex: 1;">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info" style="flex: 1;">
                    <div class="cart-item-name" style="font-weight: bold; margin-bottom: 5px; font-size: 0.9rem;">${item.name}</div>
                    <div class="cart-item-category" style="color: #666; font-size: 0.8rem;">${item.category}</div>
                </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-right: 10px;">
                <div class="cart-item-quantity" style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 0.8rem; color: #666;">تعداد:</span>
                    <div class="quantity-controls" style="display: flex; align-items: center; gap: 5px;">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)" 
                                style="width: 25px; height: 25px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">-</button>
                        <span class="quantity-value" style="min-width: 20px; text-align: center;">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)" 
                                style="width: 25px; height: 25px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">+</button>
                    </div>
                </div>
                <div class="cart-item-price" style="display: flex; align-items: center; gap: 8px;">
                    <span class="price-label" style="font-size: 0.8rem; color: #666;">قیمت:</span>
                    <span class="price-value" style="font-weight: bold; color: #e74c3c;">${formatPrice(itemTotal)}</span>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})" title="حذف" 
                    style="background: var(--button-orange); color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 0.8rem;">
                حذف
            </button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    updateTotalPriceInCart(totalCartPrice, totalQuantity);
}

// آپدیت قیمت کل در سبد خرید
function updateTotalPriceInCart(totalPrice, totalQuantity) {
    const cartFooter = document.querySelector('.cart-footer');
    if (!cartFooter) return;
    
    const totalPriceHTML = `
        <div class="cart-total" id="totalPriceDisplay">
            <strong>تعداد کل: <span id="totalItems">${totalQuantity}</span> محصول</strong>
            <div style="margin-top: 10px; font-size: 1.2rem; color: #e74c3c;">
                <strong>قیمت کل: ${formatPrice(totalPrice)}</strong>
            </div>
        </div>
    `;
    
    const oldCartTotal = cartFooter.querySelector('.cart-total');
    if (oldCartTotal) {
        oldCartTotal.outerHTML = totalPriceHTML;
    } else {
        cartFooter.insertAdjacentHTML('afterbegin', totalPriceHTML);
    }
}

// آپدیت تعداد محصول در سبد خرید
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        }
    }
}

// ثبت سفارش با انتخاب پیام‌رسان
function checkout() {
    if (cart.length === 0) {
        alert('سبد خرید شما خالی است!');
        return;
    }
    
    showMessengerModal();
}

// نمایش مدال انتخاب پیام‌رسان
function showMessengerModal() {
    const totalCartPrice = calculateTotalPrice();
    
    const productList = cart.map(item => {
        const price = parsePersianPrice(item.price);
        const itemTotal = price * item.quantity;
        return `• ${item.name} (${item.quantity} عدد) - ${formatPrice(itemTotal)}`;
    }).join('\n');
    
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const message = `📦 سفارش جدید از پالس گجت

🛍️ لیست محصولات:
${productList}

💰 قیمت کل: ${formatPrice(totalCartPrice)}
📊 تعداد کل: ${totalQuantity} محصول

📞 اطلاعات تماس:
برای تکمیل سفارش با مشتری تماس بگیرید.`;
    
    const modal = document.createElement('div');
    modal.className = 'messenger-modal';
    modal.id = 'messengerModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>انتخاب روش ارسال سفارش</h3>
                <button class="modal-close">×</button>
            </div>
            <div class="modal-body">
                <p class="modal-description">سفارش خود را از طریق کدام پیام‌رسان ارسال کنید؟</p>
                <div class="messenger-options">
                    <button class="messenger-option whatsapp-option">
                        <div class="option-icon">💬</div>
                        <div class="option-content">
                            <div class="option-title">واتساپ</div>
                            <div class="option-desc">ارسال مستقیم به پشتیبانی</div>
                        </div>
                    </button>
                    <button class="messenger-option telegram-option">
                        <div class="option-icon">✈️</div>
                        <div class="option-content">
                            <div class="option-title">تلگرام</div>
                            <div class="option-desc">ارسال از طریق تلگرام</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const oldModal = document.getElementById('messengerModal');
    const oldOverlay = document.querySelector('.modal-overlay');
    if (oldModal) oldModal.remove();
    if (oldOverlay) oldOverlay.remove();
    
    document.body.appendChild(modal);
    document.body.appendChild(overlay);
    
    const closeBtn = modal.querySelector('.modal-close');
    const whatsappBtn = modal.querySelector('.whatsapp-option');
    const telegramBtn = modal.querySelector('.telegram-option');
    
    closeBtn.addEventListener('click', closeMessengerModal);
    overlay.addEventListener('click', closeMessengerModal);
    
    whatsappBtn.addEventListener('click', function() {
        sendOrderViaWhatsapp(message);
    });
    
    telegramBtn.addEventListener('click', function() {
        sendOrderViaTelegram(message);
    });
}

// بستن مدال
function closeMessengerModal() {
    const modal = document.getElementById('messengerModal');
    const overlay = document.querySelector('.modal-overlay');
    if (modal) modal.remove();
    if (overlay) overlay.remove();
}

// ارسال سفارش از طریق واتساپ
function sendOrderViaWhatsapp(message) {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/989965566964?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    clearCartAfterOrder();
    closeMessengerModal();
    showOrderSuccessMessage('واتساپ');
}

// ارسال سفارش از طریق تلگرام
function sendOrderViaTelegram(message) {
    const encodedMessage = encodeURIComponent(message);
    const telegramUrl = `https://t.me/PG_supporter?text=${encodedMessage}`;
    
    window.open(telegramUrl, '_blank');
    clearCartAfterOrder();
    closeMessengerModal();
    showOrderSuccessMessage('تلگرام');
}

// خالی کردن سبد خرید بعد از ثبت سفارش
function clearCartAfterOrder() {
    cart = [];
    localStorage.removeItem('cart');
    updateCartDisplay();
    toggleCart();
}

// نمایش پیام موفقیت ثبت سفارش
function showOrderSuccessMessage(messenger) {
    const successHTML = `
        <div class="order-success-message">
            <div class="success-content">
                <div class="success-icon">✅</div>
                <div class="success-text">
                    <div class="success-title">سفارش شما ثبت شد!</div>
                    <div class="success-desc">لطفاً پیام را در ${messenger} ارسال کنید.</div>
                </div>
                <button class="success-close">×</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', successHTML);
    
    const closeBtn = document.querySelector('.success-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            const message = document.querySelector('.order-success-message');
            if (message) message.remove();
        });
    }
    
    setTimeout(() => {
        const message = document.querySelector('.order-success-message');
        if (message) message.remove();
    }, 5000);
}

// مقداردهی اولیه Event Listeners
function initializeEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
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
}

// بارگذاری اولیه
document.addEventListener('DOMContentLoaded', function() {
    createCategoryButtons();
    displayProducts(products);
    updateCartDisplay();
    initializeEventListeners();
});
