import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { type SnippetCategory } from "@shared/schema";

interface SidebarItemProps {
  icon: string;
  label: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
}

function SidebarItem({ icon, label, href, isActive, onClick }: SidebarItemProps) {
  return (
    <Link href={href}>
      <a 
        className={cn(
          "flex items-center px-3 py-2 rounded-md text-sm font-medium",
          "transition-colors duration-200 ease-in-out",
          isActive 
            ? "bg-[#eae9e5] text-[#37352f]" 
            : "text-gray-700 hover:bg-[#eae9e5]"
        )}
        onClick={onClick}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 mr-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d={icon} 
          />
        </svg>
        {label}
      </a>
    </Link>
  );
}

interface SidebarProps {
  categories: SnippetCategory[];
  isLoading?: boolean;
  closeMobileSidebar?: () => void;
}

export function Sidebar({ categories, isLoading, closeMobileSidebar }: SidebarProps) {
  const [location] = useLocation();
  const isMobile = useMobile();

  return (
    <div className="flex flex-col w-64 border-r border-[#e5e5e5] bg-white h-full">
      <div className="p-4 border-b border-[#e5e5e5]">
        <div className="flex items-center">
          <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold">CodeSnap</h1>
        </div>
        <p className="text-xs text-gray-500 mt-1">Shopify App Snippets</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          <div className="text-sm text-gray-500 px-3 py-2">CATEGORIES</div>
          
          {isLoading ? (
            <div className="space-y-2 p-3">
              <div className="h-6 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 bg-gray-200 rounded animate-pulse" />
            </div>
          ) : (
            categories.map((category) => (
              <SidebarItem
                key={category.id}
                icon={category.icon}
                label={category.name}
                href={`/category/${category.slug}`}
                isActive={location === `/category/${category.slug}`}
                onClick={isMobile ? closeMobileSidebar : undefined}
              />
            ))
          )}
          
          <div className="border-t border-[#e5e5e5] my-2"></div>
          
          <div className="text-sm text-gray-500 px-3 py-2">RECENTLY VIEWED</div>
          
          <SidebarItem
            icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            label="Product Upsell App"
            href="#"
            onClick={isMobile ? closeMobileSidebar : undefined}
          />
          
          <SidebarItem
            icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            label="Reviews Widget"
            href="#"
            onClick={isMobile ? closeMobileSidebar : undefined}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
