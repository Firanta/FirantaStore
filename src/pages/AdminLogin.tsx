import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";
import { SignInPage } from "@/components/ui/sign-in";

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    const email = data.email as string;
    const password = data.password as string;

    if (!email || !password) {
      toast({
        title: "Login Failed",
        description: "Email dan password harus diisi",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const isDev = import.meta.env.DEV;
      if (isDev) console.log("[AdminLogin] Attempting login for:", email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get token to check custom claims
      if (isDev) console.log("[AdminLogin] Getting ID token result...");
      const idTokenResult = await user.getIdTokenResult(true);
      if (isDev) console.log("[AdminLogin] Token claims:", idTokenResult.claims);

      // Check if user has admin claim or matches specific admin UID
      const isAdminUid = user.uid === "tVTJBnI0mrSp0hMK4KNrooHbdLE3";
      
      if (idTokenResult.claims.isAdmin === true || isAdminUid) {
        if (isDev) console.log("[AdminLogin] ✅ User has admin claim or is specific admin, redirecting to dashboard");
        toast({
          title: "Akses Diberikan",
          description: "Selamat datang di Admin Panel",
          duration: 3000,
        });
        navigate("/admin/dashboard");
      } else {
        if (isDev) console.log("[AdminLogin] ❌ User is not admin, access denied");
        toast({
          title: "Akses Ditolak",
          description: "Akun ini bukan admin. Hubungi administrator.",
          variant: "destructive",
        });
        await auth.signOut();
      }
    } catch (error: any) {
      console.error("[AdminLogin] ❌ Login error:", error);
      
      let errorMsg = "Login gagal. Coba lagi.";
      if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found") {
        errorMsg = "Email atau password tidak sesuai. Periksa kembali.";
      } else if (error.code === "auth/invalid-email") {
        errorMsg = "Format email tidak valid";
      } else if (error.code === "auth/too-many-requests") {
        errorMsg = "Terlalu banyak percobaan login. Coba lagi nanti.";
      } else if (error.code === "auth/user-disabled") {
        errorMsg = "Akun ini telah dinonaktifkan";
      } else {
        errorMsg = error.message || "Login gagal. Coba lagi.";
      }

      toast({
        title: "Login Failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = () => {
    toast({
      title: "Reset Password",
      description: "Silakan hubungi Super Admin untuk mereset password.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SignInPage
        title={<span className="font-light text-foreground tracking-tighter">Admin <b className="font-semibold text-primary">Portal</b></span>}
        description="Masuk untuk mengelola FirantaStore"
        heroImageSrc="https://images.unsplash.com/photo-1497366216548-37526070297c?w=2160&q=80"
        onSignIn={handleLogin}
        onResetPassword={handleResetPassword}
        isLoading={isLoading}
      />
    </div>
  );
}
