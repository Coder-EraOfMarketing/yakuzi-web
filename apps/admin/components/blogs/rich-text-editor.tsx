"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import toast from "react-hot-toast";
import {
  Bold, Italic, Strikethrough, List, ListOrdered, Quote, Undo, Redo,
  Link as LinkIcon, Link2Off, Image as ImageIcon, Heading2, Heading3, Text, Eraser,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { cleanPastedHtml, needsCleanup } from "@/lib/paste-cleanup";

function ToolbarButton({ onClick, active, disabled, title, children }: {
  onClick: () => void; active?: boolean; disabled?: boolean; title: string; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none",
        active && "bg-primary/10 text-primary"
      )}
    >
      {children}
    </button>
  );
}

/** Tiptap editor that stores/emits plain HTML — matches how the buyer app renders
 * blog content (dangerouslySetInnerHTML), so no separate parser is needed. */
export function RichTextEditor({ value, onChange, onUploadImage }: {
  value: string;
  onChange: (html: string) => void;
  onUploadImage?: (file: File) => Promise<string>;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      // Tiptap's Link defaults to rel="noopener noreferrer nofollow" and
      // target="_blank" on EVERY link. That quietly nofollowed every link a
      // post ever made, including links to our own product pages and guides —
      // the internal linking a shop's blog exists to do, passing no signal at
      // all. Followed by default; setLink() below decides target and rel from
      // the destination, and the toolbar can mark a single link nofollow.
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { target: null, rel: "noopener noreferrer" },
      }),
      Image,
      Placeholder.configure({ placeholder: "Write your post…" }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[280px] px-4 py-3",
      },
      // Google Docs pastes blank paragraphs for every empty line and cuts
      // sentences where they wrapped; both survive into the saved content and
      // publish as the double-spaced wall authors report. See lib/paste-cleanup.
      transformPastedHTML: (html) => cleanPastedHtml(html),
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  /** A link to our own site is followed and stays in the tab; anything else
   *  opens in a new one and carries the usual safety rel. */
  const isInternal = (url: string) =>
    url.startsWith("/") || url.startsWith("#") || /^https?:\/\/(www\.)?yukizi\.com(\/|$)/i.test(url);

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous || "https://");
    if (url === null) return;
    if (url === "") { editor.chain().focus().extendMarkRange("link").unsetLink().run(); return; }
    const internal = isInternal(url.trim());
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: url.trim(),
        target: internal ? null : "_blank",
        rel: internal ? null : "noopener noreferrer",
      })
      .run();
  };

  /**
   * Alt text, asked for at insertion.
   *
   * Every in-body image shipped without any alt: setImage was only ever given
   * a src. That is the one accessibility and image-search field a blog post
   * has, and nothing in the editor could set it — not even after the fact.
   */
  const askAlt = (current?: string) =>
    window.prompt(
      "Describe this image for screen readers and image search (alt text)",
      current ?? "",
    );

  const setAltOnSelection = () => {
    const attrs = editor.getAttributes("image");
    const alt = askAlt(typeof attrs.alt === "string" ? attrs.alt : "");
    if (alt === null) return;
    editor.chain().focus().updateAttributes("image", { alt: alt.trim() }).run();
  };

  /**
   * The same repair, run over what is already in the editor — for everything
   * pasted before transformPastedHTML existed. Goes through the normal
   * update path, so one Ctrl+Z puts it back.
   */
  const cleanUpDocument = () => {
    const current = editor.getHTML();
    if (!needsCleanup(current)) {
      toast("Nothing to clean up — no blank lines or split sentences found.");
      return;
    }
    editor.chain().focus().setContent(cleanPastedHtml(current), true).run();
    toast.success("Removed blank lines and rejoined split sentences.");
  };

  const addImage = async () => {
    if (!onUploadImage) {
      const url = window.prompt("Image URL");
      if (!url) return;
      const alt = askAlt();
      editor.chain().focus().setImage({ src: url, alt: alt?.trim() || undefined }).run();
      return;
    }
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const url = await onUploadImage(file);
        const alt = askAlt();
        editor.chain().focus().setImage({ src: url, alt: alt?.trim() || undefined }).run();
      } catch {
        // Was window.alert(): a native modal blocks the editor and cannot be
        // styled, and this app has react-hot-toast mounted already.
        toast.error("Could not upload that image. Please try again.");
      }
    };
    input.click();
  };

  /**
   * nofollow, for the one case a shop's blog actually meets it: a paid,
   * sponsored or affiliate destination. Internal links and ordinary citations
   * should stay followed, so this is a toggle on the selected link rather
   * than anything applied by default.
   */
  const toggleNofollow = () => {
    const attrs = editor.getAttributes("link");
    const href = attrs.href as string | undefined;
    if (!href) return;
    const rel = typeof attrs.rel === "string" ? attrs.rel : "";
    const isNofollow = /\bnofollow\b/.test(rel);
    const nextRel = isNofollow
      ? rel.replace(/\bnofollow\b/g, "").replace(/\s+/g, " ").trim()
      : `${rel} nofollow`.trim();
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href, rel: nextRel || null, target: attrs.target ?? null })
      .run();
    toast.success(isNofollow ? "Link is followed again." : "Link marked nofollow.");
  };

  return (
    <div className="rounded-xl border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary/60 transition-all">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border/60 px-2 py-1.5">
        <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className="h-4 w-4" /></ToolbarButton>
        <span className="mx-1 h-5 w-px bg-border" />
        <ToolbarButton title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="h-4 w-4" /></ToolbarButton>
        <span className="mx-1 h-5 w-px bg-border" />
        <ToolbarButton title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="h-4 w-4" /></ToolbarButton>
        <span className="mx-1 h-5 w-px bg-border" />
        <ToolbarButton title="Link" active={editor.isActive("link")} onClick={setLink}><LinkIcon className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton
          title="Mark link nofollow (paid or sponsored destinations)"
          disabled={!editor.isActive("link")}
          active={/\bnofollow\b/.test(String(editor.getAttributes("link").rel ?? ""))}
          onClick={toggleNofollow}
        ><Link2Off className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Image" onClick={addImage}><ImageIcon className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton
          title="Alt text for the selected image"
          disabled={!editor.isActive("image")}
          onClick={setAltOnSelection}
        ><Text className="h-4 w-4" /></ToolbarButton>
        <span className="mx-1 h-5 w-px bg-border" />
        <ToolbarButton
          title="Clean up pasted text — remove blank lines and rejoin split sentences"
          onClick={cleanUpDocument}
        ><Eraser className="h-4 w-4" /></ToolbarButton>
        <span className="mx-1 h-5 w-px bg-border" />
        <ToolbarButton title="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><Undo className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><Redo className="h-4 w-4" /></ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
