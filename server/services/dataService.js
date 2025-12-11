import axios from 'axios';
import { config } from '../config/config.js';
import { format } from 'date-fns';
import { logger } from '../utils/logger.js';

// Build API URL with parameters
function buildApiUrl(endpoint, fromDate, toDate) {
  const params = new URLSearchParams({
    username: config.api.username,
    password: config.api.password,
    appKey: config.api.appKey,
    from: format(fromDate, 'yyyy-MM-dd'),
    to: format(toDate, 'yyyy-MM-dd')
  });

  return `${config.api.baseUrl}/${endpoint}?${params}`;
}

// Fetch transaction summary
async function fetchTransactionSummary(fromDate, toDate) {
  const url = buildApiUrl('GetTransactionSummary', fromDate, toDate);
  
  try {
    logger.info('📡 Fetching transaction summary...');
    const response = await axios.get(url, { timeout: 30000 });
    logger.info(`✅ Summary fetched: ${response.data.length} record(s)`);
    return response.data;
  } catch (error) {
    logger.error('❌ Failed to fetch transaction summary:', error.message);
    throw new Error(`Failed to fetch summary: ${error.message}`);
  }
}

// Fetch transaction report (detailed)
async function fetchTransactionReport(fromDate, toDate) {
  const url = buildApiUrl('GetTransactionReport', fromDate, toDate);
  
  try {
    logger.info('📡 Fetching transaction report...');
    const response = await axios.get(url, { timeout: 30000 });
    logger.info(`✅ Report fetched: ${response.data.length} transaction(s)`);
    return response.data;
  } catch (error) {
    logger.error('❌ Failed to fetch transaction report:', error.message);
    throw new Error(`Failed to fetch report: ${error.message}`);
  }
}

// Fetch both summary and report
export async function fetchTransactionData(fromDate, toDate) {
  try {
    const [summary, report] = await Promise.all([
      fetchTransactionSummary(fromDate, toDate),
      fetchTransactionReport(fromDate, toDate)
    ]);

    return {
      summary: summary || [],
      report: report || []
    };
  } catch (error) {
    logger.error('❌ Failed to fetch transaction data:', error);
    throw error;
  }
}

