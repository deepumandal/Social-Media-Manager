"use client";

import { useState } from "react";
import { markdownToUnicodeText } from "@/utils/contentConverter";

interface LinkedInPostPreviewProps {
  content: string;
  authorName?: string;
  authorTitle?: string;
  authorCompany?: string;
  timeAgo?: string;
  likes?: number;
  comments?: number;
  reposts?: number;
}

export const LinkedInPostPreview = ({
  content,
  authorName = "Deepak Mandal",
  authorTitle = "Full Stack Developer | Helping you grow LinkedIn audience with AI",
  authorCompany = "",
  timeAgo = "12h",
  likes = 136,
  comments = 16,
  reposts = 6,
}: LinkedInPostPreviewProps) => {
  const [isMobile, setIsMobile] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl m-0! font-semibold text-gray-900">
          Post Preview
        </h3>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setIsMobile(true)}
            className={`p-2 rounded-md transition-colors ${
              isMobile
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
            title="Mobile View"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.666.804 4.33A1 1 0 0113 21H7a1 1 0 01-.707-1.704l.804-4.33L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={() => setIsMobile(false)}
            className={`p-2 rounded-md transition-colors ${
              !isMobile
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
            title="Desktop View"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* LinkedIn Post Card */}
      <div
        className={`bg-white border border-gray-200 rounded-lg shadow-sm ${
          isMobile ? "max-w-sm" : "max-w-lg"
        } mx-auto overflow-hidden`}
      >
        {/* Profile Header */}
        <div className="flex items-start p-4 pb-3">
          <div className="shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {authorName.charAt(0)}
              </span>
            </div>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <div className="flex items-center">
              <h4 className="text-sm m-0! leading-none font-semibold text-gray-900 truncate">
                {authorName}
              </h4>
              <span className="mx-1 text-gray-400">•</span>
              <span className="text-xs m-0! leading-none text-gray-500">
                {timeAgo}
              </span>
              <div className="ml-2 flex items-center">
                <svg
                  className="w-3 h-3 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <p className="text-[14px]! m-0! leading-none text-gray-600 mt-0.5">
              {authorTitle}
            </p>
            {authorCompany && (
              <p className="text-xs m-0! leading-none text-gray-500 mt-0.5">
                {authorCompany}
              </p>
            )}
          </div>
        </div>

        {/* Post Content */}
        <div className="px-4 pb-3">
          <div className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
            {content ? (
              <div className="space-y-2">
                {markdownToUnicodeText(content).split("\n").map((line, index) => {
                  // Check if line contains URLs
                  const urlRegex = /(https?:\/\/[^\s]+)/g;
                  const parts = line.split(urlRegex);

                  return (
                    <div key={index}>
                      {parts.map((part, partIndex) => {
                        if (urlRegex.test(part)) {
                          return (
                            <a
                              key={partIndex}
                              href={part}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                            >
                              {part}
                            </a>
                          );
                        }
                        return <span key={partIndex}>{part}</span>;
                      })}
                    </div>
                  );
                })}
              </div>
            ) : (
              "Your post content will appear here..."
            )}
          </div>
        </div>

        {/* Engagement Stats */}
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-1">
                <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center border border-white">
                  <span className="text-white text-xs">👤</span>
                </div>
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border border-white">
                  <span className="text-white text-xs">🌿</span>
                </div>
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border border-white">
                  <span className="text-white text-xs">❤️</span>
                </div>
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border border-white">
                  <span className="text-white text-xs">👍</span>
                </div>
              </div>
              <span className="font-medium text-gray-700">{likes}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-medium text-gray-700 hover:text-blue-600 cursor-pointer transition-colors">
                {comments} comments
              </span>
              <span className="font-medium text-gray-700 hover:text-blue-600 cursor-pointer transition-colors">
                {reposts} reposts
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-around py-2 border-t border-gray-100 bg-gray-50">
          <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Like</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Comment</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Repost</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
