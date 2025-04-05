import { bot } from "../src/bot.ts";

export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        const update = req.body;
        await bot.processUpdate(update);
        res.status(200).json({ ok: true });
      } catch (error) {
        console.error('Error handling update:', error);
        res.status(500).json({ ok: false, error: error.message });
      }
    } else {
      res.status(405).json({ ok: false, error: 'Method not allowed' });
    }
  }