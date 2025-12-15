import { CardContainer, Typography } from '@e-burgos/tucu-ui';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { COLORS, CustomTooltip } from './ChartsCommon';

interface AssetAllocationChartProps {
  data: Array<{ name: string; value: number }>;
}

export function AssetAllocationChart({ data }: AssetAllocationChartProps) {
  return (
    <CardContainer className="w-full">
      <div className="flex flex-col h-full w-full items-center">
        <div className="w-full text-left">
          <Typography tag="h4" className="font-semibold mb-4">
            Asset Allocation
          </Typography>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip active />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </CardContainer>
  );
}
