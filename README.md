# Zora AI Trading Assistant Bot

An AI-powered Telegram bot for trading on the Zora Protocol, featuring real-time price alerts, market analysis, and portfolio tracking.

## Features

- Real-time coin price alerts
- AI-powered trading signals
- Portfolio tracking
- Market sentiment analysis
- Automated trading strategies
- Performance analytics
- Risk management alerts

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Telegram Bot Token (from [@BotFather](https://t.me/botfather))
- OpenAI API Key
- Zora Protocol API Key
- Ethereum RPC URL

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd zora-trading-bot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
OPENAI_API_KEY=your_openai_api_key
ZORA_API_KEY=your_zora_api_key
ETHEREUM_RPC_URL=your_ethereum_rpc_url
```

## Usage

1. Build the project:
```bash
npm run build
```

2. Start the bot:
```bash
npm start
```

For development:
```bash
npm run dev
```

## Available Commands

- `/start` - Start the bot and view available commands
- `/price <coin>` - Get real-time price for a specific coin
- `/portfolio` - View your portfolio
- `/analyze <coin>` - Get AI analysis for a specific coin
- `/alerts` - Set up price alerts

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC 