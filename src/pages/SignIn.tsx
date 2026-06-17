import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { translations } from "@/lib/translations";
import { SignInPage, Testimonial } from "@/components/ui/sign-in";

const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
    name: "Sarah Chen",
    handle: "@sarahdigital",
    text: "Amazing platform! The user experience is seamless and the features are exactly what I needed."
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&q=80",
    name: "Marcus Johnson",
    handle: "@marcustech",
    text: "This service has transformed how I work. Clean design, powerful features, and excellent support."
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
    name: "David Martinez",
    handle: "@davidcreates",
    text: "I've tried many platforms, but this one stands out. Intuitive, reliable, and genuinely helpful for productivity."
  },
];

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language].auth.signin;

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    const email = data.email as string;
    const password = data.password as string;

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const isDev = import.meta.env.DEV;
      if (isDev) console.log("[SignIn] Attempting login for:", email);
      await login(email, password);
      
      if (isDev) console.log("[SignIn] Login successful!");
      toast({
        title: translations[language].errors.loginFailed === "Login Failed" ? "Login Successful!" : "Login Berhasil!",
        description: (language as string) === "en" ? "Welcome back to Firanta Store" : "Selamat datang kembali ke Firanta Store",
        duration: 3000,
      });
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("[SignIn] Error:", error);
      const errorMessage = error instanceof Error ? error.message : translations[language].errors.errorOccurred;
      
      toast({
        title: t.title,
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    toast({
      title: "Google Login",
      description: "Google login integration is coming soon.",
    });
  };
  
  const handleResetPassword = () => {
    toast({
      title: "Reset Password",
      description: "Password reset functionality will be available soon.",
    });
  };

  const handleCreateAccount = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <SignInPage
        title={t.title}
        description={t.subtitle}
        heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
        testimonials={sampleTestimonials}
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
        isLoading={isLoading}
      />

      <Footer />
    </div>
  );
};

export default SignIn;
