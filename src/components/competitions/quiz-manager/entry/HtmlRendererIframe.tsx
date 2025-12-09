interface HtmlRendererIframeProps {
  htmlContent: string;
  className?: string;
}

export const HtmlRendererIframe: React.FC<HtmlRendererIframeProps> = ({
  htmlContent,
  className,
}) => {
  // Wrap the HTML content with basic styling for a clean, contained display.
  const styledContent = `
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            font-size: 0.875rem; /* Matches text-sm */
            line-height: 1.5;
            color: #1f2937; /* Default text color */
          }
          /* Reset common block/text elements to ensure question is legible */
          h1, h2, h3, h4, p, ul, ol, li, pre, code { margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;

  // Encode to a Data URL
  const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(
    styledContent
  )}`;

  // Render the iframe
  return (
    <iframe
      src={dataUrl}
      className={`w-full border-0 overflow-hidden ${className}`}
      // Setting a minimal height; in a production app, you'd use a ref/onload to calculate content height
      style={{ height: "auto", minHeight: "100px" }}
      title="Question Content"
    />
  );
};
