import { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { TubesCursor } from "./ui/tube-cursor";
import { ModemAnimatedFooter } from "./ui/modem-animated-footer";
import { Twitter, Github, Dribbble } from "lucide-react";

const Footer = () => {
  const { language } = useLanguage();
  const t = translations[language].footer;
  const t_nav = translations[language].navbar;
  const t_portfolio = translations[language].portfolio;

  const socialLinks = [
    {
      icon: <Twitter className="w-6 h-6" />,
      href: "https://twitter.com",
      label: "Twitter",
    },
    {
      icon: <Github className="w-6 h-6" />,
      href: "https://github.com/firanta",
      label: "GitHub",
    },
    {
      icon: <Dribbble className="w-6 h-6" />,
      href: "https://dribbble.com",
      label: "Dribbble",
    },
  ];

  const navLinks = [
    { label: t_nav.home, href: "/" },
    { label: t_nav.templates, href: "/templates" },
    { label: t_nav.webCustom, href: "/web-custom" },
    { label: t_nav.samples, href: "/samples" },
  ];

  return (
    <ModemAnimatedFooter
      brandName="FIRANTA"
      brandDescription={t_portfolio.subtitle}
      socialLinks={socialLinks}
      navLinks={navLinks}
      creatorName="Firanta Team"
      creatorUrl="/"
    >
      <TubesCursor 
        hideText={true}
        initialColors={["#00e5ff", "#7c3aed", "#3b82f6"]}
        lightIntensity={150}
        enableRandomizeOnClick={false}
      />
    </ModemAnimatedFooter>
  );
};

export default Footer;
