import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CodeBlock } from "./code-block";
import { PreviewPanel } from "./preview-panel";
import { useMobile } from "@/hooks/use-mobile";
import { Snippet } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Tag, Crown } from "lucide-react";

interface SnippetCardProps {
  snippet: Snippet;
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  const [showPreview, setShowPreview] = useState(true);
  const isMobile = useMobile();

  return (
    <Card className="bg-white border border-[#e5e5e5] rounded-lg mb-6 shadow-sm">
      <CardHeader className="border-b border-[#e5e5e5] p-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-medium">{snippet.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{snippet.description}</p>
          </div>
          {snippet.isPremium && (
            <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 flex items-center gap-1">
              <Crown className="h-3 w-3" />
              <span>Premium</span>
            </Badge>
          )}
        </div>
        
        {snippet.tags && snippet.tags.length > 0 && (
          <div className="flex items-center gap-2 mt-3">
            <Tag className="h-3.5 w-3.5 text-gray-500" />
            <div className="flex flex-wrap gap-1.5">
              {snippet.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="px-1.5 py-0 text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
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
