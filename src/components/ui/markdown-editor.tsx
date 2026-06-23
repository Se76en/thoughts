"use client";

import { useRef, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading,
  Quote,
  Link,
  Highlighter,
} from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  minHeight?: string;
}

function wrapSelection(
  textarea: HTMLTextAreaElement,
  wrapper: { before: string; after: string }
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.slice(start, end);
  const before = textarea.value.slice(0, start);
  const after = textarea.value.slice(end);

  const replacement = `${wrapper.before}${selected || "text"}${wrapper.after}`;
  const newValue = before + replacement + after;
  const newCursor = start + wrapper.before.length + (selected.length || 0);

  return { value: newValue, cursor: newCursor };
}

function insertAtCursor(textarea: HTMLTextAreaElement, text: string) {
  const start = textarea.selectionStart;
  const before = textarea.value.slice(0, start);
  const after = textarea.value.slice(textarea.selectionEnd);
  return { value: before + text + after, cursor: start + text.length };
}

export function MarkdownEditor({
  value,
  onChange,
  label,
  placeholder,
  minHeight = "400px",
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const exec = useCallback(
    (command: string) => {
      const ta = textareaRef.current;
      if (!ta) return;

      let result: { value: string; cursor: number };

      switch (command) {
        case "bold":
          result = wrapSelection(ta, { before: "**", after: "**" });
          break;
        case "italic":
          result = wrapSelection(ta, { before: "*", after: "*" });
          break;
        case "underline":
          result = wrapSelection(ta, { before: "<u>", after: "</u>" });
          break;
        case "strike":
          result = wrapSelection(ta, { before: "~~", after: "~~" });
          break;
        case "heading":
          result = insertAtCursor(ta, "## ");
          break;
        case "quote":
          result = wrapSelection(ta, { before: "> ", after: "" });
          break;
        case "link":
          result = wrapSelection(ta, { before: "[", after: "](https://)" });
          break;
        case "highlight":
          result = wrapSelection(ta, { before: "==", after: "==" });
          break;
        default:
          return;
      }

      onChange(result.value);
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(result.cursor, result.cursor);
      });
    },
    [onChange]
  );

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label className="text-sm text-foreground/80">{label}</label>
      )}

      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-surface/50 p-2">
        <button onClick={() => exec("bold")} className="h-8 w-8 flex items-center justify-center rounded-md text-foreground/60 hover:bg-accent/10 hover:text-accent transition-colors" title="Bold">
          <Bold className="h-4 w-4" />
        </button>
        <button onClick={() => exec("italic")} className="h-8 w-8 flex items-center justify-center rounded-md text-foreground/60 hover:bg-accent/10 hover:text-accent transition-colors" title="Italic">
          <Italic className="h-4 w-4" />
        </button>
        <button onClick={() => exec("underline")} className="h-8 w-8 flex items-center justify-center rounded-md text-foreground/60 hover:bg-accent/10 hover:text-accent transition-colors" title="Underline">
          <Underline className="h-4 w-4" />
        </button>
        <button onClick={() => exec("strike")} className="h-8 w-8 flex items-center justify-center rounded-md text-foreground/60 hover:bg-accent/10 hover:text-accent transition-colors" title="Strikethrough">
          <Strikethrough className="h-4 w-4" />
        </button>
        <div className="mx-1 h-6 w-px bg-border" />
        <button onClick={() => exec("heading")} className="h-8 w-8 flex items-center justify-center rounded-md text-foreground/60 hover:bg-accent/10 hover:text-accent transition-colors" title="Heading">
          <Heading className="h-4 w-4" />
        </button>
        <button onClick={() => exec("quote")} className="h-8 w-8 flex items-center justify-center rounded-md text-foreground/60 hover:bg-accent/10 hover:text-accent transition-colors" title="Quote">
          <Quote className="h-4 w-4" />
        </button>
        <button onClick={() => exec("link")} className="h-8 w-8 flex items-center justify-center rounded-md text-foreground/60 hover:bg-accent/10 hover:text-accent transition-colors" title="Link">
          <Link className="h-4 w-4" />
        </button>
        <button onClick={() => exec("highlight")} className="h-8 w-8 flex items-center justify-center rounded-md text-foreground/60 hover:bg-accent/10 hover:text-accent transition-colors" title="Highlight">
          <Highlighter className="h-4 w-4" />
        </button>
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 transition-colors focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 font-mono leading-relaxed"
        style={{ minHeight }}
      />
    </div>
  );
}
