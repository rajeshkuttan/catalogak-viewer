# 📧 The Burgurry Email Service

Automated daily email service that sends sales reports every morning at 10:00 AM (UAE time).

---

## 📋 Overview

This Node.js service:
- ✅ Runs a cron job daily at 10:00 AM
- ✅ Fetches yesterday's transaction data from the API
- ✅ Generates a beautifully formatted HTML email
- ✅ Sends to 6 recipients automatically
- ✅ Uses the company's SMTP server (172.16.0.2)

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

The `.env` file is already configured with the settings from `task.md`:

```env
SMTP_HOST=172.16.0.2
SMTP_PORT=25
SMTP_FROM=no-reply@absons.ae
EMAIL_RECIPIENTS=ali@arabico.ae,accounts@theburgurry.ae,adel@arabico.ae,aqeel@arabico.ae,rajesh.kuttan@absons.ae,mahmoud.hassan@absons.ae
CRON_SCHEDULE=0 10 * * *
TZ=Asia/Dubai
```

### 3. Test the Email Service

```bash
# Test with a simple test email
npm run test

# Test with actual daily report
node test-email.js daily
```

### 4. Start the Service

```bash
# Production mode
npm start

# Development mode (restarts on changes)
npm run dev
```

---

## 📧 Email Recipients (from task.md)

The service sends emails to these 6 recipients:

1. **ali@arabico.ae**
2. **accounts@theburgurry.ae**
3. **adel@arabico.ae**
4. **aqeel@arabico.ae**
5. **rajesh.kuttan@absons.ae**
6. **mahmoud.hassan@absons.ae**

---

## 🔧 SMTP Configuration (from task.md)

```
From: no-reply@absons.ae
Server IP: 172.16.0.2
Port: 25
Authentication: Not Required
TLS/SSL: None
```

---

## ⏰ Schedule

- **Cron Expression**: `0 10 * * *`
- **Time**: 10:00 AM
- **Timezone**: Asia/Dubai (UAE)
- **Frequency**: Daily
- **Report Date**: Yesterday (current date - 1 day)

---

## 📊 Email Content

The email includes:

### 1. Sales Summary Cards
- **Total Sales** (AED)
- **Net Sales** (AED)
- **Total Tax** (AED)
- **Number of Transactions**

### 2. Transaction Details Table
- Receipt Number
- Date & Time
- Invoice Amount (AED)
- Tax Amount (AED)
- Status (SALES/REFUND)

### 3. Professional Branding
- The Burgurry logo and colors
- Responsive HTML design
- Mobile-friendly layout

---

## 🏗️ Project Structure

```
server/
├── index.js                      # Main entry point with cron job
├── package.json                  # Dependencies
├── .env                          # Configuration (from task.md)
├── config/
│   └── config.js                 # Configuration loader
├── services/
│   ├── emailService.js           # Email sending logic
│   └── dataService.js            # API data fetching
├── templates/
│   └── emailTemplate.js          # HTML email template
├── utils/
│   └── logger.js                 # Logging utility
├── test-email.js                 # Testing script
└── README.md                     # This file
```

---

## 🧪 Testing

### Test Commands

```bash
# Send a simple test email (to first recipient only)
npm run test

# Send actual daily report with real data
node test-email.js daily

# Check if service starts correctly
npm run dev
```

### What to Check
1. ✅ Email received by all 6 recipients
2. ✅ Data shows yesterday's transactions
3. ✅ Formatting looks good on desktop and mobile
4. ✅ AED currency displays correctly
5. ✅ All transaction details are included

---

## 🚢 Deployment

### Option 1: Run as a Background Process

```bash
# Install PM2 (process manager)
npm install -g pm2

# Start the service
cd server
pm2 start index.js --name "burgurry-email"

# Make it run on system startup
pm2 startup
pm2 save

# View logs
pm2 logs burcurry-email

# Monitor
pm2 monit
```

### Option 2: Run as a System Service (Linux)

Create `/etc/systemd/system/burcurry-email.service`:

```ini
[Unit]
Description=The Burgurry Email Service
After=network.target

[Service]
Type=simple
User=node
WorkingDirectory=/path/to/catalogak-viewer/server
ExecStart=/usr/bin/node index.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl enable burcurry-email
sudo systemctl start burcurry-email
sudo systemctl status burcurry-email
```

### Option 3: Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

ENV TZ=Asia/Dubai

