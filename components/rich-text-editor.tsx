"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Label } from "@/components/ui/label"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

export function RichTextEditor({ value, onChange, label }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text/html") || e.clipboardData.getData("text/plain")
    document.execCommand("insertHTML", false, text)
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="border rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="bg-gray-50 border-b p-1 sm:p-2 flex flex-wrap gap-0.5 sm:gap-1">
          <button
            type="button"
            onClick={() => execCommand("bold")}
            className="px-2 sm:px-3 py-1 hover:bg-gray-200 rounded font-bold text-sm"
            title="Bold"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => execCommand("italic")}
            className="px-2 sm:px-3 py-1 hover:bg-gray-200 rounded italic text-sm"
            title="Italic"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => execCommand("underline")}
            className="px-2 sm:px-3 py-1 hover:bg-gray-200 rounded underline text-sm"
            title="Underline"
          >
            U
          </button>
          <div className="w-px bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={() => execCommand("formatBlock", "<h1>")}
            className="px-2 sm:px-3 py-1 hover:bg-gray-200 rounded text-xs sm:text-sm"
            title="Heading 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => execCommand("formatBlock", "<h2>")}
            className="px-2 sm:px-3 py-1 hover:bg-gray-200 rounded text-xs sm:text-sm"
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => execCommand("formatBlock", "<h3>")}
            className="px-2 sm:px-3 py-1 hover:bg-gray-200 rounded text-xs sm:text-sm"
            title="Heading 3"
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => execCommand("formatBlock", "<p>")}
            className="px-2 sm:px-3 py-1 hover:bg-gray-200 rounded text-xs sm:text-sm"
            title="Paragraph"
          >
            P
          </button>
          <div className="w-px bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={() => execCommand("insertUnorderedList")}
            className="px-2 sm:px-3 py-1 hover:bg-gray-200 rounded text-xs sm:text-sm"
            title="Bullet List"
          >
            <span className="hidden sm:inline">•</span> List
          </button>
          <button
            type="button"
            onClick={() => execCommand("insertOrderedList")}
            className="px-2 sm:px-3 py-1 hover:bg-gray-200 rounded text-xs sm:text-sm"
            title="Numbered List"
          >
            1<span className="hidden sm:inline">.</span> List
          </button>
          <div className="w-px bg-gray-300 mx-0.5 sm:mx-1" />
          <button
            type="button"
            onClick={() => execCommand("justifyLeft")}
            className="px-2 sm:px-3 py-1 hover:bg-gray-200 rounded text-sm"
            title="Align Left"
          >
            ⬅
          </button>
          <button
            type="button"
            onClick={() => execCommand("justifyCenter")}
            className="px-2 sm:px-3 py-1 hover:bg-gray-200 rounded text-sm"
            title="Align Center"
          >
            ↔
          </button>
          <button
            type="button"
            onClick={() => execCommand("justifyRight")}
            className="px-2 sm:px-3 py-1 hover:bg-gray-200 rounded text-sm"
            title="Align Right"
          >
            ➡
          </button>
          <div className="w-px bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={() => {
              const url = prompt("Enter image URL:")
              if (url) execCommand("insertImage", url)
            }}
            className="px-2 sm:px-3 py-1 hover:bg-gray-200 rounded text-sm"
            title="Insert Image"
          >
            🖼️
          </button>
          <button
            type="button"
            onClick={() => {
              const url = prompt("Enter link URL:")
              if (url) execCommand("createLink", url)
            }}
            className="px-2 sm:px-3 py-1 hover:bg-gray-200 rounded text-sm"
            title="Insert Link"
          >
            🔗
          </button>
        </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          className="min-h-[300px] sm:min-h-[400px] p-3 sm:p-4 focus:outline-none prose prose-sm max-w-none overflow-x-auto"
          style={{
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        />
      </div>
      <p className="text-xs text-gray-500">
        Use the toolbar to format your content. You can add headings, lists, images, and links.
      </p>
    </div>
  )
}
