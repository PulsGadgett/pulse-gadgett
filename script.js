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
            cartItems.innerHTML += cartItem;
        });
    }
}
