"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Eye, FileUp, FileText, Upload, ImageIcon } from "lucide-react"
import { RichTextEditor } from "./rich-text-editor"
import { MediaSelector } from "./media-selector"
import { PDFUpload } from "./pdf-upload"
import { PDFS3Upload } from "./pdf-s3-upload"
import type { PDFContent } from "@/lib/pdf-parser"
import { revalidateArticle } from "@/app/actions/revalidate"

interface ArticleFormProps {
  article?: any
}

export function ArticleForm({ article }: ArticleFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: article?.title || "",
    slug: article?.slug || "",
    excerpt: article?.excerpt || "",
    content: article?.content || "",
    featured_image: article?.featured_image || "",
    category: article?.category || "Culture",
    status: article?.status || "draft",
  })
  const [showPDFUpload, setShowPDFUpload] = useState(false)
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)
  const [articleType, setArticleType] = useState<'content' | 'pdf'>(article?.article_type || 'content')
  const [pdfUrl, setPdfUrl] = useState(article?.pdf_url || '')
  const [pdfS3Key, setPdfS3Key] = useState(article?.pdf_s3_key || '')
  
  // Track initial values to detect changes
  const [initialValues] = useState({
    title: article?.title || "",
    slug: article?.slug || "",
    excerpt: article?.excerpt || "",
    content: article?.content || "",
    featured_image: article?.featured_image || "",
    category: article?.category || "Culture",
    status: article?.status || "draft",
    article_type: article?.article_type || "content",
    pdf_url: article?.pdf_url || "",
    pdf_s3_key: article?.pdf_s3_key || "",
  })
  
  // Check if a field has been modified
  const isFieldModified = (fieldName: keyof typeof formData) => {
    return article && formData[fieldName] !== initialValues[fieldName]
  }
  
  // Count total changes
  const changedFieldsCount = article
    ? Object.keys(formData).filter((key) => {
        const fieldKey = key as keyof typeof formData
        return formData[fieldKey] !== initialValues[fieldKey]
      }).length
    : 0

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: article ? formData.slug : generateSlug(title),
    })
  }

  const handlePDFContentExtracted = (pdfContent: PDFContent) => {
    setFormData({
      ...formData,
      title: pdfContent.title,
      slug: generateSlug(pdfContent.title),
      excerpt: pdfContent.excerpt,
      content: pdfContent.htmlContent,
    })
    setShowPDFUpload(false)
  }

  const handleSubmit = async (e: React.FormEvent, status?: string) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      // Determine which fields have actually changed
      const changedFields: any = {}
      const currentStatus = status || formData.status
      
      if (article) {
        // Only include fields that have changed
        Object.keys(formData).forEach((key) => {
          const fieldKey = key as keyof typeof formData
          if (formData[fieldKey] !== initialValues[fieldKey]) {
            changedFields[key] = formData[fieldKey]
          }
        })
        
        // Check PDF-specific fields
        if (articleType !== initialValues.article_type) {
          changedFields.article_type = articleType
        }
        if (pdfUrl !== initialValues.pdf_url) {
          changedFields.pdf_url = pdfUrl || null
        }
        if (pdfS3Key !== initialValues.pdf_s3_key) {
          changedFields.pdf_s3_key = pdfS3Key || null
        }
        
        // Always include status if it changed
        if (currentStatus !== initialValues.status) {
          changedFields.status = currentStatus
        }
        
        // Handle published_at for status changes
        if (currentStatus === "published" && !article?.published_at) {
          changedFields.published_at = new Date().toISOString()
        }
        
        // Only update if there are changes
        if (Object.keys(changedFields).length > 0) {
          const { error } = await supabase.from("articles").update(changedFields).eq("id", article.id)
          if (error) throw error
        }
      } else {
        // New article - include all fields
        const articleData = {
          ...formData,
          article_type: articleType,
          pdf_url: articleType === 'pdf' ? pdfUrl : null,
          pdf_s3_key: articleType === 'pdf' ? pdfS3Key : null,
          content: articleType === 'content' ? formData.content : '',
          status: currentStatus,
          author_id: user.id,
          published_at: currentStatus === "published" ? new Date().toISOString() : null,
        }
        const { error } = await supabase.from("articles").insert([articleData])
        if (error) throw error
      }

      // Only revalidate if changes were made
      if (!article || Object.keys(changedFields).length > 0) {
        await revalidateArticle(formData.slug)
      }

      router.push("/dashboard/articles")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        {article && changedFieldsCount > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>{changedFieldsCount}</strong> field{changedFieldsCount > 1 ? "s" : ""} modified. Only changed data will be saved.
            </p>
          </div>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Article Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className={isFieldModified("title") ? "text-blue-600 font-semibold" : ""}>
                Title {isFieldModified("title") && <span className="text-xs">(modified)</span>}
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter article title"
                required
                className={isFieldModified("title") ? "border-blue-400 ring-2 ring-blue-100" : ""}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug" className={isFieldModified("slug") ? "text-blue-600 font-semibold" : ""}>
                Slug {isFieldModified("slug") && <span className="text-xs">(modified)</span>}
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="article-url-slug"
                required
                className={isFieldModified("slug") ? "border-blue-400 ring-2 ring-blue-100" : ""}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category" className={isFieldModified("category") ? "text-blue-600 font-semibold" : ""}>
                Category {isFieldModified("category") && <span className="text-xs">(modified)</span>}
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className={isFieldModified("category") ? "border-blue-400 ring-2 ring-blue-100" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Culture">Culture</SelectItem>
                  <SelectItem value="Nature">Nature</SelectItem>
                  <SelectItem value="Love">Love</SelectItem>
                  <SelectItem value="Events">Events</SelectItem>
                  <SelectItem value="Stories">Stories</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="article_type">
                Article Type {articleType !== initialValues.article_type && <span className="text-xs text-blue-600">(modified)</span>}
              </Label>
              <Select
                value={articleType}
                onValueChange={(value: 'content' | 'pdf') => {
                  setArticleType(value);
                  // Clear PDF data when switching to content type
                  if (value === 'content') {
                    setPdfUrl('');
                    setPdfS3Key('');
                  }
                }}
              >
                <SelectTrigger className={articleType !== initialValues.article_type ? "border-blue-400 ring-2 ring-blue-100" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="content">📝 Content (HTML)</SelectItem>
                  <SelectItem value="pdf">📄 PDF Document</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                {articleType === 'pdf' 
                  ? 'Upload a PDF that will be displayed as an embedded document' 
                  : 'Write HTML content with the rich text editor'}
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="excerpt" className={isFieldModified("excerpt") ? "text-blue-600 font-semibold" : ""}>
                Excerpt {isFieldModified("excerpt") && <span className="text-xs">(modified)</span>}
              </Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief summary of the article"
                rows={3}
                className={isFieldModified("excerpt") ? "border-blue-400 ring-2 ring-blue-100" : ""}
              />
            </div>

            <div className="grid gap-2">
              <Label className={isFieldModified("featured_image") ? "text-blue-600 font-semibold" : ""}>
                Featured Image {isFieldModified("featured_image") && <span className="text-xs">(modified)</span>}
              </Label>
              <MediaSelector
                value={formData.featured_image}
                onChange={(url) => setFormData({ ...formData, featured_image: url })}
                filterType="image"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Import from PDF</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPDFUpload(!showPDFUpload)}
              >
                <FileUp className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{showPDFUpload ? "Hide" : "Upload PDF"}</span>
              </Button>
            </CardTitle>
            <p className="text-sm text-gray-500">
              Upload a PDF file to automatically extract the title, excerpt, and content.
            </p>
          </CardHeader>
          {showPDFUpload && (
            <CardContent>
              <PDFUpload onContentExtracted={handlePDFContentExtracted} />
            </CardContent>
          )}
        </Card>

        {articleType === 'pdf' ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                PDF Document
              </CardTitle>
              <p className="text-sm text-gray-500">
                Upload a new PDF or select an existing one from the media library.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={!showMediaLibrary ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowMediaLibrary(false)}
                  className={!showMediaLibrary ? "bg-[#193fa6]" : ""}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New PDF
                </Button>
                <Button
                  type="button"
                  variant={showMediaLibrary ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowMediaLibrary(true)}
                  className={showMediaLibrary ? "bg-[#193fa6]" : ""}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Select from Library
                </Button>
              </div>

              {!showMediaLibrary ? (
                <>
                  <PDFS3Upload
                    onPDFUploaded={(url: string, key: string, filename: string) => {
                      setPdfUrl(url);
                      setPdfS3Key(key);
                      // Auto-populate title from filename if title is empty
                      if (!formData.title) {
                        setFormData({
                          ...formData,
                          title: filename.replace('.pdf', '').replace(/[-_]/g, ' ')
                        });
                      }
                    }}
                    currentPdfUrl={pdfUrl}
                  />
                  {pdfUrl && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-800 font-medium">✓ PDF uploaded successfully</p>
                      <p className="text-xs text-green-600 mt-1 truncate">{pdfUrl}</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <MediaSelector
                    value={pdfUrl}
                    onChange={(url) => {
                      setPdfUrl(url);
                      // Extract S3 key from URL (assuming format: https://domain/bucket/key)
                      const urlParts = url.split('/');
                      const key = urlParts.slice(3).join('/');
                      setPdfS3Key(key);
                      
                      // Auto-populate title from filename if title is empty
                      if (!formData.title) {
                        const filename = urlParts[urlParts.length - 1];
                        setFormData({
                          ...formData,
                          title: decodeURIComponent(filename).replace('.pdf', '').replace(/[-_]/g, ' ')
                        });
                      }
                    }}
                    filterType="pdf"
                  />
                  {pdfUrl && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-800 font-medium">✓ PDF selected from library</p>
                      <p className="text-xs text-blue-600 mt-1 truncate">{pdfUrl}</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className={isFieldModified("content") ? "text-blue-600" : ""}>
                Content {isFieldModified("content") && <span className="text-xs font-normal">(modified)</span>}
              </CardTitle>
              <p className="text-sm text-gray-500">
                Write your article content with rich formatting. You can add images, headings, lists, and more.
              </p>
            </CardHeader>
            <CardContent className={isFieldModified("content") ? "ring-2 ring-blue-100 rounded-md p-4" : ""}>
              <RichTextEditor value={formData.content} onChange={(content) => setFormData({ ...formData, content })} />
            </CardContent>
          </Card>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <Button type="submit" disabled={isLoading} className="bg-[#193fa6] hover:bg-[#2563eb]" size="sm">
            <Save className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">
              {isLoading 
                ? "Saving..." 
                : article && changedFieldsCount > 0 
                  ? `Save ${changedFieldsCount} Change${changedFieldsCount > 1 ? "s" : ""}`
                  : "Save as Draft"
              }
            </span>
          </Button>
          <Button
            type="button"
            onClick={(e) => handleSubmit(e, "published")}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
            size="sm"
          >
            <Eye className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">{isLoading ? "Publishing..." : "Publish"}</span>
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading} size="sm">
            <span className="hidden sm:inline">Cancel</span>
            <span className="sm:hidden">✕</span>
          </Button>
          {article && changedFieldsCount === 0 && (
            <span className="text-sm text-gray-500 italic">No changes to save</span>
          )}
        </div>
      </div>
    </form>
  )
}
