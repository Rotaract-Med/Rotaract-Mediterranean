"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { FindAndReplace } from "@tiptap/extension-find-and-replace"
import { Selection, CharacterCount } from "@tiptap/extensions"
import { TableKit } from "@tiptap/extension-table"
import FileHandler from "@tiptap/extension-file-handler"
import { TextStyleKit } from "@tiptap/extension-text-style"
import { Details, DetailsSummary, DetailsContent } from "@tiptap/extension-details"
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight"
import { createLowlight, common as lowlightCommon } from "lowlight"
import { TableOfContents, getHierarchicalIndexes } from "@tiptap/extension-table-of-contents"
import { UniqueID } from "@tiptap/extension-unique-id"
import { Youtube } from "@tiptap/extension-youtube"
import { Focus } from "@tiptap/extension-focus"
import { Columns, Column } from "@/components/editor/columns-extension"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"
import {
  SearchAndReplace,
  SearchAndReplaceButton,
} from "@/components/tiptap-ui/search-and-replace"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/tiptap-icons/link-icon"

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// --- Article-specific pieces (not from the Tiptap registry) ---
import { BlockDragHandle } from "@/components/editor/block-drag-handle"
import { BlockPalette } from "@/components/editor/block-palette"
import { BlockPaletteDrop } from "@/components/editor/block-drop-extension"
import { TableButton } from "@/components/editor/table-button"
import { SlashCommand } from "@/components/editor/slash-command"
import { EmojiCommand } from "@/components/editor/emoji-command"
import { TextColorButton } from "@/components/editor/text-color-button"
import { FocusModeButton } from "@/components/editor/focus-mode-button"
import { PreviewToggleButton } from "@/components/editor/preview-toggle-button"
import { TableOfContentsPanel } from "@/components/editor/table-of-contents-panel"
import { LivePreviewPanel } from "@/components/editor/live-preview-panel"
import { EditorStatusBar, type SaveStatus } from "@/components/editor/editor-status-bar"
import { uploadEditorImage } from "@/components/editor/image-upload"
import { toast } from "@/hooks/use-toast"
import type { UploadFunction } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"

// --- Styles ---
// Imported here (rather than via CSS @import in app/globals.css, which the
// CLI wired up by default) because Next's webpack pipeline can't resolve a
// .scss @import from inside a plain .css file - a JS-level import is the
// same pattern every other Tiptap component style above already uses.
import "@/styles/_variables.scss"
import "@/styles/_keyframe-animations.scss"
import "@/components/tiptap-templates/simple/simple-editor.scss"
import "@/styles/tiptap-content.css"
import styles from "@/components/editor/article-editor.module.scss"

const lowlight = createLowlight(lowlightCommon)

const MAX_IMAGE_SIZE = 100 * 1024 * 1024 // matches the S3 upload helper's cap

const SEARCH_AND_REPLACE_SCROLL_OPTIONS: ScrollIntoViewOptions = {
  block: "center",
}

const uploadImage: UploadFunction = (file, onProgress) =>
  uploadEditorImage(file, (pct) => onProgress?.({ progress: pct }))

const IMAGE_MIME_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml"]

function handleDroppedOrPastedImages(currentEditor: import("@tiptap/react").Editor, files: File[], pos?: number) {
  files.forEach(async (file) => {
    try {
      const url = await uploadEditorImage(file)
      const insertAt = typeof pos === "number" ? pos : currentEditor.state.selection.anchor
      currentEditor
        .chain()
        .insertContentAt(insertAt, { type: "image", attrs: { src: url, alt: file.name } })
        .focus()
        .run()
    } catch (err: any) {
      toast({
        title: "Image upload failed",
        description: err.message || "Something went wrong while uploading the image.",
        variant: "destructive",
      })
    }
  })
}

interface ArticleEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  saveStatus?: SaveStatus
  lastSavedAt?: Date | null
}

