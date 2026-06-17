import { useRef, useEffect } from "react";
import { animate as animeAnimate, set as animeSet } from "animejs";
import { LucideIcon } from "lucide-react";
import { TiltCard } from "@/components/ui/tilt-card";

interface AnimatedFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

const AnimatedFeatureCard = ({
  icon: Icon,
  title,
  description,
  index,
}: AnimatedFeatureCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!cardRef.current || !iconRef.current) return;

    // Initial state
    animeSet(cardRef.current, { opacity: 0, translateY: 40, scale: 0.95 });
    animeSet(iconRef.current, { scale: 0, rotate: -180 });

    setTimeout(() => {
      if (!cardRef.current || !iconRef.current) return;

      // Card entrance
      animeAnimate(cardRef.current, {
        opacity: [0, 1],
        translateY: [40, 0],
        scale: [0.95, 1],
        duration: 800,
        easing: "easeOutCubic",
      });

      // Icon animation
      animeAnimate(iconRef.current, {
        scale: [0, 1.2, 1],
        rotate: [-180, 0],
        duration: 900,
        delay: 100,
        easing: "easeOutElastic(1, .6)",
      });
    }, index * 150);
  }, [index]);

  return (
    <TiltCard
      tiltLimit={14}
      scale={1.04}
      effect="evade"
      spotlight={true}
      className="rounded-xl"
    >
      <div
        ref={cardRef}
        className="relative p-6 rounded-xl glass glow-border hover:glow-border-primary transition-all duration-300 group h-full"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
            <Icon
              ref={iconRef}
              className="w-7 h-7 text-primary group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>
        <h4 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </TiltCard>
  );
};

export default AnimatedFeatureCard;
