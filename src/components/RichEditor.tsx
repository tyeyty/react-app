// src/components/RichEditor.tsx
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { CodeBlock } from "@tiptap/extension-code-block";
import { Heading } from "@tiptap/extension-heading";
import { useEffect } from "react";

interface RichEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const ToolbarButton = ({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`px-2 py-1 rounded text-sm transition-colors ${
      active
        ? "bg-[#2b2421] text-white"
        : "text-[#2b2421] hover:bg-[#e5dfd8]"
    }`}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-5 bg-[#ddd8d0] mx-1" />;

export default function RichEditor({ content, onChange }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false, heading: false }),
      TextStyle,
      Color,
      Heading.configure({ levels: [1, 2, 3] }),
      CodeBlock.configure({ HTMLAttributes: { class: "rich-code-block" } }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, []);

  if (!editor) return null;

  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  return (
    <div className="border border-[#ddd8d0] bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-[#ddd8d0] bg-[#f7f5f0]">
        
        {/* 폰트 크기 (Heading) */}
        <select
          onChange={(e) => {
            const val = e.target.value;
            if (val === "p") {
              editor.chain().focus().setParagraph().run();
            } else {
              editor
                .chain()
                .focus()
                .setHeading({ level: parseInt(val) as 1 | 2 | 3 })
                .run();
            }
          }}
          value={
            editor.isActive("heading", { level: 1 })
              ? "1"
              : editor.isActive("heading", { level: 2 })
              ? "2"
              : editor.isActive("heading", { level: 3 })
              ? "3"
              : "p"
          }
          className="text-sm border border-[#ddd8d0] rounded px-2 py-1 bg-white text-[#2b2421] focus:outline-none mr-1"
        >
          <option value="p">본문</option>
          <option value="1">제목 1</option>
          <option value="2">제목 2</option>
          <option value="3">제목 3</option>
        </select>

        <Divider />

        {/* Bold / Italic / Strike */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="굵게"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="기울임"
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="취소선"
        >
          <s>S</s>
        </ToolbarButton>

        <Divider />

        {/* 글자 색상 */}
        <label title="글자 색상" className="flex items-center gap-1 cursor-pointer">
          <span className="text-sm text-[#2b2421]">A</span>
          <input
            type="color"
            defaultValue="#2b2421"
            onChange={(e) =>
              editor.chain().focus().setColor(e.target.value).run()
            }
            className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent"
          />
        </label>

        <Divider />

        {/* 리스트 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="글머리 목록"
        >
          ≡
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="번호 목록"
        >
          1.
        </ToolbarButton>

        <Divider />

        {/* 인용 / 코드블럭 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="인용"
        >
          ❝
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="코드 블록"
        >
          {"</>"}
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="인라인 코드"
        >
          {"`c`"}
        </ToolbarButton>

        <Divider />

        {/* 표 */}
        <ToolbarButton onClick={insertTable} title="표 삽입">
          ⊞ 표
        </ToolbarButton>
        {editor.isActive("table") && (
          <>
            <ToolbarButton
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              title="열 추가"
            >
              +열
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().addRowAfter().run()}
              title="행 추가"
            >
              +행
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().deleteTable().run()}
              title="표 삭제"
            >
              🗑
            </ToolbarButton>
          </>
        )}

        <Divider />

        {/* 수평선 / 실행취소 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="수평선"
        >
          —
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="실행 취소"
        >
          ↩
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="다시 실행"
        >
          ↪
        </ToolbarButton>
      </div>

      {/* Editor body */}
      <EditorContent
        editor={editor}
        className="rich-editor-body min-h-[320px] px-5 py-4 text-[#2b2421] focus:outline-none"
      />

      {/* 에디터 스타일 */}
      <style>{`
        .rich-editor-body .ProseMirror {
          outline: none;
          min-height: 300px;
          line-height: 1.8;
          font-family: Georgia, serif;
          font-size: 15px;
        }
        .rich-editor-body .ProseMirror h1 { font-size: 2em; font-weight: 700; margin: 0.6em 0; }
        .rich-editor-body .ProseMirror h2 { font-size: 1.5em; font-weight: 600; margin: 0.6em 0; }
        .rich-editor-body .ProseMirror h3 { font-size: 1.2em; font-weight: 600; margin: 0.6em 0; }
        .rich-editor-body .ProseMirror p { margin: 0.4em 0; }
        .rich-editor-body .ProseMirror ul { list-style: disc; padding-left: 1.5em; }
        .rich-editor-body .ProseMirror ol { list-style: decimal; padding-left: 1.5em; }
        .rich-editor-body .ProseMirror blockquote {
          border-left: 3px solid #9b8e84;
          padding-left: 1em;
          color: #7a7065;
          margin: 0.8em 0;
          font-style: italic;
        }
        .rich-editor-body .ProseMirror code {
          background: #f0ebe3;
          border-radius: 3px;
          padding: 0.1em 0.4em;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
          color: #b85c38;
        }
        .rich-editor-body .ProseMirror pre.rich-code-block {
          background: #1e1e1e;
          color: #d4d4d4;
          padding: 1em 1.2em;
          border-radius: 4px;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
          font-size: 0.88em;
          margin: 0.8em 0;
        }
        .rich-editor-body .ProseMirror pre.rich-code-block code {
          background: none;
          color: inherit;
          padding: 0;
          font-size: inherit;
        }
        .rich-editor-body .ProseMirror table {
          border-collapse: collapse;
          width: 100%;
          margin: 0.8em 0;
        }
        .rich-editor-body .ProseMirror td,
        .rich-editor-body .ProseMirror th {
          border: 1px solid #ddd8d0;
          padding: 0.5em 0.75em;
          min-width: 60px;
          vertical-align: top;
        }
        .rich-editor-body .ProseMirror th {
          background: #f0ebe3;
          font-weight: 600;
        }
        .rich-editor-body .ProseMirror hr {
          border: none;
          border-top: 1px solid #ddd8d0;
          margin: 1.2em 0;
        }
        .rich-editor-body .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #b8b0a8;
          pointer-events: none;
          float: left;
          height: 0;
        }
      `}</style>
    </div>
  );
}