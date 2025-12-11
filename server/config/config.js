import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

export const config = {
  // Email configuration
  email: {
    host: process.env.SMTP_HOST || '172.16.0.2',
    port: parseInt(process.env.SMTP_PORT || '25', 10),
    from: process.env.SMTP_FROM || 'no-reply@absons.ae',
    fromName: process.env.SMTP_FROM_NAME || 'The Burcurry Dashboard',
    recipients: (process.env.EMAIL_RECIPIENTS || '').split(',').filter(Boolean),
    // No authentication required as per requirements
    auth: null,
    secure: false, // No TLS/SSL
    tls: {
      rejectUnauthorized: false
    }
  },

  // API configuration
  api: {
    baseUrl: process.env.API_BASE_URL || 'https://api-client.catalogak.net/api/v6/Viewer',
    username: process.env.API_USERNAME || 'TestBurgerry',
    password: process.env.API_PASSWORD || 'TestBurgerry@123',
    appKey: process.env.API_APP_KEY || 'F513903D-47AE-44FE-F06D-08DE36385AF9'
  },

  // Cron configuration
  cron: {
    // Default: 10:00 AM daily (0 10 * * *)
    schedule: process.env.CRON_SCHEDULE || '0 10 * * *'
  },

  // Timezone
  timezone: process.env.TZ || 'Asia/Dubai',

  // Environment
  env: process.env.NODE_ENV || 'production'
};

// Validate critical configuration
if (config.email.recipients.length === 0) {
  console.error('❌ ERROR: No email recipients configured!');
  console.error('Please set EMAIL_RECIPIENTS in .env file');
  process.exit(1);
}

export default config;

