import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { TopBar } from "@/components/TopBar";
import { useQuery } from "@tanstack/react-query";
import { useMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface MainLayoutProps {
  children: React.ReactNode;
  selectedCategory?: string;
}

export function MainLayout({ children, selectedCategory }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMobile();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["/api/categories"],
  });

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f7f6f3] text-[#37352f] font-sans">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar 
          categories={categories} 
          isLoading={isLoading} 
        />
      )}

      {/* Mobile Sidebar (Drawer) */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-full max-w-[250px]">
            <Sidebar 
              categories={categories} 
              isLoading={isLoading}
              closeMobileSidebar={() => setSidebarOpen(false)}
            />
          </SheetContent>
        </Sheet>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          openSidebar={() => setSidebarOpen(true)} 
          selectedCategory={selectedCategory}
        />
        {children}
      </div>
    </div>
  );
}
