"use client";

import dynamic from "next/dynamic";
import React from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "./MarkdownTextEditor.css";

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface MarkdownTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const MarkdownTextEditor = ({
  value,
  onChange,
  // placeholder = "Write your post...",
}: MarkdownTextEditorProps) => (
  <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
    <MDEditor
      value={value}
      onChange={(val) => onChange(val || "")}
      // placeholder={placeholder}
      height={256}
      data-color-mode="light"
      hideToolbar={false}
      preview="edit"
      // className="markdown-editor"
    />
  </div>
);
