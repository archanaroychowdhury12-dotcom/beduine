
import { HeartHandshake, Crown, ChevronRight } from 'lucide-react';
import { Reveal, FloatingIcon, ParticleButton } from './SubscriptionHelpers';

export function SubscriptionFAQ() {
  const faqs = [
    { q: 'Who can buy a subscription?', a: 'Individuals aged 18 years or above.' },
    { q: 'How long is the subscription valid?', a: '12 months from activation. Subscribe once for 12 months.' },
    { q: 'Is the subscription refundable?', a: 'No, subscription fees are non-refundable and non-transferable.' },
    { q: 'Can I exchange selected member benefits for cash?', a: 'No, selected member tour benefits cannot be exchanged for cash or other packages.' },
    { q: 'What is 1 Discount Credit?', a: '1 Domestic Discount Credit = ₹500 off for 1 person on an eligible Domestic paid tour. 1 International Discount Credit = ₹5,000 off for 1 person on an eligible International paid tour.' },
    { q: 'Can I use International Discount Credit on Domestic tours?', a: 'No. International DC can only be used for International bookings. Domestic DC can only be used for Domestic bookings. Domestic and International credits cannot be cross-used.' },
    { q: 'How are selected members chosen?', a: 'Selected members are chosen through RNG or an approved automated digital system from active valid participants.' }
  ];

  return (
    <section id="faq" className="faq-section">
      <div className="faq-wrapper">
        <div className="text-center mb-10">
          <div className="text-[11px] uppercase tracking-[0.25em] text-[#0D9488] font-extrabold mb-2 font-mono">// Frequently Asked Questions</div>
          <h2 className="font-display text-2xl lg:text-4xl font-extrabold text-[#071833] leading-snug">Common questions about non-selected member benefits</h2>
        </div>

        <div className="faq-grid">
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="faq-card">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-[#0D9488] flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-teal-500/20">
                    <span className="text-white text-sm font-black">Q</span>
                  </div>
                  <div className="flex-1">
                    <h3>{faq.q}</h3>
                    <p>{faq.a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Value Proposition Callout / Promise Box */}
        <Reveal>
          <div className="promise-box">
            <div className="flex flex-col lg:flex-row items-center gap-6 text-center lg:text-left">
              <FloatingIcon>
                <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-2xl shadow-teal-500/20 shrink-0">
                  <HeartHandshake className="w-8 h-8 text-[#0D9488]" />
                </div>
              </FloatingIcon>
              <div className="flex-1">
                <div className="font-display text-lg lg:text-xl font-extrabold text-white mb-1.5">The BEDUINE Promise</div>
                <p className="text-white/90 leading-relaxed font-semibold italic text-base">
                  "Every Sunday, BEDUINE runs a fair digital selection. If I'm selected, I travel free. If not, I still get discounts. Either way, I gain."
                </p>
              </div>
              <a href="#plans" className="shrink-0">
                <ParticleButton variant="gold" className="px-6 py-3.5 rounded-full font-extrabold text-sm inline-flex items-center gap-2 shadow-lg hover:scale-105 transition-transform">
                  <Crown className="w-4 h-4" />Subscribe Now<ChevronRight className="w-4 h-4" />
                </ParticleButton>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
