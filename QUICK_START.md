# 🚀 Quick Start Guide - The Burcurry Email Service

## ✅ Both Issues Fixed!

### Issue 1: `npm run test` - ✅ FIXED
**Problem**: `.env` file was missing  
**Solution**: Created `.env` file with all configuration

### Issue 2: `pm2 start` - ✅ FIXED
**Problem**: PM2 not installed  
**Solution**: Installed PM2 globally and started service

---

## 📧 Service Status

### ✅ Currently Running

```
✅ Service Name: burcurry-email
✅ Status: ONLINE
✅ PID: Running
✅ Uptime: Active
✅ Next Email: Tomorrow at 10:00 AM (Asia/Dubai time)
```

---

## 🎯 Useful Commands

### Check Status
```bash
pm2 status
```

### View Logs
```bash
pm2 logs burcurry-email
pm2 logs burcurry-email --lines 50
```

### Restart Service
```bash
pm2 restart burcurry-email
```

### Stop Service
```bash
pm2 stop burcurry-email
```

### Test Email Manually
```bash
cd D:\Projects\1765\catalogak-viewer\server
npm run test
```

### Send Daily Report Manually (Testing)
```bash
cd D:\Projects\1765\catalogak-viewer\server
node test-email.js daily
```

---

## 📅 Schedule

- **Time**: 10:00 AM daily
- **Timezone**: Asia/Dubai (UAE)
- **Data**: Yesterday's sales (current date - 1 day)
- **Recipients**: 6 emails

### Recipients List
1. ali@arabico.ae
2. accounts@theburgurry.ae
3. adel@arabico.ae
4. aqeel@arabico.ae
5. rajesh.kuttan@absons.ae
6. mahmoud.hassan@absons.ae

---

## 🔧 Configuration

All settings are in: `D:\Projects\1765\catalogak-viewer\server\.env`

```env
SMTP_HOST=172.16.0.2
SMTP_PORT=25
SMTP_FROM=no-reply@absons.ae
EMAIL_RECIPIENTS=ali@arabico.ae,accounts@theburgurry.ae,adel@arabico.ae,aqeel@arabico.ae,rajesh.kuttan@absons.ae,mahmoud.hassan@absons.ae
CRON_SCHEDULE=0 10 * * *
TZ=Asia/Dubai
```

---

## 📊 What Happens Daily

1. **10:00 AM** - Cron job triggers
2. **Fetch Data** - Gets yesterday's transactions from API
3. **Generate Email** - Creates HTML email with:
   - Sales summary (Total, Net, Tax, Count)
   - Transaction details table
   - The Burcurry branding
4. **Send Email** - Delivers to all 6 recipients
5. **Log Result** - Records success/failure

---

## 🧪 Testing

### Test Connection (Quick)
```bash
cd D:\Projects\1765\catalogak-viewer\server
npm run test
```

This sends a simple test email to verify SMTP is working.

### Test with Real Data
```bash
cd D:\Projects\1765\catalogak-viewer\server
node test-email.js daily
```

This sends an actual daily report with real transaction data.

---

## 📝 Monitoring

### View Live Logs
```bash
pm2 logs burcurry-email --lines 100
```

### Expected Log Output
```
[2025-12-11 10:00:00] ⏰ Cron job triggered - Starting daily report generation
[2025-12-11 10:00:01] 📊 Fetching yesterday's transaction data...
[2025-12-11 10:00:02] ✅ Summary fetched: 1 record(s)
[2025-12-11 10:00:03] ✅ Report fetched: 45 transaction(s)
[2025-12-11 10:00:04] 💰 Total Sales: AED 1,234.56
[2025-12-11 10:00:05] 📧 Sending email to 6 recipient(s)...
[2025-12-11 10:00:06] ✅ Email sent successfully in 1.5s
```

---

## 🔍 Troubleshooting

### Service Not Running?
```bash
pm2 status
pm2 restart burcurry-email
```

### Email Not Sent?
1. Check logs: `pm2 logs burcurry-email`
2. Test SMTP: `npm run test`
3. Verify .env configuration

### Wrong Time?
- Check timezone in `.env`: `TZ=Asia/Dubai`
- Verify cron schedule: `CRON_SCHEDULE=0 10 * * *`

---

## 🎉 You're All Set!

✅ Email service is **RUNNING**  
✅ Will send **daily at 10:00 AM UAE time**  
✅ Goes to **6 recipients**  
✅ Contains **yesterday's sales data**  
✅ Professional **HTML email** with branding  

**Next email will be sent tomorrow at 10:00 AM!** 📧

---

## 📞 Support

For issues or questions:
- **Technical**: rajesh.kuttan@absons.ae
- **Service Email**: no-reply@absons.ae

---

## 📚 More Documentation

- **`server/README.md`** - Complete technical documentation
- **`EMAIL_SERVICE_DEPLOYMENT.md`** - Deployment guide
- **`task.md`** - Original requirements

---

**Service is ready! No further action needed.** 🎊

