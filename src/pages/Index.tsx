
import React, { useState } from "react";
import ContentForm from "@/components/ContentForm";
import WordEditor from "@/components/WordEditor";
import LoadingIndicator from "@/components/LoadingIndicator";
import { generateContent, generateContent2, callLLM, readWritingStylePrompt } from "@/utils/contentGenerator";
import { toast } from "sonner";

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [topic, setTopic] = useState("");
  const [lastInstructions, setLastInstructions] = useState("");

  const handleGenerate = async (topicValue: string, instructions: string) => {
    try {
      setIsGenerating(true);
      setTopic(topicValue);
      setLastInstructions(instructions);
      
      // Generate content
      const content = await generateContent(topicValue, instructions);
      
      // Update state with generated content
      setGeneratedContent(content);
      toast.success("Content generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReapplyStyle = async (selectedText: string, fullContent: string) => {
    try {
      setIsGenerating(true);
      
      // Generate content focused on the selected text
      const modifiedContent = await modifyContent(selectedText, fullContent, topic, lastInstructions);
      
      // Update state with generated content
      setGeneratedContent(modifiedContent);
      toast.success("Style reapplied successfully!");
    } catch (error) {
      console.error("Style reapply error:", error);
      toast.error("Failed to reapply style. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to modify content based on selected text
  const modifyContent = async (
    selectedText: string,
    fullContent: string,
    topic: string,
    instructions: string
  ): Promise<string> => {
    const xxx = await readWritingStylePrompt();
    // For now, we'll use the same generateContent2 function with a modified instruction
    const prompt = `From the full content "${fullContent}", please rewrite the selected part "${selectedText}" to give extra emphasis on the writing style below. Do not change any of the other text. return the full content with the selected part improved. Writing style: ${xxx}`;
    return await callLLM(prompt);

    //return await generateContent2(topic, modifiedInstructions);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pb-16">
      {/* Header */}
      <header className="py-8 md:py-16 text-center">
        <div className="container px-4">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-3">
            Topic to DOCX Generator
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Generate customized content based on any topic and download it as a Word document.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4">
        <div className="space-y-12">
          {/* Content Form */}
          <div className={`page-transition ${generatedContent ? "opacity-40 hover:opacity-100 transition-opacity" : ""}`}>
            <ContentForm onGenerate={handleGenerate} isGenerating={isGenerating} />
          </div>

          {/* Loading State */}
          {isGenerating && (
            <LoadingIndicator />
          )}

          {/* Word Editor (only shown after content is generated) */}
          {!isGenerating && generatedContent && (
            <WordEditor 
              initialContent={generatedContent} 
              title={topic}
              onReapplyStyle={handleReapplyStyle}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-6 text-center text-sm text-muted-foreground">
        <p>Topic to DOCX Generator • Created with precision and care</p>
      </footer>
    </div>
  );
};

export default Index;
