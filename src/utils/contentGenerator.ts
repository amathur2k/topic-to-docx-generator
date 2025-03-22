import { Anthropic } from '@anthropic-ai/sdk';

// Import the writing style prompt
import writingStylePrompt from '../assets/writing-style-prompt.txt?raw';

export const generateContent2 = async (
  topic: string, 
  instructions: string
): Promise<string> => {

  return "Hello World 2 Blah Blah<br>Line 1<br>Line 2<br>Line 3";
}

export const generateContent = async (
  topic: string, 
  instructions: string
): Promise<string> => {
  try {
    console.log("Generating content for:", topic);
    console.log("With instructions:", instructions);
    
    const xxx = await readWritingStylePrompt();
    
    // Initialize the multi-agent system
    const MAX_ITERATIONS = 3;
    let currentIteration = 0;
    let contentPlan = "";
    let contentDraft = "";
    let evaluation = "";
    let isSatisfied = false;
    let finalContent = "";
    
    // Get the creation plan from the Planner
    console.log("🤖 Planner: Creating initial content plan...");
    contentPlan = await callLLM2(`
      You are a Content Planning Agent. Your job is to create a detailed plan for writing content on "${topic}".
      
      Writing Style Guide: ${xxx}
      
      Additional instructions: ${instructions}
      
      Create a structured plan that includes:
      1. The main sections or chapters
      2. Key points to cover in each section
      3. Suggested approach for the content
      4. Estimated length and detail level for each section
      
      Return only the plan in a clear, structured format.
    `);
    
    // Main loop - continue until satisfied or max iterations reached
    while (!isSatisfied && currentIteration < MAX_ITERATIONS) {
      currentIteration++;
      console.log(`🔄 Iteration ${currentIteration} of ${MAX_ITERATIONS}`);
      
      // Writer creates content based on the plan
      console.log("✍️ Writer: Generating content based on plan...");
      contentDraft = await callLLM2(`
        You are a Content Writer Agent. Your job is to write high-quality content based on a provided plan.
        
        Topic: "${topic}"
        Writing Style Guide: ${xxx}
        Additional Instructions: ${instructions}
        
        Content Plan:
        ${contentPlan}
        
        ${currentIteration > 1 ? `Previous Evaluation: ${evaluation}` : ''}
        
        Please write the content following the plan and style guide. Format your content with proper HTML tags:
        - Use <h1> for the main title
        - Use <h2> for section headers
        - Use <h3> for subsection headers
        - Use <p> for paragraphs
        - Use <ul> and <li> for unordered lists
        - Use <ol> and <li> for ordered lists
        - Use <strong> for bold text
        - Use <em> for italicized text
        
        Focus on maintaining the specified writing style while delivering informative and engaging content.
      `);
      
      // Evaluator assesses the content
      console.log("🔍 Evaluator: Reviewing content...");
      evaluation = await callLLM2(`
        You are a Content Evaluation Agent. Your only job is to  evaluate if content is on the lines of the style guide and Additional Instructions.
        
        Topic: "${topic}"
        Writing Style Guide: ${xxx}
        Additional Instructions: ${instructions}
        
        
        Content to Evaluate:
        ${contentDraft}
        
        Please evaluate this content on:
        1. Adherence to the writing style guide
        2. If the Additional Instructions are followed
        
        Provide specific feedback for improvement. End your evaluation with one of these statements:
        - "SATISFIED: The content meets all requirements." 
        - "NEEDS REVISION: The content requires the following improvements: [list specific improvements]"
      `);
      
      // Check if the evaluator is satisfied
      isSatisfied = evaluation.includes("SATISFIED");
      
      if (isSatisfied) {
        console.log("✅ Evaluator: Content is satisfactory!");
        finalContent = contentDraft;
      } else if (currentIteration < MAX_ITERATIONS) {
        console.log("⚠️ Evaluator: Content needs revision. Planning next iteration...");
        
        // Planner coordinates the revision
        contentPlan = await callLLM2(`
          You are a Content Planning Agent. Your job is to revise the content plan based on evaluation feedback.
          
          Topic: "${topic}"
          Writing Style Guide: ${xxx}
          Additional Instructions: ${instructions}
          
          Original Plan:
          ${contentPlan}
          
          Current Content:
          ${contentDraft}
          
          Evaluation Feedback:
          ${evaluation}
          
          Please revise the content plan to address the feedback. Create a structured plan that will help the Writer agent improve the content in the next iteration.
          Focus on maintaining the specified writing style while addressing the issues raised by the Evaluator.
        `);
      }
    }
    
    // If we reached max iterations without satisfaction, use the last draft
    if (!isSatisfied) {
      console.log("⚠️ Reached maximum iterations without full satisfaction. Using best version.");
      finalContent = contentDraft;
    }
    
    // Format and return the final content
    return ensureHtmlFormat(finalContent, topic);
  } catch (error) {
    console.error("Error generating content:", error);
    return `
      <h1>Content Generation Error</h1>
      <p>There was an error generating content for the topic "${topic}". Please try again or modify your request.</p>
      <p>Error details: ${error instanceof Error ? error.message : 'Unknown error'}</p>
    `;
  }
};

