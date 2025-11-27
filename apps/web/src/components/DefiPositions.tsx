import { useDefiPositions } from '@web3-ai-copilot/data-hooks';
import {
  Card,
  Skeleton,
  Table,
  TableHeader,
  TableRow,
  TableCell,
} from '@web3-ai-copilot/ui-components';
import {
  formatCurrency,
  formatPercentage,
} from '@web3-ai-copilot/shared-utils';
import { CardContainer, LucideIcons, Typography } from '@e-burgos/tucu-ui';

export function DefiPositions() {
  const { data: positions, isLoading } = useDefiPositions();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="rectangular" className="h-64 rounded-lg" />
      </div>
    );
  }

  if (!positions || positions.length === 0) {
    return (
      <CardContainer>
        <div className="flex w-full flex-col items-center justify-center text-center gap-2 py-4">
          <LucideIcons.ActivityIcon className="w-16 h-16 text-muted-foreground mb-2" />
          <Typography tag="h4" className="text-muted-foreground">
            No DeFi positions found
          </Typography>
        </div>
      </CardContainer>
    );
  }

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4">DeFi Positions</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Protocol</TableCell>
            <TableCell>Type</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell align="right">APY</TableCell>
          </TableRow>
        </TableHeader>
        <tbody>
          {positions.map((position) => (
            <TableRow key={position.id}>
              <TableCell>{position.protocol}</TableCell>
              <TableCell>{position.type}</TableCell>
              <TableCell align="right">
                {formatCurrency(position.value)}
              </TableCell>
              <TableCell align="right">
                {position.apy ? formatPercentage(position.apy) : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
