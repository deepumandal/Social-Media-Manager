// === Helper Functions ===
function toUnicode(str, baseUpper, baseLower) {
return str.replace(/[A-Za-z]/g, c => {
const code = c.charCodeAt(0);
if (code >= 65 && code <= 90) return String.fromCodePoint(baseUpper + code - 65);
if (code >= 97 && code <= 122) return String.fromCodePoint(baseLower + code - 97);
return c;
});
}

function toBold(s) {
return toUnicode(s, 0x1D400, 0x1D41A);
}

function toItalic(s) {
return toUnicode(s, 0x1D434, 0x1D44E);
}

function toBoldItalic(s) {
return toUnicode(s, 0x1D468, 0x1D482);
}

function toMonospace(s) {
return toUnicode(s, 0x1D670, 0x1D68A);
}

function addCombining(str, mark) {
return str.split('').map(ch => ch + mark).join('');
}

// === Main Transformation ===
let text = $json["linkedin_post"] || ""; // or adjust key based on your JSON path

// Normalize newlines
text = text.replace(/\\n/g, '\n');

// Handle formatting
text = text
// Handle **_bold italic_**
.replace(/\*\*\*(._?)\*\*\*/g, (\_, p1) => toBoldItalic(p1))
// Handle **bold**
.replace(/\*\*(._?)\*\*/g, (_, p1) => toBold(p1))
// Handle *italic*
.replace(/\*(.\*?)\*/g, (_, p1) => toItalic(p1))
// Handle `inline code`
.replace(/`([^`]+)`/g, (_, p1) => toMonospace(p1))
// Handle underline
.replace(/\_\_([^_]+)\__/g, (_, p1) => addCombining(p1, '\u0332'))
// Handle strikethrough
.replace(/~~(.\*?)~~/g, (\_, p1) => addCombining(p1, '\u0336'));

// Clean up multiple newlines
text = text.replace(/\n{3,}/g, '\n\n');

// Return final output
return [{ post: text }];
