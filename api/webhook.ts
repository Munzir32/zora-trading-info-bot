import { ethers } from "ethers";
import axios from "axios";

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
  // Import zoraService dynamically to avoid initialization issues
  import('../src/services/zoraService.js').then(module => {
    zoraService = module.createZoraService(provider, process.env.OPENAI_API_KEY || '');
    console.log('Services initialized successfully');
  }).catch(error => {
    console.error('Error importing zoraService:', error);
  });
} catch (error) {
  console.error('Error initializing services:', error);
}

// Function to send a message to Telegram
async function sendTelegramMessage(chatId, text) {
  try {
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await axios.post(url, {
      chat_id: chatId,
      text: text
    });
    console.log('Message sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// Function to answer a callback query
async function answerCallbackQuery(callbackQueryId) {
  try {
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`;
    const response = await axios.post(url, {
      callback_query_id: callbackQueryId
    });
    console.log('Callback query answered successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error answering callback query:', error);
    throw error;
  }
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
            await sendTelegramMessage(chatId, 'Welcome to Zora AI Trading Assistant! 🚀\n\nAvailable commands:\n/price <contract> <tokenId> - Get real-time price\n/track <contract> <tokenId> - Track a token in your portfolio\n/portfolio - View your portfolio\n/analyze <contract> <tokenId> - Get AI analysis\n/alerts - Set up price alerts');
            console.log('Sent welcome message');
          } 
          else if (text.startsWith('/price')) {
            console.log('Handling /price command');
            if (!zoraService) {
              console.error('ZoraService not initialized');
              await sendTelegramMessage(chatId, 'Service is not properly initialized. Please contact the administrator.');
              return;
            }
            
            const parts = text.split(' ');
            if (parts.length === 3) {
              const contractAddress = parts[1].toLowerCase();
              const tokenId = parts[2];
              console.log(`Getting price for token ${tokenId} at contract ${contractAddress}`);
              
              if (!contractAddress.startsWith('0x') || contractAddress.length !== 42) {
                await sendTelegramMessage(chatId, 'Invalid contract address. Please provide a valid Ethereum address.');
              } else {
                try {
                  const price = await zoraService.getTokenPrice(tokenId, contractAddress);
                  console.log(`Got price: ${price}`);
                  await sendTelegramMessage(chatId, `Current price for token ${tokenId}: ${price}`);
                } catch (error) {
                  console.error('Error getting price:', error);
                  await sendTelegramMessage(chatId, 'Error fetching price. Please make sure the contract address and token ID are correct.');
                }
              }
            } else {
              await sendTelegramMessage(chatId, 'Invalid format. Use: /price <contract> <tokenId>');
            }
          }
          // Add other command handlers here...
        }
        
        if (update.callback_query) {
          const query = update.callback_query;
          console.log('Handling callback query:', query.id);
          await answerCallbackQuery(query.id);
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