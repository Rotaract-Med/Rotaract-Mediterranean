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
        <div className="bg-gray-50 border-b p-2 flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => execCommand("bold")}
            className="px-3 py-1 hover:bg-gray-200 rounded font-bold"
            title="Bold"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => execCommand("italic")}
            className="px-3 py-1 hover:bg-gray-200 rounded italic"
            title="Italic"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => execCommand("underline")}
            className="px-3 py-1 hover:bg-gray-200 rounded underline"
            title="Underline"
          >
            U
          </button>
          <div className="w-px bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={() => execCommand("formatBlock", "<h1>")}
            className="px-3 py-1 hover:bg-gray-200 rounded text-sm"
            title="Heading 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => execCommand("formatBlock", "<h2>")}
            className="px-3 py-1 hover:bg-gray-200 rounded text-sm"
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => execCommand("formatBlock", "<h3>")}
            className="px-3 py-1 hover:bg-gray-200 rounded text-sm"
            title="Heading 3"
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => execCommand("formatBlock", "<p>")}
            className="px-3 py-1 hover:bg-gray-200 rounded text-sm"
            title="Paragraph"
          >
            P
          </button>
          <div className="w-px bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={() => execCommand("insertUnorderedList")}
            className="px-3 py-1 hover:bg-gray-200 rounded"
            title="Bullet List"
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => execCommand("insertOrderedList")}
            className="px-3 py-1 hover:bg-gray-200 rounded"
            title="Numbered List"
          >
            1. List
          </button>
          <div className="w-px bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={() => execCommand("justifyLeft")}
            className="px-3 py-1 hover:bg-gray-200 rounded"
            title="Align Left"
          >
            ⬅
          </button>
          <button
            type="button"
            onClick={() => execCommand("justifyCenter")}
            className="px-3 py-1 hover:bg-gray-200 rounded"
            title="Align Center"
          >
            ↔
          </button>
          <button
            type="button"
            onClick={() => execCommand("justifyRight")}
            className="px-3 py-1 hover:bg-gray-200 rounded"
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
            className="px-3 py-1 hover:bg-gray-200 rounded"
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
            className="px-3 py-1 hover:bg-gray-200 rounded"
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
          className="min-h-[400px] p-4 focus:outline-none prose prose-sm max-w-none"
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
