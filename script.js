// سیستم سبد خرید
let cart = [];

// بارگذاری سبد خرید از localStorage
if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'));
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
                    <div class="product-meta">
                        <span class="product-code">📦 کد: ${product.code}</span>
                        <span class="product-price">💰 ${product.price}</span>
                    </div>
                    <div class="product-actions">
                        <span class="product-availability ${product.available ? 'in-stock' : 'out-of-stock'}">
                            ${product.available ? '✅ موجود' : '❌ ناموجود'}
                        </span>
                        <button class="view-details-btn" onclick="goToProduct(${product.id})">🔍 جزئیات</button>
                        ${product.available ? 
                            `<button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                                🛒 افزودن
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
    // آپدیت دکمه‌های فعال
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
    
    // ایجاد overlay
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
        
        // ذخیره در localStorage
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
    // ایجاد نوتفیکیشن زیبا
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">✅</span>
            <div class="notification-text">
                <strong>${productName}</strong>
                <small>به سبد خرید اضافه شد</small>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // انیمیشن
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// آپدیت نمایش سبد خرید
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const totalItems = document.getElementById('totalItems');
    
    // آپدیت تعداد محصولات
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalQuantity;
    totalItems.textContent = totalQuantity;
    
    // آپدیت لیست محصولات
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h4>سبد خرید شما خالی است</h4>
                <p>محصولاتی را به سبد خرید اضافه کنید</p>
            </div>
        `;
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-content">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-header">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <button class="remove-item" onclick="removeFromCart(${item.id})" title="حذف">
                            ✕
                        </button>
                    </div>
                    <div class="cart-item-details">
                        <span class="cart-item-price">${item.price}</span>
                        <span class="cart-item-quantity">تعداد: ${item.quantity}</span>
                    </div>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
}

// نمایش دیالوگ انتخاب پیام‌رسان
function showMessengerDialog() {
    const dialog = document.createElement('div');
    dialog.className = 'messenger-dialog';
    dialog.innerHTML = `
        <div class="dialog-overlay" onclick="closeMessengerDialog()"></div>
        <div class="dialog-content">
            <h3>📱 انتخاب پیام‌رسان</h3>
            <p>از طریق کدام پیام‌رسان می‌خواهید سفارش دهید؟</p>
            
            <div class="messenger-options">
                <button class="messenger-option whatsapp-option" onclick="checkoutWithMessenger('whatsapp')">
                    <span class="option-icon">💬</span>
                    <span class="option-text">
                        <strong>واتساپ</strong>
                        <small>ارسال سریع به واتساپ</small>
                    </span>
                </button>
                
                <button class="messenger-option telegram-option" onclick="checkoutWithMessenger('telegram')">
                    <span class="option-icon">📱</span>
                    <span class="option-text">
                        <strong>تلگرام</strong>
                        <small>ارسال به تلگرام</small>
                    </span>
                </button>
            </div>
            
            <button class="dialog-cancel" onclick="closeMessengerDialog()">انصراف</button>
        </div>
    `;
    
    document.body.appendChild(dialog);
    setTimeout(() => {
        dialog.classList.add('show');
    }, 10);
}

// بستن دیالوگ
function closeMessengerDialog() {
    const dialog = document.querySelector('.messenger-dialog');
    if (dialog) {
        dialog.classList.remove('show');
        setTimeout(() => {
            dialog.remove();
        }, 300);
    }
}

// ثبت سفارش با پیام‌رسان انتخابی
function checkoutWithMessenger(messenger) {
    if (cart.length === 0) {
        alert('❌ سبد خرید شما خالی است!');
        return;
    }
    
    // ایجاد محتوای سفارش
    const productNames = cart.map(item => `• ${item.name} (${item.quantity} عدد)`).join('\n');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => {
        const price = parseInt(item.price.replace(/[^0-9]/g, ''));
        return sum + (price * item.quantity);
    }, 0);
    
    const message = `✨ سفارش جدید از PulseGadgett ✨\n\n📋 لیست محصولات:\n${productNames}\n\n📊 جمع کل:\n• تعداد: ${totalItems} محصول\n• مبلغ کل: ${totalPrice.toLocaleString()} تومان\n\n📍 آدرس سایت: pulse-gadgett.vercel.app\n\n🙏 لطفا برای تکمیل سفارش راهنمایی کنید.`;
    
    let url = '';
    if (messenger === 'whatsapp') {
        url = `https://wa.me/989965566964?text=${encodeURIComponent(message)}`;
    } else if (messenger === 'telegram') {
        url = `https://t.me/share/url?url=${encodeURIComponent('https://pulse-gadgett.vercel.app')}&text=${encodeURIComponent(message)}`;
    }
    
    if (url) {
        closeMessengerDialog();
        setTimeout(() => {
            window.open(url, '_blank');
            // خالی کردن سبد خرید
            cart = [];
            localStorage.removeItem('cart');
            updateCartDisplay();
            toggleCart();
        }, 500);
    }
}

