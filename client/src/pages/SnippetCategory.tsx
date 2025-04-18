import { useParams } from "wouter";
import { MainLayout } from "@/components/MainLayout";
import { TabBar } from "@/components/TabBar";
import { SnippetCard } from "@/components/ui/snippet-card";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle } from "lucide-react";
import { Link } from "@/components/ui/link";
import { ExternalLink } from "lucide-react";

export default function SnippetCategory() {
  const { slug } = useParams();

  const { data: category, isLoading: isCategoryLoading } = useQuery({
    queryKey: [`/api/categories/${slug}`],
  });

  const { data: snippets = [], isLoading: isSnippetsLoading } = useQuery({
    queryKey: [`/api/categories/${slug}/snippets`],
  });

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

              {snippets.map((snippet) => (
                <SnippetCard key={snippet.id} snippet={snippet} />
              ))}

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
