// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Пример данных (в реальном проекте данные будут с сервера)
    const products = [
        { id: 1, name: 'Товар 1', price: 100, description: 'Описание товара 1' },
        { id: 2, name: 'Товар 2', price: 200, description: 'Описание товара 2' },
        { id: 3, name: 'Товар 3', price: 300, description: 'Описание товара 3' }
    ];

    let currentUser = null;
    let userOrders = [];

    // Элементы DOM
    const authButtons = document.getElementById('auth-buttons');
    const userProfile = document.getElementById('user-profile');
    const usernameSpan = document.getElementById('username');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const productsSection = document.getElementById('products');
    const personalCabinet = document.getElementById('personal-cabinet');
    const userOrdersSection = document.getElementById('user-orders');

    // Инициализация
    renderProducts();
    checkAuth();

    // Функции
    function renderProducts() {
        productsSection.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>Цена: ${product.price} руб.</p>
                <button class="buy-btn" data-id="${product.id}">Купить</button>
            `;
            productsSection.appendChild(productCard);
        });

        // Добавляем обработчики для кнопок "Купить"
        document.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                buyProduct(productId);
            });
        });
    }

    function buyProduct(productId) {
        if (!currentUser) {
            alert('Для покупки войдите в систему');
            return;
        }

        const product = products.find(p => p.id === productId);
        if (product) {
            userOrders.push({
                id: Date.now(),
                productId: product.id,
                productName: product.name,
                price: product.price,
                date: new Date().toLocaleString()
            });
            updateUserOrders();
            alert(`Вы купили ${product.name} за ${product.price} руб.`);
        }
    }

    function updateUserOrders() {
        userOrdersSection.innerHTML = '';
        if (userOrders.length === 0) {
            userOrdersSection.innerHTML = '<p>У вас пока нет заказов</p>';
            return;
        }

        const ordersList = document.createElement('ul');
        userOrders.forEach(order => {
            const orderItem = document.createElement('li');
            orderItem.innerHTML = `
                <p>Товар: ${order.productName}</p>
                <p>Цена: ${order.price} руб.</p>
                <p>Дата: ${order.date}</p>
            `;
            ordersList.appendChild(orderItem);
        });
        userOrdersSection.appendChild(ordersList);
    }

    function checkAuth() {
        // В реальном проекте проверяем токен/куки
        const user = localStorage.getItem('currentUser');
        if (user) {
            currentUser = JSON.parse(user);
            authButtons.style.display = 'none';
            userProfile.style.display = 'block';
            usernameSpan.textContent = currentUser.username;
            personalCabinet.style.display = 'block';
            updateUserOrders();
        }
    }

    // Обработчики событий
    loginBtn.addEventListener('click', function() {
        // В реальном проекте - модальное окно с формой
        const username = prompt('Введите логин:');
        const password = prompt('Введите пароль:');
        
        if (username && password) {
            currentUser = { username, password };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            checkAuth();
        }
    });

    registerBtn.addEventListener('click', function() {
        // В реальном проекте - модальное окно с формой
        const username = prompt('Придумайте логин:');
        const password = prompt('Придумайте пароль:');
        
        if (username && password) {
            currentUser = { username, password };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            checkAuth();
        }
    });

    logoutBtn.addEventListener('click', function() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        authButtons.style.display = 'block';
        userProfile.style.display = 'none';
        personalCabinet.style.display = 'none';
    });
});