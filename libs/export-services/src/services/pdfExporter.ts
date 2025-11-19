interface PortfolioData {
  tokens: Array<{
    symbol: string;
    name: string;
    balance: string;
    value: number;
    price: number;
  }>;
  totalValue: number;
  address: string;
  date: string;
}

export async function exportToPdf(
  data: PortfolioData,
  filename = 'portfolio'
): Promise<void> {
  // Dynamic import of jsPDF to avoid bundling it if not needed
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF();
  const margin = 20;
  let yPosition = margin;

  // Title
  doc.setFontSize(18);
  doc.text('Portfolio Report', margin, yPosition);
  yPosition += 10;

  // Address and Date
  doc.setFontSize(10);
  doc.text(`Address: ${data.address}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Date: ${data.date}`, margin, yPosition);
  yPosition += 10;

  // Table headers
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const headers = ['Symbol', 'Name', 'Balance', 'Price', 'Value'];
  const colWidths = [25, 60, 30, 30, 30];
  let xPosition = margin;

  headers.forEach((header, index) => {
    doc.text(header, xPosition, yPosition);
    xPosition += colWidths[index];
  });

  yPosition += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  // Table rows
  data.tokens.forEach((token) => {
    if (yPosition > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      yPosition = margin;
    }

    xPosition = margin;
    const row = [
      token.symbol,
      token.name.substring(0, 25),
      token.balance,
      `$${token.price.toFixed(2)}`,
      `$${token.value.toFixed(2)}`,
    ];

    row.forEach((cell, index) => {
      doc.text(cell.toString(), xPosition, yPosition);
      xPosition += colWidths[index];
    });

    yPosition += 7;
  });

  // Total
  yPosition += 5;
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Value: $${data.totalValue.toFixed(2)}`, margin, yPosition);

  doc.save(`${filename}.pdf`);
}

