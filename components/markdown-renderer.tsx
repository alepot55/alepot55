"use client"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import remarkMath from "remark-math"
import rehypeRaw from "rehype-raw"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"
import { useState } from "react"

interface MarkdownRendererProps {
  content: string
}

/** running prose: sans, ink, one measure */
const PROSE = "text-body leading-relaxed text-ink sm:text-lead sm:leading-relaxed"

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
      <div className="relative my-6">
        <button
          type="button"
          onClick={copyToClipboard}
          className="absolute right-1 top-1 z-10 inline-flex h-11 min-w-[44px] items-center justify-center rounded-sm bg-surface px-3 font-mono text-meta text-ref transition-colors hover:text-ink"
          aria-label={copied ? "Code copied" : "Copy code"}
        >
          {copied ? "copied" : "copy"}
        </button>
        <pre className="overflow-x-auto rounded border border-rail bg-surface p-4 pr-16">
          <code className={`language-${language} font-mono text-[0.8125rem] leading-relaxed text-ink`}>
            {String(children).replace(/\n$/, "")}
          </code>
        </pre>
      </div>
    )
  }

  return (
    <code
      className="rounded-sm bg-ink/[0.06] px-1 py-0.5 font-mono text-[0.9em] text-ink"
      {...props}
    >
      {children}
    </code>
  )
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="max-w-none text-ink">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        components={{
          code: CodeBlock,
          pre: ({ children }) => <div className="not-prose">{children}</div>,
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto">
              <table className="min-w-full text-left">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="border-b border-rail">{children}</thead>,
          th: ({ children }) => (
            <th className="py-2 pr-6 text-left font-mono text-meta font-medium text-ref last:pr-0">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="py-2 pr-6 align-top text-body leading-relaxed text-ink last:pr-0">
              {children}
            </td>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-6 border-l border-ref pl-4 text-body not-italic leading-relaxed text-ref sm:text-lead sm:leading-relaxed">
              {children}
            </blockquote>
          ),
          h1: ({ children }) => (
            <h1 className="mb-3 mt-10 font-mono text-lead font-semibold leading-snug tracking-snug text-ink sm:mt-12 sm:text-row-title">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-3 mt-10 font-mono text-lead font-semibold leading-snug tracking-snug text-ink sm:mt-12">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-8 font-mono text-body font-semibold leading-snug text-ink">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mb-2 mt-6 font-mono text-body font-medium text-ref">{children}</h4>
          ),
          p: ({ children }) => <p className={`mb-4 ${PROSE}`}>{children}</p>,
          ul: ({ children }) => (
            <ul className={`mb-4 list-disc space-y-1 pl-5 marker:text-ref ${PROSE}`}>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className={`mb-4 list-decimal space-y-1 pl-5 marker:font-mono marker:text-ref ${PROSE}`}>
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed text-ink">{children}</li>,
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-ink underline decoration-rail underline-offset-4 transition-colors hover:decoration-limit"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <div className="my-6">
              <img
                src={src || "/placeholder.svg"}
                alt={alt}
                className="h-auto w-full rounded border border-rail"
                loading="lazy"
              />
              {alt && <p className="mt-2 font-mono text-meta text-ref">{alt}</p>}
            </div>
          ),
          hr: () => <hr className="my-10 border-rail" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
