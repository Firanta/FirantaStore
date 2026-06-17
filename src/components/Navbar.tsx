import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard, ShoppingCart } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import BrandLogo from "./BrandLogo";

const navLinks = [
  { key: "home", href: "/" },
  { key: "templates", href: "/templates" },
  { key: "webCustom", href: "/web-custom" },
  { key: "samples", href: "/samples" },
];

interface NavbarProps {
  cartItems?: Array<any>;
  showCart?: boolean;
  onCartToggle?: (show: boolean) => void;
  brandTextColor?: string;
}

const Navbar = ({ cartItems = [], showCart = false, onCartToggle, brandTextColor = "text-white" }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useUser();
  const { language } = useLanguage();

  const t = translations[language].navbar;

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      // Scrolled state for styling
      setScrolled(currentScrollY > 20);

      // Visibility state for hiding on scroll down
      // If mobile menu is open, keep navbar visible
      if (mobileMenuOpen) {
        setIsVisible(true);
        return;
      }

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scrolling down
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY, mobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname === href || location.pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUserMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-4 inset-x-4 z-50 flex justify-center pointer-events-none"
      >
        <div className={`pointer-events-auto transition-all duration-500 rounded-full flex items-center justify-between w-full max-w-7xl mx-auto px-4 md:px-6 gap-2 sm:gap-4 ${scrolled || mobileMenuOpen
            ? "bg-background/60 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] backdrop-blur-xl py-2"
            : "bg-transparent py-4"
          }`}>
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity z-10 flex-shrink-0"
            title="Firanta Store"
          >
            <img
              // src="./public/videos/images/logobrand.png" 
              src="https://i.ibb.co.com/jv0RgTpF/logobrandv1.png"
              alt="Firanta Logo"
              className={`w-auto object-contain transition-all duration-500 ${scrolled ? "h-8 sm:h-10" : "h-12 sm:h-16"}`}
              style={{ mixBlendMode: 'screen' }}
            />
            <div className="hidden sm:block">
              <BrandLogo
                text="FIRANTA STORE"
                animationType="letterSpinUp"
                fontSize={scrolled ? 16 : 20}
                color={brandTextColor || '#1F2937'}
                duration={1200}
                loop={true}
                responsiveSizes={{ mobile: 14, tablet: 18, desktop: scrolled ? 16 : 20 }}
              />
            </div>
          </Link>

          {/* Desktop Center Navigation */}
          <div className="hidden lg:flex items-center gap-8 flex-grow justify-center">
            {/* Navigation Links */}
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="relative group text-sm font-medium"
                >
                  <span className={`transition-colors duration-300 ${isActive(link.href)
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                    }`}>
                    {t[link.key as keyof typeof t]}
                  </span>
                  {/* Animated underline */}
                  <motion.div
                    layoutId={isActive(link.href) ? "active-underline" : undefined}
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary transition-all duration-300 origin-left ${isActive(link.href) ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                      }`}
                  />
                </Link>
              ))}
            </div>

          </div>

          {/* Right Side: Cart, User Menu & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            {onCartToggle && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCartToggle(!showCart)}
                className="relative p-2.5 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border border-primary/30 hover:border-primary/60 transition-all duration-300 group"
              >
                <ShoppingCart className="w-5 h-5 text-foreground group-hover:text-primary transition-colors duration-300" />
                {cartItems.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-gradient-to-br from-primary to-accent text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg shadow-primary/40"
                  >
                    {cartItems.length}
                  </motion.span>
                )}
              </motion.button>
            )}

            {/* Desktop Auth/User Menu */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary/15 to-accent/15 hover:from-primary/25 hover:to-accent/25 border border-primary/30 hover:border-primary/60 text-primary transition-all duration-300 group"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-primary/40">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium hidden sm:inline group-hover:text-primary transition-colors">
                      {user?.name}
                    </span>
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-48 rounded-xl shadow-xl shadow-black/40 z-50 overflow-hidden backdrop-blur-xl bg-white/5 border border-transparent"
                        style={{
                          backgroundImage: 'linear-gradient(white/5, white/5)',
                          border: '1.5px solid transparent',
                          borderRadius: '12px',
                          boxShadow: 'inset 0 0 0 1px rgba(59, 130, 246, 0.3), inset 0 0 0 1.5px rgba(168, 85, 247, 0.2), 0 10px 30px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        <Link
                          to="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-3 text-foreground hover:text-primary hover:bg-primary/10 transition-colors border-b border-white/10"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          {t.dashboard}
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/15 transition-colors font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          {t.logout}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/signin"
                      className="px-5 py-2 rounded-full text-xs font-medium border border-primary/40 text-muted-foreground hover:text-primary hover:border-primary/80 transition-all duration-300 inline-block hover:bg-primary/5"
                    >
                      {t.signin}
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <a
                      href="/signup"
                      className="px-5 py-2 rounded-full text-xs font-medium bg-gradient-to-r from-primary via-accent to-primary text-white hover:opacity-90 transition-all duration-300 inline-block shadow-lg shadow-primary/40 hover:shadow-xl hover:shadow-primary/50"
                    >
                      {t.signup}
                    </a>
                  </motion.div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border border-primary/30 hover:border-primary/60 transition-all duration-300 group"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground group-hover:text-primary transition-colors duration-300" />
              ) : (
                <Menu className="w-5 h-5 text-foreground group-hover:text-primary transition-colors duration-300" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-0 right-0 z-40 lg:hidden"
          >
            <div className="mx-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-transparent shadow-lg shadow-black/30"
              style={{
                backgroundImage: 'linear-gradient(white/5, white/5)',
                border: '1.5px solid transparent',
                borderRadius: '16px',
                boxShadow: 'inset 0 0 0 1px rgba(220, 38, 38, 0.3), inset 0 0 0 1.5px rgba(59, 130, 246, 0.2), 0 10px 30px rgba(0, 0, 0, 0.3)',
              }}>
              <div className="p-4 space-y-3">
                {/* Mobile Navigation Links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`block w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${isActive(link.href)
                        ? "text-primary bg-primary/20 border border-primary/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                      }`}
                  >
                    {t[link.key as keyof typeof t]}
                  </Link>
                ))}

                {/* Mobile Cart Button */}
                {onCartToggle && (
                  <motion.button
                    onClick={() => {
                      onCartToggle(!showCart);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-primary/10 border border-primary/30 text-primary font-medium flex items-center justify-between transition-colors hover:bg-primary/20"
                  >
                    <span>Keranjang</span>
                    <div className="relative">
                      <ShoppingCart className="w-5 h-5" />
                      {cartItems.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {cartItems.length}
                        </span>
                      )}
                    </div>
                  </motion.button>
                )}

                {/* Auth Section */}
                <div className="border-t border-border pt-3">
                  {isAuthenticated ? (
                    <>
                      <p className="text-sm text-muted-foreground mb-3 px-2">
                        {t.loggedInAs} <span className="font-semibold text-foreground">{user?.name}</span>
                      </p>
                      <Link
                        to="/dashboard"
                        className="block w-full px-4 py-3 rounded-lg text-primary bg-primary/10 font-medium mb-2 text-center text-sm"
                      >
                        {t.dashboard}
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full px-4 py-3 rounded-lg text-red-600 bg-red-500/10 font-medium hover:bg-red-500/20 transition-colors text-sm"
                      >
                        {t.logout}
                      </button>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        to="/signin"
                        className="block w-full px-4 py-3 rounded-lg border border-primary/30 text-center text-muted-foreground hover:text-foreground hover:border-primary/60 transition-all text-sm font-medium"
                      >
                        {t.signin}
                      </Link>
                      <Link
                        to="/signup"
                        className="block w-full px-4 py-3 rounded-lg bg-primary text-center text-primary-foreground font-medium hover:opacity-90 transition-opacity text-sm"
                      >
                        {t.signup}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 lg:hidden bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
