import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

// Define the different types of preview content
interface ScriptLoadedContent {
  type: "scriptLoaded";
  content: {
    status: string;
    message: string;
    console: Array<{ type: string; text: string }>;
    note: string;
  };
}

interface ProductGridContent {
  type: "productGrid";
  content: {
    title: string;
    products: Array<{ name: string; price: string }>;
  };
}

interface ConfigContent {
  type: "config";
  content: {
    accentColor: string;
    theme: string;
    placements: Array<{ name: string; enabled: boolean }>;
    validation: string;
  };
}

interface AnalyticsContent {
  type: "analytics";
  content: {
    conversionRate: string;
    metrics: Array<{ name: string; value: string; color: string }>;
    note: string;
  };
}

type PreviewContent = ScriptLoadedContent | ProductGridContent | ConfigContent | AnalyticsContent;

export function PreviewPanel({ content }: { content: PreviewContent }) {
  if (!content) {
    return (
      <div className="p-4 text-center text-gray-500">
        No preview available
      </div>
    );
  }

  return (
    <Card className="rounded-md border border-gray-200 bg-white">
      <CardContent className="p-4">
        <div className="text-sm font-medium text-gray-500 mb-3">
          {content.type === "scriptLoaded" && "Preview of Integration"}
          {content.type === "productGrid" && "Visual Preview"}
          {content.type === "config" && "Configuration Preview"}
          {content.type === "analytics" && "Analytics Dashboard Preview"}
        </div>

        {content.type === "scriptLoaded" && (
          <ScriptLoadedPreview content={content.content} />
        )}

        {content.type === "productGrid" && (
          <ProductGridPreview content={content.content} />
        )}

        {content.type === "config" && (
          <ConfigPreview content={content.content} />
        )}

        {content.type === "analytics" && (
          <AnalyticsPreview content={content.content} />
        )}
      </CardContent>
    </Card>
  );
}

function ScriptLoadedPreview({ content }: { content: ScriptLoadedContent["content"] }) {
  return (
    <>
      <div className="flex items-center mb-4">
        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
        <span className="text-sm">{content.message}</span>
      </div>
      <div className="text-xs bg-gray-100 p-2 rounded-md">
        {content.console.map((log, index) => (
          <div key={index}>
            <span className={log.type === "log" ? "text-purple-600" : "text-blue-600"}>
              {log.type === "log" ? "Console:" : "Info:"}
            </span>{" "}
            {log.text}
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-gray-500">{content.note}</div>
    </>
  );
}

function ProductGridPreview({ content }: { content: ProductGridContent["content"] }) {
  return (
    <>
      <h3 className="text-lg font-medium mb-3">{content.title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {content.products.map((product, index) => (
          <div key={index} className="border border-gray-200 rounded-md">
            <div className="bg-gray-100 h-24 rounded-t-md"></div>
            <div className="p-2">
              <div className="text-xs font-medium truncate">{product.name}</div>
              <div className="text-xs text-gray-500">{product.price}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function ConfigPreview({ content }: { content: ConfigContent["content"] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div 
          className="w-3 h-3 rounded-full mr-2" 
          style={{ backgroundColor: content.accentColor }}
        />
        <span className="text-xs">
          Accent Color: <code className="text-xs bg-gray-100 px-1 rounded">{content.accentColor}</code>
        </span>
      </div>
      
      <div className="border border-gray-200 rounded p-2">
        <div className="text-xs font-medium mb-1">Theme Preview ({content.theme})</div>
        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-white border border-gray-200 rounded"></div>
          <div className="w-8 h-8 bg-gray-50 border border-gray-200 rounded"></div>
          <div className="w-8 h-8 rounded" style={{ backgroundColor: content.accentColor }}></div>
          <div className="w-8 h-8 bg-gray-900 rounded"></div>
        </div>
      </div>
      
      <div className="text-xs">
        <div className="font-medium">Active Placements:</div>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          {content.placements.map((placement, index) => (
            <li key={index}>
              {placement.name} {placement.enabled ? "✓" : "✗"}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex items-center text-xs text-green-600">
        <CheckCircle className="h-4 w-4 mr-1" />
        {content.validation}
      </div>
    </div>
  );
}

function AnalyticsPreview({ content }: { content: AnalyticsContent["content"] }) {
  return (
    <>
      <div className="p-2 bg-blue-50 rounded-md mb-3">
        <div className="text-xs font-medium text-blue-700 mb-1">Recommendation Performance</div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-blue-600">Conversion Rate</span>
          <span className="text-xs font-medium">{content.conversionRate}</span>
        </div>
      </div>
      
      <div className="h-32 w-full bg-gray-100 rounded-md overflow-hidden flex">
        {content.metrics.map((metric, index) => {
          const widths = ["w-3/12", "w-5/12", "w-1/12", "w-3/12"];
          return (
            <div 
              key={index} 
              className={`bg-${metric.color}-500 h-full ${widths[index % widths.length]}`} 
              style={{ height: "100%" }}
            ></div>
          );
        })}
      </div>
      
      <div className="grid grid-cols-4 gap-2 mt-2 text-center">
        {content.metrics.map((metric, index) => (
          <div key={index} className="text-xs">
            <div className={`text-${metric.color}-500 font-medium`}>{metric.name}</div>
            <div>{metric.value}</div>
          </div>
        ))}
      </div>
      
      <div className="text-xs text-gray-500 mt-3">{content.note}</div>
    </>
  );
}
