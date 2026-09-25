import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// Models sometimes use LaTeX's \[...\] and \(...\) delimiters instead of
// Markdown's $$...$$ and $...$. Normalize both before parsing.
export function TutorAnswer({ answer }) {
  const markdown = (answer || "")
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => `\n\n$$\n${math}\n$$\n\n`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => `$${math}$`)
    .replace(/(^|\n)\$\$([^\n]+?)\$\$(?=\n|$)/g, (_, prefix, math) => `${prefix}\n\n$$\n${math}\n$$\n\n`);

  return (
    <div className="tutor-answer">
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: "ignore" }]]}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
