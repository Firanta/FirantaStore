import { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { animate as animeAnimate, set as animeSet, stagger as animeStagger } from 'animejs';
import { TiltCard } from '@/components/ui/tilt-card';

interface AnimatedPackageCardProps {
  title: string;
  price: string;
  audience: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  index: number;
  onCtaClick?: () => void;
}

const AnimatedPackageCard = ({
  title,
  price,
  audience,
  description,
  features,
  isPopular = false,
  index,
  onCtaClick,
}: AnimatedPackageCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLLIElement[]>([]);

  useEffect(() => {
    if (!cardRef.current) return;

    // Initial state
    animeSet(cardRef.current, {
      opacity: 0,
      translateY: 60,
      scale: 0.9,
    });

    // Card entrance with delay
    const delay = index * 200;
    animeAnimate(cardRef.current, {
      opacity: [0, 1],
      translateY: [60, 0],
      scale: [0.9, 1],
      duration: 900,
      delay,
      easing: 'easeOutCubic',
    });

    // Animate features list items
    featuresRef.current.forEach((el) => {
      animeSet(el, {
        opacity: 0,
        translateX: -20,
      });
    });

    animeAnimate(featuresRef.current, {
      opacity: [0, 1],
      translateX: [-20, 0],
      duration: 600,
      delay: animeStagger(80, { start: delay + 400 }),
      easing: 'easeOutCubic',
    });
  }, [index, isPopular]);

  return (
    <TiltCard
      tiltLimit={isPopular ? 10 : 8}
      scale={isPopular ? 1.04 : 1.02}
      effect="evade"
      spotlight={true}
      className="rounded-3xl"
    >
      <div
        ref={cardRef}
        className={`relative rounded-3xl p-8 glow-border transition-all duration-500 h-full ${isPopular
            ? 'glass-strong lg:-mt-4 lg:mb-4 ring-1 ring-primary/30 bg-gradient-to-b from-white/[0.08] to-transparent'
            : 'glass'
          }`}
        style={{ willChange: 'transform, opacity' }}
      >
        {isPopular && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold tracking-wide uppercase shadow-lg">
            Paling Populer
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-primary font-semibold">{audience}</p>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-4xl font-bold text-foreground">{price.split(' ')[0]}</span>
            <span className="text-muted-foreground">{price.split(' ')[1] || ''}</span>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <ul className="space-y-3 mb-8">
          {features.map((feature, idx) => (
            <li
              key={idx}
              ref={(el) => {
                if (el) featuresRef.current[idx] = el;
              }}
              className="flex items-start gap-3 text-sm text-muted-foreground"
              style={{ willChange: 'transform, opacity' }}
            >
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={onCtaClick}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${isPopular
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/50'
              : 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30'
            }`}
        >
          Mulai Sekarang
        </button>
      </div>
    </TiltCard>
  );
};

export default AnimatedPackageCard;
