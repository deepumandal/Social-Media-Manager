"use client";

import dynamic from "next/dynamic";
import React from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "./MarkdownTextEditor.css";
import { Block } from "../ui/Block";

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface FullScreenTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onPostAndPreview: () => void;
  postId: string | null;
  platform: string | null;
}

export const FullScreenTextEditor = ({
  value,
  onChange,
  onPostAndPreview,
  postId,
  platform,
}: FullScreenTextEditorProps) => (
  <div className="min-h-screen bg-gray-50">
    {/* Header */}
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Social Media Manager
          </h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
            <span className="font-medium">ID:</span>
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
              {postId}
            </span>
            <span>•</span>
            <span className="capitalize font-medium">{platform}</span>
          </div>
        </div>

        <button
          onClick={onPostAndPreview}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-200 font-medium"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z"
              clipRule="evenodd"
            />
          </svg>
          <span>Post & Preview</span>
        </button>
      </div>
    </div>

    {/* Editor */}
    <div className="flex-1 p-6">
      <div className="max-w-[1440px] mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Post Content
            </h2>
          </div>
          <Block asElement="article" className="p-6">
            <MDEditor
              value={value}
              onChange={(val) => onChange(val || "")}
              height={600}
              data-color-mode="light"
              hideToolbar={false}
              preview="edit"
            />
          </Block>
        </div>
      </div>
    </div>
  </div>
);
