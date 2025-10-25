// Unicode styling utilities for social media posts
// These functions convert regular text to unicode styled text that appears formatted on platforms like LinkedIn

function toUnicode(str: string, baseUpper: number, baseLower: number): string {
  return str.replace(/[A-Za-z]/g, (c) => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90)
      return String.fromCodePoint(baseUpper + code - 65);
    if (code >= 97 && code <= 122)
      return String.fromCodePoint(baseLower + code - 97);
    return c;
  });
}

export function toBold(text: string): string {
  return toUnicode(text, 0x1d400, 0x1d41a);
}

export function toItalic(text: string): string {
  return toUnicode(text, 0x1d434, 0x1d44e);
}

export function toBoldItalic(text: string): string {
  return toUnicode(text, 0x1d468, 0x1d482);
}

export function toMonospace(text: string): string {
  return toUnicode(text, 0x1d670, 0x1d68a);
}

export function addCombining(str: string, mark: string): string {
  return str
    .split("")
    .map((ch) => ch + mark)
    .join("");
}

export function toUnderline(text: string): string {
  return addCombining(text, "\u0332");
}

export function toStrikethrough(text: string): string {
  return addCombining(text, "\u0336");
}

// Main transformation function that converts markdown-like syntax to unicode styled text
export function transformToUnicodeStyled(text: string): string {
  // Normalize newlines
  text = text.replace(/\\n/g, "\n");

  // Handle formatting
  text = text
    // Handle ***bold italic***
    .replace(/\*\*\*(.*?)\*\*\*/g, (_, p1) => toBoldItalic(p1))
    // Handle **bold**
    .replace(/\*\*(.*?)\*\*/g, (_, p1) => toBold(p1))
    // Handle *italic*
    .replace(/\*(.*?)\*/g, (_, p1) => toItalic(p1))
    // Handle `inline code`
    .replace(/`([^`]+)`/g, (_, p1) => toMonospace(p1))
    // Handle underline
    .replace(/__([^_]+)__/g, (_, p1) => toUnderline(p1))
    // Handle strikethrough
    .replace(/~~(.*?)~~/g, (_, p1) => toStrikethrough(p1));

  // Clean up multiple newlines
  text = text.replace(/\n{3,}/g, "\n\n");

  return text;
}

// Helper function to apply styling to selected text
export function applyStyling(
  text: string,
  selection: { start: number; end: number },
  style:
    | "bold"
    | "italic"
    | "boldItalic"
    | "underline"
    | "strikethrough"
    | "monospace"
): string {
  const before = text.substring(0, selection.start);
  const selected = text.substring(selection.start, selection.end);
  const after = text.substring(selection.end);

  let styledText: string;
  switch (style) {
    case "bold":
      styledText = toBold(selected);
      break;
    case "italic":
      styledText = toItalic(selected);
      break;
    case "boldItalic":
      styledText = toBoldItalic(selected);
      break;
    case "underline":
      styledText = toUnderline(selected);
      break;
    case "strikethrough":
      styledText = toStrikethrough(selected);
      break;
    case "monospace":
      styledText = toMonospace(selected);
      break;
    default:
      styledText = selected;
  }

  return before + styledText + after;
}
