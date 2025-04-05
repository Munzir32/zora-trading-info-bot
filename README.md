# Zora AI Trading Assistant 🤖

![Zora Protocol](https://zora.co/assets/zora-logo.svg)

A powerful Telegram bot that provides real-time trading analysis, price tracking, and AI-powered insights for tokens on the Zora Protocol.

## 📝 What It Does

The Zora AI Trading Assistant is a comprehensive tool that helps NFT traders navigate the Zora Protocol ecosystem. It combines real-time market data with AI-powered analysis to provide actionable trading insights. Users can track token prices, manage their portfolio, receive trading signals with entry/exit points, and get risk assessments—all through a simple Telegram interface. The bot simplifies complex blockchain data into clear, actionable recommendations, making NFT trading more accessible and informed.

## 🌟 Features

- **Real-time Price Tracking**: Get instant price updates for any Zora token
- **Portfolio Management**: Track your Zora token holdings in one place
- **AI-Powered Analysis**: Receive intelligent market analysis and trading recommendations
- **Trading Signals**: Get entry/exit points, stop-loss levels, and take-profit targets
- **Risk Assessment**: Understand market risks with comprehensive risk analysis
- **Market Status**: Monitor primary mint and secondary market activity

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Telegram Bot Token (from [@BotFather](https://t.me/BotFather))
- OpenAI API Key
- Ethereum RPC URL (Zora network)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/zora-trading-bot.git
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
   RPC_URL=https://rpc.zora.energy
   ```

4. Build the project:
   ```bash
   npm run build
   ```

5. Start the bot:
   ```bash
   npm start
   ```

## 🚀 Hosting Options

There are several ways to host your Zora AI Trading Assistant:

### Option 1: Cloud VPS (Recommended)

1. **Set up a VPS**:
   - Rent a VPS from providers like [DigitalOcean](https://www.digitalocean.com/), [Linode](https://www.linode.com/), or [AWS EC2](https://aws.amazon.com/ec2/)
   - Recommended specs: 1GB RAM, 1 vCPU, Ubuntu 20.04 or newer

2. **Deploy your bot**:
   ```bash
   # SSH into your server
   ssh user@your-server-ip
   
   # Clone your repository
   git clone https://github.com/yourusername/zora-trading-bot.git
   cd zora-trading-bot
   
   # Install dependencies
   npm install
   
   # Create .env file
   nano .env
   # Add your environment variables
   
   # Build the project
   npm run build
   
   # Install PM2 for process management
   npm install -g pm2
   
   # Start the bot with PM2
   pm2 start dist/bot.js --name "zora-bot"
   
   # Make PM2 start on system reboot
   pm2 startup
   pm2 save
   ```

### Option 2: Serverless Deployment

1. **Prepare for serverless**:
   - Modify your bot to work with serverless functions
   - Create a webhook endpoint for Telegram updates

2. **Deploy to serverless platforms**:
   - [Vercel](https://vercel.com/): Good for Node.js applications
   - [Netlify Functions](https://www.netlify.com/products/functions/): Easy deployment
   - [AWS Lambda](https://aws.amazon.com/lambda/): Scalable serverless functions

3. **Set up Telegram webhook**:
   ```bash
   # Replace with your bot token and serverless function URL
   curl -F "url=https://your-serverless-function.com/webhook" https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook
   ```

### Option 3: Docker Deployment

1. **Create a Dockerfile**:
   ```dockerfile
   FROM node:16-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm install
   
   COPY . .
   RUN npm run build
   
   CMD ["node", "dist/bot.js"]
   ```

2. **Build and run with Docker**:
   ```bash
   # Build the Docker image
   docker build -t zora-trading-bot .
   
   # Run the container
   docker run -d --name zora-bot --env-file .env zora-trading-bot
   ```

3. **Deploy to container platforms**:
   - [Docker Hub](https://hub.docker.com/): For container registry
   - [Kubernetes](https://kubernetes.io/): For orchestration
   - [AWS ECS](https://aws.amazon.com/ecs/): For managed container service

### Maintenance Tips

- **Monitor your bot**: Use tools like PM2, Docker logs, or cloud monitoring services
- **Set up alerts**: Configure notifications for when your bot goes down
- **Regular updates**: Keep dependencies updated for security patches
- **Backup your data**: If you're storing user data, implement regular backups

## 💬 Bot Commands

- `/start` - Display welcome message and available commands
- `/price <contract> <tokenId>` - Get real-time price for a token
- `/track <contract> <tokenId>` - Add a token to your portfolio
- `/portfolio` - View your tracked tokens
- `/analyze <contract> <tokenId>` - Get AI analysis for a token
- `/trade <contract> <tokenId>` - Get detailed trading analysis with signals
- `/alerts` - Set up price alerts (coming soon)

## 🔧 Architecture

The project is structured as follows:

- `src/bot.ts` - Main Telegram bot implementation
- `src/services/zoraService.ts` - Zora Protocol integration
- `src/services/aiService.ts` - OpenAI integration for analysis

## 🛠️ Technologies Used

- **TypeScript** - For type-safe code
- **Node.js** - Runtime environment
- **Telegram Bot API** - For bot functionality
- **OpenAI API** - For AI-powered analysis
- **Zora Protocol SDK** - For blockchain interaction
- **Ethers.js** - For Ethereum interaction
- **Viem** - For blockchain data

## 📊 Trading Analysis Features

The bot provides comprehensive trading analysis including:

- **Market Status**: Primary mint and secondary market activity
- **Price Analysis**: Current price, trends, and volatility
- **Trading Signals**: Entry/exit points, stop-loss, and take-profit levels
- **Risk Assessment**: Risk level, market liquidity, and volatility risk
- **Recommendations**: Actionable trading advice

## 🎯 The Problem It Solves

The Zora AI Trading Assistant addresses several key challenges in the NFT trading space:

- **Information Overload**: NFT traders often struggle to process vast amounts of market data to make informed decisions. Our bot aggregates and analyzes this data to provide clear, actionable insights.

- **Risk Management**: Many traders lack proper risk management strategies. Our bot provides comprehensive risk assessment and specific stop-loss/take-profit levels.

- **Market Timing**: Determining the optimal entry and exit points is crucial. Our AI-powered analysis helps identify these opportunities.

- **Portfolio Tracking**: Managing multiple NFT holdings across different collections can be complex. Our bot centralizes this information in one place.

- **Technical Barriers**: The Zora Protocol ecosystem can be intimidating for newcomers. Our bot simplifies interaction with the protocol through an intuitive Telegram interface.

## 🧩 Challenges We Ran Into

During development, we encountered several significant challenges:

- **SDK Integration**: The Zora Protocol SDK had some type compatibility issues with the Viem library, requiring careful type casting and parameter handling.

- **BigInt Serialization**: JSON serialization of BigInt values from blockchain data required special handling to ensure proper conversion to strings.

- **Real-time Data**: Ensuring accurate real-time price data from the Zora network required implementing robust error handling and fallback mechanisms.

- **AI Analysis Quality**: Balancing the depth of AI analysis with response time was challenging. We optimized the prompts to provide valuable insights while maintaining quick response times.

- **User Experience**: Creating a seamless experience within Telegram's message constraints required careful formatting of complex trading data into readable messages.

## 🛠️ How We Built It

The Zora AI Trading Assistant was built through a systematic approach:

1. **Architecture Design**: We designed a modular architecture with separate services for Zora Protocol interaction, AI analysis, and Telegram bot functionality.

2. **Zora Integration**: We implemented the Zora Service to interact with the Zora Protocol SDK, handling token data retrieval, price tracking, and market analysis.

3. **AI Analysis Engine**: We developed an AI Service that leverages OpenAI's GPT models to provide intelligent market analysis and trading recommendations.

4. **Telegram Bot Interface**: We created a user-friendly Telegram bot interface with intuitive commands and well-formatted responses.

5. **Trading Analysis Logic**: We implemented comprehensive trading analysis algorithms that process market data to generate entry/exit points, risk assessments, and recommendations.

6. **Testing & Refinement**: We continuously tested the bot with real Zora tokens and refined the analysis algorithms based on performance.

## 📚 What We Learned

This project provided valuable insights into several areas:

- **Blockchain Integration**: We gained deep experience in integrating with the Zora Protocol and handling blockchain data effectively.

- **AI in Trading**: We learned how to effectively combine AI analysis with traditional trading signals to provide more comprehensive insights.

- **Telegram Bot Development**: We developed expertise in creating robust Telegram bots with complex functionality.

- **TypeScript Best Practices**: We improved our TypeScript skills, particularly in handling complex type definitions and ensuring type safety.

- **Error Handling**: We learned the importance of robust error handling in blockchain applications, where network issues and data inconsistencies are common.

## 🚀 What's Next for Zora AI Trading Assistant

We have exciting plans to enhance the bot's capabilities:

- **Price Alerts**: Implementing customizable price alerts for tracked tokens.

- **Advanced Charting**: Adding visual charts and graphs for price history and trends.

- **Social Sentiment Analysis**: Incorporating social media sentiment analysis to enhance trading signals.

- **Automated Trading**: Developing limited automated trading capabilities for trusted users.

- **Multi-chain Support**: Expanding to support other NFT marketplaces beyond Zora.

- **Community Features**: Adding community-driven insights and shared portfolio tracking.

- **Mobile App**: Developing a companion mobile app for more detailed analysis and portfolio management.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- [Zora Protocol](https://zora.co/) for their amazing platform
- [OpenAI](https://openai.com/) for their powerful AI capabilities
- [Telegram Bot API](https://core.telegram.org/bots/api) for the bot framework

---

Made with ❤️ for the Zora community 