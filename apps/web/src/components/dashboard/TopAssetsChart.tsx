import { CardContainer, Typography } from '@e-burgos/tucu-ui';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { COLORS, CustomTooltip } from './ChartsCommon';

interface TopAssetsChartProps {
  data: Array<{ symbol: string; value: number }>;
}

export function TopAssetsChart({ data }: TopAssetsChartProps) {
  return (
    <CardContainer className="w-full">
      <div className="flex flex-col h-full w-full">
        <Typography tag="h4" className="font-semibold mb-4">
          Top Assets by Value
        </Typography>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                opacity={0.1}
                vertical={false}
              />
              <XAxis
                dataKey="symbol"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                content={<CustomTooltip active />}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </CardContainer>
  );
}
