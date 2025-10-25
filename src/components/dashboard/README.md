# Dashboard Component

The Dashboard component provides a complete interface for editing and previewing social media posts with unicode styling.

## Features

- **URL Parameter Parsing**: Extracts `postId` and `platform` from URL parameters
- **Post Fetching**: Automatically fetches post content from the API
- **Unicode Text Editor**: Rich text editor with unicode styling capabilities
- **LinkedIn Preview**: Real-time preview of how the post will look on LinkedIn
- **Save & Schedule**: Update post content and trigger n8n automation

## Usage

The dashboard is accessed via URL parameters:

```
/dashboard?postId=xxx12&platform=linkedin
```

## API Integration

### Fetching Posts

```typescript
GET /api/posts?postId=xxx12&platform=linkedin
```

### Updating Posts

```typescript
PUT /api/posts?postId=xxx12&platform=linkedin
Content-Type: application/json

{
  "content": "Updated post content with unicode styling",
  "scheduledAt": "2024-01-01T00:00:00.000Z"
}
```

### Triggering n8n Automation

```typescript
POST /api/webhooks/schedule-post
Content-Type: application/json

{
  "postId": "xxx12",
  "platform": "linkedin",
  "content": "Post content",
  "scheduledAt": "2024-01-01T00:00:00.000Z"
}
```

## Components

- **UnicodeTextEditor**: Text editor with unicode styling toolbar
- **LinkedInPostPreview**: LinkedIn-style post preview
- **Action Buttons**: Copy, Schedule, and Post Now buttons

## Workflow

1. User receives email with post link containing `postId` and `platform`
2. User clicks link and is redirected to dashboard
3. Dashboard fetches post content using API
4. User edits content with unicode styling
5. User clicks "Schedule" or "Post now" button
6. Dashboard updates post and triggers n8n automation
7. n8n automation schedules/posts the content to the platform

## Unicode Styling

The dashboard supports converting markdown-like syntax to unicode styled text:

- `**bold**` → 𝗯𝗼𝗹𝗱
- `*italic*` → 𝑖𝑡𝑎𝑙𝑖𝑐
- `***bold italic***` → 𝒃𝒐𝒍𝒅 𝒊𝒕𝒂𝒍𝒊𝒄
- `` `code` `` → 𝚌𝚘𝚍𝚎
- `__underline__` → u̲n̲d̲e̲r̲l̲i̲n̲e̲
- `~~strikethrough~~` → s̶t̶r̶i̶k̶e̶t̶h̶r̶o̶u̶g̶h̶
