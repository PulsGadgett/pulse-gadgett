// نمایش مدال انتخاب پیام‌رسان - نسخه اصلاح شده
function showMessengerModal() {
    // محاسبه قیمت کل
    const totalCartPrice = calculateTotalPrice();
    
    // ایجاد محتوای سفارش
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
    
    // ایجاد مدال بدون استفاده از template literal برای جلوگیری از خطای escaping
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
    
    // ایجاد overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    // حذف مدال قبلی اگر وجود دارد
    const oldModal = document.getElementById('messengerModal');
    const oldOverlay = document.querySelector('.modal-overlay');
    if (oldModal) oldModal.remove();
    if (oldOverlay) oldOverlay.remove();
    
    // اضافه کردن مدال جدید
    document.body.appendChild(modal);
    document.body.appendChild(overlay);
    
    // اضافه کردن event listeners با استفاده از addEventListener
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

// ارسال سفارش از طریق واتساپ - نسخه ساده‌تر
function sendOrderViaWhatsapp(message) {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/989965566964?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    clearCartAfterOrder();
    closeMessengerModal();
    showOrderSuccessMessage('واتساپ');
}

// ارسال سفارش از طریق تلگرام - نسخه ساده‌تر
function sendOrderViaTelegram(message) {
    const encodedMessage = encodeURIComponent(message);
    const telegramUrl = `https://t.me/PG_supporter?text=${encodedMessage}`;
    
    window.open(telegramUrl, '_blank');
    clearCartAfterOrder();
    closeMessengerModal();
    showOrderSuccessMessage('تلگرام');
}
