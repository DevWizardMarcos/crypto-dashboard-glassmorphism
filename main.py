import flet as ft
import asyncio
import random
import math
from datetime import datetime
import threading
import time

class CryptoDashboard:
    def __init__(self):
        self.cryptos = {
            "BTC": {"name": "Bitcoin", "price": 45000, "change": 0, "history": []},
            "ETH": {"name": "Ethereum", "price": 3200, "change": 0, "history": []},
            "BNB": {"name": "Binance Coin", "price": 420, "change": 0, "history": []},
            "SOL": {"name": "Solana", "price": 95, "change": 0, "history": []},
            "ADA": {"name": "Cardano", "price": 0.65, "change": 0, "history": []},
            "DOT": {"name": "Polkadot", "price": 8.5, "change": 0, "history": []}
        }
        
        # Inicializar histórico
        for crypto in self.cryptos.values():
            crypto["history"] = [crypto["price"]] * 20
        
        self.cards = {}
        self.charts = {}
        self.is_running = True
        
    def create_glassmorphism_card(self, crypto_symbol, crypto_data):
        """Cria um cartão com efeito glassmorphism"""
        
        # Determinar cor baseada na mudança
        change_color = ft.colors.GREEN_400 if crypto_data["change"] >= 0 else ft.colors.RED_400
        change_icon = "trending_up" if crypto_data["change"] >= 0 else "trending_down"
        
        # Mini gráfico usando pontos
        chart_points = []
        history = crypto_data["history"][-10:]  # Últimos 10 pontos
        if len(history) > 1:
            min_val = min(history)
            max_val = max(history)
            range_val = max_val - min_val if max_val != min_val else 1
            
            for i, val in enumerate(history):
                normalized = (val - min_val) / range_val
                chart_points.append(
                    ft.Container(
                        width=3,
                        height=20 * normalized + 5,
                        bgcolor=change_color,
                        border_radius=1,
                        opacity=0.8,
                    )
                )
        
        chart_container = ft.Row(
            controls=chart_points,
            spacing=2,
            alignment=ft.MainAxisAlignment.CENTER,
        ) if chart_points else ft.Container(height=25)
        
        card = ft.Container(
            content=ft.Column([
                # Header com símbolo e mudança
                ft.Row([
                    ft.Container(
                        content=ft.Text(
                            crypto_symbol,
                            size=18,
                            weight=ft.FontWeight.BOLD,
                            color=ft.colors.WHITE,
                        ),
                        padding=ft.padding.all(8),
                        bgcolor=change_color,
                        border_radius=8,
                        opacity=0.9,
                    ),
                    ft.Icon(
                        change_icon,
                        color=change_color,
                        size=20,
                    )
                ], 
                alignment=ft.MainAxisAlignment.SPACE_BETWEEN),
                
                # Nome da crypto
                ft.Text(
                    crypto_data["name"],
                    size=12,
                    color=ft.colors.WHITE70,
                    weight=ft.FontWeight.W_300,
                ),
                
                # Preço
                ft.Text(
                    f"${crypto_data['price']:,.2f}",
                    size=24,
                    weight=ft.FontWeight.BOLD,
                    color=ft.colors.WHITE,
                ),
                
                # Mudança percentual
                ft.Text(
                    f"{crypto_data['change']:+.2f}%",
                    size=14,
                    color=change_color,
                    weight=ft.FontWeight.W_500,
                ),
                
                # Mini gráfico
                ft.Container(
                    content=chart_container,
                    height=35,
                    alignment=ft.alignment.center,
                ),
                
            ],
            spacing=8,
            horizontal_alignment=ft.CrossAxisAlignment.CENTER,
            ),
            
            # Estilo Glassmorphism
            bgcolor=ft.colors.with_opacity(0.1, ft.colors.WHITE),
            border=ft.border.all(1, ft.colors.with_opacity(0.2, ft.colors.WHITE)),
            border_radius=20,
            padding=ft.padding.all(20),
            blur=ft.Blur(10, 10, ft.BlurTileMode.MIRROR),
            shadow=ft.BoxShadow(
                spread_radius=1,
                blur_radius=15,
                color=ft.colors.with_opacity(0.3, change_color),
                offset=ft.Offset(0, 5),
            ),
            width=200,
            height=250,
            animate=ft.animation.Animation(300, ft.AnimationCurve.EASE_OUT),
        )
        
        return card
    
    def create_header(self):
        """Cria o cabeçalho do dashboard"""
        return ft.Container(
            content=ft.Column([
                ft.Row([
                    ft.Icon(
                        ft.icons.CURRENCY_BITCOIN,
                        size=40,
                        color=ft.colors.AMBER_400,
                    ),
                    ft.Text(
                        "Crypto Dashboard",
                        size=32,
                        weight=ft.FontWeight.BOLD,
                        color=ft.colors.WHITE,
                    ),
                ], 
                alignment=ft.MainAxisAlignment.CENTER,
                spacing=15),
                
                ft.Text(
                    f"Atualizado em {datetime.now().strftime('%H:%M:%S')}",
                    size=14,
                    color=ft.colors.WHITE60,
                    text_align=ft.TextAlign.CENTER,
                ),
            ],
            horizontal_alignment=ft.CrossAxisAlignment.CENTER,
            spacing=10,
            ),
            
            bgcolor=ft.colors.with_opacity(0.1, ft.colors.WHITE),
            border=ft.border.all(1, ft.colors.with_opacity(0.2, ft.colors.WHITE)),
            border_radius=15,
            padding=ft.padding.all(20),
            blur=ft.Blur(15, 15, ft.BlurTileMode.MIRROR),
            margin=ft.margin.only(bottom=30),
        )
    
    def update_prices(self):
        """Simula atualização de preços das criptomoedas"""
        for symbol, data in self.cryptos.items():
            # Simular mudança de preço (-5% a +5%)
            change_percent = random.uniform(-0.05, 0.05)
            old_price = data["price"]
            new_price = old_price * (1 + change_percent)
            
            data["price"] = new_price
            data["change"] = ((new_price - old_price) / old_price) * 100
            
            # Atualizar histórico
            data["history"].append(new_price)
            if len(data["history"]) > 50:  # Manter apenas os últimos 50 pontos
                data["history"].pop(0)
    
    async def price_updater(self, page: ft.Page):
        """Atualiza preços automaticamente"""
        while self.is_running:
            await asyncio.sleep(2)  # Atualizar a cada 2 segundos
            
            self.update_prices()
            
            # Atualizar cartões
            for symbol in self.cryptos:
                if symbol in self.cards:
                    self.cards[symbol] = self.create_glassmorphism_card(symbol, self.cryptos[symbol])
            
            # Atualizar timestamp no header
            if hasattr(self, 'header'):
                self.header = self.create_header()
            
            try:
                await page.update_async()
            except:
                break
    
    def build_dashboard(self, page: ft.Page):
        """Constrói o dashboard principal"""
        page.title = "Crypto Dashboard - Glassmorphism"
        page.theme_mode = ft.ThemeMode.DARK
        page.bgcolor = ft.colors.BLACK
        page.window_width = 1200
        page.window_height = 800
        
        # Criar fundo com gradiente
        background = ft.Container(
            gradient=ft.LinearGradient([
                ft.colors.PURPLE_900,
                ft.colors.BLUE_900,
                ft.colors.INDIGO_900,
            ],
            begin=ft.alignment.top_left,
            end=ft.alignment.bottom_right,
            ),
            expand=True,
        )
        
        # Criar header
        self.header = self.create_header()
        
        # Criar cartões de criptomoedas
        crypto_cards = []
        for symbol, data in self.cryptos.items():
            card = self.create_glassmorphism_card(symbol, data)
            self.cards[symbol] = card
            crypto_cards.append(card)
        
        # Layout principal
        main_content = ft.Column([
            self.header,
            
            ft.Container(
                content=ft.Row(
                    crypto_cards[:3],
                    alignment=ft.MainAxisAlignment.SPACE_EVENLY,
                    wrap=True,
                ),
                margin=ft.margin.only(bottom=20),
            ),
            
            ft.Container(
                content=ft.Row(
                    crypto_cards[3:],
                    alignment=ft.MainAxisAlignment.SPACE_EVENLY,
                    wrap=True,
                ),
            ),
            
            # Footer
            ft.Container(
                content=ft.Text(
                    "💹 Dashboard atualizado em tempo real com efeito Glassmorphism",
                    size=12,
                    color=ft.colors.WHITE38,
                    text_align=ft.TextAlign.CENTER,
                ),
                margin=ft.margin.only(top=30),
            ),
            
        ],
        scroll=ft.ScrollMode.AUTO,
        horizontal_alignment=ft.CrossAxisAlignment.CENTER,
        spacing=0,
        )
        
        # Stack com fundo e conteúdo
        page.add(
            ft.Stack([
                background,
                ft.Container(
                    content=main_content,
                    padding=ft.padding.all(30),
                    expand=True,
                )
            ])
        )
        
        # Iniciar atualizador de preços
        asyncio.create_task(self.price_updater(page))

def main(page: ft.Page):
    dashboard = CryptoDashboard()
    dashboard.build_dashboard(page)

if __name__ == "__main__":
    ft.app(main)
