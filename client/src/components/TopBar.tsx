import { useMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Menu, Search, Share2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TopBarProps {
  openSidebar: () => void;
  selectedCategory?: string;
}

export function TopBar({ openSidebar, selectedCategory }: TopBarProps) {
  const isMobile = useMobile();

  return (
    <div className="flex items-center justify-between border-b border-[#e5e5e5] bg-white p-4">
      <div className="flex items-center">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 text-gray-500 hover:text-gray-700"
            onClick={openSidebar}
          >
            <Menu className="h-6 w-6" />
          </Button>
        )}
        <h1 className="text-lg font-semibold">{selectedCategory || "Shopify App Snippets"}</h1>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
          <Share2 className="h-5 w-5" />
        </Button>
        <div className="bg-gray-100 rounded-md flex items-center px-3 py-1.5">
          <Search className="h-4 w-4 text-gray-500 mr-2" />
          <input 
            type="text" 
            placeholder="Search snippets..." 
            className="bg-transparent outline-none text-sm w-40"
          />
        </div>
        <Avatar className="h-8 w-8 bg-blue-600 text-white">
          <AvatarFallback className="text-sm font-medium">JS</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
