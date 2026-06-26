import { Shield } from 'lucide-react';
import { Reveal } from './SubscriptionHelpers';

export function TermsAndConditions() {

  const sections = [
    {
      id: 'A',
      title: 'A. Membership & Subscription Rules',
      content: `1. Subscription plans are available only to individuals aged 18 years or above.
2. Each subscription is valid for a period of 12 (Twelve) months from the date of activation.
3. Subscription fees are strictly non-refundable and non-transferable.
4. A subscription will be activated only after successful payment verification, mobile number verification, and KYC verification (if required).
5. A customer may purchase multiple subscriptions under the same name, subject to company approval.
6. All subscription benefits are applicable only to active subscribers.`
    },
    {
      id: 'B',
      title: 'B. Travel Reward Rules',
      content: `7. Each subscription includes 1 (One) Travel Reward Credit (TRC).
8. Only active subscribers are eligible to participate in the Travel Reward selection.
9. The Travel Reward selection will be conducted through a Random Number Generator (RNG) or any other approved automated digital system.
10. The Company's decision regarding winner selection shall be final and binding.
11. Travel Reward selection results cannot be challenged, modified, or reconsidered once announced.
12. In case of technical issues, system failures, force majeure events, or unforeseen circumstances, the Company reserves the right to postpone, reschedule, or modify the draw.
13. A minimum of 5% of the total valid participants will be selected as winners every week, using the "Round-Up" rule.
14. The draw may be conducted live, recorded, or through an automated digital platform.
15. Winner announcements may be published through the Company Website, Mobile App, Social Media Platforms, SMS, Email, or any other official communication channel.`
    },
    {
      id: 'C',
      title: 'C. Winner Benefits & Conditions',
      content: `16. Winner Tour benefits cannot be exchanged for cash or any monetary compensation.
17. Winner Tour benefits cannot be exchanged for any other tour package, service, voucher, or offer.
18. Winner Tours will be conducted only on destinations, dates, and itineraries selected by the Company.
19. Winners must confirm their participation within 15 days of the announcement or invitation. Failure to do so may result in cancellation of the benefit.
20. If a winner fails to join the allocated tour, the benefit shall be considered forfeited.
21. Winner Tour benefits are non-transferable except where Name Change benefits are specifically allowed under the subscriber's plan.
22. Winners must provide valid government-issued identification before joining the tour.
23. The Company reserves the sole right to determine destinations, hotels, transportation, sightseeing schedules, and tour inclusions.
24. A subscriber may avail Winner Tour benefits only once during the validity period of a subscription.`
    },
    {
      id: 'D',
      title: 'D. Name Change Policy',
      content: `25. No Name Change facility is available under the Silver Plan.
26. Gold Plan subscribers are entitled to one (1) Name Change for an eligible family member.
27. Platinum Plan subscribers are entitled to two (2) Name Changes for eligible family members.
28. Family Members include:
   - Spouse
   - Parents
   - Children
   - Brother
   - Sister
29. All Name Change requests are subject to verification and approval by the Company.`
    },
    {
      id: 'E',
      title: 'E. Discount Credit (DC) Policy',
      content: `General Rules:
30. 1 Discount Credit (DC) = 1 Person = ₹500 Discount.
31. A maximum of one (1) Discount Credit can be used per person per tour booking.
32. Multiple Discount Credits cannot be combined for a single person's tour cost.
33. Discount Credits are applicable only on Beduin Tour & Travels Paid Tour Packages.
34. Discount Credits cannot be redeemed for cash.
35. Discount Credits cannot be sold, transferred, exchanged, or resold.
36. Unused Discount Credits automatically expire upon subscription expiry.

Silver Plan (1 DC):
37. 1 DC = 1 Tour Booking (Subscriber Only). The subscriber may use the credit for one paid tour booking and receive a flat ₹500 discount.

Gold Plan (2 DC):
38. Option A â€“ Two Separate Tours:
   - 2 DC may be used for two separate tour bookings by the subscriber, OR one approved Name Change for an eligible family member.
39. Option B â€“ Two Persons in One Tour:
   - The subscriber may use 2 DC for Subscriber + 1 Family Member/Friend in the same tour. (1 DC = Subscriber, 1 DC = Additional Person). Example: Subscriber + Spouse, Subscriber + Child, Subscriber + Friend.

Platinum Plan (4 DC):
40. Option A â€“ Four Separate Tours:
   - 4 DC may be used for four separate tour bookings by the subscriber, OR up to two approved Name Changes for eligible family members.
41. Option B â€“ Four Persons in One Tour:
   - The subscriber may use 4 DC for Subscriber + 3 Family Members/Friends in the same tour (e.g., Subscriber + Spouse + Two Children, Subscriber + Three Friends, Subscriber + Two Family Members + One Friend).
42. Option C â€“ Two Persons in Two Separate Tours:
   - The subscriber may use 4 DC for Tour 1 (Subscriber + 1 Family Member/Friend) and Tour 2 (Subscriber + 1 Family Member/Friend).`
    },
    {
      id: 'F',
      title: 'F. Domestic & International Discount Credit Policy',
      content: `43. Domestic Membership Discount Credits can only be used for Domestic Paid Tour Packages.
44. International Membership Discount Credits can only be used for International Paid Tour Packages.
45. Domestic Discount Credits cannot be used for International Tours, and International Discount Credits cannot be used for Domestic Tours.`
    },
    {
      id: 'G',
      title: 'G. Tour Operations & Travel Rules',
      content: `46. The Company reserves the right to determine and modify tour schedules, routes, hotels, transportation, and services whenever necessary.
47. Tours may be postponed, rescheduled, merged, or cancelled if the minimum required number of participants is not achieved.
48. Tour schedules, itineraries, or destinations may be altered due to weather conditions, natural disasters, political unrest, strikes, road closures, pandemics, government regulations, or any force majeure event.
49. Any personal expenses, including but not limited to shopping, laundry, room service, personal transportation, medical expenses, and optional activities, shall be borne by the subscriber.`
    },
    {
      id: 'H',
      title: 'H. Travel Insurance Policy',
      content: `50. Travel insurance benefits shall be governed by the terms and conditions of the respective insurance provider.
51. Beduin Tour & Travels shall not be responsible for any insurance claim approval, rejection, settlement, or dispute.`
    },
    {
      id: 'I',
      title: 'I. Fraud Prevention & Misuse Policy',
      content: `52. Any false, misleading, incomplete, or fraudulent information may result in suspension or termination of the subscription.
53. The Company reserves the right to cancel memberships found involved in duplicate registrations, fake payments, fraudulent activities, or attempts to manipulate the system.
54. No refund shall be provided in such cases.`
    },
    {
      id: 'J',
      title: 'J. Liability Disclaimer',
      content: `55. Beduin Tour & Travels shall not be held liable for accidents, illness, injury, theft, loss of personal belongings, natural disasters, delays, cancellations, or any third-party negligence during travel.
56. Subscribers are solely responsible for complying with local laws, regulations, and authorities during their travels.`
    },
    {
      id: 'K',
      title: 'K. Marketing & Publicity Rights',
      content: `57. Winners and participants grant Beduin Tour & Travels the right to use their names, photographs, videos, testimonials, and tour experiences for promotional, marketing, and advertising purposes.
58. By purchasing a subscription, the subscriber provides consent for such usage without any additional compensation.`
    },
    {
      id: 'L',
      title: 'L. Legal & Compliance',
      content: `59. The Beduin Travel Reward Program is a promotional membership benefit program and shall not be considered a lottery, gambling, betting, or wagering activity.
60. The Company reserves the right to amend, modify, suspend, or update these Terms & Conditions at any time without prior notice.
61. Any dispute arising from the subscription program shall be subject to the exclusive jurisdiction of the courts of Nadia, West Bengal, India.
62. By purchasing and activating a subscription, the subscriber confirms that they have read, understood, and agreed to all the Terms & Conditions mentioned above.`
    }
  ];

  return (
    <section id="terms" className="relative py-14 lg:py-20 overflow-hidden">
      <div className="max-w-4xl mx-auto px-5 relative z-10">
        <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-gold font-semibold mb-4">
              <div className="w-8 h-px bg-neon-gold" /> Legal & Policy <div className="w-8 h-px bg-neon-gold" />
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white leading-tight">
              Terms & Conditions
            </h2>
            <p className="mt-4 text-slate-400 text-sm max-w-2xl mx-auto font-mono">
              "Choose Your Plan. Try Your Luck. Travel Beyond Limits."
            </p>
          </div>
        </Reveal>

        {/* Recommended Legal Review Alert */}
        <Reveal>
          <div className="mb-8 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm flex items-start gap-3">
            <Shield className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Important Notice:</span> Please read the Beduin Tour & Travels Subscription Membership Terms & Conditions carefully.
            </div>
          </div>
        </Reveal>

        {/* Terms List - Direct display without accordion */}
        <div className="space-y-6">
          {sections.map((sec, index) => {
            return (
              <Reveal key={sec.id} delay={index * 0.05}>
                <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 text-left space-y-3 hover:border-amber-500/20 transition-colors">
                  <h3 className="font-display font-bold text-base text-white border-b border-white/10 pb-2">
                    {sec.title}
                  </h3>
                  <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line pt-1">
                    {sec.content}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Subject to policy banner */}
        <Reveal>
          <div className="mt-8 text-center text-xs text-slate-500 leading-relaxed font-mono">
            * Official Disclaimer: Beduin Tour & Travels reserves the right to modify tour destinations, schedules, benefits, offers, and operational policies whenever necessary for business, operational, safety, legal, or logistical reasons. All decisions taken by the Company in such matters shall be considered final and binding.
            <br />
            <span className="mt-2 block font-bold text-[#0096C7] text-sm font-display">"Safar Jo Yaad Rahe."</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

