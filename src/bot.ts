import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { createZoraService } from './services/zoraService.js';
import OpenAI from 'openai';
import TelegramBot from 'node-telegram-bot-api';

// Load environment variables
dotenv.config();

// Initialize services
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const zoraService = createZoraService(provider, process.env.OPENAI_API_KEY!);
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true });

interface PortfolioData {
    amount: number;
    value: number;
    tokenId: string;
}

const userPortfolios = new Map<number, Record<string, PortfolioData>>();

// Command handlers
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, 'Welcome to Zora AI Trading Assistant! 🚀\n\nAvailable commands:\n/price <contract> <tokenId> - Get real-time price\n/track <contract> <tokenId> - Track a token in your portfolio\n/portfolio - View your portfolio\n/analyze <contract> <tokenId> - Get AI analysis\n/alerts - Set up price alerts');
});

bot.onText(/\/track (.+) (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const contractAddress = match![1].toLowerCase();
    const tokenId = match![2];
    
    try {
        if (!contractAddress.startsWith('0x') || contractAddress.length !== 42) {
            await bot.sendMessage(chatId, 'Invalid contract address. Please provide a valid Ethereum address.');
            return;
        }

        // Get token price
        const price = await zoraService.getTokenPrice(tokenId, contractAddress);
        
        // Initialize or update portfolio
        let portfolio = userPortfolios.get(chatId) || {};
        portfolio[contractAddress] = {
            amount: 1, // Default to tracking 1 token
            value: price,
            tokenId
        };
        userPortfolios.set(chatId, portfolio);
        
        await bot.sendMessage(chatId, `Now tracking token ${tokenId} from contract ${contractAddress} at price ${price}`);
    } catch (error) {
        console.error('Error tracking token:', error);
        await bot.sendMessage(chatId, 'Error tracking token. Please make sure the contract address and token ID are correct and try again.');
    }
});

bot.onText(/\/price (.+) (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const contractAddress = match![1].toLowerCase();
    const tokenId = match![2];
    
    try {
        // Validate address format
        if (!contractAddress.startsWith('0x') || contractAddress.length !== 42) {
            await bot.sendMessage(chatId, 'Invalid contract address. Please provide a valid Ethereum address.');
            return;
        }

        const price = await zoraService.getTokenPrice(tokenId, contractAddress);
        await bot.sendMessage(chatId, `Current price for token ${tokenId}: ${price}`);
    } catch (error) {
        console.error('Error fetching price:', error);
        await bot.sendMessage(chatId, 'Error fetching price. Please make sure the contract address and token ID are correct and try again.');
    }
});

bot.onText(/\/analyze (.+) (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const contractAddress = match![1].toLowerCase();
    const tokenId = match![2];
    
    try {
        // Validate address format
        if (!contractAddress.startsWith('0x') || contractAddress.length !== 42) {
            await bot.sendMessage(chatId, 'Invalid contract address. Please provide a valid Ethereum address.');
            return;
        }

        // Get market data
        const marketData = await zoraService.getTokenMarketData(tokenId, contractAddress);
        
        // Generate AI analysis
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a professional crypto trading analyst. Provide concise, actionable insights." },
                { role: "user", content: `Analyze this market data: ${JSON.stringify(marketData)}` }
            ],
            max_tokens: 300,
            temperature: 0.7,
        });

        const analysis = completion.choices[0].message.content;
        await bot.sendMessage(chatId, `Analysis for token ${tokenId}:\n\n${analysis}`);
    } catch (error) {
        console.error('Error analyzing token:', error);
        await bot.sendMessage(chatId, 'Error analyzing token. Please make sure the contract address and token ID are correct and try again.');
    }
});

bot.onText(/\/trade (.+) (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const contractAddress = match![1].toLowerCase();
    const tokenId = match![2];
    
    try {
        // Validate address format
        if (!contractAddress.startsWith('0x') || contractAddress.length !== 42) {
            await bot.sendMessage(chatId, 'Invalid contract address. Please provide a valid Ethereum address.');
            return;
        }

        // Get trading analysis
        const analysis = await zoraService.generateTradingAnalysis(tokenId, contractAddress);
        
        // Format the analysis message
        const message = `📊 Trading Analysis for Token ${tokenId}\n\n` +
            `Market Status:\n` +
            `• Primary Mint: ${analysis.marketStatus.primaryMintActive ? 'Active' : 'Inactive'}\n` +
            `• Secondary Market: ${analysis.marketStatus.secondaryMarketActive ? 'Active' : 'Inactive'}\n\n` +
            `Price Analysis:\n` +
            `• Current Price: ${analysis.priceAnalysis.currentPrice}\n` +
            `• Trend: ${analysis.priceAnalysis.priceTrend}\n` +
            `• Volatility: ${analysis.priceAnalysis.priceVolatility}\n\n` +
            `Trading Signals:\n` +
            `• Entry Points:\n${analysis.tradingSignals.entryPoints.map((point: string) => `  - ${point}`).join('\n')}\n` +
            `• Exit Points:\n${analysis.tradingSignals.exitPoints.map((point: string) => `  - ${point}`).join('\n')}\n` +
            `• Stop Loss: ${analysis.tradingSignals.stopLoss}\n` +
            `• Take Profit: ${analysis.tradingSignals.takeProfit}\n\n` +
            `Risk Assessment:\n` +
            `• Risk Level: ${analysis.riskAssessment.riskLevel}\n` +
            `• ${analysis.riskAssessment.marketLiquidity}\n` +
            `• ${analysis.riskAssessment.volatilityRisk}\n\n` +
            `Recommendations:\n${analysis.recommendations.map((rec: string) => `• ${rec}`).join('\n')}`;

        await bot.sendMessage(chatId, message);
    } catch (error) {
        console.error('Error generating trading analysis:', error);
        await bot.sendMessage(chatId, 'Error generating trading analysis. Please make sure the contract address and token ID are correct and try again.');
    }
});

bot.onText(/\/portfolio/, async (msg) => {
    const chatId = msg.chat.id;
    const portfolio = userPortfolios.get(chatId);
    
    if (!portfolio || Object.keys(portfolio).length === 0) {
        await bot.sendMessage(chatId, 'No portfolio found. Use /track <contract> <tokenId> to start tracking tokens.');
        return;
    }
    
    let message = 'Your Portfolio:\n\n';
    for (const [contract, data] of Object.entries(portfolio)) {
        message += `Contract: ${contract}\nToken ID: ${data.tokenId}\nAmount: ${data.amount}\nValue: $${data.value}\n\n`;
    }
    
    await bot.sendMessage(chatId, message);
});

// Add webhook error handling
bot.on('webhook_error', (error) => {
    console.error('Webhook error:', error);
});

// Add general error handling
bot.on('error', (error) => {
    console.error('Bot error:', error);
});

// Start the bot
console.log('Zora AI Trading Assistant is running...'); 