import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const symbol = (req.query.symbol as string)?.toUpperCase() || 'AAPL';

  try {
    // 예시: Yahoo Finance API (공식 X, 무료 endpoint)
    const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
    const data = await response.json();

    const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;

    if (!price) throw new Error('가격 정보를 찾을 수 없습니다.');

    res.status(200).json({
      symbol,
      price,
      time: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({
      error: '주식 정보를 불러오지 못했습니다.',
      details: err.message,
    });
  }
}
