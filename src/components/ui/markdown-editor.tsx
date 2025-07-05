import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { cn } from '@/lib/utils'
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Quote,
    Code,
    CheckSquare,
} from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'

const lowlight = createLowlight(common)

type ToolType = 'h1' | 'h2' | 'bold' | 'italic' | 'bulletList' | 'orderedList' | 'taskList' | 'blockquote' | 'code'

interface ToolConfig {
    type: ToolType
    icon: React.ReactNode
    isActive: (editor: Editor) => boolean
    action: (editor: Editor) => void
}

const AVAILABLE_TOOLS: Record<ToolType, ToolConfig> = {
    h1: {
        type: 'h1',
        icon: <Heading1 className="h-4 w-4" />,
        isActive: (editor) => editor.isActive('heading', { level: 1 }),
        action: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    h2: {
        type: 'h2',
        icon: <Heading2 className="h-4 w-4" />,
        isActive: (editor) => editor.isActive('heading', { level: 2 }),
        action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    bold: {
        type: 'bold',
        icon: <Bold className="h-4 w-4" />,
        isActive: (editor) => editor.isActive('bold'),
        action: (editor) => editor.chain().focus().toggleBold().run(),
    },
    italic: {
        type: 'italic',
        icon: <Italic className="h-4 w-4" />,
        isActive: (editor) => editor.isActive('italic'),
        action: (editor) => editor.chain().focus().toggleItalic().run(),
    },
    bulletList: {
        type: 'bulletList',
        icon: <List className="h-4 w-4" />,
        isActive: (editor) => editor.isActive('bulletList'),
        action: (editor) => editor.chain().focus().toggleBulletList().run(),
    },
    orderedList: {
        type: 'orderedList',
        icon: <ListOrdered className="h-4 w-4" />,
        isActive: (editor) => editor.isActive('orderedList'),
        action: (editor) => editor.chain().focus().toggleOrderedList().run(),
    },
    taskList: {
        type: 'taskList',
        icon: <CheckSquare className="h-4 w-4" />,
        isActive: (editor) => editor.isActive('taskList'),
        action: (editor) => editor.chain().focus().toggleTaskList().run(),
    },
    blockquote: {
        type: 'blockquote',
        icon: <Quote className="h-4 w-4" />,
        isActive: (editor) => editor.isActive('blockquote'),
        action: (editor) => editor.chain().focus().toggleBlockquote().run(),
    },
    code: {
        type: 'code',
        icon: <Code className="h-4 w-4" />,
        isActive: (editor) => editor.isActive('code'),
        action: (editor) => editor.chain().focus().toggleCode().run(),
    },
}

interface MarkdownEditorProps {
    content?: string
    placeholder?: string
    onChange?: (content: string) => void
    className?: string
    readOnly?: boolean
    toolbar?: boolean
    tools?: ToolType[]
}

const DEFAULT_TOOLS: ToolType[] = ['h1', 'h2', 'bold', 'italic', 'bulletList', 'orderedList']

const MenuBar = ({ editor, tools = DEFAULT_TOOLS }: { editor: Editor | null, tools: ToolType[] }) => {
    if (!editor) return null

    return (
        <div className="flex flex-wrap gap-1 p-1 border-b">
            {tools.map((toolType) => {
                const tool = AVAILABLE_TOOLS[toolType]
                return (
                    <Toggle
                        key={tool.type}
                        size="sm"
                        pressed={tool.isActive(editor)}
                        onPressedChange={() => tool.action(editor)}
                    >
                        {tool.icon}
                    </Toggle>
                )
            })}
        </div>
    )
}

export function MarkdownEditor({
    content = '',
    placeholder = 'Start writing...',
    onChange,
    className,
    readOnly = false,
    toolbar = true,
    tools = DEFAULT_TOOLS,
}: MarkdownEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                codeBlock: false,
            }),
            Placeholder.configure({
                placeholder,
                emptyEditorClass: 'is-editor-empty',
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
        ],
        content,
        immediatelyRender: false,
        editable: !readOnly,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getText())
        },
    })

    return (
        <div className={cn(
            "rounded-md border bg-background",
            className
        )}>
            {!readOnly && toolbar && <MenuBar editor={editor} tools={tools} />}
            <EditorContent
                editor={editor}
                className={cn(
                    "prose prose-sm dark:prose-invert max-w-none",
                    "p-4 focus:outline-none min-h-[200px]",
                    "[&_.is-editor-empty]:before:text-muted-foreground [&_.is-editor-empty]:before:content-[attr(data-placeholder)] [&_.is-editor-empty]:before:float-left",
                    "[&_ul]:list-disc [&_ol]:list-decimal",
                    "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6",
                    "[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h2]:mt-5",
                    "[&_h3]:text-xl [&_h3]:font-medium [&_h3]:mb-2 [&_h3]:mt-4",
                    "[&_p]:mb-3 [&_p]:leading-relaxed",
                    "[&_blockquote]:border-l-4 [&_blockquote]:border-muted [&_blockquote]:pl-4 [&_blockquote]:italic",
                    "[&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-md",
                    "[&_p.is-editor-empty:first-child]:before:text-muted-foreground/60 [&_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] [&_p.is-editor-empty:first-child]:before:float-left [&_p.is-editor-empty:first-child]:before:pointer-events-none",
                )}
            />
        </div>
    )
} 