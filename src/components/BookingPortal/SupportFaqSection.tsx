import React, { useState } from 'react';
import { FAQ_ITEMS } from '../../data/tours';
import { HelpCircle, ChevronDown, ChevronUp, PhoneCall, Mail, MessageSquare, Send, CheckCircle2, Sparkles } from 'lucide-react';

export const SupportFaqSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All Categories');
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([0, 2]);

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactQuery, setContactQuery] = useState('');
  const [querySent, setQuerySent] = useState(false);

  const categories = ['All Categories', 'Booking & Vouchers', 'Tours & Itinerary', 'Pickup & Logistics', 'Cancellations & Refunds'];

  const filteredFaqs = activeCategory === 'All Categories'
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter(f => f.category === activeCategory);

  const toggleFaq = (index: number) => {
    if (expandedIndexes.includes(index)) {
      setExpandedIndexes(expandedIndexes.filter(i => i !== index));
    } else {
      setExpandedIndexes([...expandedIndexes, index]);
    }
  };

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail.trim() || !contactQuery.trim()) return;

    setQuerySent(true);
    setContactName('');
    setContactEmail('');
    setContactQuery('');
    setTimeout(() => {
      setQuerySent(false);
    }, 6000);
  };

  return (
    <section id="step-11" className="py-20 scroll-mt-24 border-t border-slate-200/80 text-left max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-4 mb-12">
        <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-amber-600">
          <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs">11</span>
          <span>Traveler Help Center</span>
        </div>
        <h2 className="font-serif-premium text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Support & Frequently Asked Questions
        </h2>
        <p className="text-slate-600 text-base max-w-2xl">
          Everything you need to know about our premium paid guided tours, promotional voucher codes, private airport pickups, and 100% refund warranties.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Interactive FAQ Accordion */}
        <div className="lg:col-span-7 space-y-8">
          {/* FAQ Filter pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-amber-400 shadow-lg scale-105'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => {
              const isExpanded = expandedIndexes.includes(index);

              return (
                <div
                  key={index}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 text-left flex items-start justify-between hover:bg-slate-50/80 transition-colors focus:outline-none cursor-pointer"
                  >
                    <div className="flex items-start space-x-3 pr-4">
                      <HelpCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] uppercase font-extrabold text-amber-600 tracking-wider block mb-1">{faq.category}</span>
                        <h4 className="font-serif-premium text-base sm:text-lg font-bold text-slate-900">{faq.question}</h4>
                      </div>
                    </div>

                    <div className="p-2 rounded-full bg-slate-100 text-slate-600 shrink-0 mt-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 animate-fadeIn text-slate-600 text-sm leading-relaxed pr-8">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Contact Support Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-800 space-y-8 h-fit">
          <div className="space-y-3">
            <span className="bg-amber-500/20 text-amber-400 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Live Support Concierge
            </span>
            <h3 className="font-serif-premium text-2xl sm:text-3xl font-black">
              Need Personal Assistance Before Or After Booking?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              BEDUINE travel specialists are available for package questions, voucher checks, pickup timing, and payment support.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <a
              href="tel:+918768903565"
              className="p-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 transition-colors border border-amber-500/30 flex items-center space-x-4 group cursor-pointer"
            >
              <div className="p-3 rounded-xl bg-amber-500 text-slate-950 group-hover:scale-110 transition-transform">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">BEDUINE Phone Support</span>
                <span className="text-lg font-bold text-white tracking-wide">+91 87689 03565</span>
              </div>
            </a>

            <a
              href="mailto:support@beduine.in"
              className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-700 flex items-center space-x-4 cursor-pointer"
            >
              <div className="p-3 rounded-xl bg-slate-700 text-amber-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Booking Email</span>
                <span className="text-sm font-semibold text-white">support@beduine.in</span>
              </div>
            </a>
          </div>

          {/* Quick Query Form */}
          <div className="pt-6 border-t border-slate-800 space-y-4">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Send An Instant Digital Query</span>
            </h4>

            {querySent ? (
              <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center space-y-2 animate-fadeIn">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <span className="font-bold text-sm block">Message Successfully Transmitted!</span>
                <span className="text-xs text-slate-300 block">A dedicated travel specialist will reply to your email within 15 minutes.</span>
              </div>
            ) : (
              <form onSubmit={handleSendQuery} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-slate-800/80 py-3 px-4 rounded-xl border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    required
                    placeholder="Your Email Address *"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-slate-800/80 py-3 px-4 rounded-xl border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <textarea
                    rows={3}
                    required
                    placeholder="How can our VIP Concierge assist you? *"
                    value={contactQuery}
                    onChange={(e) => setContactQuery(e.target.value)}
                    className="w-full bg-slate-800/80 py-3 px-4 rounded-xl border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 text-white placeholder-slate-400 leading-relaxed"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-slate-950 font-black text-sm transition-opacity flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Query</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
