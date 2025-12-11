import { sendTestEmail, sendDailyReport } from './services/emailService.js';
import { logger } from './utils/logger.js';
import { config } from './config/config.js';

async function test() {
  logger.info('🧪 Starting email service test...');
  logger.info('');
  logger.info('Configuration:');
  logger.info(`  SMTP Host: ${config.email.host}`);
  logger.info(`  SMTP Port: ${config.email.port}`);
  logger.info(`  From: ${config.email.from}`);
  logger.info(`  Recipients: ${config.email.recipients.join(', ')}`);
  logger.info('');

  const args = process.argv.slice(2);
  const testType = args[0] || 'test';

  try {
    if (testType === 'daily') {
      logger.info('📊 Sending DAILY REPORT...');
      await sendDailyReport();
    } else {
      logger.info('📧 Sending TEST EMAIL...');
      await sendTestEmail();
    }
    
    logger.info('');
    logger.info('✅ Test completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Test failed:', error);
    process.exit(1);
  }
}

test();

