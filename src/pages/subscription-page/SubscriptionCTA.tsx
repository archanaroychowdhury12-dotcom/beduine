
import { Zap, Crown, ChevronRight, Phone } from 'lucide-react';
import { Reveal, KineticText, ParticleButton } from './SubscriptionHelpers';

interface SubscriptionCTAProps {
  onSelectPlan: (planName: string) => void;
}

export function SubscriptionCTA({ onSelectPlan }: SubscriptionCTAProps) {
  return (
    <section id="contact" className="pt-12 pb-32 lg:pt-16 lg:pb-48 relative overflow-hidden">
      <div className="relative max-w-4xl mx-auto px-5 lg:px-8 text-center z-10 -translate-y-10 lg:-translate-y-16">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-gold text-neon-gold text-[11px] uppercase tracking-widest font-semibold mb-6"><Zap className="w-3.5 h-3.5" /> Lock Your Entry</div>
          <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
            <KineticText text="Your next story begins" />
            <br /><span className="gold-shimmer"><KineticText text="with a single subscription." delay={0.4} /></span>
          </h2>
          <p className="mt-6 text-lg text-ink/70 max-w-2xl mx-auto font-semibold">Join thousands of travelers who trust BEDUINE for AI-curated journeys, transparent selections, and guaranteed value.</p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button onClick={() => onSelectPlan('Silver')} className="cursor-pointer border-none bg-transparent p-0">
              <ParticleButton variant="gold" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base">
                <Crown className="w-5 h-5" /> Lock Your Entry <ChevronRight className="w-5 h-5" />
              </ParticleButton>
            </button>
            <a href="tel:+918768903565" data-magnetic><ParticleButton variant="cyan" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold"><Phone className="w-4 h-4" /> +91 87689 03565</ParticleButton></a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
