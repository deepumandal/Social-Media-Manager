"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { LogoutConfirmButton } from "@/components/auth/LogoutConfirmButton";
import { UnicodeTextEditor } from "@/components/editor/UnicodeTextEditor";
import { ScheduleModal } from "@/components/modal/ScheduleModal";
import { LinkedInPostPreview } from "@/components/preview/LinkedInPostPreview";
import { Post, Platform } from "@/lib/entity/Post";
import { Container } from "@UI/Container";
import { Flex } from "@UI/Flex";
import { Typography } from "@UI/Typography";

export const Dashboard = () => {
  const searchParams = useSearchParams();
  const [_post, setPost] = useState<Post | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const postId = searchParams.get("postId");
  const platform = searchParams.get("platform") as Platform;

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId || !platform) {
        setError("Missing postId or platform parameter");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/posts?postId=${postId}&platform=${platform}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const postData = await response.json();
        setPost(postData);
        setContent(postData.content || "");
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch post");
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, platform]);

  const handlePostNow = async () => {
    if (!postId || !platform) return;

    setSaving(true);
    try {
      const now = new Date().toISOString();

      const response = await fetch(
        `/api/posts?postId=${postId}&platform=${platform}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
            scheduledAt: now,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      // Trigger n8n automation webhook for immediate posting
      await fetch("/api/webhooks/schedule-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          platform,
          content,
          scheduledAt: now,
          action: "post_now",
        }),
      });

      alert("Post published successfully!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to publish post");
    } finally {
      setSaving(false);
    }
  };

  const handleSchedule = async (scheduledAt: Date) => {
    if (!postId || !platform) return;

    setSaving(true);
    setShowScheduleModal(false);

    try {
      const response = await fetch(
        `/api/posts?postId=${postId}&platform=${platform}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
            scheduledAt: scheduledAt.toISOString(),
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      // Trigger n8n automation webhook for scheduled posting
      await fetch("/api/webhooks/schedule-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          platform,
          content,
          scheduledAt: scheduledAt.toISOString(),
          action: "schedule",
        }),
      });

      alert(`Post scheduled for ${scheduledAt.toLocaleString()}!`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to schedule post");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(content);
    alert("Text copied to clipboard!");
  };

  if (loading) {
    return (
      <Container ScreenType="full-screen" className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <Typography className="text-gray-600">Loading post...</Typography>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container ScreenType="full-screen" className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <Typography className="text-red-800 text-center">
              Error: {error}
            </Typography>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container
      ScreenType="full-screen"
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <Flex justifyContent="space-between" alignItems="center">
            <Typography
              asElement="h1"
              className="text-3xl font-bold text-gray-900 my-0"
            >
              Social Media Manager
            </Typography>
            <LogoutConfirmButton />
          </Flex>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Editor */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <Typography
                  asElement="h2"
                  className="text-xl m-0! font-semibold text-gray-900"
                >
                  Edit Post Content
                </Typography>
                <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  <span className="font-medium">ID:</span>
                  <span className="font-mono">{postId}</span>
                  <span>•</span>
                  <span className="capitalize font-medium">{platform}</span>
                </div>
              </div>

              <UnicodeTextEditor
                value={content}
                onChange={setContent}
                placeholder="Write your post content here..."
              />
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCopyText}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 hover:shadow-sm transition-all duration-200 border border-blue-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  <span className="font-medium">Copy text</span>
                </button>

                <button
                  onClick={() => setShowScheduleModal(true)}
                  disabled={saving}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Schedule</span>
                </button>

                <button
                  onClick={handlePostNow}
                  disabled={saving}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{saving ? "Posting..." : "Post now"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Preview */}
          <div>
            <LinkedInPostPreview content={content} />
          </div>
        </div>

        {/* Schedule Modal */}
        <ScheduleModal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          onSchedule={handleSchedule}
          loading={saving}
        />
      </div>
    </Container>
  );
};
