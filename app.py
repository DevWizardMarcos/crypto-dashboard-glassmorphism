from flask import Flask, render_template, jsonify
import random
import time
from datetime import datetime
import threading

app = Flask(__name__)

class CryptoDashboard:
    def __init__(self):
        self.cryptos = {
            "BTC": {
                "name": "Bitcoin", 
                "symbol": "₿", 
                "price": 45000, 
                "change": 0, 
                "change_24h": 0,
                "volume": "28.5B",
                "market_cap": "850B",
                "history": [], 
                "color": "#F7931A",
                "icon": "bitcoin"
            },
            "ETH": {
                "name": "Ethereum", 
                "symbol": "Ξ", 
                "price": 3200, 
                "change": 0, 
                "change_24h": 0,
                "volume": "15.2B",
                "market_cap": "385B",
                "history": [], 
                "color": "#627EEA",
                "icon": "ethereum"
            },
            "BNB": {
                "name": "Binance Coin", 
                "symbol": "BNB", 
                "price": 420, 
                "change": 0, 
                "change_24h": 0,
                "volume": "2.1B",
                "market_cap": "65B",
                "history": [], 
                "color": "#F3BA2F",
                "icon": "bnb"
            },
            "SOL": {
                "name": "Solana", 
                "symbol": "◎", 
                "price": 95, 
                "change": 0, 
                "change_24h": 0,
                "volume": "1.8B",
                "market_cap": "42B",
                "history": [], 
                "color": "#9945FF",
                "icon": "solana"
            },
            "ADA": {
                "name": "Cardano", 
                "symbol": "₳", 
                "price": 0.65, 
                "change": 0, 
                "change_24h": 0,
                "volume": "850M",
                "market_cap": "23B",
                "history": [], 
                "color": "#0033AD",
                "icon": "cardano"
            },
            "DOT": {
                "name": "Polkadot", 
                "symbol": "●", 
                "price": 8.5, 
                "change": 0, 
                "change_24h": 0,
                "volume": "450M",
                "market_cap": "12B",
                "history": [], 
                "color": "#E6007A",
                "icon": "polkadot"
            }
        }
        
        # Inicializar histórico
        for crypto in self.cryptos.values():
            base_price = crypto["price"]
            crypto["history"] = [
                base_price + random.uniform(-base_price*0.05, base_price*0.05) 
                for _ in range(100)
            ]
    
    def update_prices(self):
        """Simula atualização de preços das criptomoedas"""
        for symbol, data in self.cryptos.items():
            # Simular mudança de preço (-4% a +4%)
            change_percent = random.uniform(-0.04, 0.04)
            old_price = data["price"]
            new_price = old_price * (1 + change_percent)
            
            data["price"] = new_price
            data["change"] = ((new_price - old_price) / old_price) * 100
            data["change_24h"] = random.uniform(-15, 15)  # Mudança fictícia de 24h
            
            # Atualizar histórico
            data["history"].append(new_price)
            if len(data["history"]) > 100:
                data["history"].pop(0)
    
    def get_market_summary(self):
        """Retorna resumo do mercado"""
        total_market_cap = sum([float(crypto["market_cap"].replace('B', '')) * 1000000000 + 
                               float(crypto["market_cap"].replace('M', '')) * 1000000 
                               if 'M' in crypto["market_cap"] else 
                               float(crypto["market_cap"].replace('B', '')) * 1000000000 
                               for crypto in self.cryptos.values()])
        
        gaining = sum(1 for crypto in self.cryptos.values() if crypto["change"] > 0)
        losing = len(self.cryptos) - gaining
        
        return {
            "total_market_cap": f"${total_market_cap/1000000000:.1f}T",
            "gaining": gaining,
            "losing": losing,
            "fear_greed_index": random.randint(20, 80)
        }

# Instância global do dashboard
dashboard = CryptoDashboard()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/cryptos')
def get_cryptos():
    """API endpoint para obter dados das criptomoedas"""
    dashboard.update_prices()
    return jsonify({
        "cryptos": dashboard.cryptos,
        "market_summary": dashboard.get_market_summary(),
        "timestamp": datetime.now().strftime("%H:%M:%S")
    })

@app.route('/api/history/<symbol>')
def get_history(symbol):
    """API endpoint para obter histórico de uma criptomoeda"""
    if symbol in dashboard.cryptos:
        return jsonify({
            "symbol": symbol,
            "history": dashboard.cryptos[symbol]["history"][-50:],  # Últimos 50 pontos
            "color": dashboard.cryptos[symbol]["color"]
        })
    return jsonify({"error": "Cryptocurrency not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)
