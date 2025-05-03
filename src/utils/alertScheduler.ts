// src/utils/alertScheduler.ts
import cron from 'node-cron';
import { bot } from '../bot';
import { getAlerts, userAlerts, removeAlert } from './alertStorage';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { createZoraService } from '../services/zoraService.js';

dotenv.config();

// Initialize services
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const zoraService = createZoraService(provider, process.env.OPENAI_API_KEY!);

const checkAlerts = async () => {
  for (const [chatId, alerts] of userAlerts.entries()) {
    for (const alert of alerts) {
      try {
        const { totalVolume } = await zoraService.getCoinPrice(alert.contract);
        if (totalVolume >= alert.price) {
          await bot.sendMessage(chatId, `🚨 Alert: ${alert.contract} has reached ${totalVolume}!`);
          removeAlert(chatId, alert.contract);
        }
      } catch (error) {
        console.error(`Error checking alert for ${alert.contract}:`, error);
      }
    }
  }
};

// Schedule the job to run every minute
cron.schedule('* * * * *', checkAlerts);