// ثبت سفارش (نسخه قدیمی)
function checkout() {
    showMessengerDialog();
}

// بارگذاری اولیه
document.addEventListener('DOMContentLoaded', function() {
    displayProducts(products);
    updateCartDisplay();
    
    // اضافه کردن استایل‌های جدید
    addCustomStyles();
});

// اضافه کردن استایل‌های سفارشی
function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* استایل‌های جدید */
        .product-meta {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            font-size: 0.9rem;
        }
        
        .product-code {
            color: #666;
        }
        
        .product-actions {
            display: flex;
            gap: 10px;
            align-items: center;
            margin-top: 15px;
        }
        
        .add-to-cart-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 0.9rem;
            flex: 1;
        }
        
        .view-details-btn {
            background: #6c757d;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 0.9rem;
        }
        
        /* نوتفیکیشن */
        .cart-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            padding: 15px;
            z-index: 10000;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            max-width: 300px;
        }
        
        .cart-notification.show {
            transform: translateX(0);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-icon {
            font-size: 1.5rem;
            color: #27ae60;
        }
        
        .notification-text {
            flex: 1;
        }
        
        .notification-text small {
            display: block;
            color: #666;
            font-size: 0.8rem;
        }
        
        /* دیالوگ انتخاب پیام‌رسان */
        .messenger-dialog {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s;
        }
        
        .messenger-dialog.show {
            opacity: 1;
            visibility: visible;
        }
        
        .dialog-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
        }
        
        .dialog-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: white;
            border-radius: 15px;
            padding: 30px;
            width: 90%;
            max-width: 400px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            transition: transform 0.3s;
        }
        
        .messenger-dialog.show .dialog-content {
            transform: translate(-50%, -50%) scale(1);
        }
        
        .dialog-content h3 {
            text-align: center;
            margin-bottom: 10px;
            color: #333;
        }
        
        .dialog-content p {
            text-align: center;
            color: #666;
            margin-bottom: 25px;
        }
        
        .messenger-options {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 25px;
        }
        
        .messenger-option {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;
            text-align: right;
        }
        
        .whatsapp-option {
            background: linear-gradient(45deg, #25D366, #128C7E);
            color: white;
        }
        
        .telegram-option {
            background: linear-gradient(45deg, #0088cc, #0088cc);
            color: white;
        }
        
        .messenger-option:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .option-icon {
            font-size: 1.5rem;
        }
        
        .option-text {
            flex: 1;
        }
        
        .option-text small {
            display: block;
            opacity: 0.9;
            font-size: 0.8rem;
        }
        
        .dialog-cancel {
            width: 100%;
            padding: 12px;
            background: #f8f9fa;
            color: #666;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s;
        }
        
        .dialog-cancel:hover {
            background: #e9ecef;
        }
        
        /* سبد خرید خالی */
        .empty-cart {
            text-align: center;
            padding: 40px 20px;
            color: #666;
        }
        
        .empty-cart-icon {
            font-size: 3rem;
            margin-bottom: 15px;
            opacity: 0.5;
        }
        
        .empty-cart h4 {
            margin-bottom: 10px;
            color: #333;
        }
        
        /* آیتم سبد خرید */
        .cart-item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 5px;
        }
        
        .cart-item-name {
            font-size: 0.9rem;
            flex: 1;
            margin: 0;
        }
        
        .remove-item {
            background: #ff6b6b;
            color: white;
            border: none;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 0.8rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .cart-item-details {
            display: flex;
            justify-content: space-between;
            font-size: 0.8rem;
            color: #666;
        }
        
        /* رسپانسیو */
        @media (max-width: 768px) {
            .product-actions {
                flex-direction: column;
            }
            
            .messenger-option {
                padding: 12px;
            }
            
            .cart-notification {
                left: 20px;
                right: 20px;
                max-width: none;
            }
        }
    `;
    document.head.appendChild(style);
}
