import { bot } from "../src/bot.js";
import { createZoraService } from "../src/services/zoraService.js";
import { ethers } from "ethers";

// Log environment variables
console.log('Environment variables:', {
  RPC_URL: process.env.RPC_URL ? 'Exists' : 'Missing',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'Exists' : 'Missing',
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ? 'Exists' : 'Missing'
});

// Initialize services with error handling
let zoraService;
try {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/demo');
  zoraService = createZoraService(provider, process.env.OPENAI_API_KEY || '');
  console.log('Services initialized successfully');
} catch (error) {
  console.error('Error initializing services:', error);
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        console.log('Received webhook update:', JSON.stringify(req.body));
        
        if (!req.body) {
          console.error('No body in request');
          return res.status(400).json({ ok: false, error: 'No body in request' });
        }
        
        const update = req.body;
        
        if (update.message) {
          const msg = update.message;
          const text = msg.text;
          const chatId = msg.chat.id;
          
          console.log(`Processing message: ${text} from chat ID: ${chatId}`);

          // Handle commands directly
          if (text.startsWith('/start')) {
            console.log('Handling /start command');
            await bot.sendMessage(chatId, 'Welcome to Zora AI Trading Assistant! 🚀\n\nAvailable commands:\n/price <contract> <tokenId> - Get real-time price\n/track <contract> <tokenId> - Track a token in your portfolio\n/portfolio - View your portfolio\n/analyze <contract> <tokenId> - Get AI analysis\n/alerts - Set up price alerts');
            console.log('Sent welcome message');
          } 
          else if (text.startsWith('/price')) {
            console.log('Handling /price command');
            if (!zoraService) {
              console.error('ZoraService not initialized');
              await bot.sendMessage(chatId, 'Service is not properly initialized. Please contact the administrator.');
              return;
            }
            
            const parts = text.split(' ');
            if (parts.length === 3) {
              const contractAddress = parts[1].toLowerCase();
              const tokenId = parts[2];
              console.log(`Getting price for token ${tokenId} at contract ${contractAddress}`);
              
              if (!contractAddress.startsWith('0x') || contractAddress.length !== 42) {
                await bot.sendMessage(chatId, 'Invalid contract address. Please provide a valid Ethereum address.');
              } else {
                try {
                  const price = await zoraService.getTokenPrice(tokenId, contractAddress);
                  console.log(`Got price: ${price}`);
                  await bot.sendMessage(chatId, `Current price for token ${tokenId}: ${price}`);
                } catch (error) {
                  console.error('Error getting price:', error);
                  await bot.sendMessage(chatId, 'Error fetching price. Please make sure the contract address and token ID are correct.');
                }
              }
            } else {
              await bot.sendMessage(chatId, 'Invalid format. Use: /price <contract> <tokenId>');
            }
          }
          // Add other command handlers here...
        }
        
        if (update.callback_query) {
          const query = update.callback_query;
          console.log('Handling callback query:', query.id);
          await bot.answerCallbackQuery(query.id);
        }
        
        console.log('Successfully processed update');
        res.status(200).json({ ok: true });
      } catch (error) {
        console.error('Error handling update:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ ok: false, error: error.message });
      }
    } else {
      res.status(405).json({ ok: false, error: 'Method not allowed' });
    }
  } 