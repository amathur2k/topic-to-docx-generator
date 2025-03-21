/**
 * Generates content using DeepSeek Reasoner model based on topic and instructions
 */
export const generateContent = async (
  topic: string, 
  instructions: string
): Promise<string> => {
  try {
    console.log("Generating content for:", topic);
    console.log("With instructions:", instructions);
    
    // DeepSeek API endpoint
    const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
    
    // Get API key from environment variable or configuration
    // In production, this should be stored securely
    //
    // const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    const apiKey = "sk-5b94826f47d14ee984c3252cdd35eb9a";

    const xxx = await readWritingStylePrompt();

    if (!apiKey) {
      console.error("DeepSeek API key not found. Make sure to set the VITE_DEEPSEEK_API_KEY environment variable.");
      throw new Error("DeepSeek API key not configured");
    }
    
    // Construct prompt for the DeepSeek Reasoner model
    const prompt = `
      Write an article  (with autobiographical elements)  based on the writing style prompt : ${xxx} . 
      The topic for the article would be ${topic}.
      Generate detailed, well-structured content about the following topic:
      
      Topic: ${topic}
      
      Additional Instructions: ${instructions}

      
      
      Please format the content using HTML tags with proper structure including:
      - Use <h1> for the main title
      - Use <h2> for section headers
      - Use <h3> for subsection headers
      - Use <p> for paragraphs
      - Use <ul> and <li> for unordered lists
      - Use <ol> and <li> for ordered lists
      - Use <strong> for bold text
      - Use <em> for italicized text
      
      Make the content informative, accurate, and professional.
    `;
    
    // Make the API request to DeepSeek
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-reasoner", // Replace with the correct model ID for DeepSeek Reasoner
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("DeepSeek API error:", errorData);
      throw new Error(`DeepSeek API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract and return the generated content
    const generatedContent = data.choices[0].message.content;
    
    // Ensure the content is properly formatted as HTML
    // If the model returns markdown or plain text, additional formatting might be needed here
    return ensureHtmlFormat(generatedContent, topic);
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
const readWritingStylePrompt = async (): Promise<string> => {
  try {
    const fs = await import('fs/promises');
    return await fs.readFile('C:\\Users\\ADMIN\\OneDrive\\upwork\\benlucas\\ben_lucas_final_writing_style_prompt.txt', 'utf-8');
  } catch (error) {
    console.error("Error loading writing style prompt:", error);
    return "Default writing style: Write in a clear, concise, and engaging manner.";
  }
};
