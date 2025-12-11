import { format } from 'date-fns';

// Simple logger utility
export const logger = {
  info: (message, ...args) => {
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    console.log(`[${timestamp}] ℹ️  ${message}`, ...args);
  },

  error: (message, ...args) => {
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    console.error(`[${timestamp}] ❌ ${message}`, ...args);
  },

  warn: (message, ...args) => {
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    console.warn(`[${timestamp}] ⚠️  ${message}`, ...args);
  },

  success: (message, ...args) => {
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    console.log(`[${timestamp}] ✅ ${message}`, ...args);
  }
};

