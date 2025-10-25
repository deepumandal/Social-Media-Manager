// Test file to demonstrate unicode styling functionality
import {
  toBold,
  toItalic,
  toBoldItalic,
  toUnderline,
  toStrikethrough,
  toMonospace,
  transformToUnicodeStyled,
} from "./unicodeStyling";

// Test basic unicode styling
console.log("=== Unicode Styling Tests ===");
console.log("Original: hello world");
console.log("Bold:", toBold("hello world"));
console.log("Italic:", toItalic("hello world"));
console.log("Bold Italic:", toBoldItalic("hello world"));
console.log("Monospace:", toMonospace("hello world"));
console.log("Underline:", toUnderline("hello world"));
console.log("Strikethrough:", toStrikethrough("hello world"));

// Test markdown-like transformation
console.log("\n=== Markdown-like Transformation ===");
const testText =
  "This is **bold** and *italic* and ***bold italic*** text. Also `code` and __underline__ and ~~strikethrough~~.";
console.log("Original:", testText);
console.log("Transformed:", transformToUnicodeStyled(testText));

// Test with emojis and special characters
console.log("\n=== Emoji and Special Characters ===");
const emojiText = "Hello 👋 world! This is **amazing** 🚀";
console.log("Original:", emojiText);
console.log("Transformed:", transformToUnicodeStyled(emojiText));

export {
  toBold,
  toItalic,
  toBoldItalic,
  toUnderline,
  toStrikethrough,
  toMonospace,
  transformToUnicodeStyled,
};
