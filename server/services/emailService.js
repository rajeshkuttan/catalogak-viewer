import nodemailer from 'nodemailer';
import { config } from '../config/config.js';
import { fetchTransactionData } from './dataService.js';
import { generateEmailHTML } from '../templates/emailTemplate.js';
import { logger } from '../utils/logger.js';
import { format, subDays } from 'date-fns';

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    tls: config.email.tls,
    // No authentication required
    auth: config.email.auth
  });
};

// Send daily report email
export async function sendDailyReport() {
  const startTime = Date.now();
  logger.info('📊 Fetching yesterday\'s transaction data...');

  try {
    // Get yesterday's date (current date - 1 day)
    const yesterday = subDays(new Date(), 1);
    const dateStr = format(yesterday, 'yyyy-MM-dd');
    const displayDate = format(yesterday, 'MMMM d, yyyy');

    logger.info(`📅 Report date: ${displayDate}`);

    // Fetch data from API
    const data = await fetchTransactionData(yesterday, yesterday);
    
    if (!data || (!data.summary.length && !data.report.length)) {
      logger.warn('⚠️  No data available for yesterday');
      // You can choose to send email with "no data" message or skip
      // For now, we'll send the email anyway
    }

    // Calculate totals
    const totals = data.summary.reduce(
      (acc, item) => ({
        count: acc.count + item.count,
        totalAmount: acc.totalAmount + item.totalAmount,
        totalTax: acc.totalTax + item.totalTax,
        netSales: acc.netSales + item.netSales
      }),
      { count: 0, totalAmount: 0, totalTax: 0, netSales: 0 }
    );

    logger.info(`💰 Total Sales: AED ${totals.totalAmount.toFixed(2)}`);
    logger.info(`📋 Transactions: ${totals.count}`);

    // Generate email HTML
    const emailHTML = generateEmailHTML({
      date: displayDate,
      summary: data.summary,
      report: data.report,
      totals
    });

    // Create transporter
    const transporter = createTransporter();

    // Email options
    const mailOptions = {
      from: `"${config.email.fromName}" <${config.email.from}>`,
      to: config.email.recipients.join(', '),
      subject: `The Burcurry Daily Sales Report - ${displayDate}`,
      html: emailHTML,
      text: generatePlainTextEmail({ date: displayDate, totals, transactionCount: data.report.length })
    };

    // Send email
    logger.info(`📧 Sending email to ${config.email.recipients.length} recipient(s)...`);
    const info = await transporter.sendMail(mailOptions);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    logger.info(`✅ Email sent successfully in ${duration}s`);
    logger.info(`📨 Message ID: ${info.messageId}`);
    logger.info(`📬 Recipients: ${config.email.recipients.join(', ')}`);

    return { success: true, messageId: info.messageId };

  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    logger.error(`❌ Failed to send email after ${duration}s:`, error);
    throw error;
  }
}

// Generate plain text version of email
function generatePlainTextEmail({ date, totals, transactionCount }) {
  return `
THE BURCURRY - DAILY SALES REPORT
${date}

SUMMARY
-------
Total Sales:      AED ${totals.totalAmount.toFixed(2)}
Net Sales:        AED ${totals.netSales.toFixed(2)}
Total Tax:        AED ${totals.totalTax.toFixed(2)}
Transactions:     ${totals.count}

${transactionCount} transaction details are included in the HTML version of this email.

---
This is an automated report from The Burcurry Dashboard.
Sent by: ${config.email.from}
`;
}

// Test email function
export async function sendTestEmail() {
  logger.info('🧪 Sending test email...');
  
  const testData = {
    date: format(new Date(), 'MMMM d, yyyy'),
    summary: [],
    report: [],
    totals: {
      count: 0,
      totalAmount: 0,
      totalTax: 0,
      netSales: 0
    }
  };

  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"${config.email.fromName}" <${config.email.from}>`,
    to: config.email.recipients[0], // Send to first recipient only for testing
    subject: `TEST: The Burcurry Email Service`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>✅ Test Email Successful</h2>
        <p>This is a test email from The Burcurry email service.</p>
        <p><strong>Configuration:</strong></p>
        <ul>
          <li>SMTP Host: ${config.email.host}</li>
          <li>SMTP Port: ${config.email.port}</li>
          <li>From: ${config.email.from}</li>
          <li>Recipients: ${config.email.recipients.length}</li>
        </ul>
        <p>If you received this email, the email service is configured correctly!</p>
      </div>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  logger.info(`✅ Test email sent: ${info.messageId}`);
  
  return { success: true, messageId: info.messageId };
}

