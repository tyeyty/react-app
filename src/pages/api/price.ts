// api/price.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tickers } = req.query;
  if (!tickers || typeof tickers !== 'string') {
    return res.status(400).json({ error: "tickers required" });
  }

  try {
    const response = await fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${tickers}`);
    const data = await response.json();

    const prices: Record<string, number> = {};
    data.quoteResponse.result.forEach((item: any) => {
      prices[item.symbol] = item.regularMarketPrice;
    });

    res.status(200).json(prices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch prices" });
  }
}
