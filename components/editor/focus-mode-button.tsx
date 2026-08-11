"use client"

import { Focus } from "lucide-react"
import { Button } from "@/components/tiptap-ui-primitive/button"

interface FocusModeButtonProps {
  active: boolean
  onToggle: () => void
}

// Dims every block except the one currently focused (CSS lives in
// article-editor.module.scss, keyed off the .has-focus class the Focus
// extension applies) - a writing aid, off by default.
export function FocusModeButton({ active, onToggle }: FocusModeButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      data-active-state={active ? "on" : "off"}
      tabIndex={-1}
      aria-pressed={active}
      aria-label="Focus mode"
      tooltip="Focus mode"
      onClick={onToggle}
    >
      <Focus className="tiptap-button-icon" />
    </Button>
  )
}
