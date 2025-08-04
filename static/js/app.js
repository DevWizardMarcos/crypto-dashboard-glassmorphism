// Configuração global premium
const CONFIG = {
    API_BASE_URL: '/api',
    UPDATE_INTERVAL: 2500, // Reduzido para 2.5 segundos
    CHART_POINTS: 50,
    ANIMATION_DURATION: 400,
    CHART_ANIMATION_DURATION: 750,
    PARTICLE_COUNT: 50,
    MOUSE_TRAIL_LENGTH: 10
};

// Estado da aplicação premium
let appState = {
    cryptos: {},
    marketSummary: {},
    charts: {},
    isLoading: true,
    lastUpdate: null,
    mousePosition: { x: 0, y: 0 },
    animationFrame: null,
    updateCounter: 0,
    soundEnabled: false,
    theme: 'dark',
    autoRefresh: true,
    refreshRate: 3000,
    notifications: true,
    performance: 'high',
    priceAlerts: new Map(),
    previousPrices: new Map(),
    particleSystem: null,
    visualEffects: null
};

// Sistema de partículas e efeitos visuais premium
class VisualEffects {
    constructor() {
        this.particles = [];
        this.mouseTrail = [];
        this.notificationSystem = null;
        this.init();
    }
    
    init() {
        this.setupMouseTracking();
        this.createParticles();
        this.animate();
        this.initNotificationSystem();
    }
    
    initNotificationSystem() {
        this.notificationSystem = document.createElement('div');
        this.notificationSystem.className = 'notification-container';
        this.notificationSystem.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        `;
        document.body.appendChild(this.notificationSystem);
    }
    
    showNotification(message, type = 'info', duration = 5000) {
        if (!appState.notifications) return;
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            padding: 16px 20px;
            margin-bottom: 12px;
            color: white;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
            animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            position: relative;
            overflow: hidden;
            min-height: 60px;
            display: flex;
            align-items: center;
        `;
        
        const colors = {
            'success': 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.1))',
            'error': 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.1))',
            'warning': 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(245, 158, 11, 0.1))',
            'info': 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(99, 102, 241, 0.1))'
        };
        
        notification.style.background = colors[type] || colors.info;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px; width: 100%;">
                <div style="background: ${this.getIconColor(type)}; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-${this.getIcon(type)}" style="color: white; font-size: 14px;"></i>
                </div>
                <span style="flex: 1;">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; color: rgba(255,255,255,0.7); cursor: pointer; padding: 4px; border-radius: 4px; transition: all 0.2s;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        this.notificationSystem.appendChild(notification);
        utils.playSound(type);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    }
    
    getIcon(type) {
        const icons = {
            'success': 'check',
            'error': 'exclamation',
            'warning': 'exclamation-triangle',
            'info': 'info'
        };
        return icons[type] || 'info';
    }
    
    getIconColor(type) {
        const colors = {
            'success': '#22c55e',
            'error': '#ef4444',
            'warning': '#f59e0b',
            'info': '#6366f1'
        };
        return colors[type] || '#6366f1';
    }
    
    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            appState.mousePosition = { x: e.clientX, y: e.clientY };
            this.updateMouseTrail(e.clientX, e.clientY);
            this.updateCardHoverEffects(e);
            this.createSparkleEffect(e.clientX, e.clientY);
        });
        
        document.addEventListener('click', (e) => {
            this.createClickEffect(e.clientX, e.clientY);
        });
    }
    
    createSparkleEffect(x, y) {
        if (Math.random() < 0.05) {
            const sparkle = document.createElement('div');
            sparkle.style.cssText = `
                position: fixed;
                left: ${x + Math.random() * 20 - 10}px;
                top: ${y + Math.random() * 20 - 10}px;
                width: 4px;
                height: 4px;
                background: radial-gradient(circle, rgba(99, 102, 241, 1) 0%, rgba(99, 102, 241, 0) 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                animation: sparkleFloat 2s ease-out forwards;
            `;
            document.body.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 2000);
        }
    }
    
    createClickEffect(x, y) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            left: ${x - 25}px;
            top: ${y - 25}px;
            width: 50px;
            height: 50px;
            border: 2px solid rgba(99, 102, 241, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: rippleEffect 0.6s ease-out forwards;
        `;
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
        
        // Criar partículas adicionais no clique
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i;
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 3px;
                height: 3px;
                background: #6366f1;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                animation: clickParticle 0.8s ease-out forwards;
                --angle-x: ${Math.cos(angle) * 50}px;
                --angle-y: ${Math.sin(angle) * 50}px;
            `;
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 800);
        }
        
        utils.playSound('click');
    }
    
    updateMouseTrail(x, y) {
        this.mouseTrail.push({ x, y, time: Date.now() });
        if (this.mouseTrail.length > CONFIG.MOUSE_TRAIL_LENGTH) {
            this.mouseTrail.shift();
        }
    }
    
    updateCardHoverEffects(event) {
        const cards = document.querySelectorAll('.crypto-card, .glass-card');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;
            
            if (event.target.closest('.crypto-card') === card || 
                event.target.closest('.glass-card') === card) {
                card.style.setProperty('--mouse-x', `${x}%`);
                card.style.setProperty('--mouse-y', `${y}%`);
                
                // Adicionar efeito de brilho no hover
                card.style.transform = `translateY(-2px) scale(1.02)`;
                card.style.boxShadow = `0 20px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(99, 102, 241, 0.2)`;
            } else {
                card.style.transform = '';
                card.style.boxShadow = '';
            }
        });
    }
    
    createParticles() {
        // Criar partículas de fundo animadas
        for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
            this.particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.3,
                size: Math.random() * 2 + 1,
                color: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981'][Math.floor(Math.random() * 4)]
            });
        }
    }
    
    animate() {
        this.updateParticles();
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    updateParticles() {
        this.particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
            if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;
            
            particle.opacity = Math.sin(Date.now() * 0.001 + particle.x * 0.001) * 0.3;
            
            // Atualização visual das partículas via CSS custom properties
            document.documentElement.style.setProperty(`--particle-${index}-x`, `${particle.x}px`);
            document.documentElement.style.setProperty(`--particle-${index}-y`, `${particle.y}px`);
            document.documentElement.style.setProperty(`--particle-${index}-opacity`, particle.opacity);
        });
    }
}

