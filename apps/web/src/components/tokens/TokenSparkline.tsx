import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

export const generateSparklineData = (
  basePrice: number,
  isPositive: boolean
) => {
  const data = [];
  let currentValue = basePrice;
  const points = 20;

  // Create a trend based on isPositive
  const trend = isPositive ? 1 : -1;

  for (let i = 0; i < points; i++) {
    // Add some randomness but follow the trend
    const randomChange = (Math.random() - 0.5) * (basePrice * 0.05);
    const trendChange = (basePrice * 0.02 * trend * i) / points;

    currentValue = basePrice + trendChange + randomChange;

    data.push({
      i,
      value: currentValue,
    });
  }
  return data;
};

interface SparklineDataPoint {
  i: number;
  value: number;
}

export const TokenSparkline = ({
  data,
  isPositive,
}: {
  data: SparklineDataPoint[];
  isPositive: boolean;
}) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="w-24 h-10">
      <ResponsiveContainer width={96} height={40}>
        <LineChart
          data={data}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <Line
            type="monotone"
            dataKey="value"
            stroke={isPositive ? '#10b981' : '#ef4444'}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <YAxis domain={['dataMin', 'dataMax']} hide />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
