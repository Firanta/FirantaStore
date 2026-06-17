import { useRef, useEffect } from "react";
import { animate as animeAnimate, set as animeSet } from "animejs";

interface AnimatedBadgeProps {
  label: string;
  variant?: "primary" | "secondary" | "success" | "warning";
  index?: number;
}

const AnimatedBadge = ({ label, variant = "primary", index = 0 }: AnimatedBadgeProps) => {
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!badgeRef.current) return;

    // Initial state
    animeSet(badgeRef.current, {
      opacity: 0,
      scale: 0.8,
      rotate: -15,
    });

    // Entrance animation
    animeAnimate(badgeRef.current, {
      opacity: [0, 1],
      scale: [0.8, 1],
      rotate: [-15, 0],
      duration: 600,
      delay: index * 100,
      easing: "easeOutElastic(1, .5)",
    });

    // Continuous subtle pulse
    animeAnimate(badgeRef.current, {
      scale: [1, 1.05, 1],
      duration: 2500,
      loop: true,
      delay: 1000 + index * 100,
      easing: "easeInOutQuad",
    });
  }, [index]);

  const variantClasses = {
    primary: "bg-primary/20 text-primary border border-primary/30",
    secondary: "bg-secondary/20 text-secondary border border-secondary/30",
    success: "bg-green-500/20 text-green-400 border border-green-500/30",
    warning: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  };

  return (
    <div
      ref={badgeRef}
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${variantClasses[variant]}`}
    >
      {label}
    </div>
  );
};

export default AnimatedBadge;
