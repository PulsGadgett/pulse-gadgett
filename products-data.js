const products = [
    {
        id: 1,
        name: "پخش‌کننده FM خودرو",
        price: "۶۶۹,۰۰۰ تومان", 
        image: "images/پخش‌کننده خودرو/T03.jpg",
        category: "پخش‌کننده خودرو",
        code: "T03",
        available: true,
        description: "budi | پخش‌کننده FM خودرو | گارانتی شش ماهه"
    },
    {
        id: 2,
        name: "میکروفون تایپ سی",
        price: "۵۶۵,۰۰ تومان", 
        image: "images/میکروفون/JD057.jpg",
        category: "میکروفون",
        code: "JD057",
        available: true,
        description: "Jokade | میکروفون تایپ سی | گارانتی سه ماهه"
    },
    {
        id: 3,
        name: "کابل شارژ سه کاره",
        price: "۲۱۰,۰۰۰ تومان", 
        image: "images/کابل شارژ/JA024.jpg",
        category: "کابل شارژ",
        code: "JA024",
        available: true,
        description: "Jokade | کابل شارژ سه کاره | با قابلیت شارژ سریع | گارانتی سه ماهه"
    },
    {
        id: 4,
        name: "آداپتور سامسونگ سه پین",
        price: "۱,۱۷۳,۰۰۰ تومان", 
        image: "images/آداپتور/S087.jpg",
        category: "آداپتور",
        code: "S087",
        available: true,
        description: "Samsung | آداپتور سامسونگ سه پین | اورجینال | ۴۵وات | با قابلیت شارژ فوق سریع | مشکی | گارانتی شش ماهه"
    },
    {  
        id: 5,
        name: "قاب سیلیکونی سامسونگ A26",
        price: "۱۴۸,۰۰۰ تومان", 
        image: "images/قاب/GS86.jpg",
        category: "قاب",
        code: "GS86",
        available: true,
        description: "Samsung | قاب سیلیکونی سامسونگ A26"
    },
    {
        id: 6,
        name: "هولدر کانال کولری ۳۶۰درجه",
        price: "۲۳۹,۰۰۰ تومان",
        image: "images/هولدر/JE057.jpg",
        category: "هولدر",
        code: "JE057",
        available: true,
        description: "Jokade | هولدر کانال کولری ۳۶۰درجه | انعطا‌ف‌پذیر | گارانتی تست"
    },
    {
        id: 7,
        name: "هولدر کانال کولری",
        price: "۳۸۱,۰۰۰ تومان", 
        image: "images/هولدر/500A.jpg",
        category: "هولدر",
        code: "500A",
        available: true,
        description: "budi | هولدر کانال کولری | گارانتی تست"
    },
    {
        id: 8,
        name: "قاب مخصوص مگ‌سیف آیفون۱۶",
        price: "۲۹۶,۰۰۰ تومان",
        image: "images/قاب/M93S.jpg",
        category: "قاب",
        code: "M93S",
        available: true,
        description: "Eouro | قاب مخصوص مگ‌سیف آیفون۱۶"
    },
    {
        id: 9,
        name: "قاب مخصوص مگ‌سیف آیفون۱۳",
        price: "۲۹۶,۰۰۰ تومان", 
        image: "images/قاب/M46S.jpg",
        category: "قاب",
        code: "M46S",
        available: true,
        description: "Eouro | قاب مخصوص مگ‌سیف آیفون۱۳"
    },
    {
        id: 10,
        name: "فلش ۶۴گیگ",
        price: "۵۸۶,۰۰۰ تومان", 
        image: "images/فلش/JC034.jpg",
        category: "فلش",
        code: "JC034",
        available: false,
        description: "Jokade | فلش ۶۴گیگ | گارانتی یک ساله"
    },
    {
        id: 11,
        name: "فلش ۶۴گیگ",
        price: "۴۴۲,۰۰۰ تومان", 
        image: "images/فلش/JC032.jpg",
        category: "فلش",
        code: "JC032",
        available: false,
        description: "Jokade | فلش ۶۴گیگ | گارانتی یک ساله"
    },
    {
        id: 12,
        name: "هندزفری دور گردنی",
        price: "۴۸۸,۰۰۰ تومان", 
        image: "images/هندزفری و هدست/JI025.jpg",
        category: "هندزفری و هدست",
        code: "JI025",
        available: true,
        description: "Jokade | هندزفری دور گردنی | گارانتی سه ماهه"
    },
    {
        id: 13,
        name: "هندزفری بی‌سیم",
        price: "۲,۰۶۴,۰۰۰ تومان", 
        image: "images/هندزفری و هدست/E19.jpg",
        category: "هندزفری و هدست",
        code: "E19",
        available: true,
        description: "Baseus | هندزفری بی‌سیم | با قابلیت شارژ سریع | گارانتی شش ماهه"
    },
    {
        id: 14,
        name: "کابل شارژ تایپ سی به لایتنینگ",
        price: "۵۶۹,۰۰۰ تومان", 
        image: "images/کابل شارژ/TL05.jpg",
        category: "کابل شارژ",
        code: "TL05",
        available: true,
        description: "Baseus | کابل تایپ سی به لایتنینگ | کنفی | ۱.۲متر | در پنج رنگ | گارانتی شش ماهه"
    },
    {
        id: 15,
        name: "هندزفری سیم‌دار تایپ سی",
        price: "۷۴۸,۰۰۰ تومان",
        image: "images/هندزفری و هدست/5830.jpg",
        category: "هندزفری و هدست",
        code: "5830",
        available: true,
        description: "Mcdodo | هندزفری سیم‌دار تایپ سی | گارانتی تست"
    },
    {
        id: 16,
        name: "کابل فنری AUX به بلوتوث",
        price: "۶۷۷,۰۰۰ تومان", 
        image: "images/کابل AUX/8700.jpg",
        category: "کابل AUX",
        code: "8700",
        available: true,
        description: "Mcdodo | کابل فنری AUX به بلوتوث | مناسب برای ضبط ماشین و اسپیکر | گارانتی شش ماهه"
    },
    {
        id: 17,
        name: "کابل شارژ تایپ سی به لایتنینگ",
        price: "۴۰۵,۰۰۰ تومان", 
        image: "images/کابل شارژ/275.jpg",
        category: "کابل شارژ",
        code: "275",
        available: true,
        description: "Apple | کابل شارژ تایپ سی به لایتنینگ | های کپی | ۱متر | گارانتی سه ماهه"
    },
    {
        id: 18,
        name: "کابل شارژ تایپ سی به تایپ سی",
        price: "۱,۱۴۵,۰۰۰ تومان",
        image: "images/کابل شارژ/IO86.jpg",
        category: "کابل شارژ",
        code: "IO86",
        available: true,
        description: "Apple | کابل شارژ تایپ سی به تایپ سی | کنفی | اورجینال | گارانتی شش ماهه"
    },
    {
        id: 19,
        name: "تبدیل لایتنینگ به USB",
        price: "۴۴۶,۰۰۰ تومان", 
        image: "images/تبدیل/7390.jpg",
        category: "تبدیل",
        code: "7390",
        available: true,
        description: "Mcdodo | تبدیل لایتنینگ به USB | دارای چراغ راهنما و بندآویز | گارانتی شش ماهه"
    },
    {
        id: 20,
        name: "تبدیل لایتنینگ",
        price: "۱۷۱,۰۰۰ تومان", 
        image: "images/تبدیل/JC018.jpg",
        category: "تبدیل",
        code: "JC018",
        available: true,
        description: "Jokade | تبدیل لایتنینگ | گارانتی سه ماهه"
    },
    {
        id: 21,
        name: "اسپیکر قابل حمل",
        price: "۱,۸۷۹,۰۰۰ تومان", 
        image: "images/اسپیکر/VS-801.jpg",
        category: "اسپیکر",
        code: "VS-801",
        available: true,
        description: "V-Smart | اسپیکر قابل حمل | گارانتی شش ماهه"
    },
    {
        id: 22,
        name: "هدست بی‌سیم گربه‌ای",
        price: "۱,۰۳۴,۰۰۰ تومان", 
        image: "images/هندزفری و هدست/JD012.jpg",
        category: "هندزفری و هدست",
        code: "JD012",
        available: true,
        description: "Jokade | هدست بی‌سیم گربه‌ای | صورتی، آبی | گارانتی سه ماهه"
    },
    {
        id: 23,
        name: "کابل شارژ کنفی تایپ سی به تایپ سی",
        price: "۴۹۷,۰۰۰ تومان", 
        image: "images/کابل شارژ/C920.jpg",
        category: "کابل شارژ",
        code: "C920",
        available: false,
        description: "Baseus | کابل شارژ کنفی تایپ سی به تایپ سی | ۱۰۰وات | ۱متر | گارانتی شش ماهه"
    },
    {
        id: 24,
        name: "آداپتور سامسونگ ۲۵وات",
        price: "۵۲۹,۰۰۰ تومان", 
        image: "images/آداپتور/029.jpg",
        category: "آداپتور",
        code: "029",
        available: true,
        description: "Samsung | آداپتور سامسونگ ۲۵وات | اورجینال | با قابلیت شارژ فوق سریع | سفید، مشکی | گارانتی شش ماهه"
    }
]; // <- کامای اضافی حذف شد


