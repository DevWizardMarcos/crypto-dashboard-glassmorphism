# 💹 Crypto Dashboard - Glassmorphism

Um dashboard moderno de criptomoedas em tempo real com efeito visual Glassmorphism, desenvolvido em Python usando Streamlit.

## ✨ Características

- **Visual Glassmorphism**: Cartões com efeito de vidro translúcido usando CSS customizado
- **Atualização em Tempo Real**: Preços simulados que se atualizam automaticamente
- **Bordas Neon**: Efeitos de sombra colorida baseados na variação de preço
- **Gráficos Interativos**: Gráficos de linha suaves usando Plotly
- **6 Criptomoedas**: Bitcoin, Ethereum, Binance Coin, Solana, Cardano e Polkadot
- **Design Responsivo**: Interface adaptável com gradiente escuro
- **Controles Interativos**: Sidebar com opções de auto-refresh e taxa de atualização

## 🚀 Como Executar

### Versão Streamlit (Recomendada)

1. **Instalar dependências**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Executar o dashboard Streamlit**:
   ```bash
   streamlit run streamlit_crypto_dashboard.py
   ```

### Versão Flet (Alternativa)

1. **Instalar Flet**:
   ```bash
   pip install flet>=0.21.0
   ```

2. **Executar o dashboard Flet**:
   ```bash
   python main.py
   ```

## 🎨 Efeitos Visuais

### Streamlit Version
- **CSS Glassmorphism**: Backdrop-filter blur para efeito de vidro
- **Gradiente Animado**: Fundo com transição suave entre cores
- **Hover Effects**: Animações ao passar o mouse sobre os cartões
- **Plotly Charts**: Gráficos interativos com animações
- **Responsivo**: Design que se adapta a diferentes tamanhos de tela

### Flet Version
- **Opacity**: Transparência nos cartões para efeito glassmorphism
- **Background Blur**: Desfoque de fundo para profundidade visual
- **Bordas Neon**: Sombras coloridas que mudam com base na variação de preço
- **Animações**: Transições suaves nos cartões
- **Gradiente**: Fundo com degradê em tons de roxo, azul e anil

## 📊 Funcionalidades

### Streamlit Dashboard
- Controles na sidebar para auto-refresh e taxa de atualização
- Gráficos interativos com Plotly para cada criptomoeda
- Visualização em grid responsivo (3x2)
- Símbolos únicos para cada criptomoeda
- Cores personalizadas por crypto
- Gráfico combinado na parte inferior

### Flet Dashboard
- Simulação de preços de criptomoedas com variações reais
- Histórico de preços para mini gráficos
- Indicadores visuais de alta/baixa (verde/vermelho)
- Timestamp de última atualização
- Interface totalmente em tempo real

## 🛠️ Tecnologias

### Streamlit Version
- **Python 3.8+**
- **Streamlit**: Framework web para data apps
- **Plotly**: Gráficos interativos
- **Pandas & Numpy**: Manipulação de dados
- **CSS personalizado**: Para efeitos glassmorphism

### Flet Version
- **Python 3.8+**
- **Flet**: Framework para interfaces modernas
- **Asyncio**: Para atualizações assíncronas

## 📱 Interface

### Streamlit Dashboard
- Header glassmorphism com título e timestamp
- Sidebar com controles interativos
- 6 cartões de criptomoedas em layout 3x2
- Cada cartão mostra: símbolo, nome, preço atual, variação percentual e mini gráfico
- Gráfico combinado com subplots para todas as cryptos
- Footer informativo

### Flet Dashboard
- Header glassmorphism com título e timestamp
- 6 cartões de criptomoedas organizados em 2 fileiras
- Cada cartão mostra: símbolo, nome, preço atual, variação percentual e mini gráfico
- Footer com informações do sistema

## 🚀 Funcionalidades Avançadas

- **Auto-refresh**: Atualização automática configurável
- **Simulação realista**: Variações de preço baseadas em percentuais reais
- **Histórico de preços**: Mantém histórico para gráficos de tendência
- **Cores dinâmicas**: Cores que mudam baseadas na performance
- **Responsividade**: Interface que se adapta a diferentes dispositivos

Desenvolvido com ❤️ usando Streamlit e Flet Frameworks
