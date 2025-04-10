import { bot } from "../bot";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (req.method === 'POST') {
      try {
        const update = req.body;
        await bot.processUpdate(update);
        res.status(200).json({ ok: true });
      } catch (error: any) {
        console.error('Error handling update:', error);
        res.status(500).json({ ok: false, error: error.message });
      }
    } else {
      res.status(405).json({ ok: false, error: 'Method not allowed' });
    }
  }