const MainToolbarContent = ({
  editor,
  onHighlighterClick,
  onLinkClick,
  onSearchAndReplaceClick,
  isSearchAndReplaceOpen,
  searchAndReplaceButtonRef,
  isMobile,
  focusModeActive,
  onToggleFocusMode,
  previewOpen,
  onTogglePreview,
}: {
  editor: import("@tiptap/react").Editor
  onHighlighterClick: () => void
  onLinkClick: () => void
  onSearchAndReplaceClick: () => void
  isSearchAndReplaceOpen: boolean
  searchAndReplaceButtonRef: React.RefObject<HTMLButtonElement | null>
  isMobile: boolean
  focusModeActive: boolean
  onToggleFocusMode: () => void
  previewOpen: boolean
  onTogglePreview: () => void
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu modal={false} levels={[1, 2, 3, 4]} />
        <ListDropdownMenu
          modal={false}
          types={["bulletList", "orderedList", "taskList"]}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        <TextColorButton editor={editor} />
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
        <TableButton editor={editor} />
      </ToolbarGroup>

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
        <FocusModeButton active={focusModeActive} onToggle={onToggleFocusMode} />
        <PreviewToggleButton active={previewOpen} onToggle={onTogglePreview} />
        <SearchAndReplaceButton
          ref={searchAndReplaceButtonRef as React.RefObject<HTMLButtonElement>}
          aria-expanded={isSearchAndReplaceOpen}
          data-active-state={isSearchAndReplaceOpen ? "on" : "off"}
          onClick={onSearchAndReplaceClick}
        />
      </ToolbarGroup>
    </>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)

export function ArticleEditor({ value, onChange, label, saveStatus, lastSavedAt }: ArticleEditorProps) {
  const isMobile = useIsBreakpoint()
  const { height } = useWindowSize()
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main"
  )
  const [isSearchAndReplaceOpen, setIsSearchAndReplaceOpen] = useState(false)
  const [focusModeActive, setFocusModeActive] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(true)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const searchAndReplaceButtonRef = useRef<HTMLButtonElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Article content, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        codeBlock: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image.configure({
        resize: {
          enabled: true,
          directions: ["left", "right", "top", "bottom"],
          minWidth: 80,
          minHeight: 80,
          alwaysPreserveAspectRatio: true,
        },
      }),
      Typography,
      Superscript,
      Subscript,
      Selection,
      CharacterCount,
      TableKit.configure({ table: { resizable: false } }),
      // Text color - only Color/TextStyle, since Highlight above already
      // covers background color (avoids two competing "background" mechanisms).
      TextStyleKit.configure({
        backgroundColor: false,
        fontFamily: false,
        fontSize: false,
        lineHeight: false,
      }),
      Details.configure({ persist: true, openClassName: "is-open" }),
      DetailsSummary,
      DetailsContent,
      CodeBlockLowlight.configure({ lowlight }),
      UniqueID.configure({ types: ["heading"] }),
      TableOfContents.configure({ getIndex: getHierarchicalIndexes }),
      Youtube.configure({ nocookie: true, inline: false }),
      Focus,
      Columns,
      Column,
      SlashCommand,
      EmojiCommand,
      BlockPaletteDrop,
      FileHandler.configure({
        allowedMimeTypes: IMAGE_MIME_TYPES,
        consumePasteEvent: true,
        onDrop: (currentEditor, files, pos) => handleDroppedOrPastedImages(currentEditor, files, pos),
        onPaste: (currentEditor, files) => handleDroppedOrPastedImages(currentEditor, files),
      }),
      FindAndReplace.configure({
        searchDebounceMs: 500,
        injectCSS: false,
      }),
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_IMAGE_SIZE,
        limit: 3,
        upload: uploadImage,
        onError: (error) => {
          console.error("Upload failed:", error)
          toast({
            title: "Image upload failed",
            description: error.message,
            variant: "destructive",
          })
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Keep the editor in sync when `value` changes from outside (draft
  // recovery, PDF import auto-fill) without re-emitting onChange.
  useEffect(() => {
    if (!editor) return
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor])

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  const openSearchAndReplace = useCallback(() => {
    setMobileView("main")
    setIsSearchAndReplaceOpen(true)
  }, [])

  const closeSearchAndReplace = useCallback(() => {
    setIsSearchAndReplaceOpen(false)
    searchAndReplaceButtonRef.current?.focus()
  }, [])

  const toggleSearchAndReplace = useCallback(() => {
    if (isSearchAndReplaceOpen) {
      closeSearchAndReplace()
      return
    }

    openSearchAndReplace()
  }, [closeSearchAndReplace, isSearchAndReplaceOpen, openSearchAndReplace])

  if (!editor) return null

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium leading-none">{label}</label>}
      <div className="rounded-lg border">
        <EditorContext.Provider value={{ editor }}>
          <Toolbar
            ref={toolbarRef}
            style={{
              ...(isMobile
                ? {
                    bottom: `calc(100% - ${height - rect.y}px)`,
                  }
                : {}),
            }}
          >
            {mobileView === "main" ? (
              <MainToolbarContent
                editor={editor}
                onHighlighterClick={() => setMobileView("highlighter")}
                onLinkClick={() => setMobileView("link")}
                onSearchAndReplaceClick={toggleSearchAndReplace}
                isSearchAndReplaceOpen={isSearchAndReplaceOpen}
                searchAndReplaceButtonRef={searchAndReplaceButtonRef}
                isMobile={isMobile}
                focusModeActive={focusModeActive}
                onToggleFocusMode={() => setFocusModeActive((v) => !v)}
                previewOpen={previewOpen}
                onTogglePreview={() => setPreviewOpen((v) => !v)}
              />
            ) : (
              <MobileToolbarContent
                type={mobileView === "highlighter" ? "highlighter" : "link"}
                onBack={() => setMobileView("main")}
              />
            )}
          </Toolbar>

          <SearchAndReplace
            className="simple-editor-search-and-replace"
            open={isSearchAndReplaceOpen}
            onOpen={openSearchAndReplace}
            onClose={closeSearchAndReplace}
            scrollIntoViewOptions={SEARCH_AND_REPLACE_SCROLL_OPTIONS}
          />

          <div className="flex">
            <div className="hidden sm:flex sm:flex-col">
              <BlockPalette editor={editor} />
              <TableOfContentsPanel editor={editor} />
            </div>

            <div className={`flex-1 min-w-0 ${styles.embedded} ${focusModeActive ? styles.focusMode : ""}`}>
              <BlockDragHandle editor={editor} />

              <EditorContent
                editor={editor}
                role="presentation"
                className="simple-editor-content"
              />
            </div>

            {previewOpen && (
              <div className="hidden lg:block w-[380px] xl:w-[440px] shrink-0 border-l">
                <LivePreviewPanel content={value} />
              </div>
            )}
          </div>
        </EditorContext.Provider>

        <EditorStatusBar editor={editor} saveStatus={saveStatus} lastSavedAt={lastSavedAt} />
      </div>
    </div>
  )
}

export default ArticleEditor
