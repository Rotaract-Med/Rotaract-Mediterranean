"use client"

import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Extension } from "@tiptap/core"
import { PluginKey } from "@tiptap/pm/state"
import { ReactRenderer } from "@tiptap/react"
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion"
import { gitHubEmojis } from "@tiptap/extension-emoji"
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"

interface EmojiItem {
  emoji: string
  name: string
}

const MAX_RESULTS = 30

function filterEmojis(query: string): EmojiItem[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  const matches: EmojiItem[] = []
  for (const item of gitHubEmojis) {
    if (!item.emoji) continue
    if (
      item.name.includes(q) ||
      item.shortcodes.some((s) => s.includes(q)) ||
      item.tags.some((t) => t.includes(q))
    ) {
      matches.push({ emoji: item.emoji, name: item.name })
      if (matches.length >= MAX_RESULTS) break
    }
  }
  return matches
}

interface EmojiListProps {
  items: EmojiItem[]
  command: (item: EmojiItem) => void
}

interface EmojiListHandle {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

const EmojiList = forwardRef<EmojiListHandle, EmojiListProps>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => setSelectedIndex(0), [items])

  useImperativeHandle(ref, () => ({
    onKeyDown({ event }) {
      if (event.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev + 1) % items.length)
        return true
      }
      if (event.key === "ArrowUp") {
        setSelectedIndex((prev) => (prev + items.length - 1) % items.length)
        return true
      }
      if (event.key === "Enter") {
        if (items[selectedIndex]) command(items[selectedIndex])
        return true
      }
      return false
    },
  }))

  if (items.length === 0) {
    return (
      <Command className="w-56 rounded-lg border shadow-md">
        <CommandList>
          <CommandEmpty>Keep typing to search emoji</CommandEmpty>
        </CommandList>
      </Command>
    )
  }

  return (
    <Command className="w-56 rounded-lg border shadow-md" shouldFilter={false}>
      <CommandList>
        <CommandGroup>
          {items.map((item, index) => (
            <CommandItem
              key={item.name}
              data-selected={index === selectedIndex}
              onMouseEnter={() => setSelectedIndex(index)}
              onSelect={() => command(item)}
            >
              <span className="text-base">{item.emoji}</span>
              <span className="text-muted-foreground">:{item.name}:</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
})
EmojiList.displayName = "EmojiList"

const suggestion: Omit<SuggestionOptions<EmojiItem>, "editor"> = {
  char: ":",
  pluginKey: new PluginKey("emojiCommandSuggestion"),
  startOfLine: false,
  items: ({ query }) => filterEmojis(query),
  command: ({ editor, range, props }) => {
    editor.chain().focus().deleteRange(range).insertContent(props.emoji).run()
  },
  render: () => {
    let component: ReactRenderer<EmojiListHandle, EmojiListProps>
    let unmount: (() => void) | null = null

    return {
      onStart: (props) => {
        component = new ReactRenderer(EmojiList, {
          props: { items: props.items, command: props.command },
          editor: props.editor,
        })
        unmount = props.mount?.(component.element) ?? null
        if (!unmount) {
          document.body.appendChild(component.element)
          Object.assign((component.element as HTMLElement).style, {
            position: "absolute",
            zIndex: "50",
          })
        }
      },
      onUpdate: (props) => {
        component.updateProps({ items: props.items, command: props.command })
      },
      onKeyDown: (props) => {
        if (props.event.key === "Escape") {
          unmount?.()
          component.destroy()
          return true
        }
        return component.ref?.onKeyDown(props) ?? false
      },
      onExit: () => {
        unmount?.()
        component.destroy()
      },
    }
  },
}

export const EmojiCommand = Extension.create({
  name: "emojiCommand",

  addOptions() {
    return { suggestion }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})

export default EmojiCommand
