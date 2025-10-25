# Unicode Text Editor

This component provides a rich text editor with unicode styling capabilities for social media posts.

## Features

- **Unicode Styling**: Convert text to unicode styled text that appears formatted on platforms like LinkedIn
- **Toolbar**: Bold, italic, underline, strikethrough, monospace formatting
- **Emoji Support**: Insert emojis and special characters
- **Real-time Preview**: See how your text will look on social media platforms

## Usage

```tsx
import { UnicodeTextEditor } from "@/components/editor/UnicodeTextEditor";

<UnicodeTextEditor
  value={content}
  onChange={setContent}
  placeholder="Write your post content here..."
/>;
```

## Unicode Styling

The editor converts regular text to unicode styled text:

- **Bold**: `hello` → `𝗵𝗲𝗹𝗹𝗼`
- **Italic**: `hello` → `ℎ𝑒𝑙𝑙𝑜`
- **Bold Italic**: `hello` → `𝒉𝒆𝒍𝒍𝒐`
- **Monospace**: `hello` → `𝚑𝚎𝚕𝚕𝚘`
- **Underline**: `hello` → `h̲e̲l̲l̲o̲`
- **Strikethrough**: `hello` → `h̶e̶l̶l̶o̶`

## API

### Props

- `value: string` - Current text content
- `onChange: (value: string) => void` - Callback when content changes
- `placeholder?: string` - Placeholder text

### Methods

- `applyStyling()` - Apply unicode styling to selected text
- `insertEmoji()` - Insert emoji at cursor position
