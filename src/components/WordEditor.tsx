
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { exportToDocx } from "@/utils/exportUtils";

interface WordEditorProps {
  initialContent: string;
  title: string;
}

const WordEditor: React.FC<WordEditorProps> = ({ initialContent, title }) => {
  const [content, setContent] = useState("");
  const [isMounted, setIsMounted] = useState(false);

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
    <div className="w-full max-w-4xl mx-auto space-y-6 slide-up">
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
        <div className="p-0 bg-white">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            className="min-h-[500px] rounded-b-lg"
          />
        </div>
      </Card>
    </div>
  );
};

export default WordEditor;
