import { NextRequest, NextResponse } from 'next/server'
import { Readable } from 'stream'

// This endpoint saves EVERYTHING to Google Drive:
// 1. Uploads the project file to a Drive folder
// 2. Saves registration data to a Google Sheets spreadsheet
// Nothing is stored in the local database

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const fullName = formData.get('fullName') as string
        const clubName = formData.get('clubName') as string
        const country = formData.get('country') as string
        const districtNumber = formData.get('districtNumber') as string
        const projectName = formData.get('projectName') as string
        const medCategory = formData.get('medCategory') as string

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        // Uncomment when Google Drive API is configured
        // Install: npm install googleapis
        /*
        const { google } = require('googleapis')
        
        const auth = new google.auth.GoogleAuth({
          credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          },
          scopes: [
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/spreadsheets',
          ],
        })
    
        const drive = google.drive({ version: 'v3', auth })
        const sheets = google.sheets({ version: 'v4', auth })
    
        // 1. Upload the project file to Google Drive
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
    
        const fileMetadata = {
          name: `${medCategory}_${projectName}_${clubName}.${file.name.split('.').pop()}`,
          parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
        }
    
        const media = {
          mimeType: file.type,
          body: Readable.from(buffer),
        }
    
        const fileResponse = await drive.files.create({
          requestBody: fileMetadata,
          media: media,
          fields: 'id, webViewLink, name',
        })
    
        // 2. Save registration data to Google Sheets
        const timestamp = new Date().toISOString()
        const submissionData = [
          timestamp,
          fullName,
          clubName,
          country,
          districtNumber,
          projectName,
          medCategory,
          fileResponse.data.name,
          fileResponse.data.webViewLink,
          fileResponse.data.id,
        ]
    
        await sheets.spreadsheets.values.append({
          spreadsheetId: process.env.GOOGLE_SHEETS_ID,
          range: 'Submissions!A:J', // Adjust sheet name if needed
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [submissionData],
          },
        })
    
        return NextResponse.json({
          success: true,
          fileId: fileResponse.data.id,
          fileUrl: fileResponse.data.webViewLink,
          message: 'Submission saved to Google Drive',
        })
        */

        // Temporary placeholder - returns error until Google Drive is configured
        return NextResponse.json({
            error: 'Google Drive integration not yet configured. Please contact the administrator.',
            details: 'Follow the setup instructions in docs/GOOGLE_DRIVE_INTEGRATION.md',
        }, { status: 503 })

    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
