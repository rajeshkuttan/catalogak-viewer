import cron from 'node-cron';
import { sendDailyReport } from './services/emailService.js';
import { config } from './config/config.js';
import { logger } from './utils/logger.js';

// Main function to start the cron job
async function startEmailService() {
  logger.info('🚀 The Burgurry Email Service Starting...');
  logger.info(`📧 Recipients: ${config.email.recipients.length} email(s)`);
  logger.info(`⏰ Schedule: Daily at 10:00 AM (${config.cron.schedule})`);
  logger.info(`🌍 Timezone: ${config.timezone}`);
  
  // Schedule the cron job
  cron.schedule(config.cron.schedule, async () => {
    logger.info('⏰ Cron job triggered - Starting daily report generation');
    
    try {
      await sendDailyReport();
      logger.info('✅ Daily report sent successfully');
    } catch (error) {
      logger.error('❌ Failed to send daily report:', error);
    }
  }, {
    scheduled: true,
    timezone: config.timezone
  });

  logger.info('✅ Email service is running. Press Ctrl+C to stop.');
  logger.info(`📅 Next report will be sent at 10:00 AM ${config.timezone} time`);
  
  // Send a test notification on startup (optional)
  if (process.env.NODE_ENV === 'development') {
    logger.info('🧪 Development mode - Testing email service...');
    try {
      await sendDailyReport();
      logger.info('✅ Test email sent successfully');
    } catch (error) {
      logger.error('❌ Test email failed:', error);
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  logger.info('\n👋 Email service shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('\n👋 Email service shutting down gracefully...');
  process.exit(0);
});

// Start the service
startEmailService().catch((error) => {
  logger.error('💥 Failed to start email service:', error);
  process.exit(1);
});

