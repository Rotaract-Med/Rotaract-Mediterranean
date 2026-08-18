"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Save, Send, FileUp, FileText, Upload, ImageIcon, Eye, ChevronDown, ChevronUp } from "lucide-react"
import { RichTextEditor } from "./rich-text-editor"
import { MediaSelector } from "./media-selector"
import { PDFUpload } from "./pdf-upload"
import { PDFS3Upload } from "./pdf-s3-upload"
import type { PDFContent } from "@/lib/pdf-parser"
import { revalidateArticle } from "@/app/actions/revalidate"
import { toast } from "@/hooks/use-toast"
import type { SaveStatus } from "./editor/editor-status-bar"

interface ArticleFormProps {
  article?: any
}

const DRAFT_STORAGE_KEY = "mdiomed:new-article-draft"
const AUTOSAVE_DELAY_MS = 2000

function isNewDraftEmpty(data: { title: string; slug: string; excerpt: string; content: string; featured_image: string }) {
  return !data.title && !data.slug && !data.excerpt && !data.content && !data.featured_image
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
    seo_title: article?.seo_title || "",
    seo_description: article?.seo_description || "",
    og_image: article?.og_image || "",
  })
  const [showPDFUpload, setShowPDFUpload] = useState(false)
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)
  const [showSeoFields, setShowSeoFields] = useState(false)
  const [articleType, setArticleType] = useState<'content' | 'pdf'>(article?.article_type || 'content')
  const [pdfUrl, setPdfUrl] = useState(article?.pdf_url || '')
  const [pdfS3Key, setPdfS3Key] = useState(article?.pdf_s3_key || '')

  // Track baseline values to detect changes. Mutable (unlike the original
  // single-write version) so a successful autosave can move the baseline
  // forward - otherwise the "N fields modified" badge and every future
  // autosave diff would drift out of sync with what's actually saved.
  const [initialValues, setInitialValues] = useState({
    title: article?.title || "",
    slug: article?.slug || "",
    excerpt: article?.excerpt || "",
    content: article?.content || "",
    featured_image: article?.featured_image || "",
    category: article?.category || "Culture",
    status: article?.status || "draft",
    seo_title: article?.seo_title || "",
    seo_description: article?.seo_description || "",
    og_image: article?.og_image || "",
    article_type: article?.article_type || "content",
    pdf_url: article?.pdf_url || "",
    pdf_s3_key: article?.pdf_s3_key || "",
  })

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  // Draft recovery (new articles only - existing articles are autosaved
  // straight to Supabase instead, see below).
  const [recoveryChecked, setRecoveryChecked] = useState(false)
  const [showRecoveryBanner, setShowRecoveryBanner] = useState(false)
  const [recoveredSnapshot, setRecoveredSnapshot] = useState<any>(null)

  // Check if a field has been modified
  const isFieldModified = (fieldName: keyof typeof formData) => {
    return article && formData[fieldName] !== initialValues[fieldName]
  }

  // Count total changes (mirrors the original scope: form fields only, not
  // the separate PDF fields tracked below)
  const changedFieldsCount = article
    ? Object.keys(formData).filter((key) => {
        const fieldKey = key as keyof typeof formData
        return formData[fieldKey] !== initialValues[fieldKey]
      }).length
    : 0

  const isDirty = article
    ? changedFieldsCount > 0 ||
      articleType !== initialValues.article_type ||
      pdfUrl !== initialValues.pdf_url
    : !isNewDraftEmpty(formData) || articleType !== "content" || Boolean(pdfUrl)

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

  // Builds the update/insert payload from whatever differs from
  // `initialValues`. Shared by the explicit Save/Publish buttons and by
  // autosave so they can never disagree about what "changed" means.
  const computeChangedFields = (statusOverride?: string) => {
    const changed: any = {}
    const currentStatus = statusOverride || formData.status

    Object.keys(formData).forEach((key) => {
      const fieldKey = key as keyof typeof formData
      if (fieldKey === "status") return
      if (formData[fieldKey] !== initialValues[fieldKey]) {
        changed[key] = formData[fieldKey]
      }
    })

    if (articleType !== initialValues.article_type) changed.article_type = articleType
    if (pdfUrl !== initialValues.pdf_url) changed.pdf_url = pdfUrl || null
    if (pdfS3Key !== initialValues.pdf_s3_key) changed.pdf_s3_key = pdfS3Key || null

    if (currentStatus !== initialValues.status) {
      changed.status = currentStatus
      if (currentStatus === "published" && !article?.published_at) {
        changed.published_at = new Date().toISOString()
      }
    }

    return changed
  }

  const clearDraftSnapshot = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY)
    } catch {
      // localStorage unavailable (private mode, etc.) - nothing to clean up
    }
  }

  // --- Draft recovery: check once on mount for a new article ---
  useEffect(() => {
    if (article) {
      setRecoveryChecked(true)
      return
    }
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.formData && !isNewDraftEmpty(parsed.formData)) {
          setRecoveredSnapshot(parsed)
          setShowRecoveryBanner(true)
        }
      }
    } catch {
      // corrupt snapshot - ignore
    }
    setRecoveryChecked(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // --- Persist a snapshot for new articles as the user types ---
  useEffect(() => {
    if (article || !recoveryChecked) return
    if (isNewDraftEmpty(formData) && articleType === "content" && !pdfUrl) {
      clearDraftSnapshot()
      return
    }
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({ formData, articleType, pdfUrl, pdfS3Key }))
    } catch {
      // localStorage unavailable - autosave-to-Supabase doesn't apply pre-save, so just skip
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, articleType, pdfUrl, pdfS3Key, article, recoveryChecked])

  const handleRestoreDraft = () => {
    if (!recoveredSnapshot) return
    setFormData((prev) => ({ ...prev, ...recoveredSnapshot.formData }))
    setArticleType(recoveredSnapshot.articleType || "content")
    setPdfUrl(recoveredSnapshot.pdfUrl || "")
    setPdfS3Key(recoveredSnapshot.pdfS3Key || "")
    setShowRecoveryBanner(false)
  }

  const handleDiscardDraft = () => {
    clearDraftSnapshot()
    setShowRecoveryBanner(false)
    setRecoveredSnapshot(null)
  }

  // --- Autosave for existing articles ---
  useEffect(() => {
    if (!article || isLoading) return
    const changed = computeChangedFields()
    if (Object.keys(changed).length === 0) return

    const timer = setTimeout(async () => {
      setSaveStatus("saving")
      const supabase = createClient()
      const { data: savedRows, error: saveError } = await supabase
        .from("articles")
        .update(changed)
        .eq("id", article.id)
        .select("id")
      if (saveError) {
        setSaveStatus("error")
        toast({ title: "Autosave failed", description: saveError.message, variant: "destructive" })
        return
      }
      if (!savedRows || savedRows.length === 0) {
        setSaveStatus("error")
        toast({
          title: "Autosave failed",
          description: "You don't have permission to edit this article.",
          variant: "destructive",
        })
        return
      }
      setInitialValues((prev) => ({ ...prev, ...changed }))
      setSaveStatus("saved")
      setLastSavedAt(new Date())
    }, AUTOSAVE_DELAY_MS)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, articleType, pdfUrl, pdfS3Key, article, isLoading])

  // --- Warn before closing the tab with unsaved work ---
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isDirty])

  const handleCancelClick = () => {
    if (isDirty) {
      setShowCancelConfirm(true)
    } else {
      router.back()
    }
  }

  const confirmDiscardAndLeave = () => {
    if (!article) clearDraftSnapshot()
    setShowCancelConfirm(false)
    router.back()
  }

  const handleSubmit = async (e: React.FormEvent, statusOverride?: string) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      if (article) {
        const changedFields = computeChangedFields(statusOverride)

        if (Object.keys(changedFields).length > 0) {
          const { data: savedRows, error } = await supabase
            .from("articles")
            .update(changedFields)
            .eq("id", article.id)
            .select("id")
          if (error) throw error
          if (!savedRows || savedRows.length === 0) {
            throw new Error("You don't have permission to edit this article.")
          }
          await revalidateArticle(formData.slug)
        }
      } else {
        const currentStatus = statusOverride || formData.status
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
        await revalidateArticle(formData.slug)
        clearDraftSnapshot()
      }

      toast({ title: statusOverride === "published" ? "Article published" : "Article saved" })
      router.push("/dashboard/articles")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      toast({ title: "Failed to save article", description: err.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full overflow-x-hidden">
      <div className="space-y-4 sm:space-y-6">
        {showRecoveryBanner && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm text-amber-800">
              We found an unsaved draft from a previous session. Restore it?
            </p>
            <div className="flex gap-2 shrink-0">
              <Button type="button" size="sm" variant="outline" onClick={handleDiscardDraft}>
                Discard
              </Button>
              <Button type="button" size="sm" onClick={handleRestoreDraft} className="bg-[#193fa6] hover:bg-[#2563eb]">
                Restore draft
              </Button>
            </div>
          </div>
        )}

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
              <span>SEO & Social</span>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowSeoFields(!showSeoFields)}>
                {showSeoFields ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CardTitle>
            <p className="text-sm text-gray-500">
              Overrides for search results and link previews. Leave blank to fall back to the title, excerpt, and featured image above.
            </p>
          </CardHeader>
          {showSeoFields && (
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="seo_title" className={isFieldModified("seo_title") ? "text-blue-600 font-semibold" : ""}>
                    SEO Title {isFieldModified("seo_title") && <span className="text-xs">(modified)</span>}
                  </Label>
                  <span className="text-xs text-gray-400">{formData.seo_title.length}/60</span>
                </div>
                <Input
                  id="seo_title"
                  value={formData.seo_title}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  placeholder={formData.title || "Falls back to Title"}
                  maxLength={60}
                  className={isFieldModified("seo_title") ? "border-blue-400 ring-2 ring-blue-100" : ""}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="seo_description"
                    className={isFieldModified("seo_description") ? "text-blue-600 font-semibold" : ""}
                  >
                    SEO Description {isFieldModified("seo_description") && <span className="text-xs">(modified)</span>}
                  </Label>
                  <span className="text-xs text-gray-400">{formData.seo_description.length}/160</span>
                </div>
                <Textarea
                  id="seo_description"
                  value={formData.seo_description}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  placeholder={formData.excerpt || "Falls back to Excerpt"}
                  rows={2}
                  maxLength={160}
                  className={isFieldModified("seo_description") ? "border-blue-400 ring-2 ring-blue-100" : ""}
                />
              </div>

              <div className="grid gap-2">
                <Label className={isFieldModified("og_image") ? "text-blue-600 font-semibold" : ""}>
                  Social Share Image {isFieldModified("og_image") && <span className="text-xs">(modified)</span>}
                </Label>
                <MediaSelector
                  value={formData.og_image}
                  onChange={(url) => setFormData({ ...formData, og_image: url })}
                  filterType="image"
                />
                <p className="text-xs text-gray-500">Falls back to Featured Image when blank.</p>
              </div>
            </CardContent>
          )}
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
              <div className="flex flex-col sm:flex-row gap-2">
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
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                saveStatus={article ? saveStatus : "idle"}
                lastSavedAt={lastSavedAt}
              />
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
            <Send className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">{isLoading ? "Publishing..." : "Publish"}</span>
          </Button>
          {article && (
            <Link href={`/dashboard/articles/${article.id}/preview`} target="_blank" rel="noopener noreferrer">
              <Button type="button" variant="outline" size="sm">
                <Eye className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Preview</span>
              </Button>
            </Link>
          )}
          <Button type="button" variant="outline" onClick={handleCancelClick} disabled={isLoading} size="sm">
            <span className="hidden sm:inline">Cancel</span>
            <span className="sm:hidden">✕</span>
          </Button>
          {article && changedFieldsCount === 0 && (
            <span className="text-sm text-gray-500 italic">No changes to save</span>
          )}
        </div>
      </div>

      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes that will be lost if you leave this page now.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDiscardAndLeave} className="bg-red-600 hover:bg-red-700">
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  )
}
