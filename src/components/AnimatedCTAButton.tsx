import { useRef, useEffect } from "react";
import { animate as animeAnimate, set as animeSet } from "animejs";

interface AnimatedCTAButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary";
  className?: string;
}

const AnimatedCTAButton = ({
  children,
  onClick,
  href,
  variant = "primary",
  className = "",
}: AnimatedCTAButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!buttonRef.current || !glowRef.current) return;

    // Initial state
    animeSet(glowRef.current, { scale: 0, opacity: 0 });

    const handleMouseEnter = () => {
      if (!glowRef.current) return;

      animeAnimate(glowRef.current, {
        scale: [0, 1.5],
        opacity: [0, 1, 0],
        duration: 800,
        easing: "easeOutCubic",
      });

      animeAnimate(buttonRef.current, {
        scale: [1, 1.05],
        duration: 300,
        easing: "easeOutCubic",
      });
    };

    const handleMouseLeave = () => {
      animeAnimate(buttonRef.current, {
        scale: 1,
        duration: 300,
        easing: "easeOutCubic",
      });
    };

    const button = buttonRef.current;
    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const baseClasses =
    "relative inline-flex items-center justify-center px-8 py-3 rounded-full font-semibold transition-all duration-300 overflow-hidden";

  const variantClasses = {
    primary:
      "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/50",
    secondary:
      "border border-primary/30 text-foreground hover:bg-primary/5 shadow-lg shadow-primary/20",
  };

  const Element = href ? "a" : "button";

  return (
    <Element
      ref={buttonRef as any}
      href={href}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {/* Animated glow effect */}
      <div
        ref={glowRef}
        className={`absolute inset-0 rounded-full ${variant === "primary"
            ? "bg-gradient-to-r from-primary to-transparent"
            : "bg-gradient-to-r from-primary/50 to-transparent"
          } pointer-events-none`}
      ></div>

      {/* Content */}
      <span className="relative z-10">{children}</span>
    </Element>
  );
};

export default AnimatedCTAButton;
