import React, { useState } from 'react';
import { adminApi, isCurrentHostLocal } from './adminApi';
import { isClientSupabaseConfigured } from '../supabase';
import { Lock, Mail, ArrowRight, AlertCircle, ArrowLeft, ShieldCheck, HelpCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToStore }) => {
  // Security fix: No hardcoded credentials prefilled in state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await adminApi.login(email.trim(), password);
      onLoginSuccess();
    } catch (err: any) {
      // Diagnostic error handling: translate cryptic "Load failed" / "Failed to fetch"
      let errorMessage = err?.message || 'Login failed. Please verify your credentials.';

      if (errorMessage === 'Load failed' || errorMessage === 'Failed to fetch') {
        if (!isCurrentHostLocal()) {
          errorMessage =
            'Unable to reach administration server. This static deployment requires either a configured live backend (VITE_API_BASE_URL) or a connected Supabase project (VITE_SUPABASE_URL).';
        } else {
          errorMessage =
            'Unable to connect to the local API server on port 3001. Please run `npm run server` to start the backend.';
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isLocal = isCurrentHostLocal();

  return (
    <div className="min-h-screen bg-[#FAF6EE] flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* 1. Branding Header with compact, responsive vertical spacing */}
      <div className="w-full max-w-md mx-auto text-center mb-4 sm:mb-7">
        {/* Return Button */}
        <button
          onClick={onBackToStore}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#702C38] hover:text-[#561E28] mb-3 sm:mb-5 transition-colors py-1.5 px-3 rounded-full bg-white/70 hover:bg-white border border-[#EADBCA] shadow-2xs"
          aria-label="Return to Public Website"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Website</span>
        </button>

        {/* Brand Logo & Wordmark - strictly fitted for 320px+ mobile screens */}
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#702C38] border border-[#D4B16A] flex items-center justify-center text-[#F7F0E5] font-serif font-bold text-xs sm:text-sm shadow-sm shrink-0">
            BVS
          </div>
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.12em] sm:tracking-[0.16em] text-[#702C38] leading-tight truncate">
            BVS FASHIONS
          </span>
        </div>
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#74685E] font-medium">
          Management Portal
        </p>
      </div>

      {/* 2. Login Form Card */}
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white py-6 px-4 sm:py-8 sm:px-8 shadow-xl border border-[#EADBCA] rounded-2xl w-full">
          
          <div className="mb-5 pb-4 border-b border-[#EADBCA] text-center">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#282522]">
              Administrator Sign In
            </h2>
            <p className="text-xs text-[#74685E] mt-1 leading-relaxed">
              Manage your traditional clothing catalogue, inventory, and publishing.
            </p>
          </div>

          {/* Error Alert Box with proper wrapping */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5 leading-relaxed break-words animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-rose-900">Sign-in Notice</p>
                <p className="mt-0.5 text-rose-700">{error}</p>
                
                <button
                  type="button"
                  onClick={() => setShowDiagnostics(!showDiagnostics)}
                  className="mt-2 text-[11px] font-semibold text-rose-900 underline flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>{showDiagnostics ? 'Hide System Diagnostics' : 'View Connection Diagnostics'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Connection Diagnostics (collapsible, safe) */}
          {showDiagnostics && (
            <div className="mb-5 p-3 rounded-lg bg-[#FAF6EE] border border-[#EADBCA] text-[11px] text-[#74685E] space-y-1.5 leading-normal">
              <p className="font-semibold text-[#282522]">Configuration Diagnostics:</p>
              <p>• <strong>Host:</strong> {window.location.origin}</p>
              <p>• <strong>Environment:</strong> {isLocal ? 'Local Development' : 'Production / Cloud Hosting'}</p>
              <p>• <strong>Supabase Client:</strong> {isClientSupabaseConfigured ? 'Connected (Active)' : 'Not Connected (Using API Gateway)'}</p>
              <p className="text-[10px] text-gray-500 pt-1">
                To connect Supabase, configure <code className="bg-white px-1 border border-gray-200">VITE_SUPABASE_URL</code> and <code className="bg-white px-1 border border-gray-200">VITE_SUPABASE_ANON_KEY</code> in repository settings.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="admin-email"
                className="block text-xs font-semibold uppercase tracking-wider text-[#282522] mb-1.5"
              >
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bvsfashions.com"
                  className="w-full bg-[#FAF6EE]/50 border border-[#EADBCA] rounded-lg px-3.5 py-3 pl-10 text-base sm:text-xs text-[#282522] placeholder-gray-400 focus:outline-none focus:border-[#702C38] focus:ring-1 focus:ring-[#702C38] min-h-[44px] transition-colors"
                />
                <Mail className="w-4 h-4 text-[#74685E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label 
                htmlFor="admin-password"
                className="block text-xs font-semibold uppercase tracking-wider text-[#282522] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your admin password"
                  className="w-full bg-[#FAF6EE]/50 border border-[#EADBCA] rounded-lg px-3.5 py-3 pl-10 text-base sm:text-xs text-[#282522] placeholder-gray-400 focus:outline-none focus:border-[#702C38] focus:ring-1 focus:ring-[#702C38] min-h-[44px] transition-colors"
                />
                <Lock className="w-4 h-4 text-[#74685E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-[#702C38] hover:bg-[#561E28] disabled:opacity-60 text-white text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </form>

          {/* Security Assurance Footer (Replaced insecure hardcoded credentials box) */}
          <div className="mt-6 pt-4 border-t border-[#EADBCA] text-center text-xs text-[#74685E]">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#702C38]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4B16A]" />
              <span>Authorized Store Personnel Only</span>
            </div>
            <p className="mt-1 text-[10px] text-[#74685E]/80">
              End-to-end encrypted session. Access is strictly audited.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
