# Google Drive Integration for Award Submissions

This document explains how to set up Google Drive integration for the Mediterranean Outstanding Project Awards application form.

## Overview

The application form saves **EVERYTHING** to Google Drive:
1. **Project files** → Uploaded to a Google Drive folder
2. **Registration data** → Saved to a Google Sheets spreadsheet

**Nothing is stored in the local database.** All submissions are managed entirely through Google Drive and Google Sheets.

## What Gets Saved

### Google Drive Folder
Contains all uploaded project presentation files with format:
```
{MedCategory}_{ProjectName}_{ClubName}.{extension}
```
Example: `MedLove_Clean Water Initiative_Rotaract Athens.pdf`

### Google Sheets Spreadsheet
Contains all registration information with columns:
1. Timestamp
2. Full Name
3. Club Name
4. Country
5. District Number
6. Project Name
7. MED Category
8. File Name
9. File Link (clickable link to the uploaded file)
10. File ID (Google Drive file ID)

## Setup Instructions

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID

### 2. Enable Required APIs

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for and enable:
   - **Google Drive API**
   - **Google Sheets API**

### 3. Create a Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `awards-submission-manager`
   - Description: `Service account for managing award submissions in Google Drive and Sheets`
4. Click "Create and Continue"
5. Grant the service account the role: "Editor"
6. Click "Done"

### 4. Generate Service Account Key

1. Click on the created service account
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Download the key file (**keep it secure!**)
6. Note the `client_email` from the JSON file

### 5. Create Google Sheets Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: "MED Awards 2026 Submissions"
4. Rename the first sheet to: **"Submissions"**
5. Add header row with these columns:
   ```
   Timestamp | Full Name | Club Name | Country | District Number | Project Name | MED Category | File Name | File Link | File ID
   ```
6. Share the spreadsheet:
   - Click "Share" button
   - Add the service account email (from step 4)
   - Give it "Editor" permissions
7. Copy the spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
   ```

### 6. Create Google Drive Folder

1. Go to [Google Drive](https://drive.google.com)
2. Create a new folder: "MED Awards 2026 - Project Files"
3. Share the folder:
   - Right-click > "Share"
   - Add the service account email
   - Give it "Editor" permissions
4. Copy the folder ID from the URL:
   ```
   https://drive.google.com/drive/folders/{FOLDER_ID}
   ```

### 7. Set Environment Variables

Add these variables to your `.env.local` file:

```env
# Google Drive & Sheets Integration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID=your-folder-id-here
GOOGLE_SHEETS_ID=your-spreadsheet-id-here
```

**Important Notes:**
- The private key should include the full key with `\n` for newlines
- Keep the quotes around the private key
- Never commit these credentials to version control
- Add `.env.local` to your `.gitignore`

### 8. Install Required Package

```bash
npm install googleapis
```

### 9. Activate Google Drive Code

In `app/api/awards/upload-to-drive/route.ts`:
1. Uncomment the Google Drive/Sheets code (lines with `/*` and `*/`)
2. Remove the placeholder error response at the bottom

### 10. Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to the Awards page
3. Click "Apply Now"
4. Fill in all fields in the multi-step form
5. Upload a test file
6. Submit the form

If successful, you should see:
- ✅ The file in your Google Drive folder
- ✅ A new row in your Google Sheets spreadsheet
- ✅ A success toast notification

## Managing Submissions

### Viewing All Submissions

Open your Google Sheets spreadsheet to see all submissions in one place. You can:
- Sort by category, country, or date
- Filter submissions
- Add status columns (e.g., "Under Review", "Approved", "Rejected")
- Add reviewer notes
- Share specific rows with reviewers

### Accessing Project Files

1. Click the "File Link" in the spreadsheet
2. Or browse the Google Drive folder directly
3. Files are automatically named for easy identification

### Organizing by Category

You can organize submissions by:
1. Using filters in Google Sheets
2. Creating separate folders for each MED category in Drive
3. Using Google Apps Script to auto-organize files

### Sample Google Sheets Formula

To count submissions by category:
```
=COUNTIF(G:G,"MedLove")
```

To filter by country:
```
=FILTER(A:J, D:D="Greece")
```

## Advantages of Google Drive Approach

✅ **No Database Costs** - Everything stored in Google Drive (free 15GB)
✅ **Easy Collaboration** - Share spreadsheet with reviewers
✅ **Automatic Backups** - Google handles backups
✅ **Version History** - Track all changes
✅ **Familiar Interface** - Everyone knows Google Sheets
✅ **Easy Export** - Download as Excel, CSV, or PDF
✅ **Real-time Updates** - See submissions instantly
✅ **Built-in Comments** - Reviewers can comment on rows

## Security Considerations

1. **Service Account Security**: 
   - Keep the JSON key file secure
   - Never commit it to version control
   - Rotate keys periodically
   - Store in environment variables only

2. **Folder/Sheet Permissions**:
   - Only share with the service account and authorized reviewers
   - Use "Editor" for service account
   - Use "Viewer" or "Commenter" for reviewers
   - Review permissions regularly

3. **File Validation**:
   - Max file size: 50MB
   - Allowed types: PDF, Word, PowerPoint
   - Validated both client-side and server-side

4. **Rate Limiting**:
   - Google Drive API has quotas - monitor usage
   - Google Sheets API: 100 requests per 100 seconds per user
   - Implement rate limiting if needed

## Advanced Features

### Auto-Email Notifications

Use Google Apps Script to send emails when new submissions arrive:

```javascript
function onEdit(e) {
  var sheet = e.source.getActiveSheet();
  if (sheet.getName() == "Submissions") {
    var lastRow = sheet.getLastRow();
    var emailBody = "New submission from " + sheet.getRange(lastRow, 2).getValue();
    MailApp.sendEmail("admin@example.com", "New Award Submission", emailBody);
  }
}
```

### Data Validation

Add dropdown lists in Google Sheets for status tracking:
1. Add a "Status" column
2. Data > Data validation
3. Add options: Pending, Under Review, Approved, Rejected

### Charts and Analytics

Create charts in Google Sheets to visualize:
- Submissions by category
- Submissions by country
- Submissions over time

## Troubleshooting

### "Failed to upload file"
- ✓ Check that the service account email is added to both the Drive folder AND the spreadsheet
- ✓ Verify the folder ID and spreadsheet ID are correct
- ✓ Check the private key format in environment variables

### "Authentication failed"
- ✓ Ensure the private key includes `\n` for newlines
- ✓ Verify the service account email matches the JSON key file
- ✓ Check that both APIs (Drive & Sheets) are enabled

### "Spreadsheet not found"
- ✓ Verify the spreadsheet ID is correct
- ✓ Ensure the service account has "Editor" access to the spreadsheet
- ✓ Check that the sheet name is exactly "Submissions"

### "Quota exceeded"
- ✓ Monitor your Google Cloud quotas
- ✓ Implement caching and rate limiting
- ✓ Consider upgrading your Google Cloud plan if needed

### File appears but not in spreadsheet (or vice versa)
- ✓ Check server logs for errors
- ✓ Ensure both operations are completing successfully
- ✓ Verify both the folder and spreadsheet IDs are correct

## Backup Strategy

Although Google Drive auto-backs up your data:

1. **Weekly Exports**: Download the spreadsheet as Excel weekly
2. **Drive Backups**: Use Google Takeout for full backups
3. **Version History**: Google Sheets keeps 30-day revision history

## Support

For issues with Google Drive integration:
- Review Google Cloud Console logs
- Check the Apps Script execution logs
- Contact: tech@rotaractmediterranean.com
