document.addEventListener('DOMContentLoaded', function() {
    // Пример данных товаров
    const products = [
        { id: 1, name: 'Смартфон', price: 20000, description: 'Новый смартфон с хорошей камерой', photo: 'https://via.placeholder.com/200' },
        { id: 2, name: 'Ноутбук', price: 50000, description: 'Мощный ноутбук для работы и игр', photo: 'https://via.placeholder.com/200' },
        { id: 3, name: 'Наушники', price: 3000, description: 'Беспроводные наушники с шумоподавлением', photo: 'https://via.placeholder.com/200' }
    ];

    let currentUser = null;
    let userOrders = [];
    let userAds = [];

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
    const createAdBtn = document.getElementById('create-ad-btn');
    const createAdForm = document.getElementById('create-ad-form');
    const adForm = document.getElementById('ad-form');
    const adsList = document.getElementById('ads-list');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Инициализация
    renderProducts();
    checkAuth();
    loadAdsFromLocalStorage();

    // Функция отображения товаров
    function renderProducts() {
        productsSection.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <h3>${product.name}</h3>
                <img src="${product.photo}" alt="${product.name}">
                <p>${product.description}</p>
                <p>Цена: ${product.price} руб.</p>
                <button class="buy-btn" data-id="${product.id}">Купить</button>
            `;
            productsSection.appendChild(productCard);
        });

        // Обработчики кнопок "Купить"
        document.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                buyProduct(productId);
            });
        });
    }

    // Функция покупки товара
    function buyProduct(productId) {
        if (!currentUser) {
            alert('Для покупки войдите в систему');
            showModal(loginModal);
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

    // Функция обновления списка заказов
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
                <hr>
            `;
            ordersList.appendChild(orderItem);
        });
        userOrdersSection.appendChild(ordersList);
    }

    // Функция проверки авторизации
    function checkAuth() {
        const user = localStorage.getItem('currentUser');
        if (user) {
            currentUser = JSON.parse(user);
            authButtons.style.display = 'none';
            userProfile.style.display = 'block';
            usernameSpan.textContent = currentUser.username;
            personalCabinet.style.display = 'block';
            updateUserOrders();
            renderUserAds();
        }
    }

    // Функции для работы с объявлениями
    function loadAdsFromLocalStorage() {
        const ads = localStorage.getItem('userAds');
        if (ads) {
            userAds = JSON.parse(ads);
        }
    }

    function saveAdsToLocalStorage() {
        localStorage.setItem('userAds', JSON.stringify(userAds));
    }

    function renderUserAds() {
        adsList.innerHTML = '';
        
        const userAdsFiltered = userAds.filter(ad => ad.userId === currentUser?.username);
        
        if (userAdsFiltered.length === 0) {
            adsList.innerHTML = '<p>У вас пока нет объявлений</p>';
            return;
        }
        
        userAdsFiltered.forEach(ad => {
            const adElement = document.createElement('div');
            adElement.className = 'user-ad';
            adElement.innerHTML = `
                <h4>${ad.title}</h4>
                <img src="${ad.photo}" alt="${ad.title}">
                <p>${ad.description}</p>
                <p>Цена: ${ad.price} руб.</p>
                <p>Дата публикации: ${ad.date}</p>
                <button class="delete-ad-btn" data-id="${ad.id}">Удалить</button>
            `;
            adsList.appendChild(adElement);
        });
        
        // Обработчики кнопок удаления
        document.querySelectorAll('.delete-ad-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const adId = parseInt(this.getAttribute('data-id'));
                deleteAd(adId);
            });
        });
    }

    function deleteAd(adId) {
        userAds = userAds.filter(ad => ad.id !== adId);
        saveAdsToLocalStorage();
        renderUserAds();
    }

    // Функции для модальных окон
    function showModal(modal) {
        modal.style.display = 'flex';
    }

    function hideModal(modal) {
        modal.style.display = 'none';
    }

    // Обработчики событий
    loginBtn.addEventListener('click', () => showModal(loginModal));
    registerBtn.addEventListener('click', () => showModal(registerModal));

    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            hideModal(modal);
        });
    });

    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target);
        }
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        // Простая проверка (в реальном приложении нужно обращаться к серверу)
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            hideModal(loginModal);
            checkAuth();
        } else {
            alert('Неверный логин или пароль');
        }
    });

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        
        // Проверяем, не занят ли логин
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(u => u.username === username)) {
            alert('Этот логин уже занят');
            return;
        }
        
        // Сохраняем нового пользователя
        const newUser = { username, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        hideModal(registerModal);
        checkAuth();
    });

    logoutBtn.addEventListener('click', function() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        authButtons.style.display = 'block';
        userProfile.style.display = 'none';
        personalCabinet.style.display = 'none';
    });

    createAdBtn.addEventListener('click', function() {
        if (!currentUser) {
            alert('Для создания объявления войдите в систему');
            return;
        }
        createAdForm.style.display = createAdForm.style.display === 'none' ? 'block' : 'none';
    });

    adForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('ad-title').value;
        const description = document.getElementById('ad-description').value;
        const price = document.getElementById('ad-price').value;
        const photoInput = document.getElementById('ad-photo');
        
        if (photoInput.files && photoInput.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const newAd = {
                    id: Date.now(),
                    title,
                    description,
                    price,
                    photo: e.target.result,
                    date: new Date().toLocaleString(),
                    userId: currentUser.username
                };
                
                userAds.push(newAd);
                saveAdsToLocalStorage();
                renderUserAds();
                
                // Очищаем форму
                adForm.reset();
                createAdForm.style.display = 'none';
            };
            
            reader.readAsDataURL(photoInput.files[0]);
        }
    });
});