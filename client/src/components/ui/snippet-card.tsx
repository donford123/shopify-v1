import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CodeBlock } from "./code-block";
import { PreviewPanel } from "./preview-panel";
import { useMobile } from "@/hooks/use-mobile";
import { Snippet } from "@shared/schema";

interface SnippetCardProps {
  snippet: Snippet;
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  const [showPreview, setShowPreview] = useState(true);
  const isMobile = useMobile();

  return (
    <Card className="bg-white border border-[#e5e5e5] rounded-lg mb-6 shadow-sm">
      <CardHeader className="border-b border-[#e5e5e5] p-4">
        <h2 className="text-lg font-medium">{snippet.title}</h2>
        <p className="text-sm text-gray-600 mt-1">{snippet.description}</p>
      </CardHeader>
      
      {isMobile && (
        <div className="border-b border-[#e5e5e5] p-2 flex">
          <button
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              !showPreview ? "bg-[#eae9e5]" : "text-gray-600"
            }`}
            onClick={() => setShowPreview(false)}
          >
            Code
          </button>
          <button
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              showPreview ? "bg-[#eae9e5]" : "text-gray-600"
            }`}
            onClick={() => setShowPreview(true)}
          >
            Preview
          </button>
        </div>
      )}
      
      <CardContent className="p-0 overflow-hidden">
        <div className={`${isMobile ? "" : "flex"} overflow-hidden`}>
          <div 
            className={`
              ${isMobile && !showPreview ? "block" : isMobile && showPreview ? "hidden" : "flex-1"} 
              border-r border-[#e5e5e5] overflow-auto notion-scrollbar
            `} 
            style={{ maxHeight: isMobile ? "300px" : "400px" }}
          >
            <CodeBlock code={snippet.code} language={snippet.language} />
          </div>
          
          <div 
            className={`
              ${isMobile && showPreview ? "block" : isMobile && !showPreview ? "hidden" : "flex-1"} 
              p-4 bg-gray-50 overflow-auto notion-scrollbar
            `} 
            style={{ maxHeight: isMobile ? "300px" : "400px" }}
          >
            <PreviewPanel content={snippet.previewContent as any} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
