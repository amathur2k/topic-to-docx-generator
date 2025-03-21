
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ContentFormProps {
  onGenerate: (topic: string, instructions: string) => void;
  isGenerating: boolean;
}

const ContentForm: React.FC<ContentFormProps> = ({ onGenerate, isGenerating }) => {
  const [topic, setTopic] = useState("");
  const [instructions, setInstructions] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && instructions.trim()) {
      onGenerate(topic, instructions);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden glass-effect">
      <div className="p-8">
        <div className="space-y-2 mb-6">
          <h2 className="text-3xl font-semibold tracking-tight text-center">Create Content</h2>
          <p className="text-muted-foreground text-center">
            Enter a topic and instructions to generate content.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-sm font-medium">
              Topic
            </Label>
            <Input
              id="topic"
              placeholder="E.g., Climate Change, Artificial Intelligence, Healthy Recipes..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              disabled={isGenerating}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions" className="text-sm font-medium">
              Instructions
            </Label>
            <Textarea
              id="instructions"
              placeholder="Provide detailed instructions about the content you want to generate..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="min-h-32 transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"
              disabled={isGenerating}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full button-effect"
            size="lg"
            disabled={isGenerating || !topic.trim() || !instructions.trim()}
          >
            {isGenerating ? "Generating..." : "Generate Content"}
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ContentForm;
