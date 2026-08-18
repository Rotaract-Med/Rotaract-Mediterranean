"use client"

import type { Editor } from "@tiptap/react"

export type SaveStatus = "idle" | "saving" | "saved" | "error"

interface EditorStatusBarProps {
  editor: Editor | null
  saveStatus?: SaveStatus
  lastSavedAt?: Date | null
}

export function EditorStatusBar({ editor, saveStatus = "idle", lastSavedAt }: EditorStatusBarProps) {
  if (!editor) return null

  const words = editor.storage.characterCount?.words() ?? 0
  const readingTime = Math.max(1, Math.round(words / 200))

  return (
    <div className="flex items-center justify-between px-3 sm:px-4 py-1.5 border-t bg-gray-50 text-xs text-gray-500">
      <span>
        {words} word{words === 1 ? "" : "s"} &middot; {readingTime} min read
      </span>
      {saveStatus !== "idle" && (
        <span className={saveStatus === "error" ? "text-red-500" : ""}>
          {saveStatus === "saving" && "Saving…"}
          {saveStatus === "saved" &&
            (lastSavedAt
              ? `Saved ${lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
              : "Saved")}
          {saveStatus === "error" && "Failed to save"}
        </span>
      )}
    </div>
  )
}
