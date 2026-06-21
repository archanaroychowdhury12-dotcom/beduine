import React, { useState, useMemo, useEffect } from 'react';
import { WelcomeScreen } from '@/components/ui/onboarding-welcome-screen';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calendar, User, Phone, Mail, MapPin, 
  Check, ChevronRight, Crown, Printer, 
  ShieldCheck, Users, Award, Star
} from 'lucide-react';
import { supabase } from './utils/supabaseClient';

interface RegistrationPageProps {
  initialPlanName: string;
  onBack: () => void;
  prefilledData?: any;
  onRegisterSuccess?: (user: any) => void;
  currentUser?: any;
  onRedirectToLogin?: () => void;
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
      '1 weekly eligible entry during subscription',
      'Selected member tour benefit up to ₹3,000 (2N/3D)',
      '1 x 500-value Discount Credit issued once per subscription',
      'Up to 5% off on other paid tours',
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
      '1 weekly eligible entry during subscription',
      'Selected member tour benefit up to ₹5,000 (2N/3D)',
      '2 x 500-value Discount Credits issued once per subscription',
      'Up to 7% off on other paid tours',
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
      '1 weekly eligible entry during subscription',
      'Selected member tour benefit up to ₹10,000 (3N/4D)',
      '4 x 500-value Discount Credits issued once per subscription',
      'Up to 10% off on other paid tours',
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
      '1 weekly eligible entry during subscription',
      'Selected member tour benefit up to ₹25,000 (3N/4D)',
      '10 x 500-value Discount Credits issued once per subscription',
      'Up to 5% off on other paid tours',
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
      '1 weekly eligible entry during subscription',
      'Selected member tour benefit up to ₹50,000 (4N/5D)',
      '20 x 500-value Discount Credits issued once per subscription',
      'Up to 7% off on other paid tours',
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
      '1 weekly eligible entry during subscription',
      'Selected member tour benefit up to ₹1,00,000 (5N/6D)',
      '40 x 500-value Discount Credits issued once per subscription',
      'Up to 10% off on other paid tours',
      'Name change – Unlimited allowed',
      'Full visa processing + lounge access',
      'Dedicated travel concierge'
    ]
  }
];