/**
 * Helper function to ensure the content is properly formatted as HTML
 * This handles cases where the model might not properly format the response
 */
const ensureHtmlFormat = (content: string, topic: string): string => {
  // If content already has HTML tags, return it as is
  if (content.includes("<h1>") || content.includes("<p>")) {
    return content;
  }
  
  // Simple conversion if the content doesn't have HTML formatting
  // In a real application, you might want a more sophisticated markdown-to-html converter
  const lines = content.split("\n");
  let htmlContent = "";
  let inList = false;
  
  for (let line of lines) {
    line = line.trim();
    if (!line) {
      htmlContent += "<br>";
      continue;
    }
    
    // Handle headers
    if (line.startsWith("# ")) {
      htmlContent += `<h1>${line.substring(2)}</h1>`;
    } else if (line.startsWith("## ")) {
      htmlContent += `<h2>${line.substring(3)}</h2>`;
    } else if (line.startsWith("### ")) {
      htmlContent += `<h3>${line.substring(4)}</h3>`;
    } 
    // Handle list items
    else if (line.startsWith("- ") || line.startsWith("* ")) {
      if (!inList) {
        htmlContent += "<ul>";
        inList = true;
      }
      htmlContent += `<li>${line.substring(2)}</li>`;
    } 
    // Handle numbered lists
    else if (/^\d+\.\s/.test(line)) {
      if (!inList) {
        htmlContent += "<ol>";
        inList = true;
      }
      htmlContent += `<li>${line.substring(line.indexOf(".") + 2)}</li>`;
    } 
    // Close lists if needed
    else {
      if (inList) {
        htmlContent += line.startsWith("- ") || line.startsWith("* ") ? "</ul>" : "</ol>";
        inList = false;
      }
      htmlContent += `<p>${line}</p>`;
    }
  }
  
  // Close any open lists
  if (inList) {
    htmlContent += inList ? (lines[lines.length - 1]?.startsWith("- ") || lines[lines.length - 1]?.startsWith("* ") ? "</ul>" : "</ol>") : "";
  }
  
  // If no h1 was found, add one with the topic
  if (!htmlContent.includes("<h1>")) {
    htmlContent = `<h1>${topic}</h1>${htmlContent}`;
  }
  
  return htmlContent;
};

/**
 * Reads the writing style prompt from file
 */
export async function readWritingStylePrompt(): Promise<string> {
  try {
    return writingStylePrompt;
  } catch (error) {
    console.error("Error loading writing style prompt:", error);
    return "Default writing style: Write in a clear, concise, and engaging manner.";
  }
}

export async function callLLM(prompt: string): Promise<string> {
  // DeepSeek API endpoint
  const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
  
  // Get API key from environment variable or configuration
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    console.error("DeepSeek API key not found. Make sure to set the VITE_DEEPSEEK_API_KEY environment variable.");
    throw new Error("DeepSeek API key not configured");
  }
  
  // Make the API request to DeepSeek
  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "deepseek-chat", // Replace with the correct model ID for DeepSeek Reasoner
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 1,
      max_tokens: 12000
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error("DeepSeek API error:", errorData);
    throw new Error(`DeepSeek API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Extract and return the generated content
  return data.choices[0].message.content;
}

/**
 * Makes a call to the Anthropic Claude 3.5 Haiku API using the official SDK
 * @param prompt The prompt to send to the model
 * @returns The generated content from the model
 */
export async function callLLM2(prompt: string): Promise<string> {
  // Get API key from environment variable
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    console.error("Anthropic API key not found. Make sure to set the VITE_ANTHROPIC_API_KEY environment variable.");
    throw new Error("Anthropic API key not configured");
  }
  
  try {
    // Initialize the Anthropic client
    const anthropic = new Anthropic({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
    
    // Create a message using the client
    const message = await anthropic.messages.create({
      model: "claude-3-5-haiku-latest",
      temperature:1,
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });
    
    // Return the generated content
    const content = message.content[0];
    if ('text' in content) {
      return content.text;
    }
    throw new Error('Unexpected response format from Anthropic API');
  } catch (error) {
    console.error("Error calling Anthropic Claude API:", error);
    throw new Error(`Failed to generate content with Anthropic Claude: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}