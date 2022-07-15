import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";

interface IHistorical {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}
interface ChartProps {
  coinId: string;
}

interface ChartData {
  x?: string;
  y?: number[];
}

function Chart({ coinId }: ChartProps) {
  const { isLoading, data } = useQuery<IHistorical[]>(
    ["ohlcv", coinId],
    () => fetchCoinHistory(coinId),
    {
      refetchInterval: 10000,
    }
  );

  let chartdata: ChartData[] | undefined = [];
  chartdata = data?.map((ohlcv) => {
    return {
      x: ohlcv.time_open,
      y: [ohlcv.open, ohlcv.high, ohlcv.low, ohlcv.close],
    };
  });

  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <ApexChart
          type="candlestick"
          series={[
            {
              data: chartdata,
            },
          ]}
          options={{
            theme: {
              mode: "dark",
            },
            chart: {
              height: 300,
              width: 500,
            },
            yaxis: {
              show: false,
              labels: {
                show: false,
              },
            },
            xaxis: {
              axisBorder: { show: false },
              axisTicks: { show: false },
              labels: { show: false },
              categories: data?.map(
                (e) => `${Math.abs(data.indexOf(e) - data.length)} days ago`
              ),
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
