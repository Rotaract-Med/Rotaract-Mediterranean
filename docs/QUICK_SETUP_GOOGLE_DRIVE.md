# Quick Setup Guide - Google Drive Integration

Follow these steps to activate Google Drive integration for award submissions.

## ⚡ Quick Checklist

- [ ] Create Google Cloud Project
- [ ] Enable Google Drive API
- [ ] Enable Google Sheets API
- [ ] Create Service Account & download JSON key
- [ ] Create Google Drive folder
- [ ] Share folder with service account
- [ ] Create Google Sheets spreadsheet
- [ ] Add header row to spreadsheet
- [ ] Share spreadsheet with service account
- [ ] Add environment variables to `.env.local`
- [ ] Install googleapis: `npm install googleapis`
- [ ] Uncomment code in `app/api/awards/upload-to-drive/route.ts`
- [ ] Test the form

## 📋 Environment Variables Needed

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID=your-folder-id
GOOGLE_SHEETS_ID=your-spreadsheet-id
```

## 🏃 Fast Track (30 minutes)

### Step 1: Google Cloud (10 min)
1. Go to https://console.cloud.google.com/
2. New Project → Name it "MED Awards"
3. APIs & Services → Enable "Google Drive API" & "Google Sheets API"
4. Credentials → Create Service Account → Download JSON key
5. Copy the `client_email` from JSON

### Step 2: Google Sheets (5 min)
1. Create new spreadsheet: "MED Awards 2026 Submissions"
2. Rename sheet to "Submissions"
3. Add header row:
   ```
   Timestamp | Full Name | Club Name | Country | District Number | Project Name | MED Category | File Name | File Link | File ID
   ```
4. Share → Add service account email → Editor access
5. Copy spreadsheet ID from URL

### Step 3: Google Drive (5 min)
1. Create folder: "MED Awards 2026 - Project Files"
2. Share → Add service account email → Editor access
3. Copy folder ID from URL

### Step 4: Configure App (10 min)
1. Add all 4 environment variables to `.env.local`
2. Run: `npm install googleapis`
3. Edit `app/api/awards/upload-to-drive/route.ts`:
   - Uncomment lines 18-70 (the API code)
   - Delete lines 74-79 (the placeholder error)
4. Restart dev server: `npm run dev`
5. Test by submitting a form

## ✅ Testing

1. Open http://localhost:3000/awards
2. Click "Apply Now"
3. Fill in all fields
4. Upload a test PDF
5. Submit

**Success indicators:**
- Toast shows "Application Submitted! 🎉"
- File appears in Google Drive folder
- New row appears in Google Sheets

## 🔍 Troubleshooting

**Error: "Google Drive not configured"**
→ Environment variables not set correctly

**Error: "Authentication failed"**
→ Check private key format (needs `\n` for newlines)

**File uploads but no spreadsheet entry**
→ Check `GOOGLE_SHEETS_ID` and sheet name is "Submissions"

**Spreadsheet entry but no file**
→ Check `GOOGLE_DRIVE_FOLDER_ID` is correct

## 📞 Need Help?

Full documentation: `docs/GOOGLE_DRIVE_INTEGRATION.md`
