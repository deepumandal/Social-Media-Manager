import { NextRequest, NextResponse } from "next/server";
import { Platform } from "@/lib/entity/Post";
import { PostService } from "@/lib/services/postService";
import { markdownToUnicodeText } from "@/utils/contentConverter";

const postService = new PostService();

export const GET = async (request: NextRequest) => {
  try {
    const postId = request.nextUrl.searchParams.get("postId");
    const platform = request.nextUrl.searchParams.get("platform");
    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }
    if (!platform) {
      return NextResponse.json(
        { error: "Platform is required" },
        { status: 400 }
      );
    }
    const post = await postService.getPostById(postId, platform as Platform);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};

export const PUT = async (request: NextRequest) => {
  try {
    const postId = request.nextUrl.searchParams.get("postId");
    const platform = request.nextUrl.searchParams.get("platform");

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }
    if (!platform) {
      return NextResponse.json(
        { error: "Platform is required" },
        { status: 400 }
      );
    }
    const postData = await request.json();
    if (!postData.content || !postData.scheduledAt) {
      return NextResponse.json(
        { error: "Content and scheduledAt are required" },
        { status: 400 }
      );
    }

    // Convert markdown content to unicode for storage
    const unicodeContent = markdownToUnicodeText(postData.content);

    const post = await postService.updatePost(postId, {
      content: postData.content, // Keep original markdown content
      unicodeContent: unicodeContent, // Store unicode version
      scheduledAt: postData.scheduledAt,
      platform: platform as unknown as Platform,
    });
    if (!post) {
      return NextResponse.json(
        { error: "Failed to update post" },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: "Post updated successfully" });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const postData = await request.json();

    if (!postData.content || !postData.platform || !postData.postId) {
      return NextResponse.json(
        { error: "Content, platform, and postId are required" },
        { status: 400 }
      );
    }

    // Convert markdown content to unicode for storage
    const unicodeContent = markdownToUnicodeText(postData.content);

    const post = await postService.createPost({
      ...postData,
      unicodeContent: unicodeContent, // Store unicode version
    });

    if (!post) {
      return NextResponse.json(
        { error: "Failed to create post" },
        { status: 500 }
      );
    }
    return NextResponse.json(post);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
