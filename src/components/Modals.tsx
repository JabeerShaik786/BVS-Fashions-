import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, User, Lock, Mail, HelpCircle, FileText, ShieldAlert, Package } from 'lucide-react';

export const Modals: React.FC = () => {
  const {
    isAccountModalOpen,
    setIsAccountModalOpen,
    activeInfoModal,
    setActiveInfoModal,
    showToast,
    setViewMode,
  } = useShop();

  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [trackingInput, setTrackingInput] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(
      'Account action received (Demo Mode: Backend authentication will be connected in next phase)',
      'info'
    );
    setIsAccountModalOpen(false);
  };

  const closeModal = () => {
    setIsAccountModalOpen(false);
    setActiveInfoModal(null);
  };

  return (
    <>
      {/* 1. Account Demo Modal */}
      {isAccountModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#EADBCA] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 bg-[#FAF6EE] border-b border-[#EADBCA] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#702C38] flex items-center justify-center text-[#D4B16A]">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#282522]">
                    BVS Customer Account
                  </h3>
                  <p className="text-[11px] text-[#74685E]">
                    Save your traditional favorites and family measurements
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-[#74685E] hover:text-[#282522] p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab switch */}
            <div className="flex border-b border-[#EADBCA]">
              <button
                onClick={() => setAuthTab('login')}
                className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-center transition-colors ${
                  authTab === 'login'
                    ? 'border-b-2 border-[#702C38] text-[#702C38] bg-[#FAF6EE]/50'
                    : 'text-[#74685E] hover:text-[#282522]'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthTab('register')}
                className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-center transition-colors ${
                  authTab === 'register'
                    ? 'border-b-2 border-[#702C38] text-[#702C38] bg-[#FAF6EE]/50'
                    : 'text-[#74685E] hover:text-[#282522]'
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#282522] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-[#FAF6EE]/40 border border-[#EADBCA] rounded-md px-3 py-2 text-sm text-[#282522] focus:outline-none focus:border-[#702C38]"
                  />
                  <Mail className="w-4 h-4 text-[#74685E] absolute right-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#282522] uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-[#FAF6EE]/40 border border-[#EADBCA] rounded-md px-3 py-2 text-sm text-[#282522] focus:outline-none focus:border-[#702C38]"
                  />
                  <Lock className="w-4 h-4 text-[#74685E] absolute right-3 top-2.5" />
                </div>
              </div>

              <div className="p-3 bg-[#FAF6EE] rounded-lg border border-[#EADBCA] text-[11px] text-[#74685E] flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-[#702C38] shrink-0 mt-0.5" />
                <span>
                  <strong>Demo Mode:</strong> No actual sign-in request is sent. Customer authentication and database security will be established in the backend phase.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#702C38] hover:bg-[#561E28] text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-all shadow-md"
              >
                {authTab === 'login' ? 'Sign In' : 'Create Free Account'}
              </button>
            </form>

            <div className="p-4 bg-[#FAF6EE] border-t border-[#EADBCA] text-center">
              <button
                onClick={() => {
                  setIsAccountModalOpen(false);
                  setViewMode('admin');
                }}
                className="text-xs font-semibold text-[#702C38] hover:underline"
              >
                Store Owner? Access Admin Management Portal →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Policy & FAQ Information Modals */}
      {activeInfoModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#EADBCA] relative max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 bg-[#FAF6EE] border-b border-[#EADBCA] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {activeInfoModal === 'faq' ? (
                  <HelpCircle className="w-5 h-5 text-[#702C38]" />
                ) : activeInfoModal === 'tracking' ? (
                  <Package className="w-5 h-5 text-[#702C38]" />
                ) : (
                  <FileText className="w-5 h-5 text-[#702C38]" />
                )}
                <h3 className="font-serif text-lg font-bold text-[#282522] capitalize">
                  {activeInfoModal === 'faq' && 'Frequently Asked Questions'}
                  {activeInfoModal === 'tracking' && 'Track Your Order'}
                  {activeInfoModal === 'shipping' && 'Shipping & Delivery Policy Placeholder'}
                  {activeInfoModal === 'returns' && 'Returns & Exchange Policy Placeholder'}
                  {activeInfoModal === 'privacy' && 'Privacy Policy'}
                  {activeInfoModal === 'terms' && 'Terms & Conditions'}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="text-[#74685E] hover:text-[#282522] p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-[#74685E] leading-relaxed">
              
              {activeInfoModal === 'faq' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-[#FAF6EE]/50 rounded-lg border border-[#EADBCA]">
                    <h5 className="font-semibold text-[#282522] mb-1">
                      Are saree blouses stitched or unstitched?
                    </h5>
                    <p>
                      Our sarees come with an unstitched 0.8m matching fabric blouse piece attached to the end of the drape. It can be tailored according to your custom style and measurements.
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#FAF6EE]/50 rounded-lg border border-[#EADBCA]">
                    <h5 className="font-semibold text-[#282522] mb-1">
                      Are kids' traditional clothes comfortable for long events?
                    </h5>
                    <p>
                      Yes! All BVS kids’ ethnic sets feature soft 100% cotton inner linings and itch-free seams so children stay comfortable during poojas and wedding celebrations.
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#FAF6EE]/50 rounded-lg border border-[#EADBCA]">
                    <h5 className="font-semibold text-[#282522] mb-1">
                      How should handloom silk sarees and kurtas be cared for?
                    </h5>
                    <p>
                      We recommend gentle dry cleaning for zari and silk garments. Store in breathable muslin/cotton bags away from direct moisture to preserve gold luster.
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#FAF6EE]/50 rounded-lg border border-[#EADBCA]">
                    <h5 className="font-semibold text-[#282522] mb-1">
                      Can I request size guidance before ordering?
                    </h5>
                    <p>
                      Absolutely. Our team provides dedicated size and fabric matching consultations. You can reach out directly via our customer support channels.
                    </p>
                  </div>
                </div>
              )}

              {activeInfoModal === 'tracking' && (
                <div className="space-y-4">
                  <p className="text-xs text-[#74685E]">
                    Enter your Order ID, WhatsApp inquiry number, or mobile number to track the dispatch and delivery status of your handloom order.
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const id = trackingInput.trim() || 'INQ-' + Math.floor(100000 + Math.random() * 900000);
                      const text = `Hello BVS Fashions! I would like to check the tracking status of my order / inquiry (Ref: ${id}).`;
                      window.open(`https://wa.me/918639778188?text=${encodeURIComponent(text)}`, '_blank');
                      closeModal();
                    }}
                    className="space-y-3"
                  >
                    <div>
                      <label className="block text-[11px] font-semibold text-[#282522] uppercase tracking-wider mb-1.5">
                        Order ID or Phone Number
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. BVS-2026-8812 or 8639778188"
                        value={trackingInput}
                        onChange={(e) => setTrackingInput(e.target.value)}
                        className="w-full bg-[#FAF6EE] border border-[#EADBCA] text-[#282522] placeholder-[#74685E]/70 px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-[#702C38] focus:ring-1 focus:ring-[#702C38]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#702C38] hover:bg-[#561E28] text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Track Status via WhatsApp</span>
                    </button>
                  </form>
                  <div className="p-3.5 bg-[#FAF6EE]/70 rounded-lg border border-[#EADBCA] text-[11px] text-[#74685E] space-y-1.5">
                    <p className="font-semibold text-[#282522]">Handloom Dispatch Timeline</p>
                    <p>All garments are carefully inspected and dispatched within 3-7 business days across India.</p>
                    <p>
                      Direct WhatsApp Helpline:{' '}
                      <a
                        href="https://wa.me/918639778188"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#702C38] font-semibold underline"
                      >
                        +91 8639778188
                      </a>
                    </p>
                  </div>
                </div>
              )}

              {activeInfoModal === 'shipping' && (
                <div className="space-y-3">
                  <p className="font-semibold text-[#282522]">
                    [Client Specification Required: Shipping Timelines & Charges]
                  </p>
                  <p>
                    BVS Fashions provides traditional clothing distribution across India. Actual courier partners, dispatch timelines (typically 3-7 business days for ready stock), and delivery costs will be configured once the merchant establishes shipping partner agreements.
                  </p>
                  <p className="italic text-[11px] bg-[#FAF6EE] p-3 rounded border border-[#EADBCA]">
                    Note: Per project guidelines, no guaranteed delivery dates or free shipping claims are made in this demo without confirmed merchant policy.
                  </p>
                </div>
              )}

              {activeInfoModal === 'returns' && (
                <div className="space-y-3">
                  <p className="font-semibold text-[#282522]">
                    [Client Specification Required: Returns & Exchange Window]
                  </p>
                  <p>
                    Standard Indian ethnic wear policy allows exchanges for sizing discrepancies within a confirmed window of receipt, provided the garment is unused, unstitched (for sarees/dress material), and includes original tags.
                  </p>
                  <p className="italic text-[11px] bg-[#FAF6EE] p-3 rounded border border-[#EADBCA]">
                    Note: Exact return eligibility, reverse pickup availability, and exchange procedures will be finalized with the client before go-live.
                  </p>
                </div>
              )}

              {activeInfoModal === 'privacy' && (
                <div className="space-y-3">
                  <p className="font-semibold text-[#282522]">Privacy Policy Placeholder</p>
                  <p>
                    BVS Fashions values customer privacy. Contact details, measurement records, and order history are treated with strict confidentiality and are never sold to external third parties.
                  </p>
                  <p>
                    In this frontend preview, all cart and wishlist data remains strictly on your local browser.
                  </p>
                </div>
              )}

              {activeInfoModal === 'terms' && (
                <div className="space-y-3">
                  <p className="font-semibold text-[#282522]">Terms & Conditions Placeholder</p>
                  <p>
                    All product images, descriptions, and catalog items displayed on BVS Fashions website represent authentic traditional handloom and ethnic fashion styling. Subtle variations in handwoven weaves and hand-dyed tones are natural hallmarks of authentic Indian craftsmanship.
                  </p>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FAF6EE] border-t border-[#EADBCA] text-right">
              <button
                onClick={closeModal}
                className="px-5 py-2 bg-[#702C38] text-white text-xs font-semibold rounded-md hover:bg-[#561E28] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
