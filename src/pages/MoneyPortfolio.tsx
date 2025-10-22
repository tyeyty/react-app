import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

type Stock = {
  id?: number;
  ticker: string;
  price: number;
  quantity: number;
  hold: boolean;
};

export default function MoneyPortfolio() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [ticker, setTicker] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [hold, setHold] = useState(false);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({});

  // 페이지 로드 시 현재 로그인한 사용자 가져오기
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error(error);
        return;
      }
      if (data?.user) {
        setCurrentUser(data.user);
      }
    };
    fetchUser();
  }, []);

  // DB에서 사용자별 데이터 불러오기
  const fetchStocks = async () => {
    if (!currentUser) return;
    const { data, error } = await supabase
      .from("portfolio_stocks")
      .select("*")
      .eq("user_id", currentUser.id);
    if (error) console.error(error);
    else setStocks(data as Stock[]);
  };

  useEffect(() => {
    fetchStocks();
  }, [currentUser]); // currentUser가 세팅되면 불러오기

// 주식 현재가 불러오기
const fetchCurrentPrices = async () => {
  if (stocks.length === 0) return;
  const tickers = stocks.map(s => s.ticker).join(",");

  try {
    const res = await fetch(`/api/price?tickers=${tickers}`);
    const data = await res.json();

    const prices: Record<string, number> = {};
    if (Array.isArray(data)) {
      data.forEach((item: any) => {
        prices[item.symbol] = item.price;
      });
    } else if (typeof data === "object") {
      prices[data.symbol] = data.price;
    }

    setCurrentPrices(prices);
  } catch (err) {
    console.error("현재가 가져오기 실패:", err);
  }
};


  useEffect(() => {
    fetchCurrentPrices();
    const interval = setInterval(fetchCurrentPrices, 60 * 1000); // 1분마다 갱신
    return () => clearInterval(interval);
  }, [stocks]);


  // 종목 추가
  const addStock = async () => {
    if (!ticker || !price || !quantity || !currentUser) return;

    const newStock = {
      user_id: currentUser.id,
      ticker: ticker.toUpperCase(),
      price: parseFloat(price),
      quantity: parseInt(quantity),
      hold,
    };

    const { data, error } = await supabase
      .from("portfolio_stocks")
      .insert(newStock)
      .select();

    if (error) console.error(error);
    else setStocks([...stocks, data[0]]);

    setTicker("");
    setPrice("");
    setQuantity("");
    setHold(false);
  };

  // 총자산 계산
  const totalAsset = stocks.reduce(
    (acc, s) => acc + s.price * s.quantity,
    0
  );

  const getPortfolioType = (total: number) => {
    if (total < 5000) return "공격형 (70% 순환매 / 30% 월배당)";
    if (total < 20000) return "균형형 (50% 순환매 / 30% 월배당 / 20% SPLG)";
    return "안정형 (40% 순환매 / 40% 월배당 / 20% SPLG)";
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Portfolio</h1>

      {/* 입력폼 */}
      <div className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          placeholder="티커"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="매수 단가"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="수량"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border p-2 rounded"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={hold}
            onChange={(e) => setHold(e.target.checked)}
          />
          Hold 표시
        </label>
        <button
          onClick={addStock}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          종목 추가
        </button>
      </div>

      {/* 종목 테이블 */}
      {stocks.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">티커</th>
                <th className="border p-2">매수 단가</th>
                <th className="border p-2">수량</th>
                <th className="border p-2">현재가</th>
                <th className="border p-2">총액</th>
                <th className="border p-2">Hold</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((s) => {
                const current = currentPrices[s.ticker]; // 현재가
                const totalValue = current ? current * s.quantity : s.price * s.quantity; // 평가금액
                const profit =
                  current && s.price
                    ? ((current - s.price) / s.price) * 100
                    : 0; // 수익률 계산

                return (
                  <tr key={s.id} className="text-center">
                    <td className="border p-2 font-semibold">{s.ticker}</td>
                    <td className="border p-2">${s.price.toFixed(2)}</td>
                    <td className="border p-2">
                      {current ? `$${current.toFixed(2)}` : "..."}
                    </td>
                    <td className="border p-2">{s.quantity}</td>
                    <td className="border p-2">${totalValue.toFixed(2)}</td>
                    <td
                      className={`border p-2 ${
                        profit > 0 ? "text-green-600" : profit < 0 ? "text-red-600" : ""
                      }`}
                    >
                      {current ? `${profit.toFixed(2)}%` : "..."}
                    </td>
                    <td className="border p-2">{s.hold ? "✅" : ""}</td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      )}

      {/* 총자산 및 추천 타입 */}
      <div className="mt-4 p-4 bg-gray-50 rounded">
        <p className="text-lg font-semibold">총 자산: ${totalAsset.toFixed(2)}</p>
        <p className="text-lg font-semibold">
          추천 포트폴리오 타입: {getPortfolioType(totalAsset)}
        </p>
      </div>
    </div>
  );
}