// Utilitários premium
const utils = {
    formatPrice: (price) => {
        if (price >= 1000000) {
            return `$${(price / 1000000).toFixed(2)}M`;
        } else if (price >= 1000) {
            return `$${price.toLocaleString('pt-BR', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            })}`;
        }
        return `$${price.toFixed(6)}`;
    },
    
    formatChange: (change) => {
        const sign = change >= 0 ? '+' : '';
        return `${sign}${change.toFixed(2)}%`;
    },
    
    formatVolume: (volume) => volume,
    formatMarketCap: (marketCap) => marketCap,
    
    getChangeClass: (change) => change >= 0 ? 'positive' : 'negative',
    
    getChangeIcon: (change) => change >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down',
    
    getCryptoIcon: (symbol) => {
        const icons = {
            'BTC': 'fab fa-bitcoin',
            'ETH': 'fab fa-ethereum', 
            'BNB': 'fas fa-coins',
            'SOL': 'fas fa-sun',
            'ADA': 'fas fa-heart',
            'DOT': 'fas fa-circle'
        };
        return icons[symbol] || 'fas fa-coins';
    },
    
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },
    
    animateValue: (element, start, end, duration = 1000) => {
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = start + (end - start) * easeOutQuart;
            
            if (element.dataset.format === 'price') {
                element.textContent = utils.formatPrice(current);
            } else if (element.dataset.format === 'percent') {
                element.textContent = utils.formatChange(current);
            } else {
                element.textContent = Math.round(current);
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    },
    
    createSparkle: (x, y, color = '#6366f1') => {
        const sparkle = document.createElement('div');
        sparkle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            animation: sparkle 1s ease-out forwards;
        `;
        
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
    },
    
    playSound: (type) => {
        if (!appState.soundEnabled) return;
        
        // Criar sons usando Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        const frequencies = {
            'update': 800,
            'positive': 1000,
            'negative': 400,
            'click': 600
        };
        
        oscillator.frequency.setValueAtTime(frequencies[type] || 600, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    }
};

// API Functions
const api = {
    async fetchCryptos() {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/cryptos`);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error fetching crypto data:', error);
            throw error;
        }
    },
    
    async fetchHistory(symbol) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/history/${symbol}`);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error(`Error fetching history for ${symbol}:`, error);
            throw error;
        }
    }
};

// Chart Functions
const chartManager = {
    createMiniChart(canvasId, data, color) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;
        
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map((_, index) => index),
                datasets: [{
                    data: data,
                    borderColor: color,
                    backgroundColor: `${color}20`,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: color,
                        borderWidth: 1,
                        callbacks: {
                            title: () => '',
                            label: (context) => utils.formatPrice(context.parsed.y)
                        }
                    }
                },
                scales: {
                    x: { display: false },
                    y: { display: false }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                animation: {
                    duration: CONFIG.ANIMATION_DURATION
                },
                elements: {
                    line: {
                        borderJoinStyle: 'round'
                    }
                }
            }
        });
    },
    
    createMainChart() {
        const ctx = document.getElementById('main-chart');
        if (!ctx) return null;
        
        const datasets = Object.entries(appState.cryptos).map(([symbol, data]) => ({
            label: `${symbol} - ${data.name}`,
            data: data.history.slice(-30),
            borderColor: data.color,
            backgroundColor: `${data.color}20`,
            borderWidth: 3,
            fill: false,
            tension: 0.4,
            pointRadius: 2,
            pointHoverRadius: 6,
            pointBackgroundColor: data.color,
            pointBorderColor: '#fff',
            pointBorderWidth: 2
        }));
        
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 30}, (_, i) => i),
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: 'white',
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1,
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${utils.formatPrice(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            borderColor: 'rgba(255, 255, 255, 0.2)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            borderColor: 'rgba(255, 255, 255, 0.2)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            callback: function(value) {
                                return utils.formatPrice(value);
                            }
                        }
                    }
                },
                animation: {
                    duration: 750,
                    easing: 'easeInOutQuart'
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    },
    
    updateChart(chartInstance, newData) {
        if (!chartInstance) return;
        
        chartInstance.data.datasets[0].data = newData;
        chartInstance.update('none');
    },
    
    updateMainChart(chartInstance) {
        if (!chartInstance) return;
        
        Object.entries(appState.cryptos).forEach(([symbol, data], index) => {
            if (chartInstance.data.datasets[index]) {
                chartInstance.data.datasets[index].data = data.history.slice(-30);
            }
        });
        
        chartInstance.update('none');
    }
};

// UI Functions
const ui = {
    showLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }
    },
    
    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            setTimeout(() => {
                overlay.classList.add('hidden');
            }, 500);
        }
    },
    
    updateMarketSummary(summary) {
        const elements = {
            'market-cap': summary.total_market_cap,
            'gaining-count': summary.gaining,
            'losing-count': summary.losing,
            'fear-greed': summary.fear_greed_index
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
                element.classList.add('animate__animated', 'animate__pulse');
                setTimeout(() => {
                    element.classList.remove('animate__animated', 'animate__pulse');
                }, 1000);
            }
        });
    },
    
    createCryptoCard(symbol, data) {
        const changeClass = utils.getChangeClass(data.change);
        const changeIcon = utils.getChangeIcon(data.change);
        const cryptoIcon = utils.getCryptoIcon(symbol);
        
        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="glass-card crypto-card animate__animated animate__fadeInUp" style="--crypto-color: ${data.color}">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <div class="d-flex align-items-center mb-2">
                                <i class="${cryptoIcon} me-2" style="font-size: 1.5rem; color: ${data.color};"></i>
                                <span class="crypto-symbol">${data.symbol} ${symbol}</span>
                            </div>
                            <div class="crypto-name">${data.name}</div>
                        </div>
                        <div class="crypto-change ${changeClass}">
                            <i class="${changeIcon}"></i>
                            ${utils.formatChange(data.change)}
                        </div>
                    </div>
                    
                    <div class="crypto-price">${utils.formatPrice(data.price)}</div>
                    
                    <div class="mini-chart-container">
                        <canvas id="chart-${symbol}" class="mini-chart"></canvas>
                    </div>
                    
                    <div class="crypto-stats">
                        <div class="crypto-stat">
                            <span class="crypto-stat-label">24h Change:</span>
                            <span class="crypto-stat-value ${utils.getChangeClass(data.change_24h)}">
                                ${utils.formatChange(data.change_24h)}
                            </span>
                        </div>
                        <div class="crypto-stat">
                            <span class="crypto-stat-label">Volume:</span>
                            <span class="crypto-stat-value">${utils.formatVolume(data.volume)}</span>
                        </div>
                        <div class="crypto-stat">
                            <span class="crypto-stat-label">Market Cap:</span>
                            <span class="crypto-stat-value">${utils.formatMarketCap(data.market_cap)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderCryptoCards(cryptos) {
        const container = document.getElementById('crypto-cards');
        if (!container) return;
        
        container.innerHTML = Object.entries(cryptos)
            .map(([symbol, data]) => this.createCryptoCard(symbol, data))
            .join('');
    },
    
    updateLastUpdateTime(timestamp) {
        const element = document.getElementById('last-update');
        if (element) {
            element.textContent = `Última atualização: ${timestamp}`;
        }
    },
    
    addPulseEffect(element) {
        element.classList.add('animate__animated', 'animate__pulse');
        setTimeout(() => {
            element.classList.remove('animate__animated', 'animate__pulse');
        }, 1000);
    }
};

// Main App Functions
const app = {
    async init() {
        console.log('🚀 Inicializando Crypto Dashboard...');
        
        try {
            ui.showLoading();
            await this.loadData();
            this.setupEventListeners();
            this.startAutoUpdate();
            ui.hideLoading();
            appState.isLoading = false;
            console.log('✅ Dashboard inicializado com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao inicializar dashboard:', error);
            ui.hideLoading();
        }
    },
    
    async loadData() {
        try {
            const data = await api.fetchCryptos();
            appState.cryptos = data.cryptos;
            appState.marketSummary = data.market_summary;
            appState.lastUpdate = data.timestamp;
            
            this.updateUI();
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    },
    
    updateUI() {
        // Atualizar resumo do mercado
        ui.updateMarketSummary(appState.marketSummary);
        
        // Renderizar cartões de crypto
        ui.renderCryptoCards(appState.cryptos);
        
        // Atualizar timestamp
        ui.updateLastUpdateTime(appState.lastUpdate);
        
        // Criar/atualizar gráficos
        this.updateCharts();
    },
    
    updateCharts() {
        // Criar mini charts para cada crypto
        Object.entries(appState.cryptos).forEach(([symbol, data]) => {
            const chartId = `chart-${symbol}`;
            
            if (appState.charts[chartId]) {
                chartManager.updateChart(appState.charts[chartId], data.history.slice(-20));
            } else {
                setTimeout(() => {
                    appState.charts[chartId] = chartManager.createMiniChart(
                        chartId, 
                        data.history.slice(-20), 
                        data.color
                    );
                }, 100);
            }
        });
        
        // Criar/atualizar gráfico principal
        setTimeout(() => {
            if (appState.charts.mainChart) {
                chartManager.updateMainChart(appState.charts.mainChart);
            } else {
                appState.charts.mainChart = chartManager.createMainChart();
            }
        }, 200);
    },
    
    startAutoUpdate() {
        setInterval(async () => {
            if (!appState.isLoading) {
                try {
                    await this.loadData();
                } catch (error) {
                    console.error('Error during auto-update:', error);
                }
            }
        }, CONFIG.UPDATE_INTERVAL);
    },
    
    setupEventListeners() {
        // Timeframe buttons
        document.querySelectorAll('[data-timeframe]').forEach(button => {
            button.addEventListener('click', (e) => {
                document.querySelectorAll('[data-timeframe]').forEach(btn => 
                    btn.classList.remove('active')
                );
                e.target.classList.add('active');
                // TODO: Implementar mudança de timeframe
            });
        });
        
        // Refresh button (se existir)
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', utils.debounce(async () => {
                await this.loadData();
            }, 1000));
        }
        
        // Escape key para recarregar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
                e.preventDefault();
                window.location.reload();
            }
        });
    }
};

// Inicialização premium quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Crypto Dashboard Premium iniciando...');
    
    // Verificar suporte a recursos modernos
    if (!window.fetch || !window.requestAnimationFrame) {
        console.warn('⚠️ Navegador não suporta recursos modernos');
        document.body.innerHTML = `
            <div style="
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                text-align: center;
                color: white;
                font-family: 'Inter', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            ">
                <div>
                    <h2>🌟 Navegador Não Suportado</h2>
                    <p>Por favor, use um navegador moderno como Chrome, Firefox ou Safari.</p>
                </div>
            </div>
        `;
        return;
    }
    
    try {
        // Inicializar efeitos visuais premium
        appState.visualEffects = new VisualEffects();
        console.log('✨ Sistema de efeitos visuais iniciado');
        
        // Inicializar aplicação principal
        app.init();
        console.log('📊 Dashboard principal iniciado');
        
        // Mostrar notificação de boas-vindas
        setTimeout(() => {
            if (appState.visualEffects && appState.visualEffects.showNotification) {
                appState.visualEffects.showNotification(
                    '🎉 Dashboard Premium carregado! Bem-vindo ao futuro das criptomoedas.',
                    'success',
                    4000
                );
            }
        }, 2000);
        
        console.log('🎯 Crypto Dashboard Premium carregado com sucesso!');
        
        // Analytics de performance
        if (window.performance && window.performance.mark) {
            performance.mark('dashboard-loaded');
            const loadTime = performance.now();
            console.log(`⚡ Dashboard carregado em ${loadTime.toFixed(2)}ms`);
        }
        
    } catch (error) {
        console.error('❌ Erro ao inicializar dashboard:', error);
        
        // Fallback gracioso
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(239, 68, 68, 0.9);
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            z-index: 10000;
            font-family: 'Inter', sans-serif;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        `;
        errorDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Erro ao carregar dashboard. Recarregue a página.</span>
            </div>
        `;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => errorDiv.remove(), 5000);
    }
    
    // Configurações avançadas
    if (localStorage.getItem('dashboard-settings')) {
        try {
            const settings = JSON.parse(localStorage.getItem('dashboard-settings'));
            Object.assign(appState, settings);
            console.log('⚙️ Configurações personalizadas carregadas');
        } catch (e) {
            console.warn('⚠️ Erro ao carregar configurações personalizadas');
        }
    }
    
    // Detectar mudanças de foco para otimização
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            console.log('📱 Dashboard em segundo plano - otimizando performance');
            if (appState.updateInterval) {
                appState.refreshRate = Math.max(appState.refreshRate * 2, 10000); // Reduzir frequência
            }
        } else {
            console.log('👀 Dashboard ativo - restaurando performance');
            appState.refreshRate = 3000; // Restaurar frequência normal
        }
    });
    
    // Salvar configurações antes de sair
    window.addEventListener('beforeunload', () => {
        const settings = {
            soundEnabled: appState.soundEnabled,
            notifications: appState.notifications,
            theme: appState.theme,
            autoRefresh: appState.autoRefresh,
            refreshRate: appState.refreshRate
        };
        
        localStorage.setItem('dashboard-settings', JSON.stringify(settings));
        console.log('💾 Configurações salvas');
    });
    
    // Easter egg para desenvolvedores
    console.log(`
    ╔═══════════════════════════════════════════════════════════════╗
    ║                    🚀 CRYPTO DASHBOARD PREMIUM 🚀              ║
    ║                                                               ║
    ║  Desenvolvido com:                                            ║
    ║  • Flask + Python (Backend real-time)                       ║
    ║  • HTML5 + CSS3 + JavaScript ES6+ (Frontend)                ║
    ║  • Chart.js (Gráficos interativos)                          ║
    ║  • Bootstrap 5 (Design responsivo)                          ║
    ║  • Glassmorphism UI (Visual premium)                        ║
    ║                                                               ║
    ║  Recursos Premium:                                            ║
    ║  ✨ Efeitos visuais avançados                                ║
    ║  🎵 Sistema de áudio integrado                               ║
    ║  📱 Design totalmente responsivo                             ║
    ║  🔄 Atualizações em tempo real                               ║
    ║  📊 Gráficos interativos                                     ║
    ║  🎨 Animações fluidas                                        ║
    ║  🔔 Sistema de notificações                                  ║
    ║                                                               ║
    ║  Comandos úteis no console:                                  ║
    ║  • window.appState (ver estado da aplicação)                ║
    ║  • app.toggleSound() (ativar/desativar som)                 ║
    ║  • app.showStats() (estatísticas de performance)            ║
    ╚═══════════════════════════════════════════════════════════════╝
    `);
});

// Service Worker para cache (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/static/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(registrationError => console.log('SW registration failed'));
    });
}

// Export para testes (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { app, utils, chartManager, ui };
}
