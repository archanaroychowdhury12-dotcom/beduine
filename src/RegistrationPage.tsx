import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calendar, User, Phone, Mail, MapPin, 
  Check, ChevronRight, Crown, Printer, 
  ShieldCheck, Users, Award, Star
} from 'lucide-react';

interface RegistrationPageProps {
  initialPlanName: string;
  onBack: () => void;
}

const ALL_PLANS = [
  {
    id: 'Silver',
    name: 'Silver Domestic',
    price: '₹499',
    type: 'domestic',
    color: 'from-slate-400 via-slate-500 to-slate-700',
    glow: 'rgba(148, 163, 184, 0.4)',
    icon: Star,
    benefits: [
      '1 Weekly Lucky Draw entry',
      'Winner tour value up to ₹3,000 (2N/3D)',
      '1 x ₹500 discount credit if not selected',
      'Up to 5% off on other paid tours',
      'Travel insurance – Payable',
      'Name change – Not available'
    ]
  },
  {
    id: 'Gold',
    name: 'Gold Domestic',
    price: '₹799',
    type: 'domestic',
    color: 'from-teal-400 via-emerald-500 to-emerald-600',
    glow: 'rgba(16, 185, 129, 0.4)',
    icon: Award,
    benefits: [
      '1 Weekly Lucky Draw entry',
      'Winner tour value up to ₹5,000 (2N/3D)',
      '2 x ₹500 discount credits (₹1,000 value)',
      'Up to 7% off on other paid tours',
      'Travel insurance – 50% off',
      'Name change – One time allowed'
    ]
  },
  {
    id: 'Platinum',
    name: 'Platinum Domestic',
    price: '₹1,499',
    type: 'domestic',
    color: 'from-amber-400 via-yellow-500 to-amber-600',
    glow: 'rgba(245, 158, 11, 0.4)',
    icon: Crown,
    benefits: [
      '1 Weekly Lucky Draw entry',
      'Winner tour value up to ₹10,000 (3N/4D)',
      '4 x ₹500 discount credits (₹2,000 value)',
      'Up to 10% off on other paid tours',
      'Travel insurance – Free',
      'Name change – Two times allowed'
    ]
  },
  {
    id: 'Silver_Int',
    name: 'Silver International',
    price: '₹4,999',
    type: 'international',
    color: 'from-sky-400 via-blue-500 to-blue-600',
    glow: 'rgba(59, 130, 246, 0.4)',
    icon: Star,
    benefits: [
      '1 Monthly Lucky Draw entry',
      'Winner tour value up to ₹25,000 (3N/4D)',
      '5 x ₹500 discount credits (₹2,500 value)',
      'Up to 5% off on other paid tours',
      'Travel insurance – 50% off',
      'Name change – One time allowed',
      'Visa assistance included'
    ]
  },
  {
    id: 'Gold_Int',
    name: 'Gold International',
    price: '₹7,999',
    type: 'international',
    color: 'from-emerald-400 via-teal-500 to-emerald-600',
    glow: 'rgba(20, 184, 166, 0.4)',
    icon: Award,
    benefits: [
      '1 Monthly Lucky Draw entry',
      'Winner tour value up to ₹50,000 (4N/5D)',
      '8 x ₹500 discount credits (₹4,000 value)',
      'Up to 7% off on other paid tours',
      'Travel insurance – Free',
      'Name change – Two times allowed',
      'Visa assistance + Airport lounge access'
    ]
  },
  {
    id: 'Platinum_Int',
    name: 'Platinum International',
    price: '₹14,999',
    type: 'international',
    color: 'from-cyan-400 via-cyan-500 to-cyan-700',
    glow: 'rgba(6, 182, 212, 0.4)',
    icon: Crown,
    benefits: [
      '1 Monthly Lucky Draw entry',
      'Winner tour value up to ₹1,00,000 (5N/6D)',
      '15 x ₹500 discount credits (₹7,500 value)',
      'Up to 10% off on other paid tours',
      'Travel insurance – Free',
      'Name change – Unlimited allowed',
      'Full visa processing + lounge access',
      'Dedicated travel concierge'
    ]
  }
];

