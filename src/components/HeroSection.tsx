import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { MagneticText } from "./ui/morphing-cursor";
import AnimatedCTAButton from "./AnimatedCTAButton";
import NeuralBackground from "./ui/flow-field-background";

const HeroSection = () => {
  const { language } = useLanguage();
  const t = translations[language].hero;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Neural Background */}
      <div className="absolute inset-0 z-0">
        <NeuralBackground 
          color="#00e5ff" 
          trailOpacity={0.1} 
          particleCount={800} 
          speed={0.6}
        />
        {/* Subtle overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6"
        >
          {t.agency}
        </motion.p>

        <div className="mb-10 flex flex-col items-center gap-6">
          <MagneticText 
            text="MEMBANGUN PENGALAMAN" 
            hoverText="CREATING SEAMLESS" 
            className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tight leading-none" 
            circleSize={300}
          />
          <MagneticText 
            text="DIGITAL UNTUK ANDA" 
            hoverText="EXPERIENCES FOR YOU" 
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold opacity-90 tracking-tight" 
            circleSize={250}
          />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/web-custom">
            <AnimatedCTAButton variant="primary">
              {t.viewPackages}
            </AnimatedCTAButton>
          </Link>
          <Link to="/samples">
            <AnimatedCTAButton variant="secondary">
              {t.ourWork}
            </AnimatedCTAButton>
          </Link>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
