import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// Models sometimes use LaTeX's \[...\] and \(...\) delimiters instead of
// Markdown's $$...$$ and $...$. Normalize both before parsing.
export function TutorAnswer({ answer }) {
  const markdown = (answer || "")
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => `\n\n$$${math}$$\n\n`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => `$${math}$`);

  return (
    <div className="tutor-answer">
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: "ignore" }]]}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
