import { bot } from "../src/bot.js";
import { createZoraService } from "../src/services/zoraService.js";
import { ethers } from "ethers";

// Initialize services with error handling
let zoraService;
try {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/demo');
  zoraService = createZoraService(provider, process.env.OPENAI_API_KEY || '');
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

          // Handle commands directly
          if (text.startsWith('/start')) {
            await bot.sendMessage(chatId, 'Welcome to Zora AI Trading Assistant! 🚀\n\nAvailable commands:\n/price <contract> <tokenId> - Get real-time price\n/track <contract> <tokenId> - Track a token in your portfolio\n/portfolio - View your portfolio\n/analyze <contract> <tokenId> - Get AI analysis\n/alerts - Set up price alerts');
          } 
          else if (text.startsWith('/price')) {
            if (!zoraService) {
              await bot.sendMessage(chatId, 'Service is not properly initialized. Please contact the administrator.');
              return;
            }
            
            const parts = text.split(' ');
            if (parts.length === 3) {
              const contractAddress = parts[1].toLowerCase();
              const tokenId = parts[2];
              if (!contractAddress.startsWith('0x') || contractAddress.length !== 42) {
                await bot.sendMessage(chatId, 'Invalid contract address. Please provide a valid Ethereum address.');
              } else {
                try {
                  const price = await zoraService.getTokenPrice(tokenId, contractAddress);
                  await bot.sendMessage(chatId, `Current price for token ${tokenId}: ${price}`);
                } catch (error) {
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