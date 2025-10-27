"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { FullScreenTextEditor } from "@/components/editor/FullScreenTextEditor";
import { PostPreviewModal } from "@/components/modal/PostPreviewModal";
import { Post, Platform } from "@/lib/entity/Post";
import { markdownToUnicodeText } from "@/utils/contentConverter";
import { Container } from "@UI/Container";
import { Typography } from "@UI/Typography";

export const Dashboard = () => {
  const searchParams = useSearchParams();
  const [_post, setPost] = useState<Post | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPostPreviewModal, setShowPostPreviewModal] = useState(false);

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
          `/api/posts?postId=${postId}&platform=${platform}`
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

      // Convert Markdown content to Unicode
      const unicodeContent = markdownToUnicodeText(content);

      const response = await fetch(
        `/api/posts?postId=${postId}&platform=${platform}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: content, // Send markdown content to API
            scheduledAt: now,
          }),
        }
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
          content: unicodeContent,
          scheduledAt: now,
          action: "post_now",
        }),
      });

      alert("Post published successfully!");
      setShowPostPreviewModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to publish post");
    } finally {
      setSaving(false);
    }
  };

  const handlePostAndPreview = () => {
    setShowPostPreviewModal(true);
  };

  const handleSchedule = async (scheduledAt: Date) => {
    if (!postId || !platform) return;

    setSaving(true);
    setShowPostPreviewModal(false);

    try {
      // Convert Markdown content to Unicode
      const unicodeContent = markdownToUnicodeText(content);

      const response = await fetch(
        `/api/posts?postId=${postId}&platform=${platform}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: content, // Send markdown content to API
            scheduledAt: scheduledAt.toISOString(),
          }),
        }
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
          content: unicodeContent,
          scheduledAt: scheduledAt.toISOString(),
          action: "schedule",
        }),
      });

      alert(`Post scheduled for ${scheduledAt.toLocaleString()}!`);
      setShowPostPreviewModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to schedule post");
    } finally {
      setSaving(false);
    }
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
    <>
      <FullScreenTextEditor
        value={content}
        onChange={setContent}
        onPostAndPreview={handlePostAndPreview}
        postId={postId}
        platform={platform}
      />

      <PostPreviewModal
        isOpen={showPostPreviewModal}
        onClose={() => setShowPostPreviewModal(false)}
        content={content}
        onPostNow={handlePostNow}
        onSchedule={(scheduledAt) => handleSchedule(scheduledAt)}
        saving={saving}
        postId={postId}
        platform={platform}
      />
    </>
  );
};
