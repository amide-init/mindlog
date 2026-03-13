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
  const [scheme, setScheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const getFromDom = (): "light" | "dark" =>
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light";

    setScheme(getFromDom());

    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ theme?: string }>).detail;
      if (detail?.theme === "dark" || detail?.theme === "light") {
        setScheme(detail.theme);
      } else {
        setScheme(getFromDom());
      }
    };

    window.addEventListener("mindlog-theme-change", handler);
    return () => window.removeEventListener("mindlog-theme-change", handler);
  }, []);

  return scheme;
}

type EditorPanelProps = {
  initialJSON?: unknown;
  onChange?: (json: unknown) => void;
};

export function EditorPanel({ initialJSON, onChange }: EditorPanelProps) {
  const colorScheme = useColorScheme();

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-1 overflow-hidden">
        <LuxeEditor
          initialConfig={{ namespace: "MindLogEditor" }}
          initialJSON={initialJSON ?? undefined}
          showToolbar
          showFloatingToolbar
          toolbarItems={toolbarItems}
          floatingToolbarItems={floatingToolbarItems}
          colorScheme={colorScheme}
          onChange={(editorState) => {
            const json = getEditorJSON(editorState);
            onChange?.(json);
          }}
        />
      </div>
    </div>
  );
}

