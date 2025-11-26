"use server"

import { revalidatePath, revalidateTag } from "next/cache"

export async function revalidateArticle(slug: string) {
  // Revalidate the specific article page
  revalidatePath(`/medtimes/${slug}`)
  
  // Revalidate the articles list page
  revalidatePath("/medtimes")
  
  // Revalidate dashboard articles
  revalidatePath("/dashboard/articles")
}

export async function revalidateAllArticles() {
  // Revalidate all article-related pages
  revalidatePath("/medtimes")
  revalidatePath("/dashboard/articles")
  revalidatePath("/")
}
