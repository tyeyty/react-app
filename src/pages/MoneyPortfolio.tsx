import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import 'chart.js/auto';
import { Bar } from "react-chartjs-2";

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

  // 현재가 API 호출
// fetchCurrentPrices 함수 수정

const fetchCurrentPrices = async () => {
  if (stocks.length === 0 || !currentUser) return; // 사용자가 없으면 호출하지 않음

  // 1. 현재 사용자 세션을 가져와서 인증 토큰을 추출합니다.
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;

  if (!token) {
    console.error("Supabase 인증 토큰을 찾을 수 없습니다. 로그인이 필요합니다.");
    // 토큰이 없으면 API 호출을 중단합니다.
    return;
  }
  
  const newPrices: Record<string, number> = {};
  
  const fetchPromises = stocks.map(async (stock) => {
    const ticker = stock.ticker.toUpperCase();

    try {
      // 2. HTTP 헤더에 인증 토큰을 포함하여 API 호출
      const res = await fetch(`/api/price?symbol=${ticker}`, {
        headers: {
          // 'Authorization' 헤더에 Bearer 토큰 형식으로 전달 (가장 일반적인 인증 방식)
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!res.ok) {
        // 특히 401 Unauthorized 에러가 뜨는지 확인해 보세요!
        console.error(`API 호출 실패: ${res.status}`);
        throw new Error(`Failed to fetch ${ticker}: ${res.statusText}`);
      }

      const data = await res.json();
      
      // ... (데이터 파싱 및 취합 로직은 그대로)
      if (data && data.symbol && typeof data.price === 'number') {
        return { symbol: data.symbol.toUpperCase(), price: data.price };
      }
      return null;

    } catch (err) {
      console.error(`현재가 가져오기 실패 - ${ticker}:`, err);
      return null; 
    }
  });

  const results = await Promise.all(fetchPromises);
  results.forEach(item => {
    if (item) {
      newPrices[item.symbol] = item.price;
    }
  });

  setCurrentPrices(newPrices);
};

// 🚀 수정된 통합 로직
useEffect(() => {
  // stocks가 비어있으면 API 호출을 막음
  if (stocks.length === 0) {
    setCurrentPrices({}); // 종목이 없으면 현재가도 초기화
    return;
  }

  // 즉시 현재가를 한번 가져옵니다.
  fetchCurrentPrices();

  // 1분마다 갱신하는 인터벌 설정
  const interval = setInterval(fetchCurrentPrices, 60 * 1000); 

  // 컴포넌트 언마운트 또는 stocks가 변경되어 useEffect가 재실행될 때 인터벌 정리
  return () => clearInterval(interval);
  
}, [stocks]); // stocks 목록이 변경될 때마다 재실행

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

    if (error) return console.error(error);
    setStocks([...stocks, data[0]]);
    setTicker(""); setPrice(""); setQuantity(""); setHold(false);
  };

  // 총자산 계산
  const totalAsset = stocks.reduce(
    (acc, s) => acc + s.price * s.quantity,
    0
  );

  // 총 평가자산 (현재가 기준)
  const totalEvaluation = stocks.reduce((acc, s) => {
    const current = currentPrices[s.ticker.toUpperCase()] ?? s.price;
    return acc + current * s.quantity;
  }, 0);  

  const getPortfolioType = (total: number) => {
    if (total < 5000) return "공격형 (70% 순환매 / 30% 월배당)";
    if (total < 20000) return "균형형 (50% 순환매 / 30% 월배당 / 20% SPLG)";
    return "안정형 (40% 순환매 / 40% 월배당 / 20% SPLG)";
  };

    // 그래프 데이터
  const chartData = {
    labels: stocks.map((s) => s.ticker),
    datasets: [
      {
        label: "평가금액",
        data: stocks.map((s) => (currentPrices[s.ticker.toUpperCase()] ?? s.price) * s.quantity),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "총 매수가",
        data: stocks.map((s) => s.price * s.quantity),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
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

      {/* 그래프 */}
      {stocks.length > 0 && (
        <div className="mb-6">
          <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
        </div>
      )}

      {/* 종목 테이블 */}
      {stocks.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">티커</th>
                <th className="border p-2">매수 단가</th>
                <th className="border p-2">현재가</th>
                <th className="border p-2">수량</th>
                <th className="border p-2">총액</th>
                <th className="border p-2">평가 금액</th>
                <th className="border p-2">수익률</th>
                <th className="border p-2">Hold</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((s) => {
                const ticker = s.ticker.toUpperCase(); // DB와 동일하게
                const current = currentPrices[ticker] ?? s.price; // 없으면 매수가
                const totalValue = current * s.quantity; // 평가금액
                const profitRate = s.price > 0 ? ((current - s.price) / s.price) * 100 : 0;

                return (
                  <tr key={s.id} className="text-center">
                    <td className="border p-2 font-semibold">{ticker}</td>
                    <td className="border p-2">${s.price.toFixed(2)}</td>
                    <td className="border p-2">${current.toFixed(2)}</td>
                    <td className="border p-2">{s.quantity}</td>
                    <td className="border p-2">${(s.price * s.quantity).toFixed(2)}</td>
                    <td className="border p-2">${totalValue.toFixed(2)}</td>
                    <td
                      className={`border p-2 ${
                        profitRate > 0 ? "text-green-600" : profitRate < 0 ? "text-red-600" : ""
                      }`}
                    >
                      {profitRate.toFixed(2)}%
                    </td>
                    <td className="border p-2">{s.hold ? "✅" : ""}</td>
                  </tr>
                );
              })}

              {/* 총합계 행 */}
              <tr className="bg-gray-200 font-bold text-center">
                <td className="border p-2" colSpan={4}>총합계</td>
                <td className="border p-2">
                  ${stocks.reduce((acc, s) => acc + s.price * s.quantity, 0).toFixed(2)}
                </td>
                <td className="border p-2">
                  ${stocks.reduce((acc, s) => {
                    const current = currentPrices[s.ticker.toUpperCase()] ?? s.price;
                    return acc + current * s.quantity;
                  }, 0).toFixed(2)}
                </td>
                <td className="border p-2">
                  {(
                    (stocks.reduce((acc, s) => {
                      const current = currentPrices[s.ticker.toUpperCase()] ?? s.price;
                      return acc + current * s.quantity;
                    }, 0) -
                      stocks.reduce((acc, s) => acc + s.price * s.quantity, 0)) /
                    stocks.reduce((acc, s) => acc + s.price * s.quantity, 0) *
                    100
                  ).toFixed(2)}
                  %
                </td>
                <td className="border p-2"></td>
              </tr>              
            </tbody>

          </table>
        </div>
      )}

      {/* 총자산 및 추천 타입 */}
      <div className="mt-4 p-4 bg-gray-50 rounded">
        <p className="text-lg font-semibold">총 매수가 자산: ${totalAsset.toFixed(2)}</p>
        <p className="text-lg font-semibold">총 평가 자산: ${totalEvaluation.toFixed(2)}</p>
        <p className="text-lg font-semibold">
          추천 포트폴리오 타입: {getPortfolioType(totalAsset)}
        </p>
      </div>
    </div>
  );
}
