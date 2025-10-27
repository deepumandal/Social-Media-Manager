import markdownToUnicodeConverter from "markdown-to-unicode";

/**
 * Converts Markdown content to Unicode for display
 */
export const markdownToUnicodeText = (markdown: string): string => {
  if (!markdown || markdown.trim() === "") return "";
  return markdownToUnicodeConverter(markdown);
};
