import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const {
      postId,
      platform,
      content,
      scheduledAt,
      action = "post_now",
    } = await request.json();

    if (!postId || !platform || !content) {
      return NextResponse.json(
        { error: "postId, platform, and content are required" },
        { status: 400 },
      );
    }

    // Here you would typically call your n8n webhook URL
    // For now, we'll just log the data and return success
    console.log("Triggering n8n automation with data:", {
      postId,
      platform,
      content,
      scheduledAt,
      action: action || "schedule",
    });

    // Example n8n webhook call (replace with your actual webhook URL)
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      try {
        // const url = `${n8nWebhookUrl}?postId=${postId}&platform=${platform}&scheduledAt=${scheduledAt}&action=${action}`;
        // console.log("Triggering n8n automation with url:", url);
        const response = await fetch(n8nWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId,
            platform,
            content,
            scheduledAt,
            action,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to trigger n8n automation");
        }
        const data = await response.json();
        console.log("n8n automation response:", data);
      } catch (error: unknown) {
        console.error("Error triggering n8n webhook:", error);
      }
    }

    const message =
      action === "post_now"
        ? "Post published successfully"
        : "Post scheduled successfully";

    return NextResponse.json({
      message,
      data: {
        postId,
        platform,
        content,
        scheduledAt,
        action: action || "schedule",
      },
    });
  } catch (error: unknown) {
    console.error("Error scheduling post:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
};
