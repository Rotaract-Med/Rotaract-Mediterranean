"use client"

import { useState } from "react"
import type { Editor } from "@tiptap/react"
import { Button } from "@/components/tiptap-ui-primitive/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/tiptap-ui-primitive/popover"
import { Card, CardBody, CardItemGroup } from "@/components/tiptap-ui-primitive/card"
import { ButtonGroup } from "@/components/tiptap-ui-primitive/button-group"
import { Separator } from "@/components/tiptap-ui-primitive/separator"
import { BanIcon } from "@/components/tiptap-icons/ban-icon"

interface TextColorButtonProps {
  editor: Editor
}

// Reuses the --tt-color-text-* palette the vendor SCSS already ships (see
// styles/_variables.scss) - it was defined for exactly this but never wired
// up to a UI control, since the Simple Editor template doesn't include Color.
const TEXT_COLORS = [
  { label: "Gray", value: "var(--tt-color-text-gray)" },
  { label: "Brown", value: "var(--tt-color-text-brown)" },
  { label: "Orange", value: "var(--tt-color-text-orange)" },
  { label: "Yellow", value: "var(--tt-color-text-yellow)" },
  { label: "Green", value: "var(--tt-color-text-green)" },
  { label: "Blue", value: "var(--tt-color-text-blue)" },
  { label: "Purple", value: "var(--tt-color-text-purple)" },
  { label: "Pink", value: "var(--tt-color-text-pink)" },
  { label: "Red", value: "var(--tt-color-text-red)" },
]

export function TextColorButton({ editor }: TextColorButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isActive = editor.isActive("textStyle") && !!editor.getAttributes("textStyle").color

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          data-active-state={isActive ? "on" : "off"}
          tabIndex={-1}
          aria-label="Text color"
          tooltip="Text color"
        >
          <span
            className="tiptap-button-icon"
            style={{
              fontWeight: 700,
              color: isActive ? editor.getAttributes("textStyle").color : undefined,
            }}
          >
            A
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Text colors">
        <Card style={{ boxShadow: "none", border: 0 }}>
          <CardBody style={{ padding: 0 }}>
            <CardItemGroup orientation="horizontal">
              <ButtonGroup>
                {TEXT_COLORS.map((color) => (
                  <Button
                    key={color.value}
                    type="button"
                    variant="ghost"
                    tooltip={color.label}
                    aria-label={`${color.label} text`}
                    onClick={() => {
                      editor.chain().focus().setColor(color.value).run()
                      setIsOpen(false)
                    }}
                  >
                    <span
                      className="tiptap-button-icon"
                      style={{ fontWeight: 700, color: color.value }}
                    >
                      A
                    </span>
                  </Button>
                ))}
              </ButtonGroup>
              <Separator />
              <ButtonGroup>
                <Button
                  type="button"
                  variant="ghost"
                  tooltip="Remove color"
                  aria-label="Remove text color"
                  onClick={() => {
                    editor.chain().focus().unsetColor().run()
                    setIsOpen(false)
                  }}
                >
                  <BanIcon className="tiptap-button-icon" />
                </Button>
              </ButtonGroup>
            </CardItemGroup>
          </CardBody>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
