# 💹 Crypto Dashboard - Glassmorphism

Um dashboard moderno e interativo de criptomoedas em tempo real com efeito visual Glassmorphism, desenvolvido com Flask, Bootstrap 5 e JavaScript moderno.

## ✨ Características Principais

### 🎨 Design Moderno
- **Efeito Glassmorphism** com backdrop-filter blur
- **Gradiente animado** de fundo com movimento fluido
- **Cards translúcidos** com bordas neon dinâmicas
- **Animações suaves** usando Animate.css
- **Design totalmente responsivo** para todos os dispositivos

### 📊 Funcionalidades Avançadas
- **Atualização em tempo real** a cada 3 segundos
- **6 Criptomoedas principais**: Bitcoin, Ethereum, Binance Coin, Solana, Cardano, Polkadot
- **Mini gráficos interativos** para cada criptomoeda usando Chart.js
- **Gráfico principal combinado** com múltiplas linhas
- **Resumo do mercado** com métricas importantes
- **Indicadores visuais** de alta/baixa com cores dinâmicas

### 🚀 Tecnologias Utilizadas
- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Framework CSS**: Bootstrap 5
- **Gráficos**: Chart.js
- **Animações**: Animate.css
- **Ícones**: Font Awesome
- **Fontes**: Google Fonts (Inter + Orbitron)

## 🛠️ Instalação e Execução

### Pré-requisitos
- Python 3.8 ou superior
- pip (gerenciador de pacotes Python)

### Passos para instalação

1. **Clone ou baixe o projeto**:
   ```bash
   cd "c:\Users\INFINITY SCHOOL\Documents\MS\projeto flet"
   ```

2. **Instale as dependências**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Execute a aplicação**:
   ```bash
   python app.py
   ```

4. **Acesse no navegador**:
   ```
   http://localhost:5000
   ```

## 📁 Estrutura do Projeto

```
projeto flet/
├── app.py                 # Servidor Flask principal
├── requirements.txt       # Dependências Python
├── README.md             # Documentação
├── templates/
│   └── index.html        # Template HTML principal
├── static/
│   ├── css/
│   │   └── style.css     # Estilos personalizados
│   └── js/
│       └── app.js        # JavaScript principal
└── [outros arquivos...]
```

## 🎯 Funcionalidades Detalhadas

### 📱 Interface do Usuário
- **Header glassmorphism** com título animado e status live
- **Cards de resumo** com ícones e métricas do mercado
- **Cards de criptomoedas** com:
  - Preço em tempo real
  - Variação percentual com cores dinâmicas
  - Mini gráfico de tendência
  - Estatísticas detalhadas (24h, volume, market cap)
- **Gráfico principal** interativo com múltiplas linhas
- **Loading overlay** com spinner animado

### ⚡ Performance e UX
- **Atualizações assíncronas** sem recarregar a página
- **Debounce** em interações para evitar spam
- **Animações otimizadas** com CSS transforms
- **Fallbacks** para casos de erro de rede
- **Design responsivo** com breakpoints personalizados

### 🔧 API Endpoints
- `GET /` - Página principal
- `GET /api/cryptos` - Dados completos das criptomoedas
- `GET /api/history/<symbol>` - Histórico de preços

### 🎨 Efeitos Visuais
- **Background animado** com gradientes em movimento
- **Glassmorphism cards** com blur e transparência
- **Hover effects** com transformações 3D
- **Neon borders** baseadas na cor de cada crypto
- **Pulse animations** para elementos em destaque
- **Loading states** suaves e elegantes

## 🚀 Melhorias Futuras

- [ ] Integração com API real de criptomoedas (CoinGecko/Binance)
- [ ] Sistema de alertas de preço
- [ ] Modo escuro/claro
- [ ] Mais timeframes (1h, 24h, 7d, 30d)
- [ ] Gráficos de candlesticks
- [ ] Portfolio tracker
- [ ] PWA (Progressive Web App)
- [ ] WebSocket para updates em tempo real

## 📊 Screenshots e Demo

O dashboard apresenta um visual moderno com:
- Fundo gradiente animado
- Cards translúcidos com efeito blur
- Gráficos interativos e responsivos
- Cores dinâmicas baseadas na performance
- Animações fluidas em todas as interações

## 🤝 Contribuição

Sinta-se à vontade para contribuir com melhorias, correções de bugs ou novas funcionalidades!

---

**Desenvolvido com ❤️ usando Flask, Bootstrap e JavaScript moderno**

*Um projeto que combina design moderno com funcionalidade avançada para criar a melhor experiência de dashboard de criptomoedas.*
