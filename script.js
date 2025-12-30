// سیستم سبد خرید
let cart = [];

// بارگذاری سبد خرید از localStorage
if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'));
}

// محاسبه قیمت کل سبد خرید
function calculateTotalPrice() {
    return cart.reduce((total, item) => {
        // تبدیل قیمت فارسی به عدد انگلیسی
        const priceText = item.price.replace(/[^\d]/g, '');
        const price = parseInt(priceText) || 0;
        return total + (price * item.quantity);
    }, 0);
}

// فرمت کردن قیمت به فارسی
function formatPrice(price) {
    return price.toLocaleString('fa-IR') + ' تومان';
}

// نمایش محصولات
function displayProducts(productsArray) {
    const grid = document.getElementById('productsGrid');
    const noProducts = document.getElementById('noProducts');
    
    grid.innerHTML = '';
    
    if (productsArray.length === 0) {
        noProducts.style.display = 'block';
        return;
    }
    
    noProducts.style.display = 'none';
    
    productsArray.forEach(product => {
        const productCard = `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image" onclick="goToProduct(${product.id})" style="cursor: pointer;">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${!product.available ? '<div class="product-badge">ناموجود</div>' : ''}
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name" onclick="goToProduct(${product.id})" style="cursor: pointer;">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-details">
                        <span class="product-code">کد: ${product.code}</span>
                        <span class="product-price">${product.price}</span>
                    </div>
                    <div class="product-footer">
                        <span class="product-availability ${product.available ? 'in-stock' : 'out-of-stock'}">
                            ${product.available ? '✅ موجود' : '❌ ناموجود'}
                        </span>
                        ${product.available ? 
                            `<button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                                🛒 افزودن به سبد خرید
                            </button>` : 
                            ''
                        }
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += productCard;
    });
}

// فیلتر محصولات بر اساس دسته‌بندی
function filterProducts(category) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    if (category === 'all') {
        displayProducts(products);
    } else {
        const filteredProducts = products.filter(product => product.category === category);
        displayProducts(filteredProducts);
    }
}

// جستجوی محصولات
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.code.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    displayProducts(filteredProducts);
}

// جستجو با Enter
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchProducts();
    }
});

// رفتن به صفحه محصول
function goToProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

// نمایش/مخفی کردن سبد خرید
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('active');
    
    let overlay = document.getElementById('cartOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'cartOverlay';
        overlay.className = 'cart-overlay';
        overlay.onclick = toggleCart;
        document.body.appendChild(overlay);
    }
    overlay.classList.toggle('active');
}

// اضافه کردن محصول به سبد خرید
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
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
}

// حذف محصول از سبد خرید
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// نمایش پیام اضافه شدن به سبد خرید
function showAddedToCartMessage(productName) {
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
    const totalPrice = document.getElementById('totalPrice');
    
    // آپدیت تعداد محصولات
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalQuantity;
    totalItems.textContent = totalQuantity;
    
    // آپدیت قیمت کل
    const totalCartPrice = calculateTotalPrice();
    totalPrice.textContent = formatPrice(totalCartPrice);
    
    // آپدیت لیست محصولات
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <p class="empty-cart-text">سبد خرید شما خالی است</p>
                <p class="empty-cart-subtext">محصولاتی را به سبد خرید اضافه کنید</p>
            </div>
        `;
        return;
    }
    
    cart.forEach(item => {
        // تبدیل قیمت فارسی به عدد
        const priceText = item.price.replace(/[^\d]/g, '');
        const price = parseInt(priceText) || 0;
        const itemTotal = price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-header">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-category">${item.category}</div>
                </div>
            </div>
            <div class="cart-item-details">
                <div class="cart-item-quantity">
                    <span>تعداد:</span>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <div class="cart-item-price">
                    <span class="price-label">قیمت:</span>
                    <span class="price-value">${formatPrice(itemTotal)}</span>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})" title="حذف">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            </button>
        `;
        cartItems.appendChild(cartItem);
    });
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
        showCheckoutModal('سبد خرید شما خالی است!', 'error');
        return;
    }
    
    // محاسبه قیمت کل
    const totalCartPrice = calculateTotalPrice();
    
    // ایجاد محتوای سفارش
    const productList = cart.map(item => {
        const priceText = item.price.replace(/[^\d]/g, '');
        const price = parseInt(priceText) || 0;
        const itemTotal = price * item.quantity;
        return `${item.name} - ${item.quantity} عدد - ${formatPrice(itemTotal)}`;
    }).join('\n');
    
    const message = `سفارش جدید از پالس گجت

📋 لیست محصولات:
${productList}

💰 قیمت کل: ${formatPrice(totalCartPrice)}
🛍️ تعداد کل: ${cart.reduce((sum, item) => sum + item.quantity, 0)} محصول

برای اطلاعات بیشتر با مشتری تماس بگیرید.`;
    
    // نمایش مدال انتخاب پیام‌رسان
    showMessengerModal(message);
}

// نمایش مدال انتخاب پیام‌رسان
function showMessengerModal(message) {
    const modalHTML = `
        <div class="messenger-modal" id="messengerModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>انتخاب روش ارسال سفارش</h3>
                    <button class="modal-close" onclick="closeMessengerModal()">×</button>
                </div>
                <div class="modal-body">
                    <p class="modal-description">سفارش خود را از طریق کدام پیام‌رسان ارسال کنید؟</p>
                    <div class="messenger-options">
                        <button class="messenger-option whatsapp-option" onclick="sendOrder('whatsapp', \`${message}\`)">
                            <div class="option-icon">💬</div>
                            <div class="option-content">
                                <div class="option-title">واتساپ</div>
                                <div class="option-desc">ارسال مستقیم به پشتیبانی</div>
                            </div>
                        </button>
                        <button class="messenger-option telegram-option" onclick="sendOrder('telegram', \`${message}\`)">
                            <div class="option-icon">📱</div>
                            <div class="option-content">
                                <div class="option-title">تلگرام</div>
                                <div class="option-desc">ارسال از طریق تلگرام</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // حذف مدال قبلی اگر وجود دارد
    const oldModal = document.getElementById('messengerModal');
    if (oldModal) oldModal.remove();
    
    // اضافه کردن مدال جدید
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // اضافه کردن overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.onclick = closeMessengerModal;
    document.body.appendChild(overlay);
}

// بستن مدال
function closeMessengerModal() {
    const modal = document.getElementById('messengerModal');
    const overlay = document.querySelector('.modal-overlay');
    if (modal) modal.remove();
    if (overlay) overlay.remove();
}

// ارسال سفارش از طریق پیام‌رسان
function sendOrder(messenger, message) {
    let url;
    
    if (messenger === 'whatsapp') {
        url = `https://wa.me/989965566964?text=${encodeURIComponent(message)}`;
    } else if (messenger === 'telegram') {
        url = `https://t.me/share/url?url=${encodeURIComponent('https://pulse-gadgett.vercel.app')}&text=${encodeURIComponent(message)}`;
    }
    
    if (url) {
        window.open(url, '_blank');
        
        // خالی کردن سبد خرید
        cart = [];
        localStorage.removeItem('cart');
        updateCartDisplay();
        toggleCart();
        closeMessengerModal();
    }
}

// نمایش مدال خطا/موفقیت
function showCheckoutModal(message, type = 'success') {
    const modalHTML = `
        <div class="checkout-modal ${type}">
            <div class="checkout-modal-content">
                <div class="checkout-modal-icon">${type === 'success' ? '✅' : '❌'}</div>
                <div class="checkout-modal-text">${message}</div>
                <button class="checkout-modal-btn" onclick="this.parentElement.parentElement.remove()">باشه</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // حذف خودکار بعد از 3 ثانیه
    setTimeout(() => {
        const modal = document.querySelector('.checkout-modal');
        if (modal) modal.remove();
    }, 3000);
}

// بارگذاری اولیه
document.addEventListener('DOMContentLoaded', function() {
    displayProducts(products);
    updateCartDisplay();
});
