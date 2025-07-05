"use client"

import ReactMarkdown from 'react-markdown'
import { cn } from "@/lib/utils"

interface MarkdownProps {
    content: string
    className?: string
}

export function Markdown({ content, className }: MarkdownProps) {
    return (
        <div className={cn("space-y-6", className)}>
            <ReactMarkdown
                components={{
                    h1: ({ children }) => <h1 className="scroll-m-20 text-xl font-bold tracking-tight">{children}</h1>,
                    h2: ({ children }) => <h2 className="scroll-m-20 text-lg font-semibold tracking-tight">{children}</h2>,
                    h3: ({ children }) => <h3 className="scroll-m-20 text-base font-semibold tracking-tight">{children}</h3>,
                    h4: ({ children }) => <h4 className="scroll-m-20 text-sm font-semibold tracking-tight">{children}</h4>,
                    p: ({ children }) => <p className="leading-7 text-muted-foreground [&:not(:first-child)]:mt-6">{children}</p>,
                    ul: ({ children }) => <ul className="my-6 ml-6 list-disc text-muted-foreground [&>li]:mt-2">{children}</ul>,
                    ol: ({ children }) => <ol className="my-6 ml-6 list-decimal text-muted-foreground [&>li]:mt-2">{children}</ol>,
                    li: ({ children }) => <li className="text-muted-foreground">{children}</li>,
                    blockquote: ({ children }) => (
                        <blockquote className="mt-6 border-l-2 border-primary pl-6 italic text-muted-foreground">
                            {children}
                        </blockquote>
                    ),
                    code: ({ children }) => (
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground">
                            {children}
                        </code>
                    ),
                    pre: ({ children }) => (
                        <pre className="mb-4 mt-6 overflow-x-auto rounded-lg border bg-muted p-4">
                            {children}
                        </pre>
                    ),
                    a: ({ href, children }) => (
                        <a href={href} className="font-medium text-primary underline-offset-4 hover:underline">
                            {children}
                        </a>
                    ),
                    hr: () => <hr className="my-4 border-border" />,
                    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
} 