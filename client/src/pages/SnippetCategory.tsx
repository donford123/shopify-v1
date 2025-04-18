import { useParams } from "wouter";
import { useState, useMemo } from "react";
import { MainLayout } from "@/components/MainLayout";
import { TabBar } from "@/components/TabBar";
import { SnippetCard } from "@/components/ui/snippet-card";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Filter, Tag } from "lucide-react";
import { Link } from "@/components/ui/link";
import { ExternalLink } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Snippet } from "@shared/schema";

// Define sorting options
type SortOption = 'popularity' | 'newest' | 'oldest';

export default function SnippetCategory() {
  const { slug } = useParams();
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [filterType, setFilterType] = useState<'all' | 'free' | 'premium'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: category, isLoading: isCategoryLoading } = useQuery<{
    id: number;
    name: string;
    icon: string;
    slug: string;
  }>({
    queryKey: [`/api/categories/${slug}`],
  });

  const { data: snippets = [], isLoading: isSnippetsLoading } = useQuery<Snippet[]>({
    queryKey: [`/api/categories/${slug}/snippets`],
  });
  
  // Extract all unique tags from snippets
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    snippets.forEach((snippet: Snippet) => {
      if (snippet.tags) {
        snippet.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet);
  }, [snippets]);
  
  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  // Filter and sort snippets
  const filteredAndSortedSnippets = useMemo(() => {
    return [...snippets]
      .filter((snippet: Snippet) => {
        // Filter by premium/free
        if (filterType === 'free' && snippet.isPremium) return false;
        if (filterType === 'premium' && !snippet.isPremium) return false;
        
        // Filter by selected tags (if any are selected)
        if (selectedTags.length > 0) {
          return snippet.tags && snippet.tags.some(tag => selectedTags.includes(tag));
        }
        
        return true;
      })
      .sort((a: Snippet, b: Snippet) => {
        switch (sortBy) {
          case 'newest':
            return b.orderIndex - a.orderIndex;
          case 'oldest':
            return a.orderIndex - b.orderIndex;
          case 'popularity':
          default:
            return (b.popularity || 0) - (a.popularity || 0);
        }
      });
  }, [snippets, sortBy, filterType, selectedTags]);

  return (
    <MainLayout selectedCategory={category?.name}>
      <TabBar />
      <div className="flex-1 overflow-auto notion-scrollbar">
        <div className="p-6">
          {/* Loading state */}
          {(isCategoryLoading || isSnippetsLoading) && (
            <>
              <div className="h-12 bg-gray-200 rounded-md w-1/3 mb-2 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded-md w-2/3 mb-8 animate-pulse"></div>
              
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white border border-[#e5e5e5] rounded-lg shadow-sm">
                    <div className="border-b border-[#e5e5e5] p-4">
                      <div className="h-6 bg-gray-200 rounded-md w-1/4 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
                    </div>
                    <div className="h-64 bg-gray-100 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {/* Loaded content */}
          {!isCategoryLoading && !isSnippetsLoading && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">
                  {category?.name === "Product App Snippets" ? "Product Recommendation App" : category?.name}
                </h1>
                <p className="text-gray-600">
                  {category?.name === "Product App Snippets" && 
                    "Display personalized product recommendations based on shopping behavior. Installation requires adding the following snippets to your theme."}
                  {category?.name === "Payment App Snippets" && 
                    "Integrate secure payment methods with these snippets. Follow the installation steps for each code section."}
                  {category?.name === "Cart App Snippets" && 
                    "Enhance your cart functionality with these code snippets. Add them to your theme files as instructed."}
                  {category?.name === "UI App Snippets" && 
                    "Improve your store's user interface with these UI component snippets. Copy and paste them into your theme."}
                </p>
              </div>
              
              {/* Filter and sort controls */}
              <div className="bg-white border border-[#e5e5e5] rounded-lg p-4 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Filter & Sort:</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 items-center">
                    {/* Sort dropdown */}
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popularity">Most Used</SelectItem>
                        <SelectItem value="newest">New to Old</SelectItem>
                        <SelectItem value="oldest">Old to New</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {/* Filter buttons */}
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm"
                        variant={filterType === 'all' ? 'default' : 'outline'}
                        onClick={() => setFilterType('all')}
                        className="h-9"
                      >
                        All
                      </Button>
                      <Button 
                        size="sm"
                        variant={filterType === 'free' ? 'default' : 'outline'}
                        onClick={() => setFilterType('free')}
                        className="h-9"
                      >
                        Free
                      </Button>
                      <Button 
                        size="sm"
                        variant={filterType === 'premium' ? 'default' : 'outline'}
                        onClick={() => setFilterType('premium')}
                        className="h-9"
                      >
                        Premium
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Tags */}
                {allTags.length > 0 && (
                  <div className="mt-4 flex items-start gap-2">
                    <Tag className="h-4 w-4 text-gray-500 mt-1" />
                    <div className="flex flex-wrap gap-2">
                      {allTags.map(tag => (
                        <Badge 
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {filteredAndSortedSnippets.length === 0 ? (
                <div className="text-center p-10 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600 mb-2">No snippets match your current filters.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setFilterType('all');
                      setSelectedTags([]);
                      setSortBy('popularity');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                filteredAndSortedSnippets.map((snippet: Snippet) => (
                  <SnippetCard key={snippet.id} snippet={snippet} />
                ))
              )}

              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <h2 className="text-lg font-medium text-blue-800 mb-2">Next Steps</h2>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-blue-800">Copy and paste the code snippets</span>
                      <p className="text-sm text-blue-600">Add each snippet to the appropriate location in your theme files.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-blue-800">Replace YOUR_API_KEY with your actual API key</span>
                      <p className="text-sm text-blue-600">Find your API key in the app dashboard settings.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-blue-800">Customize the configuration options</span>
                      <p className="text-sm text-blue-600">Adjust the styling and behavior to match your store's design.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-blue-800">Test your implementation</span>
                      <p className="text-sm text-blue-600">Visit your product pages to verify the app is working correctly.</p>
                    </div>
                  </li>
                </ul>
                <div className="mt-4">
                  <Link href="#" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                    View Documentation
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
