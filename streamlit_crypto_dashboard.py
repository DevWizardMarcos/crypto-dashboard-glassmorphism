import streamlit as st
import pandas as pd
import numpy as np
import time
import random
from datetime import datetime
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots

class CryptoDashboard:
    def __init__(self):
        self.cryptos = {
            "BTC": {"name": "Bitcoin", "symbol": "₿", "price": 45000, "change": 0, "history": [], "color": "#F7931A"},
            "ETH": {"name": "Ethereum", "symbol": "Ξ", "price": 3200, "change": 0, "history": [], "color": "#627EEA"},
            "BNB": {"name": "Binance Coin", "symbol": "BNB", "price": 420, "change": 0, "history": [], "color": "#F3BA2F"},
            "SOL": {"name": "Solana", "symbol": "◎", "price": 95, "change": 0, "history": [], "color": "#9945FF"},
            "ADA": {"name": "Cardano", "symbol": "₳", "price": 0.65, "change": 0, "history": [], "color": "#0033AD"},
            "DOT": {"name": "Polkadot", "symbol": "●", "price": 8.5, "change": 0, "history": [], "color": "#E6007A"}
        }
        
        # Inicializar histórico
        for crypto in self.cryptos.values():
            crypto["history"] = [crypto["price"] + random.uniform(-crypto["price"]*0.02, crypto["price"]*0.02) for _ in range(50)]
    
    def update_prices(self):
        """Simula atualização de preços das criptomoedas"""
        for symbol, data in self.cryptos.items():
            # Simular mudança de preço (-3% a +3%)
            change_percent = random.uniform(-0.03, 0.03)
            old_price = data["price"]
            new_price = old_price * (1 + change_percent)
            
            data["price"] = new_price
            data["change"] = ((new_price - old_price) / old_price) * 100
            
            # Atualizar histórico
            data["history"].append(new_price)
            if len(data["history"]) > 100:
                data["history"].pop(0)
    
    def create_mini_chart(self, crypto_symbol, crypto_data):
        """Cria um mini gráfico para cada crypto"""
        history = crypto_data["history"][-20:]  # Últimos 20 pontos
        
        fig = go.Figure()
        fig.add_trace(go.Scatter(
            y=history,
            mode='lines',
            line=dict(
                color=crypto_data["color"],
                width=3,
                shape='spline'
            ),
            fill='tonexty',
            fillcolor=f'rgba{tuple(list(bytes.fromhex(crypto_data["color"][1:])) + [0.1])}',
            showlegend=False,
            hovertemplate='Preço: $%{y:,.2f}<extra></extra>'
        ))
        
        fig.update_layout(
            height=80,
            margin=dict(l=0, r=0, t=0, b=0),
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            xaxis=dict(showgrid=False, showticklabels=False, zeroline=False),
            yaxis=dict(showgrid=False, showticklabels=False, zeroline=False),
        )
        
        return fig

def apply_glassmorphism_style():
    """Aplica estilos CSS personalizados para efeito glassmorphism"""
    st.markdown("""
    <style>
    /* Importar fontes */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    /* Fundo principal */
    .stApp {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        font-family: 'Inter', sans-serif;
    }
    
    /* Estilo para métricas */
    .metric-card {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        padding: 20px;
        margin: 10px 0;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .metric-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
    }
    
    /* Header personalizado */
    .header-container {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        padding: 30px;
        margin-bottom: 30px;
        text-align: center;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    
    .header-title {
        font-size: 3rem;
        font-weight: 700;
        color: white;
        margin-bottom: 10px;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }
    
    .header-subtitle {
        font-size: 1rem;
        color: rgba(255, 255, 255, 0.8);
        font-weight: 300;
    }
    
    /* Cartões de crypto */
    .crypto-card {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        padding: 25px;
        margin: 15px 0;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    
    .crypto-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--crypto-color), transparent);
    }
    
    .crypto-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .crypto-symbol {
        font-size: 2rem;
        font-weight: 700;
        color: white;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }
    
    .crypto-name {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.7);
        font-weight: 300;
        margin-bottom: 10px;
    }
    
    .crypto-price {
        font-size: 1.8rem;
        font-weight: 600;
        color: white;
        margin: 10px 0;
    }
    
    .crypto-change {
        font-size: 1rem;
        font-weight: 500;
        padding: 5px 10px;
        border-radius: 10px;
        display: inline-block;
    }
    
    .positive {
        color: #00ff88;
        background: rgba(0, 255, 136, 0.1);
    }
    
    .negative {
        color: #ff4757;
        background: rgba(255, 71, 87, 0.1);
    }
    
    /* Ocultar elementos do Streamlit */
    #MainMenu {visibility: hidden;}
    .stDeployButton {display:none;}
    footer {visibility: hidden;}
    .stApp > header {visibility: hidden;}
    
    /* Customizar sidebar */
    .css-1d391kg {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(20px);
    }
    
    /* Customizar métricas do Streamlit */
    [data-testid="metric-container"] {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 15px;
        padding: 15px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    
    [data-testid="metric-container"] > div {
        color: white !important;
    }
    
    [data-testid="metric-container"] [data-testid="metric-value"] {
        color: white !important;
        font-size: 1.5rem !important;
        font-weight: 600 !important;
    }
    
    /* Animações */
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
        100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
    }
    
    .pulse {
        animation: pulse 2s infinite;
    }
    </style>
    """, unsafe_allow_html=True)