CMD ["node", "index.js"]
```

Build and run:
```bash
docker build -t burcurry-email .
docker run -d --name burcurry-email --restart always burcurry-email
```

---

## 📝 Logs

The service logs all activities:

```
[2024-01-15 10:00:00] ⏰ Cron job triggered - Starting daily report generation
[2024-01-15 10:00:01] 📊 Fetching yesterday's transaction data...
[2024-01-15 10:00:01] 📅 Report date: January 14, 2024
[2024-01-15 10:00:02] ✅ Summary fetched: 1 record(s)
[2024-01-15 10:00:03] ✅ Report fetched: 45 transaction(s)
[2024-01-15 10:00:03] 💰 Total Sales: AED 1,234.56
[2024-01-15 10:00:03] 📋 Transactions: 45
[2024-01-15 10:00:04] 📧 Sending email to 6 recipient(s)...
[2024-01-15 10:00:05] ✅ Email sent successfully in 1.23s
[2024-01-15 10:00:05] 📨 Message ID: <abc123@mail.server>
```

---

## 🔍 Troubleshooting

### Email Not Sending

1. **Check SMTP Server**
   ```bash
   telnet 172.16.0.2 25
   ```

2. **Check Logs**
   ```bash
   # If using PM2
   pm2 logs burcurry-email --lines 50
   
   # If running directly
   # Check console output
   ```

3. **Test Email Service**
   ```bash
   npm run test
   ```

### Wrong Time Zone

- Make sure `TZ=Asia/Dubai` is set in `.env`
- Verify server timezone: `date`

### No Data in Report

- Check API credentials in `.env`
- Verify API is accessible: `curl https://api-client.catalogak.net/api/v6/Viewer/GetTransactionSummary?...`
- Check date range (yesterday might have no transactions)

### Cron Job Not Running

- Check cron expression: `0 10 * * *` means 10:00 AM daily
- Verify timezone setting
- Check if service is running: `pm2 status` or `systemctl status burcurry-email`

---

## 🔒 Security Notes

### Current Implementation
- ✅ No authentication required (as per task.md specifications)
- ✅ No TLS/SSL (as per task.md specifications)
- ⚠️ API credentials in .env file (acceptable for internal server)

### Recommendations for Production
1. **Secure the .env file**
   ```bash
   chmod 600 .env
   chown node:node .env
   ```

2. **Use environment variables instead of .env file**
   ```bash
   export SMTP_HOST=172.16.0.2
   export SMTP_PORT=25
   # etc...
   ```

3. **Implement API proxy** (move credentials to backend)

4. **Add email rate limiting** (prevent abuse)

5. **Monitor failures** (alert if email fails)

---

## 📈 Monitoring

### Health Check

Add this endpoint for monitoring:

```javascript
// In index.js
import express from 'express';
const app = express();

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'burcurry-email',
    lastRun: lastRunTime,
    nextRun: getNextRunTime()
  });
});

app.listen(3000);
```

### Email Delivery Monitoring

- Check logs daily for failures
- Set up alerts if email bounces
- Monitor SMTP server availability

---

## 🎯 Features

- ✅ **Automated Daily Emails** - Runs at 10:00 AM every day
- ✅ **Yesterday's Data** - Always sends previous day's sales
- ✅ **6 Recipients** - All stakeholders get the report
- ✅ **Professional HTML Email** - Branded and responsive
- ✅ **Summary & Details** - Both high-level and transaction-level data
- ✅ **AED Currency** - Proper formatting for UAE
- ✅ **Reliable Delivery** - Uses company's SMTP server
- ✅ **Error Handling** - Logs failures and retries
- ✅ **Timezone Aware** - Dubai/UAE timezone (Asia/Dubai)

---

## 📞 Support

### Common Commands

```bash
# Start service
npm start

# Test email
npm run test

# Check logs (if using PM2)
pm2 logs burcurry-email

# Restart service (if using PM2)
pm2 restart burcurry-email

# Stop service (if using PM2)
pm2 stop burcurry-email
```

### Contact

For issues or questions:
- **Technical Support**: rajesh.kuttan@absons.ae
- **Email Service**: no-reply@absons.ae

---

## ✅ Checklist for Production

- [ ] Install dependencies: `npm install`
- [ ] Test email service: `npm run test`
- [ ] Test with real data: `node test-email.js daily`
- [ ] Verify all 6 recipients receive email
- [ ] Deploy with PM2 or systemd
- [ ] Set up monitoring/alerts
- [ ] Verify cron runs at 10:00 AM UAE time
- [ ] Check logs after first automated run
- [ ] Confirm email formatting on mobile devices
- [ ] Test SMTP server connectivity

---

## 🎉 Summary

This email service is **ready to deploy** and configured exactly as specified in `task.md`:

✅ **SMTP**: 172.16.0.2:25 (no auth, no TLS)  
✅ **From**: no-reply@absons.ae  
✅ **Recipients**: 6 email addresses  
✅ **Schedule**: 10:00 AM daily (UAE time)  
✅ **Data**: Yesterday's sales and transactions  
✅ **Format**: Professional HTML email with The Burgurry branding  

**Just run `npm install` and `npm start`!** 🚀

