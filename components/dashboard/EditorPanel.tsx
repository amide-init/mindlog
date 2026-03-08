"use client";

import { useEffect, useState } from "react";
import { LuxeEditor, getEditorJSON } from "luxe-edit";
import type { ToolbarItem } from "luxe-edit";
import "luxe-edit/index.css";

const toolbarItems: ToolbarItem[] = [
  { type: "undo" },
  { type: "redo" },
  { type: "divider" },
  { type: "bold" },
  { type: "italic" },
  { type: "underline" },
  { type: "strikethrough" },
  { type: "divider" },
  { type: "textColor" },
  { type: "backgroundColor" },
  { type: "divider" },
  { type: "headingDropdown" },
  { type: "divider" },
  { type: "link" },
  { type: "divider" },
  { type: "alignLeft" },
  { type: "alignCenter" },
  { type: "alignRight" },
  { type: "alignJustify" },
  { type: "divider" },
  { type: "fullscreen" },
];

const floatingToolbarItems: ToolbarItem[] = [
  { type: "bold" },
  { type: "italic" },
  { type: "underline" },
  { type: "strikethrough" },
  { type: "link" },
];

function useColorScheme(): "light" | "dark" {
  const [scheme, setScheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setScheme(mq.matches ? "dark" : "light");
    const handler = () => setScheme(mq.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return scheme;
}

export function EditorPanel() {
  const colorScheme = useColorScheme();

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-1 overflow-hidden">
        <LuxeEditor
          initialConfig={{ namespace: "MindLogEditor" }}
          showToolbar
          showFloatingToolbar
          toolbarItems={toolbarItems}
          floatingToolbarItems={floatingToolbarItems}
          colorScheme={colorScheme}
          onChange={(editorState) => {
            getEditorJSON(editorState);
          }}
        />
      </div>
    </div>
  );
}

