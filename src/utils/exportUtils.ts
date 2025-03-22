import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

/**
 * Exports content to a Word document (DOCX) file
 * @param title Document title
 * @param htmlContent HTML content to be converted to DOCX
 */
export const exportToDocx = async (
  title: string,
  htmlContent: string
): Promise<void> => {
  try {
    // Parse HTML content into a document structure
    const docxElements = parseHtmlToDocxElements(htmlContent);
    
    // Create DOCX document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: title,
            heading: HeadingLevel.TITLE,
            spacing: {
              after: 200,
            },
          }),
          ...docxElements,
        ],
      }],
    });
    
    // Generate DOCX buffer
    const buffer = await Packer.toBlob(doc);
    
    // Save document
    const fileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_document.docx`;
    saveAs(buffer, fileName);
    
    console.log("Document exported successfully");
  } catch (error) {
    console.error("Error exporting document:", error);
    throw new Error("Failed to export document");
  }
};

/**
 * Parses HTML content into DOCX elements
 */
const parseHtmlToDocxElements = (htmlContent: string): Paragraph[] => {
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;
  
  const paragraphs: Paragraph[] = [];
  
  // Process child nodes recursively
  for (const node of Array.from(tempDiv.childNodes)) {
    processDomNode(node, paragraphs);
  }
  
  return paragraphs;
};

/**
 * Processes a DOM node and converts it to DOCX elements
 */
const processDomNode = (node: Node, paragraphs: Paragraph[]): void => {
  if (node.nodeType === Node.TEXT_NODE) {
    // Text node
    const text = node.textContent?.trim();
    if (text) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun(text)],
        })
      );
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    // Element node
    const element = node as HTMLElement;
    const tagName = element.tagName.toLowerCase();
    
    if (tagName === "h1") {
      paragraphs.push(
        new Paragraph({
          text: element.textContent || "",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 120 },
        })
      );
    } else if (tagName === "h2") {
      paragraphs.push(
        new Paragraph({
          text: element.textContent || "",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 120 },
        })
      );
    } else if (tagName === "h3") {
      paragraphs.push(
        new Paragraph({
          text: element.textContent || "",
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 240, after: 120 },
        })
      );
    } else if (tagName === "p") {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun(element.textContent || "")],
          spacing: { before: 120, after: 120 },
        })
      );
    } else if (tagName === "ul" || tagName === "ol") {
      // Process list items
      for (const child of Array.from(element.children)) {
        if (child.tagName.toLowerCase() === "li") {
          paragraphs.push(
            new Paragraph({
              text: `• ${child.textContent || ""}`,
              spacing: { before: 80, after: 80 },
              indent: { left: 720 },
            })
          );
        }
      }
    } else {
      // Process children recursively
      for (const child of Array.from(element.childNodes)) {
        processDomNode(child, paragraphs);
      }
    }
  }
};
