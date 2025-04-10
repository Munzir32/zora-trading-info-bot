import express from 'express';
import { bot } from './bot';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(express.json());

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 8080;
const WEBHOOK_PATH = `/webhook/${process.env.TELEGRAM_BOT_TOKEN}`;

// Set webhook
bot.setWebHook(`http://localhost:${PORT}${WEBHOOK_PATH}`).then(() => {
    console.log('Webhook set successfully');
}).catch((error) => {
    console.error('Error setting webhook:', error);
});

// Webhook endpoint
app.post(WEBHOOK_PATH, (req, res) => {
    // Process the update
    const update = req.body;
    
    // Handle the update using the bot's event handlers
    if (update.message) {
        // Handle text messages
        const chatId = update.message.chat.id;
        const text = update.message.text || '';
        
        // Process commands
        if (text.startsWith('/')) {
            // Let the bot's command handlers process it
            bot.emit('message', update.message);
        } else {
            // Handle non-command messages
            bot.emit('message', update.message);
        }
    } else if (update.callback_query) {
        // Handle callback queries
        bot.emit('callback_query', update.callback_query);
    }
    
    res.sendStatus(200);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.send('Bot is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Webhook URL: http://localhost:${PORT}${WEBHOOK_PATH}`);
}); 