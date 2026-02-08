"use client"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import remarkMath from "remark-math"
import rehypeRaw from "rehype-raw"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

interface MarkdownRendererProps {
  content: string
}

function CodeBlock({ children, className, ...props }: any) {
  const [copied, setCopied] = useState(false)

  // Extract language from className
  const match = /language-(\w+)/.exec(className || "")
  const language = match ? match[1] : ""

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(String(children).replace(/\n$/, ""))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  if (language) {
    return (
      <div className="relative group my-4">
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 p-1.5 bg-gray-800 dark:bg-gray-700 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 text-xs"
          aria-label="Copy code"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
        <pre className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm border">
          <code className={`language-${language} text-gray-800 dark:text-gray-200`}>
            {String(children).replace(/\n$/, "")}
          </code>
        </pre>
      </div>
    )
  }

  return (
    <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
      {children}
    </code>
  )
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-gray dark:prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        components={{
          code: CodeBlock,
          pre: ({ children }) => <div className="not-prose">{children}</div>,
          table: ({ children }) => (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700">
                  {children}
                </table>
              </div>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>,
          th: ({ children }) => (
            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 sm:px-6 py-4 text-sm text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700">
              {children}
            </td>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 py-2 rounded-r">
              {children}
            </blockquote>
          ),
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light mb-4 sm:mb-6 mt-6 sm:mt-8 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-light mb-3 sm:mb-4 mt-6 sm:mt-8 text-gray-900 dark:text-gray-100">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg sm:text-xl lg:text-2xl font-light mb-2 sm:mb-3 mt-4 sm:mt-6 text-gray-900 dark:text-gray-100">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base sm:text-lg font-light mb-2 mt-4 text-gray-900 dark:text-gray-100">{children}</h4>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300 text-sm sm:text-base">{children}</p>
          ),
          ul: ({ children }) => <ul className="mb-4 pl-4 sm:pl-6 space-y-1 text-sm sm:text-base">{children}</ul>,
          ol: ({ children }) => <ol className="mb-4 pl-4 sm:pl-6 space-y-1 text-sm sm:text-base">{children}</ol>,
          li: ({ children }) => <li className="text-gray-700 dark:text-gray-300 leading-relaxed">{children}</li>,
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-400 transition-colors underline underline-offset-2"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <div className="my-6 -mx-4 sm:mx-0">
              <img
                src={src || "/placeholder.svg"}
                alt={alt}
                className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
                loading="lazy"
              />
              {alt && <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 italic">{alt}</p>}
            </div>
          ),
          hr: () => <hr className="my-8 border-gray-200 dark:border-gray-700" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
