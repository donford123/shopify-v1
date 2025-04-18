import { MainLayout } from "@/components/MainLayout";
import { TabBar } from "@/components/TabBar";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export default function Home() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["/api/categories"],
  });

  return (
    <MainLayout>
      <TabBar />
      <div className="flex-1 overflow-auto notion-scrollbar">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Shopify App Snippets</h1>
            <p className="text-gray-600">
              Easily integrate powerful Shopify apps into your store with copy-and-paste code snippets. 
              Browse categories below to get started.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-24 bg-white rounded-lg shadow-sm border border-[#e5e5e5] animate-pulse" />
              ))
            ) : (
              categories.map((category) => (
                <Link key={category.id} href={`/category/${category.slug}`}>
                  <a className="block h-full">
                    <div className="h-full bg-white rounded-lg shadow-sm border border-[#e5e5e5] hover:shadow-md transition-shadow p-4 flex flex-col">
                      <div className="flex items-center mb-3">
                        <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d={category.icon}
                            />
                          </svg>
                        </div>
                        <h2 className="text-lg font-medium">{category.name}</h2>
                      </div>
                      <p className="text-sm text-gray-500 mb-3 flex-grow">
                        {category.slug === "product" && "Display personalized product recommendations based on shopping behavior."}
                        {category.slug === "payment" && "Integrate secure payment methods and checkout options."}
                        {category.slug === "cart" && "Customize cart functionality and upsell opportunities."}
                        {category.slug === "ui" && "Add UI components and visual elements to enhance store experience."}
                      </p>
                      <span className="text-blue-600 text-sm font-medium">View snippets →</span>
                    </div>
                  </a>
                </Link>
              ))
            )}
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <h2 className="text-lg font-medium text-blue-800 mb-2">How to Use Shopify App Snippets</h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-blue-800">Browse app categories</span>
                  <p className="text-sm text-blue-600">Explore different types of Shopify apps and find what you need.</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-blue-800">Copy snippet code</span>
                  <p className="text-sm text-blue-600">Click the copy button on any code snippet to copy it to your clipboard.</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-blue-800">Paste into your Shopify theme</span>
                  <p className="text-sm text-blue-600">Add the code to your theme files following the instructions.</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-blue-800">Customize as needed</span>
                  <p className="text-sm text-blue-600">Adjust settings, placeholders, and styles to match your store.</p>
                </div>
              </li>
            </ul>
            <div className="mt-4">
              <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
