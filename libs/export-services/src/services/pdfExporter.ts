import type { ContextPortfolioData } from '@web3-ai-copilot/data-hooks';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addNewPageIfNeeded(
  doc: any,
  yPosition: number,
  margin: number
): number {
  if (yPosition > doc.internal.pageSize.getHeight() - 20) {
    doc.addPage();
    return margin;
  }
  return yPosition;
}

// Helper function to draw a table with borders and styled header
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function drawTable(
  doc: any,
  startX: number,
  startY: number,
  headers: string[],
  colWidths: number[],
  rows: string[][],
  rowHeight = 7,
  headerHeight = 8
): number {
  const margin = 20;
  let currentY = startY;
  const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);

  // Draw header background
  doc.setFillColor(240, 240, 240);
  doc.rect(startX, currentY - headerHeight + 2, tableWidth, headerHeight, 'F');

  // Draw header border
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.rect(startX, currentY - headerHeight + 2, tableWidth, headerHeight);

  // Draw header text
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  let xPos = startX + 3; // Padding from left
  headers.forEach((header, index) => {
    doc.text(header, xPos, currentY);
    xPos += colWidths[index];
  });

  currentY += 2; // Space after header

  // Draw rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  rows.forEach((row) => {
    currentY = addNewPageIfNeeded(doc, currentY + rowHeight, margin);
    if (currentY === margin) {
      // If new page, redraw header
      doc.setFillColor(240, 240, 240);
      doc.rect(
        startX,
        currentY - headerHeight + 2,
        tableWidth,
        headerHeight,
        'F'
      );
      doc.setDrawColor(200, 200, 200);
      doc.rect(startX, currentY - headerHeight + 2, tableWidth, headerHeight);
      doc.setFont('helvetica', 'bold');
      xPos = startX + 3;
      headers.forEach((header, index) => {
        doc.text(header, xPos, currentY);
        xPos += colWidths[index];
      });
      currentY += 2;
      doc.setFont('helvetica', 'normal');
    }

    // Draw row border (top horizontal line)
    doc.setDrawColor(220, 220, 220);
    doc.line(startX, currentY, startX + tableWidth, currentY);

    // Draw left border for the row
    doc.line(startX, currentY - rowHeight, startX, currentY);

    // Draw cell borders and text
    xPos = startX + 3;
    row.forEach((cell, colIndex) => {
      // Vertical line between cells
      if (colIndex > 0) {
        doc.line(xPos - 3, currentY - rowHeight, xPos - 3, currentY);
      }
      doc.text(cell.toString(), xPos, currentY - 2);
      xPos += colWidths[colIndex];
    });

    // Draw right border
    doc.line(
      startX + tableWidth,
      currentY - rowHeight,
      startX + tableWidth,
      currentY
    );
  });

  // Draw bottom border
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(startX, currentY, startX + tableWidth, currentY);

  return currentY + 5; // Return Y position after table
}

export async function exportToPdf(
  data: ContextPortfolioData,
  filename = 'portfolio'
): Promise<void> {
  // Dynamic import of jsPDF to avoid bundling it if not needed
  const { jsPDF } = await import('jspdf');

  // Create PDF in landscape orientation for better table visibility
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const margin = 20;
  let yPosition = margin;

  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Portfolio Report', margin, yPosition);
  yPosition += 10;

  // Address and Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Address: ${data.address}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, yPosition);
  yPosition += 10;

  // Summary
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', margin, yPosition);
  yPosition += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(
    `Total Portfolio Value: $${data.portfolio?.total?.positions?.toFixed(2) || '0.00'} USD`,
    margin,
    yPosition
  );
  yPosition += 10;

  // Tokens Section
  yPosition += 5;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Tokens', margin, yPosition);
  yPosition += 10;

  const tokenHeaders = ['Symbol', 'Name', 'Balance', 'Price', 'Value'];
  const tokenColWidths = [35, 80, 45, 45, 45];
  const tokenRows = data.tokens.map((token) => [
    token.symbol,
    token.name.substring(0, 40),
    parseFloat(token.balance).toFixed(6),
    `$${token.price.toFixed(2)}`,
    `$${token.value.toFixed(2)}`,
  ]);

  yPosition = drawTable(
    doc,
    margin,
    yPosition,
    tokenHeaders,
    tokenColWidths,
    tokenRows
  );

  // NFTs Section
  if (data.nfts && data.nfts.length > 0) {
    yPosition = addNewPageIfNeeded(doc, yPosition + 10, margin);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('NFTs', margin, yPosition);
    yPosition += 10;

    const nftHeaders = ['Name', 'Collection', 'Value', 'Price'];
    const nftColWidths = [70, 70, 45, 45];
    const nftRows = data.nfts.map((nft) => [
      (nft.name || 'Unnamed').substring(0, 45),
      (nft.collection || 'Unknown').substring(0, 45),
      nft.value ? `$${nft.value.toFixed(2)}` : '-',
      nft.price ? `$${nft.price.toFixed(2)}` : '-',
    ]);

    yPosition = drawTable(
      doc,
      margin,
      yPosition,
      nftHeaders,
      nftColWidths,
      nftRows
    );
  }

  // DeFi Positions Section
  if (data.defiPositions && data.defiPositions.length > 0) {
    yPosition = addNewPageIfNeeded(doc, yPosition + 10, margin);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DeFi Positions', margin, yPosition);
    yPosition += 10;

    const defiHeaders = ['Name', 'Protocol', 'Type', 'Value', 'APY'];
    const defiColWidths = [70, 55, 45, 45, 30];
    const defiRows = data.defiPositions.map((position) => [
      position.name.substring(0, 45),
      position.protocol.substring(0, 30),
      position.type.substring(0, 25),
      `$${position.value.toFixed(2)}`,
      position.apy ? `${position.apy.toFixed(2)}%` : '-',
    ]);

    yPosition = drawTable(
      doc,
      margin,
      yPosition,
      defiHeaders,
      defiColWidths,
      defiRows
    );
  }

  // Recent Transactions Section
  if (data.recentTransactions && data.recentTransactions.length > 0) {
    yPosition = addNewPageIfNeeded(doc, yPosition + 10, margin);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Recent Transactions', margin, yPosition);
    yPosition += 10;

    const txHeaders = ['Hash', 'Type', 'Date', 'Fee'];
    const txColWidths = [70, 50, 60, 45];
    const txRows = data.recentTransactions.map((tx) => {
      const date = new Date(tx.mined_at).toISOString().split('T')[0];
      const time = new Date(tx.mined_at)
        .toISOString()
        .split('T')[1]
        .split('.')[0];
      return [
        tx.hash.substring(0, 30) + '...',
        tx.operation_type.substring(0, 25),
        `${date} ${time}`,
        `$${tx.fee.toFixed(2)}`,
      ];
    });

    yPosition = drawTable(
      doc,
      margin,
      yPosition,
      txHeaders,
      txColWidths,
      txRows
    );
  }

  doc.save(`${filename}.pdf`);
}
