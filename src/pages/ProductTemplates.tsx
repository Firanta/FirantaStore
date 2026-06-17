import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShoppingCart, X, Download, Eye, Check, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ParticleCanvas } from "@/components/ui/particle-canvas-1";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/UserContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const staticTemplates = [
  // Wedding Category
  {
    id: 1,
    name: "Elegant Romance",
    description: "Template pernikahan dengan desain mewah dan elegan untuk hari istimewa Anda.",
    category: "Wedding",
    image: "from-pink-400/30 to-rose-400/30",
    preview: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
    options: [
      {
        type: "soft-file",
        price: 35000,
        label: "Soft File (Unduh)",
        features: [
          "✓ File HTML, CSS & JavaScript",
          "✓ Dapat disesuaikan dengan editor teks",
          "✓ Fleksibel untuk dimodif",
          "✓ Deliverable dalam format ZIP",
          "✓ Dokumentasi lengkap"
        ],
        highlight: "Pilih jika ingin kontrol penuh"
      },
      {
        type: "url",
        price: 75000,
        label: "URL Gratis (Hosting Web)",
        features: [
          "✓ Domain gratis selama 1 tahun",
          "✓ Web hosting 24/7 online",
          "✓ Tidak perlu technical setup",
          "✓ Bisa diakses langsung via link",
          "✓ Support teknis sudah termasuk"
        ],
        highlight: "Mudah, praktis, siap pakai!"
      }
    ]
  },
  {
    id: 2,
    name: "Modern Wedding",
    description: "Desain minimalis modern untuk resepsi pernikahan digital yang kontemporer.",
    category: "Wedding",
    image: "from-blue-400/30 to-cyan-400/30",
    preview: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop",
    options: [
      {
        type: "soft-file",
        price: 35000,
        label: "Soft File (Unduh)",
        features: [
          "✓ File HTML, CSS & JavaScript",
          "✓ Dapat disesuaikan dengan editor teks",
          "✓ Fleksibel untuk dimodif",
          "✓ Deliverable dalam format ZIP",
          "✓ Dokumentasi lengkap"
        ],
        highlight: "Pilih jika ingin kontrol penuh"
      },
      {
        type: "url",
        price: 75000,
        label: "URL Gratis (Hosting Web)",
        features: [
          "✓ Domain gratis selama 1 tahun",
          "✓ Web hosting 24/7 online",
          "✓ Tidak perlu technical setup",
          "✓ Bisa diakses langsung via link",
          "✓ Support teknis sudah termasuk"
        ],
        highlight: "Mudah, praktis, siap pakai!"
      }
    ]
  },
  // Portfolio Category
  {
    id: 3,
    name: "Designer Portfolio Pro",
    description: "Portfolio profesional untuk showcase karya kreatif dengan galeri interaktif.",
    category: "Portfolio",
    image: "from-purple-400/30 to-indigo-400/30",
    preview: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    options: [
      {
        type: "soft-file",
        price: 35000,
        label: "Soft File (Unduh)",
        features: [
          "✓ File HTML, CSS & JavaScript",
          "✓ Dapat disesuaikan dengan editor teks",
          "✓ Fleksibel untuk dimodif",
          "✓ Deliverable dalam format ZIP",
          "✓ Dokumentasi lengkap"
        ],
        highlight: "Pilih jika ingin kontrol penuh"
      },
      {
        type: "url",
        price: 75000,
        label: "URL Gratis (Hosting Web)",
        features: [
          "✓ Domain gratis selama 1 tahun",
          "✓ Web hosting 24/7 online",
          "✓ Tidak perlu technical setup",
          "✓ Bisa diakses langsung via link",
          "✓ Support teknis sudah termasuk"
        ],
        highlight: "Mudah, praktis, siap pakai!"
      }
    ]
  },
  {
    id: 4,
    name: "Developer Portfolio",
    description: "Portfolio khusus untuk developer dengan project showcase dan github integration.",
    category: "Portfolio",
    image: "from-green-400/30 to-emerald-400/30",
    preview: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
    options: [
      {
        type: "soft-file",
        price: 35000,
        label: "Soft File (Unduh)",
        features: [
          "✓ File HTML, CSS & JavaScript",
          "✓ Dapat disesuaikan dengan editor teks",
          "✓ Fleksibel untuk dimodif",
          "✓ Deliverable dalam format ZIP",
          "✓ Dokumentasi lengkap"
        ],
        highlight: "Pilih jika ingin kontrol penuh"
      },
      {
        type: "url",
        price: 75000,
        label: "URL Gratis (Hosting Web)",
        features: [
          "✓ Domain gratis selama 1 tahun",
          "✓ Web hosting 24/7 online",
          "✓ Tidak perlu technical setup",
          "✓ Bisa diakses langsung via link",
          "✓ Support teknis sudah termasuk"
        ],
        highlight: "Mudah, praktis, siap pakai!"
      }
    ]
  },
  // Birthday Gift Category
  {
    id: 5,
    name: "Birthday Surprise",
    description: "Template ulang tahun dengan animasi pesta dan countdown timer yang meriah.",
    category: "Birthday Gift",
    image: "from-yellow-400/30 to-orange-400/30",
    preview: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop",
    options: [
      {
        type: "soft-file",
        price: 35000,
        label: "Soft File (Unduh)",
        features: [
          "✓ File HTML, CSS & JavaScript",
          "✓ Dapat disesuaikan dengan editor teks",
          "✓ Fleksibel untuk dimodif",
          "✓ Deliverable dalam format ZIP",
          "✓ Dokumentasi lengkap"
        ],
        highlight: "Pilih jika ingin kontrol penuh"
      },
      {
        type: "url",
        price: 75000,
        label: "URL Gratis (Hosting Web)",
        features: [
          "✓ Domain gratis selama 1 tahun",
          "✓ Web hosting 24/7 online",
          "✓ Tidak perlu technical setup",
          "✓ Bisa diakses langsung via link",
          "✓ Support teknis sudah termasuk"
        ],
        highlight: "Mudah, praktis, siap pakai!"
      }
    ]
  },
  {
    id: 6,
    name: "Birthday Celebration",
    description: "Desain ceria dengan baloon animation dan photo gallery untuk moment spesial.",
    category: "Birthday Gift",
    image: "from-red-400/30 to-pink-400/30",
    preview: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
    options: [
      {
        type: "soft-file",
        price: 35000,
        label: "Soft File (Unduh)",
        features: [
          "✓ File HTML, CSS & JavaScript",
          "✓ Dapat disesuaikan dengan editor teks",
          "✓ Fleksibel untuk dimodif",
          "✓ Deliverable dalam format ZIP",
          "✓ Dokumentasi lengkap"
        ],
        highlight: "Pilih jika ingin kontrol penuh"
      },
      {
        type: "url",
        price: 75000,
        label: "URL Gratis (Hosting Web)",
        features: [
          "✓ Domain gratis selama 1 tahun",
          "✓ Web hosting 24/7 online",
          "✓ Tidak perlu technical setup",
          "✓ Bisa diakses langsung via link",
          "✓ Support teknis sudah termasuk"
        ],
        highlight: "Mudah, praktis, siap pakai!"
      }
    ]
  },
  // Anniversary Gift Category
  {
    id: 7,
    name: "Anniversary Love Letter",
    description: "Template romantis untuk perayaan anniversary dengan timeline kenangan bersama.",
    category: "Anniversary Gift",
    image: "from-red-500/30 to-pink-500/30",
    preview: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=600&fit=crop",
    options: [
      {
        type: "soft-file",
        price: 35000,
        label: "Soft File (Unduh)",
        features: [
          "✓ File HTML, CSS & JavaScript",
          "✓ Dapat disesuaikan dengan editor teks",
          "✓ Fleksibel untuk dimodif",
          "✓ Deliverable dalam format ZIP",
          "✓ Dokumentasi lengkap"
        ],
        highlight: "Pilih jika ingin kontrol penuh"
      },
      {
        type: "url",
        price: 75000,
        label: "URL Gratis (Hosting Web)",
        features: [
          "✓ Domain gratis selama 1 tahun",
          "✓ Web hosting 24/7 online",
          "✓ Tidak perlu technical setup",
          "✓ Bisa diakses langsung via link",
          "✓ Support teknis sudah termasuk"
        ],
        highlight: "Mudah, praktis, siap pakai!"
      }
    ]
  },
  {
    id: 8,
    name: "Anniversary Milestone",
    description: "Perayaan dengan design elegan dan memory gallery untuk kisah cinta kalian.",
    category: "Anniversary Gift",
    image: "from-purple-400/30 to-rose-400/30",
    preview: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop",
    options: [
      {
        type: "soft-file",
        price: 35000,
        label: "Soft File (Unduh)",
        features: [
          "✓ File HTML, CSS & JavaScript",
          "✓ Dapat disesuaikan dengan editor teks",
          "✓ Fleksibel untuk dimodif",
          "✓ Deliverable dalam format ZIP",
          "✓ Dokumentasi lengkap"
        ],
        highlight: "Pilih jika ingin kontrol penuh"
      },
      {
        type: "url",
        price: 75000,
        label: "URL Gratis (Hosting Web)",
        features: [
          "✓ Domain gratis selama 1 tahun",
          "✓ Web hosting 24/7 online",
          "✓ Tidak perlu technical setup",
          "✓ Bisa diakses langsung via link",
          "✓ Support teknis sudah termasuk"
        ],
        highlight: "Mudah, praktis, siap pakai!"
      }
    ]
  }
];

