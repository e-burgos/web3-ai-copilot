import { useDefiPositions } from '@web3-ai-copilot/data-hooks';
import { Card, Skeleton, Table, TableHeader, TableRow, TableCell } from '@web3-ai-copilot/ui-components';
import { formatCurrency, formatPercentage } from '@web3-ai-copilot/shared-utils';

export function DefiPositions() {
  const { data: positions, isLoading } = useDefiPositions();

  if (isLoading) {
    return (
      <Card>
        <Skeleton variant="rectangular" className="h-64" />
      </Card>
    );
  }

  if (!positions || positions.length === 0) {
    return (
      <Card>
        <h3 className="text-xl font-semibold mb-4">DeFi Positions</h3>
        <p className="text-muted-foreground text-center py-8">No DeFi positions found</p>
      </Card>
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
              <TableCell align="right">{formatCurrency(position.value)}</TableCell>
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

