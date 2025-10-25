"use client";

import React, { useState, useRef } from "react";
import { applyStyling } from "@/utils/unicodeStyling";

interface UnicodeTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const UnicodeTextEditor = ({
  value,
  onChange,
  placeholder = "Write your post...",
}: UnicodeTextEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleSelectionChange = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      setSelection({ start, end });
    }
  };

  const applyStyle = (
    style:
      | "bold"
      | "italic"
      | "boldItalic"
      | "underline"
      | "strikethrough"
      | "monospace",
  ) => {
    if (selection.start === selection.end) return; // No text selected

    const newValue = applyStyling(value, selection, style);
    onChange(newValue);

    // Reset selection
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  const insertEmoji = (emoji: string) => {
    const newValue =
      value.slice(0, selection.start) + emoji + value.slice(selection.end);
    onChange(newValue);
  };

  const ToolbarButton = ({
    onClick,
    children,
    title,
    disabled = false,
  }: {
    onClick: () => void;
    children: React.ReactNode;
    title: string;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-transparent hover:border-gray-200"
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-300">
        <ToolbarButton
          onClick={() => applyStyle("bold")}
          title="Bold"
          disabled={selection.start === selection.end}
        >
          <span className="font-bold text-sm">B</span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => applyStyle("italic")}
          title="Italic"
          disabled={selection.start === selection.end}
        >
          <span className="italic text-sm">I</span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => applyStyle("underline")}
          title="Underline"
          disabled={selection.start === selection.end}
        >
          <span className="underline text-sm">U</span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => applyStyle("strikethrough")}
          title="Strikethrough"
          disabled={selection.start === selection.end}
        >
          <span className="line-through text-sm">S</span>
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton onClick={() => insertEmoji("😊")} title="Insert Emoji">
          <span className="text-sm">😊</span>
        </ToolbarButton>

        <ToolbarButton onClick={() => insertEmoji("📷")} title="Insert Image">
          <span className="text-sm">📷</span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => insertEmoji("🌍")}
          title="Insert Location"
        >
          <span className="text-sm">🌍</span>
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => applyStyle("monospace")}
          title="Code"
          disabled={selection.start === selection.end}
        >
          <span className="font-mono text-xs">&lt;/&gt;</span>
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton onClick={() => insertEmoji("• ")} title="Bullet List">
          <span className="text-sm">•</span>
        </ToolbarButton>

        <ToolbarButton onClick={() => insertEmoji("1. ")} title="Numbered List">
          <span className="text-sm">1.</span>
        </ToolbarButton>
      </div>

      {/* Text Area */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextChange}
          onSelect={handleSelectionChange}
          placeholder={placeholder}
          className="w-full h-64 p-4 resize-none border-0 focus:outline-none focus:ring-0 bg-white text-gray-900 placeholder-gray-500 leading-relaxed"
          style={{
            fontFamily:
              'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        />
        {/* Character Counter */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white px-2 py-1 rounded">
          {value.length} characters
        </div>
      </div>
    </div>
  );
};
