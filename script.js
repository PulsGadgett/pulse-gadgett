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

// ایجاد خودکار دکمه‌های دسته‌بندی از محصولات
function createCategoryButtons() {
    const categoryContainer = document.getElementById('category-buttons');
    
    if (!categoryContainer) {
        console.error('عنصر category-buttons پیدا نشد!');
        return;
    }
    
    // استخراج دسته‌بندی‌های منحصر به فرد از محصولات
    const uniqueCategories = ['همه', ...new Set(products.map(product => product.category))];
    
    console.log('دسته‌بندی‌های پیدا شده:', uniqueCategories);
    
    categoryContainer.innerHTML = '';
    
    uniqueCategories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-btn';
        button.textContent = category;
        button.onclick = () => {
            // آپدیت دکمه‌های فعال
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            // فیلتر محصولات
            if (category === 'همه') {
                displayProducts(products);
            } else {
                const filteredProducts = products.filter(product => product.category === category);
                displayProducts(filteredProducts);
            }
        };
        categoryContainer.appendChild(button);
    });
    
    // فعال کردن دکمه "همه" به صورت پیش‌فرض
    const allButton = categoryContainer.querySelector('.category-btn');
    if (allButton) {
        allButton.classList.add('active');
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

// بارگذاری اولیه
document.addEventListener('DOMContentLoaded', function() {
    console.log('صفحه لود شد');
    console.log('تعداد محصولات:', products ? products.length : 'تعریف نشده');
    
    // بارگذاری سبد خرید از localStorage
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartDisplay();
    
    // کمی تاخیر برای اطمینان از لود شدن products
    setTimeout(() => {
        if (products && products.length > 0) {
            console.log('محصولات لود شدند:', products);
            displayProducts(products);
            createCategoryButtons(); // ایجاد خودکار دسته‌بندی‌ها
        } else {
            console.error('محصولات تعریف نشده یا خالی هستند!');
            // تست با داده نمونه
            const testProducts = [
                {
                    id: 1,
                    name: "محصول تست",
                    price: "۱۰۰,۰۰۰ تومان",
                    image: "https://via.placeholder.com/300x200/667eea/ffffff?text=تست",
                    category: "اسپیکر",
                    code: "TEST-001",
                    available: true,
                    description: "این یک محصول تست است"
                }
            ];
            displayProducts(testProducts);
        }
    }, 100);
});

// سیستم سبد خرید
let cart = [];

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
        // هماهنگ با صفحه جزئیات - استفاده از localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id == productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                code: product.code,
                quantity: 1
            });
        }
        
        // ذخیره در localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // آپدیت نمایش
        updateCartDisplay();
        showAddedToCartMessage(product.name);
    }
}

// حذف محصول از سبد خرید
function removeFromCart(productId) {
    // هماهنگ با صفحه جزئیات - استفاده از localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id != productId);
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
    // هماهنگ با صفحه جزئیات - خواندن از localStorage
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const totalItems = document.getElementById('totalItems');
    
    // آپدیت تعداد محصولات
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalQuantity;
    if (totalItems) totalItems.textContent = totalQuantity;
    
    // آپدیت لیست محصولات
    if (cartItems) {
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
// در تابع updateCartDisplay، به جای کارت ساده، این قالب را استفاده کنید:
const cartItem = `
<div class="cart-item glass-card" data-category="${item.category}">
    <img src="${item.image}" alt="${item.name}" class="cart-item-image hover-zoom">
    <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p class="item-price">${item.price}</p>
        <div class="quantity-controls">
            <button onclick="decreaseQuantity(${item.id})">-</button>
            <span>${item.quantity}</span>
            <button onclick="increaseQuantity(${item.id})">+</button>
        </div>
    </div>
    <button class="remove-item-btn" onclick="removeFromCart(${item.id})">🗑️</button>
</div>
`;
            cartItems.appendChild(cartItem);
        });
    }
}

// ثبت سفارش با انتخاب پلتفرم
function checkout() {
    if (cart.length === 0) {
        alert('❌ سبد خرید شما خالی است!');
        return;
    }
    
    // ساخت پیام سفارش
    const productNames = cart.map(item => `${item.name} (${item.quantity} عدد)`).join('\n');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const message = `🛍️ *سفارش جدید از PulseGadgett* 🛍️\n\n`;
    const details = `📋 *لیست محصولات:*\n${productNames}\n\n`;
    const summary = `📊 *تعداد کل:* ${totalItems} محصول\n\n`;
    const contact = `👤 *لطفا اطلاعات تماس خود را وارد کنید:*\n- نام و نام خانوادگی:\n- شماره تلفن:\n- آدرس:\n\n`;
    
    const fullMessage = message + details + summary + contact;
    
    // نمایش انتخاب پلتفرم
    const platform = confirm('لطفا انتخاب کنید:\n\nOK = ارسال به تلگرام\nCancel = ارسال به واتساپ');
    
    if (platform) {
        // ارسال به تلگرام
        const telegramUrl = `https://t.me/PG_supporter?text=${encodeURIComponent(fullMessage)}`;
        window.open(telegramUrl, '_blank');
    } else {
        // ارسال به واتساپ
        const whatsappUrl = `https://wa.me/989965566964?text=${encodeURIComponent(fullMessage)}`;
        window.open(whatsappUrl, '_blank');
    }
    
    // خالی کردن سبد خرید
    cart = [];
    updateCartDisplay();
    toggleCart();
}
    
    // خالی کردن سبد خرید
    cart = [];
    updateCartDisplay();
    toggleCart();

    // خالی کردن سبد خرید
    cart = [];
    updateCartDisplay();
    toggleCart();

// اضافه کردن استایل دکمه افزودن به سبد خرید به CSS
const style = document.createElement('style');
style.textContent = `
    .add-to-cart-btn {
        background: #28a745;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 20px;
        cursor: pointer;
        margin-top: 10px;
        width: 100%;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .add-to-cart-btn:hover {
        background: #218838;
        transform: translateY(-2px);
    }
`;
document.head.appendChild(style);

