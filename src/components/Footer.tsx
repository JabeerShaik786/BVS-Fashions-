import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/products';
import type { CategoryId } from '../types';
import { 
  Mail, 
  Send, 
  MapPin, 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setSelectedCategory, setSearchQuery, setActiveInfoModal, setViewMode } = useShop();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [newsletterFeedback, setNewsletterFeedback] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(newsletterEmail.trim())) {
      setNewsletterStatus('error');
      setNewsletterFeedback('Please enter a valid email address.');
      return;
    }

    setNewsletterStatus('success');
    setNewsletterFeedback(
      'Demo Notice: Thank you! In this frontend demonstration, newsletter emails are not stored on an external service.'
    );
    setNewsletterEmail('');
  };

  const handleCategoryClick = (catId: CategoryId) => {
    setSelectedCategory(catId);
    setSearchQuery('');
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#282522] text-[#F7F0E5] pt-16 pb-12 border-t-4 border-[#D4B16A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand Wordmark & Narrative (4 cols) */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-[#702C38] border border-[#D4B16A] flex items-center justify-center text-[#F7F0E5] font-serif font-bold text-sm">
                BVS
              </div>
              <span className="font-serif text-2xl font-bold tracking-[0.16em] text-[#F7F0E5]">
                BVS FASHIONS
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#F7F0E5]/70 leading-relaxed mb-6">
              Authentic Indian traditional wear designed for real families. Bringing together sarees, kurtas, and joyful celebration attire across generations at welcoming, honest prices.
            </p>

            {/* Social Media Link Placeholders */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-[#D4B16A] font-semibold mr-2">
                Connect:
              </span>
              {['Instagram', 'Facebook', 'Pinterest', 'YouTube'].map((platform) => (
                <span
                  key={platform}
                  className="px-2.5 py-1 text-[11px] rounded bg-white/5 border border-white/10 text-[#F7F0E5]/70 hover:text-[#D4B16A] hover:border-[#D4B16A]/50 transition-colors cursor-pointer"
                  title={`[Placeholder] ${platform} official account`}
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>

          {/* Col 2: Shop Categories (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#D4B16A] mb-4">
              Shop Categories
            </h4>
            <ul className="space-y-2 text-xs text-[#F7F0E5]/70">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(cat.id as CategoryId)}
                    className="hover:text-white hover:underline transition-colors text-left"
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#D4B16A] mb-4">
              Customer Care & Policies
            </h4>
            <ul className="space-y-2 text-xs text-[#F7F0E5]/70">
              <li>
                <button
                  onClick={() => setActiveInfoModal('faq')}
                  className="hover:text-[#D4B16A] transition-colors flex items-center gap-1.5"
                >
                  <span>Frequently Asked Questions (FAQ)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveInfoModal('shipping')}
                  className="hover:text-[#D4B16A] transition-colors"
                >
                  Shipping & Delivery Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveInfoModal('returns')}
                  className="hover:text-[#D4B16A] transition-colors"
                >
                  Returns & Exchange Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveInfoModal('privacy')}
                  className="hover:text-[#D4B16A] transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveInfoModal('terms')}
                  className="hover:text-[#D4B16A] transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
              <li className="pt-2 border-t border-white/10">
                <button
                  onClick={() => setViewMode('admin')}
                  className="text-[#D4B16A] hover:underline font-semibold transition-colors flex items-center gap-1"
                >
                  <span>Store Owner Admin Portal →</span>
                </button>
              </li>
            </ul>

            {/* Contact Information Placeholders (strictly non-invented per instruction) */}
            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-[#F7F0E5]/60 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4B16A] shrink-0" />
                <span>Store Location: [Business Address Placeholder]</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D4B16A] shrink-0" />
                <span>Contact Number: [Official Phone Placeholder]</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D4B16A] shrink-0" />
                <span>Email: [Support Email Placeholder]</span>
              </div>
            </div>
          </div>

          {/* Col 4: Newsletter Subscription (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#D4B16A] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D4B16A]" />
              <span>Festive Newsletter</span>
            </h4>
            <p className="text-xs text-[#F7F0E5]/70 mb-4 leading-relaxed">
              Receive updates on seasonal handloom weaves, festive catalogs, and family collection launches.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value);
                    if (newsletterStatus !== 'idle') setNewsletterStatus('idle');
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-md py-2.5 pl-3 pr-10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#D4B16A]"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 p-1.5 bg-[#702C38] hover:bg-[#8E3947] text-[#D4B16A] rounded transition-colors"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Feedback Alert */}
              {newsletterStatus === 'error' && (
                <div className="flex items-start gap-1.5 text-[11px] text-red-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{newsletterFeedback}</span>
                </div>
              )}
              {newsletterStatus === 'success' && (
                <div className="flex items-start gap-1.5 text-[11px] text-[#D4B16A] bg-white/5 p-2 rounded border border-[#D4B16A]/30">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{newsletterFeedback}</span>
                </div>
              )}
            </form>

            <p className="text-[10px] text-[#F7F0E5]/50 mt-3 italic">
              * Frontend demonstration. Submitting does not trigger real emails.
            </p>
          </div>

        </div>

        {/* Bottom Copyright & Brand Statement */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F7F0E5]/50 gap-4">
          <p>© 2026 BVS Fashions. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Handcrafted with pride for Indian Celebrations & Families.
          </p>
        </div>

      </div>
    </footer>
  );
};
