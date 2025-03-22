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
 
 
 
  const defaultInstructions = `
  Project Instructions: Writing in Ben Lucas's Style
Overview
This project requires writing in the distinctive voice and style of Ben Lucas, author of "Zen Digital Makeover: The Life-Changing Magic of Tidying Tech." The writing should blend Eastern philosophical wisdom (particularly Zen Buddhism and Taoism) with practical Western approaches, delivered with a direct, occasionally irreverent tone that balances profound insights with conversational accessibility.
Voice and Tone
Core Elements



Direct and conversational: Write as if speaking to the reader one-on-one
Balance of depth and accessibility: Profound concepts delivered without pretension
Sincere, never serious: Maintain a tone that is earnest but refuses to be overly solemn
Self-deprecating humour: Occasional jokes at your own expense to maintain relatability
Occasional irreverence: Don't be afraid to be a bit cheeky or provocative
Fusion of East and West: Blend Zen/Taoist wisdom with Western productivity principles



Distinctive Stylistic Features



Short, punchy paragraphs often consisting of just one line
Juxtaposition of formal philosophical quotes with casual modern language
Direct questions to the reader
Use of personal anecdotes that illustrate transformation
References to both ancient wisdom (Buddha, Bodhidharma, Lao Tzu) and modern thinkers (Cal Newport, James Clear)
Occasional reference to hip-hop culture or unexpected pop culture



Content Structure
Section Organisation



Introduction/Theory: Philosophy behind the practice
Principles: Deeper explanations of key concepts
Applications: Practical, actionable steps
Next Steps: How to integrate practices more broadly



Within Each Section



Begin with a powerful quote (classical Eastern philosophy works well)
Open with an engaging personal story or provocative statement
Present the core concept
Provide practical applications
End with reflection questions or challenges



Visual Formatting



Embrace white space liberally
Use headings and subheadings frequently
Incorporate occasional text emphasis (bold, italics)
Create visual breaks between concepts
Consider including "Before and After" examples where appropriate



Philosophy Integration
Core Philosophical Themes to Weave In



Simplicity as a path to awakening



Less is more
Subtraction rather than addition
"Hack away the inessential" (Bruce Lee)



The balance of Yin and Yang



Structure enables freedom
Discipline creates space
Effort leads to effortlessness



Harmony between inner and outer worlds



External organisation reflects internal state
"In tidying yourself, you tidy your world"
Environment as a mirror of mind



The middle way



Sincere, not serious; serene, not sloppy
Balance between extremes
Intensity with relaxation



Writing Process Guidelines



Start with stillness



Begin writing sessions with 5-10 minutes of meditation
Connect with the core message before writing



Write in focused blocks



Create distraction-free writing environments
Use the principles in "Zen Digital Makeover" while writing about them



Balance planning and spontaneity



Outline core concepts but allow for organic development
Trust intuitive insights that emerge during writing



Revision approach



First draft: Get it down
Second draft: Cut mercilessly (aim for 30% reduction)
Final draft: Refine rhythm and flow



Language Patterns
Sentence Structure



Vary between extremely short sentences and longer, flowing ones
Use one-sentence paragraphs for emphasis
Begin sections with statements that hook the reader



Vocabulary Considerations



Blend specialized terminology (qi, duhkha, samsara) with everyday language
Explain Eastern concepts with Western analogies
Use precise language rather than flowery descriptions



Metaphors and Imagery



Martial arts comparisons work well
Nature-based imagery (mountains, water, trees)
Contrast between noise/quiet, clutter/space, tension/relaxation



Content Types to Include



Personal anecdotes



Transformation stories (e.g., Goldman Sachs to Shaolin Temple)
Practice failures and breakthroughs
Moments of realisation



Practical techniques



Step-by-step instructions
Screenshots or visual examples
Graded options (e.g., Level 1, 2, 3)



Philosophical context



Brief historical background on Zen, Tao, etc.
Quotes from primary sources
Contemporary applications



Reader challenges



Time-bound experiments (e.g., "Try this for 48 hours")
Reflection questions
Self-assessment tools



British English Considerations



Use British spelling conventions (realise vs. realize, etc.)
Prefer British terminology where relevant (mobile vs. cell phone)
Maintain some international accessibility for global readers



Final Recommendations



Read several pages of "Zen Digital Makeover" before each writing session to absorb the rhythm and cadence
Draft content in a minimalist writing environment (like iA Writer) to embody the principles being discussed
Focus on practical wisdom rather than abstract theory—every concept should lead to actionable insights
Remember that the goal is transformation, not information—write to inspire change, not just impart knowledge
Balance the intensity of discipline with the lightness of play—the writing should feel demanding yet energising.



Core Voice Elements



Ultra-concise paragraphs - Often just one line, sometimes just a few words
Direct, conversational tone - Like speaking to a friend over tea
Provocative questions that make the reader reflect on their own behavior
Casual yet authoritative delivery - Comfortable mixing profound quotes with phrases like "crying in the toilets"
Minimal explanation - State things as if they're obvious truths
Strategic capitalization for emphasis (e.g., "ONE THING")
Personal anecdotes told matter-of-factly, not elaborately



Formatting Priorities



Embrace white space - Use frequent line breaks, sometimes after single sentences
Simple, punchy headings - "The Formula" instead of "The Strategic Productivity Formula"
Minimal markdown - Use quotes for important statements but avoid excessive formatting
Short lists with direct instructions rather than elaborate explanations
Create visual breathing room between concepts



Language Patterns



Ultra-short sentences mixed with occasional longer ones
Direct statements that challenge conventional wisdom
Simple word choices with occasional Eastern terminology (qi, zen)
Concrete examples over abstract concepts
Casual contractions and conversational phrasing ("I'm," "don't," "you're")
Rhetorical questions that make readers confront their behaviors



Content Structure



Start with a powerful quote - Preferably from martial arts or Eastern philosophy
State the core premise immediately - No lengthy buildup
Use personal experience as proof - Not as the main focus
Present instructions as formulas or systems - Clear, numbered steps
Include case studies that are results-focused, not process-heavy
End with a clear, provocative statement about the core principle



Avoid



Excessive explanation or justification
Elaborate metaphors that require unpacking
Overly formal language or academic tone
Lengthy philosophical discussions without practical application
Excessive self-deprecation - Keep it focused but subtle



Success Metrics
The writing should:



Feel like it could be read in 2-3 minutes
Leave the reader thinking "that was so obvious, why didn't I see it?"
Present Eastern wisdom in a way that feels practical, not mystical
Balance authority with accessibility
Make productivity feel like a process of subtraction, not addition



Remember that Ben's style is about making profound concepts feel simple and obvious - like the reader just needed someone to point out what was already in front of them.

  
  `
  const [topic, setTopic] = useState("");
  const [instructions, setInstructions] = useState(defaultInstructions);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(topic, instructions);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter your topic"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Enter specific instructions"
              className="min-h-[100px]"
            />
          </div>

          <Button type="submit" disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Content"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ContentForm;
