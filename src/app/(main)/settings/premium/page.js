'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Layers, 
  VolumeX, 
  Palette, 
  TrendingUp, 
  Zap, 
  ArrowRight, 
  ArrowLeft,
  X,
  QrCode,
  MessageSquare,
  Copy,
  Check
} from 'lucide-react';

export default function PremiumPerksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 1: Configure, 2: Payment/QR, 3: Success
  const [copied, setCopied] = useState(false);
  const [txnId, setTxnId] = useState('');

  // Cart selections
  const [selectSellerBundle, setSelectSellerBundle] = useState(false);
  const [selectExperienceBundle, setSelectExperienceBundle] = useState(false);

  // Prices
  const PRICES = {
    sellerBundle: 700,
    experienceBundle: 250,
  };

  const calculateTotal = () => {
    let total = 0;
    if (selectSellerBundle) total += PRICES.sellerBundle;
    if (selectExperienceBundle) total += PRICES.experienceBundle;
    return Number(total).toFixed(2);
  };

  const handleCopyContact = () => {
    navigator.clipboard.writeText('admin@universe-perks.edu');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setModalStep(1);
  };

  const handleNextStep = () => {
    if (modalStep === 1) {
      setModalStep(2);
    } else if (modalStep === 2) {
      setModalStep(3);
    }
  };

  const handlePrevStep = () => {
    if (modalStep === 2) {
      setModalStep(1);
    }
  };

  const resetSelections = () => {
    setSelectSellerBundle(false);
    setSelectExperienceBundle(false);
    setIsModalOpen(false);
    setModalStep(1);
    setTxnId('');
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-[#8A86A3]">
        <Link href="/settings" className="hover:text-[#6C5CE7] transition-colors">Settings</Link>
        <span>&rsaquo;</span>
        <span className="text-[#1E1B2E] font-medium">Premium Perks</span>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#6C5CE7] via-[#8C7AE6] to-[#A29BFE] p-8 md:p-12 text-white shadow-xl shadow-[#6c5ce725]">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl"></div>
        
        <div className="relative max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> UniVerse Premium
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            Supercharge Your Campus Experience
          </h1>
          <p className="text-white/90 text-base md:text-lg max-w-xl font-light">
            Stand out in the marketplace, customize your profile, remove annoying ads, and style your workspace. Choose individual items or grab our value bundles.
          </p>
          <div className="pt-2">
            <button 
              onClick={handleOpenModal}
              className="inline-flex items-center gap-2 bg-white text-[#6C5CE7] px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              Subscribe & Upgrade Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Section Title */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-[#1E1B2E]">Explore Available Perks</h2>
        <p className="text-sm text-[#8A86A3]">Choose individual enhancements or package bundles to unlock exclusive features.</p>
      </div>

      {/* Grid Layout of Perks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Separately Purchasable Perks */}
        <div className="border border-[#EEEDFB] rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEEDFB]">
              <h3 className="font-bold text-[#1E1B2E] flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#FDCB6E]" /> Individual Listings Perks
              </h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#FFF9E6] text-[#D8A000] font-semibold border border-[#FFEAA7]">
                one time
              </span>
            </div>
            
            <div className="space-y-4">
              {/* Featured Listings */}
              <div className="group flex gap-4 p-3 rounded-xl hover:bg-[#FAFAFC] transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#1E1B2E] text-sm">Featured Listings</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-semibold uppercase">Boost</span>
                  </div>
                  <p className="text-xs text-[#8A86A3] leading-relaxed">
                    Elevate your listings to the top of search results and category pages for maximum exposure.
                  </p>
                </div>
              </div>

              {/* Urgent Sale Badge */}
              <div className="group flex gap-4 p-3 rounded-xl hover:bg-[#FAFAFC] transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0 border border-red-100 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#1E1B2E] text-sm">Urgent Sale Badge</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-600 font-semibold uppercase">Badge</span>
                  </div>
                  <p className="text-xs text-[#8A86A3] leading-relaxed">
                    Attach an eye-catching "URGENT" tag to your item, showing prospective buyers you need to sell quickly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-[#EEEDFB] text-center text-xs font-semibold text-[#8A86A3]">
            Purchasable during item listing
          </div>
        </div>

        {/* Bundle 1: Seller Pro Bundle */}
        <div className="border border-[#EEEDFB] rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#6C5CE7]/5 rounded-bl-full pointer-events-none"></div>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEEDFB]">
              <h3 className="font-bold text-[#1E1B2E] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#6C5CE7]" /> Seller Pro Bundle
              </h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#EAE8FE] text-[#6C5CE7] font-semibold border border-[#D5D1FC]">
                Rs.700/mo Bundle
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#6C5CE7] mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-[#1E1B2E]">Verified Seller Badge</span>
                  <p className="text-[11px] text-[#8A86A3]">Unlock verification badge to guarantee trust & safety.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#6C5CE7] mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-[#1E1B2E]">More Listings Per Month</span>
                  <p className="text-[11px] text-[#8A86A3]">Post up to 50 active listings per month instead of 5.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#6C5CE7] mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-[#1E1B2E]">Business Profile Page</span>
                  <p className="text-[11px] text-[#8A86A3]">Establish a digital shopfront page for your campus brand.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-[#EEEDFB]">
            <button 
              onClick={() => {
                setSelectSellerBundle(true);
                handleOpenModal();
              }}
              className="w-full text-center py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-[#6C5CE7] hover:bg-[#5b4cc4] transition-colors cursor-pointer"
            >
              Get Seller Pro Bundle
            </button>
          </div>
        </div>

        {/* Bundle 2: Experience Plus Bundle */}
        <div className="border border-[#EEEDFB] rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between relative overflow-hidden md:col-span-2">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00CEC9]/5 rounded-bl-full pointer-events-none"></div>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEEDFB]">
              <h3 className="font-bold text-[#1E1B2E] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#00CEC9]" /> Experience Plus Bundle
              </h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#E0FBFB] text-[#009B98] font-semibold border border-[#BFFFFE]">
                Rs.250/mo Bundle
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl">
                <VolumeX className="w-5 h-5 text-[#00CEC9] shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-[#1E1B2E]">Ad-Free Experience</span>
                  <p className="text-[11px] text-[#8A86A3]">Remove all sponsor banner widgets and advertisement content across the platform.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl">
                <Palette className="w-5 h-5 text-[#00CEC9] shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-[#1E1B2E]">Custom App Themes</span>
                  <p className="text-[11px] text-[#8A86A3]">Unlock custom neon, glassmorphism, or clean dark mode interfaces in settings.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-[#EEEDFB]">
            <button 
              onClick={() => {
                setSelectExperienceBundle(true);
                handleOpenModal();
              }}
              className="w-full text-center py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-[#00CEC9] hover:bg-[#00b4b1] transition-colors cursor-pointer"
            >
              Get Experience Plus Bundle
            </button>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-[#FAFAFC] border border-[#EEEDFB] rounded-2xl p-5 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-[#8A86A3] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-[#1E1B2E]">Manual Activation Policy</h4>
          <p className="text-[11px] text-[#8A86A3] leading-relaxed">
            All premium features and bundles are requested online and approved/activated manually by the campus administrator. Please submit your username and receipt confirmation screenshot via the QR code portal.
          </p>
        </div>
      </div>

      {/* Subscription Checkout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#EEEDFB] flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-[#EEEDFB] flex items-center justify-between bg-[#FAFAFC]">
              <div>
                <h3 className="font-bold text-[#1E1B2E] flex items-center gap-1.5 text-base md:text-lg">
                  <Sparkles className="w-5 h-5 text-[#6C5CE7]" /> Subscribe to Premium
                </h3>
                <p className="text-[11px] text-[#8A86A3]">Step {modalStep} of 3</p>
              </div>
              <button 
                onClick={resetSelections}
                className="text-[#8A86A3] hover:text-[#1E1B2E] p-1.5 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* STEP 1: CONFIGURATION */}
              {modalStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-[#1E1B2E] uppercase tracking-wider mb-3">Select Premium Bundles</h4>
                    <div className="space-y-3">
                      {/* Seller Pro Bundle Choice */}
                      <label className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        selectSellerBundle ? 'border-[#6C5CE7] bg-[#F4F3FE]' : 'border-[#EEEDFB] hover:bg-[#FAFAFC]'
                      }`}>
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox"
                            checked={selectSellerBundle}
                            onChange={(e) => setSelectSellerBundle(e.target.checked)}
                            className="accent-[#6C5CE7] w-4.5 h-4.5"
                          />
                          <div>
                            <span className="text-xs font-semibold text-[#1E1B2E] block">Seller Pro Bundle</span>
                            <span className="text-[10px] text-[#8A86A3]">Verified seller badge, more listings & business profile page</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#6C5CE7]">Rs.{PRICES.sellerBundle}/mo</span>
                      </label>

                      {/* Experience Plus Bundle Choice */}
                      <label className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        selectExperienceBundle ? 'border-[#00CEC9] bg-[#E0FBFB]/30' : 'border-[#EEEDFB] hover:bg-[#FAFAFC]'
                      }`}>
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox"
                            checked={selectExperienceBundle}
                            onChange={(e) => setSelectExperienceBundle(e.target.checked)}
                            className="accent-[#00CEC9] w-4.5 h-4.5"
                          />
                          <div>
                            <span className="text-xs font-semibold text-[#1E1B2E] block">Experience Plus Bundle</span>
                            <span className="text-[10px] text-[#8A86A3]">Ad-free browsing and custom themes package</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#009B98]">Rs.{PRICES.experienceBundle}/mo</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: ADMIN PAYMENT & QR */}
              {modalStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-[#F8F9FD] border border-[#EEEDFB] p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] text-[#8A86A3] uppercase tracking-wider font-semibold">Total Invoice Amount</span>
                    <span className="text-3xl font-extrabold text-[#6C5CE7] mt-1">Rs.{calculateTotal()}</span>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-[#1E1B2E] text-center">Scan to Pay & Contact Admin for Activation</h4>
                    
                    {/* Stylized QR Code container */}
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="p-4 bg-white border-2 border-[#6C5CE7] rounded-3xl shadow-md flex flex-col items-center justify-center">
                        <div className="w-40 h-40 bg-gradient-to-tr from-[#FAFAFC] to-[#F4F3FE] rounded-2xl flex items-center justify-center border border-slate-100 shadow-inner">
                          <QrCode className="w-32 h-32 text-[#6C5CE7] stroke-[1.25]" />
                        </div>
                      </div>
                      <span className="text-[10px] text-[#8A86A3] font-medium uppercase tracking-wider">UniVerse Perks Admin Portal</span>
                    </div>

                    <div className="text-center space-y-1">
                      <p className="text-xs text-[#1E1B2E] font-medium">Or contact the administrator via email/chat:</p>
                      <button 
                        onClick={handleCopyContact}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#6C5CE7] hover:bg-slate-100 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        universe.app.pk@gmail.com
                        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-[#EEEDFB] pt-4 space-y-3">
                    <label className="block">
                      <span className="text-xs font-semibold text-[#1E1B2E] block mb-1.5">Enter Transaction reference or Username:</span>
                      <input 
                        type="text"
                        placeholder="e.g. TXN-1928374 or user_alex"
                        value={txnId}
                        onChange={(e) => setTxnId(e.target.value)}
                        className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#6C5CE7] transition-all bg-slate-50"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 3: SUCCESS FLOW */}
              {modalStep === 3 && (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center border border-green-200">
                    <Check className="w-8 h-8 text-green-500 stroke-[3]" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-[#1E1B2E]">Activation Request Sent!</h4>
                    <p className="text-xs text-[#8A86A3] max-w-sm mx-auto leading-relaxed">
                      Your request with reference <code className="bg-slate-100 px-1.5 py-0.5 rounded text-red-600 font-semibold">{txnId || 'N/A'}</code> has been submitted. The admin will verify and activate your perks manually shortly.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#EEEDFB] bg-[#FAFAFC] flex justify-between items-center">
              <div>
                {modalStep === 1 && (
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#8A86A3] uppercase">Total Cost</span>
                    <span className="text-sm font-bold text-[#1E1B2E]">Rs.{calculateTotal()}</span>
                  </div>
                )}
                {modalStep === 2 && (
                  <button 
                    onClick={handlePrevStep}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A86A3] hover:text-[#1E1B2E] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to config
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                {modalStep === 1 && (
                  <button 
                    onClick={handleNextStep}
                    disabled={parseFloat(calculateTotal()) === 0}
                    className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer ${
                      parseFloat(calculateTotal()) === 0
                        ? 'bg-slate-300 cursor-not-allowed'
                        : 'bg-[#6C5CE7] hover:bg-[#5b4cc4] active:scale-95 shadow-md shadow-[#6c5ce725]'
                    }`}
                  >
                    Next: Payment Info
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {modalStep === 2 && (
                  <button 
                    onClick={handleNextStep}
                    disabled={!txnId.trim()}
                    className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer ${
                      !txnId.trim()
                        ? 'bg-slate-300 cursor-not-allowed'
                        : 'bg-[#6C5CE7] hover:bg-[#5b4cc4] active:scale-95 shadow-md'
                    }`}
                  >
                    Submit Request
                  </button>
                )}

                {modalStep === 3 && (
                  <button 
                    onClick={resetSelections}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#6C5CE7] hover:bg-[#5b4cc4] active:scale-95 shadow-md cursor-pointer"
                  >
                    Done
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
