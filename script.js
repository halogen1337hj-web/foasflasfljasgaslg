// Конфигурация - ЗАМЕНИТЕ НА ВАШ URL!
const BACKEND_URL = "http://95.85.236.31:5000"; // или IP адрес: http://123.456.789.012:5000

// Элементы DOM
const nftUrlInput = document.getElementById('nftUrl');
const statusDiv = document.getElementById('status');
const resultDiv = document.getElementById('result');
const amlResult = document.getElementById('amlResult');
const refundResult = document.getElementById('refundResult');
const historyResult = document.getElementById('historyResult');
const apiStatus = document.getElementById('apiStatus');
const apiUrl = document.getElementById('apiUrl');
const backendUrl = document.getElementById('backendUrl');

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Отображаем URL бэкенда
    backendUrl.textContent = `API: ${BACKEND_URL}`;
    apiUrl.textContent = BACKEND_URL;
    
    // Проверяем подключение к API
    checkAPI();
    
    // Инициализация Telegram Web App (если используется в Telegram)
    if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
        Telegram.WebApp.expand();
        Telegram.WebApp.enableClosingConfirmation();
    }
});

// Проверка подключения к API
async function checkAPI() {
    apiStatus.className = 'status-dot connecting';
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/health`, {
            timeout: 5000
        }).catch(error => {
            throw new Error('Сеть недоступна');
        });
        
        if (response.ok) {
            apiStatus.className = 'status-dot online';
            statusDiv.innerHTML = '<i class="fas fa-check"></i> API подключен';
        } else {
            throw new Error('API недоступен');
        }
    } catch (error) {
        apiStatus.className = 'status-dot offline';
        statusDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Ошибка подключения: ${error.message}`;
    }
}

// Проверка NFT
async function checkNFT() {
    const url = nftUrlInput.value.trim();
    
    if (!url) {
        statusDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Введите ссылку на NFT';
        return;
    }
    
    if (!url.startsWith('http')) {
        statusDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Введите корректную ссылку (начинается с http:// или https://)';
        return;
    }
    
    // Скрываем старые результаты
    resultDiv.classList.add('hidden');
    
    // Показываем статус проверки
    statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Проверяем NFT...';
    
    try {
        // Имитация проверки с API
        const checkResponse = await fetch(`${BACKEND_URL}/api/start_check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: url,
                user_id: getUserId(),
                timestamp: Date.now()
            })
        });
        
        if (!checkResponse.ok) {
            throw new Error('Ошибка API');
        }
        
        const checkData = await checkResponse.json();
        
        // Имитация процесса проверки
        await simulateCheckProcess(checkData.check_id);
        
        // Получаем результаты (имитация)
        const results = await getCheckResults(checkData.check_id);
        
        // Отображаем результаты
        displayResults(results);
        
    } catch (error) {
        statusDiv.innerHTML = `<i class="fas fa-times-circle"></i> Ошибка: ${error.message}`;
        console.error('Ошибка проверки:', error);
    }
}

// Имитация процесса проверки
async function simulateCheckProcess(checkId) {
    const steps = [
        "Анализируем AML данные...",
        "Проверяем историю транзакций...",
        "Анализируем риск рефаунда...",
        "Изучаем историю владения..."
    ];
    
    for (let i = 0; i < steps.length; i++) {
        statusDiv.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${steps[i]}`;
        await delay(1500); // Задержка между шагами
    }
}

// Получение результатов проверки (имитация)
async function getCheckResults(checkId) {
    // В реальном приложении здесь был бы запрос к API
    // Для демо возвращаем фиктивные данные
    
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                aml: "Чистый",
                refund_risk: "Низкий",
                history: "Прозрачная",
                verdict: "Безопасно 🟢",
                session_id: "session_" + Date.now()
            });
        }, 1000);
    });
}

// Отображение результатов
function displayResults(results) {
    // Обновляем значения
    amlResult.textContent = results.aml;
    amlResult.className = 'result-value';
    
    refundResult.textContent = results.refund_risk;
    refundResult.className = 'result-value ' + 
        (results.refund_risk === 'Высокий' ? 'danger' : 
         results.refund_risk === 'Средний' ? 'warning' : '');
    
    historyResult.textContent = results.history;
    historyResult.className = 'result-value';
    
    // Показываем результат
    resultDiv.classList.remove('hidden');
    statusDiv.innerHTML = `<i class="fas fa-check-circle"></i> Проверка завершена! ${results.verdict}`;
}

// Получение ID пользователя
function getUserId() {
    // Если в Telegram - используем данные Telegram
    if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
        return Telegram.WebApp.initDataUnsafe.user?.id || Date.now();
    }
    
    // Или генерируем случайный ID для демо
    return 'user_' + Math.floor(Math.random() * 1000000);
}

// Вспомогательная функция задержки
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Обработка нажатия Enter в поле ввода
nftUrlInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkNFT();
    }
});
