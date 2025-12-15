import { formatCurrency } from '@web3-ai-copilot/shared-utils';
import { TooltipPayload } from 'recharts/types/state/tooltipSlice';

export const COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#6b7280', // gray-500
];

export const CustomTooltip = ({
  active,
  payload,
}: {
  active: boolean;
  payload?: TooltipPayload;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-muted border border-border p-2 rounded-lg shadow-lg">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-sm text-muted-foreground">
          {formatCurrency(payload[0].value as number)}
        </p>
      </div>
    );
  }
  return null;
};
