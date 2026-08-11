"use client"

import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Extension } from "@tiptap/core"
import { PluginKey } from "@tiptap/pm/state"
import { ReactRenderer } from "@tiptap/react"
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion"
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import {
  BLOCK_LIBRARY_ITEMS,
  filterBlockLibraryItems,
  type BlockLibraryItem,
} from "@/components/editor/block-library"

interface SlashMenuListProps {
  items: BlockLibraryItem[]
  command: (item: BlockLibraryItem) => void
}

interface SlashMenuListHandle {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

const SlashMenuList = forwardRef<SlashMenuListHandle, SlashMenuListProps>(
  ({ items, command }, ref) => {
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
        <Command className="w-72 rounded-lg border shadow-md">
          <CommandList>
            <CommandEmpty>No matching blocks</CommandEmpty>
          </CommandList>
        </Command>
      )
    }

    return (
      <Command className="w-72 rounded-lg border shadow-md" shouldFilter={false}>
        <CommandList>
          <CommandGroup heading="Blocks">
            {items.map((item, index) => (
              <CommandItem
                key={item.title}
                data-selected={index === selectedIndex}
                onMouseEnter={() => setSelectedIndex(index)}
                onSelect={() => command(item)}
              >
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded ${item.chipClass}`}>
                  <item.icon className="h-4 w-4" />
                </span>
                <div className="flex flex-col">
                  <span className="font-medium leading-none">{item.title}</span>
                  <span className="text-xs text-muted-foreground mt-0.5">
                    {item.description}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    )
  }
)
SlashMenuList.displayName = "SlashMenuList"

const suggestion: Omit<SuggestionOptions<BlockLibraryItem>, "editor"> = {
  char: "/",
  pluginKey: new PluginKey("slashCommandSuggestion"),
  startOfLine: false,
  items: ({ query }) => filterBlockLibraryItems(query),
  command: ({ editor, range, props }) => {
    props.run(editor, range)
  },
  render: () => {
    let component: ReactRenderer<SlashMenuListHandle, SlashMenuListProps>
    let unmount: (() => void) | null = null

    return {
      onStart: (props) => {
        component = new ReactRenderer(SlashMenuList, {
          props: { items: props.items, command: props.command },
          editor: props.editor,
        })
        unmount = props.mount?.(component.element) ?? null
        if (!unmount) {
          // Fallback for suggestion versions without `mount` (positions manually).
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

export const SlashCommand = Extension.create({
  name: "slashCommand",

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

export default SlashCommand
export { BLOCK_LIBRARY_ITEMS }