export default function RegistrationPage({ initialPlanName, onBack, prefilledData, onRegisterSuccess, currentUser, onRedirectToLogin }: RegistrationPageProps) {
  const [showWelcome, setShowWelcome] = useState(false);
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
    fullName: prefilledData?.fullName || currentUser?.fullName || '',
    mobile: prefilledData?.mobile || currentUser?.mobile || '',
    email: prefilledData?.email || currentUser?.email || '',
    dob: '',
    gender: 'Male',
    city: prefilledData?.city || currentUser?.city || '',
    pincode: '',
    address: '',
    nomineeName: '',
    nomineeRelation: '',
    is18Plus: prefilledData?.is18Plus || false,
    agreeTerms: prefilledData?.agreeTerms || false
  });

  const [receipt, setReceipt] = useState<any | null>(null);

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        fullName: currentUser.fullName || prev.fullName,
        email: currentUser.email || prev.email,
      }));
    }
  }, [currentUser]);

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

  const handleFormSubmit = async (e: React.FormEvent) => {
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

    // Sign up via Supabase to create a real user session
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: 'beduine 123',
      options: {
        data: {
          full_name: formData.fullName,
          city: formData.city,
          planName: selectedPlan.name,
          planPrice: selectedPlan.price,
          planType: selectedPlan.type,
          dob: formData.dob,
          preferredLanguage: 'English',
          dietaryPreferences: 'None',
          accessibilityRequirements: 'None',
          savedTravelers: [],
          savedPickups: []
        }
      }
    });

    if (error) {
      alert(`Registration session creation failed: ${error.message}`);
    }

    setReceipt(newReceipt);
    if (onRegisterSuccess) {
      onRegisterSuccess(newReceipt);
    }
  };

  const handleWhatsAppRedirect = () => {
    if (!receipt) return;
    const text = `*BEDUINE MEMBERSHIP REGISTRATION*
---------------------------------------
*Member ID:* ${receipt.memberId}
*Plan Chosen:* ${receipt.planName} (${receipt.planPrice})
*Registration Date:* ${receipt.date}
*Weekly Entry Token:* ${receipt.drawToken}

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

  if (showWelcome) {
    return (
      <section className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col items-center justify-center bg-cosmos">
        {/* Travel Background Image (Clear) */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/travel_login_bg.jpg" 
            alt="Travel Background" 
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Decorative Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full filter blur-[120px] pointer-events-none opacity-20 bg-[#FF6B6B]/20 z-[1]" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full filter blur-[120px] pointer-events-none opacity-25 bg-[#8B5CF6]/15 z-[1]" />

        <div className="max-w-md w-full z-10 bg-white/85 backdrop-blur-2xl border border-white/50 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(30,49,71,0.18)] relative">
          <WelcomeScreen
            imageUrl="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=compress&cs=tinysrgb&w=800&q=80"
            title={
              <>
                Welcome to <span className="text-[#FF6B6B] font-black">Beduine</span>
              </>
            }
            description="Create your membership account to receive weekly eligible entry access, fixed travel Discount Credits, and curated destination benefits."
            buttonText="Create Your Account"
            onButtonClick={() => setShowWelcome(false)}
            secondaryActionText="Already have an account? Login Here"
            onSecondaryActionClick={onRedirectToLogin}
          />
        </div>
      </section>
    );
  }

  if (receipt) {
    return (
      <section className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col items-center justify-center bg-[#FFF8F6]">
        {/* Travel Background Image (Clear) */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/travel_login_bg.jpg" 
            alt="Travel Background" 
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full filter blur-[120px] pointer-events-none opacity-20 z-[1]" style={{ background: selectedPlan.glow }} />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full filter blur-[120px] pointer-events-none opacity-25 z-[1]" style={{ background: selectedPlan.glow }} />

        <div className="max-w-3xl w-full z-10 text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-400 backdrop-blur-sm">
              <Check className="w-8 h-8" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2 uppercase drop-shadow-md">
              Registration Successful!
            </h1>
            <p className="text-sm text-slate-200 max-w-md mx-auto font-medium drop-shadow-sm">
              Your digital boarding pass has been generated. Please screenshot or download it, then click below to finalize onboarding via WhatsApp.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: 'spring', stiffness: 80 }}
          className="max-w-3xl w-full z-10 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl relative print:border-black print:bg-white print:text-black"
        >
          <div className="hidden md:block absolute left-[-15px] top-1/2 -translate-y-1/2 w-[30px] h-[30px] rounded-full bg-[#0F1D2C] border-r border-slate-200 z-20 print:hidden" />
          <div className="hidden md:block absolute right-[-15px] top-1/2 -translate-y-1/2 w-[30px] h-[30px] rounded-full bg-[#0F1D2C] border-l border-slate-200 z-20 print:hidden" />

          <div className={`h-2.5 w-full bg-gradient-to-r ${receipt.color}`} />

          <div className="p-6 sm:p-8 md:grid md:grid-cols-12 gap-0 relative">
            <div className="md:col-span-8 pb-6 md:pb-0 md:pr-8 md:border-r md:border-dashed md:border-slate-200 print:border-black">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <img src="/images/bedune_logo_cropped.png" alt="Logo" className="w-8 h-8 object-contain rounded-full border border-slate-200" />
                    <div>
                      <h3 className="font-display font-black text-sm tracking-tight text-slate-800 uppercase">BEDUINE</h3>
                      <p className="text-[7px] uppercase tracking-[0.25em] text-[#FF6B6B] font-extrabold font-mono">Tour & Travels</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-[#FF6B6B] to-[#8B5CF6] text-white shadow-md">
                    <Crown className="w-3 h-3" /> {receipt.planName}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-4 mb-6">
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-mono font-bold">Member Name</span>
                  <span className="text-sm font-bold text-slate-800 truncate block">{receipt.fullName}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-mono font-bold">Member ID</span>
                  <span className="text-sm font-bold text-[#8B5CF6] font-mono tracking-wider block">{receipt.memberId}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-mono font-bold">Mobile Number</span>
                  <span className="text-sm font-bold text-slate-700 block">{receipt.mobile}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-mono font-bold">Registration Date</span>
                  <span className="text-sm font-bold text-slate-700 block">{receipt.date}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-mono font-bold">Email Address</span>
                  <span className="text-xs font-bold text-slate-600 truncate block">{receipt.email}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-mono font-bold">City / Location</span>
                  <span className="text-sm font-bold text-slate-700 block">{receipt.city}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between print:border-black">
                <div>
                  <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-mono font-bold">Nominee Beneficiary</span>
                  <span className="text-xs font-bold text-slate-800">{receipt.nomineeName}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-mono font-bold">Relationship</span>
                  <span className="text-[10px] font-bold text-[#FF6B6B] font-mono bg-rose-50 px-2 py-0.5 rounded border border-rose-100">{receipt.nomineeRelation}</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 pt-6 md:pt-0 md:pl-8 flex flex-col justify-between items-center text-center">
              <div className="w-full">
                <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-mono mb-2 font-bold">Weekly Entry Token</span>
                <div className="py-2.5 px-4 bg-rose-50/50 border border-dashed border-[#FF6B6B]/40 rounded-xl inline-block font-mono text-sm font-bold tracking-widest text-[#FF6B6B] shadow-inner">
                  {receipt.drawToken}
                </div>
                <div className="text-[9px] text-amber-500 mt-2 font-bold">
                  ★ Weekly Sunday Entry Active ★
                </div>
              </div>

              <div className="my-6 md:my-0 flex flex-col items-center justify-center w-full">
                <div className="h-10 w-full max-w-[160px] bg-slate-850 p-1.5 rounded-md flex items-center justify-between gap-[2px] overflow-hidden opacity-90 print:bg-black">
                  {Array.from({ length: 26 }).map((_, i) => {
                    const width = i % 3 === 0 ? 'w-1.5' : i % 2 === 0 ? 'w-[1px]' : 'w-0.5';
                    return <div key={i} className={`h-full bg-white ${width} shrink-0 print:bg-white`} />;
                  })}
                </div>
                <span className="text-[7px] font-mono text-slate-400 tracking-[0.2em] mt-1 font-bold">{receipt.memberId}</span>
              </div>

              <div className="w-full text-center md:text-right">
                <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-mono font-bold">Subscription Rate</span>
                <span className="text-2xl font-black text-slate-800 font-display">{receipt.planPrice}</span>
                <span className="block text-[8px] text-[#FF6B6B] uppercase font-mono tracking-widest font-bold">Deposit Pending</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 z-10 w-full max-w-md">
          <button
            onClick={handleWhatsAppRedirect}
            className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-full shadow-lg shadow-emerald-100 hover:-translate-y-0.5 transition-all text-sm uppercase tracking-wider cursor-pointer border-none flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" /> Send details to WhatsApp
          </button>
          
          <div className="flex gap-4">
            <button
              onClick={handlePrint}
              className="px-5 py-4 rounded-full border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 text-slate-600 text-sm font-semibold flex items-center justify-center gap-1.5 hover:-translate-y-0.5 transition-all cursor-pointer shadow-sm"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
            
            <button
              onClick={onBack}
              className="px-6 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold flex items-center justify-center gap-1.5 hover:-translate-y-0.5 transition-all cursor-pointer shadow-sm"
            >
              Back to Home
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#D7EDE4]">
      {/* Travel Background Image (Clear) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/travel_login_bg.jpg" 
          alt="Travel Background" 
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div 
        className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full filter blur-[150px] pointer-events-none opacity-25 transition-all duration-700 bg-[#FF6B6B]/20 z-[1]" 
      />
      <div 
        className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full filter blur-[120px] pointer-events-none opacity-20 transition-all duration-700 bg-[#8B5CF6]/15 z-[1]" 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-8">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#FFF] hover:text-[#FF6B6B] transition-colors bg-black/35 px-4 py-2 rounded-full border border-white/10 hover:border-white/20 cursor-pointer backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-8">
            <div
              className="backdrop-blur-xl border border-[#c8ddd6]/70 rounded-3xl overflow-hidden shadow-[0_28px_80px_rgba(8,47,73,0.30)] relative"
              style={{
                background: 'linear-gradient(135deg, rgba(216, 239, 230, 0.93) 0%, rgba(205, 228, 222, 0.91) 48%, rgba(207, 226, 241, 0.92) 100%)'
              }}
            >
              <div
                className="border-b border-[#bcd6d0]/70 px-6 py-4 flex items-center justify-between"
                style={{
                  background: 'linear-gradient(90deg, rgba(229, 246, 240, 0.88) 0%, rgba(218, 237, 246, 0.84) 100%)'
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold font-mono text-[#FF6B6B]">STEP {step} OF 3</span>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                    {step === 1 ? 'Personal Info' : step === 2 ? 'Nominee & Location' : 'Confirm Registration'}
                  </h3>
                </div>
                <div className="flex gap-1.5">
                  <div className={`w-8 h-1.5 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-gradient-to-r from-[#FF6B6B] to-[#8B5CF6]' : 'bg-slate-200'}`} />
                  <div className={`w-8 h-1.5 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-gradient-to-r from-[#FF6B6B] to-[#8B5CF6]' : 'bg-slate-200'}`} />
                  <div className={`w-8 h-1.5 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-gradient-to-r from-[#FF6B6B] to-[#8B5CF6]' : 'bg-slate-200'}`} />
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-6">
                {step === 1 && (
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }} 
                    className="space-y-5"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Tell us about yourself</h2>
                      <p className="text-xs text-slate-400 mt-1">Please enter your legal name and contact details exactly as on your Government ID.</p>
                    </div>

                    {currentUser ? (
                      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-slate-700 text-xs flex items-center gap-3 mb-2 shadow-sm">
                        <svg className="w-4 h-4 shrink-0 text-[#FF6B6B]" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M21.35 11.1c.86-.53 1.15-1.65.61-2.51-.53-.86-1.65-1.15-2.51-.61l-3.2 2c-.18.11-.3.3-.3.5v3.82l-3.2-2c-.86-.53-1.98-.24-2.51.61-.53.86-.24 1.98.61 2.51l3.2 2c.18.11.3.17.5.17.1 0 .2 0 .3-.05.17-.06.3-.18.35-.35l1-3.26 1 3.26c.05.17.18.29.35.35.1.05.2.05.3.05.2 0 .32-.06.5-.17l3.2-2c.86-.53 1.15-1.65.61-2.51-.53-.86-1.65-1.15-2.51-.61l-3.2 2v-3.82c0-.2-.12-.39-.3-.5l-3.2-2zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                          />
                        </svg>
                        <span>Google Session active: <strong className="font-mono text-slate-800">{currentUser.email}</strong>. Booking is linked to this account.</span>
                      </div>
                    ) : (
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-xs flex flex-col gap-3.5 mb-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B] animate-ping shrink-0" />
                          <span className="text-slate-500 text-xs font-semibold">Please sign in with Google/Gmail first to verify your travel account details.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (onRedirectToLogin) {
                              onRedirectToLogin();
                            }
                          }}
                          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.01] hover:brightness-110 cursor-pointer border-none shadow-sm"
                        >
                          Sign In / Log In with Google
                        </button>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2" htmlFor="fullName">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            id="fullName" 
                            required
                            readOnly={!!currentUser}
                            disabled={!currentUser}
                            placeholder="e.g. Ananya Das"
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50/70 border text-slate-850 text-sm outline-none transition-colors ${
                              !currentUser ? 'opacity-40 cursor-not-allowed border-slate-200' : currentUser ? 'border-[#FF6B6B]/20 opacity-70 select-none cursor-not-allowed bg-slate-100/50' : 'border-slate-200 focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/15'
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2" htmlFor="mobileNumber">Mobile Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="tel" 
                            id="mobileNumber" 
                            required
                            disabled={!currentUser}
                            placeholder="e.g. +91 98765 43210"
                            value={formData.mobile}
                            onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                            className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50/70 border text-slate-800 text-sm outline-none focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/15 transition-colors ${
                              !currentUser ? 'opacity-40 cursor-not-allowed border-slate-200' : 'border-slate-200'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2" htmlFor="emailAddress">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="email" 
                            id="emailAddress" 
                            required
                            readOnly={!!currentUser}
                            disabled={!currentUser}
                            placeholder="e.g. ananya@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50/70 border text-slate-850 text-sm outline-none transition-colors ${
                              !currentUser ? 'opacity-40 cursor-not-allowed border-slate-200' : currentUser ? 'border-[#FF6B6B]/20 opacity-70 select-none cursor-not-allowed bg-slate-100/50' : 'border-slate-200 focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/15'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2" htmlFor="dob">Date of Birth</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                              type="date" 
                              id="dob" 
                              required
                              disabled={!currentUser}
                              value={formData.dob}
                              onChange={(e) => setFormData({...formData, dob: e.target.value})}
                              className={`w-full pl-9 pr-2 py-3.5 rounded-xl bg-slate-50/70 border text-slate-800 text-xs outline-none focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/15 transition-colors ${
                                !currentUser ? 'opacity-40 cursor-not-allowed border-slate-200' : 'border-slate-200'
                              }`}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2" htmlFor="gender">Gender</label>
                          <select 
                            id="gender" 
                            disabled={!currentUser}
                            value={formData.gender}
                            onChange={(e) => setFormData({...formData, gender: e.target.value})}
                            className={`w-full px-3 py-3.5 rounded-xl bg-slate-50/70 border text-slate-800 text-xs outline-none focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/15 transition-colors ${
                              !currentUser ? 'opacity-40 cursor-not-allowed border-slate-200' : 'border-slate-200'
                            }`}
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

                {step === 2 && (
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }} 
                    className="space-y-5"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Nominee & Location Details</h2>
                      <p className="text-xs text-slate-400 mt-1">Nominee information is mandatory to securely assign selected-member benefit claim rights.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2" htmlFor="nomineeName">Nominee Full Name</label>
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            id="nomineeName" 
                            required
                            placeholder="e.g. Subir Das"
                            value={formData.nomineeName}
                            onChange={(e) => setFormData({...formData, nomineeName: e.target.value})}
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-800 text-sm outline-none focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/15 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2" htmlFor="nomineeRelation">Relationship with Nominee</label>
                        <select 
                          id="nomineeRelation" 
                          value={formData.nomineeRelation}
                          onChange={(e) => setFormData({...formData, nomineeRelation: e.target.value})}
                          className="w-full px-4 py-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-800 text-sm outline-none focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/15 transition-colors"
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
                        <label className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2" htmlFor="city">City / Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            id="city" 
                            required
                            placeholder="e.g. Kolkata, Fulia, Nadia"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-800 text-sm outline-none focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/15 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2" htmlFor="pincode">Pin Code</label>
                        <input 
                          type="text" 
                          id="pincode" 
                          required
                          placeholder="e.g. 741402"
                          maxLength={6}
                          value={formData.pincode}
                          onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                          className="w-full px-4 py-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-800 text-sm outline-none focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/15 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2" htmlFor="address">Full Mailing Address</label>
                      <textarea 
                        id="address" 
                        required
                        rows={3}
                        placeholder="House Number, Street Name, Landmark..."
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-800 text-sm outline-none focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/15 transition-colors resize-none"
                      />
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }} 
                    className="space-y-5"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Confirm Plan & Sign Membership</h2>
                      <p className="text-xs text-slate-400 mt-1">Review your plan tier and accept Beduine's registration rules.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2" htmlFor="planSelection">Plan Tier</label>
                        <select 
                          id="planSelection" 
                          value={selectedPlanId}
                          onChange={(e) => setSelectedPlanId(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-800 text-sm outline-none focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/15 transition-colors font-semibold"
                        >
                          <option value="Silver">Silver Plan (Domestic) - ₹499</option>
                          <option value="Gold" disabled>Gold Plan (Domestic) - ₹799 (Coming Soon)</option>
                          <option value="Platinum" disabled>Platinum Plan (Domestic) - ₹1,499 (Coming Soon)</option>
                          <option value="Silver_Int" disabled>Silver Plan (International) - ₹4,999 (Coming Soon)</option>
                          <option value="Gold_Int" disabled>Gold Plan (International) - ₹7,999 (Coming Soon)</option>
                          <option value="Platinum_Int" disabled>Platinum Plan (International) - ₹14,999 (Coming Soon)</option>
                        </select>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-center shadow-sm">
                        <span className="block text-[10px] uppercase font-mono text-slate-400 tracking-wider font-bold">Subscription Amount Due</span>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="text-2xl font-black text-[#FF6B6B]">{selectedPlan.price}</span>
                          <span className="text-xs text-slate-450 font-bold">/ Year</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-200">
                      <label className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-slate-600 font-medium">
                        <input 
                          type="checkbox" 
                          checked={formData.is18Plus}
                          onChange={(e) => setFormData({...formData, is18Plus: e.target.checked})}
                          className="mt-1 accent-[#FF6B6B] w-4.5 h-4.5 shrink-0"
                          required
                        />
                        <span>I confirm that I am **18 years of age or older** and possess a valid government identification document (e.g. Aadhaar, Passport).</span>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-slate-600 font-medium">
                        <input 
                          type="checkbox" 
                          checked={formData.agreeTerms}
                          onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
                          className="mt-1 accent-[#FF6B6B] w-4.5 h-4.5 shrink-0"
                          required
                        />
                        <span>I agree to the Terms & Conditions and understand that travel subscriptions are non-refundable and include guaranteed credits.</span>
                      </label>
                    </div>
                  </motion.div>
                )}

                <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-6 py-3 rounded-full border border-slate-200 hover:border-slate-300 bg-white text-slate-600 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
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
                      disabled={!currentUser && step === 1}
                      className={`px-6 py-3 font-bold rounded-full text-xs uppercase tracking-wider flex items-center gap-1.5 hover:-translate-y-0.5 transition-all cursor-pointer shadow-lg ${
                        !currentUser && step === 1 
                          ? 'opacity-40 cursor-not-allowed bg-slate-100 border border-slate-200 text-slate-450 hover:translate-y-0 shadow-none'
                          : 'bg-gradient-to-r from-[#FF6B6B] to-[#8B5CF6] hover:from-[#FF8E53] hover:to-[#8B5CF6] text-white shadow-rose-200/40'
                      }`}
                    >
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-8 py-3.5 bg-gradient-to-r from-[#FF6B6B] to-[#8B5CF6] hover:from-[#FF8E53] hover:to-[#8B5CF6] text-white font-bold rounded-full text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-200/40"
                    >
                      <ShieldCheck className="w-4.5 h-4.5" /> Confirm & Generate Digital Ticket
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div
              className="backdrop-blur-xl border border-[#c8ddd6]/70 rounded-3xl overflow-hidden shadow-[0_28px_80px_rgba(8,47,73,0.30)] relative"
              style={{
                background: 'linear-gradient(135deg, rgba(216, 239, 230, 0.92) 0%, rgba(204, 226, 219, 0.9) 52%, rgba(207, 226, 241, 0.91) 100%)'
              }}
            >
              <div className={`p-6 bg-gradient-to-br ${selectedPlan.color} text-white relative`}>
                <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-white/10 rounded-full filter blur-[40px] pointer-events-none" />
                <PlanIcon className="w-10 h-10 mb-2 opacity-85" />
                <h3 className="font-display font-black text-xl tracking-tight uppercase">{selectedPlan.name}</h3>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest opacity-75">{selectedPlan.type === 'domestic' ? '🇮🇳 Domestic Tier' : '🌐 International Tier'}</span>
              </div>

              <div
                className="p-6 space-y-5"
                style={{
                  background: 'linear-gradient(180deg, rgba(221, 240, 232, 0.72) 0%, rgba(210, 226, 219, 0.76) 100%)'
                }}
              >
                <div className="flex justify-between items-baseline border-b border-slate-100 pb-3">
                  <span className="text-xs text-slate-400 font-mono uppercase font-bold">Subscription Cost</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-slate-800">{selectedPlan.price}</span>
                    <span className="text-[10px] text-slate-400 font-bold">/ Year</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="block text-[10px] uppercase font-mono text-slate-400 tracking-wider font-bold">Plan Benefits Included:</span>
                  <ul className="space-y-2.5">
                    {selectedPlan.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                        <Check className="w-3.5 h-3.5 text-[#FF6B6B] shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl">
                  <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                    <strong className="text-[#FF6B6B]">Value Protection Floor:</strong> Discount Credits are issued once per subscription and stay available for eligible paid tours.
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
