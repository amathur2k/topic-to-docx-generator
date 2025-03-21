
import { Document, Paragraph, TextRun, HeadingLevel, Packer } from "docx";
import { saveAs } from "file-saver";

/**
 * Exports rich text content to a DOCX file
 */
export const exportToDocx = async (title: string, htmlContent: string): Promise<void> => {
  // Create a simple conversion of HTML to DOCX elements
  // Note: This is a simplified version - a real implementation would have more robust HTML parsing
  const doc = new Document({
    title: title,
    sections: [], // Empty sections array that will be populated below
  });

  // Simple parsing of HTML - in a real app you would use a proper HTML to DOCX converter
  // This just provides a basic conversion for demonstration purposes
  const cleanedHtml = htmlContent.replace(/<[^>]*>/g, match => {
    if (match.includes("<h1")) return "##h1##";
    if (match.includes("<h2")) return "##h2##";
    if (match.includes("<h3")) return "##h3##";
    if (match.includes("<p")) return "##p##";
    if (match.includes("<li")) return "##li##";
    if (match.includes("<strong") || match.includes("<b")) return "##b##";
    if (match.includes("<em") || match.includes("<i")) return "##i##";
    if (match.includes("</")) return "##end##";
    return "";
  });

  // Split by our markers
  const parts = cleanedHtml.split("##");
  const paragraphs: Paragraph[] = [];
  
  let currentText = "";
  let isInBold = false;
  let isInItalic = false;
  let currentHeadingLevel: typeof HeadingLevel | undefined = undefined;
  let isList = false;

  // Process each part
  for (const part of parts) {
    if (part === "h1") {
      if (currentText) paragraphs.push(createParagraph(currentText, currentHeadingLevel, isInBold, isInItalic));
      currentText = "";
      currentHeadingLevel = HeadingLevel.HEADING_1;
      isInBold = false;
      isInItalic = false;
    } else if (part === "h2") {
      if (currentText) paragraphs.push(createParagraph(currentText, currentHeadingLevel, isInBold, isInItalic));
      currentText = "";
      currentHeadingLevel = HeadingLevel.HEADING_2;
      isInBold = false;
      isInItalic = false;
    } else if (part === "h3") {
      if (currentText) paragraphs.push(createParagraph(currentText, currentHeadingLevel, isInBold, isInItalic));
      currentText = "";
      currentHeadingLevel = HeadingLevel.HEADING_3;
      isInBold = false;
      isInItalic = false;
    } else if (part === "p") {
      if (currentText) paragraphs.push(createParagraph(currentText, currentHeadingLevel, isInBold, isInItalic));
      currentText = "";
      currentHeadingLevel = undefined;
      isInBold = false;
      isInItalic = false;
    } else if (part === "li") {
      if (currentText) paragraphs.push(createParagraph(currentText, currentHeadingLevel, isInBold, isInItalic));
      currentText = "• ";
      currentHeadingLevel = undefined;
      isInBold = false;
      isInItalic = false;
      isList = true;
    } else if (part === "b") {
      isInBold = true;
    } else if (part === "i") {
      isInItalic = true;
    } else if (part === "end") {
      isInBold = false;
      isInItalic = false;
      if (isList) {
        paragraphs.push(createParagraph(currentText, currentHeadingLevel, isInBold, isInItalic));
        currentText = "";
        isList = false;
      }
    } else if (part) {
      currentText += part;
    }
  }

  // Add any remaining text
  if (currentText) {
    paragraphs.push(createParagraph(currentText, currentHeadingLevel, isInBold, isInItalic));
  }

  // Add section with paragraphs
  doc.addSection({
    children: paragraphs,
  });

  // Generate and save file
  const buffer = await Packer.toBuffer(doc);
  saveAs(new Blob([buffer]), `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "document"}.docx`);
};

function createParagraph(
  text: string, 
  headingLevel?: typeof HeadingLevel, 
  isBold: boolean = false,
  isItalic: boolean = false,
): Paragraph {
  const textRun = new TextRun({
    text: text.trim(),
    bold: isBold,
    italics: isItalic,
  });

  return new Paragraph({
    heading: headingLevel,
    children: [textRun],
  });
}
