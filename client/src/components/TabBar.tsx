import { useState } from "react";
import { Button } from "@/components/ui/button";

const tabs = [
  { id: "recommended", label: "Recommended" },
  { id: "theme", label: "Theme" },
  { id: "liquid", label: "Liquid" },
  { id: "javascript", label: "JavaScript" }
];

interface TabBarProps {
  onChange?: (tabId: string) => void;
}

export function TabBar({ onChange }: TabBarProps) {
  const [activeTab, setActiveTab] = useState("recommended");

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  return (
    <div className="border-b border-[#e5e5e5] bg-white">
      <div className="flex space-x-1 p-2">
        {tabs.map(tab => (
          <Button
            key={tab.id}
            variant="ghost"
            size="sm"
            onClick={() => handleTabChange(tab.id)}
            className={`px-3 py-1.5 text-sm rounded-md ${
              activeTab === tab.id 
                ? "bg-[#eae9e5] font-medium" 
                : "text-gray-600 hover:bg-[#eae9e5]"
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