export default function RegistrationPage({ initialPlanName, onBack }: RegistrationPageProps) {
  const [step, setStep] = useState(1);
  const [selectedPlanId, setSelectedPlanId] = useState(() => {
    const matched = ALL_PLANS.find(p => {
      if (p.id.toLowerCase() === initialPlanName.toLowerCase()) return true;
      if (p.name.toLowerCase() === initialPlanName.toLowerCase()) return true;
      return false;
    });
    return matched ? matched.id : 'Silver';
  });

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    dob: '',
    gender: 'Male',
    city: '',
    pincode: '',
    address: '',
    nomineeName: '',
    nomineeRelation: '',
    is18Plus: false,
    agreeTerms: false
  });

  const [receipt, setReceipt] = useState<any | null>(null);

  const selectedPlan = useMemo(() => {
    return ALL_PLANS.find(p => p.id === selectedPlanId) || ALL_PLANS[0];
  }, [selectedPlanId]);

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.mobile || !formData.email || !formData.dob) {
        alert("Please fill in all personal details.");
        return;
      }
      // Dob verification for 18+
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        alert("Oops! You must be 18 years or older to register for a membership.");
        return;
      }
    } else if (step === 2) {
      if (!formData.city || !formData.pincode || !formData.address || !formData.nomineeName || !formData.nomineeRelation) {
        alert("Please fill in all address and nominee details.");
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.is18Plus || !formData.agreeTerms) {
      alert("Please confirm you are 18+ and agree to the Terms & Conditions.");
      return;
    }

    const uniqueId = `BDN-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`;
    const submissionDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const newReceipt = {
      memberId: uniqueId,
      date: submissionDate,
      ...formData,
      planName: selectedPlan.name,
      planPrice: selectedPlan.price,
      planType: selectedPlan.type,
      color: selectedPlan.color,
      glow: selectedPlan.glow,
      drawToken: `LDC-${Math.floor(100000 + Math.random() * 900000)}`
    };

    setReceipt(newReceipt);
  };

  const handleWhatsAppRedirect = () => {
    if (!receipt) return;
    const text = `*BEDUINE MEMBERSHIP REGISTRATION*
---------------------------------------
*Member ID:* ${receipt.memberId}
*Plan Chosen:* ${receipt.planName} (${receipt.planPrice})
*Registration Date:* ${receipt.date}
*Lucky Draw Token:* ${receipt.drawToken}

*MEMBER DETAILS:*
- *Name:* ${receipt.fullName}
- *Phone:* ${receipt.mobile}
- *Email:* ${receipt.email}
- *DOB:* ${receipt.dob}
- *Gender:* ${receipt.gender}
- *Location:* ${receipt.city} (PIN: ${receipt.pincode})
- *Address:* ${receipt.address}

*NOMINEE DETAILS:*
- *Nominee Name:* ${receipt.nomineeName}
- *Relationship:* ${receipt.nomineeRelation}

_I confirm my registration and age eligibility (18+). Please guide me on payment method to activate my subscription._`;

    const whatsappUrl = `https://wa.me/918768903565?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const PlanIcon = selectedPlan.icon;

  if (receipt) {
    return (
      <section className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col items-center justify-center bg-cosmos">
        {/* Decorative Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full filter blur-[120px] pointer-events-none opacity-20" style={{ background: selectedPlan.glow }} />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full filter blur-[120px] pointer-events-none opacity-25" style={{ background: selectedPlan.glow }} />

        <div className="max-w-3xl w-full z-10 text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-[#00F5D4]">
              <Check className="w-8 h-8" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-ink tracking-tight mb-2 uppercase">
              Registration Successful!
            </h1>
            <p className="text-sm text-ink/70 max-w-md mx-auto">
              Your digital boarding pass has been generated. Please screenshot or download it, then click below to finalize onboarding via WhatsApp.
            </p>
          </motion.div>
        </div>

        {/* Boarding Pass Ticket Container */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: 'spring', stiffness: 80 }}
          className="max-w-3xl w-full z-10 bg-[#081F2E]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative print:border-black print:bg-white print:text-black"
        >
          {/* Perforated side cutouts (Boarding pass style) */}
          <div className="hidden md:block absolute left-[-15px] top-1/2 -translate-y-1/2 w-[30px] h-[30px] rounded-full bg-cosmos border-r border-white/10 z-20 print:hidden" />
          <div className="hidden md:block absolute right-[-15px] top-1/2 -translate-y-1/2 w-[30px] h-[30px] rounded-full bg-cosmos border-l border-white/10 z-20 print:hidden" />

          {/* Glowing Top Edge */}
          <div className={`h-2.5 w-full bg-gradient-to-r ${receipt.color}`} />

          {/* Ticket Body Layout */}
          <div className="p-6 sm:p-8 md:grid md:grid-cols-12 gap-0 relative">
            
            {/* Main Part (Left/Center) */}
            <div className="md:col-span-8 pb-6 md:pb-0 md:pr-8 md:border-r md:border-dashed md:border-white/10 print:border-black">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <img src="/images/bedune_logo_cropped.png" alt="Logo" className="w-8 h-8 object-contain rounded-full border border-white/10" />
                    <div>
                      <h3 className="font-display font-black text-sm tracking-tight text-ink uppercase">BEDUINE</h3>
                      <p className="text-[7px] uppercase tracking-[0.25em] text-cyan-400 font-bold font-mono">Tour & Travels</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-gradient-to-r ${receipt.color} text-cosmos shadow-lg`}>
                    <Crown className="w-3 h-3" /> {receipt.planName}
                  </span>
                </div>
              </div>

              {/* Grid Data */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-4 mb-6">
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-ink/40 font-mono">Member Name</span>
                  <span className="text-sm font-bold text-ink truncate block">{receipt.fullName}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-ink/40 font-mono">Member ID</span>
                  <span className="text-sm font-bold text-[#00F5D4] font-mono tracking-wider block">{receipt.memberId}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-ink/40 font-mono">Mobile Number</span>
                  <span className="text-sm font-semibold text-ink/90 block">{receipt.mobile}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-ink/40 font-mono">Registration Date</span>
                  <span className="text-sm font-semibold text-ink/90 block">{receipt.date}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-ink/40 font-mono">Email Address</span>
                  <span className="text-xs font-semibold text-ink/80 truncate block">{receipt.email}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-ink/40 font-mono">City / Location</span>
                  <span className="text-sm font-semibold text-ink/90 block">{receipt.city}</span>
                </div>
              </div>

              {/* Nominee section */}
              <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between print:border-black">
                <div>
                  <span className="block text-[8px] uppercase tracking-wider text-ink/40 font-mono">Nominee Beneficiary</span>
                  <span className="text-xs font-bold text-ink">{receipt.nomineeName}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[8px] uppercase tracking-wider text-ink/40 font-mono">Relationship</span>
                  <span className="text-[10px] font-semibold text-[#00F5D4] font-mono bg-cyan-400/10 px-2 py-0.5 rounded">{receipt.nomineeRelation}</span>
                </div>
              </div>
            </div>

            {/* Stub Part (Right/Stub) */}
            <div className="md:col-span-4 pt-6 md:pt-0 md:pl-8 flex flex-col justify-between items-center text-center">
              <div className="w-full">
                <span className="block text-[9px] uppercase tracking-wider text-ink/40 font-mono mb-2">Draw Entry Token</span>
                <div className="py-2.5 px-4 bg-white/5 border border-white/10 rounded-xl inline-block font-mono text-sm font-bold tracking-widest text-[#00F5D4] border-dashed shadow-inner">
                  {receipt.drawToken}
                </div>
                <div className="text-[9px] text-amber-400 mt-2 font-semibold">
                  ★ Weekly Sunday Draw Active ★
                </div>
              </div>

              {/* Barcode representation */}
              <div className="my-6 md:my-0 flex flex-col items-center justify-center w-full">
                <div className="h-10 w-full max-w-[160px] bg-ink/90 p-1 rounded-sm flex items-center justify-between gap-[2px] overflow-hidden opacity-85 print:bg-black">
                  {Array.from({ length: 26 }).map((_, i) => {
                    const width = i % 3 === 0 ? 'w-1.5' : i % 2 === 0 ? 'w-[1px]' : 'w-0.5';
                    return <div key={i} className={`h-full bg-cosmos ${width} shrink-0 print:bg-white`} />;
                  })}
                </div>
                <span className="text-[7px] font-mono text-ink/30 tracking-[0.2em] mt-1">{receipt.memberId}</span>
              </div>

              <div className="w-full text-center md:text-right">
                <span className="block text-[8px] uppercase tracking-wider text-ink/40 font-mono">Subscription Rate</span>
                <span className="text-2xl font-black text-ink font-display">{receipt.planPrice}</span>
                <span className="block text-[8px] text-[#00F5D4] uppercase font-mono tracking-widest">Deposit Pending</span>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Receipt Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 z-10 w-full max-w-md">
          <button
            onClick={handleWhatsAppRedirect}
            className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-cosmos font-bold rounded-full shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-all text-sm uppercase tracking-wider cursor-pointer border-none flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" /> Send details to WhatsApp
          </button>
          
          <div className="flex gap-4">
            <button
              onClick={handlePrint}
              className="px-5 py-4 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-ink text-sm font-semibold flex items-center justify-center gap-1.5 hover:-translate-y-0.5 transition-all cursor-pointer"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
            
            <button
              onClick={onBack}
              className="px-6 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold flex items-center justify-center gap-1.5 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-cosmos">
      {/* Dynamic atmospheric background based on selected plan */}
      <div 
        className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full filter blur-[150px] pointer-events-none opacity-20 transition-all duration-700" 
        style={{ background: selectedPlan.glow }} 
      />
      <div 
        className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full filter blur-[120px] pointer-events-none opacity-15 transition-all duration-700" 
        style={{ background: selectedPlan.glow }} 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Back Link */}
        <div className="mb-8">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#7E919D] hover:text-[#18D7F2] transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Side: Multi-Step Registration Form */}
          <div className="lg:col-span-8">
            <div className="glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
              
              {/* Progress Bar */}
              <div className="bg-[#051520]/50 border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold font-mono text-cyan-400">STEP {step} OF 3</span>
                  <h3 className="text-sm font-bold text-ink uppercase tracking-wide">
                    {step === 1 ? 'Personal Info' : step === 2 ? 'Nominee & Location' : 'Confirm Registration'}
                  </h3>
                </div>
                <div className="flex gap-1.5">
                  <div className={`w-8 h-1 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-cyan-400' : 'bg-white/10'}`} />
                  <div className={`w-8 h-1 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-cyan-400' : 'bg-white/10'}`} />
                  <div className={`w-8 h-1 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-cyan-400' : 'bg-white/10'}`} />
                </div>
              </div>

              {/* Form container */}
              <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-6">
                
                {/* STEP 1: Personal Info */}
                {step === 1 && (
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }} 
                    className="space-y-5"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-ink">Tell us about yourself</h2>
                      <p className="text-xs text-ink/50 mt-1">Please enter your legal name and contact details exactly as on your Government ID.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-ink/60 font-semibold mb-2" htmlFor="fullName">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
                          <input 
                            type="text" 
                            id="fullName" 
                            required
                            placeholder="e.g. Ananya Das"
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#051520]/60 border border-white/10 text-ink text-sm outline-none focus:border-cyan-400 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-ink/60 font-semibold mb-2" htmlFor="mobileNumber">Mobile Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
                          <input 
                            type="tel" 
                            id="mobileNumber" 
                            required
                            placeholder="e.g. +91 98765 43210"
                            value={formData.mobile}
                            onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#051520]/60 border border-white/10 text-ink text-sm outline-none focus:border-cyan-400 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-ink/60 font-semibold mb-2" htmlFor="emailAddress">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
                          <input 
                            type="email" 
                            id="emailAddress" 
                            required
                            placeholder="e.g. ananya@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#051520]/60 border border-white/10 text-ink text-sm outline-none focus:border-cyan-400 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-ink/60 font-semibold mb-2" htmlFor="dob">Date of Birth</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
                            <input 
                              type="date" 
                              id="dob" 
                              required
                              value={formData.dob}
                              onChange={(e) => setFormData({...formData, dob: e.target.value})}
                              className="w-full pl-9 pr-2 py-3.5 rounded-xl bg-[#051520]/60 border border-white/10 text-ink text-xs outline-none focus:border-cyan-400 transition-colors"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-ink/60 font-semibold mb-2" htmlFor="gender">Gender</label>
                          <select 
                            id="gender" 
                            value={formData.gender}
                            onChange={(e) => setFormData({...formData, gender: e.target.value})}
                            className="w-full px-3 py-3.5 rounded-xl bg-[#051520]/60 border border-white/10 text-ink text-xs outline-none focus:border-cyan-400 transition-colors"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Address & Nominee Info */}
                {step === 2 && (
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }} 
                    className="space-y-5"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-ink">Nominee & Location Details</h2>
                      <p className="text-xs text-ink/50 mt-1">Nominee information is mandatory to securely assign lucky draw claim rights.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-ink/60 font-semibold mb-2" htmlFor="nomineeName">Nominee Full Name</label>
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
                          <input 
                            type="text" 
                            id="nomineeName" 
                            required
                            placeholder="e.g. Subir Das"
                            value={formData.nomineeName}
                            onChange={(e) => setFormData({...formData, nomineeName: e.target.value})}
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#051520]/60 border border-white/10 text-ink text-sm outline-none focus:border-cyan-400 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-ink/60 font-semibold mb-2" htmlFor="nomineeRelation">Relationship with Nominee</label>
                        <select 
                          id="nomineeRelation" 
                          value={formData.nomineeRelation}
                          onChange={(e) => setFormData({...formData, nomineeRelation: e.target.value})}
                          className="w-full px-4 py-3.5 rounded-xl bg-[#051520]/60 border border-white/10 text-ink text-sm outline-none focus:border-cyan-400 transition-colors"
                          required
                        >
                          <option value="">Select Relationship</option>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Brother">Brother</option>
                          <option value="Sister">Sister</option>
                          <option value="Son">Son</option>
                          <option value="Daughter">Daughter</option>
                          <option value="Friend/Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-5">
                      <div className="sm:col-span-2">
                        <label className="block text-xs uppercase tracking-wider text-ink/60 font-semibold mb-2" htmlFor="city">City / Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
                          <input 
                            type="text" 
                            id="city" 
                            required
                            placeholder="e.g. Kolkata, Fulia, Nadia"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#051520]/60 border border-white/10 text-ink text-sm outline-none focus:border-cyan-400 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-ink/60 font-semibold mb-2" htmlFor="pincode">Pin Code</label>
                        <input 
                          type="text" 
                          id="pincode" 
                          required
                          placeholder="e.g. 741402"
                          maxLength={6}
                          value={formData.pincode}
                          onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                          className="w-full px-4 py-3.5 rounded-xl bg-[#051520]/60 border border-white/10 text-ink text-sm outline-none focus:border-cyan-400 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-ink/60 font-semibold mb-2" htmlFor="address">Full Mailing Address</label>
                      <textarea 
                        id="address" 
                        required
                        rows={3}
                        placeholder="House Number, Street Name, Landmark..."
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-[#051520]/60 border border-white/10 text-ink text-sm outline-none focus:border-cyan-400 transition-colors resize-none"
                      />
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Confirm Plan & Terms */}
                {step === 3 && (
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }} 
                    className="space-y-5"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-ink">Confirm Plan & Sign Membership</h2>
                      <p className="text-xs text-ink/50 mt-1">Review your plan tier and accept Beduine's registration rules.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-ink/60 font-semibold mb-2" htmlFor="planSelection">Plan Tier</label>
                        <select 
                          id="planSelection" 
                          value={selectedPlanId}
                          onChange={(e) => setSelectedPlanId(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl bg-[#051520]/60 border border-white/10 text-ink text-sm outline-none focus:border-cyan-400 transition-colors font-semibold"
                        >
                          <option value="Silver">Silver Plan (Domestic) - ₹499</option>
                          <option value="Gold">Gold Plan (Domestic) - ₹799</option>
                          <option value="Platinum">Platinum Plan (Domestic) - ₹1,499</option>
                          <option value="Silver_Int">Silver Plan (International) - ₹4,999</option>
                          <option value="Gold_Int">Gold Plan (International) - ₹7,999</option>
                          <option value="Platinum_Int">Platinum Plan (International) - ₹14,999</option>
                        </select>
                      </div>

                      <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-center">
                        <span className="block text-[10px] uppercase font-mono text-ink/40 tracking-wider">Subscription Amount Due</span>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="text-2xl font-black text-[#00F5D4]">{selectedPlan.price}</span>
                          <span className="text-xs text-ink/50">/ Year</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-white/5">
                      <label className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-ink/75">
                        <input 
                          type="checkbox" 
                          checked={formData.is18Plus}
                          onChange={(e) => setFormData({...formData, is18Plus: e.target.checked})}
                          className="mt-1 accent-cyan-400 w-4.5 h-4.5 shrink-0"
                          required
                        />
                        <span>I confirm that I am **18 years of age or older** and possess a valid government identification document (e.g. Aadhaar, Passport).</span>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-ink/75">
                        <input 
                          type="checkbox" 
                          checked={formData.agreeTerms}
                          onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
                          className="mt-1 accent-cyan-400 w-4.5 h-4.5 shrink-0"
                          required
                        />
                        <span>I agree to the Terms & Conditions and understand that travel subscriptions are non-refundable and include guaranteed credits.</span>
                      </label>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="pt-6 border-t border-white/5 flex items-center justify-between gap-4">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-6 py-3 rounded-full border border-white/10 hover:border-white/20 bg-white/5 text-ink text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-cosmos font-bold rounded-full text-xs uppercase tracking-wider flex items-center gap-1.5 hover:-translate-y-0.5 transition-all cursor-pointer shadow-lg shadow-cyan-500/10"
                    >
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-8 py-3.5 bg-gradient-to-r from-[#00A2FF] to-[#00D9FF] hover:from-[#0088D1] hover:to-[#00C2E6] text-white font-bold rounded-full text-xs uppercase tracking-wider flex items-center gap-1.5 hover:-translate-y-0.5 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
                    >
                      <ShieldCheck className="w-4.5 h-4.5" /> Confirm & Generate Digital Ticket
                    </button>
                  )}
                </div>

              </form>
            </div>
          </div>

          {/* Right Side: Sticky Plan Summary Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
              {/* Dynamic Glow Banner */}
              <div className={`p-6 bg-gradient-to-br ${selectedPlan.color} text-cosmos relative`}>
                <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-white/10 rounded-full filter blur-[40px] pointer-events-none" />
                <PlanIcon className="w-10 h-10 mb-2 opacity-85" />
                <h3 className="font-display font-black text-xl tracking-tight uppercase">{selectedPlan.name}</h3>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest opacity-75">{selectedPlan.type === 'domestic' ? '🇮🇳 Domestic Tier' : '🌐 International Tier'}</span>
              </div>

              {/* Benefits list */}
              <div className="p-6 space-y-5">
                <div className="flex justify-between items-baseline border-b border-white/5 pb-3">
                  <span className="text-xs text-ink/40 font-mono uppercase">Subscription Cost</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-ink">{selectedPlan.price}</span>
                    <span className="text-[10px] text-ink/50">/ Year</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="block text-[10px] uppercase font-mono text-ink/40 tracking-wider">Plan Benefits Included:</span>
                  <ul className="space-y-2.5">
                    {selectedPlan.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-ink/80">
                        <Check className="w-3.5 h-3.5 text-[#00F5D4] shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Additional Info Box */}
                <div className="p-3 bg-cyan-400/5 border border-cyan-400/10 rounded-xl">
                  <p className="text-[10px] text-[#00F5D4] leading-relaxed">
                    <strong>100% Value Recovery Floor:</strong> Subscription cost is converted into Discount Vouchers if not chosen in draws. No financial risk.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
