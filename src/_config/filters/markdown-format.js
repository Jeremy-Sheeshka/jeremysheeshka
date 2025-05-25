import markdownParser from 'markdown-it';

const markdown = markdownParser();

export const markdownFormat = (string) => {
  if (!string || typeof string !== "string") {
    return ""; // or return string if you want to preserve non-string inputs
  }
  return markdown.render(string);
};
