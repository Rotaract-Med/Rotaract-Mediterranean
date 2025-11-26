# MEDTimes PDF-First Redesign Plan

## Overview

Instead of converting PDFs to HTML content, we'll store PDFs directly in S3 and display them using embedded PDF viewers. This is more efficient and preserves the original formatting.

## Database Changes

### Migration: `018_add_pdf_support_to_articles.sql`

```sql
ALTER TABLE public.articles
ADD COLUMN IF NOT EXISTS pdf_url TEXT,
ADD COLUMN IF NOT EXISTS pdf_s3_key TEXT,
ADD COLUMN IF NOT EXISTS article_type TEXT DEFAULT 'content' CHECK (article_type IN ('content', 'pdf'));
```

**Run this migration first!**

## Implementation Steps

### 1. Article Types

- **`content`**: Traditional articles with HTML content (current system)
- **`pdf`**: PDF-based articles stored in S3

### 2. Updated Article Form (`components/article-form.tsx`)

Add these state variables:

```typescript
const [articleType, setArticleType] = useState<"content" | "pdf">(
  article?.article_type || "content"
);
const [pdfUrl, setPdfUrl] = useState(article?.pdf_url || "");
const [pdfS3Key, setPdfS3Key] = useState(article?.pdf_s3_key || "");
```

Add article type selector (after category):

```typescript
<div className="grid gap-2">
  <Label htmlFor="article_type">Article Type</Label>
  <Select
    value={articleType}
    onValueChange={(value: "content" | "pdf") => setArticleType(value)}
  >
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="content">📝 Content (HTML)</SelectItem>
      <SelectItem value="pdf">📄 PDF Document</SelectItem>
    </SelectContent>
  </Select>
</div>
```

Replace the "Import from PDF" card with:

```typescript
{
  articleType === "pdf" ? (
    <Card>
      <CardHeader>
        <CardTitle>Upload PDF Article</CardTitle>
        <p className="text-sm text-gray-500">
          Upload your MEDTimes issue as a PDF. It will be stored in S3 and
          displayed as an embedded document.
        </p>
      </CardHeader>
      <CardContent>
        <PDFS3Upload
          onPDFUploaded={(url, key, fileName) => {
            setPdfUrl(url);
            setPdfS3Key(key);
            if (!formData.title) {
              setFormData({
                ...formData,
                title: fileName.replace(".pdf", "").replace(/-/g, " "),
              });
            }
          }}
          currentPdfUrl={pdfUrl}
        />
      </CardContent>
    </Card>
  ) : (
    <>
      {/* Existing PDF extraction card */}
      {/* Existing content editor card */}
    </>
  );
}
```

Update the submit handler to include PDF fields:

```typescript
const articleData = {
  ...formData,
  article_type: articleType,
  pdf_url: articleType === "pdf" ? pdfUrl : null,
  pdf_s3_key: articleType === "pdf" ? pdfS3Key : null,
  content: articleType === "content" ? formData.content : "",
  status: currentStatus,
  author_id: user.id,
  published_at: currentStatus === "published" ? new Date().toISOString() : null,
};
```

### 3. Article Detail Page (`app/medtimes/[slug]/page.tsx`)

Create a new component for displaying articles:

```typescript
{
  article.article_type === "pdf" && article.pdf_url ? (
    <div className="w-full h-screen">
      <iframe
        src={article.pdf_url}
        className="w-full h-full border-0"
        title={article.title}
      />
    </div>
  ) : (
    <div
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: article.content }}
    />
  );
}
```

### 4. MEDTimes Listing Page (`app/medtimes/page.tsx`)

Add PDF badge to article cards:

```typescript
{
  article.article_type === "pdf" && (
    <Badge className="bg-red-600">📄 PDF</Badge>
  );
}
```

### 5. Dashboard Articles List (`app/dashboard/articles/page.tsx`)

Show article type in the list:

```typescript
<Badge variant="outline">
  {article.article_type === "pdf" ? "📄 PDF" : "📝 Content"}
</Badge>
```

## Benefits of This Approach

1. **No Conversion Loss**: Original PDF formatting is preserved
2. **Faster Upload**: No need to parse and convert PDF pages
3. **Professional Display**: PDFs display exactly as designed
4. **Storage Efficiency**: One PDF file instead of converted images + HTML
5. **S3 Benefits**: CDN distribution, scalability, backup
6. **Flexibility**: Still supports traditional content articles

## User Workflow

### For PDF Articles:

1. Create new article
2. Select "PDF Document" as article type
3. Upload PDF to S3
4. Add title, excerpt, featured image, category
5. Publish

### For Traditional Articles:

1. Create new article
2. Keep "Content (HTML)" as article type
3. Write content or import from PDF (old way)
4. Add featured image, category
5. Publish

## Next Steps

1. Run migration `018_add_pdf_support_to_articles.sql`
2. Import `PDFS3Upload` component in `article-form.tsx`
3. Add article type selector to form
4. Update submit handler
5. Update article detail page
6. Test with sample PDF
