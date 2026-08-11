"use client"

import { PanelRightClose, PanelRightOpen } from "lucide-react"
import { Button } from "@/components/tiptap-ui-primitive/button"

interface PreviewToggleButtonProps {
  active: boolean
  onToggle: () => void
}

export function PreviewToggleButton({ active, onToggle }: PreviewToggleButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      data-active-state={active ? "on" : "off"}
      tabIndex={-1}
      aria-pressed={active}
      aria-label={active ? "Hide preview" : "Show preview"}
      tooltip={active ? "Hide preview" : "Show preview"}
      onClick={onToggle}
    >
      {active ? (
        <PanelRightClose className="tiptap-button-icon" />
      ) : (
        <PanelRightOpen className="tiptap-button-icon" />
      )}
    </Button>
  )
}
