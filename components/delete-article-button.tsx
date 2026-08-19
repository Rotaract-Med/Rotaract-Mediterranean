"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"
import { revalidateAllArticles } from "@/app/actions/revalidate"
import { toast } from "@/hooks/use-toast"
import { extractPdfPageUrls, deleteSupersededPdfPages } from "@/lib/pdf-parser"

export function DeleteArticleButton({ articleId }: { articleId: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const supabase = createClient()

    try {
      const { data: deletedRows, error } = await supabase
        .from("articles")
        .delete()
        .eq("id", articleId)
        .select("id, content")
      if (error) throw error
      if (!deletedRows || deletedRows.length === 0) {
        throw new Error("You don't have permission to delete this article.")
      }

      // The deleted article's own PDF-import pages (if any) never had a
      // media_library row to track them, so nothing else cleans them up.
      deleteSupersededPdfPages(extractPdfPageUrls(deletedRows[0].content || ""))

      // Revalidate all article pages
      await revalidateAllArticles()

      router.refresh()
    } catch (err: any) {
      console.error("Error deleting article:", err)
      toast({
        title: "Failed to delete article",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the article.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
