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
                    <p class="product-code">کد: ${product.code}</p>
                    <p class="product-price">${product.price}</p>
                    <span class="product-availability ${product.available ? 'in-stock' : 'out-of-stock'}">
                        ${product.available ? '✅ موجود' : '❌ ناموجود'}
                    </span>
                    <button class="view-details-btn" onclick="goToProduct(${product.id})">مشاهده جزئیات</button>
                    ${product.available ? 
                        `<button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                            🛒 افزودن به سبد خرید
                        </button>` : 
                        ''
                    }
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
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #27ae60;
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        font-weight: bold;
    `;
    message.textContent = `✅ ${productName} به سبد خرید اضافه شد`;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
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
            <div style="text-align: center; padding: 40px; color: #666;">
                <p>🛒 سبد خرید شما خالی است</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">محصولاتی را به سبد خرید اضافه کنید</p>
            </div>
        `;
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price}</div>
                <div style="font-size: 0.8rem; color: #666;">تعداد: ${item.quantity}</div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">🗑️</button>
        `;
        cartItems.appendChild(cartItem);
    });
}

// ثبت سفارش با انتخاب پیام‌رسان
function checkout() {
    if (cart.length === 0) {
        alert('❌ سبد خرید شما خالی است!');
        return;
    }
    
    // ایجاد محتوای سفارش
    const productNames = cart.map(item => `${item.name} (${item.quantity} عدد)`).join('\n');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const message = `سلام! می‌خوام این محصولات رو سفارش بدم:\n\n${productNames}\n\n📦 تعداد کل: ${totalItems} محصول\n\nلطفا راهنمایی کنید.`;
    
    // نمایش انتخاب پیام‌رسان
    const messengerChoice = prompt(
        'پیام‌رسان مورد نظر را انتخاب کنید:\n\n' +
        '1️⃣ برای واتساپ عدد 1 را وارد کنید\n' +
        '2️⃣ برای تلگرام عدد 2 را وارد کنید'
    );
    
    if (messengerChoice === '1') {
        // واتساپ
        const whatsappUrl = `https://wa.me/989965566964?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    } else if (messengerChoice === '2') {
        // تلگرام
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent('https://pulse-gadgett.vercel.app')}&text=${encodeURIComponent(message)}`;
        window.open(telegramUrl, '_blank');
    } else {
        alert('⚠️ انتخاب نامعتبر!');
        return;
    }
    
    // خالی کردن سبد خرید
    cart = [];
    localStorage.removeItem('cart');
    updateCartDisplay();
    toggleCart();
}

// بارگذاری اولیه
document.addEventListener('DOMContentLoaded', function() {
    displayProducts(products);
    updateCartDisplay();
});