def main():
    # Configuração da página
    st.set_page_config(
        page_title="💹 Crypto Dashboard",
        page_icon="₿",
        layout="wide",
        initial_sidebar_state="collapsed"
    )
    
    # Aplicar estilos
    apply_glassmorphism_style()
    
    # Inicializar dashboard
    if 'dashboard' not in st.session_state:
        st.session_state.dashboard = CryptoDashboard()
    
    dashboard = st.session_state.dashboard
    
    # Header
    st.markdown("""
    <div class="header-container">
        <div class="header-title">💹 Crypto Dashboard</div>
        <div class="header-subtitle">Dashboard em Tempo Real com Efeito Glassmorphism</div>
        <div class="header-subtitle">Atualizado em: {}</div>
    </div>
    """.format(datetime.now().strftime("%H:%M:%S")), unsafe_allow_html=True)
    
    # Sidebar para controles
    with st.sidebar:
        st.markdown("### ⚙️ Controles")
        auto_refresh = st.checkbox("🔄 Auto Refresh", value=True)
        refresh_rate = st.slider("Taxa de Atualização (segundos)", 1, 10, 3)
        
        if st.button("🎲 Simular Mudanças"):
            dashboard.update_prices()
            st.rerun()
    
    # Atualizar preços automaticamente
    if auto_refresh:
        dashboard.update_prices()
        time.sleep(0.1)  # Pequena pausa para suavizar
    
    # Layout principal com 3 colunas
    col1, col2, col3 = st.columns(3)
    
    cryptos_list = list(dashboard.cryptos.items())
    
    # Primeira linha de cartões
    with col1:
        symbol, data = cryptos_list[0]
        change_class = "positive" if data["change"] >= 0 else "negative"
        change_symbol = "↗️" if data["change"] >= 0 else "↘️"
        
        st.markdown(f"""
        <div class="crypto-card" style="--crypto-color: {data['color']}">
            <div class="crypto-symbol">{data['symbol']} {symbol}</div>
            <div class="crypto-name">{data['name']}</div>
            <div class="crypto-price">${data['price']:,.2f}</div>
            <div class="crypto-change {change_class}">{change_symbol} {data['change']:+.2f}%</div>
        </div>
        """, unsafe_allow_html=True)
        
        # Mini gráfico
        fig = dashboard.create_mini_chart(symbol, data)
        st.plotly_chart(fig, use_container_width=True, config={'displayModeBar': False})
    
    with col2:
        symbol, data = cryptos_list[1]
        change_class = "positive" if data["change"] >= 0 else "negative"
        change_symbol = "↗️" if data["change"] >= 0 else "↘️"
        
        st.markdown(f"""
        <div class="crypto-card" style="--crypto-color: {data['color']}">
            <div class="crypto-symbol">{data['symbol']} {symbol}</div>
            <div class="crypto-name">{data['name']}</div>
            <div class="crypto-price">${data['price']:,.2f}</div>
            <div class="crypto-change {change_class}">{change_symbol} {data['change']:+.2f}%</div>
        </div>
        """, unsafe_allow_html=True)
        
        fig = dashboard.create_mini_chart(symbol, data)
        st.plotly_chart(fig, use_container_width=True, config={'displayModeBar': False})
    
    with col3:
        symbol, data = cryptos_list[2]
        change_class = "positive" if data["change"] >= 0 else "negative"
        change_symbol = "↗️" if data["change"] >= 0 else "↘️"
        
        st.markdown(f"""
        <div class="crypto-card" style="--crypto-color: {data['color']}">
            <div class="crypto-symbol">{data['symbol']} {symbol}</div>
            <div class="crypto-name">{data['name']}</div>
            <div class="crypto-price">${data['price']:,.2f}</div>
            <div class="crypto-change {change_class}">{change_symbol} {data['change']:+.2f}%</div>
        </div>
        """, unsafe_allow_html=True)
        
        fig = dashboard.create_mini_chart(symbol, data)
        st.plotly_chart(fig, use_container_width=True, config={'displayModeBar': False})
    
    # Segunda linha de cartões
    col4, col5, col6 = st.columns(3)
    
    with col4:
        symbol, data = cryptos_list[3]
        change_class = "positive" if data["change"] >= 0 else "negative"
        change_symbol = "↗️" if data["change"] >= 0 else "↘️"
        
        st.markdown(f"""
        <div class="crypto-card" style="--crypto-color: {data['color']}">
            <div class="crypto-symbol">{data['symbol']} {symbol}</div>
            <div class="crypto-name">{data['name']}</div>
            <div class="crypto-price">${data['price']:,.2f}</div>
            <div class="crypto-change {change_class}">{change_symbol} {data['change']:+.2f}%</div>
        </div>
        """, unsafe_allow_html=True)
        
        fig = dashboard.create_mini_chart(symbol, data)
        st.plotly_chart(fig, use_container_width=True, config={'displayModeBar': False})
    
    with col5:
        symbol, data = cryptos_list[4]
        change_class = "positive" if data["change"] >= 0 else "negative"
        change_symbol = "↗️" if data["change"] >= 0 else "↘️"
        
        st.markdown(f"""
        <div class="crypto-card" style="--crypto-color: {data['color']}">
            <div class="crypto-symbol">{data['symbol']} {symbol}</div>
            <div class="crypto-name">{data['name']}</div>
            <div class="crypto-price">${data['price']:,.2f}</div>
            <div class="crypto-change {change_class}">{change_symbol} {data['change']:+.2f}%</div>
        </div>
        """, unsafe_allow_html=True)
        
        fig = dashboard.create_mini_chart(symbol, data)
        st.plotly_chart(fig, use_container_width=True, config={'displayModeBar': False})
    
    with col6:
        symbol, data = cryptos_list[5]
        change_class = "positive" if data["change"] >= 0 else "negative"
        change_symbol = "↗️" if data["change"] >= 0 else "↘️"
        
        st.markdown(f"""
        <div class="crypto-card" style="--crypto-color: {data['color']}">
            <div class="crypto-symbol">{data['symbol']} {symbol}</div>
            <div class="crypto-name">{data['name']}</div>
            <div class="crypto-price">${data['price']:,.2f}</div>
            <div class="crypto-change {change_class}">{change_symbol} {data['change']:+.2f}%</div>
        </div>
        """, unsafe_allow_html=True)
        
        fig = dashboard.create_mini_chart(symbol, data)
        st.plotly_chart(fig, use_container_width=True, config={'displayModeBar': False})
    
    # Gráfico principal
    st.markdown("### 📊 Visão Geral do Mercado")
    
    # Criar gráfico combinado
    fig = make_subplots(
        rows=2, cols=3,
        subplot_titles=[f"{symbol} - {data['name']}" for symbol, data in dashboard.cryptos.items()],
        specs=[[{"secondary_y": False}]*3, [{"secondary_y": False}]*3]
    )
    
    positions = [(1,1), (1,2), (1,3), (2,1), (2,2), (2,3)]
    
    for idx, (symbol, data) in enumerate(dashboard.cryptos.items()):
        row, col = positions[idx]
        history = data["history"][-30:]  # Últimos 30 pontos
        
        fig.add_trace(
            go.Scatter(
                y=history,
                mode='lines+markers',
                name=symbol,
                line=dict(color=data["color"], width=2),
                marker=dict(size=4),
                showlegend=False
            ),
            row=row, col=col
        )
    
    fig.update_layout(
        height=500,
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        font=dict(color='white'),
        margin=dict(l=20, r=20, t=40, b=20)
    )
    
    fig.update_xaxes(showgrid=True, gridcolor='rgba(255,255,255,0.1)')
    fig.update_yaxes(showgrid=True, gridcolor='rgba(255,255,255,0.1)')
    
    st.plotly_chart(fig, use_container_width=True)
    
    # Footer
    st.markdown("""
    <div style="text-align: center; margin-top: 50px; color: rgba(255,255,255,0.5);">
        💹 Dashboard desenvolvido com Streamlit • Efeito Glassmorphism • Atualização em Tempo Real
    </div>
    """, unsafe_allow_html=True)
    
    # Auto refresh
    if auto_refresh:
        time.sleep(refresh_rate)
        st.rerun()

if __name__ == "__main__":
    main()
