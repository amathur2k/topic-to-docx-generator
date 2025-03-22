import React, { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { exportToDocx } from "@/utils/exportUtils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface WordEditorProps {
  initialContent: string;
  title: string;
  onReapplyStyle?: (selectedText: string, fullContent: string) => Promise<void>;
}

const WordEditor: React.FC<WordEditorProps> = ({ 
  initialContent, 
  title,
  onReapplyStyle 
}) => {
  const [content, setContent] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const quillRef = useRef<ReactQuill>(null);
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    setIsMounted(true);
    setContent(initialContent);
  }, [initialContent]);

  const handleExport = async () => {
    try {
      await exportToDocx(title, content);
      toast.success("Document exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export document. Please try again.");
    }
  };

  const handleSelectionChange = () => {
    if (!quillRef.current) return;
    
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection();
    
    if (range && range.length > 0) {
      const text = quill.getText(range.index, range.length);
      setSelectedText(text);
    } else {
      setSelectedText("");
    }
  };

  const handleReapplyStyle = async () => {
    if (!selectedText || !onReapplyStyle) return;
    
    try {
      toast.info("Reapplying style to selected text...");
      await onReapplyStyle(selectedText, content);
    } catch (error) {
      console.error("Style reapply error:", error);
      toast.error("Failed to reapply style. Please try again.");
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "align",
  ];

  if (!isMounted) {
    return null; // Return null on server-side
  }

  return (
    <div className="w-full max-w-none">
      <Card className="overflow-hidden glass-effect shadow-glass">
        <div className="p-3 border-b flex items-center justify-between bg-background/50">
          <h3 className="font-medium truncate">{title || "Untitled Document"}</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            className="button-effect"
          >
            Export as DOCX
          </Button>
        </div>
        <ContextMenu>
          <ContextMenuTrigger>
            <div className="p-0 bg-white">
              <ReactQuill
                ref={quillRef}
                value={content}
                onChange={setContent}
                onChangeSelection={handleSelectionChange}
                modules={modules}
                formats={formats}
                className="w-full min-h-[500px]"
                theme="snow"
              />
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem 
              disabled={!selectedText}
              onClick={handleReapplyStyle}
            >
              Reapply Style
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Card>
    </div>
  );
};

export default WordEditor;
