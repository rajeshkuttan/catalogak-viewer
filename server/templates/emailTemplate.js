import { format, parseISO } from 'date-fns';

// Generate HTML email template
export function generateEmailHTML({ date, summary, report, totals }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>The Burgurry Daily Sales Report</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 800px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #2D8278 0%, #1a5147 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 5px;
      letter-spacing: 1px;
    }
    .tagline {
      font-size: 12px;
      letter-spacing: 2px;
      opacity: 0.9;
    }
    .date-banner {
      background-color: #f8f9fa;
      padding: 15px 20px;
      text-align: center;
      border-bottom: 2px solid #e9ecef;
    }
    .date {
      font-size: 18px;
      color: #333;
      font-weight: 600;
    }
    .content {
      padding: 30px 20px;
    }
    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: #2D8278;
      margin: 20px 0 15px 0;
      padding-bottom: 10px;
      border-bottom: 2px solid #2D8278;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }
    .summary-card {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      border-left: 4px solid #2D8278;
    }
    .summary-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    .summary-value {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      font-family: 'Courier New', monospace;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th {
      background-color: #2D8278;
      color: white;
      padding: 12px;
      text-align: left;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #e9ecef;
      font-size: 14px;
    }
    tr:hover {
      background-color: #f8f9fa;
    }
    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .status-sales {
      background-color: #d4edda;
      color: #155724;
    }
    .status-refund {
      background-color: #f8d7da;
      color: #721c24;
    }
    .amount {
      font-family: 'Courier New', monospace;
      font-weight: 600;
      color: #2D8278;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #e9ecef;
    }
    .no-data {
      text-align: center;
      padding: 40px 20px;
      color: #666;
      font-style: italic;
    }
    @media only screen and (max-width: 600px) {
      .summary-grid {
        grid-template-columns: 1fr;
      }
      table {
        font-size: 12px;
      }
      th, td {
        padding: 8px 4px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header with Logo -->
    <div class="header">
      <div class="logo">🍔 THE BURGURRY</div>
      <div class="tagline">BURGERS & BITES • BY 1765</div>
    </div>

    <!-- Date Banner -->
    <div class="date-banner">
      <div class="date">📅 Daily Sales Report - ${date}</div>
    </div>

    <!-- Main Content -->
    <div class="content">
      
      <!-- Summary Section -->
      <div class="section-title">📊 Sales Summary</div>
      <div class="summary-grid">
        <div class="summary-card">
          <div class="summary-label">Total Sales</div>
          <div class="summary-value">AED ${totals.totalAmount.toFixed(2)}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Net Sales</div>
          <div class="summary-value">AED ${totals.netSales.toFixed(2)}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Total Tax</div>
          <div class="summary-value">AED ${totals.totalTax.toFixed(2)}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Transactions</div>
          <div class="summary-value">${totals.count}</div>
        </div>
      </div>

      <!-- Transaction Details Section -->
      <div class="section-title">📋 Transaction Details</div>
      ${report && report.length > 0 ? `
        <table>
          <thead>
            <tr>
              <th>Receipt #</th>
              <th>Date & Time</th>
              <th style="text-align: right;">Amount</th>
              <th style="text-align: right;">Tax</th>
              <th style="text-align: center;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${report.map(transaction => `
              <tr>
                <td><strong>${transaction.receiptNumber}</strong></td>
                <td>${format(parseISO(transaction.receiptDateTime), 'MMM d, HH:mm')}</td>
                <td style="text-align: right;" class="amount">AED ${transaction.invoiceAmount.toFixed(2)}</td>
                <td style="text-align: right;">AED ${transaction.taxAmount.toFixed(2)}</td>
                <td style="text-align: center;">
                  <span class="status-badge ${transaction.status === 'SALES' ? 'status-sales' : 'status-refund'}">
                    ${transaction.status}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="text-align: right; color: #666; font-size: 13px; margin-top: 10px;">
          Total: ${report.length} transaction(s)
        </div>
      ` : `
        <div class="no-data">
          No transactions recorded for this day
        </div>
      `}

    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>The Burgurry Dashboard</strong></p>
      <p>Automated Daily Report • Generated at ${format(new Date(), 'HH:mm')} ${format(new Date(), 'z')}</p>
      <p style="margin-top: 10px; font-size: 11px;">
        This is an automated email. Please do not reply.<br>
        For support, contact: rajesh.kuttan@absons.ae
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

