# PDF Import Feature for MEDTimes Articles

## Overview

The PDF import feature allows journalists and admins to upload PDF files and automatically extract the content into the article form, eliminating the need for manual typing.

## How It Works

### Components Created

1. **`lib/pdf-parser.ts`** - Core PDF parsing utility

   - Uses `pdfjs-dist` to extract text from PDFs
   - Preserves layout by analyzing text positioning
   - Automatically detects headings vs paragraphs
   - Converts content to HTML format
   - Generates title and excerpt from PDF content

2. **`components/pdf-upload.tsx`** - Upload interface

   - Drag-and-drop support
   - Click to browse functionality
   - Visual feedback during processing
   - Error handling and validation
   - Shows file info after selection

3. **`components/article-form.tsx`** - Updated to include PDF import
   - New "Import from PDF" card with toggle button
   - Automatically populates all fields when PDF is processed
   - Generates URL-friendly slug from title

## Usage Instructions

### For Content Creators

1. Navigate to **Dashboard → Articles → New Article**
2. Click the **"Upload PDF"** button in the "Import from PDF" section
3. Either:
   - Drag and drop a PDF file onto the upload area, or
   - Click "Choose File" to browse your computer
4. Wait for the PDF to be processed (usually 1-3 seconds)
5. The form will automatically populate with:
   - **Title**: First line of the PDF
   - **Slug**: Auto-generated from title
   - **Excerpt**: First substantial paragraph (up to 200 chars)
   - **Content**: Full PDF text converted to HTML
6. Review and edit the extracted content as needed
7. Add a featured image and select category
8. Save as draft or publish

### What Gets Extracted

- **Text Content**: All text from every page
- **Structure**: Headings and paragraphs are detected based on line length
- **Layout**: Multiple columns and sections are preserved where possible
- **Page Breaks**: Shown as horizontal rules between pages

### Important Notes

- Only PDF files are accepted
- The feature works best with text-based PDFs (not scanned images)
- Complex layouts may require some manual adjustment
- Rich formatting (bold, italic) is not preserved - you can add it manually using the rich text editor
- Images from PDFs are not extracted - add them separately via the media library

## Technical Details

### Browser Compatibility

- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Processing happens client-side (no server upload needed)

### Performance

- Small PDFs (< 5 pages): ~1 second
- Medium PDFs (5-20 pages): 2-5 seconds
- Large PDFs (20+ pages): 5-10 seconds

### Error Handling

- Invalid file type: Shows error message
- Corrupted PDF: Shows "Failed to parse PDF" error
- Processing errors: Displays user-friendly error message

## Example Workflow

```
1. User uploads "MedTimes_September.pdf"
2. System extracts:
   - Title: "Mediterranean Stories: September Edition"
   - Slug: "mediterranean-stories-september-edition"
   - Excerpt: "This month we explore the cultural heritage..."
   - Content: Full HTML with headings and paragraphs
3. User reviews content
4. User adds featured image from media library
5. User selects category "Culture"
6. User clicks "Publish"
```

## Future Enhancements

Potential improvements:

- [ ] OCR support for scanned PDFs
- [ ] Image extraction from PDFs
- [ ] Table preservation
- [ ] Font style preservation (bold, italic)
- [ ] Progress bar for large files
- [ ] Preview extracted content before applying