const categories = ["Semua", "Wedding", "Portfolio", "Birthday Gift", "Anniversary Gift"];

const ProductTemplates = () => {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTemplates, setActiveTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, addOrder } = useUser();
  const { language } = useLanguage();
  const t_page = translations[language].products.templates;

  useEffect(() => {
    const fetchFirestoreTemplates = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "templates"));
        if (!querySnapshot.empty) {
          const loadedTemplates = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const id = doc.id;
            
            // Map category to match UI category filters (Semua, Wedding, Portfolio, Birthday Gift, Anniversary Gift)
            let category = "Wedding";
            const rawCat = (data.category || "").toLowerCase();
            if (rawCat === "wedding") category = "Wedding";
            else if (rawCat === "portfolio") category = "Portfolio";
            else if (rawCat === "birthday") category = "Birthday Gift";
            else if (rawCat === "anniversary") category = "Anniversary Gift";
            else if (rawCat === "event") category = "Wedding"; // fallback
            
            let basePrice = 35000;
            if (typeof data.price === "number") {
              basePrice = data.price;
            } else if (data.price && typeof data.price === "object") {
              basePrice = Number(data.price.softfile) || Number(data.price.url) || 35000;
            }
            
            const options = [
              {
                type: "soft-file",
                price: basePrice,
                label: "Soft File (Unduh)",
                features: [
                  "✓ File HTML, CSS & JavaScript",
                  "✓ Dapat disesuaikan dengan editor teks",
                  "✓ Fleksibel untuk dimodif",
                  "✓ Deliverable dalam format ZIP",
                  "✓ Dokumentasi lengkap"
                ],
                highlight: "Pilih jika ingin kontrol penuh"
              },
              {
                type: "url",
                price: basePrice + 40000,
                label: "URL Gratis (Hosting Web)",
                features: [
                  "✓ Domain gratis selama 1 tahun",
                  "✓ Web hosting 24/7 online",
                  "✓ Tidak perlu technical setup",
                  "✓ Bisa diakses langsung via link",
                  "✓ Support teknis sudah termasuk"
                ],
                highlight: "Mudah, praktis, siap pakai!"
              }
            ];

            let imageGradient = "from-pink-400/30 to-rose-400/30";
            if (category === "Portfolio") imageGradient = "from-purple-400/30 to-indigo-400/30";
            else if (category === "Birthday Gift") imageGradient = "from-yellow-400/30 to-orange-400/30";
            else if (category === "Anniversary Gift") imageGradient = "from-red-500/30 to-pink-500/30";

            return {
              id,
              name: data.name || data.title || "Unnamed Template",
              description: data.description || "No description provided.",
              category,
              image: imageGradient,
              preview: data.imageUrl || (data.images && data.images[0]) || "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
              demoUrl: data.demoUrl || "",
              options
            };
          });
          
          setActiveTemplates(loadedTemplates);
        } else {
          setActiveTemplates(staticTemplates);
        }
      } catch (error) {
        console.error("Error fetching templates from Firestore:", error);
        setActiveTemplates(staticTemplates);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFirestoreTemplates();
  }, []);

  const filteredTemplates = selectedCategory === "Semua" 
    ? activeTemplates 
    : activeTemplates.filter(t => t.category === selectedCategory);

  const handleAddToCart = (template, option) => {
    const item = {
      id: `${template.id}-${option.type}`,
      templateId: template.id,
      templateName: template.name,
      name: template.name,
      category: template.category,
      option: option.label,
      price: option.price,
      quantity: 1,  // Add quantity for payment items
    };
    setCartItems([...cartItems, item]);
    toast({
      title: "Ditambahkan ke keranjang!",
      description: `${template.name} (${option.label}) telah ditambahkan.`,
      duration: 2000,
    });
  };

  const handleRemoveFromCart = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login untuk melanjutkan checkout",
        duration: 2000,
      });
      navigate("/signin");
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Keranjang Kosong",
        description: "Tambahkan produk ke keranjang sebelum checkout",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    // Navigate to checkout page with items
    // Payment will be processed on the checkout page
    navigate("/checkout", { state: { items: cartItems } });
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
  const formatPrice = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  // Calculate average rating for a template
  const getTemplateRating = (templateId: number) => {
    // This would come from backend in a real app
    // For now, we'll generate random ratings for demo
    return Math.floor(Math.random() * 2) + 4; // 4-5 stars for demo
  };

  const getRatingCount = (templateId: number) => {
    // This would come from backend
    return Math.floor(Math.random() * 50) + 10; // 10-60 ratings for demo
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        cartItems={cartItems}
        showCart={showCart}
        onCartToggle={setShowCart}
      />
      
      {/* Hero Section */}
      <section className="min-h-[70vh] flex items-center justify-center relative overflow-hidden bg-background pt-20">
        <ParticleCanvas />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight text-gradient leading-tight"
            >
              {t_page.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            >
              {t_page.subtitle}
            </motion.p>
          </div>
        </div>
        
        {/* Bottom fade for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
      </section>

      {/* Category Filter Bar */}
      <section className="py-8 border-b border-border sticky top-0 z-40 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-start flex-wrap gap-2">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-2"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "border border-primary/30 text-muted-foreground hover:text-foreground hover:border-primary/60"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Cart Sidebar */}
      {showCart && (
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          transition={{ duration: 0.3 }}
          className="fixed right-0 top-0 h-full w-full md:w-96 bg-background border-l border-primary/30 shadow-lg z-50 overflow-y-auto pt-20"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Keranjang Anda</h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">
                Keranjang Anda kosong. Pilih template untuk memulai.
              </p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start justify-between p-4 rounded-lg bg-primary/5 border border-primary/20"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {item.option}
                      </p>
                      <p className="text-sm text-primary font-bold">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(index)}
                      className="p-2 hover:bg-primary/20 rounded-lg transition-colors text-red-500 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}

                {/* Cart Summary */}
                <div className="mt-8 pt-6 border-t border-primary/30 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Items:</span>
                    <span className="font-semibold text-foreground">
                      {cartItems.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold text-foreground">Total:</span>
                    <span className="font-bold text-primary">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                    Lanjutkan ke Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Cart Backdrop */}
      {showCart && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowCart(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Product Preview Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-background/95 backdrop-blur-sm z-10">
                <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Preview Image */}
                <div className="h-64 rounded-xl overflow-hidden relative">
                  <img 
                    src={selectedProduct.preview}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-500 cursor-pointer flex items-center justify-center">
                    <Eye className="w-8 h-8 opacity-0 hover:opacity-100 transition-opacity text-white drop-shadow-lg" />
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    Kategori: {selectedProduct.category}
                  </p>
                  <p className="text-muted-foreground mb-6">
                    {selectedProduct.description}
                  </p>
                  {selectedProduct.demoUrl && (
                    <div className="mb-6">
                      <a
                        href={selectedProduct.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/40 text-sm font-semibold transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Lihat Live Demo ↗
                      </a>
                    </div>
                  )}
                </div>

                {/* Pricing Options */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold">Pilih Opsi Anda:</h3>
                  
                  {selectedProduct.options.map((option, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      className="p-5 rounded-xl border-2 border-primary/30 hover:border-primary/60 transition-all duration-300 cursor-pointer hover:bg-primary/5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-bold text-foreground mb-1">{option.label}</p>
                          <p className="text-xs text-muted-foreground italic">{option.highlight}</p>
                        </div>
                        <p className="text-2xl font-bold text-primary">
                          {formatPrice(option.price)}
                        </p>
                      </div>

                      {/* Features List */}
                      <div className="space-y-2 mb-4">
                        {option.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          handleAddToCart(selectedProduct, option);
                          setSelectedProduct(null);
                        }}
                        className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Tambah ke Keranjang
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Templates Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                Tidak ada template dalam kategori ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template, i) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative rounded-2xl overflow-hidden glass glow-border hover:glow-border-primary transition-all duration-500 flex flex-col h-full"
                >
                  {/* Image/Background */}
                  <div className="relative h-48 overflow-hidden cursor-pointer"
                    onClick={() => setSelectedProduct(template)}
                  >
                    <img 
                      src={template.preview} 
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="flex flex-col items-center gap-2"
                      >
                        <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                        <span className="text-sm font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg">
                          Lihat Preview
                        </span>
                      </motion.div>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col">
                    <div className="mb-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                        {template.category}
                      </p>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {template.name}
                      </h3>
                    </div>

                    <p className="text-muted-foreground text-sm mb-6 flex-1 line-clamp-2">
                      {template.description}
                    </p>

                    {/* Price Options Preview */}
                    <div className="space-y-2 mb-4 pb-4 border-b border-border">
                      {template.options.map((option, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{option.label}</span>
                          <span className="font-bold text-primary">{formatPrice(option.price)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Rating */}
                    <div className="mb-6 flex items-center gap-2">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < getTemplateRating(template.id)
                                ? "text-yellow-500"
                                : "text-muted-foreground"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({getRatingCount(template.id)} reviews)
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedProduct(template)}
                        className="flex-1 py-2 px-3 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors font-medium flex items-center justify-center gap-1.5 text-xs"
                      >
                        <Eye className="w-4 h-4" />
                        Detail & Beli
                      </button>
                      {template.demoUrl && (
                        <a
                          href={template.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3 rounded-lg bg-primary text-primary-foreground hover:opacity-95 transition-all font-medium flex items-center justify-center gap-1.5 text-xs"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Live Demo ↗
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative mesh-gradient">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Template Impian Anda Tidak Ada Di Sini?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Kami menyediakan layanan custom template sesuai kebutuhan spesifik Anda. 
              Hubungi tim kami untuk konsultasi gratis!
            </p>
            <Button size="lg" className="rounded-full gap-2">
              Konsultasi Gratis <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductTemplates;
