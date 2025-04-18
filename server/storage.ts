import { 
  users, type User, type InsertUser,
  snippetCategories, type SnippetCategory, type InsertSnippetCategory,
  snippets, type Snippet, type InsertSnippet
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Snippet category operations
  getSnippetCategories(): Promise<SnippetCategory[]>;
  getSnippetCategoryBySlug(slug: string): Promise<SnippetCategory | undefined>;
  createSnippetCategory(category: InsertSnippetCategory): Promise<SnippetCategory>;

  // Snippet operations
  getSnippetsByCategoryId(categoryId: number): Promise<Snippet[]>;
  getSnippetsByCategorySlug(slug: string): Promise<Snippet[]>;
  getSnippet(id: number): Promise<Snippet | undefined>;
  createSnippet(snippet: InsertSnippet): Promise<Snippet>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private snippetCategories: Map<number, SnippetCategory>;
  private snippets: Map<number, Snippet>;
  private currentUserId: number;
  private currentCategoryId: number;
  private currentSnippetId: number;

  constructor() {
    this.users = new Map();
    this.snippetCategories = new Map();
    this.snippets = new Map();
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentSnippetId = 1;

    // Initialize with default data
    this.initializeDefaultData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Snippet category operations
  async getSnippetCategories(): Promise<SnippetCategory[]> {
    return Array.from(this.snippetCategories.values());
  }

  async getSnippetCategoryBySlug(slug: string): Promise<SnippetCategory | undefined> {
    return Array.from(this.snippetCategories.values()).find(
      (category) => category.slug === slug
    );
  }

  async createSnippetCategory(category: InsertSnippetCategory): Promise<SnippetCategory> {
    const id = this.currentCategoryId++;
    const newCategory: SnippetCategory = { ...category, id };
    this.snippetCategories.set(id, newCategory);
    return newCategory;
  }

  // Snippet operations
  async getSnippetsByCategoryId(categoryId: number): Promise<Snippet[]> {
    return Array.from(this.snippets.values())
      .filter(snippet => snippet.categoryId === categoryId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async getSnippetsByCategorySlug(slug: string): Promise<Snippet[]> {
    const category = await this.getSnippetCategoryBySlug(slug);
    if (!category) return [];
    return this.getSnippetsByCategoryId(category.id);
  }

  async getSnippet(id: number): Promise<Snippet | undefined> {
    return this.snippets.get(id);
  }

  async createSnippet(snippet: InsertSnippet): Promise<Snippet> {
    const id = this.currentSnippetId++;
    const newSnippet = { 
      ...snippet, 
      id,
      // Set default values for new fields if not provided
      tags: snippet.tags || null,
      isPremium: snippet.isPremium !== undefined ? snippet.isPremium : false,
      popularity: snippet.popularity || 0
    } as Snippet;
    this.snippets.set(id, newSnippet);
    return newSnippet;
  }

  // Initialize with sample data
  private async initializeDefaultData() {
    // Create categories
    const productCategory = await this.createSnippetCategory({
      name: "Product App Snippets",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      slug: "product"
    });

    const paymentCategory = await this.createSnippetCategory({
      name: "Payment App Snippets",
      icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
      slug: "payment"
    });

    const cartCategory = await this.createSnippetCategory({
      name: "Cart App Snippets",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      slug: "cart"
    });

    const uiCategory = await this.createSnippetCategory({
      name: "UI App Snippets",
      icon: "M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z",
      slug: "ui"
    });

    // Create snippets for Product category
    await this.createSnippet({
      categoryId: productCategory.id,
      title: "1. Theme.liquid Header",
      description: "Add this snippet to your theme.liquid file inside the <head> tag to load the app's necessary scripts.",
      language: "html",
      code: `<!-- Product Recommendations App by ShopBoost -->
<script src="https://cdn.shopboost.com/recommendation/v2/app.js" 
  data-shop="{{ shop.permanent_domain }}"
  data-api-key="YOUR_API_KEY"></script>
<link rel="stylesheet" href="https://cdn.shopboost.com/recommendation/v2/app.css">
<!-- End Product Recommendations App -->`,
      orderIndex: 1,
      tags: ["Essential", "Setup", "Header"],
      isPremium: false,
      popularity: 324,
      previewContent: {
        type: "scriptLoaded",
        content: {
          status: "success",
          message: "Script successfully loaded",
          console: [
            { type: "log", text: "ShopBoost Recommendations initialized" },
            { type: "info", text: "API Connected to shop-domain.myshopify.com" }
          ],
          note: "The script automatically initializes and connects to your Shopify store using your API key."
        }
      }
    });

    await this.createSnippet({
      categoryId: productCategory.id,
      title: "2. Product Template",
      description: "Add this code to your product template to display recommendations based on the current product.",
      language: "html",
      code: `<div class="product-recommendations"
  data-product-id="{{ product.id }}"
  data-limit="4"
  data-recommendation-type="related"
  data-section="{{ section.id }}">
  <h2>You may also like</h2>
  <div class="recommendation-container">
    <!-- Recommendations will be loaded here -->
  </div>
</div>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    if (typeof ShopBoostRecommendations !== 'undefined') {
      ShopBoostRecommendations.init();
    }
  });
</script>`,
      orderIndex: 2,
      tags: ["Essential", "Product Page", "Template"],
      isPremium: false,
      popularity: 287,
      previewContent: {
        type: "productGrid",
        content: {
          title: "You may also like",
          products: [
            { name: "Product Name", price: "$19.99" },
            { name: "Similar Product", price: "$24.99" },
            { name: "Another Item", price: "$15.99" },
            { name: "Final Suggestion", price: "$29.99" }
          ]
        }
      }
    });

    await this.createSnippet({
      categoryId: productCategory.id,
      title: "3. App Customization",
      description: "Configure the recommendation app's appearance and behavior with these settings.",
      language: "javascript",
      code: `// Place this code after the app's script tag in theme.liquid
<script>
  window.ShopBoostConfig = {
    // Styling options
    styling: {
      theme: 'light', // Options: light, dark, custom
      accentColor: '#3b82f6', // Your store's accent color
      borderRadius: '4px', // Border radius for product cards
      fontFamily: 'inherit' // Use your theme's font or specify one
    },
    
    // Recommendation settings
    recommendations: {
      defaultCount: 4, // Number of products to show by default
      showPrice: true,
      showCompareAtPrice: true,
      enableQuickAdd: true, // Adds "Quick Add" button to products
      algorithm: 'hybrid' // Options: purchased_together, similar, hybrid
    },
    
    // Placement options
    placements: {
      product: true, // Show on product pages
      cart: true, // Show on cart page
      homepage: false // Show on homepage
    },
    
    // Analytics
    enableAnalytics: true, // Track recommendation performance
    
    // Advanced options
    advanced: {
      customCssUrl: '', // URL to custom CSS file
      loadDelay: 0, // Delay in ms before loading recommendations
      priorityLoad: true // Load recommendations with high priority
    }
  };
</script>`,
      orderIndex: 3,
      tags: ["Configuration", "Advanced", "Customization"],
      isPremium: true,
      popularity: 176,
      previewContent: {
        type: "config",
        content: {
          accentColor: "#3b82f6",
          theme: "light",
          placements: [
            { name: "Product Pages", enabled: true },
            { name: "Cart Page", enabled: true },
            { name: "Homepage", enabled: false }
          ],
          validation: "Configuration validated"
        }
      }
    });

    await this.createSnippet({
      categoryId: productCategory.id,
      title: "4. Analytics Integration",
      description: "Optional: Add this code to track conversion data from recommendations.",
      language: "javascript",
      code: `<script>
  // Place in cart.liquid or add-to-cart function
  document.addEventListener('DOMContentLoaded', function() {
    // Track when products are added to cart
    document.body.addEventListener('product:added-to-cart', function(event) {
      if (typeof ShopBoostRecommendations !== 'undefined') {
        ShopBoostRecommendations.trackEvent({
          type: 'add_to_cart',
          productId: event.detail.productId,
          variantId: event.detail.variantId,
          quantity: event.detail.quantity,
          source: 'recommendation'
        });
      }
    });
    
    // Track when recommendations are viewed
    if (typeof ShopBoostRecommendations !== 'undefined') {
      ShopBoostRecommendations.trackEvent({
        type: 'recommendation_view',
        page: window.location.pathname
      });
    }
  });
</script>`,
      orderIndex: 4,
      tags: ["Analytics", "Tracking", "Optional"],
      isPremium: true,
      popularity: 142,
      previewContent: {
        type: "analytics",
        content: {
          conversionRate: "12.4%",
          metrics: [
            { name: "Views", value: "1,245", color: "blue" },
            { name: "Clicks", value: "354", color: "green" },
            { name: "Carts", value: "86", color: "yellow" },
            { name: "Orders", value: "42", color: "red" }
          ],
          note: "Data is automatically collected and displayed in your app dashboard"
        }
      }
    });
    
    // Add a new free snippet
    await this.createSnippet({
      categoryId: productCategory.id,
      title: "5. Simple Product Grid",
      description: "A simpler implementation for showing related products with minimal styling.",
      language: "html",
      code: `<div class="simple-product-recommendations">
  <h3>You might also like</h3>
  <div class="product-grid" data-products-count="3">
    <!-- Products will be inserted here -->
  </div>
  
  <style>
    .simple-product-recommendations {
      margin: 30px 0;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
      margin-top: 15px;
    }
    .product-item {
      border: 1px solid #eee;
      border-radius: 4px;
      padding: 10px;
      text-align: center;
    }
    .product-image {
      width: 100%;
      height: auto;
      border-radius: 3px;
    }
    .product-title {
      margin: 10px 0 5px;
      font-size: 14px;
      font-weight: 500;
    }
    .product-price {
      color: #555;
      font-size: 14px;
    }
  </style>
  
  <script>
    // Basic implementation that doesn't require the full app
    document.addEventListener('DOMContentLoaded', function() {
      const productId = document.querySelector('[data-product-id]')?.getAttribute('data-product-id');
      const count = document.querySelector('.product-grid').getAttribute('data-products-count') || 3;
      
      if (productId) {
        fetch('/recommendations/related.json?product_id=' + productId + '&limit=' + count)
          .then(response => response.json())
          .then(data => {
            const container = document.querySelector('.product-grid');
            
            data.products.forEach(product => {
              const item = document.createElement('div');
              item.className = 'product-item';
              item.innerHTML = \`
                <img src="\${product.featured_image}" alt="\${product.title}" class="product-image">
                <h4 class="product-title">\${product.title}</h4>
                <div class="product-price">\${product.price}</div>
              \`;
              container.appendChild(item);
            });
          })
          .catch(err => console.error('Error loading recommendations:', err));
      }
    });
  </script>
</div>`,
      orderIndex: 5,
      tags: ["Free", "Simple", "Beginner"],
      isPremium: false,
      popularity: 421,
      previewContent: {
        type: "productGrid",
        content: {
          title: "You might also like",
          products: [
            { name: "Basic T-Shirt", price: "$19.99" },
            { name: "Summer Shorts", price: "$24.99" },
            { name: "Classic Cap", price: "$15.99" }
          ]
        }
      }
    });
  }
}

export const storage = new MemStorage();
